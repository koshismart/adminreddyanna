import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import cardsData, { cardShapeForAndarBahar } from "../../assets/cards/data";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import ComplexOdds from "../common/ComplexOdds";
import Frame from "../common/Frame";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import useScrollFixed from "../../hook/useFixed";
import cricketBall from "../../assets/Cricket_ball.svg";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const CasinoWar = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  console.log("my casino war", casinoData);

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
    // console.log(result)
    switch (result) {
      case "":
        return "tie";
      default:
        return "R";
    }
  };
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
          max={100000}
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
                max={100000}
                mid={cardData?.mid}
              />
            </div>
            <div className="casino-video">
              <Frame item={item} />

              {/* card */}

              <div className="absolute top-0 left-1">
                <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
               
               
                </h1>
                {cardsData && cardsData.find((i) => i.code == cardData?.C7) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C7).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C7).name}
                  />
                )}
              </div>
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
              data={casinoData?.data?.data}
            /> */}
            <div>
              {/* odds */}
              {/* odds */}
              {Array.isArray(casinoData?.data?.data?.data?.t2) && (
                <div className="casino-war casino-detail">
                  <div className="casino-table">
                    {/* Card Header Section */}
                    <div className="casino-table-header w-100">
                      <div className="casino-nation-detail" />
                      {[1, 2, 3, 4, 5, 6].map((cardNumber) => (
                        <div key={cardNumber} className="casino-odds-box">
                          <div className="flip-card">
                            <div
                              className={`flip-card-inner ${
                                cardData?.[`C${cardNumber}`] !== "1"
                                  ? "flip"
                                  : ""
                              }`}
                            >
                              <div className="flip-card-front">
                                <img
                                  src="https://g1ver.sprintstaticdata.com/v74/static/front/img/cards/JCC.jpg"
                                  alt={`Card ${cardNumber}`}
                                />
                              </div>
                              <div className="flip-card-back">
                                <img
                                  src={
                                    cardsData.find(
                                      (card) =>
                                        card.code ===
                                        cardData?.[`C${cardNumber}`]
                                    )?.image ||
                                    "https://g1ver.sprintstaticdata.com/v74/static/front/img/cards/1.jpg"
                                  }
                                  alt={`Card ${cardNumber}`}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop View */}
                    <div className="casino-table-full-box d-none d-md-block">
                      <div className="casino-table-header">
                        <div className="casino-nation-detail" />
                        {[1, 2, 3, 4, 5, 6].map((position) => (
                          <div key={position} className="casino-odds-box">
                            {position}
                          </div>
                        ))}
                      </div>

                      <div className="casino-table-body">
                        {/* Winner Row */}
                        <div className="casino-table-row">
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">
                              <span>Winner</span>
                            </div>
                          </div>
                          {[1, 2, 3, 4, 5, 6].map((position) => {
                            const winnerData =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === `Winner ${position}`
                              );
                            return (
                              <div
                                key={position}
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  winnerData?.gstatus === "0"
                                    ? "suspended-box"
                                    : "cursor-pointer hover:bg-blue-400"
                                }`}
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    winnerData?.gstatus !== "0"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: winnerData?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: winnerData?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: winnerData?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">
                                  {winnerData?.b1 || "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Black Row */}
                        {/* Black Row */}
                        <div className="casino-table-row">
                          <div className="casino-nation-detail">
                            <div className="text-black font-semibold">
                              <span>Black</span>
                              <span className="card-icon ms-1">
                                <img
                                  src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/spade.png"
                                  alt="Spade"
                                  className="h-4"
                                />
                              </span>
                              <span className="card-icon ms-1">
                                <img
                                  src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/club.png"
                                  alt="Club"
                                  className="h-4"
                                />
                              </span>
                            </div>
                          </div>
                          {[1, 2, 3, 4, 5, 6].map((position) => {
                            const blackData =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === `Black ${position}`
                              );
                            return (
                              <div
                                key={position}
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  blackData?.gstatus === "0"
                                    ? "suspended-box"
                                    : "cursor-pointer hover:bg-blue-400"
                                }`}
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    blackData?.gstatus !== "0"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: blackData?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: blackData?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: blackData?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">
                                  {blackData?.b1 || "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Red Row */}
                        <div className="casino-table-row">
                          <div className="casino-nation-detail">
                            <div className="text-black font-semibold">
                              <span>Red</span>
                              <span className="card-icon ms-1">
                                <img
                                  src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/heart.png"
                                  alt="Heart"
                                  className="h-4"
                                />
                              </span>
                              <span className="card-icon ms-1">
                                <img
                                  src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/diamond.png"
                                  alt="Diamond"
                                  className="h-4"
                                />
                              </span>
                            </div>
                          </div>
                          {[1, 2, 3, 4, 5, 6].map((position) => {
                            const redData =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === `Red ${position}`
                              );
                            return (
                              <div
                                key={position}
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 || redData?.gstatus === "0"
                                    ? "suspended-box"
                                    : "cursor-pointer hover:bg-blue-400"
                                }`}
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    redData?.gstatus !== "0"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: redData?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: redData?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: redData?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">
                                  {redData?.b1 || "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {/* Odd Row */}
                        <div className="casino-table-row">
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">
                              <span>Odd</span>
                            </div>
                          </div>
                          {[1, 2, 3, 4, 5, 6].map((position) => {
                            const oddData =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === `Odd ${position}`
                              );
                            return (
                              <div
                                key={position}
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 || oddData?.gstatus === "0"
                                    ? "suspended-box"
                                    : "cursor-pointer hover:bg-blue-400"
                                }`}
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    oddData?.gstatus !== "0"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: oddData?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: oddData?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: oddData?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">
                                  {oddData?.b1 || "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Even Row */}
                        <div className="casino-table-row">
                          <div className="casino-nation-detail">
                            <div className="casino-nation-name">
                              <span>Even</span>
                            </div>
                          </div>
                          {[1, 2, 3, 4, 5, 6].map((position) => {
                            const evenData =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === `Even ${position}`
                              );
                            return (
                              <div
                                key={position}
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  evenData?.gstatus === "0"
                                    ? "suspended-box"
                                    : "cursor-pointer hover:bg-blue-400"
                                }`}
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    evenData?.gstatus !== "0"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: evenData?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: evenData?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: evenData?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">
                                  {evenData?.b1 || "0"}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Suit Rows */}
                        {["Spade", "Heart", "Club", "Diamond"].map((suit) => (
                          <div key={suit} className="casino-table-row">
                            <div className="casino-nation-detail">
                              <div className="casino-nation-name">
                                <img
                                  src={`https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/${suit.toLowerCase()}.png`}
                                  alt={suit}
                                />
                              </div>
                            </div>
                            {[1, 2, 3, 4, 5, 6].map((position) => {
                              const suitData =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === `${suit} ${position}`
                                );
                              return (
                                <div
                                  key={position}
                                  className={`casino-odds-box back ${
                                    remainingTime <= 3 ||
                                    suitData?.gstatus === "0"
                                      ? "suspended-box"
                                      : "cursor-pointer hover:bg-blue-400"
                                  }`}
                                  onClick={() => {
                                    if (
                                      remainingTime > 3 &&
                                      suitData?.gstatus !== "0"
                                    ) {
                                      setPlaceBet(true);
                                      const newBetData = {
                                        betName: suitData?.nat,
                                        boxColor: "bg-[#72bbef]",
                                        matchOdd: suitData?.b1,
                                        stake: 0,
                                        mid: cardData?.mid,
                                        sid: suitData?.sid,
                                        oddType: "casino_odds",
                                        oddCategory: "Back",
                                      };
                                      setBetData(newBetData);
                                      setLatestBetData(newBetData);
                                    }
                                  }}
                                >
                                  <span className="casino-odds">
                                    {suitData?.b1 || "0"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="casino-table-full-box d-md-none">
                      <ul
                        className="menu-tabs d-xl-none nav nav-tabs"
                        role="tablist"
                      >
                        {[1, 2, 3, 4, 5, 6].map((position) => (
                          <li
                            key={position}
                            className="nav-item"
                            role="presentation"
                          >
                            <button
                              type="button"
                              id={`casino-war-tab-${position}`}
                              role="tab"
                              data-rr-ui-event-key={position}
                              aria-controls={`casino-war-tabpane-${position}`}
                              aria-selected={position === 1}
                              className={`nav-link ${
                                position === 1 ? "active" : ""
                              }`}
                            >
                              {position}
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="tab-content">
                        {[1, 2, 3, 4, 5, 6].map((position) => (
                          <div
                            key={position}
                            role="tabpanel"
                            id={`casino-war-tabpane-${position}`}
                            aria-labelledby={`casino-war-tab-${position}`}
                            className={`fade tab-pane ${
                              position === 1 ? "active show" : ""
                            }`}
                          >
                            <div className="casino-table-body">
                              <div className="row row5">
                                <div className="col-6">
                                  {/* Winner */}
                                  <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                      <div className="casino-nation-name">
                                        Winner
                                      </div>
                                    </div>
                                    <div
                                      className={`casino-odds-box back ${
                                        remainingTime <= 3 ||
                                        casinoData?.data?.data?.data?.t2?.find(
                                          (item) =>
                                            item.nat === `Winner ${position}`
                                        )?.gstatus === "0"
                                          ? "suspended-box"
                                          : "cursor-pointer hover:bg-blue-400"
                                      }`}
                                      onClick={() => {
                                        const winnerData =
                                          casinoData?.data?.data?.data?.t2?.find(
                                            (item) =>
                                              item.nat === `Winner ${position}`
                                          );
                                        if (
                                          remainingTime > 3 &&
                                          winnerData?.gstatus !== "0"
                                        ) {
                                          setPlaceBet(true);
                                          const newBetData = {
                                            betName: winnerData?.nat,
                                            boxColor: "bg-[#72bbef]",
                                            matchOdd: winnerData?.b1,
                                            stake: 0,
                                            mid: cardData?.mid,
                                            sid: winnerData?.sid,
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
                                          (item) =>
                                            item.nat === `Winner ${position}`
                                        )?.b1 || "0"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Black */}
                                  {/* Black - Mobile */}
                                  <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                      <div className="casino-nation-name">
                                        <span>Black</span>
                                        <span className="card-icon ms-1">
                                          <img
                                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/spade.png"
                                            alt="Spade"
                                            className="h-4"
                                          />
                                        </span>
                                        <span className="card-icon ms-1">
                                          <img
                                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/club.png"
                                            alt="Club"
                                            className="h-4"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className={`casino-odds-box back ${
                                        remainingTime <= 3 ||
                                        casinoData?.data?.data?.data?.t2?.find(
                                          (item) =>
                                            item.nat === `Black ${position}`
                                        )?.gstatus === "0"
                                          ? "suspended-box"
                                          : "cursor-pointer hover:bg-blue-400"
                                      }`}
                                      onClick={() => {
                                        const blackData =
                                          casinoData?.data?.data?.data?.t2?.find(
                                            (item) =>
                                              item.nat === `Black ${position}`
                                          );
                                        if (
                                          remainingTime > 3 &&
                                          blackData?.gstatus !== "0"
                                        ) {
                                          setPlaceBet(true);
                                          const newBetData = {
                                            betName: blackData?.nat,
                                            boxColor: "bg-[#72bbef]",
                                            matchOdd: blackData?.b1,
                                            stake: 0,
                                            mid: cardData?.mid,
                                            sid: blackData?.sid,
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
                                          (item) =>
                                            item.nat === `Black ${position}`
                                        )?.b1 || "0"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Red - Mobile */}
                                  <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                      <div className="">
                                        <span>Red</span>
                                        <span className="card-icon ms-1">
                                          <img
                                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/heart.png"
                                            alt="Heart"
                                            className="h-4"
                                          />
                                        </span>
                                        <span className="card-icon ms-1">
                                          <img
                                            src="https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/diamond.png"
                                            alt="Diamond"
                                            className="h-4"
                                          />
                                        </span>
                                      </div>
                                    </div>
                                    <div
                                      className={`casino-odds-box back ${
                                        remainingTime <= 3 ||
                                        casinoData?.data?.data?.data?.t2?.find(
                                          (item) =>
                                            item.nat === `Red ${position}`
                                        )?.gstatus === "0"
                                          ? "suspended-box"
                                          : "cursor-pointer hover:bg-blue-400"
                                      }`}
                                      onClick={() => {
                                        const redData =
                                          casinoData?.data?.data?.data?.t2?.find(
                                            (item) =>
                                              item.nat === `Red ${position}`
                                          );
                                        if (
                                          remainingTime > 3 &&
                                          redData?.gstatus !== "0"
                                        ) {
                                          setPlaceBet(true);
                                          const newBetData = {
                                            betName: redData?.nat,
                                            boxColor: "bg-[#72bbef]",
                                            matchOdd: redData?.b1,
                                            stake: 0,
                                            mid: cardData?.mid,
                                            sid: redData?.sid,
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
                                          (item) =>
                                            item.nat === `Red ${position}`
                                        )?.b1 || "0"}
                                      </span>
                                    </div>
                                  </div>
                                  {/* Odd */}
                                  <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                      <div className="casino-nation-name">
                                        Odd
                                      </div>
                                    </div>
                                    <div
                                      className={`casino-odds-box back ${
                                        remainingTime <= 3 ||
                                        casinoData?.data?.data?.data?.t2?.find(
                                          (item) =>
                                            item.nat === `Odd ${position}`
                                        )?.gstatus === "0"
                                          ? "suspended-box"
                                          : "cursor-pointer hover:bg-blue-400"
                                      }`}
                                      onClick={() => {
                                        const oddData =
                                          casinoData?.data?.data?.data?.t2?.find(
                                            (item) =>
                                              item.nat === `Odd ${position}`
                                          );
                                        if (
                                          remainingTime > 3 &&
                                          oddData?.gstatus !== "0"
                                        ) {
                                          setPlaceBet(true);
                                          const newBetData = {
                                            betName: oddData?.nat,
                                            boxColor: "bg-[#72bbef]",
                                            matchOdd: oddData?.b1,
                                            stake: 0,
                                            mid: cardData?.mid,
                                            sid: oddData?.sid,
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
                                          (item) =>
                                            item.nat === `Odd ${position}`
                                        )?.b1 || "0"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Even */}
                                  <div className="casino-table-row">
                                    <div className="casino-nation-detail">
                                      <div className="casino-nation-name">
                                        Even
                                      </div>
                                    </div>
                                    <div
                                      className={`casino-odds-box back ${
                                        remainingTime <= 3 ||
                                        casinoData?.data?.data?.data?.t2?.find(
                                          (item) =>
                                            item.nat === `Even ${position}`
                                        )?.gstatus === "0"
                                          ? "suspended-box"
                                          : "cursor-pointer hover:bg-blue-400"
                                      }`}
                                      onClick={() => {
                                        const evenData =
                                          casinoData?.data?.data?.data?.t2?.find(
                                            (item) =>
                                              item.nat === `Even ${position}`
                                          );
                                        if (
                                          remainingTime > 3 &&
                                          evenData?.gstatus !== "0"
                                        ) {
                                          setPlaceBet(true);
                                          const newBetData = {
                                            betName: evenData?.nat,
                                            boxColor: "bg-[#72bbef]",
                                            matchOdd: evenData?.b1,
                                            stake: 0,
                                            mid: cardData?.mid,
                                            sid: evenData?.sid,
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
                                          (item) =>
                                            item.nat === `Even ${position}`
                                        )?.b1 || "0"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-6">
                                  {/* Suits */}
                                  {["Spade", "Club", "Heart", "Diamond"].map(
                                    (suit) => (
                                      <div
                                        key={suit}
                                        className="casino-table-row"
                                      >
                                        <div className="casino-nation-detail">
                                          <div className="casino-nation-name">
                                            <img
                                              src={`https://g1ver.sprintstaticdata.com/v74/static/front/img/icons/${suit.toLowerCase()}.png`}
                                              alt={suit}
                                            />
                                          </div>
                                        </div>
                                        <div
                                          className={`casino-odds-box back ${
                                            remainingTime <= 3 ||
                                            casinoData?.data?.data?.data?.t2?.find(
                                              (item) =>
                                                item.nat ===
                                                `${suit} ${position}`
                                            )?.gstatus === "0"
                                              ? "suspended-box"
                                              : "cursor-pointer hover:bg-blue-400"
                                          }`}
                                          onClick={() => {
                                            const suitData =
                                              casinoData?.data?.data?.data?.t2?.find(
                                                (item) =>
                                                  item.nat ===
                                                  `${suit} ${position}`
                                              );
                                            if (
                                              remainingTime > 3 &&
                                              suitData?.gstatus !== "0"
                                            ) {
                                              setPlaceBet(true);
                                              const newBetData = {
                                                betName: suitData?.nat,
                                                boxColor: "bg-[#72bbef]",
                                                matchOdd: suitData?.b1,
                                                stake: 0,
                                                mid: cardData?.mid,
                                                sid: suitData?.sid,
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
                                              (item) =>
                                                item.nat ===
                                                `${suit} ${position}`
                                            )?.b1 || "0"}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* result start */}
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
              {/* PLAYER A / B CARD SECTION */}
              {/* PLAYER CARD */}
{/* PLAYER A / B CARD SECTION */}
            <div className="row mt-2">

            {(() => {
            const cards = individualResultData?.cards?.split(",") || [];
            const winners = (individualResultData?.win || "").split(","); // ["1","2","5"]

            if (cards.length === 0) return null;

            return (
            <>
            {/* DEALER */}
            <div className="col-md-12 text-center mb-3">
              <h4 className="result-title">Dealer</h4>
              <div className="casino-result-cards relative inline-block">
                <img
                  className="h-[75px]"
                  src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${cards[6]}.jpg`}
                  alt="Dealer Card"
                />
              </div>
            </div>

            {/* PLAYERS 1 to 6 */}
            {cards.slice(0,6).map((card, idx) => {
              const pos = idx + 1; // 1 to 6
              const isWinner = winners.includes(String(pos));

              return (
                <div key={idx} className="col-md-2 text-center mb-3">
                  <h4 className="result-title">{pos}</h4>

                  <div className="casino-result-cards relative inline-block">
                    <img
                      className="h-[75px]"
                      src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`}
                      alt={`Card ${pos}`}
                    />

                    {/* WINNER ICON */}
                    {isWinner && (
                      <div className="casino-winner-icon absolute top-0 right-0">
                        <i className="fas fa-trophy text-yellow-500 text-xl"></i>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </>
            );
            })()}
            </div>



 {/* NEWDESC DETAILS */}
            {(() => {
            const nd = individualResultData?.newdesc || "";
            const parts = nd.split("#");

            const winner = parts[0] || "-";
            const color = parts[1] || "-";
            const oddEven = parts[2] || "-";
            const suit = parts[3] || "-";

            return (
            <div className="row mt-2 justify-content-center">
              <div className="col-md-6">
                <div className="casino-result-desc">

                  <div className="casino-result-desc-item">
                    <div>Winner</div>
                    <div>{winner}</div>
                  </div>

                  <div className="casino-result-desc-item">
                    <div>Color</div>
                    <div>{color}</div>
                  </div>

                  <div className="casino-result-desc-item">
                    <div>Odd / Even</div>
                    <div>{oddEven}</div>
                  </div>

                  <div className="casino-result-desc-item">
                    <div>Suit</div>
                    <div>{suit}</div>
                  </div>

                </div>
              </div>
            </div>
            );
            })()}










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
                      casinoIndividualResult(cookies, item.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
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
                  odds={null}
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
              odds={null}
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

export default CasinoWar;
