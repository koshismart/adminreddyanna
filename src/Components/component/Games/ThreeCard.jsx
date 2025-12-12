import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import Header from "../common/Header";
import Frame from "../common/Frame";
import cardsData, { cardVariant } from "../../assets/cards/data";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import cricketBall from "../../assets/Cricket_ball.svg";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import { decodedTokenData, signout } from "../../helpers/auth";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";

const ThreeCard = (
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData
) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const navigate=useNavigate();

  // Decode token safely
  const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

  const location = useLocation();
  const item = location.state?.item;

  const queryClient = useQueryClient();

  const [Countdown, setCountdown] = useState(0);
  const [cardData, setCardData] = useState(null);
  const [roundId, setRoundId] = useState(false);
  const [bet, setBet] = useState(false);
  const isFixed = useScrollFixed();
  const [resultId, setResultId] = useState(false);
  const [individualResultData, setIndividualResultData] = useState(null);

  const {
    placeBet,
    setPlaceBet,
    betData,
    setBetData,
    latestBetData,
    setLatestBetData,
  } = useContext(PlaceBetUseContext);
  const latestBetDataRef = useRef(betData); // Track the latest bet data with a ref

  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setRoundId(casinoData?.data?.data?.data?.t1?.[0]?.mid);
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

  //individual bet history
  const filteredBetHistory = useFilterIndividualBetHistory(
    CasinoBetHistory,
    individualResultData
  );

  const getResultText = (result) => {
    switch (result) {
      case "0":
        return "R";
    }
  };

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
    <div>
      <div className="block md:hidden w-full">
        <Header
          gameName={item?.gameName}
          min={cardData?.min}
          max={cardData?.max}
          mid={cardData?.mid}
        />
      </div>
      {!bet && (
        <div className="flex relative w-full h-full">
          <div className="center-container">
            <div className="p-2 hidden md:block bg-secondaryBackground text-white">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t1?.[0]?.min}
                max={casinoData?.data?.data?.data?.t1?.[0]?.max}
                mid={casinoData?.data?.data?.data?.t1?.[0]?.mid}
              />
            </div>
            <div className="w-full relative">
              <Frame item={item} />
              <div className="flex absolute top-1 left-1 gap-2">
                <img
                  src={cardsData.find((c) => c.code == cardData?.C1)?.image}
                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                  alt={cardsData.find((c) => c.code == cardData?.C1)?.name}
                />
                <img
                  src={cardsData.find((c) => c.code == cardData?.C2)?.image}
                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                  alt={cardsData.find((c) => c.code == cardData?.C2)?.name}
                />
                <img
                  src={cardsData.find((c) => c.code == cardData?.C3)?.image}
                  className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                  alt={cardsData.find((c) => c.code == cardData?.C3)?.name}
                />
              </div>
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* odd */}
            <div className="md:py-1 py-0">
              {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                casinoData?.data?.data?.data?.t2?.map((item) => (
                  <>
                    <div className="">
                      {item?.nat == "YES" ? (
                        <div className="bg-blue-300  grid grid-cols-1 md:grid-cols-12">
                          <div className="md:col-span-2 col-span-1 border border-black flex justify-center items-center text-sm font-semibold uppercase h-full">
                            Yes
                          </div>
                          <div className="col-span-10 relative border-black border">
                            <div className="flex flex-col items-center">
                              {item?.rate}
                              <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5, 6, 7].map((v, idx) => (
                                  <>
                                    {idx < 7 && (
                                      <div
                                        key={idx}
                                        className={`my-2 col-span-1 cursor-pointer`}
                                        onClick={(e) => {
                                          if (item.gstatus !== "0") {
                                            // Declare the newBetData object inside the condition
                                            const newBetData = {
                                              betName: v + item?.nat,
                                              boxColor: "bg-[#B2D6F0]",
                                              matchOdd: item?.rate,
                                              stake: 0,
                                              mid: item?.mid,
                                              sid: item?.sid,
                                              oddType: "casino_odds",
                                              oddCategory: "Yes",
                                            };

                                            // Set the bet data and latest bet data
                                            setPlaceBet(true);
                                            setBetData(newBetData);
                                            setLatestBetData(newBetData);
                                          }
                                        }}
                                      >
                                        {/* {console.log(v)} */}
                                        <div className="flex flex-col items-center">
                                          <img
                                            className="max-w-[40px] rounded-sm"
                                            src={
                                              cardVariant.find(
                                                (card) => card.code == v
                                              )?.image
                                            }
                                            alt={v}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                              <div className="flex gap-2 justify-center">
                                {[8, 9, 10, "J", "Q", "K"].map((v, idx) => (
                                  <>
                                    {idx < 7 && (
                                      <div
                                        key={idx}
                                        className={`my-2 col-span-1 cursor-pointer`}
                                        onClick={(e) => {
                                          if (item.gstatus !== "0") {
                                            // Declare the newBetData object inside the condition
                                            const newBetData = {
                                              betName: v + item?.nat,
                                              boxColor: "bg-[#B2D6F0]",
                                              matchOdd: item?.rate,
                                              stake: 0,
                                              mid: item?.mid,
                                              sid: item?.sid,
                                              oddType: "casino_odds",
                                              oddCategory: "Yes",
                                            };

                                            // Set the bet data and latest bet data
                                            setPlaceBet(true);
                                            setBetData(newBetData);
                                            setLatestBetData(newBetData);
                                          }
                                        }}
                                      >
                                        {/* {console.log(v)} */}
                                        <div className="flex flex-col items-center">
                                          <img
                                            className="max-w-[40px] rounded-sm"
                                            src={
                                              cardVariant.find(
                                                (card) => card.code == v
                                              )?.image
                                            }
                                            alt={v}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                            </div>
                            {item.gstatus == 0 && (
                              <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                <span className="text-white opacity-100">
                                  <i class="ri-lock-2-fill text-xl"></i>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-300  grid grid-cols-1 md:grid-cols-12">
                          <div className="md:col-span-2 col-span-1 border border-black flex justify-center items-center text-sm font-semibold uppercase h-full">
                            No
                          </div>
                          <div className=" col-span-10 relative border-black border">
                            <div className="flex flex-col items-center">
                              {item?.rate}
                              <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5, 6, 7].map((v, idx) => (
                                  <>
                                    {idx < 7 && (
                                      <div
                                        key={idx}
                                        className={`my-2 col-span-1 cursor-pointer`}
                                        onClick={(e) => {
                                          if (item.gstatus !== "0") {
                                            // Declare the newBetData object inside the condition
                                            const newBetData = {
                                              betName: v + item?.nat,
                                              boxColor: "bg-[#FAA9BA]",
                                              matchOdd: item?.rate,
                                              stake: 0,
                                              mid: item?.mid,
                                              sid: item?.sid,
                                              oddType: "casino_odds",
                                              oddCategory: "Yes",
                                            };

                                            // Set the bet data and latest bet data
                                            setPlaceBet(true);
                                            setBetData(newBetData);
                                            setLatestBetData(newBetData);
                                          }
                                        }}
                                      >
                                        <div className="flex flex-col items-center">
                                          <img
                                            className="max-w-[40px] rounded-sm"
                                            src={
                                              cardVariant.find(
                                                (card) => card.code == v
                                              )?.image
                                            }
                                            alt={v}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                              <div className="flex gap-2 justify-center">
                                {[8, 9, 10, "J", "Q", "K"].map((v, idx) => (
                                  <>
                                    {idx < 7 && (
                                      <div
                                        key={idx}
                                        className={`my-2 col-span-1 cursor-pointer`}
                                        onClick={(e) => {
                                          if (item.gstatus !== "0") {
                                            // Declare the newBetData object inside the condition
                                            const newBetData = {
                                              betName: v + item?.nat,
                                              boxColor: "bg-[#FAA9BA]",
                                              matchOdd: item?.rate,
                                              stake: 0,
                                              mid: item?.mid,
                                              sid: item?.sid,
                                              oddType: "casino_odds",
                                              oddCategory: "Yes",
                                            };

                                            // Set the bet data and latest bet data
                                            setPlaceBet(true);
                                            setBetData(newBetData);
                                            setLatestBetData(newBetData);
                                          }
                                        }}
                                      >
                                        {/* {console.log(v)} */}
                                        <div className="flex flex-col items-center">
                                          <img
                                            className="max-w-[40px] rounded-sm"
                                            src={
                                              cardVariant.find(
                                                (card) => card.code == v
                                              )?.image
                                            }
                                            alt={v}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ))}
                              </div>
                            </div>
                            {item.gstatus == 0 && (
                              <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                <span className="text-white opacity-100">
                                  <i class="ri-lock-2-fill text-xl"></i>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ))}
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
                    <>
                      <div>
                        <h4 className=" flex me-3 justify-end items-center text-sm font-semibold">
                          Round Id:{individualResultData?.mid}
                        </h4>
                      </div>
                      <div className="my-3 max-w-[80%]  mx-auto">
                        <div className="flex gap-2 justify-center items-center my-4">
                          {individualResultData?.cards
                            ?.split(",")
                            .map((item) => (
                              <img
                                src={
                                  cardsData.find((c) => c.code == item)?.image
                                }
                                className="h-[34px] md:h-[44px] rounded-sm img-fluid"
                                alt={
                                  cardsData.find((c) => c.code == item)?.name
                                }
                              />
                            ))}
                        </div>
                      </div>
                      {/* table */}
                      <div>
                        {!filteredBetHistory?.length <= 0 && (
                          <IndividualBetHistoryTable
                            data={filteredBetHistory}
                          />
                        )}
                      </div>
                    </>
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
              {casinoData?.data?.data?.result ? (
                casinoData?.data?.data?.result?.map((item, index) => (
                  <div
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsModalOpen(true);
                      casinoIndividualResult(cookies, item?.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
                    }}
                    className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
                      item.result == 1 ? "text-red-500" : "text-yellow-400"
                    }  flex justify-center items-center w-6 rounded-full`}
                  >
                    {getResultText(item.result)}
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
      <div className={`${placeBet ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex  items-start justify-center z-50 md:hidden">
          <div className="absolute top-0 inset-0  bg-gray-900 opacity-50"></div>

          <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
            <CasinoMobileBetPopup
              time={remainingTime}
              gameType="casino"
              gameName={item?.slug}
              refetchCurrentBets={refetchCurrentBets}
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
    </div>
  );
};

export default ThreeCard;
