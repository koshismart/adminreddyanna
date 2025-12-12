import React, { useContext, useEffect, useRef, useState } from "react";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { casinoIndividualResult } from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import cardsData, {
  cardShapeForAndarBahar,
  cardVariant,
} from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import PlaceBet from "../common/PlaceBet";
import Header from "../common/Header";
import GradientButton from "../common/GradientButton";
import ComplexOdds from "../common/ComplexOdds";
import HeaderTab from "../common/HeaderTab";
import Frame from "../common/Frame";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { getAmarAkbarAnthonyGameData } from "../../helpers/IndividualGameDataHelper";
import { decodedTokenData, signout } from "../../helpers/auth";
import { getSocket } from "../../utils/socketClient";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// App.js ya DusKaDum.jsx mein

import Slider from "react-slick";

const DusKaDum = ({
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
  // Purana wala hata de → const [cards, setCards] = useState([...])
  // Naya wala laga de:
  const [cardData, setCardData] = useState(null);
  const [cards, setCards] = useState([]);
  console.log("cardData", cardData);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [bet, setBet] = useState(false);
  const isFixed = useScrollFixed();

  const {
    placeBet,
    setPlaceBet,
    betData,
    setBetData,
    latestBetData,
    setLatestBetData,
  } = useContext(PlaceBetUseContext);
  const latestBetDataRef = useRef(betData);

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
    if (
      casinoData &&
      casinoData?.data?.data?.data?.status === "success" &&
      casinoData?.data?.data?.data?.t1?.[0]
    ) {
      const currentCard = casinoData.data.data.data.t1[0];

      setCountdown(parseInt(currentCard.autotime || 0));
      setCardData(currentCard);

      // YE 4 LINE ADD KAR DE BHAI — BAS ITNA HI!
      if (currentCard.C1 && currentCard.C1 !== "1" && currentCard.C1 !== "") {
        const newCard = `${currentCard.C1}.jpg`; // "9CC" → "9CC.jpg"
        setCards((prev) => [...prev, newCard]); // naya card add ho jayega
      }
    }
  }, [casinoData]);



  console.log("casinoData", casinoData);
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
      case "3":
        return "C";
      case "2":
        return "B";
    }
  };

  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateProfitLoss = (currentBets, item) => {
    let totalProfitLoss = 0;

    currentBets?.currentCasinoBets
      ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
      ?.forEach((bet, index) => {
        const { oddCategory, profit, loss, sid } = bet?.currentBet;

        const adjustment =
          oddCategory === "Back" ? Number(profit) : -Number(loss);

        if (["1", "2", "3"].includes(sid)) {
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
        className={`${totalProfitLoss > 0 ? "text-green-800" : "text-red-500"
          } mr-6`}
      >
        {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
      </span>
    );
  };

  //individual game data
  const individualResultDesc = getAmarAkbarAnthonyGameData(
    individualResultData?.desc
  );

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

  // Handle item selection
  const handleItemSelect = (itemType, itemValue, betDataConfig) => {
    setPlaceBet(true);
    const newBetData = {
      betName: betDataConfig.betName,
      boxColor: "bg-[#72bbef]",
      matchOdd: betDataConfig.matchOdd,
      stake: 0,
      mid: cardData?.mid,
      sid: betDataConfig.sid,
      oddType: "casino_odds",
      oddCategory: betDataConfig.oddCategory || "Back",
    };
    setBetData(newBetData);
    setLatestBetData(newBetData);
  };


  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,           // sirf 3 cards dikhte hain
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: '0px',      // important
    focusOnSelect: true,
    initialSlide: cards.length - 1,  // last 3 cards show honge shuru mein
    className: "winning-cards-slider",

    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          centerPadding: '10px',
        }
      }
    ]
  };
  const NextArrow = ({ onClick }) => (
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-black/5 text-white px-2 py-1 rounded"
      onClick={onClick}
    >
      ▶
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-black/5 text-white px-2 py-1 rounded"
      onClick={onClick}
    >
      ◀
    </div>
  );

  const sliderSettings = {
    infinite: false,
    slidesToShow: 15,     // ⬅️ 15 CARDS AT A TIME
    slidesToScroll: 10,
    speed: 300,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };


  const sliderRef =useRef(null);
  useEffect(() => {
  if (!individualResultData) return;

  const arr = individualResultData?.cards?.split(",") || [];
  const lastIndex = arr.length - 1;

  sliderRef.current?.slickGoTo(lastIndex);
}, [individualResultData]);


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
            <div className="">
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
              <div className="duskadum casino-video-cards">
                <div className="dkd-total mb-1 mt-1">
                  <div>
                    <div>
                      <div>Curr. Total:</div>
                      <div className="numeric text-playerb">38</div>
                    </div>
                    <div>Card #: 4</div>
                  </div>
                  <div>Next Total 40 or More</div>
                </div>
                <div className="ab-cards-container">
                  <div className="ms-4">
                    <Slider {...settings}>
                      {cards.map((card, index) => (
                        <div key={index} className="px-2 outline-none">
                          <div className="transform transition-all duration-300">
                            <img
                              src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}`}
                              alt="winning card"
                              className="mx-auto block rounded-xl shadow-2xl"
                              style={{
                                height: '140px',           // badi cards chahiye thi na?
                                width: '100px',
                                objectFit: 'contain',
                              }}
                              draggable={false}
                            />
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
                <div className="casino-video-current-card">
                  <div className="flip-card">
                    <div className="flip-card-inner ">
                      <div className="absolute top-1 left-1">
                        <img
                          src={cardsData.find((c) => c.code == cardData?.C1)?.image}
                          className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                          alt={cardsData.find((c) => c.code == cardData?.C1)?.name}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* New HTML Structure Design */}
            <div className="duskadum casino-detail">
              <div className="casino-table">
                <div className="casino-table-box">
                  <div className="casino-table-header">
                    <div className="casino-nation-detail" />
                    <div className="casino-odds-box back">Back</div>
                    <div className="casino-odds-box lay">Lay</div>
                  </div>
                  <div className="casino-table-body">
                    {casinoData?.data?.data?.data?.t2?.slice(0, 1).map((item, index) => (
                      <div className="casino-table-row " key={index}>
                        <div className="casino-nation-detail">
                          <div className="casino-nation-name">
                            {String.fromCharCode(65 + index)}. {item?.nat}
                            {calculateProfitLoss(myCurrentCasinoBets, item)}</div>
                          <div />
                        </div>
                        {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
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
                              onClick={() => handleItemSelect('character', item.nat, {
                                betName: item?.nat,
                                matchOdd: item?.b1,
                                sid: item?.sid,
                                oddCategory: "Back"
                              })}
                            >
                              <span className="casino-odds">{item.b1}</span>
                            </div>
                            <div
                              className="casino-odds-box lay cursor-pointer hover:bg-red-400"
                              onClick={() => handleItemSelect('character', item.nat, {
                                betName: item?.nat,
                                matchOdd: item?.l1,
                                sid: item?.sid,
                                oddCategory: "Lay"
                              })}
                            >
                              <span className="casino-odds">{item.l1}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Middle Section - Even/Odd, Red/Black, Under/Over */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter((v) => v.nat.includes("Odd") || v.nat.includes("Even"))
                      .map((item) => (
                        <div className="duskadum-odd-box" key={item.sid}>
                          <div className="casino-odds text-center">
                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "0" : item.b1}
                          </div>
                          {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                            <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                              <span className="casino-odds">{item.nat}</span>
                            </div>
                          ) : (
                            <div
                              className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:opacity-90"
                              onClick={() => handleItemSelect('type', item.nat, {
                                betName: item?.nat,
                                matchOdd: item?.b1,
                                sid: item?.sid
                              })}
                            >
                              <span className="casino-odds">{item.nat}</span>
                            </div>
                          )}
                          <div className="casino-nation-book text-center" />
                        </div>
                      ))}
                  </div>
                  <div className="casino-table-right-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter((v) => v.nat.includes("Red") || v.nat.includes("Black"))
                      .map((item) => (
                        <div className="duskadum-odd-box" key={item.sid}>
                          <div className="casino-odds text-center">
                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "0" : item.b1}
                          </div>
                          {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                            <div className="casino-odds-box back casino-odds-box-theme suspended-box">
                              <div className="casino-odds">
                                <span className="card-icon ms-1">
                                  <span className={item.nat.includes("Red") ? "card-red" : "card-black"}>
                                    {item.nat.includes("Red") ? "{" : "}"}
                                  </span>
                                </span>
                                <span className="card-icon ms-1">
                                  <span className={item.nat.includes("Red") ? "card-red" : "card-black"}>
                                    {item.nat.includes("Red") ? "[" : "]"}
                                  </span>
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="casino-odds-box back casino-odds-box-theme cursor-pointer hover:opacity-90"
                              onClick={() => handleItemSelect('color', item.nat, {
                                betName: item?.nat,
                                matchOdd: item?.b1,
                                sid: item?.sid
                              })}
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

                </div>

                {/* Bottom Section - Cards */}
              </div>
            </div>

            <div className="mb-3">
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
                        <div className="modal-title h4 font-bold">{item.gameName}</div>

                        <button
                          type="button"
                          className="btn-close text-1xl"
                          onClick={() => {
                            setIsModalOpen(false);
                            setIndividualResultData(undefined);
                          }}
                        />
                      </div>

                      {/* BODY */}
                      <div className="modal-body p-4">
                        {individualResultData ? (
                          console.log("individualResultData", individualResultData),
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

                            {/* CARDS SLIDER */}
                            <div className="row mt-2 ab-result-container">
                              <div className="col-md-10 text-center">
                                <div className="casino-result-cards ab-result-slider">
                                  <Slider ref={sliderRef} {...sliderSettings}>
                                    {individualResultData?.cards
                                      ?.split(",")
                                      ?.map((card) => {
                                        const img = cardsData.find((c) => c.code === card)?.image;
                                        return (
                                          <div key={card}>
                                            <img
                                              src={img}
                                              className="h-[40px] mx-auto rounded"
                                              alt={card}
                                            />
                                          </div>
                                        );
                                      })}
                                  </Slider>

                                </div>
                              </div>
                              <div className="col-md-2 text-center">
                                <div className="casino-result-cards">

                                  {/* LAST CARD IMAGE DYNAMIC */}
                                  {(() => {
                                    const cards = individualResultData?.cards?.split(",");
                                    const lastCard = cards?.[cards.length - 1]; // 👉 LAST CARD

                                    const lastCardImg = cardsData.find((c) => c.code === lastCard)?.image;

                                    return (
                                      <img
                                        className="h-[60px] mx-auto rounded"
                                        src={lastCardImg}
                                        alt={lastCard}
                                      />
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                            {/* DESCRIPTION BOX */}
                            <div className="row mt-6 justify-content-center">
                              <div className="col-md-6">
                                <div className="casino-result-desc">

                                  {individualResultData?.newdesc
                                    ?.split("#")
                                    ?.map((v, i) => (
                                      <div
                                        className="casino-result-desc-item flex justify-center border-b py-1"
                                        key={i}
                                      >
                                        <div>{["Card", "Curr. Total", "Total", "Odd/Even", "Red/Black"][i]}</div>
                                        <div>{v}</div>
                                      </div>
                                    ))}

                                </div>
                              </div>
                            </div>

                            {/* BET TABLE */}
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
                      className={`result cursor-pointer ${item.win === "1" ? "result-a" : "result-b"
                        }`}
                    >
                      {item.win === "1" ? "Y" : "N"}
                    </span>

                  ))
                ) : (
                  <>No Results Found</>
                )}
              </div>
              {/* result end */}
            </div>
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
                    (doc) => doc.subtype == "dum10"
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
              gameType="casino"
              time={remainingTime}
              gameName={item?.slug}
              item={item}
              odds={casinoData?.data?.data?.data?.t2?.filter(
                (doc) => doc.subtype == "dum10"
              )}
              refetchCurrentBets={refetchCurrentBets}
              myCurrentBets={myCurrentCasinoBets}
            />

          </div>
        </div>
      </div>
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

export default DusKaDum;