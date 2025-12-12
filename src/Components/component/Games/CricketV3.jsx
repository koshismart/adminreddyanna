import React, { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import {
  casinoCricketGameScore,
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import cricketBall from "../../assets/Cricket_ball.svg";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import cardsData from "../../assets/cards/data";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import PlayerOdds from "../common/PlayerOdds";
import Frame from "../common/Frame";
import MatchBookMark from "../MatchBookMark";
import CasinoMatchDetailHeader from "../CasinoMatchDetailHeader";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const CricketV3 = ({
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
  const [fancyData, setFancyData] = useState([]);

  // const {
  //   isLoading: isLoadingOdds,
  //   data: casinoData,
  //   isSuccess: isSuccessOdds,
  //   refetch: refetchOdds,
  // } = useQuery(
  //   ["casinoGameOdds", { cookies, slug: item?.slug }],
  //   () => casinoGameOdds(cookies, item?.slug),
  //   {
  //     refetchInterval: 1000,
  //     refetchIntervalInBackground: true,
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
      if (casinoData?.data?.data?.data?.t3 !== null) {
        setFancyData(casinoData?.data?.data?.data?.t3?.[0]);
      }
      // console.log(casinoData?.data?.data?.data?.t3[0])
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
    switch (result) {
      case "1":
        return "A";
      case "2":
        return "I";
      case "0":
        return "AB";
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
                Array?.isArray(casinoData?.data?.data?.data?.t1) &&
                casinoData?.data?.data?.data?.t1?.[0]?.mid
              }
              gameSlug={item?.slug}
            />
            {/* {console.log(item?.slug,"slug")} */}
            <div className="w-full relative">
              <Frame item={item} />

              {/* card */}

              <div className="absolute flex flex-col md:gap-1 gap-[1px] top-1 left-1">
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
                {cardsData && cardsData.find((i) => i.code == cardData?.C4) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C4).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C4).name}
                  />
                )}
                {cardsData && cardsData.find((i) => i.code == cardData?.C5) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C5).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C5).name}
                  />
                )}
                {cardsData && cardsData.find((i) => i.code == cardData?.C6) && (
                  <img
                    src={cardsData.find((i) => i.code == cardData?.C6).image}
                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                    alt={cardsData.find((i) => i.code == cardData?.C6).name}
                  />
                )}
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* <PlayerOdds
              game={item?.gameName}
              remainingTime={remainingTime}
              setIsBetModalOpen={setPlaceBet}
              isBetModalOpen={placeBet}
              data={casinoData?.data?.data}
            /> */}

            <MatchBookMark
              myCurrentCasinoBets={myCurrentCasinoBets}
              mid={cardData?.mid}
              matchOdds={
                Array?.isArray(casinoData?.data?.data?.data?.t2) &&
                casinoData?.data?.data?.data?.t2
              }
              fancy={fancyData || false}
              type={"cricketV3"}
            />

            {/* fancy */}

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
                <div
                  className="absolute inset-0 bg-gray-900 opacity-50"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                    setIndividualResultData(undefined);
                  }}
                ></div>

                <div className="bg-white md:relative  absolute top-0 w-full z-50  max-w-3xl mx-auto">
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
                          {/* {console.log(individualResultData)} */}

                          <p className="flex justify-center items-center">
                            {individualResultData?.desc}{" "}
                            <span>
                              {" "}
                              | Winner :{" "}
                              {individualResultData?.win == "1" ? "AUS" : "IND"}
                            </span>
                          </p>
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
            <div
              className={`flex justify-end
                  gap-1 mb-2`}
            >
              {/* {console.log(toptenResult?.data?.data?.data)} */}
              {casinoData?.data?.data?.result ? (
                (
                  casinoData?.data?.data?.result || casinoData?.data?.data?.res
                )?.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                      casinoIndividualResult(cookies, item.mid).then((res) => {
                        // console.log(res)
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
                    }}
                    className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
                      item.result == 1 ? "text-red-500" : "text-yellow-400"
                    }  flex justify-center items-center w-6 rounded-full`}
                  >
                    {getResultText(item.win || item.result)}
                  </div>
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

export default CricketV3;
