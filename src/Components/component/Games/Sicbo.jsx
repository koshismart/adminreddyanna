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

const Sicbo = ({
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
               

                {/* Timer */}
                <div className="absolute bottom-2 right-2">
                  <Timer time={endTime} />
                </div>
              </div>
            </div>

            {/* Casino Table Design - Exactly as per your HTML structure */}
            <div className="sicbo casino-detail">
            <div className="casino-table">
            <div className="d-none d-xl-block">
                <div className="sicbo-top">
                <div className="sicbo-top-box sicbo-title-box">
                    1:1 Lose to Any Triple
                </div>
                <div className="sicbo-top-box sicbo-title-box">30:1</div>
                <div className="sicbo-top-box sicbo-title-box">
                    1:1 Lose to Any Triple
                </div>
                </div>
                <div className="sicbo-middle">
                    {oddsData
                    .filter((v)=> v.nat === "Small")
                    .map((item , index)=>(
                   <div className={`sicbo-middle-small sicbo-square-box ${
                    remainingTime <= 3 || item.gstatus == "SUSPENDED" ? ' suspended-box':''
                   }`}
                    key={index}
                   >
                    <div>{item.nat}</div>
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                     <div className="sicbo-box-value">{item.b}</div>
                    ):(
                    <div className="sicbo-box-value"
                    onClick={() => {
                    setPlaceBet(true);
                    const newBetData = {
                    betName: item?.nat,
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
                    {item.b1}
                    </div>
                    )}
                    
                </div>
                    ))}
                
                <div className="sicbo-middle-midle">
                <div className="sicbo-middle-top-row">

                {/* ------ ODD ------ */}
                {oddsData
                    .filter(v => v.nat === "ODD")
                    .map((item, index) => {
                    const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";
                    return (
                        <div
                        key={index}
                        className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${
                            isSuspended ? "suspended-box" : ""
                        }`}
                        >
                        <div>{item.nat}</div>

                        {isSuspended ? (
                            <div className="sicbo-box-value">{item.b1}</div>
                        ) : (
                            <div
                            className="sicbo-box-value"
                            onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                betName: item.nat,
                                boxColor: "bg-[#B2D6F0]",
                                matchOdd: calculateCasinoRate(item.b1),
                                stake: 0,
                                mid: item.mid,
                                sid: item.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }}
                            >
                            {item.b1}
                            </div>
                        )}
                        </div>
                    );
                    })}

                {/* ------ TOTAL 4 TO 10 ------ */}
                {[4, 5, 6, 7, 8, 9, 10].map((num, index) => {
                    const item = oddsData.find(v => v.nat === `Total ${num}`);
                    if (!item) return null;
                    const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                    return (
                    <div
                        key={index}
                        className={`sicbo-middle-top-box sicbo-square-box ${
                        isSuspended ? "suspended-box" : ""
                        }`}
                    >
                        <div>{num}</div>

                        {isSuspended ? (
                        <div className="sicbo-box-value">{item.b1}</div>
                        ) : (
                        <div
                            className="sicbo-box-value"
                            onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                                betName: item.nat,
                                boxColor: "bg-[#B2D6F0]",
                                matchOdd: calculateCasinoRate(item.b1),
                                stake: 0,
                                mid: item.mid,
                                sid: item.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                            }}
                        >
                            {item.b1}
                        </div>
                        )}
                    </div>
                    );
                })}

                {/* ------ ANY TRIPLE (Dynamic) ------ */}
                {(() => {
                    const item = oddsData.find(v => v.nat === "Any Triple");
                    if (!item) return null;
                    const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                    return (
                    <div
                        className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${
                        isSuspended ? "suspended-box" : ""
                        }`}
                    >
                        <div>{item.nat}</div>

                        {isSuspended ? (
                        <div className="sicbo-box-value">{item.b1}</div>
                        ) : (
                        <div
                            className="sicbo-box-value"
                            onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                                betName: item.nat,
                                boxColor: "bg-[#B2D6F0]",
                                matchOdd: calculateCasinoRate(item.b1),
                                stake: 0,
                                mid: item.mid,
                                sid: item.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                            }}
                        >
                            {item.b1}
                        </div>
                        )}
                    </div>
                    );
                })()}

                {/* ------ TOTAL 11 TO 17 ------ */}
                {[11, 12, 13, 14, 15, 16, 17].map((num, index) => {
                    const item = oddsData.find(v => v.nat === `Total ${num}`);
                    if (!item) return null;
                    const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                    return (
                    <div
                        key={index}
                        className={`sicbo-middle-top-box sicbo-square-box ${
                        isSuspended ? "suspended-box" : ""
                        }`}
                    >
                        <div>{num}</div>

                        {isSuspended ? (
                        <div className="sicbo-box-value">{item.b1}</div>
                        ) : (
                        <div
                            className="sicbo-box-value"
                            onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                                betName: item.nat,
                                boxColor: "bg-[#B2D6F0]",
                                matchOdd: calculateCasinoRate(item.b1),
                                stake: 0,
                                mid: item.mid,
                                sid: item.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                            }}
                        >
                            {item.b1}
                        </div>
                        )}
                    </div>
                    );
                })}

                {/* ------ EVEN (Dynamic) ------ */}
                {(() => {
                    const item = oddsData.find(v => v.nat === "Even");
                    if (!item) return null;
                    const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                    return (
                    <div
                        className={`sicbo-middle-top-box sicbo-square-box sicbo-middle-top-box-odd ${
                        isSuspended ? "suspended-box" : ""
                        }`}
                    >
                        <div>{item.nat}</div>

                        {isSuspended ? (
                        <div className="sicbo-box-value">{item.b1}</div>
                        ) : (
                        <div
                            className="sicbo-box-value"
                            onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                                betName: item.nat,
                                boxColor: "bg-[#B2D6F0]",
                                matchOdd: calculateCasinoRate(item.b1),
                                stake: 0,
                                mid: item.mid,
                                sid: item.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                            }}
                        >
                            {item.b1}
                        </div>
                        )}
                    </div>
                    );
                })()}

                </div>



                    <div className="sicbo-middle-middle-row">
                    <div className="sicbo-cube-box-container">
                        <div className="sicbo-top-box sicbo-title-box">
                        <span>1:1 on Sinlge</span>
                        <span>2:1 on Double</span>
                        <span>3:1 on Tripple</span>
                        </div>
                        <div className="sicbo-cube-box-group">

                    {[1, 2, 3, 4, 5, 6].map((num) => {
                        const item = oddsData.find(v => v.nat === `Single ${num}`);
                        const imgURL = `https://g1ver.sprintstaticdata.com/v80/static/front/img/dice${num}.png`;

                        if (!item) return null;

                        const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                        return (
                        <div
                            key={num}
                            className={`sicbo-cube-box sicbo-square-box sicbo-cube-single ${
                            isSuspended ? "suspended-box" : ""
                            }`}
                        >
                            {isSuspended ? (
                            <img src={imgURL} alt={`Dice ${num}`} />
                            ) : (
                            <span
                                onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                    betName: item.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: calculateCasinoRate(item.b1),
                                    stake: 0,
                                    mid: item.mid,
                                    sid: item.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                                }}
                            >
                                <img src={imgURL} alt={`Dice ${num}`} />
                            </span>
                            )}
                        </div>
                        );
                    })}

                    </div>

                    </div>
                    <div className="sicbo-cube-box-container">
                        <div className="sicbo-top-box sicbo-title-box">8:1 Double</div>
                        <div className="sicbo-cube-box-group">

                        {oddsData
                            .filter((v) => v.nat.startsWith("Double"))
                            .map((item, index) => {
                            const diceNumber = item.nat.split(" ")[1]; // Double 2 → 2
                            const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";
                            const diceImg = `https://g1ver.sprintstaticdata.com/v80/static/front/img/dice${diceNumber}.png`;

                            return (
                                <div
                                key={index}
                                className={`sicbo-cube-box sicbo-square-box sicbo-cube-double ${
                                    isSuspended ? "suspended-box" : ""
                                }`}
                                >
                                {isSuspended ? (
                                    <span>
                                    <img src={diceImg} alt={`Dice ${diceNumber}`} />
                                    <img src={diceImg} alt={`Dice ${diceNumber}`} />
                                    </span>
                                ) : (
                                    <span
                                    onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                        betName: item.nat,
                                        boxColor: "bg-[#B2D6F0]",
                                        matchOdd: calculateCasinoRate(item.b1),
                                        stake: 0,
                                        mid: item.mid,
                                        sid: item.sid,
                                        oddType: "casino_odds",
                                        oddCategory: "Back",
                                        };

                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                    }}
                                    >
                                    <img src={diceImg} alt={`Dice ${diceNumber}`} />
                                    <img src={diceImg} alt={`Dice ${diceNumber}`} />
                                    </span>
                                )}
                                </div>
                            );
                            })}
                        </div>

                    </div>
                    <div className="sicbo-cube-box-container">
                        <div className="sicbo-top-box sicbo-title-box">
                        150:1 Each Tripple
                        </div>
                        <div className="sicbo-cube-box-group">

                    {oddsData
                        .filter((v) => v.nat.startsWith("Triple"))
                        .map((item, index) => {
                        const diceNumber = item.nat.split(" ")[1]; // Triple 3 → 3
                        const diceImg = `https://g1ver.sprintstaticdata.com/v80/static/front/img/dice${diceNumber}.png`;
                        const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                        return (
                            <div
                            key={index}
                            className={`sicbo-cube-box sicbo-square-box sicbo-cube-tripple ${
                                isSuspended ? "suspended-box" : ""
                            }`}
                            >
                            {isSuspended ? (
                                <span>
                                <img src={diceImg} alt="Dice" />
                                <img src={diceImg} alt="Dice" />
                                <img src={diceImg} alt="Dice" />
                                </span>
                            ) : (
                                <span
                                onClick={() => {
                                    setPlaceBet(true);

                                    const newBetData = {
                                    betName: item.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: calculateCasinoRate(item.b1),
                                    stake: 0,
                                    mid: item.mid,
                                    sid: item.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                    };

                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                }}
                                >
                                <img src={diceImg} alt="Dice" />
                                <img src={diceImg} alt="Dice" />
                                <img src={diceImg} alt="Dice" />
                                </span>
                            )}
                            </div>
                        );
                        })}
                    </div>

                    </div>
                    </div>
                </div>
                {oddsData
                    .filter((v)=> v.nat === "BIG")
                    .map((item , index)=>(
                   <div className={`sicbo-middle-small sicbo-square-box ${
                    remainingTime <= 3 || item.gstatus == "SUSPENDED" ? ' suspended-box':''
                   }`}
                    key={index}
                   >
                    <div>{item.nat}</div>
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                     <div className="sicbo-box-value">{item.b1}</div>
                    ):(
                    <div className="sicbo-box-value"
                    onClick={() => {
                    setPlaceBet(true);
                    const newBetData = {
                    betName: item?.nat,
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
                    {item.b1}
                    </div>
                    )}
                    
                </div>
                    ))}
                </div>
                <div className="sicbo-bottom">
                <div className="sicbo-cube-box-container">
                    <div className="sicbo-top-box sicbo-title-box">5:1 Two Dice</div>
                   <div className="sicbo-cube-box-group">
                {oddsData
                    .filter((v) => v.nat.startsWith("Combination"))
                    .map((item, index) => {
                    const parts = item.nat.split(" ");
                    const dice1 = parts[1]; // "Combination 1 and 3" → 1
                    const dice2 = parts[3]; // → 3

                    const diceImg1 = `https://g1ver.sprintstaticdata.com/v80/static/front/img/dice${dice1}.png`;
                    const diceImg2 = `https://g1ver.sprintstaticdata.com/v80/static/front/img/dice${dice2}.png`;

                    const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                    return (
                        <div
                        key={index}
                        className={`sicbo-cube-box sicbo-square-box sicbo-cube-combination ${
                            isSuspended ? "suspended-box" : ""
                        }`}
                        >
                        {isSuspended ? (
                            <div>
                            <img src={diceImg1} alt={`Dice ${dice1}`} /><br/>
                            <img src={diceImg2} alt={`Dice ${dice2}`} />
                            </div>
                        ) : (
                            <div
                            onClick={() => {
                            setPlaceBet(true);
                            const newBetData = {
                            betName: item.nat,
                            boxColor: "bg-[#B2D6F0]",
                            matchOdd: calculateCasinoRate(item.b1),
                            stake: 0,
                            mid: item.mid,
                            sid: item.sid,
                            oddType: "casino_odds",
                            oddCategory: "Back",
                            };

                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                            }}
                            >
                            <img src={diceImg1} alt={`Dice ${dice1}`} /><br/>
                            <img src={diceImg2} alt={`Dice ${dice2}`} />
                            </div>
                        )}
                        </div>
                    );
                    })}
                </div>

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


                <div className="row mt-2">
                <div className="col-md-12 text-center">
                  <div className="casino-result-cards">

                    {individualResultData?.cards
                      ?.split(",")
                      ?.map((num, idx) => (
                        <img
                          key={idx}
                          src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/dice${num}.png`}
                        />
                      ))}

                  </div>
                </div>
              </div>
                 <div className="row mt-2 justify-content-center">
                <div className="col-md-6">
                  <div className="casino-result-desc">

                    <div className="casino-result-desc-item">
                      <div>Desc</div>
                      <div>{individualResultData?.desc}</div>
                    </div>

                    <div className="casino-result-desc-item">
                      <div>Win</div>
                      <div>{individualResultData?.win}</div>
                    </div>

                  </div>
                </div>
              </div>

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
                        item.result == 1 ? "result-a" : "result-b"
                      }`}
                    >
                      {getResultText(item.result)}
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

export default Sicbo;
