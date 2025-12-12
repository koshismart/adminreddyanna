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
import Card from "../common/Card";

const TEEN_33 = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  //console.log("my casino data ", casinoData)

  // Decode token safely
  const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

  const location = useLocation();
  const item = location.state?.item;
  const queryClient = useQueryClient();
  const [Countdown, setCountdown] = useState(0);

  const [cardData, setCardData] = useState([]);
  //console.log("card ka data",cardData)
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
      setCardData(casinoData?.data?.data?.data?.t1?.[0]);
    } else {
      setOddsData(getFallbackOddsData());
      setCountdown(480);
    }
  }, [casinoData]);
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
      {
        mid: "157251113115409",
        nat: "  Player B Under 21",
        sid: "3",
        b1: "2.95",
        gstatus: "0",
        min: 100,
        max: 200000,
      },
      {
        mid: "157251113115409",
        nat: "  Player B Over 21",
        sid: "3",
        b1: "2.95",
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
                <Card cardData={cardData} slug={item.slug}/>
                {/* Timer */}
                <div className="absolute bottom-2 right-2">
                  <Timer time={endTime} />
                </div>
              </div>
            </div>

            {/* Casino Table Design - Exactly as per your HTML structure */}
            <div className="teenpatti1day casino-detail">
              <div className="casino-table">
                <div className="casino-table-box">
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail">Player A</div>
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {oddsData
                        .filter((item) => item.nat === "Player A")
                        .map((item, idx) => (
                          <div
                            key={idx}
                            className={`casino-table-row ${
                              remainingTime <= 3 || item.gstatus == "SUSPENDED"
                                ? "suspended-row"
                                : ""
                            }`}
                          >
                            <div className="casino-nation-detail">
                              <div className="casino-nation-name">Main</div>
                            </div>
                            <div className="casino-odds-box back">
                              {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                                <span className="casino-odds">{item.b1}</span>
                              ) : (
                                <span
                                  className="casino-odds cursor-pointer hover:text-blue-700"
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Back on " + item?.nat,
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
                            </div>
                            <div className="casino-odds-box lay">
                              {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                                <span className="casino-odds">{item.l1}</span>
                              ) : (
                                <span
                                  className="casino-odds cursor-pointer hover:text-blue-700"
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Lay on " + item?.nat,
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
                    <div className="casino-table-header">
                      <div className="casino-nation-detail">Player B</div>
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {oddsData
                        .filter((item) => item.nat === "Player B")
                        .map((item, idx) => (
                          <div
                            key={idx}
                            className={`casino-table-row ${
                              remainingTime <= 3 || item.gstatus == "SUSPENDED"
                                ? "suspended-row"
                                : ""
                            }`}
                          >
                            <div className="casino-nation-detail">
                              <div className="casino-nation-name">Main</div>
                            </div>
                            <div className="casino-odds-box back">
                              {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                                <span className="casino-odds">{item.b1}</span>
                              ) : (
                                <span
                                  className="casino-odds cursor-pointer hover:text-blue-700"
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Back on " + item?.nat,
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
                            </div>
                           <div className="casino-odds-box lay">
                              {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                                <span className="casino-odds">{item.l1}</span>
                              ) : (
                                <span
                                  className="casino-odds cursor-pointer hover:text-blue-700"
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Lay on " + item?.nat,
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
                <div className="casino-remark mt-1">
                  <marquee scrollamount={3}>
                    Play Our New Game Premium Teenpatti 1 Day
                  </marquee>
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
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            
                            {/* PLAYER A */}
                            <div className="text-center">
                              <h4 className="result-title font-bold text-lg">Player A</h4>

                              <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
                                {individualResultData?.cards
                                  ?.split(",")
                                  ?.filter((_, i) => i % 2 === 0)
                                  ?.map((card) => (
                                    <img
                                      key={card}
                                      className="h-[54px]"
                                      src={cardsData.find((v) => v.code === card)?.image}
                                    />
                                  ))}

                                {individualResultData?.win == "1" && (
                                  <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
                                    <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* PLAYER B */}
                            <div className="text-center">
                              <h4 className="result-title font-bold text-lg">Player B</h4>

                              <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
                                {individualResultData?.cards
                                  ?.split(",")
                                  ?.filter((_, i) => i % 2 !== 0)
                                  ?.map((card) => (
                                    <img
                                      key={card}
                                      className="h-[54px]"
                                      src={cardsData.find((v) => v.code === card)?.image}
                                    />
                                  ))}

                                {individualResultData?.win == "2" && (
                                  <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
                                    <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
                                  </div>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* DESCRIPTION BOX (Winner, Under/Over etc) */}
                          <div className="row mt-4 justify-center">
                            <div className="col-md-6">

                              <div className="casino-result-desc p-2 border rounded mb-2">
                                <div className="casino-result-desc-item flex justify-between">
                                  <div>Winner:</div>
                                  <div>
                                    {individualResultData?.win == "1" ? "Player A" : "Player B"}
                                  </div>
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
                      casinoIndividualResult(cookies, item.mid).then(
                        (res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                        }
                      );
                    }}
                    className={`result cursor-pointer ${
                      item.win === 1 ? "A" : "B"
                    }`}
                  >
                    {getResultText(item.win) === "1" ? "A" : "B"}
                  </span>
                ))
              ) : (
                <>
                  <span className="result result-b">T</span>
                  <span className="result result-a">D</span>
                </>
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

export default TEEN_33;
