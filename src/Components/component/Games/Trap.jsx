import React, { useContext, useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { casinoIndividualResult } from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import Header from "../common/Header";
import Timer from "../common/Timer";
import cardsData from "../../assets/cards/data";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { calculateCasinoRate } from "../../utils/casinoRate";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import PlaceBet from "../common/PlaceBet";

const Trap = ({
    myCurrentCasinoBets,
    refetchCurrentBets,
    refetchCasinoBetHistory,
    CasinoBetHistory,
    casinoSpecialPermission,
    casinoData,
}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    // Decode token safely
    const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

    const location = useLocation();
    const item = location.state?.item;
    const queryClient = useQueryClient();
    const [Countdown, setCountdown] = useState(0);

    const [cardData, setCardData] = useState([]);
    const [individualResultData, setIndividualResultData] = useState(null);
    const [oddsData, setOddsData] = useState([]);
    const {
        placeBet,
        setPlaceBet,
        betData,
        setBetData,
        latestBetData,
        setLatestBetData,
    } = useContext(PlaceBetUseContext);
    const latestBetDataRef = useRef(betData);

    const isFixed = useScrollFixed();
    const [bet, setBet] = useState(false);

    // Individual bet history
    const filteredBetHistory = useFilterIndividualBetHistory(
        CasinoBetHistory,
        individualResultData
    );

    const [resultId, setResultId] = useState(false);

    const {
        isLoading: isLoadingIndividualResult,
        data: IndividualResult,
        isSuccess: isSuccessIndividualResult,
        refetch: refetchIndividualResult,
    } = useQuery(
        ["casinoIndividualResult", { cookies, resultId }],
        () => casinoIndividualResult(cookies, resultId),
        {
            enabled: false,
        }
    );

    // Authentication error handling
    if (
        casinoData?.error === "Token has expired" ||
        casinoData?.error === "Invalid token" ||
        IndividualResult?.error === "Token has expired" ||
        IndividualResult?.error === "Invalid token"
    ) {
        signout(userId, removeCookie, () => {
            navigate("/sign-in");
            return null;
        });
    }

    // Process socket data
    useEffect(() => {
        if (casinoData && casinoData.data && casinoData.data.data?.data?.t1) {

            const autotime = parseInt(casinoData.data.data.data.t1?.[0]?.autotime || "8");
            setCountdown(autotime);
            //console.log("auto time ",autotime)
            setOddsData(casinoData.data.data.data.t2 || []);
            setCardData(casinoData.data.data.data.t1);
        } else {
            setOddsData(getFallbackOddsData());
            setCountdown(480);
        }
    }, [casinoData]);

    // Fallback odds data
    const getFallbackOddsData = () => {
        return [
            {
                mid: "157251113115409",
                nat: "Player A",
                sid: "1",
                b1: "1.95",
                gstatus: "0",
                min: 100,
                max: 200000,
            },
            {
                mid: "157251113115409",
                nat: "Player B",
                sid: "2",
                b1: "1.95",
                gstatus: "0",
                min: 100,
                max: 200000,
            },
        ];
    };

    const handleCountdownEnd = () => {
        queryClient.invalidateQueries([
            "casinoGameOdds",
            { cookies, slug: item?.slug },
        ]);
        refetchCurrentBets();
        refetchCasinoBetHistory();
    };

    const { remainingTime, endTime } = useCountdown(
        Countdown,
        handleCountdownEnd
    );

    // Auto-refresh logic
    if (
        remainingTime == 35 ||
        remainingTime == 30 ||
        remainingTime == 20 ||
        remainingTime == 25 ||
        remainingTime == 15 ||
        remainingTime == 10
    ) {
        queryClient.invalidateQueries([
            "casinoGameOdds",
            { cookies, slug: item?.slug },
        ]);
        refetchCurrentBets();
        refetchCasinoBetHistory();
    }

    const getResultText = (result) => {
        if (!result) return "0";
        return result; // For your data, result is either "1" or "2"
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle odds suspension
useEffect(() => {
    if (latestBetData && oddsData.length > 0) {
        const currentOdds = oddsData.find(
            (data) => data.sid === latestBetData.sid
        );

        if (
            currentOdds &&
            currentOdds.b1 !== latestBetDataRef.current.matchOdd &&
            betData.oddType === "casino_odds"
        ) {
            if (remainingTime <= 4) {
                setLatestBetData((prev) => ({
                    ...prev,
                    matchOdd: "SUSPENDED",
                }));
            }
            if (latestBetData.mid !== currentOdds.mid) {
                setPlaceBet(false);
            }
        }
    }
}, [remainingTime, oddsData]);

return (
<>
<div className="block md:hidden">
<Header
gameName={item?.gameName}
min={oddsData?.[0]?.min || 100}
max={oddsData?.[0]?.max || 200000}
mid={oddsData?.[0]?.mid}
/>
</div>
<HeaderTab
bet={bet}
setBet={setBet}
mid={oddsData?.[0]?.mid}
myCurrentCasinoBets={myCurrentCasinoBets}
/>
{!bet && (
<div className="flex relative w-full h-full gap-1">
<div className="center-container">
<div className="w-full relative">
<div className="hidden md:block">
<Header
gameName={item?.gameName}
min={oddsData?.[0]?.min || 100}
max={oddsData?.[0]?.max || 200000}
mid={oddsData?.[0]?.mid}
/>
</div>
<div className="casino-video">
<Frame item={item} />

{/* Display Cards if available */}
{cardData.length > 0 && cardData[0] && (
  <div className="absolute top-0 left-1 flex gap-2">

    {/* Calculate Values */}
    {(() => {
      const getCardValue = (code) => {
        if (!code) return 0;
        if (code === "1") return 0; // empty marker in your data

        // rank is everything except last 2 chars (suit like HH, DD, SS, CC)
        const rank = code.slice(0, -2);

        // exact mapping you provided:
        if (rank === "A") return 1;
        if (rank === "J") return 11;
        if (rank === "Q") return 12;
        if (rank === "K") return 13;

        // numeric (2..10)
        if (/^\d+$/.test(rank)) return Number(rank);

        // safety fallback
        return 0;
      };

      const A_cards = Object.keys(cardData[0])
        .filter((key) => key.startsWith("C") && Number(key.substring(1)) % 2 !== 0)
        .sort((a, b) => Number(a.substring(1)) - Number(b.substring(1)))
        .map((key) => cardData[0][key])
        .filter((c) => c && c !== "1");

      const B_cards = Object.keys(cardData[0])
        .filter((key) => key.startsWith("C") && Number(key.substring(1)) % 2 === 0)
        .sort((a, b) => Number(a.substring(1)) - Number(b.substring(1)))
        .map((key) => cardData[0][key])
        .filter((c) => c && c !== "1");

      const A_total = A_cards.reduce((sum, code) => sum + getCardValue(code), 0);
      const B_total = B_cards.reduce((sum, code) => sum + getCardValue(code), 0);

      return (
        <>
          {/* COLUMN A */}
          <div className="flex flex-col items-center">
            <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
              A
            </h4>
            <h4 className=" text-xs md:text-sm my-0 font-semibold uppercase" style={{color:"#fdcf13"}}>
              {A_total}
            </h4>

            <div className="flex flex-col gap-1 mt-1">
              {A_cards.map((cardCode, index) => {
                const card = cardsData.find((c) => c.code === cardCode);
                return (
                  <img
                    key={`A-${cardCode}-${index}`}
                    src={card?.image}
                    alt={card?.name}
                    className="h-[24px] md:h-[34px] rounded-sm"
                  />
                );
              })}
            </div>
          </div>

          {/* COLUMN B */}
          <div className="flex flex-col items-center">
            <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
              B
            </h4>
            <h4 className=" text-xs md:text-sm my-0 font-semibold uppercase"style={{color:"#fdcf13"}}>
              {B_total}
            </h4>

            <div className="flex flex-col gap-1 mt-1">
              {B_cards.map((cardCode, index) => {
                const card = cardsData.find((c) => c.code === cardCode);
                return (
                  <img
                    key={`B-${cardCode}-${index}`}
                    src={card?.image}
                    alt={card?.name}
                    className="h-[24px] md:h-[34px] rounded-sm"
                  />
                );
              })}
            </div>
          </div>
        </>
      );
    })()}
  </div>
)}








{/* Timer */}
<div className="absolute bottom-2 right-2">
<Timer time={endTime} />
</div>
</div>
</div>

{/* Casino Table Design - Exactly as per your HTML structure */}
<div className=" onecard1day casino-detail">
<div className="casino-table">
<div className="casino-table-box">
<div className="casino-table-left-box">
<div className="casino-table-body">
{oddsData
.filter((item) => item.sid === "1")
.map((item, index) => (
<div className="casino-table-row" key={index}>
<div className="casino-nation-detail">
<div className="casino-nation-name">Player A</div>
<div className="casino-nation-book text-success" />
</div>

<div
className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus == "SUSPENDED"
        ? "suspended-box"
        : ""
    }`}
>
<span className="casino-odds">
    {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
        <span className="casino-odds">0</span>
    ) : (
        <span
            className="casino-odds cursor-pointer hover:text-blue-700"
            onClick={() => {
                setPlaceBet(true);
                const newBetData = {
                    betName: item?.nat + " Back ",
                    boxColor: "bg-[#B2D6F0]",
                    matchOdd: calculateCasinoRate(item?.b1),
                    stake: 0,
                    mid: item?.mid,
                    sid: item?.sid,
                    oddType: "casino_odds",
                    oddCategory: "Back",
                };
                setBetData(newBetData);
                setLatestBetData(newBetData);
            }}
        >
            {calculateCasinoRate(item.b1)}
        </span>
    )}
</span>
</div>

<div
className={`casino-odds-box lay ${item.gstatus === "SUSPENDED" ? "suspended-box" : ""
    }`}
>
{item.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
    <span className="casino-odds">{"0"}</span>
) : (
    <span
        className="casino-odds cursor-pointer hover:text-blue-700"
        onClick={() => {
            setPlaceBet(true);
            const newBetData = {
                betName: item?.nat + " Lay ",
                boxColor: "bg-[#faa9ba]",
                matchOdd: calculateCasinoRate(item?.l1),
                stake: 0,
                mid: item?.mid,
                sid: item?.sid,
                oddType: "casino_odds",
                oddCategory: "Lay",
            };
            setBetData(newBetData);
            setLatestBetData(newBetData);
        }}
    >
        {calculateCasinoRate(item.l1)}
    </span>
)}
</div>
</div>
))}


</div>
</div>
<div className="casino-table-box-divider" />
<div className="casino-table-right-box">
<div className="casino-table-body">
{oddsData
.filter((item) => item.sid === "2")
.map((item, index) => (
<div className="casino-table-row" key={index}>
<div className="casino-nation-detail">
<div className="casino-nation-name">Player B</div>
<div className="casino-nation-book text-success" />
</div>

<div
className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus == "SUSPENDED"
        ? "suspended-box"
        : ""
    }`}
>
<span className="casino-odds">
    {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
        <span className="casino-odds">0</span>
    ) : (
        <span
            className="casino-odds cursor-pointer hover:text-blue-700"
            onClick={() => {
                setPlaceBet(true);
                const newBetData = {
                    betName: item?.nat + " Back ",
                    boxColor: "bg-[#B2D6F0]",
                    matchOdd: calculateCasinoRate(item?.b1),
                    stake: 0,
                    mid: item?.mid,
                    sid: item?.sid,
                    oddType: "casino_odds",
                    oddCategory: "Back",
                };
                setBetData(newBetData);
                setLatestBetData(newBetData);
            }}
        >
            {calculateCasinoRate(item.b1)}
        </span>
    )}
</span>
</div>

<div
className={`casino-odds-box lay ${item.gstatus === "SUSPENDED" ? "suspended-box" : ""
    }`}
>
{item.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
    <span className="casino-odds">{"0"}</span>
) : (
    <span
        className="casino-odds cursor-pointer hover:text-blue-700"
        onClick={() => {
            setPlaceBet(true);
            const newBetData = {
                betName:  item?.nat + " Lay ",
                boxColor: "bg-[#faa9ba]",
                matchOdd: calculateCasinoRate(item?.l1),
                stake: 0,
                mid: item?.mid,
                sid: item?.sid,
                oddType: "casino_odds",
                oddCategory: "Lay",
            };
            setBetData(newBetData);
            setLatestBetData(newBetData);
        }}
    >
        {calculateCasinoRate(item.l1)}
    </span>
)}
</div>
</div>
))}
</div>
</div>
</div>
<div className="casino-table-box mt-3 sevenupbox">
{(() => {
const upItem = oddsData.find((item) => item.sid === "3");
const downItem = oddsData.find((item) => item.sid === "4");

if (!upItem && !downItem) return null;

const isUpSuspended = remainingTime <= 3 || upItem?.gstatus === "SUSPENDED";
const isDownSuspended = remainingTime <= 3 || downItem?.gstatus === "SUSPENDED";

return (
<div className="casino-table-left-box">
<h4 className="d-md-none mb-2">{upItem?.nat || downItem?.nat}</h4>

<div className="seven-up-down-box">

{/* UP BOX */}
<div className={`up-box ${isUpSuspended ? "suspended-box" : ""}`}>
<div className="up-down-book" />

{isUpSuspended ? (
<div className="text-end">
    <div className="up-down-odds">{calculateCasinoRate(upItem?.b1)}</div>
    <span>High</span>
</div>
) : (
<div className="text-end">
    <span
        className="casino-odds cursor-pointer hover:text-blue-700"
        onClick={() => {
            setPlaceBet(true);
            const newBetData = {
                betName: upItem?.nat + "High",
                boxColor: "bg-[#B2D6F0]",
                matchOdd: calculateCasinoRate(upItem?.b1),
                stake: 0,
                mid: upItem?.mid,
                sid: upItem?.sid,
                oddType: "casino_odds",
                oddCategory: "Back",
            };
            setBetData(newBetData);
            setLatestBetData(newBetData);
        }}
    >
        {calculateCasinoRate(upItem?.b1)}
    </span>
    <span className="block text-[15px] leading-3">High</span>
</div>
)}
</div>

{/* DOWN BOX */}
<div className={`down-box ${isDownSuspended ? "suspended-box" : ""}`}>
<div className="up-down-book" />

{isDownSuspended ? (
<div className="text-start">
    <div className="up-down-odds">{calculateCasinoRate(downItem?.b1)}</div>
    <span>Low</span>
</div>
) : (
<div className="text-start">
    <span
        className="casino-odds cursor-pointer hover:text-blue-700"
        onClick={() => {
            setPlaceBet(true);
            const newBetData = {
                betName: downItem?.nat  + "Low",
                boxColor: "bg-[#F3C9D0]",
                matchOdd: calculateCasinoRate(downItem?.b1),
                stake: 0,
                mid: downItem?.mid,
                sid: downItem?.sid,
                oddType: "casino_odds",
                oddCategory: "Lay",
            };
            setBetData(newBetData);
            setLatestBetData(newBetData);
        }}
    >
        {calculateCasinoRate(downItem?.b1)}
    </span>
    <span className="block text-[15px] leading-3">Low</span>
</div>
)}
</div>

{/* center image */}
<div className="seven-box">
<img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/trape-seven.png" />
</div>
</div>
</div>
);
})()}

<div className="casino-table-right-box">
<div className="casino-table-body">
{oddsData
.filter((item) => item.subtype === "jqk")
.map((item, index) => (
<div className="casino-table-row" key={index}>
<div className="casino-nation-detail">
<div className="casino-nation-name">Player B</div>
<div className="casino-nation-book text-success" />
</div>

<div
className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus == "SUSPENDED"
        ? "suspended-box"
        : ""
    }`}
>
<span className="casino-odds">
    {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
        <span className="casino-odds">0</span>
    ) : (
        <span
            className="casino-odds cursor-pointer hover:text-blue-700"
            onClick={() => {
                setPlaceBet(true);
                const newBetData = {
                    betName: item?.nat + " Back ",
                    boxColor: "bg-[#B2D6F0]",
                    matchOdd: calculateCasinoRate(item?.b1),
                    stake: 0,
                    mid: item?.mid,
                    sid: item?.sid,
                    oddType: "casino_odds",
                    oddCategory: "Back",
                };
                setBetData(newBetData);
                setLatestBetData(newBetData);
            }}
        >
            {calculateCasinoRate(item.b1)}
        </span>
    )}
</span>
</div>

<div
className={`casino-odds-box lay ${item.gstatus === "SUSPENDED" ? "suspended-box" : ""
    }`}
>
{item.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
    <span className="casino-odds">{"0"}</span>
) : (
    <span
        className="casino-odds cursor-pointer hover:text-blue-700"
        onClick={() => {
            setPlaceBet(true);
            const newBetData = {
                betName:  item?.nat + " Lay ",
                boxColor: "bg-[#faa9ba]",
                matchOdd: calculateCasinoRate(item?.l1),
                stake: 0,
                mid: item?.mid,
                sid: item?.sid,
                oddType: "casino_odds",
                oddCategory: "Lay",
            };
            setBetData(newBetData);
            setLatestBetData(newBetData);
        }}
    >
        {calculateCasinoRate(item.l1)}
    </span>
)}
</div>
</div>
))}
</div>
</div>






</div>
</div>
</div>


{/* Results Section */}
<div className="result bg-secondaryBackground py-1 mb-1 mt-1">
<div className="flex text-md justify-between px-2 text-white">
<p>Last Result</p>
<Link
to="/reports/casino-results"
className="cursor-pointer text-md hover:underline"
state={{
casinoGameSlug: item?.slug,
}}
>
View All
</Link>
</div>
</div>

{/* Result Modal */}
{isModalOpen && (
<div className="fixed inset-0 flex items-center justify-center z-50">

{/* BACKDROP */}
<div
className="absolute inset-0 bg-black bg-opacity-50"
onClick={() => {
setIsModalOpen(false);
setIndividualResultData(undefined);
}}
></div>

{/* MODAL */}
<div className="modal-dialog modal-xl max-w-6xl w-full relative z-50 mx-2">

<div className="modal-content bg-white rounded shadow-lg overflow-hidden">

{/* HEADER */}
<div className="modal-header flex justify-between items-center p-3 border-b">
<div className="modal-title h4 font-bold">
{item.gameName}
</div>

<button
type="button"
className="btn-close text-1xl"
onClick={() => {
setIsModalOpen(false);
setIndividualResultData(undefined);
}}
>

</button>
</div>

{/* BODY */}
<div className="modal-body p-4">

{individualResultData ? (
console.log("individual result data ", individualResultData),
<div className="casino-result-modal">

{/* ROUND INFO */}
<div className="casino-result-round-id flex justify-between text-sm font-semibold">
<span>
<b>Round Id:</b> {individualResultData?.mid}
</span>

<span>
<b>Match Time:</b> {individualResultData?.mtime}
</span>
</div>

{/* PLAYER A / B CARD SECTION */}
{/* PLAYER A / B CARD SECTION */}
<div className="grid grid-cols-2 gap-4 mt-4">

  {(() => {
    // Convert card code → value
    const getCardValue = (code) => {
      if (!code || code === "1") return 0;

      const rank = code.slice(0, -2); // Strip suit (HH, CC, DD, SS)

      if (rank === "A") return 1;
      if (rank === "J") return 11;
      if (rank === "Q") return 12;
      if (rank === "K") return 13;

      return Number(rank) || 0;
    };

    const allCards = individualResultData?.cards?.split(",") || [];

    // Filter A & B cards
    const A_cards = allCards.filter((_, i) => i % 2 === 0).filter((c) => c !== "1");
    const B_cards = allCards.filter((_, i) => i % 2 !== 0).filter((c) => c !== "1");

    // Calculate totals
    const A_total = A_cards.reduce((sum, card) => sum + getCardValue(card), 0);
    const B_total = B_cards.reduce((sum, card) => sum + getCardValue(card), 0);

    return (
      <>
        {/* PLAYER A */}
        <div className="text-center">
          <h4 className="result-title font-bold text-lg">
            Player A ({A_total})
          </h4>

          <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
            {A_cards.map((code, i) => {
              const img = cardsData.find((v) => v.code === code)?.image;
              return img ? (
                <img key={i} className="h-[54px]" src={img} />
              ) : null;
            })}

            {individualResultData?.win == "1" && (
              <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
                <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
              </div>
            )}
          </div>
        </div>

        {/* PLAYER B */}
        <div className="text-center">
          <h4 className="result-title font-bold text-lg">
            Player B ({B_total})
          </h4>

          <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
            {B_cards.map((code, i) => {
              const img = cardsData.find((v) => v.code === code)?.image;
              return img ? (
                <img key={i} className="h-[54px]" src={img} />
              ) : null;
            })}

            {individualResultData?.win == "2" && (
              <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
                <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
              </div>
            )}
          </div>
        </div>
      </>
    );
  })()}
</div>


{/* DESCRIPTION BOX (Winner, Under/Over etc) */}
{/* DESCRIPTION BOX DYNAMIC */}
{/* DESCRIPTION BOX DYNAMIC */}
{/* DESCRIPTION BOX - DYNAMIC USING newdesc */}
{/* DESCRIPTION BOX - DYNAMIC USING newdesc */}
<div className="row mt-2 justify-content-center">
  <div className="col-md-6">
    <div className="casino-result-desc">

      {(() => {
        const titles = ["Main", "Seven", "Picture Card"];

        // newdesc ko split karna (default = ["","",""] if not found)
        const parts = individualResultData?.newdesc
          ? individualResultData.newdesc.split("#")
          : ["-", "-", "-"];

        return titles.map((title, index) => (
          <div key={index} className="casino-result-desc-item">
            <div>{title}</div>
            <div>{parts[index] || "-"}</div>
          </div>
        ));
      })()}

    </div>
  </div>
</div>





{/* BET HISTORY TABLE */}
{!filteredBetHistory.length <= 0 && (
<div className="mt-4">
<IndividualBetHistoryTable data={filteredBetHistory} />
</div>
)}

</div>
) : (
<div className="w-full h-40 flex justify-center items-center">
<i className="fa fa-spinner fa-spin text-3xl"></i>
</div>
)}

</div>
</div>

</div>
</div>
)}

{/* Result Chips */}
<div className="casino-last-results">
{casinoData?.data?.data?.result ? (
casinoData?.data?.data?.result?.map((item, index) => (
<span
key={index}
onClick={(e) => {
e.preventDefault();
setIsModalOpen(true);
casinoIndividualResult(cookies, item.mid).then((res) => {
setIndividualResultData(res?.data?.data?.[0]);
});
}}
className={`result cursor-pointer ${item.win === "1" ? "result-a" : "result-b"
}`}
>
{item.win === "1" ? "A" : "B"}
</span>

))
) : (
<>No Results Found</>
)}
</div>
</div>

{/* Bet Panel */}
<div className="sidebar right-sidebar casino-right-sidebar sticky overflow-hidden">
<div className="sidebar-box my-bet-container">
<div className={`${!placeBet ? "block" : "hidden"}`}>
<h1 className="px-2 py-1 bg-secondaryBackground text-white">
Place Bet
</h1>
</div>
<div className={`${placeBet ? "block" : "hidden"}`}>
<CasinoBetPopup
gameType="casino"
time={remainingTime}
gameName={item?.slug}
item={item}
refetchCurrentBets={refetchCurrentBets}
odds={oddsData}
myCurrentBets={myCurrentCasinoBets}
/>
</div>
</div>
<div className="h-full">
<PlaceBet
data={myCurrentCasinoBets}
game={item?.gameName}
bet={bet}
/>
</div>
</div>
</div>
)}

{/* Mobile Bet Popup */}
<div className={`${placeBet ? "block" : "hidden"}`}>
<div className="fixed inset-0 flex items-start justify-center z-50 md:hidden">
<div className="absolute top-0 inset-0 bg-gray-900 opacity-50"></div>
<div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
<CasinoMobileBetPopup
time={remainingTime}
gameType="casino"
gameName={item?.slug}
item={item}
refetchCurrentBets={refetchCurrentBets}
odds={oddsData}
myCurrentBets={myCurrentCasinoBets}
/>
</div>
</div>
</div>

{/* Mobile Bet View */}
{bet && (
<div className="md:w-[100%] md:hidden md:ms-1 h-fit flex-col">
<div className="h-screen">
<PlaceBet
data={myCurrentCasinoBets}
game={item?.gameName}
bet={bet}
/>
</div>
</div>
)}
</>
);
};

export default Trap;
