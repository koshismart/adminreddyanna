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

const SuperOver = ({
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
            <MatchBookMark
                mid={cardData?.mid}
                matchOdds={
                  Array.isArray(casinoData?.data?.data?.data?.t2) &&
                  casinoData?.data?.data?.data?.t2
                }
                fancyT3={
                  Array.isArray(casinoData?.data?.data?.data?.t3)
                    ? casinoData?.data?.data?.data?.t3
                    : []
                }
                fancyT4={
                  Array.isArray(casinoData?.data?.data?.data?.t4)
                    ? casinoData?.data?.data?.data?.t4
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
<div className="five-cricket-result">
  <div className="mt-2">
    <div className="text-end score-head">
      Winner:<span className="text-fancy"> ENG</span> | ENG : 16 | RSA : 9
    </div>
  </div>
  <div className="mt-2">
    <h4>First Inning</h4>
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>ENG</th>
            <th className="text-center">1</th>
            <th className="text-center">2</th>
            <th className="text-center">3</th>
            <th className="text-center">4</th>
            <th className="text-center">5</th>
            <th className="text-center">6</th>
            <th className="text-center">Run/Over</th>
            <th className="text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Over 1</td>
            <td className="text-center">
              <span className="">4</span>
            </td>
            <td className="text-center">
              <span className="">2</span>
            </td>
            <td className="text-center">
              <span className="">1</span>
            </td>
            <td className="text-center">
              <span className="">3</span>
            </td>
            <td className="text-center">
              <span className="">4</span>
            </td>
            <td className="text-center">
              <span className="">2</span>
            </td>
            <td className="text-center">16</td>
            <td className="text-center">16/0</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div className="mt-2">
    <h4>Second Inning</h4>
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>RSA</th>
            <th className="text-center">1</th>
            <th className="text-center">2</th>
            <th className="text-center">3</th>
            <th className="text-center">4</th>
            <th className="text-center">5</th>
            <th className="text-center">6</th>
            <th className="text-center">Run/Over</th>
            <th className="text-center">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Over 1</td>
            <td className="text-center">
              <span className="">3</span>
            </td>
            <td className="text-center">
              <span className="">1</span>
            </td>
            <td className="text-center">
              <span className="">0</span>
            </td>
            <td className="text-center">
              <span className="">2</span>
            </td>
            <td className="text-center">
              <span className="">2</span>
            </td>
            <td className="text-center">
              <span className="">1</span>
            </td>
            <td className="text-center">9</td>
            <td className="text-center">9/0</td>
          </tr>
        </tbody>
      </table>
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
           


            <div className="flex justify-end md:mt-1 m-1 gap-1">
              {/* {console.log(casinoData, "top10")} */}
              {casinoData?.data?.data?.result ? (
                (
                  casinoData?.data?.data?.result ||
                  toptenResult?.data?.data?.result
                )?.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                      casinoIndividualResult(cookies, item.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
                    }}
                    className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
                      item.result == 1 ? "text-red-500" : "text-yellow-400"
                    }  flex justify-center items-center w-6 rounded-full`}
                  >
                    {getResultText(item?.win || item?.result)}
                  </div>
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

export default SuperOver;
