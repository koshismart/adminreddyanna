import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import useCountdown from "../../hook/useCountdown";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import cardsData from "../../assets/cards/data";
import PlayerOdds from "../common/PlayerOdds";
import BetModal from "../common/BetModal";
import PlaceBet from "../common/PlaceBet";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const TEEN_8 = ({
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
  const [cardData, setCardData] = useState([]);
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
    // remainingTime==0||
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
      case "0":
        return "R";
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

  // // individualResultData cards
  // const cards = individualResultData?.cards?.split(",")

  //   // Function to shuffle the deck
  //   const shuffle = (array) => {
  //     for (let i = array?.length - 1; i > 0; i--) {
  //       const j = Math?.floor(Math?.random() * (i + 1));
  //       [array[i], array[j]] = [array[j], array[i]];
  //     }
  //     return array;
  //   };

  //   // Shuffle the deck
  //   shuffle(cards);

  //   // Distribute the cards to 8 players
  //   const players = Array?.from({ length: 8 }, () => []);
  //   for (let i = 0; i < 24; i++) {
  //     players[i % 8]?.push(cards[i]);
  //   }

  //   // Remaining cards are placed on the table
  //   const tableCards = cards?.slice(24);

  // Function to shuffle an array
  // const shuffle = (array) => {
  //   for (let i = array.length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [array[i], array[j]] = [array[j], array[i]];
  //   }
  //   return array;
  // };

  const getCard = (player, item) => {
    if (!item?.cards) {
      return [];
    }

    const cardsArray = item.cards.split(",");

    switch (player) {
      case "Player 1":
        return [cardsArray[0], cardsArray[9], cardsArray[18]];
      case "Player 2":
        return [cardsArray[1], cardsArray[10], cardsArray[19]];
      case "Player 3":
        return [cardsArray[2], cardsArray[11], cardsArray[20]];
      case "Player 4":
        return [cardsArray[3], cardsArray[12], cardsArray[21]];
      case "Player 5":
        return [cardsArray[4], cardsArray[13], cardsArray[22]];
      case "Player 6":
        return [cardsArray[5], cardsArray[14], cardsArray[23]];
      case "Player 7":
        return [cardsArray[6], cardsArray[15], cardsArray[24]];
      case "Player 8":
        return [cardsArray[7], cardsArray[16], cardsArray[25]];
      case "card":
        return [cardsArray[8], cardsArray[17], cardsArray[26]];
      default:
        return [];
    }
  };

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
            <div className="w-full relative">
              <div className="hidden md:block w-full">
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
                <div className="absolute top-1 flex flex-col  left-2">
                 <h5>DEALER</h5>
                  <div className="flex gap-1">
                    {/* {cardData?.cards
                      ?.split(",")
                      .filter((_, index) => [9, 18, 27].includes(index + 1))
                      .map((item) => {
                        const card = cardsData.find((v) => v.code === item);
                        return card ? (
                          <img
                            className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                            key={item}
                            src={card.image}
                            alt={item}
                          />
                        ) : null;
                      })} */}

                    {getCard("card", cardData).map((item) => (
                      <img
                        className="h-[34px] md:h-[44px] img-fluid"
                        src={cardsData.find((v) => v.code == item)?.image}
                      />
                    ))}
                  </div>
                </div>
                {/* Timer */}
                <div className="absolute bottom-2 right-2">
                  <Timer time={endTime} />
                </div>
              </div>
            </div>

            {/* odds */}
            {Array.isArray(casinoData?.data?.data?.data?.t2) && (
              <div className="teenpattiopen casino-detail">
                <div className="casino-table">
                  <div className="casino-table-full-box">
                    {/* Table Header */}
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Odds</div>
                      <div className="casino-odds-box back">Pair Plus</div>
                      <div className="casino-odds-box back">Total</div>
                    </div>

                    {/* Table Body */}
                    <div className="casino-table-body">
                      {/* Player 1 to Player 8 */}
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((playerNumber) => {
                        const playerData =
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nation === `Player ${playerNumber}`
                          );
                        const pairPlusData =
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) =>
                              item.nation === `Pair plus ${playerNumber}`
                          );
                        const totalData =
                          casinoData?.data?.data?.data?.t2?.find(
                            (item) => item.nation === `Total ${playerNumber}`
                          );

                        // Get card symbols for this player
                        const playerCards = getCard(
                          `Player ${playerNumber}`,
                          cardData
                        );

                        return (
                          <div className="casino-table-row" key={playerNumber}>
                            {/* Player Name and Cards */}
                            <div className="casino-nation-detail">
                              <div className="casino-nation-name">
                                Player {playerNumber}
                                <div className="patern-name">
                                  <div className="flex ">
                                    {playerCards.map((cardCode, index) => (
                                      <img
                                        key={index}
                                        src={
                                          cardsData.find(
                                            (v) =>
                                              cardCode !== "1" &&
                                              v.code === cardCode
                                          )?.image
                                        }
                                        alt=""
                                        className="h-6 md:h-8"
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Player Odds */}
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 ||
                                playerData?.gstatus === "0"
                                  ? "suspended-box"
                                  : "cursor-pointer hover:bg-blue-400"
                              }`}
                              onClick={() => {
                                if (
                                  remainingTime > 3 &&
                                  playerData?.gstatus !== "0"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: playerData?.nation,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: playerData?.rate,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: playerData?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">
                                {playerData?.rate || "0"}
                              </span>
                            </div>

                            {/* Pair Plus */}
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 ||
                                pairPlusData?.gstatus === "0"
                                  ? "suspended-box"
                                  : "cursor-pointer hover:bg-blue-400"
                              }`}
                              onClick={() => {
                                if (
                                  remainingTime > 3 &&
                                  pairPlusData?.gstatus !== "0"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: pairPlusData?.nation,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: pairPlusData?.rate,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: pairPlusData?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">
                                Pair Plus {playerNumber}
                              </span>
                            </div>

                            {/* Total */}
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 || totalData?.gstatus === "0"
                                  ? "suspended-box"
                                  : "cursor-pointer hover:bg-blue-400"
                              }`}
                              onClick={() => {
                                if (
                                  remainingTime > 3 &&
                                  totalData?.gstatus !== "0"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: totalData?.nation,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: totalData?.rate,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: totalData?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">
                                {totalData?.rate || "0"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
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

                     {individualResultData ? (() => {

  const cardArr = individualResultData.cards.split(",");     // 28 cards
  const winners = individualResultData.win?.split(",") || []; // ["1","2","5","8"]

  // group format → 3 cards each
  // 1..8 => index 0..23
  // Dealer => last 3 cards (25–27)
  const groups = {};

  let index = 0;
  for (let g = 1; g <= 8; g++) {
    groups[g] = cardArr.slice(index, index + 3);
    index += 3;
  }

  groups["Dealer"] = cardArr.slice(24, 27);

  const imgURL = (c) =>
    `https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${c}.jpg`;

  return (
    <div className="casino-result-modal">

      {/* ROUND INFO */}
      <div className="flex justify-between text-sm font-semibold">
        <span><b>Round Id:</b> {individualResultData.mid}</span>
        <span><b>Match Time:</b> {individualResultData.mtime}</span>
      </div>

      {/* AUTO CARD GROUP RENDER */}
      <div className="row mt-3">

        {Object.keys(groups).map((key, i) => (
          <div key={i} className="col-xl-3 text-center mb-3">
            <h4 className="result-title">{key}</h4>

            <div className="casino-result-cards relative">
              {groups[key].map((card, idx) => (
                <img key={idx} src={imgURL(card)} />
              ))}

              {/* WINNER TROPHY */}
              {winners.includes(String(key)) && (
                <div className="casino-winner-icon">
                  <i className="fas fa-trophy"></i>
                </div>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* DESCRIPTION BOX */}
      <div className="row mt-3 justify-content-center">
        <div className="col-md-6">
          <div className="casino-result-desc">

            <div className="casino-result-desc-item">
              <div>Winner</div>
              <div>{individualResultData.win}</div>
            </div>

            {/* DESC LINE 1 */}
            <div className="casino-result-desc-item">
              <div>Details</div>
              <div>{individualResultData.desc?.split("||")[0]}</div>
            </div>

            {/* DESC LINE 2 */}
            <div className="casino-result-desc-item">
              <div>&nbsp;</div>
              <div>{individualResultData.desc?.split("||")[1]}</div>
            </div>

            {/* DESC LINE 3 */}
            <div className="casino-result-desc-item">
              <div>&nbsp;</div>
              <div>{individualResultData.desc?.split("||")[2]}</div>
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
  );

})() : (
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
                {item.win === "1" ? "R" : "R"}
                </span>

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
            <PlaceBet bet={bet} game={item.gameName} />
          </div>
        </div>
      )}
    </>
  );
};

export default TEEN_8;
