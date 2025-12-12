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

const Uniqueteenpatti = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
console.log("casino ka data",casinoData)
  // Decode token safely
  const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

  const location = useLocation();
  const item = location.state?.item;
  const queryClient = useQueryClient();
  const [Countdown, setCountdown] = useState(0);

  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [oddsData, setOddsData] = useState([]);
  console.log("odds ka data",oddsData)
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
                {cardData.length > 0 && cardData[0].C1 && (
                 <div className="absolute top-0 left-1">
                    <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                      PLAYER A
                    </h4>
                    <div className="flex gap-2">
                      {cardData[0].C1 && (
                        <div className="col text-white">
                          <img
                            src={
                              cardsData.find((c) => c.code === cardData[0].C1)
                                ?.image
                            }
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            alt={
                              cardsData.find((c) => c.code === cardData[0].C1)
                                ?.name
                            }
                          />
                        </div>
                      )}
                      {cardData[0].C3 && (
                        <div className="col text-white">
                          <img
                            src={
                              cardsData.find((c) => c.code === cardData[0].C3)
                                ?.image
                            }
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            alt={
                              cardsData.find((c) => c.code === cardData[0].C3)
                                ?.name
                            }
                          />
                        </div>
                      )}
                      {cardData[0].C5 && (
                        <div className="col text-white">
                          <img
                            src={
                              cardsData.find((c) => c.code === cardData[0].C5)
                                ?.image
                            }
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            alt={
                              cardsData.find((c) => c.code === cardData[0].C5)
                                ?.name
                            }
                          />
                        </div>
                      )}
                    </div>
                    <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                      PLAYER B
                    </h4>
                    <div className="flex gap-2">
                      {cardData[0].C2 && (
                        <div className="col text-white">
                          <img
                            src={
                              cardsData.find((c) => c.code === cardData[0].C2)
                                ?.image
                            }
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            alt={
                              cardsData.find((c) => c.code === cardData[0].C2)
                                ?.name
                            }
                          />
                        </div>
                      )}
                      {cardData[0].C4 && (
                        <div className="col text-white">
                          <img
                            src={
                              cardsData.find((c) => c.code === cardData[0].C4)
                                ?.image
                            }
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            alt={
                              cardsData.find((c) => c.code === cardData[0].C4)
                                ?.name
                            }
                          />
                        </div>
                      )}
                      {cardData[0].C6 && (
                        <div className="col text-white">
                          <img
                            src={
                              cardsData.find((c) => c.code === cardData[0].C6)
                                ?.image
                            }
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            alt={
                              cardsData.find((c) => c.code === cardData[0].C6)
                                ?.name
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timer */}
                <div className="absolute bottom-2 right-2">
                  <Timer time={endTime} />
                </div>
              </div>
            </div>

            {/* Casino Table Design - Exactly as per your HTML structure */}
            <div className="unique-teen20 casino-detail">
            <div className="casino-table">
                <h4 className="unique-teen-title">
                Select any 3 cards of your choice and experience TeenPatti in a unique
                way.
                <i className="fas fa-hand-point-down ms-1" />
                </h4>
                <div className="unique-teen20-box suspended">
                <div className="unique-teen20-card">
                    <img
                    src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s1-icon.png"
                    alt=""
                    />
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/ACC.jpg" />
                </div>
                <div className="unique-teen20-card">
                    <img
                    src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s2-icon.png"
                    alt=""
                    />
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/3HH.jpg" />
                </div>
                <div className="unique-teen20-card">
                    <img
                    src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s3-icon.png"
                    alt=""
                    />
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/4CC.jpg" />
                </div>
                <div className="unique-teen20-card">
                    <img
                    src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s4-icon.png"
                    alt=""
                    />
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/0.png" />
                </div>
                <div className="unique-teen20-card">
                    <img
                    src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s5-icon.png"
                    alt=""
                    />
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/0.png" />
                </div>
                <div className="unique-teen20-card">
                    <img
                    src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s6-icon.png"
                    alt=""
                    />
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/0.png" />
                </div>
                <div className="unique-teen20-place-balls d-xl-none">
                    <div>
                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/sequence/s1.png" />
                    </div>
                    <div>
                    <button className="btn btn-danger btn-sm me-1">Clear</button>
                    <button className="btn btn-success btn-sm" disabled="">
                        Placebet
                    </button>
                    </div>
                </div>
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
                <div
                  className="absolute inset-0 bg-gray-900 opacity-50"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                    setIndividualResultData(undefined);
                  }}
                ></div>

                <div className="bg-white md:relative absolute top-0 w-full z-50 max-w-3xl mx-auto">
                  <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
                    <h2 className="text-xl font-bold">{item.gameName}</h2>
                    <button
                      className="focus:outline-none"
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                        setIndividualResultData(undefined);
                      }}
                    >
                      <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
                    </button>
                  </div>
                  {individualResultData ? (
                    <div className="my-3 w-full">
                      <div>
                        <h4 className="flex justify-end items-center text-sm font-semibold px-2">
                          Round Id: {individualResultData?.mid}
                        </h4>
                      </div>
                      {!filteredBetHistory.length <= 0 && (
                        <IndividualBetHistoryTable data={filteredBetHistory} />
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex justify-center items-center my-4">
                      <img
                        src={cricketBall}
                        className="w-16 h-16 animate-spin"
                        alt="Loading"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Result Chips */}
            <div className={`flex mb-1 justify-end gap-1`}>
              {casinoData?.data?.result ? (
                casinoData.data.result.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                      setResultId(item.mid);
                      refetchIndividualResult();
                    }}
                    className={`h-6 cursor-pointer font-semibold hover:bg-green-950 bg-green-800 text-white flex justify-center items-center w-6 rounded-full`}
                  >
                    {getResultText(item.result) === "1" ? "A" : "B"}
                  </div>
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

export default Uniqueteenpatti;
