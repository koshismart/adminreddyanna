import React, { useContext, useEffect, useRef, useState } from "react";
import PlaceBet from "../common/PlaceBet";
import Header from "../common/Header";
import HeaderTab from "../common/HeaderTab";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import cardsData, { cardVariant } from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import Card from "../common/Card";

const DRAGON_TIGER_LION_20 = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  // Decode token safely
  const { userId } = cookies.user ? decodedTokenData(cookies.user) || {} : {};

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
  const [tab, setTab] = useState("Dragon");

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
    // console.log(result);
    switch (result) {
      case "1":
        return "D";
      case "21":
        return "T";
      case "41":
        return "L";
    }
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
        <div className="flex w-full relative h-full">
          <div className="center-container">
            <div className="p-2 hidden md:block bg-secondaryBackground text-white">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t2?.[0]?.min}
                max={casinoData?.data?.data?.data?.t2?.[0]?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="casino-video">
              <Frame item={item} />

              {/* card */}
              <Card cardData={cardData} slug={item.slug}/>

              
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* odds */}
            {/* tabs */}
            <div>
              <ul className="whitespace-nowrap flex w-full text-white bg-[#0D7A8E] py-1 md:hidden">
                <li
                  className={`text-lg uppercase text-center w-1/3 font-semibold cursor-pointer my-auto`}
                >
                  <button
                    className={`mx-2  uppercase md:block ${
                      tab == "Dragon" ? "border-t-2" : ""
                    }`}
                    onClick={() => setTab("Dragon")}
                  >
                    Dragon
                  </button>
                </li>
                <li
                  className={`text-lg uppercase text-center border-l w-1/3 font-semibold  cursor-pointer my-auto`}
                >
                  <button
                    className={`mx-4  uppercase ${
                      tab == "Tiger" ? "border-t-2" : ""
                    }`}
                    onClick={() => setTab("Tiger")}
                  >
                    Tiger
                  </button>
                </li>
                <li
                  className={`text-lg text-center uppercase border-l w-1/3 font-semibold  cursor-pointer my-auto`}
                >
                  <button
                    className={`mx-4 uppercase ${
                      tab == "Lion" ? "border-t-2" : ""
                    }`}
                    onClick={() => setTab("Lion")}
                  >
                    Lion
                  </button>
                </li>
              </ul>
            </div>
            {/* odds */}
            {typeof casinoData?.data?.data === "object" &&
            Object.keys(casinoData.data.data).length === 0 ? (
              <>
                <div className="grid grid-cols-12">
                  {/* left */}
                  <div className="col-span-6">
                    <div className="grid grid-cols-12">
                      <div className="md:col-span-6 col-span-8">
                        <div className="md:bg-[#f7f7f7] md:min-h-[28px] min-h-[28px] flex items-center uppercase md:text-sm font-semibold text-xs py-1 border-l border-[#c7c8ca]">
                          <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
                            Min: <span className="me-2">{"100"}</span> Max:{" "}
                            <span>{"100000"}</span>
                          </p>{" "}
                        </div>

                        {[
                          "Winner",
                          "Black",
                          "Red",
                          "Odd",
                          "Even",
                          "1",
                          "2",
                          "3",
                          "4",
                        ].map((item) => {
                          const modifiedNat = item;

                          return (
                            <div className="md:bg-[#f7f7f7] min-h-[44px] flex justify-start ps-2 items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca] border-t-0">
                              {modifiedNat.length == 1 ? (
                                <img
                                  src={
                                    cardVariant.find(
                                      (v) => v.code == modifiedNat
                                    ).image
                                  }
                                  className="h-[34px]"
                                />
                              ) : (
                                modifiedNat
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="md:col-span-6 col-span-4">
                        <div className="grid grid-cols-12">
                          <div
                            className={`md:col-span-4 ${
                              tab == "Dragon" ? "block" : "hidden"
                            }  col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-b border-[#c7c8ca]">
                              Dragon
                            </div>
                            {Array(9)
                              .fill()
                              ?.map((item, index) => {
                                return (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i className="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div
                                      key={index}
                                      className="bg-blue-300 min-h-[44px] flex-col flex md: border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                    >
                                      <h1 className="text-sm font-semibold">
                                        {0}
                                      </h1>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div
                            className={`md:col-span-4 md:block ${
                              tab == "Tiger" ? "block" : "hidden"
                            }  col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Tiger
                            </div>
                            {Array(9)
                              .fill()
                              ?.map((item, index) => {
                                return (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i className="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div
                                      key={index}
                                      className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                    >
                                      <h1 className="text-sm font-semibold">
                                        {0}
                                      </h1>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div
                            className={`md:col-span-4 md:block ${
                              tab == "Lion" ? "block" : "hidden"
                            } col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Lion
                            </div>
                            {Array(9)
                              .fill()
                              ?.map((item, index) => {
                                return (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i className="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div
                                      key={index}
                                      className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                    >
                                      <h1 className="text-sm font-semibold">
                                        {0}
                                      </h1>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* right */}
                  <div className="col-span-6">
                    <div className="grid grid-cols-12">
                      <div className="md:col-span-6 col-span-8">
                        <div className="md:bg-[#f7f7f7] md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                          <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
                            Min: <span className="me-2">{"100"}</span> Max:{" "}
                            <span>{"100000"}</span>
                          </p>{" "}
                        </div>

                        {["5", "6", "7", "8", "9", "10", "J", "Q", "K"].map(
                          (item) => {
                            const modifiedNat = item;

                            return (
                              <div className="md:bg-[#f7f7f7] min-h-[44px] flex  justify-start ps-2 items-center uppercase md:text-sm font-semibold text-xs md:py-1 border-[1px] border-[#c7c8ca] border-t-0">
                                {modifiedNat.length == 1 ||
                                modifiedNat.length == 2 ? (
                                  <img
                                    src={
                                      cardVariant.find(
                                        (v) => v.code == modifiedNat
                                      ).image
                                    }
                                    className="h-[34px]"
                                  />
                                ) : (
                                  modifiedNat
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                      <div className="md:col-span-6 col-span-4">
                        <div className="grid grid-cols-12">
                          <div
                            className={`md:col-span-4 md:block ${
                              tab == "Dragon" ? "block" : "hidden"
                            }  col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Dragon
                            </div>
                            {Array(9)
                              .fill()
                              ?.map((item, index) => {
                                return (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i className="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div
                                      key={index}
                                      className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                    >
                                      <h1 className="text-sm font-semibold">
                                        {0}
                                      </h1>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div
                            className={`md:col-span-4 ${
                              tab == "Tiger" ? "block" : "hidden"
                            } md:block col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Tiger
                            </div>
                            {Array(9)
                              .fill()
                              ?.map((item, index) => {
                                return (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i className="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div
                                      key={index}
                                      className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                    >
                                      <h1 className="text-sm font-semibold">
                                        {0}
                                      </h1>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div
                            className={`md:col-span-4 ${
                              tab == "Lion" ? "block" : "hidden"
                            } md:block col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Lion
                            </div>
                            {Array(9)
                              .fill()
                              ?.map((item, index) => {
                                return (
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i className="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div
                                      key={index}
                                      className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                    >
                                      <h1 className="text-sm font-semibold">
                                        {0}
                                      </h1>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="grid grid-cols-12 gap-1 mt-1">
                  {/* left */}
                  <div className="col-span-6">
                    <div className="grid grid-cols-12">
                      <div className="md:col-span-6 col-span-8">
                        <div className="md:bg-[#f7f7f7] md:min-h-[30px] min-h-[30px] flex  items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                          <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
                            Min:{" "}
                            <span className="me-2">
                              {Array?.isArray(
                                casinoData?.data?.data?.data?.t2
                              ) && casinoData?.data?.data?.data?.t2?.[0]?.min}
                            </span>{" "}
                            Max:{" "}
                            <span>
                              {Array?.isArray(
                                casinoData?.data?.data?.data?.t2
                              ) && casinoData?.data?.data?.data?.t2?.[0]?.max}
                            </span>
                          </p>{" "}
                        </div>

                        {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                          casinoData?.data?.data?.data?.t2
                            ?.filter((v) => v?.nat?.includes("D"))
                            ?.slice(0, 9)
                            ?.map((item) => {
                              const modifiedNat = item.nat
                                ?.replace(/Dragon/g, "")
                                ?.replace(/D/g, "")
                                ?.trim();
                              return (
                                <div className="md:bg-[#f7f7f7] min-h-[44px] flex  justify-start ps-2 items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca] border-t-0">
                                  {modifiedNat.length == 1 ? (
                                    <img
                                      src={
                                        cardVariant.find(
                                          (v) => v.code == modifiedNat
                                        ).image
                                      }
                                      className="h-[34px]"
                                    />
                                  ) : (
                                    modifiedNat
                                  )}
                                </div>
                              );
                            })}
                      </div>
                      <div className="md:col-span-6 col-span-4">
                        <div className="grid grid-cols-12">
                          <div
                            className={`md:col-span-4 ${
                              tab == "Dragon" ? "block" : "hidden"
                            }  col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Dragon
                            </div>
                            {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                              casinoData?.data?.data?.data?.t2
                                ?.filter((v) => v.nat.includes("D"))
                                ?.slice(0, 9)
                                ?.map((item, index) => {
                                  return (
                                    <div className="relative">
                                      {remainingTime <= 3 ||
                                      item.gstatus == "0" ? (
                                        <>
                                          <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                                            <span className="text-white opacity-100">
                                              <i className="ri-lock-2-fill text-xl"></i>
                                            </span>
                                          </div>
                                          <div
                                            key={index}
                                            className="bg-blue-300 min-h-[44px] flex-col flex border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                          >
                                            <h1 className="text-sm font-semibold">
                                              {item.b1}
                                            </h1>
                                            <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
                                              {(() => {
                                                const filteredBets =
                                                  myCurrentCasinoBets?.currentCasinoBets
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet.mid ==
                                                        cardData?.mid
                                                    )
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet
                                                          .oddType ===
                                                          "casino_odds" &&
                                                        doc.currentBet.sid ===
                                                          item?.sid
                                                    );
                                                return filteredBets?.length
                                                  ? filteredBets.reduce(
                                                      (acc, doc) =>
                                                        acc +
                                                        Number(
                                                          doc.currentBet.stake
                                                        ),
                                                      0
                                                    ) * -1
                                                  : null;
                                              })()}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          key={index}
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
                                          className="bg-blue-300 cursor-pointer hover:bg-blue-400  min-h-[44px] flex-col flex border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                        >
                                          <h1 className="text-sm font-semibold">
                                            {item.b1}
                                          </h1>
                                          <span className="text-red-600 flex justify-center items-center font-normal">
                                            {(() => {
                                              const filteredBets =
                                                myCurrentCasinoBets?.currentCasinoBets
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.mid ==
                                                      cardData?.mid
                                                  )
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.oddType ===
                                                        "casino_odds" &&
                                                      doc.currentBet.sid ===
                                                        item?.sid
                                                  );
                                              return filteredBets?.length
                                                ? filteredBets.reduce(
                                                    (acc, doc) =>
                                                      acc +
                                                      Number(
                                                        doc.currentBet.stake
                                                      ),
                                                    0
                                                  ) * -1
                                                : null;
                                            })()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                          </div>
                          <div
                            className={`md:col-span-4 md:block ${
                              tab == "Tiger" ? "block" : "hidden"
                            }  col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-28px] min-h-[28px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Tiger
                            </div>
                            {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                              casinoData?.data?.data?.data?.t2
                                ?.filter((v) => v.nat.includes("T"))
                                ?.slice(0, 9)
                                ?.map((item, index) => {
                                  return (
                                    <div className="relative">
                                      {remainingTime <= 3 ||
                                      item.gstatus == "0" ? (
                                        <>
                                          <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                                            <span className="text-white opacity-100">
                                              <i className="ri-lock-2-fill text-xl"></i>
                                            </span>
                                          </div>
                                          <div
                                            key={index}
                                            className="bg-blue-300 min-h-[44px] flex-col flex border-[1px] border-[#c7c8ca] border-t-0 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                          >
                                            <h1 className="text-sm font-semibold">
                                              {item.b1}
                                            </h1>
                                            <span className="text-red-600 flex justify-center items-end z-[11] font-bold">
                                              {(() => {
                                                const filteredBets =
                                                  myCurrentCasinoBets?.currentCasinoBets
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet.mid ==
                                                        cardData?.mid
                                                    )
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet
                                                          .oddType ===
                                                          "casino_odds" &&
                                                        doc.currentBet.sid ===
                                                          item?.sid
                                                    );
                                                return filteredBets?.length
                                                  ? filteredBets.reduce(
                                                      (acc, doc) =>
                                                        acc +
                                                        Number(
                                                          doc.currentBet.stake
                                                        ),
                                                      0
                                                    ) * -1
                                                  : null;
                                              })()}
                                            </span>
                                          </div>
                                        </>
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
                                          key={index}
                                          className="bg-blue-300 cursor-pointer hover:bg-blue-400  min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                        >
                                          <h1 className="text-sm font-semibold">
                                            {item.b1}
                                          </h1>
                                          <span className="text-red-600 flex justify-center items-center font-normal">
                                            {(() => {
                                              const filteredBets =
                                                myCurrentCasinoBets?.currentCasinoBets
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.mid ==
                                                      cardData?.mid
                                                  )
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.oddType ===
                                                        "casino_odds" &&
                                                      doc.currentBet.sid ===
                                                        item?.sid
                                                  );
                                              return filteredBets?.length
                                                ? filteredBets.reduce(
                                                    (acc, doc) =>
                                                      acc +
                                                      Number(
                                                        doc.currentBet.stake
                                                      ),
                                                    0
                                                  ) * -1
                                                : null;
                                            })()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                          </div>
                          <div
                            className={`md:col-span-4 md:block ${
                              tab == "Lion" ? "block" : "hidden"
                            } col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Lion
                            </div>
                            {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                              casinoData?.data?.data?.data?.t2
                                ?.filter((v) => v.nat.includes("L"))
                                ?.slice(0, 9)
                                ?.map((item, index) => {
                                  return (
                                    <div className="relative">
                                      {remainingTime <= 3 ||
                                      item.gstatus == "0" ? (
                                        <>
                                          <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                                            <span className="text-white opacity-100">
                                              <i className="ri-lock-2-fill text-xl"></i>
                                            </span>
                                          </div>
                                          <div
                                            key={index}
                                            className="bg-blue-300 min-h-[44px] flex-col flex border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                          >
                                            <h1 className="text-sm font-semibold">
                                              {item.b1}
                                            </h1>
                                            <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
                                              {(() => {
                                                const filteredBets =
                                                  myCurrentCasinoBets?.currentCasinoBets
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet.mid ==
                                                        cardData?.mid
                                                    )
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet
                                                          .oddType ===
                                                          "casino_odds" &&
                                                        doc.currentBet.sid ===
                                                          item?.sid
                                                    );
                                                return filteredBets?.length
                                                  ? filteredBets.reduce(
                                                      (acc, doc) =>
                                                        acc +
                                                        Number(
                                                          doc.currentBet.stake
                                                        ),
                                                      0
                                                    ) * -1
                                                  : null;
                                              })()}
                                            </span>
                                          </div>
                                        </>
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
                                          key={index}
                                          className="bg-blue-300 cursor-pointer hover:bg-blue-400  min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                        >
                                          <h1 className="text-sm font-semibold">
                                            {item.b1}
                                          </h1>
                                          <span className="text-red-600 flex justify-center items-center font-normal">
                                            {(() => {
                                              const filteredBets =
                                                myCurrentCasinoBets?.currentCasinoBets
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.mid ==
                                                      cardData?.mid
                                                  )
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.oddType ===
                                                        "casino_odds" &&
                                                      doc.currentBet.sid ===
                                                        item?.sid
                                                  );
                                              return filteredBets?.length
                                                ? filteredBets.reduce(
                                                    (acc, doc) =>
                                                      acc +
                                                      Number(
                                                        doc.currentBet.stake
                                                      ),
                                                    0
                                                  ) * -1
                                                : null;
                                            })()}
                                          </span>
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
                  {/* right */}
                  <div className="col-span-6">
                    <div className="grid grid-cols-12">
                      <div className="md:col-span-6 col-span-8">
                        <div className="md:bg-[#f7f7f7] md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                          <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
                            Min:{" "}
                            <span className="me-2">
                              {Array?.isArray(
                                casinoData?.data?.data?.data?.t2
                              ) && casinoData?.data?.data?.data?.t2?.[0]?.min}
                            </span>{" "}
                            Max:{" "}
                            <span>
                              {Array.isArray(
                                casinoData?.data?.data?.data?.t2
                              ) && casinoData?.data?.data?.data?.t2?.[0]?.max}
                            </span>
                          </p>{" "}
                        </div>

                        {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                          casinoData?.data?.data?.data?.t2
                            ?.filter((v) => v?.nat?.includes("D"))
                            ?.slice(9, 18)
                            ?.map((item) => {
                              const modifiedNat = item.nat
                                ?.replace(/Dragon/g, "")
                                ?.replace(/D/g, "")
                                ?.trim();
                              return (
                                <div className="md:bg-[#f7f7f7]  min-h-[30px] flex justify-start ps-2 items-center uppercase md:text-sm font-semibold text-xs md:py-1 border-[1px] border-[#c7c8ca] border-t-0">
                                  {modifiedNat.length == 1 ||
                                  modifiedNat.length == 2 ? (
                                    <img
                                      src={
                                        cardVariant.find(
                                          (v) => v.code == modifiedNat
                                        ).image
                                      }
                                      className="h-[35px]"
                                    />
                                  ) : (
                                    modifiedNat
                                  )}
                                </div>
                              );
                            })}
                      </div>
                      <div className="md:col-span-6 col-span-4">
                        <div className="grid grid-cols-12">
                          <div
                            className={`md:col-span-4 md:block ${
                              tab == "Dragon" ? "block" : "hidden"
                            }  col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Dragon
                            </div>
                            {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                              casinoData?.data?.data?.data?.t2
                                ?.filter((v) => v.nat.includes("D"))
                                ?.slice(9, 18)
                                ?.map((item, index) => {
                                  return (
                                    <div className="relative">
                                      {remainingTime <= 3 ||
                                      item.gstatus == "0" ? (
                                        <>
                                          <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                                            <span className="text-white opacity-100">
                                              <i className="ri-lock-2-fill text-xl"></i>
                                            </span>
                                          </div>
                                          <div
                                            key={index}
                                            className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                          >
                                            <h1 className="text-sm font-semibold">
                                              {item.b1}
                                            </h1>
                                            <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
                                              {(() => {
                                                const filteredBets =
                                                  myCurrentCasinoBets?.currentCasinoBets
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet.mid ==
                                                        cardData?.mid
                                                    )
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet
                                                          .oddType ===
                                                          "casino_odds" &&
                                                        doc.currentBet.sid ===
                                                          item?.sid
                                                    );
                                                return filteredBets?.length
                                                  ? filteredBets.reduce(
                                                      (acc, doc) =>
                                                        acc +
                                                        Number(
                                                          doc.currentBet.stake
                                                        ),
                                                      0
                                                    ) * -1
                                                  : null;
                                              })()}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          key={index}
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
                                          className="bg-blue-300 cursor-pointer  hover:bg-blue-400  min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                        >
                                          <h1 className="text-sm font-semibold">
                                            {item.b1}
                                          </h1>
                                          <span className="text-red-600 flex justify-center items-center font-normal">
                                            {(() => {
                                              const filteredBets =
                                                myCurrentCasinoBets?.currentCasinoBets
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.mid ==
                                                      cardData?.mid
                                                  )
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.oddType ===
                                                        "casino_odds" &&
                                                      doc.currentBet.sid ===
                                                        item?.sid
                                                  );
                                              return filteredBets?.length
                                                ? filteredBets.reduce(
                                                    (acc, doc) =>
                                                      acc +
                                                      Number(
                                                        doc.currentBet.stake
                                                      ),
                                                    0
                                                  ) * -1
                                                : null;
                                            })()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                          </div>
                          <div
                            className={`md:col-span-4 ${
                              tab == "Tiger" ? "block" : "hidden"
                            } md:block col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Tiger
                            </div>
                            {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                              casinoData?.data?.data?.data?.t2
                                ?.filter((v) => v.nat.includes("T"))
                                ?.slice(9, 18)
                                ?.map((item, index) => {
                                  return (
                                    <div className="relative">
                                      {remainingTime <= 3 ||
                                      item.gstatus == "0" ? (
                                        <>
                                          <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                                            <span className="text-white opacity-100">
                                              <i className="ri-lock-2-fill text-xl"></i>
                                            </span>
                                          </div>
                                          <div
                                            key={index}
                                            className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                          >
                                            <h1 className="text-sm flex justify-center items-center font-semibold">
                                              {item.b1}
                                            </h1>
                                            <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
                                              {(() => {
                                                const filteredBets =
                                                  myCurrentCasinoBets?.currentCasinoBets
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet.mid ==
                                                        cardData?.mid
                                                    )
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet
                                                          .oddType ===
                                                          "casino_odds" &&
                                                        doc.currentBet.sid ===
                                                          item?.sid
                                                    );
                                                return filteredBets?.length
                                                  ? filteredBets.reduce(
                                                      (acc, doc) =>
                                                        acc +
                                                        Number(
                                                          doc.currentBet.stake
                                                        ),
                                                      0
                                                    ) * -1
                                                  : null;
                                              })()}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          key={index}
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
                                          className="bg-blue-300 cursor-pointer  hover:bg-blue-400  min-h-[44px] flex-col flex border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                        >
                                          <h1 className="text-sm  flex justify-center items-center font-semibold">
                                            {item.b1}
                                          </h1>
                                          <span className="text-red-600 flex justify-center items-center font-normal">
                                            {(() => {
                                              const filteredBets =
                                                myCurrentCasinoBets?.currentCasinoBets
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.mid ==
                                                      cardData?.mid
                                                  )
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.oddType ===
                                                        "casino_odds" &&
                                                      doc.currentBet.sid ===
                                                        item?.sid
                                                  );
                                              return filteredBets?.length
                                                ? filteredBets.reduce(
                                                    (acc, doc) =>
                                                      acc +
                                                      Number(
                                                        doc.currentBet.stake
                                                      ),
                                                    0
                                                  ) * -1
                                                : null;
                                            })()}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                          </div>
                          <div
                            className={`md:col-span-4 ${
                              tab == "Lion" ? "block" : "hidden"
                            } md:block col-span-12`}
                          >
                            <div className="bg-blue-300 md:min-h-[30px] min-h-[30px] flex  justify-center items-center uppercase md:text-sm font-semibold text-xs py-1 border-[1px] border-[#c7c8ca]">
                              Lion
                            </div>
                            {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                              casinoData?.data?.data?.data?.t2
                                ?.filter((v) => v.nat.includes("L"))
                                ?.slice(9, 18)
                                ?.map((item, index) => {
                                  return (
                                    <div className="relative">
                                      {remainingTime <= 3 ||
                                      item.gstatus == "0" ? (
                                        <>
                                          <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
                                            <span className="text-white opacity-100">
                                              <i className="ri-lock-2-fill text-xl"></i>
                                            </span>
                                          </div>
                                          <div
                                            key={index}
                                            className="bg-blue-300 min-h-[44px] flex-col flex  border-[1px] border-[#c7c8ca] border-t-0 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                          >
                                            <h1 className="text-sm font-semibold">
                                              {item.b1}
                                            </h1>
                                            <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
                                              {(() => {
                                                const filteredBets =
                                                  myCurrentCasinoBets?.currentCasinoBets
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet.mid ==
                                                        cardData?.mid
                                                    )
                                                    ?.filter(
                                                      (doc) =>
                                                        doc.currentBet
                                                          .oddType ===
                                                          "casino_odds" &&
                                                        doc.currentBet.sid ===
                                                          item?.sid
                                                    );
                                                return filteredBets?.length
                                                  ? filteredBets.reduce(
                                                      (acc, doc) =>
                                                        acc +
                                                        Number(
                                                          doc.currentBet.stake
                                                        ),
                                                      0
                                                    ) * -1
                                                  : null;
                                              })()}
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <div
                                          key={index}
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
                                          className="bg-blue-300 cursor-pointer  hover:bg-blue-400  min-h-[44px] flex-col flex border-[1px] border-[#c7c8ca] border-t-0 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
                                        >
                                          <h1 className="text-sm flex justify-center items-center font-semibold">
                                            {item.b1}
                                          </h1>
                                          <span className="text-red-600 flex justify-center items-center font-normal">
                                            {(() => {
                                              const filteredBets =
                                                myCurrentCasinoBets?.currentCasinoBets
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.mid ==
                                                      cardData?.mid
                                                  )
                                                  ?.filter(
                                                    (doc) =>
                                                      doc.currentBet.oddType ===
                                                        "casino_odds" &&
                                                      doc.currentBet.sid ===
                                                        item?.sid
                                                  );
                                              return filteredBets?.length
                                                ? filteredBets.reduce(
                                                    (acc, doc) =>
                                                      acc +
                                                      Number(
                                                        doc.currentBet.stake
                                                      ),
                                                    0
                                                  ) * -1
                                                : null;
                                            })()}
                                          </span>
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
              </>
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
                <div
                  className="absolute inset-0 bg-gray-900 opacity-50"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                    setIndividualResultData(undefined);
                  }}
                ></div>

                <div className="bg-white md:relative  absolute top-0 w-full z-50  max-w-3xl mx-auto">
                  <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
                    <h2 className="text-xl font-bold">{item.gameName}</h2>
                    <button
                      className="focus:outline-none"
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
                              ?.map((item, idx) => {
                                const cardData = cardsData.find(
                                  (v) => v.code === item
                                );

                                let cardName = "";
                                let winValue = null;

                                if (idx === 0) {
                                  cardName = "Dragon";
                                  winValue = "1";
                                } else if (idx === 1) {
                                  cardName = "Tiger";
                                  winValue = "21";
                                } else if (idx === 2) {
                                  cardName = "Lion";
                                  winValue = "41";
                                }

                                const showTrophy =
                                  individualResultData.win === winValue;

                                return (
                                  <div className="flex relative" key={idx}>
                                    <div className="flex flex-col justify-center items-center">
                                      <h2 className="font-semibold md:text-md text-sm md:mb-2 mb-1 text-black">
                                        {cardName}
                                      </h2>
                                      <img
                                        className="md:h-[54px] h-[35px]"
                                        src={cardData?.image}
                                        alt={cardName}
                                      />
                                    </div>

                                    {showTrophy && (
                                      <div className="absolute text-success md:text-2xl text-xl -right-14 top-1/2 animate-bounce">
                                        <FontAwesomeIcon
                                          style={{ color: "green" }}
                                          icon={faTrophy}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>

                          <div className="flex flex-col justify-center items-center mt-4">
                            <p>
                              <span>{"Result"}: </span>
                              {individualResultData?.desc}
                            </p>
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
            <div
              className={`flex justify-end
                  gap-1 mb-2`}
            >
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

export default DRAGON_TIGER_LION_20;
