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
import HeaderTab from "../common/HeaderTab";
import PlaceBet from "../common/PlaceBet";
import cardsData, {
  cardShapeForAndarBahar,
  cardVariant,
} from "../../assets/cards/data";
import Timer from "../common/Timer";
import CardsUi from "../common/CardsUi";
import Header from "../common/Header";
import useCountdown from "../../hook/useCountdown";
import ComplexOdds from "../common/ComplexOdds";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import useScrollFixed from "../../hook/useFixed";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { getDragonGameData } from "../../helpers/IndividualGameDataHelper";
import { decodedTokenData, signout } from "../../helpers/auth";
import Card from "../common/Card";

const DRAGON_TIGER_20 = ({
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
  // console.log(remainingTime,Countdown,casinoData?.data?.data?.data?.t1?.[0]?.autotime,'rmt')
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
      case "3":
        return "tie";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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

              {/* card */}

              <Card cardData={cardData} slug={item.slug}/>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* TOP SECTION - Main Bets */}
            <div className=" dt20 casino-table">
              <div className="casino-table-full-box">
                {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                  casinoData?.data?.data?.data?.t2
                    ?.filter(
                      (v) =>
                        v.nat == "Dragon" ||
                        v.nat == "Tie" ||
                        v.nat == "Tiger" ||
                        v.nat == "Pair"
                    )
                    ?.sort(
                      (a, b) =>
                        desiredOrder.indexOf(a.nat) -
                        desiredOrder.indexOf(b.nat)
                    )
                    ?.map((item, index) => (
                      <div
                        key={index}
                        className={`dt20-odd-box ${
                          item.nat === "Dragon"
                            ? "dt20dragon"
                            : item.nat === "Tie"
                            ? "dt20tie"
                            : item.nat === "Tiger"
                            ? "dt20tiger"
                            : "dt20pair"
                        }`}
                      >
                        <div className="casino-odds text-center">
                          {item.rate}
                        </div>
                        <div
                          className={`casino-odds-box back casino-odds-box-theme ${
                            remainingTime <= 3 || item.gstatus == "0"
                              ? "suspended-box"
                              : ""
                          }`}
                          onClick={() => {
                            if (remainingTime > 3 && item.gstatus != "0") {
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
                            }
                          }}
                          style={{
                            cursor:
                              remainingTime <= 3 || item.gstatus == "0"
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <span className="casino-odds">{item.nat}</span>
                        </div>
                        <span className="text-red-600 flex justify-center items-center font-normal text-xs mt-1">
                          {(() => {
                            const filteredBets =
                              myCurrentCasinoBets?.currentCasinoBets
                                ?.filter(
                                  (doc) => doc.currentBet.mid == cardData?.mid
                                )
                                ?.filter(
                                  (doc) =>
                                    doc.currentBet.oddType === "casino_odds" &&
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
                      </div>
                    ))}
              </div>

              {/* MID SECTION - Dragon & Tiger Details */}
              {/* MID SECTION - Dragon & Tiger Details */}
              <div className="casino-table-box mt-3">
                <div className="casino-table-left-box">
                  <h4 className="w-100 text-center mb-2">
                    <b>DRAGON</b>
                  </h4>
                  {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                    casinoData?.data?.data?.data?.t2
                      ?.filter(
                        (v) =>
                          v.nat != "Dragon" &&
                          v.nat != "Tie" &&
                          v.nat != "Tiger" &&
                          v.nat != "Pair" &&
                          !v.nat.includes("Card") &&
                          v.nat.includes("Dragon")
                      )
                      ?.map((item, index) => (
                        <div className="dt20-odd-box dt20odds" key={index}>
                          <div className="casino-odds text-center">
                            {item.rate}
                          </div>
                          <div
                            className={`casino-odds-box back casino-odds-box-theme ${
                              remainingTime <= 3 || item.gstatus == "0"
                                ? "suspended-box"
                                : ""
                            }`}
                            onClick={() => {
                              if (remainingTime > 3 && item.gstatus != "0") {
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
                              }
                            }}
                            style={{
                              cursor:
                                remainingTime <= 3 || item.gstatus == "0"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            <div
                              className="casino-odds"
                              style={{ height: "22px" }}
                            >
                              {item.nat.replace("Dragon", "").trim() == "Red" ||
                              item.nat.replace("Dragon", "").trim() ==
                                "Black" ? (
                                <>
                                  <span className="card-icon ms-1">
                                    <img
                                      src={
                                        item.nat.replace("Dragon", "").trim() ==
                                        "Red"
                                          ? "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/heart.png"
                                          : "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/spade.png"
                                      }
                                      alt={item.nat
                                        .replace("Dragon", "")
                                        .trim()}
                                      className="card-suit-icon"
                                    />
                                  </span>
                                  <span className="card-icon ms-1">
                                    <img
                                      src={
                                        item.nat.replace("Dragon", "").trim() ==
                                        "Red"
                                          ? "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/diamond.png"
                                          : "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/club.png"
                                      }
                                      alt={item.nat
                                        .replace("Dragon", "")
                                        .trim()}
                                      className="card-suit-icon"
                                    />
                                  </span>
                                </>
                              ) : item.nat.replace("Dragon", "").trim() ==
                                  "Even" ||
                                item.nat.replace("Dragon", "").trim() ==
                                  "Odd" ? (
                                <span
                                  className="casino-odds"
                                  style={{ height: "22px" }}
                                >
                                  {item.nat.replace("Dragon", "").trim()}
                                </span>
                              ) : (
                                item.nat.replace("Dragon", "").trim()
                              )}
                            </div>
                          </div>
                          <span className="text-red-600 flex justify-center items-center font-normal text-xs mt-1">
                            {(() => {
                              const filteredBets =
                                myCurrentCasinoBets?.currentCasinoBets
                                  ?.filter(
                                    (doc) => doc.currentBet.mid == cardData?.mid
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
                        </div>
                      ))}
                </div>

                <div className="casino-table-right-box">
                  <h4 className="w-100 text-center mb-2">
                    <b>TIGER</b>
                  </h4>
                  {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                    casinoData?.data?.data?.data?.t2
                      ?.filter(
                        (v) =>
                          v.nat != "Dragon" &&
                          v.nat != "Tie" &&
                          v.nat != "Tiger" &&
                          v.nat != "Pair" &&
                          !v.nat.includes("Card") &&
                          v.nat.includes("Tiger")
                      )
                      ?.map((item, index) => (
                        <div className="dt20-odd-box dt20odds" key={index}>
                          <div className="casino-odds text-center">
                            {item.rate}
                          </div>
                          <div
                            className={`casino-odds-box back casino-odds-box-theme ${
                              remainingTime <= 3 || item.gstatus == "0"
                                ? "suspended-box"
                                : ""
                            }`}
                            onClick={() => {
                              if (remainingTime > 3 && item.gstatus != "0") {
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
                              }
                            }}
                            style={{
                              cursor:
                                remainingTime <= 3 || item.gstatus == "0"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            <div className="casino-odds">
                              {item.nat.replace("Tiger", "").trim() == "Red" ||
                              item.nat.replace("Tiger", "").trim() ==
                                "Black" ? (
                                <>
                                  <span className="card-icon ms-1">
                                    <img
                                      src={
                                        item.nat.replace("Tiger", "").trim() ==
                                        "Red"
                                          ? "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/heart.png"
                                          : "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/spade.png"
                                      }
                                      alt={item.nat.replace("Tiger", "").trim()}
                                      className="card-suit-icon"
                                    />
                                  </span>
                                  <span className="card-icon ms-1">
                                    <img
                                      src={
                                        item.nat.replace("Tiger", "").trim() ==
                                        "Red"
                                          ? "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/diamond.png"
                                          : "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/club.png"
                                      }
                                      alt={item.nat.replace("Tiger", "").trim()}
                                      className="card-suit-icon"
                                    />
                                  </span>
                                </>
                              ) : item.nat.replace("Tiger", "").trim() ==
                                  "Even" ||
                                item.nat.replace("Tiger", "").trim() ==
                                  "Odd" ? (
                                <span className="casino-odds">
                                  {item.nat.replace("Tiger", "").trim()}
                                </span>
                              ) : (
                                item.nat.replace("Tiger", "").trim()
                              )}
                            </div>
                          </div>
                          <span className="text-red-600 flex justify-center items-center font-normal text-xs mt-1">
                            {(() => {
                              const filteredBets =
                                myCurrentCasinoBets?.currentCasinoBets
                                  ?.filter(
                                    (doc) => doc.currentBet.mid == cardData?.mid
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
                        </div>
                      ))}
                </div>
              </div>

              {/* BOTTOM SECTION - Cards */}
              <div className="casino-table-box mt-3">
                <div className="casino-table-left-box">
                  <div className="dt20cards">
                    <h4 className="w-100 text-center mb-2">
                      <b>DRAGON 0</b>
                    </h4>
                    {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                      casinoData?.data?.data?.data?.t2
                        ?.filter(
                          (v) =>
                            v.nat.includes("Card") && v.nat.includes("Dragon")
                        )
                        ?.map((item, index) => {
                          const exportNat = item.nat
                            ?.replace("Dragon Card", "")
                            ?.trim();
                          return (
                            <div className="card-odd-box" key={index}>
                              <div
                                className={
                                  remainingTime <= 3 || item.gstatus == "0"
                                    ? "suspended-box"
                                    : ""
                                }
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    item.gstatus != "0"
                                  ) {
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
                                  }
                                }}
                                style={{
                                  cursor:
                                    remainingTime <= 3 || item.gstatus == "0"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <img
                                  src={
                                    cardVariant.find((v) => v.code == exportNat)
                                      ?.image ||
                                    "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/A.png"
                                  }
                                  alt={exportNat}
                                />
                              </div>
                              <div className="casino-odds text-center text-xs mt-1">
                                {item.rate}
                              </div>
                              <span className="text-red-600 flex justify-center items-center font-normal text-xs mt-1">
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
                            </div>
                          );
                        })}
                  </div>
                </div>

                <div className="casino-table-right-box">
                  <div className="dt20cards">
                    <h4 className="w-100 text-center mb-2">
                      <b>TIGER 0</b>
                    </h4>
                    {Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                      casinoData?.data?.data?.data?.t2
                        ?.filter(
                          (v) =>
                            v.nat.includes("Card") && v.nat.includes("Tiger")
                        )
                        ?.map((item, index) => {
                          const exportNat = item.nat
                            ?.replace("Tiger Card", "")
                            ?.trim();
                          return (
                            <div className="card-odd-box" key={index}>
                              <div
                                className={
                                  remainingTime <= 3 || item.gstatus == "0"
                                    ? "suspended-box"
                                    : ""
                                }
                                onClick={() => {
                                  if (
                                    remainingTime > 3 &&
                                    item.gstatus != "0"
                                  ) {
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
                                  }
                                }}
                                style={{
                                  cursor:
                                    remainingTime <= 3 || item.gstatus == "0"
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                              >
                                <img
                                  src={
                                    cardVariant.find((v) => v.code == exportNat)
                                      ?.image ||
                                    "https://g1ver.sprintstaticdata.com/v72/static/front/img/cards/A.png"
                                  }
                                  alt={exportNat}
                                />
                              </div>
                              <div className="casino-odds text-center text-xs mt-1">
                                {item.rate}
                              </div>
                              <span className="text-red-600 flex justify-center items-center font-normal text-xs mt-1">
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
                            </div>
                          );
                        })}
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

export default DRAGON_TIGER_20;
