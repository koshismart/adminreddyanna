import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import { decodedTokenData, signout } from "../../helpers/auth";
import { useQuery, useQueryClient } from "react-query";
import useCountdown from "../../hook/useCountdown";
import cricketBall from "../../assets/Cricket_ball.svg";
import cardsData from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import PlaceBet from "../common/PlaceBet";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import Header from "../common/Header";
import PlayerOdds from "../common/PlayerOdds";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Frame from "../common/Frame";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import Card from "../common/Card";

const TEEN_20 = ({
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
                   <Card cardData={cardData} slug={item.slug} />
                  {/* Timer */}
                  <div className="absolute bottom-2 right-2">
                    <Timer time={endTime} />
                  </div>
                </div>
              </div>

              {/* odds */}
              {/* Teen 20 Odds Section */}
              {/* odds */}
              <div className="teenpatti20 casino-detail">
                <div className="casino-table">
                  {/* Main Player A vs Player B Section */}
                  <div className="casino-table-box">
                    <div className="casino-table-left-box">
                      <div className="casino-table-header">
                        <div className="casino-nation-detail">Player A</div>
                      </div>
                      <div className="casino-table-body">
                        <div className="casino-table-row">
                          <div className="casino-odds-box">Player A</div>
                          <div className="casino-odds-box">3 Baccarat A</div>
                          <div className="casino-odds-box">Total A</div>
                          <div className="casino-odds-box">Pair Plus A</div>
                        </div>
                        <div className="casino-table-row">
                          {/* Player A */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Player A"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Player A"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const playerA =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "Player A"
                                  );
                                const newBetData = {
                                  betName: playerA?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: playerA?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: playerA?.sid,
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
                                (item) => item.nat === "Player A"
                              )?.rate || "0"}
                            </span>
                          </div>

                          {/* 3 Baccarat A */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "3 Baccarat A"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "3 Baccarat A"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const baccaratA =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "3 Baccarat A"
                                  );
                                const newBetData = {
                                  betName: baccaratA?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: baccaratA?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: baccaratA?.sid,
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
                                (item) => item.nat === "3 Baccarat A"
                              )?.rate || "0"}
                            </span>
                          </div>

                          {/* Total A */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Total A"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Total A"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const totalA =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "Total A"
                                  );
                                const newBetData = {
                                  betName: totalA?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: totalA?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: totalA?.sid,
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
                                (item) => item.nat === "Total A"
                              )?.rate || "0"}
                            </span>
                          </div>

                          {/* Pair Plus A */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Pair Plus A"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Pair Plus A"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const pairPlusA =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "Pair Plus A"
                                  );
                                const newBetData = {
                                  betName: pairPlusA?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: pairPlusA?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: pairPlusA?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">A</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Only - Black/Red A */}
                    <div className="teenpatti20-other-oods d-md-none">
                      <div className="casino-table-left-box">
                        {/* Black A */}
                        <div
                          className={`casino-odds-box back ${
                            remainingTime <= 3 ||
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Black A"
                            )?.gstatus === "0"
                              ? "suspended-box"
                              : "cursor-pointer hover:bg-blue-400"
                          }`}
                          onClick={() => {
                            if (
                              remainingTime > 3 &&
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Black A"
                              )?.gstatus !== "0"
                            ) {
                              setPlaceBet(true);
                              const blackA =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Black A"
                                );
                              const newBetData = {
                                betName: blackA?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: blackA?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: blackA?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }
                          }}
                        >
                          <div>
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/spade.png"
                              alt="spade"
                            />
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/club.png"
                              alt="club"
                            />
                          </div>
                          <div>
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Black A"
                              )?.rate || "0"}
                            </span>
                          </div>
                        </div>

                        {/* Red A */}
                        <div
                          className={`casino-odds-box back ${
                            remainingTime <= 3 ||
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red A"
                            )?.gstatus === "0"
                              ? "suspended-box"
                              : "cursor-pointer hover:bg-blue-400"
                          }`}
                          onClick={() => {
                            if (
                              remainingTime > 3 &&
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Red A"
                              )?.gstatus !== "0"
                            ) {
                              setPlaceBet(true);
                              const redA =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Red A"
                                );
                              const newBetData = {
                                betName: redA?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: redA?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: redA?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }
                          }}
                        >
                          <div>
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/heart.png"
                              alt="heart"
                            />
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/diamond.png"
                              alt="diamond"
                            />
                          </div>
                          <div>
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Red A"
                              )?.rate || "0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="casino-table-right-box">
                      <div className="casino-table-header">
                        <div className="casino-nation-detail">Player B</div>
                      </div>
                      <div className="casino-table-body">
                        <div className="casino-table-row">
                          <div className="casino-odds-box">Player B</div>
                          <div className="casino-odds-box">3 Baccarat B</div>
                          <div className="casino-odds-box">Total B</div>
                          <div className="casino-odds-box">Pair Plus B</div>
                        </div>
                        <div className="casino-table-row">
                          {/* Player B */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Player B"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Player B"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const playerB =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "Player B"
                                  );
                                const newBetData = {
                                  betName: playerB?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: playerB?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: playerB?.sid,
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
                                (item) => item.nat === "Player B"
                              )?.rate || "0"}
                            </span>
                          </div>

                          {/* 3 Baccarat B */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "3 Baccarat B"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "3 Baccarat B"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const baccaratB =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "3 Baccarat B"
                                  );
                                const newBetData = {
                                  betName: baccaratB?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: baccaratB?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: baccaratB?.sid,
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
                                (item) => item.nat === "3 Baccarat B"
                              )?.rate || "0"}
                            </span>
                          </div>

                          {/* Total B */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Total B"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Total B"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const totalB =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "Total B"
                                  );
                                const newBetData = {
                                  betName: totalB?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: totalB?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: totalB?.sid,
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
                                (item) => item.nat === "Total B"
                              )?.rate || "0"}
                            </span>
                          </div>

                          {/* Pair Plus B */}
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Pair Plus B"
                              )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                            onClick={() => {
                              if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Pair Plus B"
                                )?.gstatus !== "0"
                              ) {
                                setPlaceBet(true);
                                const pairPlusB =
                                  casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.nat === "Pair Plus B"
                                  );
                                const newBetData = {
                                  betName: pairPlusB?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: pairPlusB?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: pairPlusB?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">B</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Only - Black/Red B */}
                    <div className="teenpatti20-other-oods d-md-none">
                      <div className="casino-table-right-box">
                        {/* Black B */}
                        <div
                          className={`casino-odds-box back ${
                            remainingTime <= 3 ||
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Black B"
                            )?.gstatus === "0"
                              ? "suspended-box"
                              : "cursor-pointer hover:bg-blue-400"
                          }`}
                          onClick={() => {
                            if (
                              remainingTime > 3 &&
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Black B"
                              )?.gstatus !== "0"
                            ) {
                              setPlaceBet(true);
                              const blackB =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Black B"
                                );
                              const newBetData = {
                                betName: blackB?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: blackB?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: blackB?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }
                          }}
                        >
                          <div>
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/spade.png"
                              alt="spade"
                            />
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/club.png"
                              alt="club"
                            />
                          </div>
                          <div>
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Black B"
                              )?.rate || "0"}
                            </span>
                          </div>
                        </div>

                        {/* Red B */}
                        <div
                          className={`casino-odds-box back ${
                            remainingTime <= 3 ||
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red B"
                            )?.gstatus === "0"
                              ? "suspended-box"
                              : "cursor-pointer hover:bg-blue-400"
                          }`}
                          onClick={() => {
                            if (
                              remainingTime > 3 &&
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Red B"
                              )?.gstatus !== "0"
                            ) {
                              setPlaceBet(true);
                              const redB =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Red B"
                                );
                              const newBetData = {
                                betName: redB?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: redB?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: redB?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }
                          }}
                        >
                          <div>
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/heart.png"
                              alt="heart"
                            />
                            <img
                              src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/diamond.png"
                              alt="diamond"
                            />
                          </div>
                          <div>
                            <span className="casino-odds">
                              {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Red B"
                              )?.rate || "0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Only - Black/Red Section */}
                  <div className="teenpatti20-other-oods d-none d-md-flex">
                    <div className="casino-table-left-box">
                      {/* Black A */}
                      <div
                        className={`casino-odds-box back ${
                          remainingTime <= 3 ||
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Black A"
                          )?.gstatus === "0"
                            ? "suspended-box"
                            : "cursor-pointer hover:bg-blue-400"
                        }`}
                        onClick={() => {
                          if (
                            remainingTime > 3 &&
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Black A"
                            )?.gstatus !== "0"
                          ) {
                            setPlaceBet(true);
                            const blackA =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Black A"
                              );
                            const newBetData = {
                              betName: blackA?.nat,
                              boxColor: "bg-[#72bbef]",
                              matchOdd: blackA?.rate,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: blackA?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }
                        }}
                      >
                        <div>
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/spade.png"
                            alt="spade"
                          />
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/club.png"
                            alt="club"
                          />
                        </div>
                        <div>
                          <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Black A"
                            )?.rate || "0"}
                          </span>
                        </div>
                      </div>

                      {/* Red A */}
                      <div
                        className={`casino-odds-box back ${
                          remainingTime <= 3 ||
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Red A"
                          )?.gstatus === "0"
                            ? "suspended-box"
                            : "cursor-pointer hover:bg-blue-400"
                        }`}
                        onClick={() => {
                          if (
                            remainingTime > 3 &&
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red A"
                            )?.gstatus !== "0"
                          ) {
                            setPlaceBet(true);
                            const redA = casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red A"
                            );
                            const newBetData = {
                              betName: redA?.nat,
                              boxColor: "bg-[#72bbef]",
                              matchOdd: redA?.rate,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: redA?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }
                        }}
                      >
                        <div>
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/heart.png"
                            alt="heart"
                          />
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/diamond.png"
                            alt="diamond"
                          />
                        </div>
                        <div>
                          <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red A"
                            )?.rate || "0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="casino-table-right-box">
                      {/* Black B */}
                      <div
                        className={`casino-odds-box back ${
                          remainingTime <= 3 ||
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Black B"
                          )?.gstatus === "0"
                            ? "suspended-box"
                            : "cursor-pointer hover:bg-blue-400"
                        }`}
                        onClick={() => {
                          if (
                            remainingTime > 3 &&
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Black B"
                            )?.gstatus !== "0"
                          ) {
                            setPlaceBet(true);
                            const blackB =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Black B"
                              );
                            const newBetData = {
                              betName: blackB?.nat,
                              boxColor: "bg-[#72bbef]",
                              matchOdd: blackB?.rate,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: blackB?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }
                        }}
                      >
                        <div>
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/spade.png"
                            alt="spade"
                          />
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/club.png"
                            alt="club"
                          />
                        </div>
                        <div>
                          <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Black B"
                            )?.rate || "0"}
                          </span>
                        </div>
                      </div>

                      {/* Red B */}
                      <div
                        className={`casino-odds-box back ${
                          remainingTime <= 3 ||
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Red B"
                          )?.gstatus === "0"
                            ? "suspended-box"
                            : "cursor-pointer hover:bg-blue-400"
                        }`}
                        onClick={() => {
                          if (
                            remainingTime > 3 &&
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red B"
                            )?.gstatus !== "0"
                          ) {
                            setPlaceBet(true);
                            const redB = casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red B"
                            );
                            const newBetData = {
                              betName: redB?.nat,
                              boxColor: "bg-[#72bbef]",
                              matchOdd: redB?.rate,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: redB?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }
                        }}
                      >
                        <div>
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/heart.png"
                            alt="heart"
                          />
                          <img
                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/diamond.png"
                            alt="diamond"
                          />
                        </div>
                        <div>
                          <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                              (item) => item.nat === "Red B"
                            )?.rate || "0"}
                          </span>
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

export default TEEN_20;
