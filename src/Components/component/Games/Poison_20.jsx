import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
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

const Poison_20 = ({
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

  const [Countdown, setCountdown] = useState(0);

  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [oddsData, setOddsData] = useState([]);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [bet, setBet] = useState(false);

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
      casinoData?.data?.data?.data?.t1?.[0]?.autotime != ""
    ) {
      setCountdown(
        parseInt(casinoData?.data?.data?.data?.t1?.[0]?.autotime || 0)
      );
      setCardData(casinoData?.data?.data?.data?.t1?.[0]);
    }
  }, [casinoData]);


  useEffect(() => {
  if (casinoData?.data?.data?.data?.t2) {
    setOddsData(casinoData.data.data.data.t2);
  }
}, [casinoData]);


const PlayerA = useMemo(()=> {
  return  oddsData.find(p => p.sid == "1")
},[oddsData]);
const PlayerB = useMemo(()=> {
  return  oddsData.find(p => p.sid == "2")
},[oddsData]);



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
  // if (remainingTime == 0 && !casinoSpecialPermission) {
  //   setPlaceBet(false);
  // }

  //call game odd api on the basis of remaining time
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
    // console.log(result);
    switch (result) {
      case "1":
        return "A";
      case "2":
        return "B";
      case "0":
        return "0";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //individual bet history
  const filteredBetHistory = useFilterIndividualBetHistory(
    CasinoBetHistory,
    individualResultData
  );

useEffect(() => {
  if (latestBetData && oddsData.length > 0) {

    const currentOdds = oddsData.find(
      (data) =>
        data.sid === latestBetData.sid ||
        data.sectionId === latestBetData.sid
    );

    if (
      currentOdds &&
      currentOdds.matchOdd !== latestBetDataRef.current.matchOdd &&
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
          min={cardData?.min}
          max={cardData?.max}
          mid={cardData?.mid}
        />
      </div>
      <HeaderTab
        bet={bet}
        setBet={setBet}
        mid={cardData?.mid}
        myCurrentCasinoBets={myCurrentCasinoBets}
      />

      <div className="md:flex relative w-full h-full">
        {!bet && (
          <>
            <div className="center-container">
              <div className="w-full relative">
                <div className="hidden md:block">
                  <Header
                    gameName={item?.gameName}
                    min={cardData?.min}
                    max={cardData?.max}
                    mid={cardData?.mid}
                  />
                </div>
                <div className="casino-video">
                  <Frame item={item} />
                  {/* cards */}
                 <Card cardData={cardData} slug={item.slug}/>
                  {/* Timer */}
                  <div className="absolute bottom-2 right-2">
                    <Timer time={endTime} />
                  </div>
                </div>
              </div>

              {/* odds */}
              {/* Teen 20 Odds Section */}
              {/* odds */}
              <div className="teenpatti-joker casino-detail">
                <div className="casino-table">
                  <div className="casino-table-box">
                    <div className="casino-table-left-box">
                      <div className="casino-table-header">
                        <div className="casino-nation-detail" />
                        <div className="casino-odds-box back">Back</div>
                        <div className="casino-odds-box lay">Lay</div>
                      </div>
                    
                      <div className="casino-table-body">
                       {PlayerA  &&
                        <div className="casino-table-row ">
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">Player A</div>
                          </div>
                          {/* BACK BOX */}
                          <div
                            className={`casino-odds-box back ${PlayerA.gstatus === "SUSPENDED" ? "suspended-box" : ""
                              }`}
                          >
                            {PlayerA.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
                              <span className="casino-odds">{"0"}</span>
                            ) : (
                              <span
                                className="casino-odds cursor-pointer hover:text-blue-700"
                                onClick={() => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: "Back on " + PlayerA?.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: calculateCasinoRate(PlayerA?.b1),
                                    stake: 0,
                                    mid: PlayerA?.mid,
                                    sid: PlayerA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                {calculateCasinoRate(PlayerA.b1)}
                              </span>
                            )}
                          </div>
                          {/* LAY BOX */}
                          <div
                            className={`casino-odds-box lay ${PlayerA.gstatus === "SUSPENDED" ? "suspended-box" : ""
                              }`}
                          >
                            {PlayerA.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
                              <span className="casino-odds">{"0"}</span>
                            ) : (
                              <span
                                className="casino-odds cursor-pointer hover:text-blue-700"
                                onClick={() => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: "Lay on " + PlayerA?.nat,
                                    boxColor: "bg-[#faa9ba]",
                                    matchOdd: calculateCasinoRate(PlayerA?.l1),
                                    stake: 0,
                                    mid: PlayerA?.mid,
                                    sid: PlayerA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Lay",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                {calculateCasinoRate(PlayerA.l1)}
                              </span>
                            )}
                          </div>
                        </div>
                       }
                        {PlayerB &&
                        <div className="casino-table-row">
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">Player B</div>
                          </div>
                         {/* BACK BOX */}
                          <div
                            className={`casino-odds-box back ${PlayerB.gstatus === "SUSPENDED" ? "suspended-box" : ""
                              }`}
                          >
                            {PlayerB.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
                              <span className="casino-odds">{"0"}</span>
                            ) : (
                              <span
                                className="casino-odds cursor-pointer hover:text-blue-700"
                                onClick={() => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: "Back on " + PlayerB?.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: calculateCasinoRate(PlayerB?.b1),
                                    stake: 0,
                                    mid: PlayerB?.mid,
                                    sid: PlayerB?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                {calculateCasinoRate(PlayerB.b1)}
                              </span>
                            )}
                          </div>
                          {/* LAY BOX */}
                          <div
                            className={`casino-odds-box lay ${PlayerB.gstatus === "SUSPENDED" ? "suspended-box" : ""
                              }`}
                          >
                            {PlayerB.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
                              <span className="casino-odds">{"0"}</span>
                            ) : (
                              <span
                                className="casino-odds cursor-pointer hover:text-blue-700"
                                onClick={() => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: "Lay on " + PlayerB?.nat,
                                    boxColor: "bg-[#faa9ba]",
                                    matchOdd: calculateCasinoRate(PlayerB?.l1),
                                    stake: 0,
                                    mid: PlayerA?.mid,
                                    sid: PlayerA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Lay",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                {calculateCasinoRate(PlayerB.l1)}
                              </span>
                            )}
                          </div>
                        </div>
                        } 
                      </div>
                    </div>
                    <div className="casino-table-right-box joker-other-odds">
                      <div className="joker-other-odds">
                        <div className="casino-table-header">
                          <div className="casino-nation-detail" />
                          <div className="casino-odds-box ">Even</div>
                          <div className="casino-odds-box ">Odd</div>
                          <div className="casino-odds-box ">
                            <span>Red</span>
                            <span className="card-icon ms-1">
                              <span className="card-red "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/heart.png"style={{height:"20px",width:"20px"}}></img></span>
                              <span className="card-red "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/diamond.png" style={{height:"20px",width:"20px"}}></img></span>
                            </span>
                          </div>
                          <div className="casino-odds-box">
                            <span>Black</span>
                            <span className="card-icon ms-1">
                              <span className="card-black "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/spade.png"style={{height:"20px",width:"20px"}}></img></span>
                              <span className="card-black "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/club.png"style={{height:"20px",width:"20px"}}></img></span>
                            </span>
                          </div>
                        </div>
                        <div className="casino-table-body">
                          
                           <div className="casino-table-row">
                            <div className="casino-nation-detail">
                              <div className="casino-nation-name">Poison</div>
                            </div>

                            <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "3"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "3"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Even =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "3"
                                  );
                                const newBetData = {
                                  betName: Even?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Even?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Even?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "3"
                              )?.b1 || "0"}
                            </span>
                          </div>

                            <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "4"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "4"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "4"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "4"
                              )?.b1 || "0"}
                            </span>
                          </div>
                            <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "5"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "5"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "5"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "5"
                              )?.b1 || "0"}
                            </span>
                          </div>
                            <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "6"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "6"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "6"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "6"
                              )?.b1 || "0"}
                            </span>
                          </div>
                          </div>
                         
                          
                        </div>
                      </div>
                      <div className="joker-other-odds dtredblack">
                        <div className="casino-table-header">
                          <div className="casino-nation-detail" />
                          <div className="casino-odds-box">
                            <span className="card-icon ms-1">
                              <span className="card-black "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/spade.png"style={{height:"30px",width:"30px"}}></img></span>
                            </span>
                          </div>
                          <div className="casino-odds-box">
                            <span className="card-icon ms-1">
                              <span className="card-red "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/heart.png"style={{height:"30px",width:"30px"}}></img></span>
                            </span>
                          </div>
                          <div className="casino-odds-box">
                            <span className="card-icon ms-1">
                              <span className="card-red "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/diamond.png"style={{height:"30px",width:"30px"}}></img></span>
                            </span>
                          </div>
                          <div className="casino-odds-box">
                            <span className="card-icon ms-1">
                              <span className="card-black "><img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/club.png"style={{height:"30px",width:"30px"}}></img></span>
                            </span>
                          </div>
                        </div>
                        <div className="casino-table-body">
                          <div className="casino-table-row ">
                            <div className="casino-nation-detail">
                              <div className="casino-nation-name">Poison</div>
                            </div>
                            <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "7"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "7"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "7"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "7"
                              )?.b1 || "0"}
                            </span>
                          </div>
                           <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "8"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "8"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "8"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "8"
                              )?.b1 || "0"}
                            </span>
                          </div>
                            <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "9"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "9"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "9"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "9"
                              )?.b1 || "0"}
                            </span>
                          </div>
                           <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "10"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.sid === "10"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const Poison =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "10"
                                  );
                                const newBetData = {
                                  betName: Poison?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: Poison?.b1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: Poison?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "10"
                              )?.b1 || "0"}
                            </span>
                          </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="casino-last-result-title">
                <span>Last Result</span>
                <span>
                  <Link
                    to="/reports/casino-results"
                    className="cursor-pointer"
                    state={{
                      casinoGameSlug: item?.slug,
                    }}
                  >
                    View All
                  </Link>
                </span>
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
                          <div className="col-md-12 text-center">
                          <h4 className="result-title">Poison</h4>
                          <div className="casino-result-cards">
                            <img
                            className="h-[70px]"
                            src={
                              cardsData.find(
                                (v) => v.code === individualResultData?.cards?.split(",")[0]
                              )?.image
                            }
                            alt="poison-card"
                            />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            
                            {/* PLAYER A */}
                            <div className="text-center">
                              <h4 className="result-title font-bold text-lg">Player A</h4>

                              <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
                                {individualResultData?.cards
                                ?.split(",")
                                ?.filter((_, i) => i % 2 !== 0)  // ✔ Player A → odd indexes
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
                                ?.filter((_, i) => i % 2 === 0 && i !== 0) // ✔ Player B → even except 0
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

                          {/* Winner */}
                          <div className="casino-result-desc-item">
                            <div>Winner</div>
                            <div>{individualResultData?.winnat}</div>
                          </div>

                          {/* Odd / Even */}
                          <div className="casino-result-desc-item">
                            <div>Odd/Even</div>
                            <div>{individualResultData?.newdesc?.split("#")[1]}</div>
                          </div>

                          {/* Color */}
                          <div className="casino-result-desc-item">
                            <div>Color</div>
                            <div>{individualResultData?.newdesc?.split("#")[2]}</div>
                          </div>

                          {/* Suit */}
                          <div className="casino-result-desc-item">
                            <div>Suit</div>
                            <div>{individualResultData?.newdesc?.split("#")[3]}</div>
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
                      className={`result cursor-pointer ${item.result == 1 ? "result-a" : "result-b"
                        }`}
                    >
                      {getResultText(item.result)}
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
                    odds={null}
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
          </>
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
                odds={null}
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
      </div>
    </>
  );
};

export default Poison_20;
