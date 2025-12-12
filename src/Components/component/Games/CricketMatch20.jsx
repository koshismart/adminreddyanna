import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import scoreBackground from "../../assets/casinogames/score-bg.png";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import cricketBall from "../../assets/Cricket_ball.svg";
import cardsData from "../../assets/cards/data";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import useScrollFixed from "../../hook/useFixed";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import ball from "../../assets/balls";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const CricketMatch20 = ({
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

  const {
    placeBet,
    setPlaceBet,
    betData,
    setBetData,
    latestBetData,
    setLatestBetData,
  } = useContext(PlaceBetUseContext);
  const latestBetDataRef = useRef(betData); // Track the latest bet data with a ref

  const isFixed = useScrollFixed();

  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [bet, setBet] = useState(false);

  // const {
  //   isLoading: isLoadingOdds,
  //   data: casinoData,
  //   isSuccess: isSuccessOdds,
  //   refetch: refetchOdds,
  // } = useQuery(
  //   ["casinoGameOdds", { cookies, slug: item?.slug }],
  //   () => casinoGameOdds(cookies, item?.slug),
  //   {
  //     keepPreviousData: true, // Add this option
  //   }
  // );

  // const {
  //   isLoading: isLoadingTopTenResult,
  //   data: toptenResult,
  //   isSuccess: isSuccessTopTenResult,
  //   refetch: refetchTopTenResult,
  // } = useQuery(
  //   ["casinoGameTopTenResult", { cookies, slug: item?.slug }],
  //   () => casinoGameTopTenResult(cookies, item?.slug),
  //   {
  //     keepPreviousData: true, // Add this option
  //   }
  // );

  //individual bet history
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

  if (
    casinoData?.error === "Token has expired" ||
    casinoData?.error === "Invalid token" ||
    // toptenResult?.error === "Token has expired" ||
    // toptenResult?.error === "Invalid token" ||
    IndividualResult?.error === "Token has expired" ||
    IndividualResult?.error === "Invalid token"
  ) {
    signout(userId, removeCookie, () => {
      navigate("/sign-in");
      return null;
    });
  }

  useEffect(() => {
    if (
      casinoData &&
      casinoData?.data?.data?.data &&
      casinoData?.data?.data?.data?.status !== "error" &&
      casinoData?.data?.data?.data?.t1?.[0].autotime != ""
    ) {
      setCountdown(
        parseInt(casinoData?.data?.data?.data?.t1?.[0].autotime || 0)
      );
      setCardData(casinoData?.data?.data?.data?.t1?.[0]);
    }
  }, [casinoData]);

  const handleCountdownEnd = () => {
    queryClient.invalidateQueries([
      "casinoGameOdds",
      { cookies, slug: item?.slug },
    ]);

    refetchCurrentBets();

    refetchCasinoBetHistory();

    queryClient.invalidateQueries([
      "casinoGameTopTenResult",
      { cookies, slug: item?.slug },
    ]);
  };

  // const remainingTime = useCountdown(Countdown, handleCountdownEnd);
  // const endTime = new Date().getTime() + remainingTime * 1000;
  const { remainingTime, endTime } = useCountdown(
    Countdown,
    handleCountdownEnd
  );

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
    queryClient.invalidateQueries([
      "casinoGameTopTenResult",
      { cookies, slug: item?.slug },
    ]);
    refetchCurrentBets();
    refetchCasinoBetHistory();
  }

  const getResultText = (result) => {
    switch (result) {
      case "1":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 1")).ball}
            className=""
          />
        );
      case "2":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 2")).ball}
            className=""
          />
        );
      case "3":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 3")).ball}
            className=""
          />
        );
      case "4":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 4")).ball}
            className=""
          />
        );
      case "5":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 5")).ball}
            className=""
          />
        );
      case "6":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 6")).ball}
            className=""
          />
        );
      case "7":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 7")).ball}
            className=""
          />
        );
      case "8":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 8")).ball}
            className=""
          />
        );
      case "9":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 9")).ball}
            className=""
          />
        );
      case "10":
        return (
          <img
            src={ball.find((v) => v.name.includes("Run 10")).ball}
            className=""
          />
        );
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (latestBetData && casinoData?.data?.data?.data?.t2) {
      const currentOdds = casinoData?.data?.data?.data?.t2.find(
        (data) => data.sid || data.sectionId === latestBetData.sid
      );

      // Check if matchOdd has changed and prevent unnecessary updates
      if (
        currentOdds &&
        currentOdds.matchOdd !== latestBetDataRef.current.matchOdd &&
        betData.oddType === "casino_odds"
      ) {
        // Avoid updating if already suspended or matchOdd has not changed
        if (remainingTime <= 4) {
          setLatestBetData((prev) => ({
            ...prev,
            matchOdd: "SUSPENDED",
          }));
        }
        if (latestBetData.mid != currentOdds.mid) {
          setPlaceBet(false);
        }
      }
    }
  }, [remainingTime]); // Add the necessary dependencies

  return (
    <>
      <div className="block md:hidden w-full">
        <Header
          gameName={item?.gameName}
          min={casinoData?.data?.data?.data?.t2?.[0]?.min}
          max={casinoData?.data?.data?.data?.t2?.[0]?.max}
          mid={cardData?.mid}
        />
      </div>
      <HeaderTab
        bet={bet}
        setBet={setBet}
        mid={cardData?.mid}
        myCurrentCasinoBets={myCurrentCasinoBets}
      />
      {!bet && (
        <div className="flex relative w-full h-full">
          <div className="center-container">
            <div className="p-2 hidden md:block bg-secondaryBackground text-white">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t2?.[0]?.min}
                max={casinoData?.data?.data?.data?.t2?.[0]?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="w-full relative">
              <Frame item={item} />

              {/* card */}

              <div className="absolute top-2 left-2">
                {cardsData && cardsData.find((i) => i.code == cardData?.C1) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C1).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C1).name}
                  />
                )}
              </div>
              {remainingTime >= 10 && (
                <div className="absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center">
                  <div className="bg-black opacity-90 text-white px-4 py-2 md:py-4 rounded-lg w-full md:max-w-lg max-w-md">
                    <div className="flex flex-col md:flex-row justify-center items-center border-2 px-4 md:py-4 py-2">
                      <div className="w-full flex justify-center flex-col items-center md:border-e-2 md:pr-4">
                        <h2 className="flex justify-center items-center mb-2 md:mb-4">
                          Team A
                        </h2>
                        <div>Score: {cardData.C2}</div>
                        <div>
                          Over: {cardData.C2 < cardData.C5 ? cardData.C7 : 20}
                        </div>
                      </div>
                      <div className="w-full flex justify-center flex-col items-center mt-4 md:mt-0 md:pl-4">
                        <h2 className="flex justify-center items-center mb-2 md:mb-4">
                          Team B
                        </h2>
                        <div>Score: {cardData.C5}</div>
                        <div>
                          Over: {cardData.C2 > cardData.C5 ? cardData.C7 : 20}
                        </div>
                      </div>
                    </div>
                    <h2 className="mt-4 text-center">{cardData.remark}</h2>
                  </div>
                </div>
              )}

              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* <ComplexOdds
            game={item?.gameName}
            setIsBetModalOpen={setPlaceBet}
            isBetModalOpen={placeBet}
            time={remainingTime}
            cardsData={cardsData}
          /> */}
            {Array?.isArray(casinoData?.data?.data?.data?.t2) && (
              <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-100 px-2  border-2 border-gray-400 gap-4">
                {casinoData?.data?.data?.data?.t2?.map((item) => (
                  <div
                    key={item.sid}
                    className="h-[70px] my-6  bg-no-repeat bg-center relative"
                    style={{
                      backgroundImage: `url(${scoreBackground})`,
                      backgroundSize: "100% 100%",
                    }}
                  >
                    <div className="flex justify-between px-4 text-white">
                      <div className="flex flex-col py-1 justify-center items-center">
                        <h2 className="text-sm font-bold">Team A</h2>
                        <div className="text-xs text-normal text-nowrap">
                          Score: {cardData?.C2}
                        </div>
                        <div className="text-xs text-normal text-nowrap">
                          Over:{" "}
                          {cardData?.C2 < cardData?.C5 ? cardData?.C7 : 20}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center">
                        <h2 className="text-sm font-bold">Team B</h2>
                        <div className="text-xs text-normal text-nowrap">
                          Score: {cardData?.C5}
                        </div>
                        <div className="text-xs text-normal text-nowrap">
                          Over:{" "}
                          {cardData?.C2 > cardData?.C5 ? cardData?.C7 : 20}
                        </div>
                      </div>
                    </div>
                    <div className="absolute flex flex-col justify-center items-center -top-1/2 left-1/2 transform -translate-x-1/2 translate-y-0">
                      <div className="rounded-full h-20 w-20 flex justify-center items-center">
                        <img src={ball.find((v) => v.name == item.nat)?.ball} />
                      </div>
                      <div className="flex justify-center mt-1 items-center">
                        <div
                          onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                              betName: item?.nat,
                              boxColor: "bg-[#B2D6F0]",
                              matchOdd: item?.b1,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: item?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }}
                          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-bold py-2 px-4 transition-colors duration-300 relative"
                        >
                          {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                            <>
                              <div className="absolute inset-0 bg-black opacity-80 flex w-full py-2 px-4   h-full justify-center items-center font-bold uppercase z-10">
                                <span className="text-white opacity-100">
                                  <i class="ri-lock-2-fill text-xl"></i>
                                </span>
                              </div>
                              {item.b1}
                            </>
                          ) : (
                            <>{item.b1}</>
                          )}
                        </div>
                        <div
                          onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                              betName: item?.nat,
                              boxColor: "bg-[#FAA9BA]",
                              matchOdd: item?.l1,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: item?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Lay",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }}
                          className="bg-red-500 cursor-pointer hover:bg-red-600 text-white font-bold py-2 px-4 transition-colors duration-300 relative"
                        >
                          {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                            <>
                              <div className="absolute inset-0 bg-black opacity-80  py-2 px-4 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                <span className="text-white opacity-100">
                                  <i class="ri-lock-2-fill text-xl"></i>
                                </span>
                              </div>
                              {item.l1}
                            </>
                          ) : (
                            <>{item.l1}</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* result start */}
            <div className="result bg-secondaryBackground py-1 mb-1">
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
{/* PLAYER CARD */}
<div className="row mt-2">
  <div className="col-md-12 text-center">
    {(() => {
      const cardCode = individualResultData?.cards;  
      const cardImg = cardsData.find((v) => v.code === cardCode)?.image;

      return (
        <div className="casino-result-cards">
          {cardImg ? (
            <img className="h-[60px]" src={cardImg} alt={cardCode} />
          ) : (
            <span className="text-lg font-bold">{cardCode}</span>
          )}
        </div>
      );
    })()}
  </div>
</div>

{/* DESCRIPTION SECTION – 100% DYNAMIC */}
<div className="row mt-2 justify-content-center">
  <div className="col-md-6">
    <div className="casino-result-desc">

      {(() => {
        const titles = ["Run"];

        // newdesc ko split karna
        const values = individualResultData?.newdesc
          ? individualResultData.newdesc.split("#")
          : ["-", "-", "-", "-", "-"];

        return titles.map((title, index) => (
          <div key={index} className="casino-result-desc-item">
            <div>{title}</div>
            <div>{values[index] || "-"}</div>
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
            <div
              className={`flex justify-end
                  gap-1 mb-2`}
            >
              {casinoData?.data?.data?.result ? (
                casinoData?.data?.data?.result?.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                      casinoIndividualResult(cookies, item.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
                    }}
                    className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
                      item.result == 1 ? "text-red-500" : "text-yellow-400"
                    }  flex justify-center items-center w-6 rounded-full`}
                  >
                    {getResultText(item.result)}
                  </div>
                ))
              ) : (
                <>No Results Found</>
              )}
            </div>
            {/* result end */}
          </div>
          <div className="sidebar right-sidebar casino-right-sidebar sticky overflow-hidden">
            <div className="sidebar-box my-bet-container">
              <div className={`${!placeBet ? "block" : "hidden"}`}>
                <h1 className="px-2 py-1 bg-secondaryBackground text-white">
                  Place Bet
                </h1>
              </div>
              <div className={`${placeBet ? "block" : "hidden"}`}>
                <CasinoBetPopup
                  time={remainingTime}
                  gameType="casino"
                  gameName={item?.slug}
                  item={item}
                  refetchCurrentBets={refetchCurrentBets}
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
      <div className={`${placeBet ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex  items-start justify-center z-50 md:hidden">
          <div className="absolute top-0 inset-0  bg-gray-900 opacity-50"></div>

          <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
            <CasinoMobileBetPopup
              time={remainingTime}
              gameType="casino"
              gameName={item?.slug}
              item={item}
              refetchCurrentBets={refetchCurrentBets}
              myCurrentBets={myCurrentCasinoBets}
            />
          </div>
        </div>
      </div>
      {bet && (
        <div className="md:w-[100%] md:hidden   md:ms-1 h-fit  flex-col">
          {/*  */}
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

export default CricketMatch20;
