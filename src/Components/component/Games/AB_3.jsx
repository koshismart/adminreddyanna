import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import initialCard from "../../assets/cards/0.jpg";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import Header from "../common/Header";
import HeaderTab from "../common/HeaderTab";
import CardsUi, { Slider } from "../common/CardsUi";
import cardsData, { cardVariant } from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import SliderForModal from "../common/SliderForModal";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

export const extractFirstDigit = (str) => {
  return [
    ...new Set(
      str
        .split(",")
        .map((item) => {
          const match = item.match(/^\d+/);
          return match ? match[0] : item[0];
        })
        .filter(Boolean)
    ),
  ];
};

const AB_3 = ({
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

  const [cardData, setCardData] = useState([]);
  const [roundId, setRoundId] = useState(false);
  const [individualResultData, setIndividualResultData] = useState(null);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [bet, setBet] = useState(false);

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
  const [t2Data, setT2data] = useState([]);
  const [andarCards, setAndarCards] = useState([]);
  const [andarCardStatus, setAndarCardStatus] = useState([]);
  const [baharCards, setBaharCards] = useState([]);
  const [baharCardStatus, setBaharCardStatus] = useState([]);
  const [anderOpenCard, setAnderOpenCard] = useState([]);
  const [baharOpenCard, setBaharOpenCard] = useState([]);

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
        parseInt(casinoData?.data?.data?.data?.t1?.[0].autotime || 0)
      );
      setCardData(casinoData?.data?.data?.data?.t3?.[0]);
      setRoundId(casinoData?.data?.data?.data?.t1?.[0]?.mid);
      setT2data(casinoData?.data?.data?.data?.t2);
    }
    if (
      casinoData &&
      casinoData?.data?.data?.data?.t3?.[0] &&
      (casinoData?.data?.data?.data?.t3?.[0]?.aall ||
        casinoData?.data?.data?.data?.t3?.[0]?.ar)
    ) {
      const ander = extractFirstDigit(
        casinoData?.data?.data?.data?.t3?.[0].aall
      );
      const bahar = extractFirstDigit(
        casinoData?.data?.data?.data?.t3?.[0]?.ball
      );
      setAnderOpenCard(ander);
      setBaharOpenCard(bahar);
      setAndarCardStatus(casinoData?.data?.data?.data?.t3?.[0]?.ar?.split(","));
      setBaharCards(casinoData?.data?.data?.data?.t3?.[0]?.ball?.split(","));
      setBaharCardStatus(casinoData?.data?.data?.data?.t3?.[0]?.br?.split(","));
    }
  }, [casinoData]);

  // console.log(andarCards);
  // console.log(andarCardStatus);
  // console.log(casinoData?.data?.data?.data);

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
      case "0":
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
        mid={roundId}
        myCurrentCasinoBets={myCurrentCasinoBets}
      />
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

              {/* card */}

              <div className="absolute top-1 left-1">
                <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                  Ander
                </h4>

                <Slider data={cardData?.aall} />

                <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                  Bahar
                </h4>
                <Slider data={cardData?.ball} />
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>
            {/* {casinoData && casinoData?.data?.data?.data?.t2 && ( */}
            <div className="ab ab3  casino-detail">
            <div className="casino-table">
                <div className="casino-table-box">
                <div className="andar-box suspended-box">
                    <div className="ab-title">ANDAR</div>
                    <div className="ab-cards">
                    <div className="card-odd-box">
                        <div className="casino-odds">4</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/1.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/2.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/3.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/4.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">4</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/5.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/6.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/7.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">3</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/8.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/9.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/10.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/11.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/12.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">3</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/13.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    </div>
                </div>
                <div className="bahar-box suspended-box">
                    <div className="ab-title">BAHAR</div>
                    <div className="ab-cards">
                    <div className="card-odd-box">
                        <div className="casino-odds">4</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/1.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/2.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/3.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/4.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">4</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/5.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/6.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/7.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">3</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/8.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/9.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/10.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">1</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/11.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">2</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/12.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
                    <div className="card-odd-box">
                        <div className="casino-odds">3</div>
                        <div>
                        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/andar-bahar-cards/13.jpg" />
                        </div>
                        <div className="casino-nation-book" />
                    </div>
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
                        <div className="grid grid-cols-1 place-items-center my-4">
                          <div className="col-span-1 w-full place-items-start relative">
                            <h4 className=" flex justify-center mb-2 items-center text-sm font-semibold">
                              Ander
                            </h4>
                            <SliderForModal
                              data={individualResultData?.cards?.split("*")[0]}
                            />
                            <h4 className=" flex justify-center mb-2 items-center text-sm font-semibold">
                              Bahar
                            </h4>
                            <SliderForModal
                              data={individualResultData?.cards?.split("*")[1]}
                            />
                          </div>
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
                    </>
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
                      casinoIndividualResult(cookies, item.mid).then((res) => {
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

export default AB_3;
