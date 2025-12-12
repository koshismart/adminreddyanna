import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import {
  // casinoGameOdds,
  casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import cardsData from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
import Frame from "../common/Frame";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import Chart from "../common/Chart";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const Baccrat2 = ({
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

  const {
    isLoading: isLoadingTopTenResult,
    data: toptenResult,
    isSuccess: isSuccessTopTenResult,
    refetch: refetchTopTenResult,
  } = useQuery(
    ["casinoGameTopTenResult", { cookies, slug: item?.slug }],
    () => casinoGameTopTenResult(cookies, item?.slug),
    {
      keepPreviousData: true, // Add this option
    }
  );

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
    toptenResult?.error === "Token has expired" ||
    toptenResult?.error === "Invalid token" ||
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

  const filteredData = [
    "Player Pair",
    "Player",
    "Tie",
    "Banker",
    "Banker Pair",
  ];

  const getResultText = (result) => {
    // console.log(result);
    switch (result) {
      case "1":
        return "P";
      case "2":
        return "B";
      case "3":
        return "T";
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
        <div className="flex relative w-full h-full">
          <div className="center-container">
            <div className="p-2 hidden md:block bg-secondaryBackground text-white">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t2?.[0]?.min}
                max={casinoData?.data?.data?.data?.t2?.[0]?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="w-full relative">
              <Frame item={item} />

              {/* card */}

              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* ComplexOdds
             */}
            {Array.isArray(casinoData?.data?.data?.data?.t2) && (
              <div>
                <div className=" bg-gray-300 my-1 ">
                  <div className="md:col-span-4 col-span-12 md:hidden flex flex-col justify-start items-center">
                    <h2 className="font-semibold ">Statistics</h2>
                    {/* {console.log(toptenResult?.data?.data?.graphdata)} */}
                    <Chart data={toptenResult} />
                  </div>
                  <div className="place-items-end grid grid-cols-12">
                    <div className="md:col-span-1 md:block col-span-0 hidden"></div>
                    <div className="col-span-12 md:col-span-11">
                      <div className="grid grid-cols-5 gap-2 place-items-end">
                        {casinoData?.data?.data?.data?.t2
                          ?.filter((v) => v.nat.includes("Score"))
                          ?.map((item) => (
                            <div className="flex flex-col md:px-0 px-[2px]">
                              <div className="border relative bg-secondaryBackground min-h-[40px] min-w-[84px]   border-gray-800 text-xs md:px-2 px-3">
                                {/* {console.log(item)} */}
                                {remainingTime <= 3 || item.gstatus == "0" ? (
                                  <>
                                    <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                      <span className="text-white opacity-100">
                                        <i class="ri-lock-2-fill text-xl"></i>
                                      </span>
                                    </div>
                                    <div className="text-white justify-center items-center text-wrap md:flex flex-col md:py-1">
                                      {/* <span className="text-nowrap text-center"> */}
                                      {item.nat}
                                      <span className="text-center">
                                        {item.b1}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {" "}
                                    <div
                                      onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                          betName: item?.nat,
                                          boxColor: "bg-[#B2D6F0]",
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
                                      className="text-white justify-center items-center text-wrap md:flex flex-col md:py-1"
                                    >
                                      {/* <span className="text-nowrap text-center"> */}
                                      {item.nat}
                                      {/* </span> */}
                                      <div className="text-center">
                                        {item.b1}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              <h1 className="text-sm flex justify-center items-center relative">
                                <span className="text-red-600 absolute -bottom-6 flex justify-center items-center font-bold">
                                  {(() => {
                                    const filteredBets =
                                      myCurrentCasinoBets?.currentCasinoBets
                                        ?.filter(
                                          (doc) =>
                                            doc.currentBet.mid == cardData?.mid
                                        )
                                        ?.filter(
                                          (doc) =>
                                            doc.currentBet.oddType ===
                                              "casino_odds" &&
                                            doc.currentBet.sid === item?.sid
                                        );

                                    return filteredBets?.length
                                      ? filteredBets.reduce(
                                          (acc, doc) =>
                                            acc + Number(doc.currentBet.stake),
                                          0
                                        ) * -1
                                      : null;
                                  })()}
                                </span>
                              </h1>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  {/* mid */}
                  <div className="grid grid-cols-12 place-items-center">
                    <div className="md:col-span-4 col-span-12 hidden md:flex flex-col justify-start items-center">
                      <h2 className="font-semibold ">Statistics</h2>
                      <Chart />
                    </div>

                    <div className="md:col-span-8 col-span-12 flex my-5">
                      <div className="grid grid-cols-10 place-content-center mx-auto">
                        {filteredData
                          ?.map((desiredElement) =>
                            casinoData?.data?.data?.data?.t2?.find(
                              (v) => v.nat === desiredElement
                            )
                          )
                          ?.filter((item) => item)
                          ?.map((item, idx) => (
                            <div
                              onClick={(e) => {
                                setPlaceBet(true);
                                const newBetData = {
                                  betName: item?.nat,
                                  boxColor: "bg-[#B2D6F0]",
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
                              className={`py-7 col-span-2 relative text-white md:text-sm text-[10px] ${
                                idx === 0
                                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-tl-3xl rounded-bl-3xl me-1 "
                                  : idx === 1
                                  ? "bg-blue-600 hover:bg-blue-700 cursor-pointer "
                                  : idx === 2
                                  ? "bg-green-600 hover:bg-green-700 cursor-pointer "
                                  : idx === 3
                                  ? "bg-red-900 hover:bg-red-950 cursor-pointer"
                                  : idx === 4
                                  ? "bg-red-900 hover:bg-red-950 cursor-pointer rounded-tr-3xl px-2 ms-1 rounded-br-3xl "
                                  : "bg-red-900"
                              }`}
                              key={item.sid}
                            >
                              {remainingTime <= 3 || item.gstatus == "0" ? (
                                <>
                                  <div
                                    className={`absolute inset-0 bg-black opacity-80 flex ${
                                      idx === 0
                                        ? " rounded-tl-3xl rounded-bl-3xl me-1 "
                                        : idx === 1
                                        ? ""
                                        : idx === 2
                                        ? ""
                                        : idx === 3
                                        ? ""
                                        : idx === 4
                                        ? " rounded-tr-3xl px-2  rounded-br-3xl "
                                        : ""
                                    } w-full h-full justify-center items-center font-bold uppercase z-10`}
                                  >
                                    <span className="text-white opacity-100">
                                      <i class="ri-lock-2-fill text-xl"></i>
                                    </span>
                                  </div>
                                  <h1 className="uppercase flex justify-center items-center  text-xm">
                                    {item.nat}{" "}
                                  </h1>
                                  <h1 className="text-center md:text-xs text-[10px]">
                                    {item.b1} : {item.gstatus}
                                  </h1>

                                  {item.nat === "Player" ? (
                                    <div className="flex gap-1 justify-start absolute z-[49] ms-1 mt-1">
                                      {cardData?.C5 !== "1" && (
                                        <img
                                          className="max-h-5 rotate-90"
                                          src={
                                            cardsData?.find(
                                              (card) =>
                                                card.code == cardData?.C5
                                            )?.image
                                          }
                                        />
                                      )}
                                      <img
                                        className="max-h-5"
                                        src={
                                          cardsData?.find(
                                            (card) => card.code == cardData?.C1
                                          )?.image
                                        }
                                      />
                                      <img
                                        className="max-h-5"
                                        src={
                                          cardsData?.find(
                                            (card) => card.code == cardData?.C3
                                          )?.image
                                        }
                                      />
                                    </div>
                                  ) : item.nat === "Banker" ? (
                                    <>
                                      <div className="flex gap-1 justify-start absolute z-[49] ms-1 mt-1">
                                        <img
                                          className="max-h-5"
                                          src={
                                            cardsData?.find(
                                              (card) =>
                                                card.code == cardData?.C2
                                            )?.image
                                          }
                                        />
                                        <img
                                          className="max-h-5"
                                          src={
                                            cardsData?.find(
                                              (card) =>
                                                card.code == cardData?.C4
                                            )?.image
                                          }
                                        />
                                        {cardData?.C6 !== "1" && (
                                          <img
                                            className="max-h-5 -rotate-90"
                                            src={
                                              cardsData?.find(
                                                (card) =>
                                                  card.code == cardData?.C6
                                              )?.image
                                            }
                                          />
                                        )}
                                      </div>
                                    </>
                                  ) : null}
                                </>
                              ) : (
                                <>
                                  <h1 className="uppercase flex justify-center items-center  text-xm">
                                    {item.nat}{" "}
                                  </h1>
                                  <h1 className="text-center md:text-xs text-[10px]">
                                    {item.b1} : {item.gstatus}
                                  </h1>
                                  {item.nat === "Player" ? (
                                    <div className="flex gap-1 justify-start ms-1 mt-1">
                                      {cardData?.C5 !== "1" && (
                                        <img
                                          className="max-h-5 rotate-90"
                                          src={
                                            cardsData?.find(
                                              (card) =>
                                                card.code == cardData?.C5
                                            )?.image
                                          }
                                        />
                                      )}
                                      <img
                                        className="max-h-5"
                                        src={
                                          cardsData?.find(
                                            (card) => card.code == cardData?.C1
                                          )?.image
                                        }
                                      />
                                      <img
                                        className="max-h-5"
                                        src={
                                          cardsData?.find(
                                            (card) => card.code == cardData?.C3
                                          )?.image
                                        }
                                      />
                                    </div>
                                  ) : item.nat === "Banker" ? (
                                    <>
                                      <div className="flex gap-1 justify-start ms-1 mt-1">
                                        <img
                                          className="max-h-5"
                                          src={
                                            cardsData?.find(
                                              (card) =>
                                                card.code == cardData?.C2
                                            )?.image
                                          }
                                        />
                                        <img
                                          className="max-h-5"
                                          src={
                                            cardsData?.find(
                                              (card) =>
                                                card.code == cardData?.C4
                                            )?.image
                                          }
                                        />
                                        {cardData.C6 !== "1" && (
                                          <img
                                            className="max-h-5 -rotate-90"
                                            src={
                                              cardsData?.find(
                                                (card) =>
                                                  card.code == cardData?.C6
                                              )?.image
                                            }
                                          />
                                        )}
                                      </div>
                                    </>
                                  ) : null}
                                </>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end items-center w-full">
                    {filteredData
                      ?.map((desiredElement) =>
                        casinoData?.data?.data?.data?.t2?.find(
                          (v) => v.nat === desiredElement
                        )
                      )
                      ?.filter((item) => item)
                      ?.map((item, idx) => (
                        <div>
                          {idx == 1 && (
                            <p className="font-semibold min-w-max mx-2 capitalize text-xs my-2 ">
                              Min:{" "}
                              <span className="me-2 text-[10px] font-normal">
                                {item?.min}
                              </span>{" "}
                              Max:{" "}
                              <span className="text-[10px] font-normal">
                                {item.max}
                              </span>
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* result start */}
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

                      <div className="grid grid-cols-2 place-items-center my-4">
                        <div className="col-span-1 border-e w-full place-items-start relative">
                          <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
                            Player
                          </h1>
                          <div className="flex gap-2 items-center justify-center">
                            {individualResultData?.cards
                              ?.split(",")
                              ?.map((item, idx) => {
                                const isTargetIndex =
                                  idx === 0 || idx === 2 || idx === 4;

                                if (isTargetIndex) {
                                  return (
                                    <>
                                      {item == "1" ? null : (
                                        <img
                                          key={idx}
                                          className={`md:h-[54px] h-[34px] ${
                                            idx === 4 ? "rotate-90" : ""
                                          }`}
                                          src={
                                            cardsData.find(
                                              (v) => v.code === item
                                            )?.image
                                          }
                                          alt={`Image ${idx}`}
                                        />
                                      )}
                                    </>
                                  );
                                }
                                return null;
                              })}
                          </div>
                          {individualResultData?.win == "1" && (
                            <div className="absolute text-success text-2xl left-2 top-1/2 animate-bounce">
                              <FontAwesomeIcon
                                style={{ color: "green" }}
                                icon={faTrophy}
                              />
                            </div>
                          )}
                        </div>
                        <div className="col-span-1 w-full place-items-start relative">
                          <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
                            Banker
                          </h1>
                          <div className="flex gap-2 items-center justify-center">
                            {individualResultData?.cards
                              ?.split(",")
                              ?.map((item, idx) => {
                                const isTargetIndex =
                                  idx === 1 || idx === 3 || idx === 5;

                                if (isTargetIndex) {
                                  return (
                                    <>
                                      {item == "1" ? null : (
                                        <img
                                          key={idx}
                                          className={`md:h-[54px] h-[34px] ${
                                            idx === 5 ? "-rotate-90" : ""
                                          }`}
                                          src={
                                            cardsData.find(
                                              (v) => v.code === item
                                            )?.image
                                          }
                                          alt={`Image ${idx}`}
                                        />
                                      )}
                                    </>
                                  );
                                }
                                return null;
                              })}
                          </div>
                          {individualResultData?.win == "2" && (
                            <div className="absolute text-success text-2xl right-2 top-1/2 animate-bounce">
                              <FontAwesomeIcon
                                style={{ color: "green" }}
                                icon={faTrophy}
                              />
                            </div>
                          )}
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
                gap-1 md:mb-0 mb-1`}
            >
              {toptenResult?.data?.data?.data ? (
                toptenResult?.data?.data?.data?.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                      casinoIndividualResult(cookies, item.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
                    }}
                    className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
                      item.result == 1 ? "text-red-500" : "text-yellow-400"
                    }  flex justify-center items-center w-6 rounded-full`}
                  >
                    {getResultText(item.result)}
                  </div>
                ))
              ) : (
                <>No Results Found</>
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

export default Baccrat2;
