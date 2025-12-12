import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PlaceBet from "../common/PlaceBet";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import useCountdown from "../../hook/useCountdown";
import cardsData, { cardShapeForAndarBahar } from "../../assets/cards/data";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import Timer from "../common/Timer";
import CardsUi from "../common/CardsUi";
import Header from "../common/Header";
import HeaderTab from "../common/HeaderTab";
import ComplexOdds from "../common/ComplexOdds";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { getDragonGameData } from "../../helpers/IndividualGameDataHelper";
import { decodedTokenData, isAuthenticated, signout } from "../../helpers/auth";
import { getSocket } from "../../utils/socketClient";
import useWhiteListData from "../../hook/useWhiteListData";
import Card from "../common/Card";

const DRAGON_TIGER_6 = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // Decode token safely
  const { userId } = cookies.token ? decodedTokenData(cookies) || {} : {};
  const { token } = isAuthenticated(cookies);

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


  // const [casinoData, setCasinoData] = useState(null);
  // const [toptenResult,setToptenResult]=useState(null);

  // useEffect(() => {
  //   if(!item?.slug ||!userId ||!token) return;
  //     const socket = getSocket(userId);
  //     if (!socket) return;
  //     const roomName = `${userId}:${item.slug}`;

  //     const joinRoom = () => {
  //       socket.emit("joinCasinoEvent", userId, item?.slug, token);
  //       console.log("Joined room:", roomName);
  //     };

  //     const handleGameData = (data) => {
  //       setCasinoData(data);
  //       // setToptenResult(data);
  //     };

  //     const handleConnect = () => {
  //       console.log("Socket connected/reconnected");
  //       joinRoom();
  //     };

  //     const handleOnline = () => {
  //       console.log("Browser online, forcing socket reconnect");
  //       if (!socket.connected) {
  //         console.log("Browser online, forcing socket reconnect");
  //         socket.connect();
  //       } else {
  //         joinRoom();
  //       }
  //     };

  //     const handleVisibilityChange = () => {
  //       if (document.visibilityState === "visible") joinRoom();
  //     };

  //     // Clean up BEFORE adding listeners
  //     socket.off("casinoGameData", handleGameData);
  //     socket.off("connect", handleConnect);

  //     // Add listeners
  //     socket.on("casinoGameData", handleGameData);
  //     socket.on("connect", handleConnect);
  //     window.addEventListener("online", handleOnline);
  //     document.addEventListener("visibilitychange", handleVisibilityChange);

  //     // Join if already connected
  //     if (socket.connected) joinRoom();

  //     return () => {
  //       console.log("Leaving room:", roomName);
  //       socket.emit("leaveCasinoEvent", userId, item.slug, token);

  //       socket.off("casinoGameData", handleGameData);
  //       socket.off("connect", handleConnect);
  //       window.removeEventListener("online", handleOnline);
  //       document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     };
  //   }, [userId, item?.slug]);

  // const {
  //   isLoading: isLoadingOdds,
  //   data: casinoDataFromApi,
  //   isSuccess: isSuccessOdds,
  //   refetch: refetchOdds,
  // } = useQuery(
  //   ["casinoGameOdds", { cookies, slug: item?.slug }],
  //   () => casinoGameOdds(cookies, item?.slug),
  //   {
  //     keepPreviousData: true, // Add this option
  //   }
  // );

  // useEffect(() => {
  //   if (casinoDataFromApi && casinoDataFromApi?.data) {
  //     setCasinoData(casinoDataFromApi);
  //   }
  // }, [casinoDataFromApi]);

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

  // console.log({toptenResult})

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
    // casinoData?.error === "Token has expired" ||
    // casinoData?.error === "Invalid token" ||
    IndividualResult?.error === "Token has expired" ||
    IndividualResult?.error === "Invalid token"
  ) {
    // console.log("signout call")
    // signout(userId, removeCookie, () => {
    //   navigate("/sign-in");
    //   return null;
    // });
  }

  useEffect(() => {
    if (
      casinoData &&
      casinoData?.data?.data?.data &&
      casinoData?.data?.data?.data?.status !== "error" &&
      casinoData?.data?.data?.data?.t1?.[0].autotime != ""
    ) {
      setCountdown(
        parseInt(casinoData?.data?.data?.data?.t1?.[0]?.autotime || 0)
      );
      setCardData(casinoData?.data?.data?.data?.t1?.[0]);
    }
  }, [casinoData]);

  const handleCountdownEnd = () => {
    // queryClient.invalidateQueries([
    //   "casinoGameOdds",
    //   { cookies, slug: item?.slug },
    // ]);

    refetchCurrentBets();

    refetchCasinoBetHistory();

    // queryClient.invalidateQueries([
    //   "casinoGameTopTenResult",
    //   { cookies, slug: item?.slug },
    // ]);
  };

  // const remainingTime = useCountdown(Countdown, handleCountdownEnd);
  // const endTime = new Date().getTime() + remainingTime * 1000;
  const { remainingTime, endTime } = useCountdown(
    Countdown,
    handleCountdownEnd
  );

  if (
    // remainingTime==0||
    remainingTime == 35 ||
    remainingTime == 30 ||
    remainingTime == 20 ||
    remainingTime == 25 ||
    remainingTime == 15 ||
    remainingTime == 10
  ) {
    // queryClient.invalidateQueries([
    //   "casinoGameOdds",
    //   { cookies, slug: item?.slug },
    // ]);
    // queryClient.invalidateQueries([
    //   "casinoGameTopTenResult",
    //   { cookies, slug: item?.slug },
    // ]);
    refetchCurrentBets();
    refetchCasinoBetHistory();
  }

  const getResultText = (result) => {
    switch (result) {
      case "1":
        return "D";
      case "2":
        return "T";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateProfitLoss = (currentBets, item) => {
    let totalProfitLoss = 0;

    currentBets?.currentCasinoBets?.forEach((bet, index) => {
      const { oddCategory, profit, loss, sid } = bet?.currentBet;

      const adjustment =
        oddCategory === "Back" ? Number(profit) : -Number(loss);

      if (["1", "2"].includes(sid)) {
        if (sid === item?.sid || sid === item?.sectionId) {
          totalProfitLoss += adjustment;
        } else {
          totalProfitLoss -=
            oddCategory === "Back" ? Number(loss) : -Number(profit);
        }
      }
    });

    return (
      <span
        className={`${
          totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
        } mr-6`}
      >
        {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
      </span>
    );
  };

  //individual game data
  const individualResultDesc = getDragonGameData(individualResultData?.desc);

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
            <div className="md:block hidden">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t2?.[0]?.min}
                max={casinoData?.data?.data?.data?.t2?.[0]?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="casino-video">
              <Frame item={item} />


              <Card cardData={cardData} slug={item.slug}/>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>
            {/* ComplexOdds */}
            {/* {console.log(casinoData?.data?.data?.data?.t2)} */}

            {/* top */}
            <div className="dt1day casino-detail">
              <div className="casino-table">
                {/* Top Section */}
                <div className="casino-table-box">
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          .filter((v) => ["1", "2"].includes(v.sid))
                          .map((item) => (
                            <div className="casino-table-row" key={item.sid}>
                              <div className="casino-nation-detail">
                                <div className="casino-nation-name">
                                  {item?.nat}
                                </div>
                              </div>
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item.gstatus == "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                              >
                                {remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED" ? (
                                  <span className="casino-odds">0</span>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      if (item.b1 !== 0) {
                                        setPlaceBet(true);
                                        const newBetData = {
                                          betName: item?.nat,
                                          boxColor: "bg-[#72bbef]",
                                          matchOdd: item?.b1,
                                          stake: 0,
                                          mid: cardData?.mid,
                                          sid: item?.sid,
                                          oddType: "casino_odds",
                                          oddCategory: "Back",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                      }
                                    }}
                                    className="casino-odds cursor-pointer"
                                  >
                                    {item.b1}
                                  </div>
                                )}
                              </div>
                              <div
                                className={`casino-odds-box lay ${
                                  remainingTime <= 3 ||
                                  item.gstatus == "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                              >
                                {remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED" ? (
                                  <span className="casino-odds">0</span>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      if (item.l1 !== "0.00") {
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
                                      }
                                    }}
                                    className="casino-odds cursor-pointer"
                                  >
                                    {item.l1}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                  <div className="casino-table-right-box dtpair">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter((v) => v.nat.includes("Pair"))
                      ?.map((item) => (
                        <div key={item.sid}>
                          <div className="casino-odds text-center ">
                            {item.b1}
                          </div>
                          <div
                            className={`casino-odds-box back casino-odds-box-theme ${
                              remainingTime <= 3 || item.gstatus == "SUSPENDED"
                                ? "suspended-box"
                                : ""
                            }`}
                          >
                            {remainingTime <= 3 ||
                            item.gstatus == "SUSPENDED" ? (
                              <span className="casino-odds">0</span>
                            ) : (
                              <div
                                onClick={(e) => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: item?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                                className="casino-odds cursor-pointer"
                              >
                                {item.nat}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Middle Section - Even/Odd and Red/Black */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Even</div>
                      <div className="casino-odds-box back">Odd</div>
                    </div>
                    <div className="casino-table-body">
                      {["Dragon", "Tiger"].map((nation) => (
                        <div className="casino-table-row" key={nation}>
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">{nation}</div>
                          </div>
                          {["Even", "Odd"].map((type) => {
                            const item = casinoData?.data?.data?.data?.t2?.find(
                              (v) => v.nat.includes(`${nation} ${type}`)
                            );
                            return (
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item?.gstatus == "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                key={type}
                              >
                                {remainingTime <= 3 ||
                                item?.gstatus == "SUSPENDED" ? (
                                  <span className="casino-odds">0</span>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      if (item?.b1) {
                                        setPlaceBet(true);
                                        const newBetData = {
                                          betName: item?.nat,
                                          boxColor: "bg-[#72bbef]",
                                          matchOdd: item?.b1,
                                          stake: 0,
                                          mid: cardData?.mid,
                                          sid: item?.sid,
                                          oddType: "casino_odds",
                                          oddCategory: "",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                      }
                                    }}
                                    className="casino-odds cursor-pointer"
                                  >
                                    {item?.b1 || "0"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="casino-table-right-box dtredblack">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">
                        <span>Red</span>
                        <span className="card-icon ms-1">
                          <img
                            className="h-[10px]"
                            src={
                              cardShapeForAndarBahar.filter(
                                (v) => v.lucky == "Red"
                              )[0]?.image
                            }
                            alt="Heart"
                          />
                        </span>
                        <span className="card-icon ms-1">
                          <img
                            className="h-[10px]"
                            src={
                              cardShapeForAndarBahar.filter(
                                (v) => v.lucky == "Red"
                              )[1]?.image
                            }
                            alt="Diamond"
                          />
                        </span>
                      </div>
                      <div className="casino-odds-box back">
                        <span>Black</span>
                        <span className="card-icon ms-1">
                          <img
                            className="h-[10px]"
                            src={
                              cardShapeForAndarBahar.filter(
                                (v) => v.lucky == "Black"
                              )[0]?.image
                            }
                            alt="Club"
                          />
                        </span>
                        <span className="card-icon ms-1">
                          <img
                            className="h-[10px]"
                            src={
                              cardShapeForAndarBahar.filter(
                                (v) => v.lucky == "Black"
                              )[1]?.image
                            }
                            alt="Spade"
                          />
                        </span>
                      </div>
                    </div>
                    <div className="casino-table-body">
                      {["Dragon", "Tiger"].map((nation) => (
                        <div className="casino-table-row" key={nation}>
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">{nation}</div>
                          </div>
                          {["Red", "Black"].map((color) => {
                            const item = casinoData?.data?.data?.data?.t2?.find(
                              (v) => v.nat.includes(`${nation} ${color}`)
                            );
                            return (
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item?.gstatus == "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                key={color}
                              >
                                {remainingTime <= 3 ||
                                item?.gstatus == "SUSPENDED" ? (
                                  <span className="casino-odds">0</span>
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      if (item?.b1) {
                                        setPlaceBet(true);
                                        const newBetData = {
                                          betName: item?.nat,
                                          boxColor: "bg-[#72bbef]",
                                          matchOdd: item?.b1,
                                          stake: 0,
                                          mid: cardData?.mid,
                                          sid: item?.sid,
                                          oddType: "casino_odds",
                                          oddCategory: "",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                      }
                                    }}
                                    className="casino-odds cursor-pointer"
                                  >
                                    {item?.b1 || "0"}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Section - Card Suits */}
                <div className="casino-table-full-box dt1day-other-odds mt-3">
                  <div className="casino-table-header">
                    <div className="casino-nation-detail" />
                    {["Heart", "Diamond", "Club", "Spade"].map((suit) => (
                      <div className="casino-odds-box" key={suit}>
                        <span className="card-icon ms-1">
                          <img
                            className="h-[15px]"
                            src={
                              cardShapeForAndarBahar.find(
                                (v) => v.dragonT === suit
                              )?.image
                            }
                            alt={suit}
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="casino-table-body">
                    {["Dragon", "Tiger"].map((nation) => (
                      <div className="casino-table-row" key={nation}>
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">{nation}</div>
                        </div>
                        {["Heart", "Diamond", "Club", "Spade"].map((suit) => {
                          const item = casinoData?.data?.data?.data?.t2?.find(
                            (v) => v.nat.includes(`${nation} ${suit}`)
                          );
                          return (
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 ||
                                item?.gstatus == "SUSPENDED"
                                  ? "suspended-box"
                                  : ""
                              }`}
                              key={suit}
                            >
                              {remainingTime <= 3 ||
                              item?.gstatus == "SUSPENDED" ? (
                                <span className="casino-odds">0</span>
                              ) : (
                                <div
                                  onClick={(e) => {
                                    if (item?.b1) {
                                      setPlaceBet(true);
                                      const newBetData = {
                                        betName: item?.nat,
                                        boxColor: "bg-[#72bbef]",
                                        matchOdd: item?.b1,
                                        stake: 0,
                                        mid: cardData?.mid,
                                        sid: item?.sid,
                                        oddType: "casino_odds",
                                        oddCategory: "",
                                      };
                                      setBetData(newBetData);
                                      setLatestBetData(newBetData);
                                    }
                                  }}
                                  className="casino-odds cursor-pointer"
                                >
                                  {item?.b1 || "0"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Last Results Section */}
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
                  <div
                    className="absolute inset-0 bg-gray-900 opacity-50"
                    onClick={() => {
                      setIsModalOpen(!isModalOpen);
                      setIndividualResultData(undefined);
                    }}
                  ></div>

                  <div
                    className={`bg-white md:relative  absolute top-0 w-full z-50  max-w-3xl mx-auto`}
                  >
                    <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
                      <h2 className="text-xl font-bold">{item.gameName}</h2>
                      <button
                        className=" focus:outline-none"
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setIndividualResultData(undefined);
                        }}
                      >
                        <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
                      </button>
                    </div>
                    {individualResultData ? (
                      <div className="my-3 w-full ">
                        <div>
                          <h4 className=" flex justify-end items-center text-sm font-semibold px-2">
                            Round Id:{individualResultData?.mid}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 place-items-center my-4">
                          <div className="col-span-1 w-full place-items-start relative">
                            <div className="flex gap-2 items-center justify-around">
                              {individualResultData?.cards
                                ?.split(",")
                                ?.slice(0, 3)
                                ?.map((item, idx) => (
                                  <div className="flex relative ">
                                    <div className="flex flex-col justify-center items-center">
                                      <h2 className="font-semibold md:text-md text-sm md:mb-2 mb-1 text-black">
                                        {idx == 0 ? "Dragon" : "Tiger"}
                                      </h2>
                                      <img
                                        className="md:h-[54px] h-[34px] "
                                        src={
                                          cardsData.find((v) => v.code == item)
                                            .image
                                        }
                                      />
                                    </div>
                                    {idx + 1 == individualResultData.win && (
                                      <div className="absolute text-success md:text-2xl text-xl -right-14 top-1/2 animate-bounce">
                                        <FontAwesomeIcon
                                          style={{ color: "green" }}
                                          icon={faTrophy}
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                            {/* {console.log(individualResultData?.desc)} */}
                            <div className="flex flex-col justify-center items-center mt-4">
                              <div className="flex flex-col justify-center items-center mt-4">
                                {/* {individualResultData?.desc
                                ?.split("*")
                                .map((item, index) => {
                                  const parts = item.split("|");
                                  const label = parts[0];
                                  const details = parts.slice(1).join(" | ");

                                  const displayLabel =
                                    index === 0
                                      ? "Result"
                                      : index === 1
                                      ? "Dragon"
                                      : "Tiger";
                                  console.log(displayLabel);
                                  return (
                                    <p key={index}>
                                      {index === 0 ? (
                                        `Result: ${label}`
                                      ) : (
                                        <span>{displayLabel}: </span>
                                      )}
                                      {details}
                                    </p>
                                  );
                                })} */}
                                {/* <IndividualResultDesc data={individualResultData?.desc}/> */}

                                {individualResultDesc && (
                                  <div className="shadow-2xl border border-1 p-4 ">
                                    <div className="flex flex-col">
                                      <div className="text-black/60 text-md font-normal">
                                        Winner :
                                        <span className="mx-1 text-black">
                                          {individualResultDesc.winner}
                                        </span>
                                      </div>

                                      <div className="text-black/60 text-md font-normal">
                                        Pair :
                                        <span className="mx-1 text-black">
                                          {individualResultDesc.pair}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-black/60 text-md font-normal">
                                      Odd/Even:
                                      <span className="mx-1 text-black">
                                        D: {individualResultDesc.dType}
                                      </span>
                                      |
                                      <span className="mx-1 text-black">
                                        T: {individualResultDesc.tType}
                                      </span>
                                    </div>
                                    <div className="text-black/60 text-md font-normal">
                                      Color:
                                      <span className="mx-1 text-black">
                                        D: {individualResultDesc.dColor}
                                      </span>
                                      |
                                      <span className="mx-1 text-black">
                                        T: {individualResultDesc.tColor}
                                      </span>
                                    </div>
                                    <div className="text-black/60 text-md font-normal">
                                      Suit:
                                      <span className="mx-1 text-black">
                                        D: {individualResultDesc.dSuit}
                                      </span>
                                      |
                                      <span className="mx-1 text-black">
                                        T: {individualResultDesc.tSuit}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* table */}
                        <div>
                          {!filteredBetHistory.length <= 0 && (
                            <IndividualBetHistoryTable
                              data={filteredBetHistory}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex justify-center items-center my-4">
                        <i className="fa fa-spinner fa-spin"/>
                      </div>
                    )}
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
                  <>
                    <span className="result result-b">T</span>
                    <span className="result result-a">D</span>
                  </>
                )}
              </div>
              {/* result end */}
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
                  odds={casinoData?.data?.data?.data?.t2}
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
              odds={casinoData?.data?.data?.data?.t2}
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

export default DRAGON_TIGER_6;
