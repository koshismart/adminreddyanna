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
import Frame from "../common/Frame";
import useCountdown from "../../hook/useCountdown";
import cricketBall from "../../assets/Cricket_ball.svg";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import cardsData, { allKings, cardShape } from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import MatchDetailHeader from "../MatchDetailHeader";
import MatchBookMark from "../MatchBookMark";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMatchDetailHeader from "../CasinoMatchDetailHeader";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import ball from "../../assets/balls";
import { decodedTokenData, signout } from "../../helpers/auth";
import MatchBookMark1 from "../MatchBookMark1";

const SuperOver_3 = ({
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

  //call game odd api on the basis of remaining time
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
        return "E";
      case "2":
        return "R";
      case "0":
        return "T";
    }
  };

  // result modal
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            <CasinoMatchDetailHeader
              gameName="casino-cricket"
              marketId={
                Array.isArray(casinoData?.data?.data?.data?.t1) &&
                casinoData?.data?.data?.data?.t1?.[0]?.mid
              }
              gameSlug={item?.slug}
            />
            <div className="w-full relative">
              <Frame item={item} />

              {/* card */}

              <div className="absolute top-1 text-white flex flex-col md:gap-2 md:left-2 gap-1 left-1">
                {/* {console.log(cardData,"card-data")} */}

                <img
                  className="md:w-10 w-6 object-cover"
                  src={ball.find((v) => cardData?.C1?.includes(v.card))?.ball}
                />
                <img
                  className="md:w-10 w-6 object-cover"
                  src={ball.find((v) => cardData?.C2?.includes(v.card))?.ball}
                />
                <img
                  className="md:w-10 w-6 object-cover"
                  src={ball.find((v) => cardData?.C3?.includes(v.card))?.ball}
                />
                <img
                  className="md:w-10 w-6 object-cover"
                  src={ball.find((v) => cardData?.C4?.includes(v.card))?.ball}
                />
                <img
                  className="md:w-10 w-6 object-cover"
                  src={ball.find((v) => cardData?.C5?.includes(v.card))?.ball}
                />
                <img
                  className="md:w-10 w-6 object-cover"
                  src={ball.find((v) => cardData?.C6?.includes(v.card))?.ball}
                />

                {/* <img
                  className="w-9/12"
                  src={
                    ball.find(
                      (v) =>
                        v?.name?.replace("Run", "") ==
                        (cardData?.C2 !== "1" && cardData?.C2?.slice(0, 1))
                    )?.ball
                  }
                />
                <img
                  className="w-9/12"
                  src={
                    ball.find(
                      (v) =>
                        v?.name?.replace("Run", "") ==
                        (cardData?.C3 !== "1" && cardData?.C3?.slice(0, 1))
                    )?.ball
                  }
                />
                <img
                  className="w-9/12"
                  src={
                    ball.find(
                      (v) =>
                        v?.name?.replace("Run", "") ==
                        (cardData?.C4 !== "1" && cardData?.C4?.slice(0, 1))
                    )?.ball
                  }
                />
                <img
                  className="w-9/12"
                  src={
                    ball.find(
                      (v) =>
                        v?.name?.replace("Run", "") ==
                        (cardData?.C5 !== "1" && cardData?.C5?.slice(0, 1))
                    )?.ball
                  }
                />
                <img
                  className="w-9/12"
                  src={
                    ball.find(
                      (v) =>
                        v?.name?.replace("Run", "") ==
                        (cardData?.C6 !== "1" && cardData?.C6?.slice(0, 1))
                    )?.ball
                  }
                /> */}
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* <ComplexOdds
              game={item?.gameName}
              setIsBetModalOpen={setPlaceBet}
              isBetModalOpen={placeBet}
              time={remainingTime}
              cardsData={cardsData}
              data={casinoData?.data?.data}
            /> */}
              <MatchBookMark1   
            mid={cardData?.mid}
            matchOdds={
            Array.isArray(casinoData?.data?.data?.data?.t2)
            ? casinoData?.data?.data?.data?.t2
            : []
            }
            myCurrentCasinoBets={myCurrentCasinoBets}
            />
            
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

                      <p className="flex justify-center items-center">
                        {individualResultData?.desc}{" "}
                        <span>
                          {" "}
                          | Winner :{" "}
                          {individualResultData?.win == "1"
                            ? "ENG"
                            : individualResultData?.win == "2"
                            ? "RSA"
                            : "TIE"}
                        </span>
                      </p>
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
                      <img
                        src={cricketBall}
                        className="w-16 h-16 animate-spin"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
           <div className="flex justify-end md:mt-1 m-1 gap-1">
            {(() => {
                const results = Array.isArray(casinoData?.data?.data?.data?.result)
                ? casinoData.data.data.data.result
                : [];

                if (results.length === 0) {
                return <>No Results Found</>;
                }

                return results.map((item, index) => (
                <div
                    key={index}
                    onClick={(e) => {
                    e.preventDefault();
                    setIsModalOpen(true);
                    casinoIndividualResult(cookies, item.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                    });
                    }}
                    className={`h-6 cursor-pointer font-semibold hover:bg-green-950 bg-green-800 ${
                    item.result == 1 ? "text-red-500" : "text-yellow-400"
                    } flex justify-center items-center w-6 rounded-full`}
                >
                    {getResultText(item?.win || item?.result)}
                </div>
                ));
            })()}
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

export default SuperOver_3;
