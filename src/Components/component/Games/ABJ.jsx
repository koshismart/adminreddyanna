import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { casinoIndividualResult } from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import cardsData, {
  cardShape,
  cardShapeForAndarBahar,
  cardVariant,
} from "../../assets/cards/data";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import Slider from "react-slick";

const ABJ = ({
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
  const latestBetDataRef = useRef(betData);

  const isFixed = useScrollFixed();

  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [bet, setBet] = useState(false);
  const navigate = useNavigate();

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
      casinoData?.data?.data?.data &&
      casinoData?.data?.data?.data?.status !== "error" &&
      casinoData?.data?.data?.data?.t1?.[0].autotime != ""
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

  const getResultText = (result) => {
    switch (result) {
      case "1":
        return "A";
      case "2":
        return "B";
    }
  };

  // result modal
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


// ANDAR SLIDER – AB BILKUL ULTRA SLOW & REAL CASINO JAISE
const AndarSlider = ({ cardData, cardsData }) => {
  const sliderRef = useRef(null);

  const cards = cardData?.cards
    ?.split(",")
    .slice(3, 51)
    .filter((_, i) => i % 2 !== 0)
    .map(v => v !== "1" ? cardsData.find(c => c.code === v) : null)
    .filter(Boolean);

  useEffect(() => {
    if (sliderRef.current && cards && cards.length > 3) {
      const lastIndex = cards.length - 1;
      const targetSlide = lastIndex - 2;

      // 10 SECOND MEIN DHEERE DHEERE JAYEGA — BILKUL REAL CASINO JAISE
      sliderRef.current.slickGoTo(targetSlide, false);
    }
  }, [cards?.length]);

  if (!cards || cards.length === 0) return null;

  if (cards.length <= 3) {
    return (
      <div className="flex gap-2 items-center">
        {cards.map((card, i) => (
          <img key={i} src={card.image} style={{ height: "35px", width: "28px" }} alt={card.name}  />
        ))}
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 10000,                    // 10 SECOND — ULTRA SLOW
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    cssEase: "linear",               // Linear = perfectly smooth slow motion
    prevArrow: <button className="slick-prev !text-white !bg-black/60 !w-7 !h-7 rounded-full text-xs">Left</button>,
    nextArrow: <button className="slick-next !text-white !bg-black/60 !w-7 !h-7 rounded-full text-xs">Right</button>,
  };

  return (
    <Slider ref={sliderRef} {...settings} className="casino-card-slider">
      {cards.map((card, i) => (
        <div key={i} className="px-1">
          <img src={card.image} style={{ height: "35px", width: "28px" }} alt={card.name}  />
        </div>
      ))}
    </Slider>
  );
};

const BaharSlider = ({ cardData, cardsData }) => {
  const sliderRef = useRef(null);

  const cards = cardData?.cards
    ?.split(",")
    .slice(3, 51)
    .filter((_, i) => i % 2 === 0)
    .map(v => v !== "1" ? cardsData.find(c => c.code === v) : null)
    .filter(Boolean);

  useEffect(() => {
    if (sliderRef.current && cards && cards.length > 3) {
      const lastIndex = cards.length - 1;
      const targetSlide = lastIndex - 2;
      sliderRef.current.slickGoTo(targetSlide, false);
    }
  }, [cards?.length]);

  if (!cards || cards.length === 0) return null;

  if (cards.length <= 3) {
    return (
      <div className="flex gap-2 items-center">
        {cards.map((card, i) => (
          <img key={i} src={card.image} style={{ height: "35px", width: "28px" }} alt={card.name}  />
        ))}
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 10000,                    // 10 SECOND — JAISA TU CHAHTA THA
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    swipeToSlide: true,
    cssEase: "linear",               // Perfect slow motion
    prevArrow: <button className="slick-prev !text-white !bg-black/60 !w-7 !h-7 rounded-full text-xs">Left</button>,
    nextArrow: <button className="slick-next !text-white !bg-black/60 !w-7 !h-7 rounded-full text-xs">Right</button>,
  };

  return (
    <Slider ref={sliderRef} {...settings} className="casino-card-slider">
      {cards.map((card, i) => (
        <div key={i} className="px-1">
          <img src={card.image} style={{ height: "35px", width: "28px" }} alt={card.name}  />
        </div>
      ))}
    </Slider>
  );
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
            <div className="casino-video">
              <Frame item={item} />
              <div className="">
              <div className="absolute top-2 left-2 bg-#000">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <h1 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                      A
                    </h1>
                    <h1 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                      B
                    </h1>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* first card */}
                   <div>
                    <img
                      src={cardsData.find(c => c.code === cardData?.cards?.split(",")[0])?.image}
                      style={{ height: "35px", width: "28px" }}  // YEH CHANGE KAR DE
                      alt={cardsData.find(c => c.code === cardData?.cards?.split(",")[0])?.name}
                    />
                  </div>
                    {/* other cards */}
                    <div className="flex flex-col gap-4">
                      <div className="flex md:gap-8 gap-4 text-white">
                        <div className="casino-odds text-center">
                          <div>
                          <img
                            src={cardsData.find(c => c.code === cardData?.cards?.split(",")[2])?.image}
                            style={{ height: "35px", width: "28px" }}  // YEH CHANGE KAR DE
                            alt={cardsData.find(c => c.code === cardData?.cards?.split(",")[2])?.name}
                          />
                        </div>
                        </div>
                           {/* ye slider me aayega  */}
                        {/* ANDAR SLIDER - Sirf 4+ cards pe arrow dikhega */}
                       <div className="md:w-28 w-18">
                        <AndarSlider cardData={cardData} cardsData={cardsData} />
                      </div>

                      </div>
                      <div className="flex md:gap-8 gap-4 text-white">
                       <div>
                          <img
                            src={cardsData.find(c => c.code === cardData?.cards?.split(",")[1])?.image}
                            style={{ height: "35px", width: "28px" }}  // YEH CHANGE KAR DE
                            alt={cardsData.find(c => c.code === cardData?.cards?.split(",")[1])?.name}
                          />
                        </div>
                        {/* and ye slider hoga */}
                       {/* BAHAR SLIDER - Sirf 4+ cards pe arrow dikhega */}
                      <div className="md:w-28 w-18">
                      <BaharSlider cardData={cardData} cardsData={cardsData} />
                      </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* New HTML Structure Design */}
            <div className="ab2 casino-detail">
              <div className="casino-table">
                {/* Top Section - Player A and Player B */}
                <div className="casino-table-full-box">
                  {/* Player A Section */}
                  <div className="playera-bets">
                    <div className="playera-title">A</div>
                    {casinoData?.data?.data?.data?.t2
                      ?.filter((v) => ["1", "2", "3"]?.includes(v.sid))
                      ?.map((item, idx) => (
                        <div
                          className={idx === 0 ? "player-sa" : "player-bet"}
                          key={item.sid}
                        >
                          {remainingTime <= 3 ||
                          item.gstatus === "SUSPENDED" ? (
                            <div
                              className={
                                idx === 0
                                  ? "player-sa-box suspended-box"
                                  : "player-bet-box suspended-box"
                              }
                            >
                              <div className="casino-odds">
                                {item.nat !== "SA" ? item.nat + " A" : item.nat}
                              </div>
                              <div className="casino-volume">0</div>
                            </div>
                          ) : (
                            <div
                              className={
                                idx === 0
                                  ? "player-sa-box cursor-pointer hover:opacity-90"
                                  : "player-bet-box cursor-pointer hover:opacity-90"
                              }
                              onClick={() =>
                                handleItemSelect("player-a", item.nat, {
                                  betName:
                                    item.nat !== "SA"
                                      ? item.nat + " A"
                                      : item.nat,
                                  matchOdd: item?.b1,
                                  sid: item?.sid,
                                })
                              }
                            >
                              <div className="casino-odds">
                                {item.nat !== "SA" ? item.nat + " A" : item.nat}
                              </div>
                              <div className="casino-volume">{item.b1}</div>
                            </div>
                          )}
                          <div className="casino-nation-book text-center" />
                        </div>
                      ))}
                    <div className="playera-title">A</div>
                  </div>

                  {/* Player B Section */}
                  <div className="playera-bets">
                    <div className="playera-title">B</div>
                    {casinoData?.data?.data?.data?.t2
                      ?.filter((v) => ["4", "5", "6"]?.includes(v.sid))
                      ?.map((item, idx) => (
                        <div
                          className={idx === 0 ? "player-sa" : "player-bet"}
                          key={item.sid}
                        >
                          {remainingTime <= 3 ||
                          item.gstatus === "SUSPENDED" ? (
                            <div
                              className={
                                idx === 0
                                  ? "player-sa-box suspended-box"
                                  : "player-bet-box suspended-box"
                              }
                            >
                              <div className="casino-odds">
                                {item.nat !== "SB" ? item.nat + " B" : item.nat}
                              </div>
                              <div className="casino-volume">0</div>
                            </div>
                          ) : (
                            <div
                              className={
                                idx === 0
                                  ? "player-sa-box cursor-pointer hover:opacity-90"
                                  : "player-bet-box cursor-pointer hover:opacity-90"
                              }
                              onClick={() =>
                                handleItemSelect("player-b", item.nat, {
                                  betName:
                                    item.nat !== "SB"
                                      ? item.nat + " B"
                                      : item.nat,
                                  matchOdd: item?.b1,
                                  sid: item?.sid,
                                })
                              }
                            >
                              <div className="casino-odds">
                                {item.nat !== "SB" ? item.nat + " B" : item.nat}
                              </div>
                              <div className="casino-volume">{item.b1}</div>
                            </div>
                          )}
                          <div className="casino-nation-book text-center" />
                        </div>
                      ))}
                    <div className="playera-title">B</div>
                  </div>
                </div>

                {/* Middle Section - ODD/EVEN and Card Suits */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter(
                        (v) => v.nat.includes("Even") || v.nat.includes("Odd")
                      )
                      ?.map((item) => (
                        <div className="ab2-box" key={item.sid}>
                          <div className="casino-odds text-center">
                            {item.nat.replace("Joker ", "")}
                          </div>
                          {remainingTime <= 3 ||
                          item.gstatus === "SUSPENDED" ? (
                            <div className="casino-odds-box back suspended-box">
                              <span className="casino-odds">0</span>
                            </div>
                          ) : (
                            <div
                              className="casino-odds-box back cursor-pointer hover:bg-blue-400"
                              onClick={() =>
                                handleItemSelect("odd-even", item.nat, {
                                  betName: item?.nat,
                                  matchOdd: item?.b1,
                                  sid: item?.sid,
                                })
                              }
                            >
                              <span className="casino-odds">{item.b1}</span>
                            </div>
                          )}
                          <div className="casino-nation-book text-center" />
                        </div>
                      ))}
                  </div>
                  <div className="casino-table-right-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter(
                        (v) =>
                         
                          v.nat.includes("Heart") ||
                          v.nat.includes("Club") ||
                          v.nat.includes("Diamond") ||
                          v.nat.includes("Spade")
                      )
                      .sort((a, b) => {
                        const cardOrder = ["Heart", "Club", "Diamond", "Spade"];
                        const aSuit = cardOrder.indexOf(a.nat.split(" ")[1]);
                        const bSuit = cardOrder.indexOf(b.nat.split(" ")[1]);
                        return aSuit - bSuit;
                      })
                      .map((item) => (
                      console.log("v nation name",item),
                        <div className="ab2-box" key={item.sid}>
                          <div className="casino-odds text-center">
                            <img
                              src={
                                cardShapeForAndarBahar.find(
                                  (v) =>
                                    v.name === item.nat.replace("Joker ", "")
                                )?.image
                              }
                              alt={item.nat.replace("Joker ", "")}
                            />
                          </div>
                          {remainingTime <= 3 ||
                          item.gstatus === "SUSPENDED" ? (
                            <div className="casino-odds-box back suspended-box">
                              <span className="casino-odds">0</span>
                            </div>
                          ) : (
                            <div
                              className="casino-odds-box back cursor-pointer hover:bg-blue-400"
                              onClick={() =>
                                handleItemSelect("suit", item.nat, {
                                  betName: item?.nat,
                                  matchOdd: item?.b1,
                                  sid: item?.sid,
                                })
                              }
                            >
                              <span className="casino-odds">{item.b1}</span>
                            </div>
                          )}
                          <div className="casino-nation-book text-center" />
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom Section - Cards */}
                <div className="casino-table-full-box ab2cards mt-3">
                  {casinoData?.data?.data?.data?.t2
                    ?.filter(
                      (v) =>
                        v.nat.includes("Joker") &&
                        !v.nat.includes("Spade") &&
                        !v.nat.includes("Club") &&
                        !v.nat.includes("Heart") &&
                        !v.nat.includes("Diamond") &&
                        !v.nat.includes("Odd") &&
                        !v.nat.includes("Even")
                    )
                    .map((item, idx) => (
                      <div className="card-odd-box" key={item.sid}>
                        {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                          <div className="suspended-box">
                            <img
                              src={
                                cardVariant.find(
                                  (v) =>
                                    v.code == item.nat.replace("Joker ", "")
                                )?.image
                              }
                              alt={item.nat.replace("Joker ", "")}
                            />
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              handleItemSelect("card", item.nat, {
                                betName: item?.nat,
                                matchOdd: item?.b1,
                                sid: item?.sid,
                              })
                            }
                          >
                            <img
                              src={
                                cardVariant.find(
                                  (v) =>
                                    v.code == item.nat.replace("Joker ", "")
                                )?.image
                              }
                              alt={item.nat.replace("Joker ", "")}
                            />
                          </div>
                        )}
                        <div className="casino-nation-book" />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* result start */}
            <div className="casino-last-result-title">
              <div className="flex text-md justify-between px-2 text-white">
                <span>Last Result</span>
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
                      ></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body p-4">
                      {individualResultData ? (
                        (() => {
                          const cardsArray = individualResultData?.cards?.split(",") || [];
                          const playerA = cardsArray[0];
                          const playerB = cardsArray[1];
                          const sliderA = cardsArray.slice(2, 10);
                          const sliderB = cardsArray.slice(10, 18);

                          const descArr =
                            individualResultData?.desc?.split("||").map((v) => v.trim()) || [];

                          return (
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

                              {/* PLAYER A / B UI */}
                              <div className="row row5 ab2-result-container mt-3">
                                <div className="col-1">
                                  <div className="row row5">
                                    <div className="col-12"><b>A</b></div>
                                  </div>
                                  <div className="row row5 mt-3">
                                    <div className="col-12"><b>B</b></div>
                                  </div>
                                </div>

                                {/* PLAYER A CARD */}
                                <div className="col-2">
                                  <img
                                    src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${playerA}.jpg`}
                                  />
                                </div>

                                {/* SLIDERS FOR PLAYER A & B */}
                                <div className="col-9">

                                  {/* A SLIDER */}
                                  <div className="row row5">
                                    <div className="col-3">
                                      <img
                                        src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${sliderA[0]}.jpg`}
                                      />
                                    </div>
                                    <div className="col-9 ab-result-slider">
                                      <div className="slider flex">
                                        {sliderA.map((c, i) => (
                                          <img
                                            key={i}
                                            src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${c}.jpg`}
                                            style={{ width: 50 }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* B SLIDER */}
                                  <div className="row row5 mt-3">
                                    <div className="col-3">
                                      <img
                                        src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${playerB}.jpg`}
                                      />
                                    </div>
                                    <div className="col-9 ab-result-slider">
                                      <div className="slider flex">
                                        {sliderB.map((c, i) => (
                                          <img
                                            key={i}
                                            src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${c}.jpg`}
                                            style={{ width: 50 }}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>

                              {/* DESCRIPTION BOX */}
                              <div className="row mt-4 justify-content-center">
                                <div className="col-md-6">
                                  <div className="casino-result-desc">
                                    <div className="casino-result-desc-item">
                                      <div>Winner</div>
                                      <div>{descArr[0]}</div>
                                    </div>
                                    <div className="casino-result-desc-item">
                                      <div>Suit</div>
                                      <div>{descArr[1]}</div>
                                    </div>
                                    <div className="casino-result-desc-item">
                                      <div>Odd/Even</div>
                                      <div>{descArr[2]}</div>
                                    </div>
                                    <div className="casino-result-desc-item">
                                      <div>Joker</div>
                                      <div>{descArr[3]}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* BET HISTORY */}
                              {!filteredBetHistory.length <= 0 && (
                                <div className="mt-4">
                                  <IndividualBetHistoryTable data={filteredBetHistory} />
                                </div>
                              )}

                            </div>
                          );
                        })()
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
        <div className="fixed inset-0 flex items-start justify-center z-50 md:hidden">
          <div className="absolute top-0 inset-0 bg-gray-900 opacity-50"></div>
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

export default ABJ;



