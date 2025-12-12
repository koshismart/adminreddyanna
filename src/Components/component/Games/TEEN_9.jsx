import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import Header from "../common/Header";
import { useQuery, useQueryClient } from "react-query";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import cardsData from "../../assets/cards/data";
import useCountdown from "../../hook/useCountdown";
import BetModal from "../common/BetModal";
import PlaceBet from "../common/PlaceBet";
import HeaderTab from "../common/HeaderTab";
import ComplexOdds from "../common/ComplexOdds";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import Card from "../common/Card";

const TEEN_9 = ({
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
      case "11":
        return "T";
      case "21":
        return "L";
      case "31":
        return "D";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBetHistory = useFilterIndividualBetHistory(
    CasinoBetHistory,
    individualResultData
  );

  useEffect(() => {
    if (latestBetData && casinoData?.data?.data?.data?.t2) {
      const currentOdds = casinoData?.data?.data?.data?.t2.find(
        (data) =>
          data.tsection ||
          data.lsection ||
          data.dsectionid === latestBetData.sid
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
            <div className="w-full relative">
              <div className="hidden md:block w-full">
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

            {/* odd */}
            <div className="grid grid-cols-12 border-[1px] border-[#c8c8ca] bg-[#f7f7f7] mt-1 ">
              <div className="col-span-6">
                <div className="md:bg-[#f7f7f7] flex items-center md:min-h-[30px] min-h-[24px] border-b  border-e border-[#c7c8ca]">
                  {Array?.isArray(casinoData?.data?.data?.data?.t1) &&
                    casinoData?.data?.data?.data?.t1?.[0]?.min &&
                    casinoData?.data?.data?.data?.t1?.[0]?.max && (
                      <>
                        <p className="font-semibold md:hidden block mx-2 capitalize text-[10px]">
                          Min:{" "}
                          <span className="me-2">
                            {casinoData?.data?.data?.data?.t1?.[0]?.min}
                          </span>{" "}
                          Max:{" "}
                          <span>
                            {casinoData?.data?.data?.data?.t1?.[0]?.max}
                          </span>
                        </p>{" "}
                      </>
                    )}
                </div>
                {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                  casinoData?.data?.data?.data?.t2?.map((item, idx) => (
                    <div
                      className={`md:bg-[#f7f7f7] min-h-[44px] flex justify-start ps-2 items-center font-semibold uppercase text-xs md:text-sm border-e ${
                        idx !== 5 ? "border-b" : ""
                      } border-[#c7c8ca]`}
                    >
                      {item.nation}
                    </div>
                  ))}
              </div>
              <div className="col-span-6">
                <div className="grid grid-cols-3">
                  <div className="col-span-1">
                    <div className="bg-blue-300 flex justify-center items-center uppercase font-semibold md:text-sm text-xs md:min-h-[30px] min-h-[24px] border-b border-e border-[#c7c8ca]">
                      Tiger
                    </div>
                    {casinoData?.data?.data?.data?.t2?.map((item) => (
                      <div className="relative">
                        {casinoSpecialPermission ? (
                          <div
                            onClick={(e) => {
                              setPlaceBet(true);
                              const newBetData = {
                                betName: "Tiger " + item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.trate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.tsection,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                            className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]"
                          >
                            <h1>{item.trate}</h1>
                            <span className="text-red-600 flex justify-center items-center font-normal">
                              {(() => {
                                const filteredBet =
                                  myCurrentCasinoBets?.currentCasinoBets
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.mid == cardData?.mid
                                    )
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.oddType ===
                                          "casino_odds" &&
                                        doc.currentBet.sid ===
                                          (item?.sid || item.tsection) &&
                                        doc.exposure.isPreviousExposure == false
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                    )?.[0];
                                return filteredBet?.exposure?.exposure;
                              })()}
                            </span>
                          </div>
                        ) : remainingTime <= 3 || !item.tstatus == "False" ? (
                          <>
                            <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <i class="ri-lock-2-fill text-xl"></i>
                              </span>
                            </div>
                            <div className="bg-blue-300 flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]">
                              <h1>{item.trate}</h1>
                              <span className="text-red-600 flex items-end justify-center bottom-0 font-bold z-[11]">
                                {(() => {
                                  const filteredBet =
                                    myCurrentCasinoBets?.currentCasinoBets
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.mid == cardData?.mid
                                      )
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.oddType ===
                                            "casino_odds" &&
                                          doc.currentBet.sid ===
                                            (item?.sid || item.tsection) &&
                                          doc.exposure.isPreviousExposure ==
                                            false
                                      )
                                      .sort(
                                        (a, b) =>
                                          new Date(b.createdAt) -
                                          new Date(a.createdAt)
                                      )?.[0];
                                  return filteredBet?.exposure?.exposure;
                                })()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div
                            onClick={(e) => {
                              setPlaceBet(true);
                              const newBetData = {
                                betName: "Tiger " + item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.trate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.tsection,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                            className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]"
                          >
                            <h1>{item.trate}</h1>
                            <span className="text-red-600 flex justify-center items-center font-normal">
                              {(() => {
                                const filteredBet =
                                  myCurrentCasinoBets?.currentCasinoBets
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.mid == cardData?.mid
                                    )
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.oddType ===
                                          "casino_odds" &&
                                        doc.currentBet.sid ===
                                          (item?.sid || item.tsection) &&
                                        doc.exposure.isPreviousExposure == false
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                    )?.[0];
                                return filteredBet?.exposure?.exposure;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="col-span-1">
                    <div className="bg-blue-300 flex justify-center items-center uppercase font-semibold md:text-sm text-xs md:min-h-[30px] min-h-[24px] border-b border-e border-[#c7c8ca]">
                      Lion
                    </div>
                    {casinoData?.data?.data?.data?.t2?.map((item) => (
                      <div className="relative">
                        {casinoSpecialPermission ? (
                          <div
                            onClick={(e) => {
                              setPlaceBet(true);
                              const newBetData = {
                                betName: "Lion " + item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.lrate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.lsection,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                            className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]"
                          >
                            <h1>{item.lrate}</h1>
                            <span className="text-red-600 flex items-center justify-center bottom-0 font-noraml z-[11]">
                              {(() => {
                                const filteredBet =
                                  myCurrentCasinoBets?.currentCasinoBets
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.mid == cardData?.mid
                                    )
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.oddType ===
                                          "casino_odds" &&
                                        doc.currentBet.sid ===
                                          (item?.sid || item.lsection) &&
                                        doc.exposure.isPreviousExposure == false
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                    )?.[0];
                                return filteredBet?.exposure?.exposure;
                              })()}
                            </span>
                          </div>
                        ) : remainingTime <= 3 || !item.lstatus == "False" ? (
                          <>
                            <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <i class="ri-lock-2-fill text-xl"></i>
                              </span>
                            </div>
                            <div className="bg-blue-300 flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]">
                              <h1>{item.lrate}</h1>
                              <span className="text-red-600 flex items-end justify-center bottom-0 font-bold z-[11]">
                                {(() => {
                                  const filteredBet =
                                    myCurrentCasinoBets?.currentCasinoBets
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.mid == cardData?.mid
                                      )
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.oddType ===
                                            "casino_odds" &&
                                          doc.currentBet.sid ===
                                            (item?.sid || item.lsection) &&
                                          doc.exposure.isPreviousExposure ==
                                            false
                                      )
                                      .sort(
                                        (a, b) =>
                                          new Date(b.createdAt) -
                                          new Date(a.createdAt)
                                      )?.[0];
                                  return filteredBet?.exposure?.exposure;
                                })()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div
                            onClick={(e) => {
                              setPlaceBet(true);
                              const newBetData = {
                                betName: "Lion " + item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.lrate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.lsection,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                            className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]"
                          >
                            <h1>{item.lrate}</h1>
                            <span className="text-red-600 flex items-center justify-center bottom-0 font-noraml z-[11]">
                              {(() => {
                                const filteredBet =
                                  myCurrentCasinoBets?.currentCasinoBets
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.mid == cardData?.mid
                                    )
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.oddType ===
                                          "casino_odds" &&
                                        doc.currentBet.sid ===
                                          (item?.sid || item.lsection) &&
                                        doc.exposure.isPreviousExposure == false
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                    )?.[0];
                                return filteredBet?.exposure?.exposure;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="col-span-1">
                    <div className="bg-blue-300 flex justify-center items-center uppercase font-semibold md:text-sm text-xs md:min-h-[30px] min-h-[24px] border-b border-e border-[#c7c8ca]">
                      Dragon
                    </div>
                    {casinoData?.data?.data?.data?.t2?.map((item) => (
                      <div className="relative">
                        {casinoSpecialPermission ? (
                          <div
                            onClick={(e) => {
                              setPlaceBet(true);
                              const newBetData = {
                                betName: "Dragon " + item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.drate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.dsectionid,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                            className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]"
                          >
                            <h1 className="flex justify-center items-center">
                              {item.drate}
                            </h1>
                            <span className="text-red-600 flex items-center justify-center bottom-0 font-noraml z-[11]">
                              {(() => {
                                const filteredBet =
                                  myCurrentCasinoBets?.currentCasinoBets
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.mid == cardData?.mid
                                    )
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.oddType ===
                                          "casino_odds" &&
                                        doc.currentBet.sid ===
                                          (item?.sid || item.dsectionid) &&
                                        doc.exposure.isPreviousExposure == false
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                    )?.[0];
                                return filteredBet?.exposure?.exposure;
                              })()}
                            </span>
                          </div>
                        ) : remainingTime <= 3 || !item.dstatus == "False" ? (
                          <>
                            <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <i class="ri-lock-2-fill text-xl"></i>
                              </span>
                            </div>
                            <div className="bg-blue-300 flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]">
                              <h1 className="flex justify-center items-center">
                                {item.drate}
                              </h1>
                              <span className="text-red-600 flex items-end justify-end bottom-0 font-noraml z-[11]">
                                {(() => {
                                  const filteredBet =
                                    myCurrentCasinoBets?.currentCasinoBets
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.mid == cardData?.mid
                                      )
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.oddType ===
                                            "casino_odds" &&
                                          doc.currentBet.sid ===
                                            (item?.sid || item.dsectionid) &&
                                          doc.exposure.isPreviousExposure ==
                                            false
                                      )
                                      .sort(
                                        (a, b) =>
                                          new Date(b.createdAt) -
                                          new Date(a.createdAt)
                                      )?.[0];
                                  return filteredBet?.exposure?.exposure;
                                })()}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div
                            onClick={(e) => {
                              setPlaceBet(true);
                              const newBetData = {
                                betName: "Dragon " + item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.drate,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.dsectionid,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                            className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex-col flex justify-center items-center uppercase font-semibold md:text-sm text-xs border-b border-e border-[#c7c8ca] min-h-[44px]"
                          >
                            <h1 className="flex justify-center items-center">
                              {item.drate}
                            </h1>
                            <span className="text-red-600 flex items-center justify-center bottom-0 font-noraml z-[11]">
                              {(() => {
                                const filteredBet =
                                  myCurrentCasinoBets?.currentCasinoBets
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.mid == cardData?.mid
                                    )
                                    ?.filter(
                                      (doc) =>
                                        doc.currentBet.oddType ===
                                          "casino_odds" &&
                                        doc.currentBet.sid ===
                                          (item?.sid || item.dsectionid) &&
                                        doc.exposure.isPreviousExposure == false
                                    )
                                    .sort(
                                      (a, b) =>
                                        new Date(b.createdAt) -
                                        new Date(a.createdAt)
                                    )?.[0];
                                return filteredBet?.exposure?.exposure;
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
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
                          {(() => {
                          const cardList =
                            individualResultData?.cards?.split(",") || [];

                          const TigerCards = cardList.slice(0, 3);
                          const LionCards = cardList.slice(3, 6);
                          const DragonCards = cardList.slice(6, 9);

                          const imgURL = (card) =>
                            `https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`;

                          return (
                            <div className="row mt-3 text-center">

                              {/* TIGER */}
                              <div className="col-md-4">
                                <h4 className="result-title">Tiger</h4>
                                <div className="casino-result-cards">
                                  {TigerCards.map((c, i) => (
                                    <img key={i} src={imgURL(c)} />
                                  ))}
                                </div>
                              </div>

                              {/* LION */}
                              <div className="col-md-4">
                                <h4 className="result-title">Lion</h4>
                                <div className="casino-result-cards">
                                  {LionCards.map((c, i) => (
                                    <img key={i} src={imgURL(c)} />
                                  ))}
                                </div>
                              </div>

                              {/* DRAGON */}
                              <div className="col-md-4">
                                <h4 className="result-title">Dragon</h4>
                                <div className="casino-result-cards relative">
                                  {DragonCards.map((c, i) => (
                                    <img key={i} src={imgURL(c)} />
                                  ))}

                                  {individualResultData?.winnat === "Dragon" && (
                                    <div className="casino-winner-icon">
                                      <i className="fas fa-trophy"></i>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })()}
                          {/* DESCRIPTION BOX (Winner, Under/Over etc) */}
                          <div className="row mt-3 justify-content-center">
                <div className="col-md-6">
                  <div className="casino-result-desc">
                    <div className="casino-result-desc-item">
                      <div>Winner</div>
                      <div>{individualResultData?.winnat}</div>
                    </div>

                    <div className="casino-result-desc-item">
                      <div>Details</div>
                      <div>{individualResultData?.desc}</div>
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

export default TEEN_9;
