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
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import cardsData, {
  cardShapeForAndarBahar,
  cardVariant,
} from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import Frame from "../common/Frame";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { getDragonGameData } from "../../helpers/IndividualGameDataHelper";
import { decodedTokenData, signout } from "../../helpers/auth";
import Card from "../common/Card";

const DragonTiger202 = ({
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
  const desiredOrder = ["Dragon", "Tie", "Tiger", "Pair"];

  const getResultText = (result) => {
    // console.log(result);
    switch (result) {
      case "1":
        return "D";
      case "2":
        return "T";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DragonTiger = getDragonGameData(individualResultData?.desc);

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

              {/* card */}

             <Card cardData={cardData} slug={item.slug}/>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>
            {/* table structure */}
            {Array?.isArray(casinoData?.data?.data?.data?.t2) && (
              <div className="dt20 casino-detail">
                <div className="casino-table">
                  {/* Top Section - Dragon, Tie, Tiger, Pair */}
                  <div className="casino-table-full-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter(
                        (v) =>
                          v.nat == "Dragon" ||
                          v.nat == "Tie" ||
                          v.nat == "Tiger" ||
                          v.nat == "Pair"
                      )
                      .sort(
                        (a, b) =>
                          desiredOrder.indexOf(a.nat) -
                          desiredOrder.indexOf(b.nat)
                      )
                      .map((item, index) => (
                        <div
                          className={`dt20-odd-box dt20${item.nat.toLowerCase()}`}
                          key={index}
                        >
                          <div className="casino-odds text-center">
                            {item.rate}
                          </div>
                          {remainingTime <= 3 || item.gstatus == "0" ? (
                            <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                              <span className="casino-odds">{item.nat}</span>
                            </div>
                          ) : (
                            <div
                              className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:opacity-90"
                              onClick={() => {
                                setPlaceBet(true);
                                const newBetData = {
                                  betName: item?.nat,
                                  boxColor: "bg-[#72bbef]",
                                  matchOdd: item?.rate,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: item?.sid,
                                  oddType: "casino_odds",
                                  oddCategory: "",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }}
                            >
                              <span className="casino-odds">{item.nat}</span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Middle Section - Dragon & Tiger Odds */}
                  <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                      <h4 className="w-full text-center mb-2">
                        <b>DRAGON</b>
                      </h4>
                      {casinoData?.data?.data?.data?.t2
                        ?.filter(
                          (v) =>
                            v.nat != "Dragon" &&
                            v.nat != "Tie" &&
                            v.nat != "Tiger" &&
                            v.nat != "Pair" &&
                            !v.nat.includes("Card") &&
                            v.nat.includes("Dragon")
                        )
                        .map((item, index) => (
                          <div className="dt20-odd-box dt20odds" key={index}>
                            <div className="casino-odds text-center">
                              {item.rate}
                            </div>
                            {remainingTime <= 3 || item.gstatus == "0" ? (
                              <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                                {item.nat.replace("Dragon", "").trim() ==
                                  "Red" ||
                                item.nat.replace("Dragon", "").trim() ==
                                  "Black" ? (
                                  <div className="casino-odds">
                                    <span className="card-icon ms-1">
                                      <span
                                        className={
                                          item.nat.includes("Red")
                                            ? "card-red"
                                            : "card-black"
                                        }
                                      >
                                        {item.nat.includes("Red") ? "{" : "}"}
                                      </span>
                                    </span>
                                    <span className="card-icon ms-1">
                                      <span
                                        className={
                                          item.nat.includes("Red")
                                            ? "card-red"
                                            : "card-black"
                                        }
                                      >
                                        {item.nat.includes("Red") ? "[" : "]"}
                                      </span>
                                    </span>
                                  </div>
                                ) : (
                                  <span className="casino-odds">
                                    {item.nat.replace("Dragon", "").trim()}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div
                                className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:opacity-90"
                                onClick={() => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: item?.rate,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                {item.nat.replace("Dragon", "").trim() ==
                                  "Red" ||
                                item.nat.replace("Dragon", "").trim() ==
                                  "Black" ? (
                                  <div className="">
                                    <img
                                      src={
                                        cardShapeForAndarBahar.filter(
                                          (v) =>
                                            v.lucky ==
                                            item.nat
                                              .replace("Dragon", "")
                                              .trim()
                                        )[0]?.image
                                      }
                                      alt={item.nat}
                                      className="h-4 my-1 inline"
                                    />
                                    <img
                                      src={
                                        cardShapeForAndarBahar.filter(
                                          (v) =>
                                            v.lucky ==
                                            item.nat
                                              .replace("Dragon", "")
                                              .trim()
                                        )[1]?.image
                                      }
                                      alt={item.nat}
                                      className="h-4 my-1 inline"
                                    />
                                  </div>
                                ) : (
                                  <span className="casino-odds">
                                    {item.nat.replace("Dragon", "").trim()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>

                    <div className="casino-table-right-box">
                      <h4 className="w-full text-center mb-2">
                        <b>TIGER</b>
                      </h4>
                      {casinoData?.data?.data?.data?.t2
                        ?.filter(
                          (v) =>
                            v.nat != "Dragon" &&
                            v.nat != "Tie" &&
                            v.nat != "Tiger" &&
                            v.nat != "Pair" &&
                            !v.nat.includes("Card") &&
                            v.nat.includes("Tiger")
                        )
                        .map((item, index) => (
                          <div className="dt20-odd-box dt20odds" key={index}>
                            <div className="casino-odds text-center">
                              {item.rate}
                            </div>
                            {remainingTime <= 3 || item.gstatus == "0" ? (
                              <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                                {item.nat.replace("Tiger", "").trim() ==
                                  "Red" ||
                                item.nat.replace("Tiger", "").trim() ==
                                  "Black" ? (
                                  <div className="casino-odds">
                                    <span className="card-icon ms-1">
                                      <span
                                        className={
                                          item.nat.includes("Red")
                                            ? "card-red"
                                            : "card-black"
                                        }
                                      >
                                        {item.nat.includes("Red") ? "{" : "}"}
                                      </span>
                                    </span>
                                    <span className="card-icon ms-1">
                                      <span
                                        className={
                                          item.nat.includes("Red")
                                            ? "card-red"
                                            : "card-black"
                                        }
                                      >
                                        {item.nat.includes("Red") ? "[" : "]"}
                                      </span>
                                    </span>
                                  </div>
                                ) : (
                                  <span className="casino-odds">
                                    {item.nat.replace("Tiger", "").trim()}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <div
                                className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:opacity-90"
                                onClick={() => {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: item?.rate,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                {item.nat.replace("Tiger", "").trim() ==
                                  "Red" ||
                                item.nat.replace("Tiger", "").trim() ==
                                  "Black" ? (
                                  <div className="">
                                    <img
                                      src={
                                        cardShapeForAndarBahar.filter(
                                          (v) =>
                                            v.lucky ==
                                            item.nat.replace("Tiger", "").trim()
                                        )[0]?.image
                                      }
                                      alt={item.nat}
                                      className="h-4 my-1 inline"
                                    />
                                    <img
                                      src={
                                        cardShapeForAndarBahar.filter(
                                          (v) =>
                                            v.lucky ==
                                            item.nat.replace("Tiger", "").trim()
                                        )[1]?.image
                                      }
                                      alt={item.nat}
                                      className="h-4 my-1 inline"
                                    />
                                  </div>
                                ) : (
                                  <span className="casino-odds">
                                    {item.nat.replace("Tiger", "").trim()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Bottom Section - Dragon & Tiger Cards */}
                  <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                      <div className="dt20cards">
                        <h4 className="w-full text-center mb-2">
                          <b>
                            DRAGON{" "}
                            {casinoData?.data?.data?.data?.t2
                              ?.filter(
                                (v) =>
                                  v.nat.includes("Card") &&
                                  v.nat.includes("Dragon")
                              )
                              ?.map((item, index) => index === 0 && item.rate)}
                          </b>
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {casinoData?.data?.data?.data?.t2
                            ?.filter(
                              (v) =>
                                v.nat.includes("Card") &&
                                v.nat.includes("Dragon")
                            )
                            ?.map((item, index) => {
                              const exportNat = item.nat
                                ?.replace("Dragon Card", "")
                                ?.trim();
                              const card = cardVariant.find(
                                (v) => v.code == exportNat
                              );

                              return (
                                <div className="card-odd-box" key={index}>
                                  {remainingTime <= 3 || item.gstatus == "0" ? (
                                    <div className="suspended-box">
                                      <img src={card?.image} alt={card?.name} />
                                    </div>
                                  ) : (
                                    <div
                                      className="cursor-pointer hover:opacity-90"
                                      onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                          betName: item?.nat,
                                          boxColor: "bg-[#72bbef]",
                                          matchOdd: item?.rate,
                                          stake: 0,
                                          mid: cardData?.mid,
                                          sid: item?.sid,
                                          oddType: "casino_odds",
                                          oddCategory: "",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                      }}
                                    >
                                      <img src={card?.image} alt={card?.name} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    <div className="casino-table-right-box">
                      <div className="dt20cards">
                        <h4 className="w-full text-center mb-2">
                          <b>
                            TIGER{" "}
                            {casinoData?.data?.data?.data?.t2
                              ?.filter(
                                (v) =>
                                  v.nat.includes("Card") &&
                                  v.nat.includes("Tiger")
                              )
                              ?.map((item, index) => index === 0 && item.rate)}
                          </b>
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {casinoData?.data?.data?.data?.t2
                            ?.filter(
                              (v) =>
                                v.nat.includes("Card") &&
                                v.nat.includes("Tiger")
                            )
                            ?.map((item, index) => {
                              const exportNat = item.nat
                                ?.replace("Tiger Card", "")
                                ?.trim();
                              const card = cardVariant.find(
                                (v) => v.code == exportNat
                              );

                              return (
                                <div className="card-odd-box" key={index}>
                                  {remainingTime <= 3 || item.gstatus == "0" ? (
                                    <div className="suspended-box">
                                      <img src={card?.image} alt={card?.name} />
                                    </div>
                                  ) : (
                                    <div
                                      className="cursor-pointer hover:opacity-90"
                                      onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                          betName: item?.nat,
                                          boxColor: "bg-[#72bbef]",
                                          matchOdd: item?.rate,
                                          stake: 0,
                                          mid: cardData?.mid,
                                          sid: item?.sid,
                                          oddType: "casino_odds",
                                          oddCategory: "",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                      }}
                                    >
                                      <img src={card?.image} alt={card?.name} />
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
                  {/* {console.log(individualResultData)} */}
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

                          <div className="flex flex-col justify-center items-center mt-4">
                            <div className="flex flex-col justify-center items-center mt-4">
                              {DragonTiger && (
                                <div className="shadow-2xl border border-1 p-4 ">
                                  <div className="flex flex-col">
                                    <div className="text-black/60 text-md font-normal">
                                      Winner :
                                      <span className="mx-1 text-black">
                                        {DragonTiger.winner}
                                      </span>
                                    </div>

                                    <div className="text-black/60 text-md font-normal">
                                      Pair :
                                      <span className="mx-1 text-black">
                                        {DragonTiger.pair}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-black/60 text-md font-normal">
                                    Odd/Even:
                                    <span className="mx-1 text-black">
                                      D: {DragonTiger.dType}
                                    </span>
                                    |
                                    <span className="mx-1 text-black">
                                      T: {DragonTiger.tType}
                                    </span>
                                  </div>
                                  <div className="text-black/60 text-md font-normal">
                                    Color:
                                    <span className="mx-1 text-black">
                                      D: {DragonTiger.dColor}
                                    </span>
                                    |
                                    <span className="mx-1 text-black">
                                      T: {DragonTiger.tColor}
                                    </span>
                                  </div>
                                  <div className="text-black/60 text-md font-normal">
                                    Suit:
                                    <span className="mx-1 text-black">
                                      D: {DragonTiger.dSuit}
                                    </span>
                                    |
                                    <span className="mx-1 text-black">
                                      T: {DragonTiger.tSuit}
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

export default DragonTiger202;
