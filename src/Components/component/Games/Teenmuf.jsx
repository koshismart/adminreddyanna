import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import { casinoIndividualResult } from "../../helpers/casino";
import { decodedTokenData, signout } from "../../helpers/auth";
import { useQuery, useQueryClient } from "react-query";
import useCountdown from "../../hook/useCountdown";
import cricketBall from "../../assets/Cricket_ball.svg";
import cardsData from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import PlaceBet from "../common/PlaceBet";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import Header from "../common/Header";
import PlayerOdds from "../common/PlayerOdds";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Frame from "../common/Frame";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";

const Teenmuf = ({
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
  const [bet, setBet] = useState(false);

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

  // Static data fallback
  const staticData = {
    mid: 138251113184250,
    lt: 14,
    ft: 25,
    card: "1,1,1,1,1,1",
    gtype: "teenmuf",
    remark: "",
    grp: 16,
    sub: [
      {
        sid: 1,
        nat: "Player A",
        b: 1.98,
        bs: 200000,
        sr: 1,
        gstatus: "OPEN",
        min: 100,
        max: 200000,
        subtype: "teenmuf",
        etype: "fancy",
      },
      {
        sid: 2,
        nat: "Player B",
        b: 1.98,
        bs: 200000,
        sr: 2,
        gstatus: "OPEN",
        min: 100,
        max: 200000,
        subtype: "teenmuf",
        etype: "fancy",
      },
      {
        sid: 3,
        nat: "Top 9 A",
        b: 2,
        bs: 10000,
        sr: 3,
        gstatus: "OPEN",
        min: 50,
        max: 25000,
        subtype: "top9",
        etype: "fancy",
      },
      {
        sid: 4,
        nat: "Top 9 B",
        b: 2,
        bs: 10000,
        sr: 4,
        gstatus: "OPEN",
        min: 50,
        max: 25000,
        subtype: "top9",
        etype: "fancy",
      },
      {
        sid: 5,
        nat: "M Baccarat A",
        b: 1.95,
        bs: 100000,
        sr: 5,
        gstatus: "OPEN",
        min: 100,
        max: 100000,
        subtype: "mbacc",
        etype: "fancy",
      },
      {
        sid: 6,
        nat: "M Baccarat B",
        b: 1.95,
        bs: 100000,
        sr: 6,
        gstatus: "OPEN",
        min: 100,
        max: 100000,
        subtype: "mbacc",
        etype: "fancy",
      },
    ],
    status: "success",
  };

  const staticResultData = {
    res: [
      {
        mid: 138251113184122,
        win: "2",
      },
      {
        mid: 138251113183937,
        win: "1",
      },
      {
        mid: 138251113183806,
        win: "1",
      },
      {
        mid: 138251113183639,
        win: "2",
      },
      {
        mid: 138251113183514,
        win: "1",
      },
      {
        mid: 138251113183342,
        win: "1",
      },
      {
        mid: 138251113183214,
        win: "1",
      },
      {
        mid: 138251113183035,
        win: "1",
      },
      {
        mid: 138251113182908,
        win: "1",
      },
      {
        mid: 138251113182725,
        win: "2",
      },
    ],
    res1: {
      cname: "Muflis Teenpatti",
    },
  };

  // Check if API data is available
  const hasApiData = casinoData && casinoData?.data?.data?.data;
  const displayData = hasApiData ? casinoData.data.data.data : staticData;
  const displayResultData = hasApiData
    ? casinoData?.data?.data?.result || staticResultData.res
    : staticResultData.res;

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
    } else {
      // Set static countdown when no API data
      setCountdown(30);
      setCardData({
        C1: "H1",
        C2: "D5",
        C3: "C8",
        C4: "S2",
        C5: "H10",
        C6: "D3",
        min: 100,
        max: 200000,
        mid: staticData.mid,
      });
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

  const getResultText = (result) => {
    switch (result) {
      case "1":
        return "A";
      case "2":
        return "B";
      case "0":
        return "0";
      default:
        return result;
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const filteredBetHistory = useFilterIndividualBetHistory(
    CasinoBetHistory,
    individualResultData
  );

  useEffect(() => {
    if (latestBetData && displayData?.t2) {
      const currentOdds = displayData?.t2.find(
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

  // Helper function to get exposure for a specific sid
  const getExposureForSid = (sid) => {
    const filteredBet = myCurrentCasinoBets?.currentCasinoBets
      ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
      ?.filter(
        (doc) =>
          doc.currentBet.oddType === "casino_odds" &&
          doc.currentBet.sid === sid &&
          doc.exposure.isPreviousExposure == false
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.[0];

    return filteredBet?.exposure?.exposure || "-";
  };

  // Organize data for the table
  const getTableData = () => {
    const subData = displayData?.sub || staticData.sub;

    const playerA = [
      subData.find((item) => item.sid === 1), // Winner A
      subData.find((item) => item.sid === 3), // Top 9 A
      subData.find((item) => item.sid === 5), // M Baccarat A
    ].filter(Boolean);

    const playerB = [
      subData.find((item) => item.sid === 2), // Winner B
      subData.find((item) => item.sid === 4), // Top 9 B
      subData.find((item) => item.sid === 6), // M Baccarat B
    ].filter(Boolean);

    return { playerA, playerB };
  };

  const { playerA, playerB } = getTableData();

  // Static card data fallback
  const staticCardData = {
    C1: "H1",
    C2: "D5",
    C3: "C8",
    C4: "S2",
    C5: "H10",
    C6: "D3",
  };

  return (
    <>
      <div className="block md:hidden w-full">
        <Header
          gameName={item?.gameName || "Teen Muf"}
          min={cardData?.min || staticData.sub[0]?.min}
          max={cardData?.max || staticData.sub[0]?.max}
          mid={cardData?.mid || staticData.mid}
        />
      </div>
      <HeaderTab
        bet={bet}
        setBet={setBet}
        mid={cardData?.mid || staticData.mid}
        myCurrentCasinoBets={myCurrentCasinoBets}
      />

      <div className="md:flex relative w-full h-full">
        {!bet && (
          <>
            <div className="center-container">
              <div className="w-full relative">
                <div className="hidden md:block">
                  <Header
                    gameName={item?.gameName || "Teen Muf"}
                    min={cardData?.min || staticData.sub[0]?.min}
                    max={cardData?.max || staticData.sub[0]?.max}
                    mid={cardData?.mid || staticData.mid}
                  />
                </div>
                <div className="casino-video">
                  <Frame item={item} />

                  {/* Cards display with fallback */}
                  <div className="absolute top-0 left-1">
                    {Array.isArray(cardData) ? (
                      <>
                        {cardData.map((i, idx) => (
                          <div key={idx}>
                            <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                              {i.nation}
                            </h4>
                            <div className="flex gap-2">
                              <div className="col text-white">
                                <img
                                  src={
                                    cardsData.find((c) => c.code == i?.C1).image
                                  }
                                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                  alt={
                                    cardsData.find((c) => c.code == i?.C1).name
                                  }
                                />
                              </div>
                              <div className="col text-white">
                                <img
                                  src={
                                    cardsData.find((c) => c.code == i?.C2).image
                                  }
                                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                  alt={
                                    cardsData.find((c) => c.code == i?.C2).name
                                  }
                                />
                              </div>
                              <div className="col text-white">
                                <img
                                  src={
                                    cardsData.find((c) => c.code == i?.C3).image
                                  }
                                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                  alt={
                                    cardsData.find((c) => c.code == i?.C3).name
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="flex gap-2">
                            <div className="col text-white">
                              {cardsData &&
                                cardsData.find(
                                  (i) => i.code == cardData?.C1
                                ) && (
                                  <img
                                    src={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C1
                                      ).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C1
                                      ).name
                                    }
                                  />
                                )}
                            </div>
                            <div className="col text-white">
                              {cardsData &&
                                cardsData.find(
                                  (i) => i.code == cardData?.C3
                                ) && (
                                  <img
                                    src={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C3
                                      ).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C3
                                      ).name
                                    }
                                  />
                                )}
                            </div>
                            <div className="col text-white">
                              {cardsData &&
                                cardsData.find(
                                  (i) => i.code == cardData?.C5
                                ) && (
                                  <img
                                    src={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C5
                                      ).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C5
                                      ).name
                                    }
                                  />
                                )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex gap-2 mt-1">
                            <div className="col text-white">
                              {cardsData &&
                                cardsData.find(
                                  (i) => i.code == cardData?.C2
                                ) && (
                                  <img
                                    src={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C2
                                      ).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C2
                                      ).name
                                    }
                                  />
                                )}
                            </div>
                            <div className="col text-white">
                              {cardsData &&
                                cardsData.find(
                                  (i) => i.code == cardData?.C4
                                ) && (
                                  <img
                                    src={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C4
                                      ).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C4
                                      ).name
                                    }
                                  />
                                )}
                            </div>
                            <div className="col text-white">
                              {cardsData &&
                                cardsData.find(
                                  (i) => i.code == cardData?.C6
                                ) && (
                                  <img
                                    src={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C6
                                      ).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                      cardsData.find(
                                        (i) => i.code == cardData?.C6
                                      ).name
                                    }
                                  />
                                )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Timer */}
                  <div className="absolute bottom-2 right-2">
                    <Timer time={endTime} />
                  </div>

                  {/* API Status Indicator */}
                  {!hasApiData && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                      Using Static Data
                    </div>
                  )}
                </div>
              </div>

              {/* Casino Table Design */}
              <div className="teenpattimuflis casino-detail">
                <div className="casino-table">
                  <div className="casino-table-box">
                    {/* Player A Section */}
                    <div className="casino-table-left-box">
                      <div className="casino-table-header">
                        <div className="casino-nation-detail">Player A</div>
                      </div>
                      <div className="casino-table-body">
                        <div className="casino-table-row">
                          <div className="casino-odds-box">Winner</div>
                          <div className="casino-odds-box">Top 9</div>
                          <div className="casino-odds-box">M Baccarat A</div>
                        </div>
                        <div className="casino-table-row">
                          {playerA.map((item, index) => (
                            <div
                              key={index}
                              className="casino-odds-box back relative"
                            >
                              {casinoSpecialPermission ? (
                                <div
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: item?.nat,
                                      boxColor: "bg-[#B2D6F0]",
                                      matchOdd: item?.b,
                                      stake: 0,
                                      mid: cardData?.mid || staticData.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                  className="cursor-pointer hover:bg-blue-400 h-full w-full flex items-center justify-center flex-col"
                                >
                                  <span className="casino-odds">{item?.b}</span>
                                  <span className="exposure-display text-red-600 text-xs">
                                    {getExposureForSid(item?.sid)}
                                  </span>
                                </div>
                              ) : remainingTime <= 3 ||
                                item?.gstatus !== "OPEN" ? (
                                <div className="relative h-full w-full flex items-center justify-center flex-col">
                                  <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center z-10 rounded">
                                    <span className="text-white opacity-100">
                                      <FontAwesomeIcon icon={faLock} />
                                    </span>
                                  </div>
                                  <span className="casino-odds">{item?.b}</span>
                                  <span className="exposure-display text-red-600 text-xs z-20 relative">
                                    {getExposureForSid(item?.sid)}
                                  </span>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: item?.nat,
                                      boxColor: "bg-[#B2D6F0]",
                                      matchOdd: item?.b,
                                      stake: 0,
                                      mid: cardData?.mid || staticData.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                  className="cursor-pointer hover:bg-blue-400 h-full w-full flex items-center justify-center flex-col"
                                >
                                  <span className="casino-odds">{item?.b}</span>
                                  <span className="exposure-display text-red-600 text-xs">
                                    {getExposureForSid(item?.sid)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="casino-table-box-divider" />

                    {/* Player B Section */}
                    <div className="casino-table-right-box">
                      <div className="casino-table-header">
                        <div className="casino-nation-detail">Player B</div>
                      </div>
                      <div className="casino-table-body">
                        <div className="casino-table-row">
                          <div className="casino-odds-box">Winner</div>
                          <div className="casino-odds-box">Top 9</div>
                          <div className="casino-odds-box">M Baccarat B</div>
                        </div>
                        <div className="casino-table-row">
                          {playerB.map((item, index) => (
                            <div
                              key={index}
                              className="casino-odds-box back relative"
                            >
                              {casinoSpecialPermission ? (
                                <div
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: item?.nat,
                                      boxColor: "bg-[#B2D6F0]",
                                      matchOdd: item?.b,
                                      stake: 0,
                                      mid: cardData?.mid || staticData.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                  className="cursor-pointer hover:bg-blue-400 h-full w-full flex items-center justify-center flex-col"
                                >
                                  <span className="casino-odds">{item?.b}</span>
                                  <span className="exposure-display text-red-600 text-xs">
                                    {getExposureForSid(item?.sid)}
                                  </span>
                                </div>
                              ) : remainingTime <= 3 ||
                                item?.gstatus !== "OPEN" ? (
                                <div className="relative h-full w-full flex items-center justify-center flex-col">
                                  <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center z-10 rounded">
                                    <span className="text-white opacity-100">
                                      <FontAwesomeIcon icon={faLock} />
                                    </span>
                                  </div>
                                  <span className="casino-odds">{item?.b}</span>
                                  <span className="exposure-display text-red-600 text-xs z-20 relative">
                                    {getExposureForSid(item?.sid)}
                                  </span>
                                </div>
                              ) : (
                                <div
                                  onClick={() => {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: item?.nat,
                                      boxColor: "bg-[#B2D6F0]",
                                      matchOdd: item?.b,
                                      stake: 0,
                                      mid: cardData?.mid || staticData.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                  className="cursor-pointer hover:bg-blue-400 h-full w-full flex items-center justify-center flex-col"
                                >
                                  <span className="casino-odds">{item?.b}</span>
                                  <span className="exposure-display text-red-600 text-xs">
                                    {getExposureForSid(item?.sid)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Result Section */}
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

              {/* Result Modal */}
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
                            <div className="grid grid-cols-2 gap-4 mt-4">

                              {/* PLAYER A */}
                              <div className="text-center">
                                <h4 className="result-title font-bold text-lg">Player A</h4>

                                <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
                                  {individualResultData?.cards
                                    ?.split(",")
                                    ?.filter((_, i) => i % 2 === 0)
                                    ?.map((card) => (
                                      <img
                                        key={card}
                                        className="h-[54px]"
                                        src={cardsData.find((v) => v.code === card)?.image}
                                      />
                                    ))}

                                  {individualResultData?.win == "1" && (
                                    <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
                                      <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* PLAYER B */}
                              <div className="text-center">
                                <h4 className="result-title font-bold text-lg">Player B</h4>

                                <div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
                                  {individualResultData?.cards
                                    ?.split(",")
                                    ?.filter((_, i) => i % 2 !== 0)
                                    ?.map((card) => (
                                      <img
                                        key={card}
                                        className="h-[54px]"
                                        src={cardsData.find((v) => v.code === card)?.image}
                                      />
                                    ))}

                                  {individualResultData?.win == "2" && (
                                    <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
                                      <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
                                    </div>
                                  )}
                                </div>
                              </div>

                            </div>

                            {/* DESCRIPTION BOX (Winner, Under/Over etc) */}
                            {/* DESCRIPTION BOX DYNAMIC */}
                            <div className="row mt-2 justify-content-center">
                              <div className="col-md-6">
                                <div className="casino-result-desc">

                                  {(() => {
                                    const descArray = individualResultData?.newdesc?.split("#") || [];

                                    const labels = ["Winner", "Top 9", "M Baccarat"];

                                    return labels.map((label, i) => (
                                      <div className="casino-result-desc-item" key={i}>
                                        <div>{label}:</div>
                                        <div>{descArray[i] || "-"}</div>
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
                      className={`result cursor-pointer ${item.win === "1" ? "result-a" : "result-b"
                        }`}
                    >
                      {item.win === "1" ? "A" : "B"}
                    </span>

                  ))
                ) : (
                  <>No Results Found</>
                )}
              </div>
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
                  game={item?.gameName || "Teen Muf"}
                  bet={bet}
                />
              </div>
            </div>
          </>
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
                game={item?.gameName || "Teen Muf"}
                bet={bet}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Teenmuf;

// import React, { useContext, useEffect, useRef, useState } from "react";
// import { useCookies } from "react-cookie";
// import { Link, useLocation } from "react-router-dom";
// import { casinoIndividualResult } from "../../helpers/casino";
// import { decodedTokenData, signout } from "../../helpers/auth";
// import { useQuery, useQueryClient } from "react-query";
// import useCountdown from "../../hook/useCountdown";
// import cricketBall from "../../assets/Cricket_ball.svg";
// import cardsData from "../../assets/cards/data";
// import BetModal from "../common/BetModal";
// import "@leenguyen/react-flip-clock-countdown/dist/index.css";
// import PlaceBet from "../common/PlaceBet";
// import CardsUi from "../common/CardsUi";
// import Timer from "../common/Timer";
// import Header from "../common/Header";
// import PlayerOdds from "../common/PlayerOdds";
// import HeaderTab from "../common/HeaderTab";
// import { PlaceBetUseContext } from "../../Context/placeBetContext";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
// import Frame from "../common/Frame";
// import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
// import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
// import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
// import useScrollFixed from "../../hook/useFixed";
// import { getMyCasinoBetHistory } from "../../helpers/betHistory";
// import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
// import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";

// const Teenmuf = ({
//   myCurrentCasinoBets,
//   refetchCurrentBets,
//   refetchCasinoBetHistory,
//   CasinoBetHistory,
//   casinoSpecialPermission,
//   casinoData,
// }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);

//   // Decode token safely
//   const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

//   const location = useLocation();
//   const item = location.state?.item;

//   const queryClient = useQueryClient();
//   const {
//     placeBet,
//     setPlaceBet,
//     betData,
//     setBetData,
//     latestBetData,
//     setLatestBetData,
//   } = useContext(PlaceBetUseContext);
//   const latestBetDataRef = useRef(betData);

//   const isFixed = useScrollFixed();

//   const [Countdown, setCountdown] = useState(0);
//   const [cardData, setCardData] = useState([]);
//   const [individualResultData, setIndividualResultData] = useState(null);
//   const [isBetModalOpen, setIsBetModalOpen] = useState(false);
//   const [bet, setBet] = useState(false);

//   const [resultId, setResultId] = useState(false);

//   const {
//     isLoading: isLoadingIndividualResult,
//     data: IndividualResult,
//     isSuccess: isSuccessIndividualResult,
//     refetch: refetchIndividualResult,
//   } = useQuery(
//     ["casinoIndividualResult", { cookies, resultId }],
//     () => casinoIndividualResult(cookies, resultId),
//     {
//       enabled: false,
//     }
//   );

//   if (
//     casinoData?.error === "Token has expired" ||
//     casinoData?.error === "Invalid token" ||
//     IndividualResult?.error === "Token has expired" ||
//     IndividualResult?.error === "Invalid token"
//   ) {
//     signout(userId, removeCookie, () => {
//       navigate("/sign-in");
//       return null;
//     });
//   }

//   useEffect(() => {
//     if (
//       casinoData &&
//       casinoData?.data?.data?.data &&
//       casinoData?.data?.data?.data?.status !== "error" &&
//       casinoData?.data?.data?.data?.t1?.[0]?.autotime != ""
//     ) {
//       setCountdown(
//         parseInt(casinoData?.data?.data?.data?.t1?.[0]?.autotime || 0)
//       );
//       setCardData(casinoData?.data?.data?.data?.t1?.[0]);
//     }
//   }, [casinoData]);

//   const handleCountdownEnd = () => {
//     queryClient.invalidateQueries([
//       "casinoGameOdds",
//       { cookies, slug: item?.slug },
//     ]);
//     refetchCurrentBets();
//     refetchCasinoBetHistory();
//     queryClient.invalidateQueries([
//       "casinoGameTopTenResult",
//       { cookies, slug: item?.slug },
//     ]);
//   };

//   const { remainingTime, endTime } = useCountdown(
//     Countdown,
//     handleCountdownEnd
//   );

//   if (
//     remainingTime == 35 ||
//     remainingTime == 30 ||
//     remainingTime == 20 ||
//     remainingTime == 25 ||
//     remainingTime == 15 ||
//     remainingTime == 10
//   ) {
//     queryClient.invalidateQueries([
//       "casinoGameOdds",
//       { cookies, slug: item?.slug },
//     ]);
//     queryClient.invalidateQueries([
//       "casinoGameTopTenResult",
//       { cookies, slug: item?.slug },
//     ]);
//     refetchCurrentBets();
//     refetchCasinoBetHistory();
//   }

//   const getResultText = (result) => {
//     switch (result) {
//       case "1":
//         return "A";
//       case "2":
//         return "B";
//       case "0":
//         return "0";
//     }
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const filteredBetHistory = useFilterIndividualBetHistory(
//     CasinoBetHistory,
//     individualResultData
//   );

//   useEffect(() => {
//     if (latestBetData && casinoData?.data?.data?.data?.t2) {
//       const currentOdds = casinoData?.data?.data?.data?.t2.find(
//         (data) => data.sid || data.sectionId === latestBetData.sid
//       );

//       if (
//         currentOdds &&
//         currentOdds.matchOdd !== latestBetDataRef.current.matchOdd &&
//         betData.oddType === "casino_odds"
//       ) {
//         if (remainingTime <= 4) {
//           setLatestBetData((prev) => ({
//             ...prev,
//             matchOdd: "SUSPENDED",
//           }));
//         }
//         if (latestBetData.mid != currentOdds.mid) {
//           setPlaceBet(false);
//         }
//       }
//     }
//   }, [remainingTime]);

//   // Helper function to get exposure for a specific sid
//   const getExposureForSid = (sid) => {
//     const filteredBet = myCurrentCasinoBets?.currentCasinoBets
//       ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
//       ?.filter(
//         (doc) =>
//           doc.currentBet.oddType === "casino_odds" &&
//           doc.currentBet.sid === sid &&
//           doc.exposure.isPreviousExposure == false
//       )
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))?.[0];

//     return filteredBet?.exposure?.exposure || 0;
//   };

//   // Organize data for the table
//   const getTableData = () => {
//     if (!casinoData?.data?.data?.data?.sub) return { playerA: [], playerB: [] };

//     const subData = casinoData.data.data.data.sub;

//     const playerA = [
//       subData.find((item) => item.sid === 1), // Winner A
//       subData.find((item) => item.sid === 3), // Top 9 A
//       subData.find((item) => item.sid === 5), // M Baccarat A
//     ].filter(Boolean);

//     const playerB = [
//       subData.find((item) => item.sid === 2), // Winner B
//       subData.find((item) => item.sid === 4), // Top 9 B
//       subData.find((item) => item.sid === 6), // M Baccarat B
//     ].filter(Boolean);

//     return { playerA, playerB };
//   };

//   const { playerA, playerB } = getTableData();

//   return (
//     <>
//       <div className="block md:hidden">
//         <Header
//           gameName={item?.gameName}
//           min={cardData?.min}
//           max={cardData?.max}
//           mid={cardData?.mid}
//         />
//       </div>
//       <HeaderTab
//         bet={bet}
//         setBet={setBet}
//         mid={cardData?.mid}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//       />

//       <div className="md:flex relative w-full h-full">
//         {!bet && (
//           <>
//             <div className="center-container">
//               <div className="w-full relative">
//                 <div className="hidden md:block">
//                   <Header
//                     gameName={item?.gameName}
//                     min={cardData?.min}
//                     max={cardData?.max}
//                     mid={cardData?.mid}
//                   />
//                 </div>
//                 <div className="casino-video">
//                   <Frame item={item} />
//                   {/* Cards display */}
//                   <div className="absolute top-0 left-1">
//                     {Array.isArray(cardData) ? (
//                       <>
//                         {cardData.map((i, idx) => (
//                           <div key={idx}>
//                             <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
//                               {i.nation}
//                             </h4>
//                             <div className="flex gap-2">
//                               <div className="col text-white">
//                                 <img
//                                   src={
//                                     cardsData.find((c) => c.code == i?.C1).image
//                                   }
//                                   className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                   alt={
//                                     cardsData.find((c) => c.code == i?.C1).name
//                                   }
//                                 />
//                               </div>
//                               <div className="col text-white">
//                                 <img
//                                   src={
//                                     cardsData.find((c) => c.code == i?.C2).image
//                                   }
//                                   className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                   alt={
//                                     cardsData.find((c) => c.code == i?.C2).name
//                                   }
//                                 />
//                               </div>
//                               <div className="col text-white">
//                                 <img
//                                   src={
//                                     cardsData.find((c) => c.code == i?.C3).image
//                                   }
//                                   className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                   alt={
//                                     cardsData.find((c) => c.code == i?.C3).name
//                                   }
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </>
//                     ) : (
//                       <>
//                         <div>
//                           <h4 className="text-white text-xs my-0 md:text-sm font-semibold uppercase">
//                             Player A
//                           </h4>
//                           <div className="flex gap-2">
//                             <div className="col text-white">
//                               {cardsData &&
//                                 cardsData.find(
//                                   (i) => i.code == cardData?.C1
//                                 ) && (
//                                   <img
//                                     src={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C1
//                                       ).image
//                                     }
//                                     className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                     alt={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C1
//                                       ).name
//                                     }
//                                   />
//                                 )}
//                             </div>
//                             <div className="col text-white">
//                               {cardsData &&
//                                 cardsData.find(
//                                   (i) => i.code == cardData?.C2
//                                 ) && (
//                                   <img
//                                     src={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C2
//                                       ).image
//                                     }
//                                     className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                     alt={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C2
//                                       ).name
//                                     }
//                                   />
//                                 )}
//                             </div>
//                             <div className="col text-white">
//                               {cardsData &&
//                                 cardsData.find(
//                                   (i) => i.code == cardData?.C3
//                                 ) && (
//                                   <img
//                                     src={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C3
//                                       ).image
//                                     }
//                                     className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                     alt={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C3
//                                       ).name
//                                     }
//                                   />
//                                 )}
//                             </div>
//                           </div>
//                         </div>
//                         <div>
//                           <h4 className="text-white text-xs my-0 md:text-sm font-semibold uppercase">
//                             Player B
//                           </h4>
//                           <div className="flex gap-2">
//                             <div className="col text-white">
//                               {cardsData &&
//                                 cardsData.find(
//                                   (i) => i.code == cardData?.C4
//                                 ) && (
//                                   <img
//                                     src={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C4
//                                       ).image
//                                     }
//                                     className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                     alt={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C4
//                                       ).name
//                                     }
//                                   />
//                                 )}
//                             </div>
//                             <div className="col text-white">
//                               {cardsData &&
//                                 cardsData.find(
//                                   (i) => i.code == cardData?.C5
//                                 ) && (
//                                   <img
//                                     src={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C5
//                                       ).image
//                                     }
//                                     className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                     alt={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C5
//                                       ).name
//                                     }
//                                   />
//                                 )}
//                             </div>
//                             <div className="col text-white">
//                               {cardsData &&
//                                 cardsData.find(
//                                   (i) => i.code == cardData?.C6
//                                 ) && (
//                                   <img
//                                     src={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C6
//                                       ).image
//                                     }
//                                     className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                                     alt={
//                                       cardsData.find(
//                                         (i) => i.code == cardData?.C6
//                                       ).name
//                                     }
//                                   />
//                                 )}
//                             </div>
//                           </div>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                   {/* Timer */}
//                   <div className="absolute bottom-2 right-2">
//                     <Timer time={endTime} />
//                   </div>
//                 </div>
//               </div>

//               {/* Casino Table Design */}
//               <div className="teenpattimuflis casino-detail">
//                 <div className="casino-table">
//                   <div className="casino-table-box">
//                     <div className="casino-table-left-box">
//                       <div className="casino-table-header">
//                         <div className="casino-nation-detail">Player A</div>
//                       </div>
//                       <div className="casino-table-body">
//                         <div className="casino-table-row">
//                           <div className="casino-odds-box">Winner</div>
//                           <div className="casino-odds-box">Top 9</div>
//                           <div className="casino-odds-box">M Baccarat A</div>
//                         </div>
//                         <div className="casino-table-row">
//                           {playerA.map((item, index) => (
//                             <div
//                               key={index}
//                               className="casino-odds-box back relative"
//                             >
//                               {casinoSpecialPermission ? (
//                                 <div
//                                   onClick={() => {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: item?.nat,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }}
//                                   className="cursor-pointer hover:bg-blue-400"
//                                 >
//                                   <span className="casino-odds">{item?.b}</span>
//                                   <span className="exposure-display text-red-600 text-xs absolute bottom-0 left-0 right-0 text-center">
//                                     {getExposureForSid(item?.sid)}
//                                   </span>
//                                 </div>
//                               ) : remainingTime <= 3 ||
//                                 item?.gstatus !== "OPEN" ? (
//                                 <div className="relative">
//                                   <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center z-10">
//                                     <span className="text-white opacity-100">
//                                       <FontAwesomeIcon icon={faLock} />
//                                     </span>
//                                   </div>
//                                   <span className="casino-odds">{item?.b}</span>
//                                   <span className="exposure-display text-red-600 text-xs absolute bottom-0 left-0 right-0 text-center z-20">
//                                     {getExposureForSid(item?.sid)}
//                                   </span>
//                                 </div>
//                               ) : (
//                                 <div
//                                   onClick={() => {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: item?.nat,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }}
//                                   className="cursor-pointer hover:bg-blue-400"
//                                 >
//                                   <span className="casino-odds">{item?.b}</span>
//                                   <span className="exposure-display text-red-600 text-xs absolute bottom-0 left-0 right-0 text-center">
//                                     {getExposureForSid(item?.sid)}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="casino-table-box-divider" />
//                     <div className="casino-table-right-box">
//                       <div className="casino-table-header">
//                         <div className="casino-nation-detail">Player B</div>
//                       </div>
//                       <div className="casino-table-body">
//                         <div className="casino-table-row">
//                           <div className="casino-odds-box">Winner</div>
//                           <div className="casino-odds-box">Top 9</div>
//                           <div className="casino-odds-box">M Baccarat B</div>
//                         </div>
//                         <div className="casino-table-row">
//                           {playerB.map((item, index) => (
//                             <div
//                               key={index}
//                               className="casino-odds-box back relative"
//                             >
//                               {casinoSpecialPermission ? (
//                                 <div
//                                   onClick={() => {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: item?.nat,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }}
//                                   className="cursor-pointer hover:bg-blue-400"
//                                 >
//                                   <span className="casino-odds">{item?.b}</span>
//                                   <span className="exposure-display text-red-600 text-xs absolute bottom-0 left-0 right-0 text-center">
//                                     {getExposureForSid(item?.sid)}
//                                   </span>
//                                 </div>
//                               ) : remainingTime <= 3 ||
//                                 item?.gstatus !== "OPEN" ? (
//                                 <div className="relative">
//                                   <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center z-10">
//                                     <span className="text-white opacity-100">
//                                       <FontAwesomeIcon icon={faLock} />
//                                     </span>
//                                   </div>
//                                   <span className="casino-odds">{item?.b}</span>
//                                   <span className="exposure-display text-red-600 text-xs absolute bottom-0 left-0 right-0 text-center z-20">
//                                     {getExposureForSid(item?.sid)}
//                                   </span>
//                                 </div>
//                               ) : (
//                                 <div
//                                   onClick={() => {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: item?.nat,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }}
//                                   className="cursor-pointer hover:bg-blue-400"
//                                 >
//                                   <span className="casino-odds">{item?.b}</span>
//                                   <span className="exposure-display text-red-600 text-xs absolute bottom-0 left-0 right-0 text-center">
//                                     {getExposureForSid(item?.sid)}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Last Result Section */}
//               <div className="casino-last-result-title">
//                 <span>Last Result</span>
//                 <span>
//                   <Link
//                     to="/reports/casino-results"
//                     className="cursor-pointer"
//                     state={{
//                       casinoGameSlug: item?.slug,
//                     }}
//                   >
//                     View All
//                   </Link>
//                 </span>
//               </div>

//               {isModalOpen && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50">
//                   <div
//                     className="absolute inset-0 bg-gray-900 opacity-50"
//                     onClick={() => {
//                       setIsModalOpen(!isModalOpen);
//                       setIndividualResultData(undefined);
//                     }}
//                   ></div>

//                   <div className="bg-white md:relative absolute top-0 w-full z-50 max-w-3xl mx-auto">
//                     <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
//                       <h2 className="text-xl font-bold">{item.gameName}</h2>
//                       <button
//                         className="focus:outline-none"
//                         onClick={() => {
//                           setIsModalOpen(!isModalOpen);
//                           setIndividualResultData(undefined);
//                         }}
//                       >
//                         <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
//                       </button>
//                     </div>
//                     {individualResultData ? (
//                       <div className="my-3 w-full">
//                         <div>
//                           <h4 className="flex justify-end items-center text-sm font-semibold px-2">
//                             Round Id:{individualResultData?.mid}
//                           </h4>
//                         </div>
//                         <div className="grid grid-cols-2 place-items-center my-4">
//                           <div className="col-span-1 w-full place-items-start relative border-e">
//                             <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                               Player A
//                             </h1>
//                             <div className="flex gap-2 items-center justify-center">
//                               {individualResultData?.cards
//                                 ?.split(",")
//                                 ?.filter((_, index) => index % 2 === 0)
//                                 ?.map((item) => (
//                                   <img
//                                     key={item}
//                                     className="md:h-[54px] h-[34px]"
//                                     src={
//                                       cardsData.find((v) => v.code === item)
//                                         ?.image
//                                     }
//                                     alt={`Card ${item}`}
//                                   />
//                                 ))}
//                             </div>
//                             {individualResultData?.win == "1" && (
//                               <div className="absolute text-success text-2xl left-2 top-1/2 animate-bounce">
//                                 <FontAwesomeIcon
//                                   style={{ color: "green" }}
//                                   icon={faTrophy}
//                                 />
//                               </div>
//                             )}
//                           </div>
//                           <div className="col-span-1 w-full place-items-start relative">
//                             <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                               Player B
//                             </h1>
//                             <div className="flex gap-2 items-center justify-center">
//                               {individualResultData?.cards
//                                 ?.split(",")
//                                 ?.filter((_, index) => index % 2 !== 0)
//                                 ?.map((item) => (
//                                   <img
//                                     key={item}
//                                     className="md:h-[54px] h-[34px]"
//                                     src={
//                                       cardsData.find((v) => v.code === item)
//                                         ?.image
//                                     }
//                                     alt={`Card ${item}`}
//                                   />
//                                 ))}
//                             </div>
//                             {individualResultData?.win == "3" && (
//                               <div className="absolute text-success text-2xl right-2 top-1/2 animate-bounce">
//                                 <FontAwesomeIcon
//                                   style={{ color: "green" }}
//                                   icon={faTrophy}
//                                 />
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         {!filteredBetHistory.length <= 0 && (
//                           <IndividualBetHistoryTable
//                             data={filteredBetHistory}
//                           />
//                         )}
//                       </div>
//                     ) : (
//                       <div className="w-full h-full flex justify-center items-center my-4">
//                         <img
//                           <i className="fa fa-spinner fa-spin"/>
//                           className="w-16 h-16 animate-spin"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               <div className="casino-last-results">
//                 {casinoData?.data?.data?.result ? (
//                   casinoData?.data?.data?.result?.map((item, index) => (
//                     <span
//                       key={index}
//                       onClick={(e) => {
//                         e.preventDefault();
//                         setIsModalOpen(true);
//                         casinoIndividualResult(cookies, item.mid).then(
//                           (res) => {
//                             setIndividualResultData(res?.data?.data?.[0]);
//                           }
//                         );
//                       }}
//                       className={`result cursor-pointer ${
//                         item.result == 1 ? "result-a" : "result-b"
//                       }`}
//                     >
//                       {getResultText(item.result)}
//                     </span>
//                   ))
//                 ) : (
//                   <>
//                     <span className="result result-b">T</span>
//                     <span className="result result-a">D</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Sidebar */}
//             <div className="sidebar right-sidebar casino-right-sidebar sticky overflow-hidden">
//               <div className="sidebar-box my-bet-container">
//                 <div className={`${!placeBet ? "block" : "hidden"}`}>
//                   <h1 className="px-2 py-1 bg-secondaryBackground text-white">
//                     Place Bet
//                   </h1>
//                 </div>
//                 <div className={`${placeBet ? "block" : "hidden"}`}>
//                   <CasinoBetPopup
//                     time={remainingTime}
//                     gameType="casino"
//                     gameName={item?.slug}
//                     item={item}
//                     refetchCurrentBets={refetchCurrentBets}
//                     odds={null}
//                     myCurrentBets={myCurrentCasinoBets}
//                   />
//                 </div>
//               </div>
//               <div className="h-full">
//                 <PlaceBet
//                   data={myCurrentCasinoBets}
//                   game={item?.gameName}
//                   bet={bet}
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {/* Mobile Bet Popup */}
//         <div className={`${placeBet ? "block" : "hidden"}`}>
//           <div className="fixed inset-0 flex items-start justify-center z-50 md:hidden">
//             <div className="absolute top-0 inset-0 bg-gray-900 opacity-50"></div>
//             <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
//               <CasinoMobileBetPopup
//                 time={remainingTime}
//                 gameType="casino"
//                 gameName={item?.slug}
//                 item={item}
//                 refetchCurrentBets={refetchCurrentBets}
//                 odds={null}
//                 myCurrentBets={myCurrentCasinoBets}
//               />
//             </div>
//           </div>
//         </div>

//         {bet && (
//           <div className="md:w-[100%] md:hidden md:ms-1 h-fit flex-col">
//             <div className="h-screen">
//               <PlaceBet
//                 data={myCurrentCasinoBets}
//                 game={item?.gameName}
//                 bet={bet}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Teenmuf;
