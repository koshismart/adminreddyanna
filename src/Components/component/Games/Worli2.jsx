import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { casinoIndividualResult } from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import cardsData from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import useScrollFixed from "../../hook/useFixed";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const Worli2 = ({
  refetchCurrentBets,
  myCurrentCasinoBets,
  CasinoBetHistory,
  refetchCasinoBetHistory,
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
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item

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
    IndividualResult?.error === "Token has expired" ||
    IndividualResult?.error === "Invalid token"
  ) {
    signout(userId, removeCookie, () => {
      navigate("/sign-in");
      return null;
    });
  }

  useEffect(() => {
    if (casinoData && casinoData?.data?.data?.data?.t1?.[0]?.autotime != "") {
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
      default:
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
  }, [remainingTime]);

  // Default data when API is not available
  const defaultNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const defaultLines = [
    { name: "Line 1", numbers: "1|2|3|4|5" },
    { name: "ODD", numbers: "1|3|5|7|9" },
    { name: "Line 2", numbers: "6|7|8|9|0" },
    { name: "EVEN", numbers: "2|4|6|8|0" },
  ];

  // Handle item selection
  const handleItemSelect = (itemType, itemValue, betDataConfig) => {
    setSelectedItem({ type: itemType, value: itemValue });

    setPlaceBet(true);
    const newBetData = {
      betName: betDataConfig.betName,
      boxColor: "bg-[#72bbef]",
      matchOdd: "9",
      stake: 0,
      mid: cardData?.mid,
      sid: betDataConfig.sid,
      oddType: "casino_odds",
      oddCategory: "Back",
    };
    setBetData(newBetData);
    setLatestBetData(newBetData);
  };

  // Check if item is selected
  const isItemSelected = (itemType, itemValue) => {
    return selectedItem?.type === itemType && selectedItem?.value === itemValue;
  };

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
            <div className="p-2 hidden md:block bg-secondaryBackground text-white">
              <Header
                gameName={item?.gameName}
                min={cardData?.min}
                max={cardData?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="w-full relative">
              <Frame item={item} />

              {/* card */}
              <div className="absolute flex gap-2 top-1 left-1">
                {cardsData && cardsData.find((i) => i.code == cardData?.C1) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C1).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C1).name}
                  />
                )}
                {cardsData && cardsData.find((i) => i.code == cardData?.C2) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C2).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C2).name}
                  />
                )}
                {cardsData && cardsData.find((i) => i.code == cardData?.C3) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C3).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C3).name}
                  />
                )}
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* Worli Table Design */}
            <div className="worli casino-detail">
              <div className="casino-table">
                <div className="tab-content">
                  <div
                    role="tabpanel"
                    id="worli-tabs-tabpane-single"
                    aria-labelledby="worli-tabs-tab-single"
                    className="fade single tab-pane active show"
                  >
                    {remainingTime <= 3 ? (
                      <div className="worlibox suspended-box">
                        <div className="worli-left">
                          <div className="worli-box-title">
                            <b>0</b>
                          </div>
                          <div className="worli-box-row">
                            {defaultNumbers.slice(0, 5).map((number, index) => (
                              <div
                                className={`worli-odd-box back ${
                                  isItemSelected("number", number)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                              >
                                <span className="worli-odd">{number}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {defaultNumbers.slice(5).map((number, index) => (
                              <div
                                className={`worli-odd-box back ${
                                  isItemSelected("number", number)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                              >
                                <span className="worli-odd">{number}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-title">
                            <b>0</b>
                          </div>
                          <div className="worli-box-row">
                            {defaultLines.slice(0, 2).map((line, index) => (
                              <div
                                className={`worli-odd-box back ${
                                  isItemSelected("line", line.name)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                              >
                                <span className="worli-odd">{line.name}</span>
                                <span className="d-block">{line.numbers}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {defaultLines.slice(2).map((line, index) => (
                              <div
                                className={`worli-odd-box back ${
                                  isItemSelected("line", line.name)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                              >
                                <span className="worli-odd">{line.name}</span>
                                <span className="d-block">{line.numbers}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="worlibox">
                        <div className="worli-left">
                          <div className="worli-box-title">
                            <b>9</b>
                          </div>
                          <div className="worli-box-row">
                            {defaultNumbers.slice(0, 5).map((number, index) => (
                              <div
                                className={`worli-odd-box back cursor-pointer hover:bg-blue-400 ${
                                  isItemSelected("number", number)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                                onClick={(e) => {
                                  handleItemSelect("number", number, {
                                    betName: `Number ${number}`,
                                    sid: number.toString(),
                                  });
                                }}
                              >
                                <span className="worli-odd">{number}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {defaultNumbers.slice(5).map((number, index) => (
                              <div
                                className={`worli-odd-box back cursor-pointer hover:bg-blue-400 ${
                                  isItemSelected("number", number)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                                onClick={(e) => {
                                  handleItemSelect("number", number, {
                                    betName: `Number ${number}`,
                                    sid: number.toString(),
                                  });
                                }}
                              >
                                <span className="worli-odd">{number}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="worli-right">
                          <div className="worli-box-title">
                            <b>9</b>
                          </div>
                          <div className="worli-box-row">
                            {defaultLines.slice(0, 2).map((line, index) => (
                              <div
                                className={`worli-odd-box back cursor-pointer hover:bg-blue-400 ${
                                  isItemSelected("line", line.name)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                                onClick={(e) => {
                                  handleItemSelect("line", line.name, {
                                    betName: line.name,
                                    sid: line.name,
                                  });
                                }}
                              >
                                <span className="worli-odd">{line.name}</span>
                                <span className="d-block">{line.numbers}</span>
                              </div>
                            ))}
                          </div>
                          <div className="worli-box-row">
                            {defaultLines.slice(2).map((line, index) => (
                              <div
                                className={`worli-odd-box back cursor-pointer hover:bg-blue-400 ${
                                  isItemSelected("line", line.name)
                                    ? "selected"
                                    : ""
                                }`}
                                key={index}
                                onClick={(e) => {
                                  handleItemSelect("line", line.name, {
                                    betName: line.name,
                                    sid: line.name,
                                  });
                                }}
                              >
                                <span className="worli-odd">{line.name}</span>
                                <span className="d-block">{line.numbers}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
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
             <div className="row mt-2">
            <div className="col-md-12 text-center">
            {(() => {
              const cardsStr = individualResultData?.cards || "";  
              const cardArr = cardsStr.split(","); // 👉 ["8CC","2SS","ACC"]

              return (
                <div className="casino-result-cards flex gap-2 justify-center">

                  {cardArr.map((code, idx) => {
                    const cardImg = cardsData.find((v) => v.code === code)?.image;

                    return cardImg ? (
                      <img
                        key={idx}
                        className="h-[60px]"
                        src={cardImg}
                        alt={code}
                      />
                    ) : (
                      <span
                        key={idx}
                        className="text-lg font-bold"
                      >
                        {code}
                      </span>
                    );
                  })}

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
              return (
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-6">
                    <div className="casino-result-desc">

                      <div className="casino-result-desc-item">
                        <div>Winner</div>
                        <div>{winner}</div>
                      </div>

                      <div className="casino-result-desc-item">
                        <div>Ocda</div>
                        <div>{yesNo}</div>
                      </div>

                    </div>
                  </div>
                </div>
              );
              })()}
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
                  refetchCurrentBets={refetchCurrentBets}
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
      {bet && (
        <div className="md:w-[100%] md:hidden   md:ms-1 h-fit  flex-col">
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

export default Worli2;
