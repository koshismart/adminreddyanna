import React, { useContext, useEffect, useRef, useState } from "react";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import cricketBall from "../../assets/Cricket_ball.svg";
import useCountdown from "../../hook/useCountdown";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import cardsData from "../../assets/cards/data";
import PlayerOdds from "../common/PlayerOdds";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const Cards32 = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  console.log("my casino data", casinoData);

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
        return "8";
      case "2":
        return "9";
      case "3":
        return "10";
      case "4":
        return "11";
    }
  };
  const getWinner = (data, playerCard) => {
    console.log(data);
    console.log(playerCard);
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
      {!bet && (
         <div className="flex relative w-full h-full">
          <div className="center-container">
            <div className="md:block hidden">
              <Header
                gameName={item?.gameName}
                min={cardData?.min}
                max={cardData?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="casino-video">
              <Frame item={item} />

              <div className="absolute top-0 left-1">
                <div>
                  {/* {console.log(cardData)} */}
                  <h1
                    className={`md:text-xs text-[8px] uppercase font-semibold ${
                      getWinner(cardData, cardData?.C1)
                        ? "text-green-800"
                        : "text-white"
                    } `}
                  >
                    Player 8
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C1}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(0, 1)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        key={cardData.code}
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(0, 1)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(0, 1)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                  <h1
                    className={`md:text-xs text-[8px] uppercase font-semibold ${
                      getWinner(cardData, cardData?.C2)
                        ? "text-green-800"
                        : "text-white"
                    } `}
                  >
                    Player 9
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C2}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(1, 2)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(1, 2)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(1, 2)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                  <h1
                    className={`md:text-xs text-[8px] uppercase font-semibold ${
                      getWinner(cardData, cardData?.C3)
                        ? "text-green-800"
                        : "text-white"
                    } `}
                  >
                    Player 10
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C3}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(2, 3)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(2, 3)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(2, 3)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                  <h1
                    className={`md:text-xs text-[8px] uppercase font-semibold ${
                      getWinner(cardData, cardData?.C4)
                        ? "text-green-800"
                        : "text-white"
                    } `}
                  >
                    Player 11
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C4}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(3, 4)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(3, 4)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(3, 4)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                </div>
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>
            {/* odds */}
            <div className="cards32a casino-detail">
              <div className="casino-table">
                <div className="casino-table-box">
                  {/* Left Box - Players 8 & 9 */}
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.slice(0, 2) 
                          ?.map((item, idx) => (
                            <div className="casino-table-row" key={item.sid}>
                              <div className="casino-nation-detail">
                                <div className="casino-nation-name">
                                  {item.nation}
                                </div>
                                {/* Exposure for Player Name - Show for Players 8 & 9 when betting on Player 8 */}
                                {placeBet &&
                                  betData.stake > 0 &&
                                  betData?.sid === "1" && (
                                    <div
                                      className={
                                        item.sid === "1"
                                          ? "text-green-800"
                                          : "text-red-600"
                                      }
                                    >
                                      {item.sid === "1"
                                        ? betData?.profit !== undefined
                                          ? `+ ${betData?.profit}`
                                          : null
                                        : betData?.loss !== undefined
                                        ? `- ${betData?.loss}`
                                        : null}
                                    </div>
                                  )}
                                {/* Exposure for Player Name - Show for Players 8 & 9 when betting on Player 9 */}
                                {placeBet &&
                                  betData.stake > 0 &&
                                  betData?.sid === "2" && (
                                    <div
                                      className={
                                        item.sid === "2"
                                          ? "text-green-800"
                                          : "text-red-600"
                                      }
                                    >
                                      {item.sid === "2"
                                        ? betData?.profit !== undefined
                                          ? `+ ${betData?.profit}`
                                          : null
                                        : betData?.loss !== undefined
                                        ? `- ${betData?.loss}`
                                        : null}
                                    </div>
                                  )}
                              </div>
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.b1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Back " + item?.nation,
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
                              >
                                <span className="casino-odds">
                                  {remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ? (
                                    <FontAwesomeIcon icon={faLock} />
                                  ) : (
                                    item.b1
                                  )}
                                </span>
                              </div>
                              <div
                                className={`casino-odds-box lay ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.l1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Lay " + item?.nation,
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
                              >
                                <span className="casino-odds">
                                  {remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ? (
                                    <FontAwesomeIcon icon={faLock} />
                                  ) : (
                                    item.l1
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="casino-table-box-divider" />

                  {/* Right Box - Players 10 & 11 */}
                  <div className="casino-table-right-box">
                    <div className="casino-table-header d-none d-md-flex">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.slice(2, 4)
                          ?.map((item, idx) => (
                            <div className="casino-table-row" key={item.sid}>
                              <div className="casino-nation-detail">
                                <div className="casino-nation-name">
                                  {item.nation}
                                </div>
                                {/* Exposure for Player Name - Show for Players 10 & 11 when betting on Player 10 */}
                                {placeBet &&
                                  betData.stake > 0 &&
                                  betData?.sid === "3" && (
                                    <div
                                      className={
                                        item.sid === "3"
                                          ? "text-green-800"
                                          : "text-red-600"
                                      }
                                    >
                                      {item.sid === "3"
                                        ? betData?.profit !== undefined
                                          ? `+ ${betData?.profit}`
                                          : null
                                        : betData?.loss !== undefined
                                        ? `- ${betData?.loss}`
                                        : null}
                                    </div>
                                  )}
                                {/* Exposure for Player Name - Show for Players 10 & 11 when betting on Player 11 */}
                                {placeBet &&
                                  betData.stake > 0 &&
                                  betData?.sid === "4" && (
                                    <div
                                      className={
                                        item.sid === "4"
                                          ? "text-green-800"
                                          : "text-red-600"
                                      }
                                    >
                                      {item.sid === "4"
                                        ? betData?.profit !== undefined
                                          ? `+ ${betData?.profit}`
                                          : null
                                        : betData?.loss !== undefined
                                        ? `- ${betData?.loss}`
                                        : null}
                                    </div>
                                  )}
                              </div>
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.b1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Back " + item?.nation,
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
                              >
                                <span className="casino-odds">
                                  {remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ? (
                                    <FontAwesomeIcon icon={faLock} />
                                  ) : (
                                    item.b1
                                  )}
                                </span>
                              </div>
                              <div
                                className={`casino-odds-box lay ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.l1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Lay " + item?.nation,
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
                              >
                                <span className="casino-odds">
                                  {remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ? (
                                    <FontAwesomeIcon icon={faLock} />
                                  ) : (
                                    item.l1
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </div>
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
                          <div className="flex flex-col gap-2 items-center justify-center">
                            {individualResultData?.cards
                              ?.split(",")
                              ?.slice(0, 4)
                              ?.map((item, index) => (
                                <div className="flex justify-center relative items-center gap-2">
                                  <h1> {`Player ${index + 8} :`}</h1>

                                  <img
                                    className="md:h-[54px] h-[34px] "
                                    src={
                                      cardsData.find((v) => v.code == item)
                                        .image
                                    }
                                  />

                                  {getResultText(individualResultData?.win) ==
                                    index + 8 && (
                                    <div className="absolute text-success text-2xl -right-10 top-1/4 animate-bounce">
                                      <FontAwesomeIcon
                                        style={{ color: "green" }}
                                        icon={faTrophy}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
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

export default Cards32;
