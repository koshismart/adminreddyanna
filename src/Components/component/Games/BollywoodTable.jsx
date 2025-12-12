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
import cardsData, {
  cardShapeForAndarBahar,
  cardVariant,
} from "../../assets/cards/data";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import Frame from "../common/Frame";
import useScrollFixed from "../../hook/useFixed";
import cricketBall from "../../assets/Cricket_ball.svg";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { getBollywoodTableGameData } from "../../helpers/IndividualGameDataHelper";
import { decodedTokenData, signout } from "../../helpers/auth";
import { calculateCasinoRate } from "../../utils/casinoRate";

const BollywoodTable = ({
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
    // console.log(result);
    switch (result) {
      case "1":
        return "A";
      case "2":
        return "B";
      case "3":
        return "C";
      case "4":
        return "D";
      case "5":
        return "E";
      case "6":
        return "F";
    }
  };
  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateProfitLoss = (currentBets, item, sids) => {
    let totalProfitLoss = 0;

    currentBets?.currentCasinoBets?.forEach((bet, index) => {
      const { oddCategory, profit, loss, sid } = bet?.currentBet;

      const adjustment =
        oddCategory === "Back" ? Number(profit) : -Number(loss);

      if (sids.includes(sid)) {
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
          totalProfitLoss > 0 ? "text-green-800" : "text-red-500"
        } mr-6`}
      >
        {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
      </span>
    );
  };

  //individual game data
  const individualResultDesc = getBollywoodTableGameData(
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

              {/* card */}

              <div className="absolute top-0 left-1">
                {/* <CardsUi
                  gettingCardData={cardData}
                  cardsData={cardsData}
                  game={item?.gameName}
                /> */}
              
                {cardsData && cardsData.find((i) => i.code == cardData?.C1) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C1).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C1).name}
                  />
                )}
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/*odds */}
            {Array.isArray(casinoData?.data?.data?.data?.t2) && (
              <div className="bollywood casino-detail">
                <div className="casino-table">
                  {/* Top Section - A to F Movies */}
                  <div className="casino-table-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.slice(0, 6)
                      ?.map((item, index) => (
                        <div className="casino-odd-box-container" key={index}>
                          <div className="casino-nation-name">
                            {String.fromCharCode(65 + index)}.{item?.nat}
                            <div className="casino-nation-book md:hidden" />
                          </div>
                          {remainingTime <= 3 ||
                          item.gstatus === "SUSPENDED" ? (
                            <>
                              <div className="casino-odds-box back suspended-box">
                                <span className="casino-odds">0</span>
                              </div>
                              <div className="casino-odds-box lay suspended-box">
                                <span className="casino-odds">0</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className="casino-odds-box back cursor-pointer hover:bg-blue-400"
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
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                <span className="casino-odds">{item.b1}</span>
                              </div>
                              <div
                                className="casino-odds-box lay cursor-pointer hover:bg-red-400"
                                onClick={(e) => {
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
                                }}
                              >
                                <span className="casino-odds">{item.l1}</span>
                              </div>
                            </>
                          )}
                          <div className="casino-nation-book text-center hidden md:block w-full" />
                        </div>
                      ))}
                  </div>

                  {/* Middle Section - Odd & Movie Types */}
                  <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box left-odd-box">
                      {casinoData?.data?.data?.data?.t2
                        ?.filter((v) => v.nat.includes("Odd"))
                        ?.map((item, index) => (
                          <div className="casino-odd-box-container" key={index}>
                            <div className="casino-nation-name">
                              {item.nat}
                              <div className="casino-nation-book text-red-500 md:hidden" />
                            </div>
                            {remainingTime <= 3 ||
                            item.gstatus === "SUSPENDED" ? (
                              <>
                                <div className="casino-odds-box back suspended-box">
                                  <span className="casino-odds">0</span>
                                </div>
                                <div className="casino-odds-box lay suspended-box">
                                  <span className="casino-odds">0</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div
                                  className="casino-odds-box back cursor-pointer hover:bg-blue-400"
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
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <span className="casino-odds">{item.b1}</span>
                                </div>
                                <div
                                  className="casino-odds-box lay cursor-pointer hover:bg-red-400"
                                  onClick={(e) => {
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
                                  }}
                                >
                                  <span className="casino-odds">{item.l1}</span>
                                </div>
                              </>
                            )}
                            <div className="casino-nation-book text-center hidden md:block w-full" />
                          </div>
                        ))}
                    </div>
                    <div className="casino-table-right-box right-odd-box">
                      {casinoData?.data?.data?.data?.t2
                        ?.filter(
                          (v) =>
                            v.nat.includes("Dulhan") || v.nat.includes("Barati")
                        )
                        ?.map((item, index) => (
                          <div className="aaa-odd-box" key={index}>
                            <div className="casino-odds text-center">
                              {remainingTime <= 3 ||
                              item.gstatus === "SUSPENDED"
                                ? "0"
                                : item.b1}
                            </div>
                            {remainingTime <= 3 ||
                            item.gstatus === "SUSPENDED" ? (
                              <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                                <span className="casino-odds">{item.nat}</span>
                              </div>
                            ) : (
                              <div
                                className="casino-odds-box back casino-odds-box-theme cursor-pointer"
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
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                <span className="casino-odds">{item.nat}</span>
                              </div>
                            )}
                            <div className="casino-nation-book text-center" />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Bottom Section - Colors & Cards */}
                  <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                      {casinoData?.data?.data?.data?.t2
                        ?.filter(
                          (v) =>
                            v.nat.includes("Black") || v.nat.includes("Red")
                        )
                        ?.map((item, index) => (
                          <div className="aaa-odd-box" key={index}>
                            <div className="casino-odds text-center">
                              {remainingTime <= 3 ||
                              item.gstatus === "SUSPENDED"
                                ? "0"
                                : item.b1}
                            </div>
                            {remainingTime <= 3 ||
                            item.gstatus === "SUSPENDED" ? (
                              <div className="casino-odds-box back casino-odds-box-theme suspended-box">
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
                              </div>
                            ) : (
                              <div
                                className="casino-odds-box back casino-odds-box-theme cursor-pointer"
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
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                <div className="">
                                  <img
                                    className="h-4 my-1 inline"
                                    src={
                                      cardShapeForAndarBahar.filter((v) =>
                                        v.lucky.includes(item.nat)
                                      )[1]?.image
                                    }
                                    alt="card"
                                  />
                                  <img
                                    className="h-4 my-1 inline"
                                    src={
                                      cardShapeForAndarBahar.filter((v) =>
                                        v.lucky.includes(item.nat)
                                      )[0]?.image
                                    }
                                    alt="card"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="casino-nation-book text-center" />
                          </div>
                        ))}
                    </div>
                    <div className="casino-table-right-box right-cards">
                      <h4 className="w-full text-center mb-2">
                        <b>
                          {casinoData?.data?.data?.data?.t2
                            ?.filter(
                              (v) =>
                                v.nat.includes("card") || v.nat.includes("Card")
                            )
                            ?.map(
                              (item, index) =>
                                index === 0 &&
                                (remainingTime <= 3 ||
                                item.gstatus === "SUSPENDED"
                                  ? "0"
                                  : item.b1)
                            )}
                        </b>
                      </h4>
                      <div className="flex justify-center gap-2">
                        {casinoData?.data?.data?.data?.t2
                          ?.filter(
                            (v) =>
                              v.nat.includes("card") || v.nat.includes("Card")
                          )
                          ?.map((item, index) => {
                            const Nat = item.nat.slice(-1);
                            const card = cardVariant.find(
                              (v) => v.code === Nat
                            );

                            return (
                              <div className="card-odd-box" key={index}>
                                {remainingTime <= 3 ||
                                item.gstatus === "SUSPENDED" ? (
                                  <div className="suspended-box">
                                    <img src={card?.image} alt={card?.name} />
                                  </div>
                                ) : (
                                  <div
                                    className="cursor-pointer"
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
                                        oddCategory: "Back",
                                      };
                                      setBetData(newBetData);
                                      setLatestBetData(newBetData);
                                    }}
                                  >
                                    <img src={card?.image} alt={card?.name} />
                                  </div>
                                )}
                                <div className="casino-nation-book" />
                              </div>
                            );
                          })}
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

  
              {(() => {
              const nd = individualResultData?.newdesc || "";
              const parts = nd.split("#");

              const winner = parts[0] || "-";
              const yesNo = parts[1] || "-";
              const type = parts[2] || "-";
              const color = parts[3] || "-";
              const card = parts[4] || "-";

              return (
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-6">
                    <div className="casino-result-desc">

                      <div className="casino-result-desc-item">
                        <div>Winner</div>
                        <div>{winner}</div>
                      </div>

                      <div className="casino-result-desc-item">
                        <div>Yes / No</div>
                        <div>{yesNo}</div>
                      </div>

                      <div className="casino-result-desc-item">
                        <div>Dulha/Dulhan/Barati</div>
                        <div>{type}</div>
                      </div>

                      <div className="casino-result-desc-item">
                        <div>Color</div>
                        <div>{color}</div>
                      </div>

                      <div className="casino-result-desc-item">
                        <div>Card</div>
                        <div>{card}</div>
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
                  odds={casinoData?.data?.data?.data?.t2?.filter(
                    (doc) =>
                      betData?.betName == "Odd"
                        ? doc.nat == "Odd" // for odd fancy match odds
                        : doc.gtype == "btable" // for main match odds
                  )}
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
              odds={casinoData?.data?.data?.data?.t2?.filter(
                (doc) =>
                  betData?.betName == "Odd"
                    ? doc.nat == "Odd" // for odd fancy match odds
                    : doc.gtype == "btable" // for main match odds
              )}
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

export default BollywoodTable;
