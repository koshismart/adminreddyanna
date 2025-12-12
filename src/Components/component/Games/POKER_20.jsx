import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../common/Header";
import useCountdown from "../../hook/useCountdown";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import { useQuery, useQueryClient } from "react-query";
import HeaderTab from "../common/HeaderTab";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import cardsData from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import PlaceBet from "../common/PlaceBet";
import ComplexOdds from "../common/ComplexOdds";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import { calculateCasinoRate } from "../../utils/casinoRate";
import Card from "../common/Card";

const POKER_20 = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  console.log("my poker data", casinoData);

  // Decode token safely
  const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

  const location = useLocation();
  const item = location.state?.item;
  const queryClient = useQueryClient();

  const [Countdown, setCountdown] = useState(0);

  const [cardData, setCardData] = useState([]);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);

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

  const getResultText = (result) => {
    // console.log(result);
    switch (result) {
      case "11":
        return "A";
      case "21":
        return "B";
      case "0":
        return "tie";
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
              <Card cardData={cardData} slug={item.slug}  />
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>
            {/* odds */} {/* odds */}
           <div className=" poker20 casino-detail">
            <div className="casino-table">
            <div className="poker20-other-odds">
            <div className="casino-table-box">
              <div className="casino-table-left-box">
                <div className="w-100 d-xl-none mobile-nation-name">Player A</div>
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "11")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "12")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "13")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "14")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "15")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "16")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "17")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "18")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "19")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
              </div>
              <div className="casino-table-box-divider" />
              <div className="casino-table-right-box">
                <div className="w-100 d-xl-none mobile-nation-name">Player B</div>
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "21")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "22")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "23")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "24")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "25")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "26")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "27")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "28")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
                 {Array.isArray(casinoData?.data?.data?.data?.t2) && casinoData?.data?.data?.data?.t2
                .filter((v)=> v.sid === "29")
                .map((item , index)=> (
                 <div className="casino-odds-box-container" key={index}>
                  <div className="casino-nation-name text-center">{item.nat}</div>
                  <div className={`casino-odds-box back ${
                  remainingTime <= 3 || item.gstatus == "SUSPENDED"? "suspended-box": ""
                  }`}
                  >
                    {remainingTime <= 3 || item.gstatus == "SUSPENDED"?(
                    <span className="casino-odds">0</span>
                    ):(
                      <span
                      className="casino-odds cursor-pointer hover:text-blue-700"
                      onClick={() => {
                      setPlaceBet(true);
                      const newBetData = {
                      betName: "Back on " + item?.nat,
                      boxColor: "bg-[#B2D6F0]",
                      matchOdd: calculateCasinoRate(item?.b1),
                      stake: 0,
                      mid: item?.mid,
                      sid: item?.sid,
                      oddType: "casino_odds",
                      oddCategory: "Back",
                      };
                      setBetData(newBetData);
                      setLatestBetData(newBetData);
                      }}
                    >
                      {calculateCasinoRate(item.b1)}
                    </span>
                    )}
                    
                  </div>
                </div>
                ))}
              </div>
            </div>
            </div>
            </div>
            </div>

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
                         <div className="row mt-2">
                          <div className="col-md-6 text-center">
                            <h4 className="result-title">Player A</h4>
                            <div className="casino-result-cards">

                              {/* TROPHY IF WINNER = 1 */}
                              {individualResultData?.win == "1" && (
                                <div className="casino-winner-icon">
                                  <i className="fas fa-trophy" />
                                </div>
                              )}

                              {playerA.map((card, i) => (
                                <img
                                  key={i}
                                  src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="col-md-6 text-center">
                            <h4 className="result-title">Player B</h4>
                            <div className="casino-result-cards">

                              {/* TROPHY IF WINNER = 2 */}
                              {individualResultData?.win == "2" && (
                                <div className="casino-winner-icon">
                                  <i className="fas fa-trophy" />
                                </div>
                              )}

                              {playerB.map((card, i) => (
                                <img
                                  key={i}
                                  src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="col-md-12 text-center mt-3">
                            <h4 className="result-title">Board</h4>
                            <div className="casino-result-cards">
                              {board.map((card, i) => (
                                <img
                                  key={i}
                                  src={`https://g1ver.sprintstaticdata.com/v80/static/front/img/cards/${card}.jpg`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                          {/* DESCRIPTION BOX (Winner, Under/Over etc) */}
                       <div className="row mt-2 justify-content-center">
                      <div className="col-md-6">
                        <div className="casino-result-desc">

                          {/* WINNER */}
                          <div className="casino-result-desc-item">
                            <div>Winner</div>
                            <div>{winner}</div>
                          </div>

                          {/* 2 CARD */}
                          <div className="casino-result-desc-item">
                            <div>2 Card</div>
                            <div>{twoCard}</div>
                          </div>

                          {/* 7 CARD */}
                          <div className="casino-result-desc-item">
                            <div>7 Card</div>
                            <div>{sevenCard}</div>
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

export default POKER_20;
