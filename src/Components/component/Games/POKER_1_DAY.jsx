// import React, { useContext, useEffect, useRef, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import cardsData from "../../assets/cards/data";
// import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
// import useCountdown from "../../hook/useCountdown";
// import PlaceBet from "../common/PlaceBet";
// import PlayerOdds from "../common/PlayerOdds";
// import Timer from "../common/Timer";
// import CardsUi from "../common/CardsUi";
// import cricketBall from "../../assets/Cricket_ball.svg";
// import {
//   // casinoGameOdds,
//   // casinoGameTopTenResult,
//   casinoIndividualResult,
// } from "../../helpers/casino";
// import { useCookies } from "react-cookie";
// import { useQuery, useQueryClient } from "react-query";
// import Header from "../common/Header";
// import HeaderTab from "../common/HeaderTab";
// import { PlaceBetUseContext } from "../../Context/placeBetContext";
// import Frame from "../common/Frame";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
// import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
// import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
// import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
// import useScrollFixed from "../../hook/useFixed";
// import { getMyCasinoBetHistory } from "../../helpers/betHistory";
// import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
// import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
// import { decodedTokenData, signout } from "../../helpers/auth";

// const POKER_1_DAY = ({
//   myCurrentCasinoBets,
//   refetchCurrentBets,
//   refetchCasinoBetHistory,
//   CasinoBetHistory,
//   casinoSpecialPermission,
//   casinoData,
// }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);
//   console.log("MY CASINO POKER DAY", casinoData);

//   // Decode token safely
//   const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

//   const location = useLocation();
//   const item = location.state?.item;

//   const queryClient = useQueryClient();

//   const [Countdown, setCountdown] = useState(0);

//   const [cardData, setCardData] = useState([]);
//   const [individualResultData, setIndividualResultData] = useState(null);
//   const [isBetModalOpen, setIsBetModalOpen] = useState(false);
//   const [bet, setBet] = useState(false);

//   const {
//     placeBet,
//     setPlaceBet,
//     betData,
//     setBetData,
//     latestBetData,
//     setLatestBetData,
//   } = useContext(PlaceBetUseContext);
//   const latestBetDataRef = useRef(betData); // Track the latest bet data with a ref

//   const isFixed = useScrollFixed();
//   // const {
//   //   isLoading: isLoadingOdds,
//   //   data: casinoData,
//   //   isSuccess: isSuccessOdds,
//   //   refetch: refetchOdds,
//   // } = useQuery(
//   //   ["casinoGameOdds", { cookies, slug: item?.slug }],
//   //   () => casinoGameOdds(cookies, item?.slug),
//   //   {
//   //     keepPreviousData: true, // Add this option
//   //   }
//   // );

//   // const {
//   //   isLoading: isLoadingTopTenResult,
//   //   data: toptenResult,
//   //   isSuccess: isSuccessTopTenResult,
//   //   refetch: refetchTopTenResult,
//   // } = useQuery(
//   //   ["casinoGameTopTenResult", { cookies, slug: item?.slug }],
//   //   () => casinoGameTopTenResult(cookies, item?.slug),
//   //   {
//   //     keepPreviousData: true, // Add this option
//   //   }
//   // );

//   //individual bet history
//   const filteredBetHistory = useFilterIndividualBetHistory(
//     CasinoBetHistory,
//     individualResultData
//   );

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
//     // toptenResult?.error === "Token has expired" ||
//     // toptenResult?.error === "Invalid token" ||
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

//   // const remainingTime = useCountdown(Countdown, handleCountdownEnd);
//   // const endTime = new Date().getTime() + remainingTime * 1000;
//   const { remainingTime, endTime } = useCountdown(
//     Countdown,
//     handleCountdownEnd
//   );

//   const getResultText = (result) => {
//     // console.log(result);
//     switch (result) {
//       case "11":
//         return "A";
//       case "21":
//         return "B";
//       case "0":
//         return "T";
//     }
//   };
//   // result modal
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const calculateProfitLoss = (currentBets, item) => {
//     let totalProfitLoss = 0;

//     currentBets?.currentCasinoBets?.forEach((bet, index) => {
//       const { oddCategory, profit, loss, sid } = bet?.currentBet;

//       const adjustment =
//         oddCategory === "Back" ? Number(profit) : -Number(loss);

//       if (["1", "2"].includes(sid)) {
//         if (sid === item?.sid || sid === item?.sectionId) {
//           totalProfitLoss += adjustment;
//         } else {
//           totalProfitLoss -=
//             oddCategory === "Back" ? Number(loss) : -Number(profit);
//         }
//       }
//     });

//     return (
//       <span
//         className={`${
//           totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
//         } mr-6`}
//       >
//         {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
//       </span>
//     );
//   };

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

//   useEffect(() => {
//     if (latestBetData && casinoData?.data?.data?.data?.t2) {
//       const currentOdds = casinoData?.data?.data?.data?.t2.find(
//         (data) => data.sid || data.sectionId === latestBetData.sid
//       );

//       // Check if matchOdd has changed and prevent unnecessary updates
//       if (
//         currentOdds &&
//         currentOdds.matchOdd !== latestBetDataRef.current.matchOdd &&
//         betData.oddType === "casino_odds"
//       ) {
//         // Avoid updating if already suspended or matchOdd has not changed
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
//   }, [remainingTime]); // Add the necessary dependencies

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
//       {!bet && (
//         <div className="flex relative w-full h-full">
//           <div className="center-container">
//             <div className="p-2 hidden md:block bg-secondaryBackground text-white">
//               <Header
//                 gameName={item?.gameName}
//                 min={cardData?.min}
//                 max={cardData?.max}
//                 mid={cardData?.mid}
//               />
//             </div>
//             {/* frame */}

//             <div className="casino-video">
//               <Frame item={item} />
//               {/* cards */}

//               <div className="absolute top-0 left-1">
//                 <div className="flex gap-8 items-center">
//                   <div>
//                     <h1 className="text-white flex justify-start items-center text-xs md:text-sm my-0 font-semibold uppercase">
//                       Player A
//                     </h1>
//                     <div className="flex gap-1">
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C1) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C1)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C1).name
//                             }
//                           />
//                         )}
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C2) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C2)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C2).name
//                             }
//                           />
//                         )}
//                     </div>
//                   </div>
//                   <div>
//                     <h1 className="text-white flex justify-end items-center text-xs md:text-sm my-0 font-semibold uppercase">
//                       Player B
//                     </h1>
//                     <div className="flex gap-1">
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C3) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C3)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C3).name
//                             }
//                           />
//                         )}
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C4) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C4)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C4).name
//                             }
//                           />
//                         )}
//                     </div>
//                   </div>
//                 </div>
//                 {/* board */}
//                 <h1 className="text-white mt-1 flex justify-start items-center text-xs md:text-sm my-0 font-semibold uppercase">
//                   Board
//                 </h1>
//                 <div className="flex gap-1">
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C5) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C5).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C5).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C6) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C6).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C6).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C7) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C7).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C7).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C8) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C8).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C8).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C9) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C9).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C9).name}
//                       />
//                     )}
//                 </div>
//               </div>

//               {/* timer */}

//               <div className="absolute bottom-2 right-2">
//                 <Timer time={endTime} />
//               </div>
//             </div>

//             {/* <PlayerOdds
//               game={item.gameName}
//               remainingTime={remainingTime}
//               setIsBetModalOpen={setPlaceBet}
//               isBetModalOpen={placeBet}
//               data={casinoData?.data?.data}
//             /> */}
//             {/* table structure */}
//             <div class="grid grid-cols-12 md:gap-1">
//               <div class="md:col-span-5 col-span-12">
//                 <div class="grid grid-cols-12 md:gap-1">
//                   <div class="col-span-6 ">
//                     <div className="md:bg-gray-300 md:min-h-[44px] min-h-[24px] md:border-none border-b border-t  border-e border-gray-300 flex md:mb-1 items-center uppercase md:text-sm font-semibold text-xs py-1">
//                       {Array?.isArray(casinoData?.data?.data?.data?.t1) &&
//                         casinoData?.data?.data?.data?.t1?.[0]?.min &&
//                         casinoData?.data?.data?.data?.t1?.[0]?.max && (
//                           <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
//                             Min:{" "}
//                             <span className="me-2">
//                               {casinoData?.data?.data?.data?.t1?.[0]?.min}
//                             </span>{" "}
//                             Max:{" "}
//                             <span>
//                               {casinoData?.data?.data?.data?.t1?.[0]?.max}
//                             </span>
//                           </p>
//                         )}
//                     </div>

//                     {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                       casinoData?.data?.data?.data?.t2?.map((item, idx) => (
//                         <div
//                           className={`md:bg-gray-300 min-h-[44px] flex justify-between  md:border-none ${
//                             idx !== 1 && "border-b"
//                           } border-e border-gray-300 flex md:mb-1 justify-start ps-2 items-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                         >
//                           <span className="mr-2">{item?.nation}</span>
//                           {/* {calculateProfitLoss(myCurrentCasinoBets, item)} */}
//                           <div
//                             className={
//                               placeBet && betData.stake > 0
//                                 ? betData?.oddType === "casino_odds"
//                                   ? betData?.sid ===
//                                     (item.sid || item.sectionId)
//                                     ? betData?.oddCategory === "Back"
//                                       ? "text-green-800 mr-6"
//                                       : "text-red-600 mr-6"
//                                     : betData?.oddCategory === "Back"
//                                     ? "text-red-600 mr-6"
//                                     : "text-green-800 mr-6"
//                                   : "text-black mr-6"
//                                 : (() => {
//                                     const totalValue =
//                                       myCurrentCasinoBets?.currentCasinoBets
//                                         ?.filter(
//                                           (doc) =>
//                                             doc.currentBet.mid == cardData?.mid
//                                         )
//                                         ?.filter(
//                                           (doc) =>
//                                             doc.currentBet.oddType ==
//                                               "casino_odds" &&
//                                             doc.exposure.isPreviousExposure ==
//                                               false
//                                         )
//                                         ?.sort(
//                                           (a, b) =>
//                                             new Date(b.createdAt) -
//                                             new Date(a.createdAt)
//                                         )?.[0];
//                                     return Number(
//                                       totalValue?.currentBet?.otherInfo?.[
//                                         item.sid || item.sectionId
//                                       ]
//                                     ) > 0
//                                       ? "text-green-800 mr-6"
//                                       : "text-red-600 mr-6";
//                                   })()
//                             }
//                           >
//                             {placeBet && betData.stake > 0
//                               ? betData?.oddType === "casino_odds"
//                                 ? betData?.sid === (item.sid || item.sectionId)
//                                   ? betData?.oddCategory === "Back"
//                                     ? betData?.profit !== undefined
//                                       ? `+ ${betData?.profit}`
//                                       : null
//                                     : betData?.loss !== undefined
//                                     ? `- ${betData?.loss}`
//                                     : null
//                                   : betData?.oddCategory === "Back"
//                                   ? betData?.loss !== undefined
//                                     ? `- ${betData?.loss}`
//                                     : null
//                                   : betData?.profit !== undefined
//                                   ? `+ ${betData?.profit}`
//                                   : null
//                                 : null
//                               : (() => {
//                                   const totalValue =
//                                     myCurrentCasinoBets?.currentCasinoBets
//                                       ?.filter(
//                                         (doc) =>
//                                           doc.currentBet.mid == cardData?.mid
//                                       )
//                                       ?.filter(
//                                         (doc) =>
//                                           doc.currentBet.oddType ==
//                                             "casino_odds" &&
//                                           doc.exposure.isPreviousExposure ==
//                                             false
//                                       )
//                                       ?.sort(
//                                         (a, b) =>
//                                           new Date(b.createdAt) -
//                                           new Date(a.createdAt)
//                                       )?.[0];
//                                   return totalValue?.currentBet?.otherInfo?.[
//                                     item.sid || item.sectionId
//                                   ];
//                                 })()}
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                   <div class="col-span-6">
//                     <div class="grid grid-cols-12 md:gap-1">
//                       <div class="col-span-6">
//                         <div className="bg-blue-300 md:min-h-[44px] min-h-[24px] md:border-none border-b border-t  border-e border-gray-300 flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs py-1">
//                           Back
//                         </div>
//                         {casinoData?.data?.data?.data?.t2?.map((item) => (
//                           <div className="relative">
//                             {remainingTime <= 3 ||
//                             item.gstatus == "SUSPENDED" ? (
//                               <>
//                                 <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                   <span className="text-white opacity-100">
//                                     <i class="ri-lock-2-fill text-xl"></i>
//                                   </span>
//                                 </div>
//                                 <div className="bg-blue-300 min-h-[44px] flex-col flex md:mb-1 md:border-none border-b border-e border-gray-300 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1 z-1">
//                                   <h1>{item.b1}</h1>
//                                 </div>
//                               </>
//                             ) : (
//                               <div
//                                 onClick={(e) => {
//                                   if (item.b1 !== "0") {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: "Back on " + item?.nation,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b1,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "Back",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }
//                                 }}
//                                 className="bg-blue-300 hover:bg-blue-400 cursor-pointer min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
//                               >
//                                 <h1>{item.b1}</h1>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                       <div class="col-span-6">
//                         <div className="bg-red-300 md:min-h-[44px] min-h-[26px] md:border-none border-b border-e border-gray-300 flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs py-1">
//                           Lay
//                         </div>

//                         {casinoData?.data?.data?.data?.t2?.map((item) => (
//                           <div className="relative">
//                             {remainingTime <= 3 ||
//                             item.gstatus == "SUSPENDED" ? (
//                               <>
//                                 <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                   <span className="text-white opacity-100">
//                                     <i class="ri-lock-2-fill text-xl"></i>
//                                   </span>
//                                 </div>
//                                 <div className="bg-red-300 min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                                   <h1>{item.l1}</h1>
//                                 </div>
//                               </>
//                             ) : (
//                               <div
//                                 onClick={(e) => {
//                                   if (item.l1 !== "0.00") {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: "Lay on " + item?.nation,
//                                       boxColor: "bg-[#FAA9BA]",
//                                       matchOdd: item?.l1,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "Lay",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }
//                                 }}
//                                 className="bg-red-300 hover:bg-red-400 cursor-pointer min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1"
//                               >
//                                 <h1>{item.l1}</h1>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div class="md:col-span-7 col-span-12">
//                 <div className="bg-secondaryBackground md:hidden flex items-center ps-3 text-white min-h-[40px] md:mb-1">
//                   Bonus Bet
//                 </div>
//                 <div class="grid grid-cols-12 md:gap-1">
//                   <div class="col-span-6">
//                     <div className="md:bg-gray-300 md:min-h-[44px] min-h-[24px] md:border-none border-b border-t  border-e border-gray-300 flex md:mb-1 items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                       {casinoData?.data?.data?.data?.t1?.[0]?.min &&
//                         casinoData?.data?.data?.data?.t1?.[0]?.max && (
//                           <>
//                             <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
//                               Min:{" "}
//                               <span className="me-2">
//                                 {casinoData?.data?.data?.data?.t1?.[0]?.min}
//                               </span>{" "}
//                               Max:{" "}
//                               <span>
//                                 {casinoData?.data?.data?.data?.t1?.[0]?.max}
//                               </span>
//                             </p>
//                           </>
//                         )}
//                     </div>
//                     <div className="md:bg-gray-300 ps-2 min-h-[44px] md:border-none border-b border-e border-gray-300 flex md:mb-1 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                       Player A
//                     </div>
//                     <div className="md:bg-gray-300 ps-2 min-h-[44px] md:border-none border-e border-gray-300 flex md:mb-1 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                       Player B
//                     </div>
//                   </div>
//                   <div class="col-span-6">
//                     <div class="grid grid-cols-12 md:gap-1">
//                       <div class="col-span-6">
//                         <div className="bg-blue-300 md:min-h-[44px] min-h-[24px] md:border-none border-b border-t  border-e border-gray-300 flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                           Back
//                         </div>
//                         {casinoData?.data?.data?.data?.t3
//                           ?.filter((v) => v.nation.includes("2 card Bonus"))
//                           ?.map((item) => (
//                             <div className="relative">
//                               {remainingTime <= 3 ||
//                               item?.gstatus == "SUSPENDED" ? (
//                                 <>
//                                   <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                     <span className="text-white opacity-100">
//                                       <i class="ri-lock-2-fill text-xl"></i>
//                                     </span>
//                                   </div>
//                                   <div className="bg-blue-300 min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col  flex md:mb-1 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                                     <h1 className="md:text-xs text-[10px] text-center">
//                                       {item.nation}
//                                     </h1>
//                                     <span className="text-red-600 flex items-center justify-center font-bold z-[11]">
//                                       {(() => {
//                                         const filteredBets =
//                                           myCurrentCasinoBets?.currentCasinoBets
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.mid ==
//                                                 cardData?.mid
//                                             )
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                         return filteredBets?.length
//                                           ? filteredBets.reduce(
//                                               (acc, doc) =>
//                                                 acc +
//                                                 Number(doc.currentBet.stake),
//                                               0
//                                             ) * -1
//                                           : null;
//                                       })()}
//                                     </span>
//                                   </div>
//                                 </>
//                               ) : (
//                                 <div
//                                   onClick={(e) => {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: item?.nation,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b1,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }}
//                                   className="bg-blue-300 hover:bg-blue-400 cursor-pointer min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col  flex md:mb-1 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1"
//                                 >
//                                   <h1 className="md:text-xs text-[10px] text-center">
//                                     {item.nation}
//                                   </h1>
//                                   <span className="text-red-600 flex items-center justify-center font-normal">
//                                     {(() => {
//                                       const filteredBets =
//                                         myCurrentCasinoBets?.currentCasinoBets
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.mid ==
//                                               cardData?.mid
//                                           )
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.oddType ===
//                                                 "casino_odds" &&
//                                               doc.currentBet.sid === item?.sid
//                                           );
//                                       return filteredBets?.length
//                                         ? filteredBets.reduce(
//                                             (acc, doc) =>
//                                               acc +
//                                               Number(doc.currentBet.stake),
//                                             0
//                                           ) * -1
//                                         : null;
//                                     })()}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                       </div>
//                       <div class="col-span-6">
//                         <div className="bg-blue-300 md:min-h-[44px] min-h-[24px] md:border-none border-b border-t  border-e border-gray-300 flex md:mb-1 justify-center items-center text-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                           {" "}
//                           Back
//                         </div>
//                         {casinoData?.data?.data?.data?.t3
//                           ?.filter((v) => v.nation.includes("7 card bonus"))
//                           ?.map((item) => (
//                             <div className="relative">
//                               {/* {console.log(item)} */}
//                               {remainingTime <= 3 ||
//                               item?.gstatus == "SUSPENDED" ? (
//                                 <>
//                                   <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                     <span className="text-white opacity-100">
//                                       <i class="ri-lock-2-fill text-xl"></i>
//                                     </span>
//                                   </div>
//                                   <div className="bg-blue-300  min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col  flex md:mb-1 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                                     <h1 className="md:text-xs text-[10px] text-center">
//                                       {item.nation}
//                                     </h1>
//                                     <span className="text-red-600 flex items-end justify-center font-bold z-[11]">
//                                       {(() => {
//                                         const filteredBets =
//                                           myCurrentCasinoBets?.currentCasinoBets
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.mid ==
//                                                 cardData?.mid
//                                             )
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                         return filteredBets?.length
//                                           ? filteredBets.reduce(
//                                               (acc, doc) =>
//                                                 acc +
//                                                 Number(doc.currentBet.stake),
//                                               0
//                                             ) * -1
//                                           : null;
//                                       })()}
//                                     </span>
//                                   </div>
//                                 </>
//                               ) : (
//                                 <div
//                                   onClick={(e) => {
//                                     setPlaceBet(true);
//                                     const newBetData = {
//                                       betName: item?.nation,
//                                       boxColor: "bg-[#B2D6F0]",
//                                       matchOdd: item?.b1,
//                                       stake: 0,
//                                       mid: cardData?.mid,
//                                       sid: item?.sid,
//                                       oddType: "casino_odds",
//                                       oddCategory: "",
//                                     };
//                                     setBetData(newBetData);
//                                     setLatestBetData(newBetData);
//                                   }}
//                                   className="bg-blue-300 hover:bg-blue-400 md:border-none border-b border-e border-gray-300 cursor-pointer min-h-[44px] flex-col  flex md:mb-1 justify-start items-center uppercase md:text-sm font-semibold text-xs md:py-1"
//                                 >
//                                   <h1 className="md:text-xs text-[10px] text-center">
//                                     {item.nation}
//                                   </h1>
//                                   <span className="text-red-600 flex items-center justify-center font-noraml">
//                                     {(() => {
//                                       const filteredBets =
//                                         myCurrentCasinoBets?.currentCasinoBets
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.mid ==
//                                               cardData?.mid
//                                           )
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.oddType ===
//                                                 "casino_odds" &&
//                                               doc.currentBet.sid === item?.sid
//                                           );
//                                       return filteredBets?.length
//                                         ? filteredBets.reduce(
//                                             (acc, doc) =>
//                                               acc +
//                                               Number(doc.currentBet.stake),
//                                             0
//                                           ) * -1
//                                         : null;
//                                     })()}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* result start */}
//             <div className="result bg-secondaryBackground py-1 mb-1">
//               <div className="flex text-md justify-between px-2 text-white">
//                 <p>Last Result</p>
//                 <Link
//                   to="/reports/casino-results"
//                   className="cursor-pointer text-md hover:underline"
//                   state={{
//                     casinoGameSlug: item?.slug,
//                   }}
//                 >
//                   View All
//                 </Link>
//               </div>
//             </div>
//             {isModalOpen && (
//               <div className="fixed inset-0 flex items-center justify-center z-50">
//                 <div
//                   className="absolute top-0 inset-0 bg-gray-900 opacity-80"
//                   onClick={() => {
//                     setIsModalOpen(!isModalOpen);
//                     setIndividualResultData(undefined);
//                   }}
//                 ></div>

//                 <div
//                   className={`bg-white md:relative  absolute top-0 w-full z-50  max-w-3xl mx-auto`}
//                 >
//                   <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
//                     <h2 className="text-xl font-bold">{item.gameName}</h2>
//                     <button
//                       className=" focus:outline-none"
//                       onClick={() => {
//                         setIsModalOpen(!isModalOpen);
//                         setIndividualResultData(undefined);
//                       }}
//                     >
//                       <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
//                     </button>
//                   </div>
//                   {individualResultData ? (
//                     <div className="my-3 w-full ">
//                       <div>
//                         <h4 className=" flex justify-end items-center px-2 text-sm font-semibold">
//                           Round Id:{individualResultData?.mid}
//                         </h4>
//                       </div>

//                       <div className="grid grid-cols-2 place-items-center my-4">
//                         <div className="col-span-1 border-e w-full place-items-start relative">
//                           <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                             Player A
//                           </h1>
//                           <div className="flex gap-2 items-center justify-center">
//                             {individualResultData?.cards
//                               ?.split(",")
//                               ?.slice(0, 2)
//                               ?.map((item) => (
//                                 <img
//                                   className="md:h-[54px] h-[34px] "
//                                   src={
//                                     cardsData.find((v) => v.code == item).image
//                                   }
//                                 />
//                               ))}
//                           </div>
//                           {individualResultData?.win == "11" && (
//                             <div className="absolute text-success text-2xl left-5 top-1/2 animate-bounce">
//                               <FontAwesomeIcon
//                                 style={{ color: "green" }}
//                                 icon={faTrophy}
//                               />
//                             </div>
//                           )}
//                         </div>
//                         <div className="col-span-1 w-full place-items-start relative">
//                           <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                             Player B
//                           </h1>
//                           <div className="flex gap-2 items-center justify-center">
//                             {individualResultData?.cards
//                               ?.split(",")
//                               ?.slice(2, 4)
//                               ?.map((item) => (
//                                 <img
//                                   className="md:h-[54px] h-[34px] "
//                                   src={
//                                     cardsData.find((v) => v.code == item).image
//                                   }
//                                 />
//                               ))}
//                           </div>
//                           {individualResultData?.win == "21" && (
//                             <div className="absolute text-success text-2xl right-5 top-1/2 animate-bounce">
//                               <FontAwesomeIcon
//                                 style={{ color: "green" }}
//                                 icon={faTrophy}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col justify-center items-center border-t  pb-2 w-fit mx-auto place-items-start relative">
//                         <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                           Table
//                         </h1>
//                         <div className="flex gap-2 items-center justify-center">
//                           {individualResultData?.cards
//                             ?.split(",")
//                             ?.slice(4, 9)
//                             ?.map((item) => (
//                               <img
//                                 className="md:h-[54px] h-[34px] "
//                                 src={
//                                   cardsData.find((v) => v.code == item).image
//                                 }
//                               />
//                             ))}
//                         </div>
//                         {individualResultData?.win == "2" && (
//                           <div className="absolute text-success text-2xl right-0 top-1/2 animate-bounce">
//                             <FontAwesomeIcon
//                               style={{ color: "green" }}
//                               icon={faTrophy}
//                             />
//                           </div>
//                         )}
//                       </div>
//                       {/* table */}
//                       <div>
//                         {!filteredBetHistory.length <= 0 && (
//                           <IndividualBetHistoryTable
//                             data={filteredBetHistory}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="w-full h-full flex justify-center items-center my-4">
//                       <img
//                         <i className="fa fa-spinner fa-spin"/>
//                         className="w-16 h-16 animate-spin"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//             <div
//               className={`flex justify-end mb-1
//                   gap-1`}
//             >
//               {casinoData?.data?.data?.result ? (
//                 casinoData?.data?.data?.result?.map((item, index) => (
//                   <div
//                     key={index}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setIsModalOpen(true);
//                       casinoIndividualResult(cookies, item.mid).then((res) => {
//                         setIndividualResultData(res?.data?.data?.[0]);
//                       });
//                     }}
//                     className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
//                       item.result == 1 ? "text-red-500" : "text-yellow-400"
//                     }  flex justify-center items-center w-6 rounded-full`}
//                   >
//                     {getResultText(item.result)}
//                   </div>
//                 ))
//               ) : (
//                 <>No Results Found</>
//               )}
//             </div>
//             {/* result end */}
//           </div>
//           <div className="sidebar right-sidebar casino-right-sidebar sticky overflow-hidden">
//             <div className="sidebar-box my-bet-container">
//               <div className={`${!placeBet ? "block" : "hidden"}`}>
//                 <h1 className="px-2 py-1 bg-secondaryBackground text-white">
//                   Place Bet
//                 </h1>
//               </div>
//               <div className={`${placeBet ? "block" : "hidden"}`}>
//                 <CasinoBetPopup
//                   gameType="casino"
//                   time={remainingTime}
//                   gameName={item?.slug}
//                   item={item}
//                   refetchCurrentBets={refetchCurrentBets}
//                   odds={casinoData?.data?.data?.data?.t2}
//                   myCurrentBets={myCurrentCasinoBets}
//                 />
//               </div>
//             </div>
//             <div className="h-full">
//               <PlaceBet
//                 data={myCurrentCasinoBets}
//                 game={item?.gameName}
//                 bet={bet}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//       <div className={`${placeBet ? "block" : "hidden"}`}>
//         <div className="fixed inset-0 flex  items-start justify-center z-50 md:hidden">
//           <div className="absolute top-0 inset-0  bg-gray-900 opacity-80"></div>

//           <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
//             <CasinoMobileBetPopup
//               time={remainingTime}
//               gameType="casino"
//               gameName={item?.slug}
//               item={item}
//               refetchCurrentBets={refetchCurrentBets}
//               odds={casinoData?.data?.data?.data?.t2}
//               myCurrentBets={myCurrentCasinoBets}
//             />
//           </div>
//         </div>
//       </div>
//       {bet && (
//         <div className="md:w-[100%] md:hidden   md:ms-1 h-fit  flex-col">
//           {/*  */}
//           <div className="h-screen">
//             <PlaceBet
//               data={myCurrentCasinoBets}
//               game={item?.gameName}
//               bet={bet}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default POKER_1_DAY;

// import React, { useContext, useEffect, useRef, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import cardsData from "../../assets/cards/data";
// import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
// import useCountdown from "../../hook/useCountdown";
// import PlaceBet from "../common/PlaceBet";
// import PlayerOdds from "../common/PlayerOdds";
// import Timer from "../common/Timer";
// import CardsUi from "../common/CardsUi";
// import cricketBall from "../../assets/Cricket_ball.svg";
// import { casinoIndividualResult } from "../../helpers/casino";
// import { useCookies } from "react-cookie";
// import { useQuery, useQueryClient } from "react-query";
// import Header from "../common/Header";
// import HeaderTab from "../common/HeaderTab";
// import { PlaceBetUseContext } from "../../Context/placeBetContext";
// import Frame from "../common/Frame";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
// import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
// import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
// import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
// import useScrollFixed from "../../hook/useFixed";
// import { getMyCasinoBetHistory } from "../../helpers/betHistory";
// import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
// import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
// import { decodedTokenData, signout } from "../../helpers/auth";

// const POKER_1_DAY = ({
//   myCurrentCasinoBets,
//   refetchCurrentBets,
//   refetchCasinoBetHistory,
//   CasinoBetHistory,
//   casinoSpecialPermission,
//   casinoData,
// }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);
//   console.log("my casino data", casinoData);

//   const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

//   const location = useLocation();
//   const item = location.state?.item;

//   const queryClient = useQueryClient();

//   const [Countdown, setCountdown] = useState(0);
//   const [cardData, setCardData] = useState([]);
//   const [individualResultData, setIndividualResultData] = useState(null);
//   const [isBetModalOpen, setIsBetModalOpen] = useState(false);
//   const [bet, setBet] = useState(false);

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

//   const filteredBetHistory = useFilterIndividualBetHistory(
//     CasinoBetHistory,
//     individualResultData
//   );

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

//   const getResultText = (result) => {
//     switch (result) {
//       case "11":
//         return "A";
//       case "21":
//         return "B";
//       case "0":
//         return "T";
//     }
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     if (
//       remainingTime == 35 ||
//       remainingTime == 30 ||
//       remainingTime == 20 ||
//       remainingTime == 25 ||
//       remainingTime == 15 ||
//       remainingTime == 10
//     ) {
//       queryClient.invalidateQueries([
//         "casinoGameOdds",
//         { cookies, slug: item?.slug },
//       ]);
//       queryClient.invalidateQueries([
//         "casinoGameTopTenResult",
//         { cookies, slug: item?.slug },
//       ]);
//       refetchCurrentBets();
//       refetchCasinoBetHistory();
//     }
//   }, [remainingTime]);

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

//   // Get Player A and Player B data
//   const playerAData = Array.isArray(casinoData?.data?.data?.data?.t2)
//     ? casinoData?.data?.data?.data?.t2.find(
//         (item) => item.nation === "Player A"
//       )
//     : null;

//   const playerBData = Array.isArray(casinoData?.data?.data?.data?.t2)
//     ? casinoData?.data?.data?.data?.t2.find(
//         (item) => item.nation === "Player B"
//       )
//     : null;

//   // Get Bonus data
//   const playerA2CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
//     ? casinoData?.data?.data?.data?.t3.find(
//         (item) => item.nation === "Player A 2 card Bonus"
//       )
//     : null;

//   const playerA7CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
//     ? casinoData?.data?.data?.data?.t3.find(
//         (item) => item.nation === "Player A 7 card bonus"
//       )
//     : null;

//   const playerB2CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
//     ? casinoData?.data?.data?.data?.t3.find(
//         (item) => item.nation === "Player B 2 card Bonus"
//       )
//     : null;

//   const playerB7CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
//     ? casinoData?.data?.data?.data?.t3.find(
//         (item) => item.nation === "Player B 7 card bonus"
//       )
//     : null;

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
//       {!bet && (
//         <div className="flex relative w-full h-full">
//           <div className="center-container">
//             <div className="p-2 hidden md:block bg-secondaryBackground text-white">
//               <Header
//                 gameName={item?.gameName}
//                 min={cardData?.min}
//                 max={cardData?.max}
//                 mid={cardData?.mid}
//               />
//             </div>

//             {/* Casino Video Section */}
//             <div className="casino-video">
//               <Frame item={item} />

//               {/* Cards Display */}
//               <div className="absolute top-0 left-1">
//                 <div className="flex gap-8 items-center">
//                   <div>
//                     <h1 className="text-white flex justify-start items-center text-xs md:text-sm my-0 font-semibold uppercase">
//                       Player A
//                     </h1>
//                     <div className="flex gap-1">
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C1) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C1)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C1).name
//                             }
//                           />
//                         )}
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C2) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C2)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C2).name
//                             }
//                           />
//                         )}
//                     </div>
//                   </div>
//                   <div>
//                     <h1 className="text-white flex justify-end items-center text-xs md:text-sm my-0 font-semibold uppercase">
//                       Player B
//                     </h1>
//                     <div className="flex gap-1">
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C3) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C3)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C3).name
//                             }
//                           />
//                         )}
//                       {cardsData &&
//                         cardsData.find((i) => i.code == cardData?.C4) && (
//                           <img
//                             src={
//                               cardsData.find((i) => i.code == cardData?.C4)
//                                 .image
//                             }
//                             className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                             alt={
//                               cardsData.find((i) => i.code == cardData?.C4).name
//                             }
//                           />
//                         )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Board Cards */}
//                 <h1 className="text-white mt-1 flex justify-start items-center text-xs md:text-sm my-0 font-semibold uppercase">
//                   Board
//                 </h1>
//                 <div className="flex gap-1">
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C5) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C5).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C5).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C6) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C6).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C6).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C7) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C7).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C7).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C8) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C8).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C8).name}
//                       />
//                     )}
//                   {cardsData &&
//                     cardsData.find((i) => i.code == cardData?.C9) && (
//                       <img
//                         src={
//                           cardsData.find((i) => i.code == cardData?.C9).image
//                         }
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardsData.find((i) => i.code == cardData?.C9).name}
//                       />
//                     )}
//                 </div>
//               </div>

//               {/* Timer */}
//               <div className="absolute bottom-2 right-2">
//                 <Timer time={endTime} />
//               </div>
//             </div>

//             {/* Casino Table Structure */}
//             <div className=" poker1day casino-table">
//               <div className="casino-table-box">
//                 {/* Left Box - Player A */}
//                 <div className="casino-table-left-box">
//                   <div className="casino-table-body">
//                     {/* Single Row for Player A */}
//                     <div className="casino-table-row">
//                       <div className="casino-nation-detail">
//                         <div className="casino-nation-name">Player A</div>
//                       </div>
//                       <div
//                         className={`casino-odds-box back ${
//                           remainingTime <= 3 ||
//                           playerAData?.gstatus === "SUSPENDED"
//                             ? "suspended-box"
//                             : ""
//                         }`}
//                       >
//                         <span className="casino-odds">
//                           {playerAData?.b1 || "0"}
//                         </span>
//                       </div>
//                       <div
//                         className={`casino-odds-box lay ${
//                           remainingTime <= 3 ||
//                           playerAData?.gstatus === "SUSPENDED"
//                             ? "suspended-box"
//                             : ""
//                         }`}
//                       >
//                         <span className="casino-odds">
//                           {playerAData?.l1 || "0"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="casino-table-box-divider" />

//                 {/* Right Box - Player B */}
//                 <div className="casino-table-right-box">
//                   <div className="casino-table-body">
//                     {/* Single Row for Player B */}
//                     <div className="casino-table-row">
//                       <div className="casino-nation-detail">
//                         <div className="casino-nation-name">Player B</div>
//                       </div>
//                       <div
//                         className={`casino-odds-box back ${
//                           remainingTime <= 3 ||
//                           playerBData?.gstatus === "SUSPENDED"
//                             ? "suspended-box"
//                             : ""
//                         }`}
//                       >
//                         <span className="casino-odds">
//                           {playerBData?.b1 || "0"}
//                         </span>
//                       </div>
//                       <div
//                         className={`casino-odds-box lay ${
//                           remainingTime <= 3 ||
//                           playerBData?.gstatus === "SUSPENDED"
//                             ? "suspended-box"
//                             : ""
//                         }`}
//                       >
//                         <span className="casino-odds">
//                           {playerBData?.l1 || "0"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Bonus Odds Section */}
//               <div className="poker1day-other-odds">
//                 <div className="casino-table-left-box">
//                   <div className="w-100 d-xl-none mobile-nation-name">
//                     Player A
//                   </div>

//                   {/* Player A 2 Cards Bonus */}
//                   <div
//                     className={`casino-odds-box back ${
//                       remainingTime <= 3 ||
//                       playerA2CardBonus?.gstatus === "SUSPENDED"
//                         ? "suspended-box"
//                         : ""
//                     }`}
//                   >
//                     <span className="casino-odds">2 Cards Bonus</span>
//                   </div>

//                   {/* Player A 7 Cards Bonus */}
//                   <div
//                     className={`casino-odds-box back ${
//                       remainingTime <= 3 ||
//                       playerA7CardBonus?.gstatus === "SUSPENDED"
//                         ? "suspended-box"
//                         : ""
//                     }`}
//                   >
//                     <span className="casino-odds">7 Cards Bonus</span>
//                   </div>
//                 </div>

//                 <div className="casino-table-box-divider" />

//                 <div className="casino-table-right-box">
//                   <div className="w-100 d-xl-none mobile-nation-name">
//                     Player B
//                   </div>

//                   {/* Player B 2 Cards Bonus */}
//                   <div
//                     className={`casino-odds-box back ${
//                       remainingTime <= 3 ||
//                       playerB2CardBonus?.gstatus === "SUSPENDED"
//                         ? "suspended-box"
//                         : ""
//                     }`}
//                   >
//                     <span className="casino-odds">2 Cards Bonus</span>
//                   </div>

//                   {/* Player B 7 Cards Bonus */}
//                   <div
//                     className={`casino-odds-box back ${
//                       remainingTime <= 3 ||
//                       playerB7CardBonus?.gstatus === "SUSPENDED"
//                         ? "suspended-box"
//                         : ""
//                     }`}
//                   >
//                     <span className="casino-odds">7 Cards Bonus</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Remark Section */}
//               <div className="casino-remark mt-1">
//                 <marquee scrollamount={3}>
//                   {casinoData?.data?.data?.data?.t1?.[0]?.remark ||
//                     "Play Our New Game Premium Teenpatti 1 Day"}
//                 </marquee>
//               </div>
//             </div>

//             {/* Result Section */}
//             <div className="result bg-secondaryBackground py-1 mb-1">
//               <div className="flex text-md justify-between px-2 text-white">
//                 <p>Last Result</p>
//                 <Link
//                   to="/reports/casino-results"
//                   className="cursor-pointer text-md hover:underline"
//                   state={{
//                     casinoGameSlug: item?.slug,
//                   }}
//                 >
//                   View All
//                 </Link>
//               </div>
//             </div>

//             {/* Result Modal */}
//             {isModalOpen && (
//               <div className="fixed inset-0 flex items-center justify-center z-50">
//                 <div
//                   className="absolute top-0 inset-0 bg-gray-900 opacity-80"
//                   onClick={() => {
//                     setIsModalOpen(!isModalOpen);
//                     setIndividualResultData(undefined);
//                   }}
//                 ></div>

//                 <div
//                   className={`bg-white md:relative absolute top-0 w-full z-50 max-w-3xl mx-auto`}
//                 >
//                   <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
//                     <h2 className="text-xl font-bold">{item.gameName}</h2>
//                     <button
//                       className="focus:outline-none"
//                       onClick={() => {
//                         setIsModalOpen(!isModalOpen);
//                         setIndividualResultData(undefined);
//                       }}
//                     >
//                       <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
//                     </button>
//                   </div>
//                   {individualResultData ? (
//                     <div className="my-3 w-full">
//                       <div>
//                         <h4 className="flex justify-end items-center px-2 text-sm font-semibold">
//                           Round Id:{individualResultData?.mid}
//                         </h4>
//                       </div>

//                       <div className="grid grid-cols-2 place-items-center my-4">
//                         <div className="col-span-1 border-e w-full place-items-start relative">
//                           <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                             Player A
//                           </h1>
//                           <div className="flex gap-2 items-center justify-center">
//                             {individualResultData?.cards
//                               ?.split(",")
//                               ?.slice(0, 2)
//                               ?.map((item, index) => (
//                                 <img
//                                   key={index}
//                                   className="md:h-[54px] h-[34px]"
//                                   src={
//                                     cardsData.find((v) => v.code == item)?.image
//                                   }
//                                   alt={`Card ${index + 1}`}
//                                 />
//                               ))}
//                           </div>
//                           {individualResultData?.win == "11" && (
//                             <div className="absolute text-success text-2xl left-5 top-1/2 animate-bounce">
//                               <FontAwesomeIcon
//                                 style={{ color: "green" }}
//                                 icon={faTrophy}
//                               />
//                             </div>
//                           )}
//                         </div>
//                         <div className="col-span-1 w-full place-items-start relative">
//                           <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                             Player B
//                           </h1>
//                           <div className="flex gap-2 items-center justify-center">
//                             {individualResultData?.cards
//                               ?.split(",")
//                               ?.slice(2, 4)
//                               ?.map((item, index) => (
//                                 <img
//                                   key={index}
//                                   className="md:h-[54px] h-[34px]"
//                                   src={
//                                     cardsData.find((v) => v.code == item)?.image
//                                   }
//                                   alt={`Card ${index + 3}`}
//                                 />
//                               ))}
//                           </div>
//                           {individualResultData?.win == "21" && (
//                             <div className="absolute text-success text-2xl right-5 top-1/2 animate-bounce">
//                               <FontAwesomeIcon
//                                 style={{ color: "green" }}
//                                 icon={faTrophy}
//                               />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col justify-center items-center border-t pb-2 w-fit mx-auto place-items-start relative">
//                         <h1 className="md:text-lg flex justify-center items-center text-sm uppercase font-semibold">
//                           Table
//                         </h1>
//                         <div className="flex gap-2 items-center justify-center">
//                           {individualResultData?.cards
//                             ?.split(",")
//                             ?.slice(4, 9)
//                             ?.map((item, index) => (
//                               <img
//                                 key={index}
//                                 className="md:h-[54px] h-[34px]"
//                                 src={
//                                   cardsData.find((v) => v.code == item)?.image
//                                 }
//                                 alt={`Table Card ${index + 1}`}
//                               />
//                             ))}
//                         </div>
//                       </div>
//                       <div>
//                         {!filteredBetHistory.length <= 0 && (
//                           <IndividualBetHistoryTable
//                             data={filteredBetHistory}
//                           />
//                         )}
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="w-full h-full flex justify-center items-center my-4">
//                       <img
//                         <i className="fa fa-spinner fa-spin"/>
//                         className="w-16 h-16 animate-spin"
//                         alt="Loading"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Results Display */}
//             <div className={`flex justify-end mb-1 gap-1`}>
//               {casinoData?.data?.data?.result ? (
//                 casinoData?.data?.data?.result?.map((item, index) => (
//                   <div
//                     key={index}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setIsModalOpen(true);
//                       casinoIndividualResult(cookies, item.mid).then((res) => {
//                         setIndividualResultData(res?.data?.data?.[0]);
//                       });
//                     }}
//                     className={`h-6 cursor-pointer font-semibold hover:bg-green-950 bg-green-800 ${
//                       item.result == 1 ? "text-red-500" : "text-yellow-400"
//                     } flex justify-center items-center w-6 rounded-full`}
//                   >
//                     {getResultText(item.result)}
//                   </div>
//                 ))
//               ) : (
//                 <>No Results Found</>
//               )}
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="sidebar right-sidebar casino-right-sidebar sticky overflow-hidden">
//             <div className="sidebar-box my-bet-container">
//               <div className={`${!placeBet ? "block" : "hidden"}`}>
//                 <h1 className="px-2 py-1 bg-secondaryBackground text-white">
//                   Place Bet
//                 </h1>
//               </div>
//               <div className={`${placeBet ? "block" : "hidden"}`}>
//                 <CasinoBetPopup
//                   gameType="casino"
//                   time={remainingTime}
//                   gameName={item?.slug}
//                   item={item}
//                   refetchCurrentBets={refetchCurrentBets}
//                   odds={casinoData?.data?.data?.data?.t2}
//                   myCurrentBets={myCurrentCasinoBets}
//                 />
//               </div>
//             </div>
//             <div className="h-full">
//               <PlaceBet
//                 data={myCurrentCasinoBets}
//                 game={item?.gameName}
//                 bet={bet}
//               />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Bet Popup */}
//       <div className={`${placeBet ? "block" : "hidden"}`}>
//         <div className="fixed inset-0 flex items-start justify-center z-50 md:hidden">
//           <div className="absolute top-0 inset-0 bg-gray-900 opacity-80"></div>
//           <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
//             <CasinoMobileBetPopup
//               time={remainingTime}
//               gameType="casino"
//               gameName={item?.slug}
//               item={item}
//               refetchCurrentBets={refetchCurrentBets}
//               odds={casinoData?.data?.data?.data?.t2}
//               myCurrentBets={myCurrentCasinoBets}
//             />
//           </div>
//         </div>
//       </div>

//       {bet && (
//         <div className="md:w-[100%] md:hidden md:ms-1 h-fit flex-col">
//           <div className="h-screen">
//             <PlaceBet
//               data={myCurrentCasinoBets}
//               game={item?.gameName}
//               bet={bet}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default POKER_1_DAY;

import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import cardsData from "../../assets/cards/data";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import useCountdown from "../../hook/useCountdown";
import PlaceBet from "../common/PlaceBet";
import PlayerOdds from "../common/PlayerOdds";
import Timer from "../common/Timer";
import CardsUi from "../common/CardsUi";
import cricketBall from "../../assets/Cricket_ball.svg";
import { casinoIndividualResult } from "../../helpers/casino";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import Header from "../common/Header";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import Card from "../common/Card";

const POKER_1_DAY = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  console.log("my casino data", casinoData);

  const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

  const location = useLocation();
  const item = location.state?.item;

  const queryClient = useQueryClient();

  const [Countdown, setCountdown] = useState(0);
  const [cardData, setCardData] = useState([]);
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
  const latestBetDataRef = useRef(betData);

  const isFixed = useScrollFixed();

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

  const { remainingTime, endTime } = useCountdown(
    Countdown,
    handleCountdownEnd
  );

  const getResultText = (result) => {
    switch (result) {
      case "11":
        return "A";
      case "21":
        return "B";
      case "0":
        return "T";
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
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
  }, [remainingTime]);

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

  // Get Player A and Player B data
  const playerAData = Array.isArray(casinoData?.data?.data?.data?.t2)
    ? casinoData?.data?.data?.data?.t2.find(
        (item) => item.nation === "Player A"
      )
    : null;

  const playerBData = Array.isArray(casinoData?.data?.data?.data?.t2)
    ? casinoData?.data?.data?.data?.t2.find(
        (item) => item.nation === "Player B"
      )
    : null;

  // Get Bonus data
  const playerA2CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
    ? casinoData?.data?.data?.data?.t3.find(
        (item) => item.nation === "Player A 2 card Bonus"
      )
    : null;

  const playerA7CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
    ? casinoData?.data?.data?.data?.t3.find(
        (item) => item.nation === "Player A 7 card bonus"
      )
    : null;

  const playerB2CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
    ? casinoData?.data?.data?.data?.t3.find(
        (item) => item.nation === "Player B 2 card Bonus"
      )
    : null;

  const playerB7CardBonus = Array.isArray(casinoData?.data?.data?.data?.t3)
    ? casinoData?.data?.data?.data?.t3.find(
        (item) => item.nation === "Player B 7 card bonus"
      )
    : null;

  // Click handler functions
  const handleBackClick = (playerData, playerName) => {
    if (playerData?.b1 !== "0" && playerData?.b1 !== "0.00") {
      setPlaceBet(true);
      const newBetData = {
        betName: `Back on ${playerName}`,
        boxColor: "bg-[#B2D6F0]",
        matchOdd: playerData?.b1,
        stake: 0,
        mid: cardData?.mid,
        sid: playerData?.sid,
        oddType: "casino_odds",
        oddCategory: "Back",
      };
      setBetData(newBetData);
      setLatestBetData(newBetData);
    }
  };

  const handleLayClick = (playerData, playerName) => {
    if (playerData?.l1 !== "0" && playerData?.l1 !== "0.00") {
      setPlaceBet(true);
      const newBetData = {
        betName: `Lay on ${playerName}`,
        boxColor: "bg-[#FAA9BA]",
        matchOdd: playerData?.l1,
        stake: 0,
        mid: cardData?.mid,
        sid: playerData?.sid,
        oddType: "casino_odds",
        oddCategory: "Lay",
      };
      setBetData(newBetData);
      setLatestBetData(newBetData);
    }
  };

  const handleBonusClick = (bonusData, bonusName) => {
    setPlaceBet(true);
    const newBetData = {
      betName: bonusName,
      boxColor: "bg-[#B2D6F0]",
      matchOdd: bonusData?.b1,
      stake: 0,
      mid: cardData?.mid,
      sid: bonusData?.sid,
      oddType: "casino_odds",
      oddCategory: "",
    };
    setBetData(newBetData);
    setLatestBetData(newBetData);
  };
const cards = individualResultData?.cards?.split(",") || [];

// Player A
const playerA = cards.slice(0, 2);

// Player B
const playerB = cards.slice(2, 4);

// Board
const board = cards.slice(4, 9);


const descParts = individualResultData?.newdesc
  ? individualResultData.newdesc.split("#")
  : [];

const winner = individualResultData?.winnat || "-";
const twoCard = descParts[1] || "-";
const sevenCard = descParts[2] || "-";




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
            <div className="md:block hidden">
              <Header
                gameName={item?.gameName}
                min={cardData?.min}
                max={cardData?.max}
                mid={cardData?.mid}
              />
            </div>

            {/* Casino Video Section */}
            <div className="casino-video">
              <Frame item={item} />

              {/* Cards Display */}
             <Card cardData={cardData} slug={item.slug}/>

              {/* Timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* Casino Table Structure */}
            <div className="poker1day casino-table">
              <div className="casino-table-box">
                {/* Left Box - Player A */}
                <div className="casino-table-left-box">
                  <div className="casino-table-body">
                    {/* Single Row for Player A */}
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Player A</div>
                      </div>

                      {/* Back Odds for Player A */}
                      {remainingTime <= 3 ||
                      playerAData?.gstatus === "SUSPENDED" ? (
                        <div className="casino-odds-box back suspended-box">
                          <span className="casino-odds">
                            {playerAData?.b1 || "0"}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="casino-odds-box back clickable"
                          onClick={() =>
                            handleBackClick(playerAData, "Player A")
                          }
                        >
                          <span className="casino-odds">
                            {playerAData?.b1 || "0"}
                          </span>
                        </div>
                      )}

                      {/* Lay Odds for Player A */}
                      {remainingTime <= 3 ||
                      playerAData?.gstatus === "SUSPENDED" ? (
                        <div className="casino-odds-box lay suspended-box">
                          <span className="casino-odds">
                            {playerAData?.l1 || "0"}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="casino-odds-box lay clickable"
                          onClick={() =>
                            handleLayClick(playerAData, "Player A")
                          }
                        >
                          <span className="casino-odds">
                            {playerAData?.l1 || "0"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="casino-table-box-divider" />

                {/* Right Box - Player B */}
                <div className="casino-table-right-box">
                  <div className="casino-table-body">
                    {/* Single Row for Player B */}
                    <div className="casino-table-row">
                      <div className="casino-nation-detail">
                        <div className="casino-nation-name">Player B</div>
                      </div>

                      {/* Back Odds for Player B */}
                      {remainingTime <= 3 ||
                      playerBData?.gstatus === "SUSPENDED" ? (
                        <div className="casino-odds-box back suspended-box">
                          <span className="casino-odds">
                            {playerBData?.b1 || "0"}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="casino-odds-box back clickable"
                          onClick={() =>
                            handleBackClick(playerBData, "Player B")
                          }
                        >
                          <span className="casino-odds">
                            {playerBData?.b1 || "0"}
                          </span>
                        </div>
                      )}

                      {/* Lay Odds for Player B */}
                      {remainingTime <= 3 ||
                      playerBData?.gstatus === "SUSPENDED" ? (
                        <div className="casino-odds-box lay suspended-box">
                          <span className="casino-odds">
                            {playerBData?.l1 || "0"}
                          </span>
                        </div>
                      ) : (
                        <div
                          className="casino-odds-box lay clickable"
                          onClick={() =>
                            handleLayClick(playerBData, "Player B")
                          }
                        >
                          <span className="casino-odds">
                            {playerBData?.l1 || "0"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bonus Odds Section */}
              <div className="poker1day-other-odds">
                <div className="casino-table-left-box">
                  <div className="w-100 d-xl-none mobile-nation-name">
                    Player A
                  </div>

                  {/* Player A 2 Cards Bonus */}
                  {remainingTime <= 3 ||
                  playerA2CardBonus?.gstatus === "SUSPENDED" ? (
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">2 Cards Bonus</span>
                    </div>
                  ) : (
                    <div
                      className="casino-odds-box back clickable"
                      onClick={() =>
                        handleBonusClick(
                          playerA2CardBonus,
                          "Player A 2 Cards Bonus"
                        )
                      }
                    >
                      <span className="casino-odds">2 Cards Bonus</span>
                    </div>
                  )}

                  {/* Player A 7 Cards Bonus */}
                  {remainingTime <= 3 ||
                  playerA7CardBonus?.gstatus === "SUSPENDED" ? (
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">7 Cards Bonus</span>
                    </div>
                  ) : (
                    <div
                      className="casino-odds-box back clickable"
                      onClick={() =>
                        handleBonusClick(
                          playerA7CardBonus,
                          "Player A 7 Cards Bonus"
                        )
                      }
                    >
                      <span className="casino-odds">7 Cards Bonus</span>
                    </div>
                  )}
                </div>

                <div className="casino-table-box-divider" />

                <div className="casino-table-right-box">
                  <div className="w-100 d-xl-none mobile-nation-name">
                    Player B
                  </div>

                  {/* Player B 2 Cards Bonus */}
                  {remainingTime <= 3 ||
                  playerB2CardBonus?.gstatus === "SUSPENDED" ? (
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">2 Cards Bonus</span>
                    </div>
                  ) : (
                    <div
                      className="casino-odds-box back clickable"
                      onClick={() =>
                        handleBonusClick(
                          playerB2CardBonus,
                          "Player B 2 Cards Bonus"
                        )
                      }
                    >
                      <span className="casino-odds">2 Cards Bonus</span>
                    </div>
                  )}

                  {/* Player B 7 Cards Bonus */}
                  {remainingTime <= 3 ||
                  playerB7CardBonus?.gstatus === "SUSPENDED" ? (
                    <div className="casino-odds-box back suspended-box">
                      <span className="casino-odds">7 Cards Bonus</span>
                    </div>
                  ) : (
                    <div
                      className="casino-odds-box back clickable"
                      onClick={() =>
                        handleBonusClick(
                          playerB7CardBonus,
                          "Player B 7 Cards Bonus"
                        )
                      }
                    >
                      <span className="casino-odds">7 Cards Bonus</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Remark Section */}
              <div className="casino-remark mt-1">
                <marquee scrollamount={3}>
                  {casinoData?.data?.data?.data?.t1?.[0]?.remark ||
                    "Play Our New Game Premium Teenpatti 1 Day"}
                </marquee>
              </div>
            </div>

            {/* Result Section */}
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
                {getResultText(item.result)}
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
                  gameType="casino"
                  time={remainingTime}
                  gameName={item?.slug}
                  item={item}
                  refetchCurrentBets={refetchCurrentBets}
                  odds={casinoData?.data?.data?.data?.t2}
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

      {/* Mobile Bet Popup */}
      <div className={`${placeBet ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex items-start justify-center z-50 md:hidden">
          <div className="absolute top-0 inset-0 bg-gray-900 opacity-80"></div>
          <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
            <CasinoMobileBetPopup
              time={remainingTime}
              gameType="casino"
              gameName={item?.slug}
              item={item}
              refetchCurrentBets={refetchCurrentBets}
              odds={casinoData?.data?.data?.data?.t2}
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

export default POKER_1_DAY;
