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

const KBC = ({
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
  console.log("bet data",betData)
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
      setCardData(casinoData.data.data.data.t1?.[0] || {});;
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
               <Card cardData={cardData} slug={item.slug}/>

                {/* Timer */}
                <div className="absolute bottom-2 right-2">
                  <Timer time={endTime} />
                </div>
              </div>
            </div>

            {/* Casino Table Design - Exactly as per your HTML structure */}
            <div className="kbc casino-detail">
            <div className="casino-table">
                <div className="row row5 kbc-btns">
                <div className="col-12 col-md-4">
                   {oddsData
                    .filter((v) => v.sid === "1")
                    .map((item, index) => {
                        const isSuspended = remainingTime <= 3 || item.gstatus === "SUSPENDED";

                        return (
                        <div className="casino-odd-box-container" key={index}>
                            <div className="casino-nation-name">
                            <b>[Q1] Red Black</b>
                            </div>

                            <div className="btn-group">
                            {/* ================= RED/DIAMOND ================= */}
                            <input
                                type="radio"
                                className="btn-check"
                                id={`redBlack-${index}-1`}
                                name={`redBlackBtn-${index}`}
                                defaultValue={1}
                            />

                            <label
                                className={`form-check-label btn ${
                                isSuspended ? "suspended-box" : ""
                                }`}
                                htmlFor={`redBlack-${index}-1`}
                            >
                                {isSuspended ? (
                                <>
                                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/heart.png" />
                                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/diamond.png" />
                                </>
                                ) : (
                                <span
                                className=""
                                    onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                    betName: "Back on Red",
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
                                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/heart.png" />
                                    <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/diamond.png" />
                                </span>
                                )}
                            </label>

                            {/* ================= SPADE/CLUB — ALWAYS SUSPENDED ================= */}
                            <input
                                type="radio"
                                className="btn-check"
                                id={`redBlack-${index}-2`}
                                name={`redBlackBtn-${index}`}
                                defaultValue={2}
                            />

                            <label
                                className={`form-check-label btn ${
                                    remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box" : ""
                                }`}
                                htmlFor={`redBlack-${index}-2`}
                            >
                                {isSuspended ?(
                                <>
                                <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/spade.png" />
                                <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/club.png" />
                                </>
                                ):(
                                <span
                                onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                betName: "Lay on Black" ,
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
                                <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/spade.png" />
                                <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/club.png" />   
                                </span>
                                )}
                            </label>
                            </div>
                        </div>
                        );
                    })}  
                    </div>
                <div className="col-12 col-md-4">
                {oddsData
                    ?.filter((v) => v.sid === "2")
                    ?.map((item, index) => {
                    const isSuspended =
                        remainingTime <= 3 || item?.gstatus === "SUSPENDED";

                    return (
                        <div className="casino-odd-box-container" key={index}>
                        <div className="casino-nation-name">
                            <b>[Q2] Odd Even</b>
                        </div>

                        <div className="btn-group">

                            {/* ODD BUTTON */}
                            <input
                            type="radio"
                            className="btn-check"
                            id={`oddEven-odd-${index}`}
                            name="oddEvenBtn"
                            value="odd"
                            />

                            <label
                            className={`form-check-label btn ${
                                isSuspended ? "suspended-box" : ""
                            }`}
                            htmlFor={`oddEven-odd-${index}`}
                            >
                            {isSuspended ? (
                                <>Odd</>
                            ) : (
                                <span
                                onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                betName: "Back on Odd",
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
                                Odd
                                </span>
                            )}
                            </label>

                            {/* EVEN BUTTON */}
                            <input
                            type="radio"
                            className="btn-check"
                            id={`oddEven-even-${index}`}
                            name="oddEvenBtn"
                            value="even"
                            />

                            <label
                            className={`form-check-label btn ${
                                isSuspended ? "suspended-box" : ""
                            }`}
                            htmlFor={`oddEven-even-${index}`}
                            >
                            {isSuspended ? (
                                <>Even</>
                            ) : (
                                <span
                                onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                betName: "Lay on Even",
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
                                Even
                                </span>
                            )}
                            </label>
                        </div>
                        </div>
                    );
                    })}
                </div>

                <div className="col-12 col-md-4">
                {oddsData
                    ?.filter((v) => v.sid === "3")
                    ?.map((item, index) => {
                    const isSuspended =
                        remainingTime <= 3 || item?.gstatus === "SUSPENDED";
                    return (
                        <div className="casino-odd-box-container" key={index}>
                        <div className="casino-nation-name">
                            <b>[Q3] 7 Up - 7 Down</b>
                        </div>

                        <div className="btn-group">

                            {/* 7 Up Button */}
                            <input
                            type="radio"
                            className="btn-check"
                            id={`upDown-up-${index}`}
                            name={`upDownBtn-${index}`}
                            value="up"
                            />

                            <label
                            className={`form-check-label btn ${
                                isSuspended ? "suspended-box" : ""
                            }`}
                            htmlFor={`upDown-up-${index}`}
                            >
                            {isSuspended ? (
                                <>Up</>
                            ) : (
                                <span
                                onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                betName: "Back on 7 Up",
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
                                Up
                                </span>
                            )}
                            </label>

                            {/* 7 Down Button */}
                            <input
                            type="radio"
                            className="btn-check"
                            id={`upDown-down-${index}`}
                            name={`upDownBtn-${index}`}
                            value="down"
                            />

                            <label
                            className={`form-check-label btn ${
                                isSuspended ? "suspended-box" : ""
                            }`}
                            htmlFor={`upDown-down-${index}`}
                            >
                            {isSuspended ? (
                                <>Down</>
                            ) : (
                                <span
                                onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                betName: "Lay on 7 Down",
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
                                Down
                                </span>
                            )}
                            </label>
                        </div>
                        </div>
                    );
                    })}
                </div>

                </div>
                <div className="row row5 kbc-btns kbcothers mt-xl-3">
                <div className="col-12 col-md-4">
                {oddsData
                    ?.filter((v) => v.sid === "4")
                    ?.map((item, index) => {
                    const isSuspended =
                        remainingTime <= 3 || item?.gstatus === "SUSPENDED";

                    const options = [
                        { id: 1, label: "A23" },
                        { id: 2, label: "456" },
                        { id: 3, label: "8910" },
                        { id: 4, label: "JQK" },
                    ];

                    return (
                        <div className="casino-odd-box-container" key={index}>
                        <div className="casino-nation-name">
                            <b>[Q4] 3 Card Judgement</b>
                        </div>

                        <div className="btn-group">
                            {options.map((opt, idx) => (
                            <React.Fragment key={idx}>
                                <input
                                type="radio"
                                className="btn-check"
                                id={`cardj-${opt.id}-${index}`}
                                name={`cardj-${index}`}
                                value={opt.id}
                                />

                                <label
                                className={`form-check-label btn ${
                                    isSuspended ? "suspended-box" : ""
                                }`}
                                htmlFor={`cardj-${opt.id}-${index}`}
                                >
                                {isSuspended ? (
                                    opt.label
                                ) : (
                                    <span
                                    onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                        betName: "Back on " + opt.label,
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
                                    {opt.label}
                                    </span>
                                )}
                                </label>
                            </React.Fragment>
                            ))}
                        </div>
                        </div>
                    );
                    })}
                </div>

                <div className="col-12 col-md-4">
                {oddsData
                    ?.filter((v) => v.sid === "5")
                    ?.map((item, index) => {
                    const isSuspended =
                        remainingTime <= 3 || item?.gstatus === "SUSPENDED";

                    const options = [
                        {
                        id: 1,
                        label: "Spade",
                        icon:
                            "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/spade.png",
                        },
                        {
                        id: 2,
                        label: "Heart",
                        icon:
                            "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/heart.png",
                        },
                        {
                        id: 3,
                        label: "Club",
                        icon:
                            "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/club.png",
                        },
                        {
                        id: 4,
                        label: "Diamond",
                        icon:
                            "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/diamond.png",
                        },
                    ];

                    return (
                        <div className="casino-odd-box-container" key={index}>
                        <div className="casino-nation-name">
                            <b>[Q5] Suits</b>
                        </div>

                        <div className="btn-group">
                            {options.map((opt, idx) => (
                            <React.Fragment key={idx}>
                                <input
                                type="radio"
                                className="btn-check"
                                id={`suits-${opt.id}-${index}`}
                                name={`suit-${index}`}
                                value={opt.id}
                                />

                                <label
                                className={`form-check-label btn ${
                                    isSuspended ? "suspended-box" : ""
                                }`}
                                htmlFor={`suits-${opt.id}-${index}`}
                                >
                                {isSuspended ? (
                                    <img src={opt.icon} />
                                ) : (
                                    <span
                                    onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                        betName: "Back on " + opt.label,
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
                                    <img src={opt.icon} />
                                    </span>
                                )}
                                </label>
                            </React.Fragment>
                            ))}
                        </div>
                        </div>
                    );
                    })}
                </div>
                <div className="col-12 col-md-4 d-none d-xl-block">
                    <div className="hfquitbtns">
                    <button className="btn hbtn">4 Cards Quit</button>
                    <button className="btn fbtn selected">50-50 Quit</button>
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
                         <div className="row mt-2 justify-content-center">
                          <div className="col-md-6">
                            <div className="casino-result-desc">
                              <div className="casino-result-desc-item">
                                <div>Winner:</div>
                                <div>{individualResultData?.win == "1" ? "Player A" : "Player B"}</div>
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

export default KBC;
