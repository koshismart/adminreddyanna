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

const Cmeter = ({
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
  const indicatorTimer = useRef(null);
  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [oddsData, setOddsData] = useState([]);
const [showLowIndicator, setShowLowIndicator] = useState(false);  // Low se click hua?
const [showHighIndicator, setShowHighIndicator] = useState(false); // High se click hua?
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
      setCardData(casinoData.data.data.data.t1?.[0] || {});
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


const startIndicatorTimer = () => {
  // Purana timer ho to cancel kar do
  if (indicatorTimer.current) {
    clearTimeout(indicatorTimer.current);
  }

  // 5 second baad dono indicators hata do
  indicatorTimer.current = setTimeout(() => {
    setShowLowIndicator(false);
    setShowHighIndicator(false);
  }, 5000); // 5000 ms = 5 seconds
};


const winnerType = individualResultData?.winner;

  return (
    <>
      <div className="block md:hidden w-full">
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
              <div className="hidden md:block w-full">
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
                {/* Timer */}
                <div className="absolute bottom-2 right-2">
                  <Timer time={endTime} />
                </div>
              </div>
            </div>

            {/* Casino Table Design - Exactly as per your HTML structure */}
           <div className="cmeter casino-detail">
            <div className="casino-table">
                <div className="casino-table-full-box">
                <div className="cmeter-video-cards-box">

                    {/* LOW SECTION */}
                    <div className="cmeter-low">
                    <div>
                        <span className="text-fancy">Low</span>
                        <span className="ms-2 text-success">
                        <b>{cardData?.C1 && cardData.C1 !== "0" ? cardData.C1 : "-"}</b>
                        </span>
                    </div>

                    <div className="cmeter-low-cards flex  flex-wrap justify-center">
                        {cardData?.cards &&
                        cardData.cards
                            .split(",")
                            .filter((code) => {
                            // Ignore empty, 1, or invalid
                            if (!code || code === "1" || code.trim() === "") return false;

                            // Extract rank (first 1-2 characters before suit)
                            const rankPart = code.replace(/[^A-Z0-9]/g, "").slice(0, 2);
                            const rank = rankPart === "10" ? "10" : rankPart[0];

                            // Low cards: A,2,3,4,5,6,7,8,9
                            if (["A", "2", "3", "4", "5", "6", "7", "8", "9"].includes(rank)) {
                                return true;
                            }
                            return false;
                            })
                            .map((code, i) => (
                            <img
                                key={i}
                                src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${code}.jpg`}
                                alt={code}
                                
                            />
                            ))}
                    </div>
                    </div>

                    {/* HIGH SECTION */}
                    <div className="cmeter-high">
                    <div>
                        <span className="text-fancy">High</span>
                        <span className="ms-2 text-success">
                        <b>{cardData?.C2 && cardData.C2 !== "0" ? cardData.C2 : "-"}</b>
                        </span>
                    </div>

                    <div className="cmeter-high-cards flex  flex-wrap justify-center">
                        {cardData?.cards &&
                        cardData.cards
                            .split(",")
                            .filter((code) => {
                            if (!code || code === "1" || code.trim() === "") return false;

                            const rankPart = code.replace(/[^A-Z0-9]/g, "").slice(0, 2);
                            const rank = rankPart === "10" ? "10" : rankPart[0];

                            // High cards: 10, J, Q, K
                            return ["10", "J", "Q", "K"].includes(rank);
                            })
                            .map((code, i) => (
                            <img
                                key={i}
                                src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${code}.jpg`}
                                alt={code}
                               
                            />
                            ))}
                    </div>
                    </div>

                </div>
                </div>

            <div className="casino-table-box mt-3">

            {/* LEFT → LOW (A to 9) */}
            {oddsData
                .filter((v) => v.sid === "1")
                .map((item, index) => {
                const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                return (
                    <div key={index} className={`casino-table-left-box ${isSuspended ? "suspended-box" : ""}`}>
                    
                    <div className="text-center">
                        <b className="text-info">{item.nat}</b>

                        {/* Jab High se koi card click hoga → yahan 10SS dikhega */}
                        {showHighIndicator && (
                        <div className="card-odd-box ms-2 d-inline-block">
                            <img 
                            src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/10SS.jpg" 
                            alt="10SS"
                            />
                        </div>
                        )}
                    </div>

                    <div className="cmeter-card-box mt-2 flex flex-wrap justify-center ">
                        {["A", "2", "3", "4", "5", "6", "7", "8", "9"].map((card) => {
                        const rate = calculateCasinoRate(item?.b1);

                        return (
                            <div
                            key={card}
                            className={`card-odd-box cursor-pointer hover:scale-110 transition-transform ${isSuspended ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => {
                                if (!isSuspended) {
                                // Low click hua → High side pe 9SS dikhao
                                setShowLowIndicator(true);
                                setShowHighIndicator(false); // Clear opposite
                                startIndicatorTimer();
                                setPlaceBet(true);
                                const newBetData = {
                                    betName: `${item.nat} - ${card === "A" ? "Ace" : card}`,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: rate,
                                    stake: 0,
                                    mid: item?.mid,
                                    sid: item?.sid,
                                    cardValue: card,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                                }
                            }}
                            >
                            <img
                                src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card === "9" ? "9meter" : card}.png`}
                                alt={card}
                            />
                            </div>
                        );
                        })}
                    </div>

                    <div className="casino-nation-book text-center mt-2" />
                    </div>
                );
                })}

            {/* RIGHT → HIGH (10, J, Q, K) */}
            {oddsData
                .filter((v) => v.sid === "2")
                .map((item, index) => {
                const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                return (
                    <div key={index} className={`casino-table-right-box ${isSuspended ? "suspended-box" : ""}`}>
                    
                    <div className="text-center">
                        <b className="text-info">{item.nat}</b>

                        {/* Jab Low se koi card click hoga → yahan 9SS dikhega */}
                        {showLowIndicator && (
                        <div className="card-odd-box ms-2 d-inline-block">
                            <img 
                            src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/9SS.jpg" 
                            alt="9SS"
                           
                            />
                        </div>
                        )}
                    </div>

                    <div className="cmeter-card-box mt-2 flex flex-wrap justify-center ">
                        {["10", "J", "Q", "K"].map((card) => {
                        const rate = calculateCasinoRate(
                            card === "10" ? item?.b1 : card === "J" ? item?.b2 : card === "Q" ? item?.b3 : item?.b4
                        );
                        return (
                            <div
                            key={card}
                            className={`card-odd-box cursor-pointer hover:scale-110 transition-transform ${isSuspended ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => {
                                if (!isSuspended) {
                                // High click hua → Low side pe 10SS dikhao
                                setShowHighIndicator(true);
                                setShowLowIndicator(false); // Clear opposite
                                startIndicatorTimer();
                                setPlaceBet(true);
                                const newBetData = {
                                    betName: `${item.nat} - ${card === "10" ? "10" : card === "J" ? "Jack" : card === "Q" ? "Queen" : "King"}`,
                                    boxColor: "bg-[#F0B2B2]",
                                    matchOdd: rate,
                                    stake: 0,
                                    mid: item?.mid,
                                    sid: item?.sid,
                                    cardValue: card,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                                }
                            }}
                            >
                            <img
                                src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.png`}
                                alt={card}
                            />
                            </div>
                        );
                        })}
                    </div>

                    <div className="casino-nation-book text-center mt-2" />
                    </div>
                );
                })}

            </div>
            </div>
            </div>
            {/* Results Section */}
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
                        <div className="row mt-2 align-items-center">
                        {/* LOW CARDS */}
                        <div className="col-10 text-center">
                        <div className="row align-items-center">
                        <div className="col-2">Low Cards</div>
                        <div className="col-10">
                        <div className="casino-result-cards">
                        {individualResultData.cards
                        ?.split(",")
                        .filter((c) => c !== "1")
                        .filter((card) => {
                        const rank = card.startsWith("10") ? "10" : card[0];
                        if (["J", "Q", "K"].includes(rank)) return false;
                        return parseInt(rank) >= 1 && parseInt(rank) <= 9;
                        })
                        .map((card, idx) => (
                        <img
                        key={idx}
                        src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`}
                        />
                        ))}
                        </div>
                        </div>
                        </div>
                        {/* HIGH CARDS */}
                        <div className="row align-items-center mt-2">
                        <div className="col-2">High Cards</div>
                        <div className="col-10">
                        <div className="casino-result-cards">
                        {individualResultData.cards
                        ?.split(",")
                        .filter((c) => c !== "1")
                        .filter((card) => {
                        const rank = card.startsWith("10") ? "10" : card[0];
                        if (["J", "Q", "K"].includes(rank)) return true;
                        return parseInt(rank) >= 10;
                        })
                        .map((card, idx) => (
                        <img
                        key={idx}
                        src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`}
                        />
                        ))}
                        </div>
                        </div>
                        </div>
                        </div>
                        {/* EXTRA CARD (Right side) */}
                      <div className="col-2 text-center">
                    <div className="casino-result-cards">
                        {individualResultData?.winner && (
                        <img
                            src={
                            individualResultData.winner === "Low"
                                ? "https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/9SS.jpg"
                                : "https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/10SS.jpg"
                            }
                        />
                        )}
                    </div>
                    </div>



                        </div>
                          {/* DESCRIPTION BOX (Winner, Under/Over etc) */}
                         <div className="row mt-2 justify-content-center">
                        <div className="col-md-6">
                            <div className="casino-result-desc">
                            <div className="casino-result-desc-item">
                                <div>Winner</div>
                                <div>{individualResultData?.win == "1" ? "Low" : "High"}</div>
                            </div>
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
                className={`result cursor-pointer ${
                  item.win === "1" ? "result-a" : "result-b"
                }`}
                >
                {item.result === "1" ? "L" : "H"}
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

export default Cmeter;
