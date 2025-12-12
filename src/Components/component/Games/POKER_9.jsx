import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import cricketBall from "../../assets/Cricket_ball.svg";
import { casinoIndividualResult } from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import CardsUi from "../common/CardsUi";
import Header from "../common/Header";
import Timer from "../common/Timer";
import HeaderTab from "../common/HeaderTab";
import cardsData, { cardShape } from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import PlaceBet from "../common/PlaceBet";
import ComplexOdds from "../common/ComplexOdds";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import GradientButton from "../common/GradientButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Frame from "../common/Frame";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const POKER_9 = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [activeTab, setActiveTab] = useState("hands");
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

  const location = useLocation();
  const item = location.state?.item;
  const queryClient = useQueryClient();

  const {
    placeBet,
    setPlaceBet,
    betData,
    setBetData,
    latestBetData,
    setLatestBetData,
  } = useContext(PlaceBetUseContext);
  const latestBetDataRef = useRef(betData);

  const isFixed = useScrollFixed();

  const [Countdown, setCountdown] = useState(0);

  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

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
    IndividualResult?.error === "Token has expired" ||
    IndividualResult?.error === "Invalid token"
  ) {
    signout(userId, removeCookie, () => {
      navigate("/sign-in");
      return null;
    });
  }

  const getResultText = (result) => {
    switch (result) {
      case "16":
        return "6";
      case "15":
        return "5";
      case "14":
        return "4";
      case "13":
        return "3";
      case "12":
        return "2";
      case "11":
        return "1";
      case "0":
        return "0";
    }
  };

  useEffect(() => {
    if (
      casinoData &&
      casinoData?.data?.data?.data &&
      casinoData?.data?.data?.data?.status !== "error" &&
      casinoData?.data?.data?.data?.t1?.[0]?.autotime != ""
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
  const [bet, setBet] = useState(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const getCard = (player) => {
    switch (player) {
      case "Player 1":
        return [cardData?.C1, cardData?.C7];
      case "Player 2":
        return [cardData?.C2, cardData?.C8];
      case "Player 3":
        return [cardData?.C3, cardData?.C9];
      case "Player 4":
        return [cardData?.C4, cardData?.C10];
      case "Player 5":
        return [cardData?.C5, cardData?.C11];
      case "Player 6":
        return [cardData?.C6, cardData?.C12];
      default:
        return [];
    }
  };
const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (latestBetData && casinoData?.data?.data?.data?.t2) {
      const currentOdds = casinoData?.data?.data?.data?.t2.find(
        (data) => data.sid || data.sectionId === latestBetData.sid
      );

      if (
        currentOdds &&
        currentOdds.matchOdd !== latestBetDataRef.current.matchOdd &&
        betData.oddType === "casino_odds"
      ) {
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
  }, [remainingTime]);

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

              {/* Cards */}
              <div className="absolute top-2 left-1">
                <div className="flex gap-1 justify-start items-center">
                  {cardsData &&
                    cardsData.find((i) => i.code == cardData?.C13) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == cardData?.C13).image
                        }
                        className="h-[34px] md:h-[44px]  img-fluid"
                        alt={
                          cardsData.find((i) => i.code == cardData?.C13).name
                        }
                      />
                    )}
                  {cardsData &&
                    cardsData.find((i) => i.code == cardData?.C14) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == cardData?.C14).image
                        }
                        className="h-[34px] md:h-[44px]  img-fluid"
                        alt={
                          cardsData.find((i) => i.code == cardData?.C14).name
                        }
                      />
                    )}
                  {cardsData &&
                    cardsData.find((i) => i.code == cardData?.C15) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == cardData?.C15).image
                        }
                        className="h-[34px] md:h-[44px] img-fluid"
                        alt={
                          cardsData.find((i) => i.code == cardData?.C15).name
                        }
                      />
                    )}
                  {cardsData &&
                    cardsData.find((i) => i.code == cardData?.C16) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == cardData?.C16).image
                        }
                        className="h-[34px] md:h-[44px]  img-fluid"
                        alt={
                          cardsData.find((i) => i.code == cardData?.C16).name
                        }
                      />
                    )}
                  {cardsData &&
                    cardsData.find((i) => i.code == cardData?.C17) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == cardData?.C17).image
                        }
                        className="h-[34px] md:h-[44px] img-fluid"
                        alt={
                          cardsData.find((i) => i.code == cardData?.C17).name
                        }
                      />
                    )}
                </div>
              </div>

              {/* Timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* Casino Table Structure - Fixed Design */}
            <div className="poker6player casino-detail">
              <div className="casino-table">
                <ul className="mb-1 nav nav-pills" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      id="uncontrolled-tab-example-tab-hands"
                      role="tab"
                      data-rr-ui-event-key="hands"
                      aria-controls="uncontrolled-tab-example-tabpane-hands"
                      aria-selected={activeTab === "hands"}
                      className={`nav-link ${
                        activeTab === "hands" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("hands")}
                    >
                      Hands
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      type="button"
                      id="uncontrolled-tab-example-tab-pattern"
                      role="tab"
                      data-rr-ui-event-key="pattern"
                      aria-controls="uncontrolled-tab-example-tabpane-pattern"
                      aria-selected={activeTab === "pattern"}
                      className={`nav-link ${
                        activeTab === "pattern" ? "active" : ""
                      }`}
                      onClick={() => handleTabClick("pattern")}
                      tabIndex={-1}
                    >
                      Pattern
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  {/* Hands Tab Panel */}
                  <div
                    role="tabpanel"
                    id="uncontrolled-tab-example-tabpane-hands"
                    aria-labelledby="uncontrolled-tab-example-tab-hands"
                    className={`fade hands tab-pane ${
                      activeTab === "hands" ? "active show" : ""
                    }`}
                  >
                    <div className="row row5">
                      {typeof casinoData?.data?.data === "object" &&
                      Object.keys(casinoData.data.data).length === 0 ? (
                        <>
                          <div className="col-md-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Player 1<div className="patern-name ms-3"></div>
                                <div>
                                  <span className="casino-odds">0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Player 2<div className="patern-name ms-3"></div>
                                <div>
                                  <span className="casino-odds">0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Player 3<div className="patern-name ms-3"></div>
                                <div>
                                  <span className="casino-odds">0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Player 4<div className="patern-name ms-3"></div>
                                <div>
                                  <span className="casino-odds">0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Player 5<div className="patern-name ms-3"></div>
                                <div>
                                  <span className="casino-odds">0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Player 6<div className="patern-name ms-3"></div>
                                <div>
                                  <span className="casino-odds">0</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.filter((v) => v?.nation?.includes("Player"))
                          ?.map((item, idx) => (
                            <div key={idx} className="col-md-6">
                              {remainingTime <= 3 || item.gstatus == "0" ? (
                                <div className="casino-odds-box back suspended-box">
                                  <div className="casino-nation-name">
                                    {item.nation}
                                    <div className="patern-name ms-3" />
                                  </div>
                                  <div>
                                    <span className="casino-odds">
                                      {item.rate}
                                    </span>
                                  </div>
                                  <div className="flex gap-1 mt-1">
                                    {getCard(item.nation).map(
                                      (card, cardIdx) =>
                                        card !== "1" && (
                                          <img
                                            key={cardIdx}
                                            src={
                                              cardsData.find(
                                                (v) => v.code == card
                                              )?.image
                                            }
                                            className="h-[24px] md:h-[34px]"
                                            alt={`Card ${card}`}
                                          />
                                        )
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="casino-odds-box back"
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: item?.nation,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: item?.rate,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: item?.sid || item.sectionId,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <div className="casino-nation-name">
                                    {item.nation}
                                    <div className="patern-name ms-3" />
                                  </div>
                                  <div>
                                    <span className="casino-odds">
                                      {item.rate}
                                    </span>
                                  </div>
                                  <div className="flex gap-1 mt-1">
                                    {getCard(item.nation).map(
                                      (card, cardIdx) =>
                                        card !== "1" && (
                                          <img
                                            key={cardIdx}
                                            src={
                                              cardsData.find(
                                                (v) => v.code == card
                                              )?.image
                                            }
                                            className="h-[24px] md:h-[34px]"
                                            alt={`Card ${card}`}
                                          />
                                        )
                                    )}
                                  </div>
                                  <div className="text-red-600 text-xs mt-1">
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
                                              doc.currentBet.sid === item?.sid
                                          );
                                      return filteredBets?.length
                                        ? filteredBets.reduce(
                                            (acc, doc) =>
                                              acc +
                                              Number(doc.currentBet.stake),
                                            0
                                          ) * -1
                                        : null;
                                    })()}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  {/* Pattern Tab Panel */}
                  <div
                    role="tabpanel"
                    id="uncontrolled-tab-example-tabpane-pattern"
                    aria-labelledby="uncontrolled-tab-example-tab-pattern"
                    className={`fade pattern tab-pane ${
                      activeTab === "pattern" ? "active show" : ""
                    }`}
                  >
                    <div className="row row5">
                      {typeof casinoData?.data?.data === "object" &&
                      Object.keys(casinoData.data.data).length === 0 ? (
                        <>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                High Card
                              </div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">Pair</div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">Two Pair</div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Three of a Kind
                              </div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">Straight</div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">Flush</div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Full House
                              </div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Four of a Kind
                              </div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="casino-odds-box back suspended-box">
                              <div className="casino-nation-name">
                                Straight Flush
                              </div>
                              <div>
                                <span className="casino-odds">0</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.filter((v) => !v?.nation?.includes("Player"))
                          ?.map((item, idx) => (
                            <div key={idx} className="col-md-4 col-6">
                              {remainingTime <= 3 || item.gstatus == "0" ? (
                                <div className="casino-odds-box back suspended-box">
                                  <div className="casino-nation-name">
                                    {item.nation}
                                  </div>
                                  <div>
                                    <span className="casino-odds">
                                      {item.rate}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="casino-odds-box back"
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: item?.nation,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: item?.rate,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: item?.sid || item.sectionId,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <div className="casino-nation-name">
                                    {item.nation}
                                  </div>
                                  <div>
                                    <span className="casino-odds">
                                      {item.rate}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="result bg-secondaryBackground py-1 mb-1 mt-2">
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

            {/* Result Data */}
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
                    <div>
                      {individualResultData ?(
                        <>
                    <div className="casino-result-modal">
                    <div className="casino-result-round-id">
                      <span>
                        <b>Round Id: </b> 110251206154552
                      </span>
                      <span>
                        <b>Match Time: </b>06/12/2025 15:45:52
                      </span>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-12 text-center">
                        <h4 className="result-title">Board</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/6HH.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/4CC.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/10HH.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/10CC.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/5HH.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-2" />
                      <div className="col-md-4 text-center">
                        <h4 className="result-title">1</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/QHH.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/9CC.jpg" />
                        </div>
                      </div>
                      <div className="col-md-4 text-center">
                        <h4 className="result-title">6</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/JCC.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/7HH.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-1" />
                      <div className="col-md-4 text-center">
                        <h4 className="result-title">2</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/8HH.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/ACC.jpg" />
                        </div>
                      </div>
                      <div className="col-md-2" />
                      <div className="col-md-4 text-center">
                        <h4 className="result-title">5</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/JSS.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/5SS.jpg" />
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-md-2" />
                      <div className="col-md-4 text-center">
                        <h4 className="result-title">3</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/6CC.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/3DD.jpg" />
                        </div>
                      </div>
                      <div className="col-md-4 text-center">
                        <h4 className="result-title">4</h4>
                        <div className="casino-result-cards">
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/QDD.jpg" />
                          <img src="https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/QCC.jpg" />
                          <div className="casino-winner-icon">
                            <i className="fas fa-trophy " />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-2 justify-content-center">
                      <div className="col-md-6">
                        <div className="casino-result-desc">
                          <div className="casino-result-desc-item">
                            <div>Winner</div>
                            <div>Player 4</div>
                          </div>
                          <div className="casino-result-desc-item">
                            <div>Pattern</div>
                            <div>Two pairs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                     {!filteredBetHistory.length <= 0 && (
                            <div className="mt-4">
                              <IndividualBetHistoryTable data={filteredBetHistory} />
                            </div>
                          )}
                  </div>
                  </>
                  ):(
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
                  console.log("casino ka data",casinoData),
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
                {item.win === "1" ? "A" : "B"}
                </span>

                ))
                ) : (
                <>No Results Found</>
                )}
                </div>

            {/* Result Modal */}

          </div>

          {/* Sidebar */}
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
                  odds={null}
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

      {/* Mobile Bet Popup */}
      <div className={`${placeBet ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex items-start justify-center z-50 md:hidden">
          <div className="absolute top-0 inset-0 bg-gray-900 opacity-50"></div>
          <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
            <CasinoMobileBetPopup
              time={remainingTime}
              gameType="casino"
              gameName={item?.slug}
              item={item}
              refetchCurrentBets={refetchCurrentBets}
              odds={null}
              myCurrentBets={myCurrentCasinoBets}
            />
          </div>
        </div>
      </div>

      {bet && (
        <div className="md:w-[100%] md:hidden md:ms-1 h-fit flex-col">
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

export default POKER_9;
