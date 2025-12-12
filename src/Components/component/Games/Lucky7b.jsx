import React, { useContext, useEffect, useRef, useState } from "react";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import cardsData, {
  cardShapeForAndarBahar,
  cardVariant,
} from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import PlaceBet from "../common/PlaceBet";
import Header from "../common/Header";
import HeaderTab from "../common/HeaderTab";
import GradientButton from "../common/GradientButton";

import SevenOdds from "../common/SevenOdds";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { getLuckySevenGameData } from "../../helpers/IndividualGameDataHelper";
import { decodedTokenData, signout } from "../../helpers/auth";

const Lucky7b = ({
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

  const [cardData, setCardData] = useState(null);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [bet, setBet] = useState(false);

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
       casinoData?.data?.data?.data?.status === "success" &&
       casinoData?.data?.data?.data?.t1?.[0]
     ) {
       const currentCard = casinoData.data.data.data.t1[0];
   
       setCountdown(parseInt(currentCard.autotime || 0));
       setCardData(currentCard); // ← ab yeh object hai, null se aaya → update hoga pakka!
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

  const desiredOrder = ["Low Card", "Card 7", "High Card"];
  const getResultText = (result) => {
    // console.log(result);
    switch (result) {
      case "1":
        return "L";
      case "2":
        return "H";
      case "0":
        return "T";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //individual game data
  const individualResultDesc = getLuckySevenGameData(
    individualResultData?.desc
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
              {/* cards */}
              <div className="absolute top-2 left-2">
                <img
                  src={cardsData?.find((c) => c.code == cardData?.C1)?.image}
                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                  alt={cardsData?.find((c) => c.code == cardData?.C1)?.name}
                />
              </div>
              {/* Timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>
            {/* odds */}
            {/* odds */}
            {/* odds */}
            {Array.isArray(casinoData?.data?.data?.data?.t2) && (
              <div className=" lucky7a casino-detail">
                <div className="casino-table">
                  {/* Top Section - Low Card, Card 7, High Card */}
                  <div className="casino-table-full-box">
                    {/* Low Card */}
                    <div className="lucky7low">
                      <div className="casino-odds text-center">
                        {casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Low Card"
                        )?.rate || "0"}
                      </div>
                      {remainingTime <= 3 ||
                      casinoData?.data?.data?.data?.t2?.find(
                        (item) => item.nat === "Low Card"
                      )?.gstatus === "0" ? (
                        <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                          <span className="casino-odds">Low Card</span>
                        </div>
                      ) : (
                        <div
                          className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:bg-blue-400"
                          onClick={(e) => {
                            setPlaceBet(true);
                            const lowCardItem =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "Low Card"
                              );
                            const newBetData = {
                              betName: lowCardItem?.nat,
                              boxColor: "bg-[#72bbef]",
                              matchOdd: lowCardItem?.rate,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: lowCardItem?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }}
                        >
                          <span className="casino-odds">Low Card</span>
                        </div>
                      )}
                      <div className="casino-nation-book text-center" />
                    </div>

                    {/* Card 7 */}
                    <div className="lucky7">
                      <img
                        src={cardVariant.find((v) => v.code === "7")?.image}
                        alt="Card 7"
                      />
                    </div>

                    {/* High Card */}
                    <div className="lucky7high">
                      <div className="casino-odds text-center">
                        {casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "High Card"
                        )?.rate || "0"}
                      </div>
                      {remainingTime <= 3 ||
                      casinoData?.data?.data?.data?.t2?.find(
                        (item) => item.nat === "High Card"
                      )?.gstatus === "0" ? (
                        <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                          <span className="casino-odds">High Card</span>
                        </div>
                      ) : (
                        <div
                          className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:bg-blue-400"
                          onClick={(e) => {
                            setPlaceBet(true);
                            const highCardItem =
                              casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.nat === "High Card"
                              );
                            const newBetData = {
                              betName: highCardItem?.nat,
                              boxColor: "bg-[#72bbef]",
                              matchOdd: highCardItem?.rate,
                              stake: 0,
                              mid: cardData?.mid,
                              sid: highCardItem?.sid,
                              oddType: "casino_odds",
                              oddCategory: "Back",
                            };
                            setBetData(newBetData);
                            setLatestBetData(newBetData);
                          }}
                        >
                          <span className="casino-odds">High Card</span>
                        </div>
                      )}
                      <div className="casino-nation-book text-center" />
                    </div>
                  </div>

                  {/* Middle Section - Even/Odd & Red/Black */}
                  <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                      {/* Even */}
                      <div className="lucky7odds">
                        <div className="casino-odds text-center">
                          {casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Even"
                          )?.rate || "0"}
                        </div>
                        {remainingTime <= 3 ||
                        casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Even"
                        )?.gstatus === "0" ? (
                          <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                            <span className="casino-odds">Even</span>
                          </div>
                        ) : (
                          <div
                            className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:bg-blue-400"
                            onClick={(e) => {
                              setPlaceBet(true);
                              const evenItem =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Even"
                                );
                              const newBetData = {
                                betName: evenItem?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: evenItem?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: evenItem?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                          >
                            <span className="casino-odds">Even</span>
                          </div>
                        )}
                        <div className="casino-nation-book text-center" />
                      </div>

                      {/* Odd */}
                      <div className="lucky7odds">
                        <div className="casino-odds text-center">
                          {casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Odd"
                          )?.rate || "0"}
                        </div>
                        {remainingTime <= 3 ||
                        casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Odd"
                        )?.gstatus === "0" ? (
                          <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                            <span className="casino-odds">Odd</span>
                          </div>
                        ) : (
                          <div
                            className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:bg-blue-400"
                            onClick={(e) => {
                              setPlaceBet(true);
                              const oddItem =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Odd"
                                );
                              const newBetData = {
                                betName: oddItem?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: oddItem?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: oddItem?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                          >
                            <span className="casino-odds">Odd</span>
                          </div>
                        )}
                        <div className="casino-nation-book text-center" />
                      </div>
                    </div>

                    <div className="casino-table-right-box">
                      {/* Red */}
                      <div className="lucky7odds">
                        <div className="casino-odds text-center">
                          {casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Red"
                          )?.rate || "0"}
                        </div>
                        {remainingTime <= 3 ||
                        casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Red"
                        )?.gstatus === "0" ? (
                          <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                            <span className="">
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Red")
                                  )[1]?.image
                                }
                                alt="Red Card"
                                className="h-4 my-1 inline"
                              />
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Red")
                                  )[0]?.image
                                }
                                alt="Red Card"
                                className="h-4 my-1 inline"
                              />
                            </span>
                          </div>
                        ) : (
                          <div
                            className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:bg-blue-400"
                            onClick={(e) => {
                              setPlaceBet(true);
                              const redItem =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Red"
                                );
                              const newBetData = {
                                betName: redItem?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: redItem?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: redItem?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                          >
                            <span className="">
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Red")
                                  )[1]?.image
                                }
                                alt="Red Card"
                                className="h-4 my-1 inline"
                              />
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Red")
                                  )[0]?.image
                                }
                                alt="Red Card"
                                className="h-4 my-1 inline"
                              />
                            </span>
                          </div>
                        )}
                        <div className="casino-nation-book text-center" />
                      </div>

                      {/* Black */}
                      <div className="lucky7odds">
                        <div className="casino-odds text-center">
                          {casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nat === "Black"
                          )?.rate || "0"}
                        </div>
                        {remainingTime <= 3 ||
                        casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Black"
                        )?.gstatus === "0" ? (
                          <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                            <span className="">
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Black")
                                  )[1]?.image
                                }
                                alt="Black Card"
                                className="h-4 my-1 inline"
                              />
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Black")
                                  )[0]?.image
                                }
                                alt="Black Card"
                                className="h-4 my-1 inline"
                              />
                            </span>
                          </div>
                        ) : (
                          <div
                            className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:bg-blue-400"
                            onClick={(e) => {
                              setPlaceBet(true);
                              const blackItem =
                                casinoData?.data?.data?.data?.t2?.find(
                                  (item) => item.nat === "Black"
                                );
                              const newBetData = {
                                betName: blackItem?.nat,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: blackItem?.rate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: blackItem?.sid,
                                oddType: "casino_odds",
                                oddCategory: "Back",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                          >
                            <span className="">
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Black")
                                  )[1]?.image
                                }
                                alt="Black Card"
                                className="h-4 my-1 inline"
                              />
                              <img
                                src={
                                  cardShapeForAndarBahar.filter((v) =>
                                    v.lucky.includes("Black")
                                  )[0]?.image
                                }
                                alt="Black Card"
                                className="h-4 my-1 inline"
                              />
                            </span>
                          </div>
                        )}
                        <div className="casino-nation-book text-center" />
                      </div>
                    </div>
                  </div>

                  {/* Card Lines Section */}
                  <div className="casino-table-box mt-3">
                    {/* Line 1: A, 2, 3 */}
                    <div className="lucky7cards">
                      <div className="casino-odds w-100 text-center">
                        {casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Line 1"
                        )?.rate || "0"}
                      </div>
                      <div className="card-odd-box-container">
                        {["A", "2", "3"].map((cardCode, index) => {
                          const cardItem =
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) =>
                                item.nat === "Line 1"
                            );
                          return (
                            <div className="card-odd-box" key={index}>
                              {remainingTime <= 3 ||
                              cardItem?.gstatus === "0" ? (
                                <div className="suspended-box">
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: cardItem?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: cardItem?.rate,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: cardItem?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="casino-nation-book text-center w-100" />
                    </div>

                    {/* Line 2: 4, 5, 6 */}
                    <div className="lucky7cards">
                      <div className="casino-odds w-100 text-center">
                        {casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Line 2"
                        )?.rate || "0"}
                      </div>
                      <div className="card-odd-box-container">
                        {["4", "5", "6"].map((cardCode, index) => {
                          const cardItem =
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) =>
                               item.nat === "Line 2"
                            );
                          return (
                            <div className="card-odd-box" key={index}>
                              {remainingTime <= 3 ||
                              cardItem?.gstatus === "0" ? (
                                <div className="suspended-box">
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: cardItem?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: cardItem?.rate,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: cardItem?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="casino-nation-book text-center w-100" />
                    </div>

                    {/* Line 3: 8, 9, 10 */}
                    <div className="lucky7cards">
                      <div className="casino-odds w-100 text-center">
                        {casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Line 3"
                        )?.rate || "0"}
                      </div>
                      <div className="card-odd-box-container">
                        {["8", "9", "10"].map((cardCode, index) => {
                          const cardItem =
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) =>
                             item.nat === "Line 3"
                            );
                          return (
                            <div className="card-odd-box" key={index}>
                              {remainingTime <= 3 ||
                              cardItem?.gstatus === "0" ? (
                                <div className="suspended-box">
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: cardItem?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: cardItem?.rate,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: cardItem?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="casino-nation-book text-center w-100" />
                    </div>

                    {/* Line 4: J, Q, K */}
                    <div className="lucky7cards">
                      <div className="casino-odds w-100 text-center">
                        {casinoData?.data?.data?.data?.t2?.find(
                          (item) => item.nat === "Line 4"
                        )?.rate || "0"}
                      </div>
                      <div className="card-odd-box-container">
                        {["J", "Q", "K"].map((cardCode, index) => {
                          const cardItem =
                            casinoData?.data?.data?.data?.t2?.find(
                              (item) =>
                                item.nat === "Line 4"
                            );
                          return (
                            <div className="card-odd-box" key={index}>
                              {remainingTime <= 3 ||
                              cardItem?.gstatus === "0" ? (
                                <div className="suspended-box">
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: cardItem?.nat,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: cardItem?.rate,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: cardItem?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code === cardCode
                                      )?.image
                                    }
                                    alt={`Card ${cardCode}`}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="casino-nation-book text-center w-100" />
                    </div>
                  </div>

                  {/* All Cards Section */}
                  <div className="casino-table-full-box lucky7acards mt-3">
                    <div className="casino-odds w-100 text-center">
                      {casinoData?.data?.data?.data?.t2?.find(
                        (item) => item.nat === "Card 1"
                      )?.rate || "0"}
                    </div>
                    {[
                      "1",
                      "2",
                      "3",
                      "4",
                      "5",
                      "6",
                      "7",
                      "8",
                      "9",
                      "10",
                      "J",
                      "Q",
                      "K",
                    ].map((cardCode, index) => {
                      const cardItem = casinoData?.data?.data?.data?.t2?.find(
                        (item) =>
                          item.nat === `Card ${cardCode}` ||
                          item.nation === `Card ${cardCode}`
                      );
                      return (
                        <div className="card-odd-box" key={index}>
                          {remainingTime <= 3 || cardItem?.gstatus === "0" ? (
                            <div className="suspended-box">
                              <img
                                src={
                                  cardVariant.find((v) => v.code === cardCode)
                                    ?.image
                                }
                                alt={`Card ${cardCode}`}
                              />
                            </div>
                          ) : (
                            <div
                              className="cursor-pointer"
                              onClick={(e) => {
                                setPlaceBet(true);
                                const newBetData = {
                                  betName: cardItem?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: cardItem?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: cardItem?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }}
                            >
                              <img
                                src={
                                  cardVariant.find((v) => v.code === cardCode)
                                    ?.image
                                }
                                alt={`Card ${cardCode}`}
                              />
                            </div>
                          )}
                          <div className="casino-nation-book" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

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
<div className="row mt-2">
  <div className="col-md-12 text-center">
    {(() => {
      const cardCode = individualResultData?.cards;  
      const cardImg = cardsData.find((v) => v.code === cardCode)?.image;

      return (
        <div className="casino-result-cards">
          {cardImg ? (
            <img className="h-[60px]" src={cardImg} alt={cardCode} />
          ) : (
            <span className="text-lg font-bold">{cardCode}</span>
          )}
        </div>
      );
    })()}
  </div>
</div>

{/* DESCRIPTION SECTION – 100% DYNAMIC */}
<div className="row mt-2 justify-content-center">
  <div className="col-md-6">
    <div className="casino-result-desc">

      {(() => {
        const titles = ["Winner", "Odd/Even", "Color", "Card", "Line"];

        // newdesc ko split karna
        const values = individualResultData?.newdesc
          ? individualResultData.newdesc.split("#")
          : ["-", "-", "-", "-", "-"];

        return titles.map((title, index) => (
          <div key={index} className="casino-result-desc-item">
            <div>{title}</div>
            <div>{values[index] || "-"}</div>
          </div>
        ));
      })()}

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
              bet={bet}
              game={item.gameName}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Lucky7b;
