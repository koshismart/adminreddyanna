// import React, { useContext, useEffect, useRef, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useQuery, useQueryClient } from "react-query";
// import { Link, useLocation } from "react-router-dom";
// import { PlaceBetUseContext } from "../../Context/placeBetContext";
// import useCountdown from "../../hook/useCountdown";
// import {
//   // casinoGameOdds,
//   // casinoGameTopTenResult,
//   casinoIndividualResult,
// } from "../../helpers/casino";
// import HeaderTab from "../common/HeaderTab";
// import Header from "../common/Header";
// import CardsUi from "../common/CardsUi";
// import cardsData from "../../assets/cards/data";
// import Timer from "../common/Timer";
// import PlayerOdds from "../common/PlayerOdds";
// import PlaceBet from "../common/PlaceBet";
// import Frame from "../common/Frame";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
// import useScrollFixed from "../../hook/useFixed";
// import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
// import cricketBall from "../../assets/Cricket_ball.svg";
// import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
// import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
// import { getMyCasinoBetHistory } from "../../helpers/betHistory";
// import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
// import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
// import { decodedTokenData, signout } from "../../helpers/auth";

// const Cards32b = ({
//   myCurrentCasinoBets,
//   refetchCurrentBets,
//   refetchCasinoBetHistory,
//   CasinoBetHistory,
//   casinoSpecialPermission,
//   casinoData,
// }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);
//   console.log("my card b", casinoData);

//   // Decode token safely
//   const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

//   const location = useLocation();
//   const item = location.state?.item;

//   const queryClient = useQueryClient();

//   const [Countdown, setCountdown] = useState(0);

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

//   const [cardData, setCardData] = useState([]);
//   const [individualResultData, setIndividualResultData] = useState(null);
//   const [isBetModalOpen, setIsBetModalOpen] = useState(false);
//   const [bet, setBet] = useState(false);

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
//   const getResultText = (result) => {
//     // console.log(result);
//     switch (result) {
//       case "1":
//         return "8";
//       case "2":
//         return "9";
//       case "3":
//         return "10";
//       case "4":
//         return "11";
//     }
//   };
//   // result modal
//   const [isModalOpen, setIsModalOpen] = useState(false);

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
//           min={casinoData?.data?.data?.data?.t2?.[0]?.min}
//           max={casinoData?.data?.data?.data?.t2?.[0]?.max}
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
//             <div className="">
//               <Header
//                 gameName={item?.gameName}
//                 min={casinoData?.data?.data?.data?.t2?.[0]?.min}
//                 max={casinoData?.data?.data?.data?.t2?.[0]?.max}
//                 mid={cardData?.mid}
//               />
//             </div>
//             <div className="casino-video">
//               <Frame item={item} />

//               {/* card */}

//               <div className="absolute top-0 left-1">
//                 <div>
//                   <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
//                     Player 8
//                     <span className="text-yellow-300 md:mx-1 mx-0">
//                       {" "}
//                       : {cardData?.C1}
//                     </span>
//                   </h1>
//                   {cardData?.desc &&
//                     cardData?.desc
//                       ?.split(",")
//                       ?.slice(0, 1)
//                       ?.map((i) => cardsData?.find((c) => c.code == i)) && (
//                       <img
//                         src={cardData?.desc
//                           ?.split(",")
//                           ?.slice(0, 1)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.image
//                           )}
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardData?.desc
//                           ?.split(",")
//                           ?.slice(0, 1)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.name
//                           )}
//                       />
//                     )}
//                   <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
//                     Player 9
//                     <span className="text-yellow-300 md:mx-1 mx-0">
//                       {" "}
//                       : {cardData?.C2}
//                     </span>
//                   </h1>
//                   {cardData?.desc &&
//                     cardData?.desc
//                       ?.split(",")
//                       ?.slice(1, 2)
//                       ?.map((i) => cardsData?.find((c) => c.code == i)) && (
//                       <img
//                         src={cardData?.desc
//                           ?.split(",")
//                           ?.slice(1, 2)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.image
//                           )}
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardData?.desc
//                           ?.split(",")
//                           ?.slice(1, 2)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.name
//                           )}
//                       />
//                     )}
//                   <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
//                     Player 10
//                     <span className="text-yellow-300 md:mx-1 mx-0">
//                       {" "}
//                       : {cardData?.C3}
//                     </span>
//                   </h1>
//                   {cardData?.desc &&
//                     cardData?.desc
//                       ?.split(",")
//                       ?.slice(2, 3)
//                       ?.map((i) => cardsData?.find((c) => c.code == i)) && (
//                       <img
//                         src={cardData?.desc
//                           ?.split(",")
//                           ?.slice(2, 3)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.image
//                           )}
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardData?.desc
//                           ?.split(",")
//                           ?.slice(2, 3)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.name
//                           )}
//                       />
//                     )}
//                   <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
//                     Player 11
//                     <span className="text-yellow-300 md:mx-1 mx-0">
//                       {" "}
//                       : {cardData?.C4}
//                     </span>
//                   </h1>
//                   {cardData?.desc &&
//                     cardData?.desc
//                       ?.split(",")
//                       ?.slice(3, 4)
//                       ?.map((i) => cardsData?.find((c) => c.code == i)) && (
//                       <img
//                         src={cardData?.desc
//                           ?.split(",")
//                           ?.slice(3, 4)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.image
//                           )}
//                         className="h-[24px] md:h-[34px] rounded-sm img-fluid"
//                         alt={cardData?.desc
//                           ?.split(",")
//                           ?.slice(3, 4)
//                           ?.map(
//                             (i) => cardsData?.find((c) => c.code == i)?.name
//                           )}
//                       />
//                     )}
//                 </div>
//               </div>
//               {/* timer */}
//               <div className="absolute bottom-2 right-2">
//                 <Timer time={endTime} />
//               </div>
//             </div>
//             {/* table part */}
//             <div>
//               {/* top */}
//               <div className="grid grid-cols-12 md:gap-2">
//                 <div className="md:col-span-6 col-span-12 border-gray-400 md:border mb-1 border-1">
//                   <div className="grid grid-cols-12 md:shadow-none shadow-sm md:gap-1">
//                     <div className="col-span-6 md:p-1 ">
//                       <div className="md:bg-gray-300 md:border-none border-b border-t  border-e border-gray-300 md:min-h-[44px] min-h-[25px] flex md:mb-1  items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                         <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
//                           Min:{" "}
//                           <span className="me-2">
//                             {Array.isArray(casinoData?.data?.data?.data?.t1) &&
//                               casinoData?.data?.data?.data?.t1?.[0]?.min}
//                           </span>{" "}
//                           Max:{" "}
//                           <span>
//                             {Array.isArray(casinoData?.data?.data?.data?.t1) &&
//                               casinoData?.data?.data?.data?.t1?.[0]?.max}
//                           </span>
//                         </p>{" "}
//                       </div>
//                       {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                         casinoData?.data?.data?.data?.t2
//                           ?.slice(0, 4)
//                           ?.map((item, idx) => (
//                             <div
//                               className={`md:bg-gray-300 min-h-[44px] flex-col flex ${
//                                 idx == 3 ? "mb-0" : "md:mb-1"
//                               } ps-2 justify-center uppercase md:text-sm md:border-none border-b border-e border-gray-300 font-semibold text-xs md:py-1`}
//                             >
//                               <h2 className="text-xs font-semibold uppercase">
//                                 {item.nation}
//                               </h2>
//                               {/* <h2 className="text-xs font-normal flex items-center">
//                               {0}
//                             </h2> */}
//                               <div
//                                 className={
//                                   placeBet && betData.stake > 0
//                                     ? betData?.oddType === "casino_odds"
//                                       ? betData?.sid ===
//                                         (item.sid || item.sectionId)
//                                         ? betData?.oddCategory === "Back"
//                                           ? "text-green-800 mr-6"
//                                           : "text-red-600 mr-6"
//                                         : betData?.oddCategory === "Back"
//                                         ? "text-red-600 mr-6"
//                                         : "text-green-800 mr-6"
//                                       : "text-black mr-6"
//                                     : (() => {
//                                         const totalValue =
//                                           myCurrentCasinoBets?.currentCasinoBets
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.mid ==
//                                                 cardData?.mid
//                                             )
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ==
//                                                   "casino_odds" &&
//                                                 doc.exposure
//                                                   .isPreviousExposure == false
//                                             )
//                                             ?.sort(
//                                               (a, b) =>
//                                                 new Date(b.createdAt) -
//                                                 new Date(a.createdAt)
//                                             )?.[0];
//                                         return Number(
//                                           totalValue?.currentBet?.otherInfo?.[
//                                             item.sid || item.sectionId
//                                           ]
//                                         ) > 0
//                                           ? "text-green-800 mr-6"
//                                           : "text-red-600 mr-6";
//                                       })()
//                                 }
//                               >
//                                 {placeBet && betData.stake > 0
//                                   ? betData?.oddType === "casino_odds"
//                                     ? betData?.sid ===
//                                       (item.sid || item.sectionId)
//                                       ? betData?.oddCategory === "Back"
//                                         ? betData?.profit !== undefined
//                                           ? `+ ${betData?.profit}`
//                                           : null
//                                         : betData?.loss !== undefined
//                                         ? `- ${betData?.loss}`
//                                         : null
//                                       : betData?.oddCategory === "Back"
//                                       ? betData?.loss !== undefined
//                                         ? `- ${betData?.loss}`
//                                         : null
//                                       : betData?.profit !== undefined
//                                       ? `+ ${betData?.profit}`
//                                       : null
//                                     : null
//                                   : (() => {
//                                       const totalValue =
//                                         myCurrentCasinoBets?.currentCasinoBets
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.mid ==
//                                               cardData?.mid
//                                           )
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.oddType ==
//                                                 "casino_odds" &&
//                                               doc.exposure.isPreviousExposure ==
//                                                 false
//                                           )
//                                           ?.sort(
//                                             (a, b) =>
//                                               new Date(b.createdAt) -
//                                               new Date(a.createdAt)
//                                           )?.[0];
//                                       return totalValue?.currentBet
//                                         ?.otherInfo?.[
//                                         item.sid || item.sectionId
//                                       ];
//                                     })()}
//                               </div>
//                             </div>
//                           ))}
//                     </div>
//                     <div className="col-span-6 md:py-1 md:pe-1">
//                       <div className="grid grid-cols-12 md:gap-1">
//                         <div className="col-span-6 ">
//                           <div className="bg-blue-300 md:min-h-[44px] min-h-[25px] flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                             back
//                           </div>
//                           {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                             casinoData?.data?.data?.data?.t2
//                               ?.slice(0, 4)
//                               ?.map((item, idx) => (
//                                 <div
//                                   className={` ${
//                                     idx == 3 ? "mb-0" : "md:mb-1"
//                                   } bg-blue-300 relative min-h-[44px] flex md:border-none border-b border-e border-gray-300 flex-col cursor-pointer hover:bg-blue-400 md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                                 >
//                                   {/* {console.log(item)} */}
//                                   {remainingTime <= 3 ||
//                                   item.gstatus == "SUSPENDED" ? (
//                                     <>
//                                       <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                         <span className="text-white opacity-100">
//                                           <i class="ri-lock-2-fill text-xl"></i>
//                                         </span>
//                                       </div>
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       {/* <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.betName.includes(
//                                                   "Back"
//                                                 ) &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span> */}
//                                     </>
//                                   ) : (
//                                     <div
//                                       onClick={(e) => {
//                                         setPlaceBet(true);
//                                         const newBetData = {
//                                           betName: "Back " + item?.nation,
//                                           boxColor: "bg-[#B2D6F0]",
//                                           matchOdd: item?.b1,
//                                           stake: 0,
//                                           mid: cardData?.mid,
//                                           sid: item?.sid,
//                                           oddType: "casino_odds",
//                                           oddCategory: "Back",
//                                         };
//                                         setBetData(newBetData);
//                                         setLatestBetData(newBetData);
//                                       }}
//                                     >
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       {/* <span className="text-red-600 flex justify-center items-center font-normal">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.betName.includes(
//                                                   "Back"
//                                                 ) &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span> */}
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                         </div>
//                         <div className="col-span-6 ">
//                           <div className="bg-red-300 md:min-h-[44px] min-h-[25px] md:border-none border-b border-e border-t border-gray-300  flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                             Lay
//                           </div>
//                           {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                             casinoData?.data?.data?.data?.t2
//                               ?.slice(0, 4)
//                               ?.map((item, idx) => (
//                                 <div
//                                   className={` ${
//                                     idx == 3 ? "mb-0" : "md:mb-1"
//                                   } bg-red-300 relative min-h-[44px] cursor-pointer md:border-none border-b border-e border-gray-300 hover:bg-red-400 flex flex-col md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                                 >
//                                   {remainingTime <= 3 ||
//                                   item.gstatus == "SUSPENDED" ? (
//                                     <>
//                                       <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                         <span className="text-white opacity-100">
//                                           <i class="ri-lock-2-fill text-xl"></i>
//                                         </span>
//                                       </div>
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.l1}
//                                       </h1>
//                                       {/* <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.betName.includes(
//                                                   "Lay"
//                                                 ) &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span> */}
//                                     </>
//                                   ) : (
//                                     <div
//                                       onClick={(e) => {
//                                         setPlaceBet(true);
//                                         const newBetData = {
//                                           betName: "Lay " + item?.nation,
//                                           boxColor: "bg-[#FAA9BA]",
//                                           matchOdd: item?.l1,
//                                           stake: 0,
//                                           mid: cardData?.mid,
//                                           sid: item?.sid,
//                                           oddType: "casino_odds",
//                                           oddCategory: "Lay",
//                                         };
//                                         setBetData(newBetData);
//                                         setLatestBetData(newBetData);
//                                       }}
//                                     >
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.l1}
//                                       </h1>
//                                       {/* <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.betName.includes(
//                                                   "Lay"
//                                                 ) &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span> */}
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="md:col-span-6 col-span-12 border-gray-400 md:border my-1 border-1">
//                   <div className="grid grid-cols-12 md:gap-1">
//                     <div className="col-span-6 md:p-1 ">
//                       <div className="md:bg-gray-300 md:min-h-[44px] min-h-[25px] md:border-none border-b border-t  border-e border-gray-300 flex md:mb-1 items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                         <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
//                           Min:{" "}
//                           <span className="me-2">
//                             {Array.isArray(casinoData?.data?.data?.data?.t1) &&
//                               casinoData?.data?.data?.data?.t1?.[0]?.min}
//                           </span>{" "}
//                           Max:{" "}
//                           <span>
//                             {Array.isArray(casinoData?.data?.data?.data?.t1) &&
//                               casinoData?.data?.data?.data?.t1?.[0]?.max}
//                           </span>
//                         </p>{" "}
//                       </div>
//                       {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                         casinoData?.data?.data?.data?.t2
//                           ?.filter((v) => v.nation.includes("Odd"))
//                           ?.map((item, idx) => (
//                             <div
//                               className={`md:bg-gray-300 min-h-[44px] flex-col flex ${
//                                 idx == 3 ? "mb-0" : "md:mb-1"
//                               } ps-2 justify-center uppercase md:border-none border-b  border-e border-gray-300 md:text-sm font-semibold text-xs md:py-1`}
//                             >
//                               <h2 className="text-xs font-semibold uppercase">
//                                 {item.nation.replace("Odd", "")}
//                               </h2>
//                               {/* <h2 className="text-xs font-normal flex items-center">
//                               {0}
//                             </h2> */}
//                             </div>
//                           ))}
//                     </div>
//                     <div className="col-span-6 md:py-1 md:pe-1">
//                       <div className="grid grid-cols-12 md:gap-1">
//                         <div className="col-span-6 ">
//                           <div className="bg-blue-300 md:min-h-[44px] min-h-[25px] md:border-none border-b  border-e border-gray-300 flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                             Odd
//                           </div>
//                           {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                             casinoData?.data?.data?.data?.t2
//                               ?.filter((v) => v.nation.includes("Odd"))
//                               ?.map((item, idx) => (
//                                 <div
//                                   className={` ${
//                                     idx == 3 ? "mb-0" : "md:mb-1"
//                                   } bg-blue-300 relative min-h-[44px] flex flex-col cursor-pointer md:border-none border-b  border-e border-gray-300 hover:bg-blue-400 md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                                 >
//                                   {remainingTime <= 3 ||
//                                   item.gstatus == "SUSPENDED" ? (
//                                     <>
//                                       <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                         <span className="text-white opacity-100">
//                                           <i class="ri-lock-2-fill text-xl"></i>
//                                         </span>
//                                       </div>
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.mid ==
//                                                   cardData?.mid
//                                               )
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.oddType ===
//                                                     "casino_odds" &&
//                                                   doc.currentBet.betName.includes(
//                                                     "Odd"
//                                                   ) &&
//                                                   doc.currentBet.sid ===
//                                                     item?.sid
//                                               );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span>
//                                     </>
//                                   ) : (
//                                     <div
//                                       onClick={(e) => {
//                                         setPlaceBet(true);
//                                         const newBetData = {
//                                           betName: "Odd " + item?.nation,
//                                           boxColor: "bg-[#B2D6F0]",
//                                           matchOdd: item?.b1,
//                                           stake: 0,
//                                           mid: cardData?.mid,
//                                           sid: item?.sid,
//                                           oddType: "casino_odds",
//                                           oddCategory: "",
//                                         };
//                                         setBetData(newBetData);
//                                         setLatestBetData(newBetData);
//                                       }}
//                                     >
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       <span className="text-red-600 flex justify-center items-center font-normal">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.mid ==
//                                                   cardData?.mid
//                                               )
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.oddType ===
//                                                     "casino_odds" &&
//                                                   doc.currentBet.betName.includes(
//                                                     "Odd"
//                                                   ) &&
//                                                   doc.currentBet.sid ===
//                                                     item?.sid
//                                               );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                         </div>
//                         <div className="col-span-6 ">
//                           <div className="bg-blue-300 md:min-h-[44px] min-h-[25px] md:border-none border-b  flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs py-1">
//                             Even
//                           </div>
//                           {Array.isArray(casinoData?.data?.data?.data?.t2) &&
//                             casinoData?.data?.data?.data?.t2
//                               ?.filter((v) => v.nation.includes("Even"))
//                               ?.map((item, idx) => (
//                                 <div
//                                   className={` ${
//                                     idx == 3 ? "mb-0" : "md:mb-1"
//                                   } bg-blue-300 relative min-h-[44px] cursor-pointer hover:bg-blue-400 border-b  flex flex-col md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs py-1`}
//                                 >
//                                   {remainingTime <= 3 ||
//                                   item.gstatus == "SUSPENDED" ? (
//                                     <>
//                                       <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                         <span className="text-white opacity-100">
//                                           <i class="ri-lock-2-fill text-xl"></i>
//                                         </span>
//                                       </div>
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.mid ==
//                                                   cardData?.mid
//                                               )
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.oddType ===
//                                                     "casino_odds" &&
//                                                   doc.currentBet.betName.includes(
//                                                     "Even"
//                                                   ) &&
//                                                   doc.currentBet.sid ===
//                                                     item?.sid
//                                               );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span>
//                                     </>
//                                   ) : (
//                                     <div
//                                       onClick={(e) => {
//                                         setPlaceBet(true);
//                                         const newBetData = {
//                                           betName: "Even " + item?.nation,
//                                           boxColor: "bg-[#B2D6F0]",
//                                           matchOdd: item?.b1,
//                                           stake: 0,
//                                           mid: cardData?.mid,
//                                           sid: item?.sid,
//                                           oddType: "casino_odds",
//                                           oddCategory: "",
//                                         };
//                                         setBetData(newBetData);
//                                         setLatestBetData(newBetData);
//                                       }}
//                                     >
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       <span className="text-red-600 flex justify-center items-center font-normal">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.mid ==
//                                                   cardData?.mid
//                                               )
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.oddType ===
//                                                     "casino_odds" &&
//                                                   doc.currentBet.betName.includes(
//                                                     "Even"
//                                                   ) &&
//                                                   doc.currentBet.sid ===
//                                                     item?.sid
//                                               );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* mid */}
//               {Array?.isArray(casinoData?.data?.data?.data?.t2) && (
//                 <div className="grid grid-cols-12 gap-2">
//                   <div className="md:col-span-6 col-span-12 border-gray-400 md:border my-1 border-1">
//                     <div className="grid grid-cols-12 md:gap-1">
//                       <div className="col-span-6 md:p-1 ">
//                         <div className="md:bg-gray-300 md:min-h-[44px] min-h-[25px] md:border-none border-b border-t border-e border-gray-300 flex md:mb-1 items-center uppercase md:text-sm font-semibold text-xs py-1">
//                           <p className="font-semibold  md:hidden block mx-2 capitalize text-[10px]">
//                             Min:{" "}
//                             <span className="me-2">
//                               {casinoData?.data?.data?.data?.t1?.[0]?.min}
//                             </span>{" "}
//                             Max:{" "}
//                             <span>
//                               {casinoData?.data?.data?.data?.t1?.[0]?.max}
//                             </span>
//                           </p>{" "}
//                         </div>
//                         {casinoData?.data?.data?.data?.t2
//                           ?.filter(
//                             (v) =>
//                               v.nation.includes("Black") ||
//                               v.nation.includes("Red")
//                           )
//                           ?.map((item, idx) => (
//                             <div
//                               className={`md:bg-gray-300 min-h-[44px] md:border-none border-b border-e border-gray-300 flex-col flex ${
//                                 idx == 3 ? "mb-0" : "md:mb-1"
//                               } ps-2 justify-center uppercase md:text-sm font-semibold text-xs py-1`}
//                             >
//                               <h2 className="text-xs font-semibold uppercase">
//                                 {item.nation}
//                               </h2>
//                               {/* <h2 className="text-xs font-normal flex items-center">
//                               {0}
//                             </h2> */}
//                               <div
//                                 className={
//                                   placeBet && betData.stake > 0
//                                     ? betData?.oddType === "casino_odds"
//                                       ? betData?.sid ===
//                                         (item.sid || item.sectionId)
//                                         ? betData?.oddCategory === "Back"
//                                           ? "text-green-800 mr-6"
//                                           : "text-red-600 mr-6"
//                                         : betData?.oddCategory === "Back"
//                                         ? "text-red-600 mr-6"
//                                         : "text-green-800 mr-6"
//                                       : "text-black mr-6"
//                                     : (() => {
//                                         const totalValue =
//                                           myCurrentCasinoBets?.currentCasinoBets
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.mid ==
//                                                 cardData?.mid
//                                             )
//                                             ?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ==
//                                                   "casino_odds" &&
//                                                 doc.exposure
//                                                   .isPreviousExposure == false
//                                             )
//                                             ?.sort(
//                                               (a, b) =>
//                                                 new Date(b.createdAt) -
//                                                 new Date(a.createdAt)
//                                             )?.[0];
//                                         return Number(
//                                           totalValue?.currentBet?.otherInfo?.[
//                                             item.sid || item.sectionId
//                                           ]
//                                         ) > 0
//                                           ? "text-green-800 mr-6"
//                                           : "text-red-600 mr-6";
//                                       })()
//                                 }
//                               >
//                                 {placeBet && betData.stake > 0
//                                   ? betData?.oddType === "casino_odds"
//                                     ? betData?.sid ===
//                                       (item.sid || item.sectionId)
//                                       ? betData?.oddCategory === "Back"
//                                         ? betData?.profit !== undefined
//                                           ? `+ ${betData?.profit}`
//                                           : null
//                                         : betData?.loss !== undefined
//                                         ? `- ${betData?.loss}`
//                                         : null
//                                       : betData?.oddCategory === "Back"
//                                       ? betData?.loss !== undefined
//                                         ? `- ${betData?.loss}`
//                                         : null
//                                       : betData?.profit !== undefined
//                                       ? `+ ${betData?.profit}`
//                                       : null
//                                     : null
//                                   : (() => {
//                                       const totalValue =
//                                         myCurrentCasinoBets?.currentCasinoBets
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.mid ==
//                                               cardData?.mid
//                                           )
//                                           ?.filter(
//                                             (doc) =>
//                                               doc.currentBet.oddType ==
//                                                 "casino_odds" &&
//                                               doc.exposure.isPreviousExposure ==
//                                                 false
//                                           )
//                                           ?.sort(
//                                             (a, b) =>
//                                               new Date(b.createdAt) -
//                                               new Date(a.createdAt)
//                                           )?.[0];
//                                       return totalValue?.currentBet
//                                         ?.otherInfo?.[
//                                         item.sid || item.sectionId
//                                       ];
//                                     })()}
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                       <div className="col-span-6 md:py-1 md:pe-1">
//                         <div className="grid grid-cols-12 md:gap-1">
//                           <div className="col-span-6 ">
//                             <div className="bg-blue-300 md:min-h-[44px] min-h-[25px] md:border-none border-b border-e border-gray-300 flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                               Back
//                             </div>
//                             {casinoData?.data?.data?.data?.t2
//                               ?.filter(
//                                 (v) =>
//                                   v.nation.includes("Black") ||
//                                   v.nation.includes("Red")
//                               )
//                               ?.map((item, idx) => (
//                                 <div
//                                   className={` ${
//                                     idx == 3 ? "mb-0" : "md:mb-1"
//                                   } bg-blue-300 relative min-h-[44px] flex flex-col cursor-pointer border-b border-e hover:bg-blue-400 md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs py-1`}
//                                 >
//                                   {remainingTime <= 3 ||
//                                   item.gstatus == "SUSPENDED" ? (
//                                     <>
//                                       <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                         <span className="text-white opacity-100">
//                                           <i class="ri-lock-2-fill text-xl"></i>
//                                         </span>
//                                       </div>
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                     </>
//                                   ) : (
//                                     <div
//                                       onClick={(e) => {
//                                         setPlaceBet(true);
//                                         const newBetData = {
//                                           betName: "Back " + item?.nation,
//                                           boxColor: "bg-[#B2D6F0]",
//                                           matchOdd: item?.l1,
//                                           stake: 0,
//                                           mid: cardData?.mid,
//                                           sid: item?.sid,
//                                           oddType: "casino_odds",
//                                           oddCategory: "Back",
//                                         };
//                                         setBetData(newBetData);
//                                         setLatestBetData(newBetData);
//                                       }}
//                                     >
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.b1}
//                                       </h1>
//                                       <span className="text-red-600 flex justify-center items-center font-normal">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.mid ==
//                                                   cardData?.mid
//                                               )
//                                               ?.filter(
//                                                 (doc) =>
//                                                   doc.currentBet.oddType ===
//                                                     "casino_odds" &&
//                                                   doc.currentBet.betName.includes(
//                                                     "Back"
//                                                   ) &&
//                                                   doc.currentBet.sid ===
//                                                     item?.sid
//                                               );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span>
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                           </div>
//                           <div className="col-span-6 ">
//                             <div className="bg-red-300 md:min-h-[44px] min-h-[25px] md:border-none border-b border-e border-gray-300 flex md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                               Lay
//                             </div>
//                             {casinoData?.data?.data?.data?.t2
//                               ?.filter(
//                                 (v) =>
//                                   v.nation.includes("Black") ||
//                                   v.nation.includes("Red")
//                               )
//                               ?.map((item, idx) => (
//                                 <div
//                                   className={` ${
//                                     idx == 3 ? "mb-0" : "md:mb-1"
//                                   } bg-red-300 relative min-h-[44px] cursor-pointer hover:bg-red-400 flex flex-col md:border-none border-b border-e border-gray-300 md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                                 >
//                                   {remainingTime <= 3 ||
//                                   item.gstatus == "SUSPENDED" ? (
//                                     <>
//                                       <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                         <span className="text-white opacity-100">
//                                           <i class="ri-lock-2-fill text-xl"></i>
//                                         </span>
//                                       </div>
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.l1}
//                                       </h1>
//                                       {/* <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.betName.includes(
//                                                   "Lay"
//                                                 ) &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span> */}
//                                     </>
//                                   ) : (
//                                     <div
//                                       onClick={(e) => {
//                                         setPlaceBet(true);
//                                         const newBetData = {
//                                           betName: "Lay " + item?.nation,
//                                           boxColor: "bg-[#FAA9BA]",
//                                           matchOdd: item?.l1,
//                                           stake: 0,
//                                           mid: cardData?.mid,
//                                           sid: item?.sid,
//                                           oddType: "casino_odds",
//                                           oddCategory: "Lay",
//                                         };
//                                         setBetData(newBetData);
//                                         setLatestBetData(newBetData);
//                                       }}
//                                     >
//                                       <h1 className="font-semibold flex justify-center items-center text-sm">
//                                         {" "}
//                                         {item.l1}
//                                       </h1>
//                                       {/* <span className="text-red-600 flex justify-center items-center font-normal">
//                                         {(() => {
//                                           const filteredBets =
//                                             myCurrentCasinoBets?.currentCasinoBets?.filter(
//                                               (doc) =>
//                                                 doc.currentBet.oddType ===
//                                                   "casino_odds" &&
//                                                 doc.currentBet.betName.includes(
//                                                   "Lay"
//                                                 ) &&
//                                                 doc.currentBet.sid === item?.sid
//                                             );
//                                           return filteredBets?.length
//                                             ? filteredBets.reduce(
//                                                 (acc, doc) =>
//                                                   acc +
//                                                   Number(doc.currentBet.stake),
//                                                 0
//                                               ) * -1
//                                             : null;
//                                         })()}
//                                       </span> */}
//                                     </div>
//                                   )}
//                                 </div>
//                               ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="md:col-span-6 h-fit col-span-12 border-gray-400 md:border md:my-1 border-1">
//                     <div className=" md:min-h-[50px] min-h-[25px] border-b border-t border-gray-300 flex justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1">
//                       <div className="md:w-full md:mx-1 w-[50%] md:py-3 py-2 bg-blue-300 flex justify-center ms-auto items-center">
//                         Back
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-12 shadow-sm md:shadow-none md:gap-1">
//                       <div className="col-span-6 md:p-1 ">
//                         {casinoData?.data?.data?.data?.t2
//                           ?.filter((v) => v.nation.includes("Total"))
//                           ?.map((item, idx) => (
//                             <div
//                               className={`md:bg-gray-300 min-h-[44px] md:border-none border-b border-t border-e border-gray-300 flex-col flex ${
//                                 idx == 3 ? "mb-0" : "md:mb-1"
//                               } ps-2 justify-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                             >
//                               <h2 className="text-xs font-semibold uppercase">
//                                 {item.nation}
//                               </h2>
//                               {/* <h2 className="text-xs font-normal flex items-center">
//                               {0}
//                             </h2> */}
//                             </div>
//                           ))}
//                       </div>
//                       <div className="col-span-6 md:py-1 md:pe-1">
//                         <div className="col-span-6">
//                           {casinoData?.data?.data?.data?.t2
//                             ?.filter((v) => v.nation.includes("Total"))
//                             ?.map((item, idx) => (
//                               <div
//                                 className={` ${
//                                   idx == 3 ? "mb-0" : "md:mb-1"
//                                 } bg-blue-300 relative min-h-[44px] flex md:border-none border-b border-t border-e border-gray-300 flex-col cursor-pointer hover:bg-blue-400 md:mb-1 justify-center items-center uppercase md:text-sm font-semibold text-xs md:py-1`}
//                               >
//                                 {remainingTime <= 3 ||
//                                 item.gstatus == "SUSPENDED" ? (
//                                   <>
//                                     <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-start font-bold uppercase z-10">
//                                       <span className="text-white opacity-100">
//                                         <i class="ri-lock-2-fill text-xl"></i>
//                                       </span>
//                                     </div>
//                                     <h1 className="font-semibold flex justify-center items-center text-sm">
//                                       {" "}
//                                       {item.b1}
//                                     </h1>
//                                     <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
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
//                                   </>
//                                 ) : (
//                                   <div
//                                     onClick={(e) => {
//                                       setPlaceBet(true);
//                                       const newBetData = {
//                                         betName: item?.nation,
//                                         boxColor: "bg-[#B2D6F0]",
//                                         matchOdd: item?.b1,
//                                         stake: 0,
//                                         mid: cardData?.mid,
//                                         sid: item?.sid,
//                                         oddType: "casino_odds",
//                                         oddCategory: "",
//                                       };
//                                       setBetData(newBetData);
//                                       setLatestBetData(newBetData);
//                                     }}
//                                   >
//                                     <h1 className="font-semibold flex justify-center items-center text-sm">
//                                       {item.b1}
//                                     </h1>
//                                     <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
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
//                                 )}
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="col-span-12 relative mt-1 mb-5">
//                     <div className="md:bg-gray-300 min-h-[34px] flex md:border-none border border-t border-1 border-gray-400 justify-center items-center uppercase md:text-sm font-semibold text-xs py-1">
//                       <h1 className="flex justify-center items-center font-semibold my-1">
//                         0
//                       </h1>
//                     </div>

//                     <div className="grid grid-cols-10 md:gap-1">
//                       {casinoData?.data?.data?.data?.t2
//                         ?.filter((v) => v.nation.includes("Single"))
//                         ?.map((item) => (
//                           <div key={item.sid} className="col-span-2 relative">
//                             {remainingTime <= 3 ||
//                             item.gstatus == "SUSPENDED" ? (
//                               <>
//                                 <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                   <span className="text-white opacity-100">
//                                     <i class="ri-lock-2-fill text-xl"></i>
//                                   </span>
//                                 </div>
//                                 <div className="bg-blue-300 flex-col md:pt-1  border-b border-e  justify-center min-h-[84px] flex items-center uppercase md:text-sm font-semibold text-xs py-1">
//                                   <h1 className="font-casino text-5xl font-light">
//                                     {item.nation.replace("Single", "")}
//                                   </h1>
//                                   <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
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
//                               </>
//                             ) : (
//                               <div
//                                 onClick={(e) => {
//                                   setPlaceBet(true);
//                                   const newBetData = {
//                                     betName: item?.nation,
//                                     boxColor: "bg-[#B2D6F0]",
//                                     matchOdd: item?.b1,
//                                     stake: 0,
//                                     mid: cardData?.mid,
//                                     sid: item?.sid,
//                                     oddType: "casino_odds",
//                                     oddCategory: "",
//                                   };
//                                   setBetData(newBetData);
//                                   setLatestBetData(newBetData);
//                                 }}
//                                 className="bg-blue-300 flex-col md:pt-1 border-b border-e hover:bg-blue-400 cursor-pointer justify-center min-h-[84px] flex md:mb-1 items-center uppercase md:text-sm font-semibold text-xs py-1"
//                               >
//                                 <h1 className="font-casino text-5xl font-light">
//                                   {item.nation.replace("Single", "")}
//                                 </h1>
//                                 <span className="text-red-600 flex justify-center items-end font-bold z-[11]">
//                                   {(() => {
//                                     const filteredBets =
//                                       myCurrentCasinoBets?.currentCasinoBets
//                                         ?.filter(
//                                           (doc) =>
//                                             doc.currentBet.mid == cardData?.mid
//                                         )
//                                         ?.filter(
//                                           (doc) =>
//                                             doc.currentBet.oddType ===
//                                               "casino_odds" &&
//                                             doc.currentBet.sid === item?.sid
//                                         );
//                                     return filteredBets?.length
//                                       ? filteredBets.reduce(
//                                           (acc, doc) =>
//                                             acc + Number(doc.currentBet.stake),
//                                           0
//                                         ) * -1
//                                       : null;
//                                   })()}
//                                 </span>
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//             {/* result start */}
//             <div className="casino-last-result-title">
//               <span>Last Result</span>
//               <span>
//                 <Link
//                   to="/reports/casino-results"
//                   className="cursor-pointer"
//                   state={{
//                     casinoGameSlug: item?.slug,
//                   }}
//                 >
//                   View All
//                 </Link>
//               </span>
//             </div>
//             {isModalOpen && (
//               <div className="fixed inset-0 flex items-center justify-center z-50">
//                 <div
//                   className="absolute inset-0 bg-gray-900 opacity-50"
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
//                   {/* {console.log(individualResultData)} */}
//                   {individualResultData ? (
//                     <div className="my-3 w-full ">
//                       <div>
//                         <h4 className=" flex justify-end items-center text-sm font-semibold px-2">
//                           Round Id:{individualResultData?.mid}
//                         </h4>
//                       </div>
//                       <div className="grid grid-cols-1 place-items-center my-4">
//                         <div className="col-span-1 w-full place-items-start relative">
//                           <div className="flex flex-col gap-2 items-center justify-center">
//                             {individualResultData?.cards
//                               ?.split(",")
//                               ?.slice(0, 8)
//                               ?.map((item, index) => (
//                                 <div className="flex justify-center relative items-center gap-2">
//                                   {/* {console.log(item)} */}
//                                   {index < 4 && (
//                                     <>
//                                       <h1> {`Player ${index + 8} :`}</h1>

//                                       <img
//                                         className="md:h-[54px] h-[34px] "
//                                         src={
//                                           cardsData.find((v) => v.code == item)
//                                             .image
//                                         }
//                                       />
//                                       {getResultText(
//                                         individualResultData?.win
//                                       ) ==
//                                         index + 8 && (
//                                         <div className="absolute text-success text-2xl -right-10 top-1/3 animate-bounce">
//                                           <FontAwesomeIcon
//                                             style={{ color: "green" }}
//                                             icon={faTrophy}
//                                           />
//                                         </div>
//                                       )}
//                                     </>
//                                   )}
//                                 </div>
//                               ))}
//                           </div>
//                         </div>
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
//             <div className="casino-last-results">
//               {casinoData?.data?.data?.result ? (
//                 casinoData?.data?.data?.result?.map((item, index) => (
//                   <span
//                     key={index}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       setIsModalOpen(true);
//                       casinoIndividualResult(cookies, item.mid).then((res) => {
//                         setIndividualResultData(res?.data?.data?.[0]);
//                       });
//                     }}
//                     className={`result cursor-pointer ${
//                       item.result == 1 ? "result-a" : "result-b"
//                     }`}
//                   >
//                     {getResultText(item.result)}
//                   </span>
//                 ))
//               ) : (
//                 <>
//                   <span className="result result-b">T</span>
//                   <span className="result result-a">D</span>
//                 </>
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
//                   time={remainingTime}
//                   gameType="casino"
//                   gameName={item?.slug}
//                   item={item}
//                   odds={casinoData?.data?.data?.data?.t2?.filter(
//                     (doc) => doc.gtype == "card32eu"
//                   )}
//                   refetchCurrentBets={refetchCurrentBets}
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
//           <div className="absolute top-0 inset-0  bg-gray-900 opacity-50"></div>

//           <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
//             <CasinoMobileBetPopup
//               time={remainingTime}
//               gameType="casino"
//               gameName={item?.slug}
//               item={item}
//               odds={casinoData?.data?.data?.data?.t2?.filter(
//                 (doc) => doc.gtype == "card32eu"
//               )}
//               refetchCurrentBets={refetchCurrentBets}
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

// export default Cards32b;

import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import useCountdown from "../../hook/useCountdown";
import {
  // casinoGameOdds,
  // casinoGameTopTenResult,
  casinoIndividualResult,
} from "../../helpers/casino";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import cardsData from "../../assets/cards/data";
import Timer from "../common/Timer";
import PlayerOdds from "../common/PlayerOdds";
import PlaceBet from "../common/PlaceBet";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import useScrollFixed from "../../hook/useFixed";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import cricketBall from "../../assets/Cricket_ball.svg";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";

const Cards32b = ({
  myCurrentCasinoBets,
  refetchCurrentBets,
  refetchCasinoBetHistory,
  CasinoBetHistory,
  casinoSpecialPermission,
  casinoData,
}) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  console.log("my card b", casinoData);

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
        return "8";
      case "2":
        return "9";
      case "3":
        return "10";
      case "4":
        return "11";
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
            <div className="md:block hidden">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t2?.[0]?.min}
                max={casinoData?.data?.data?.data?.t2?.[0]?.max}
                mid={cardData?.mid}
              />
            </div>
            <div className="casino-video">
              <Frame item={item} />

              {/* card */}

              <div className="absolute top-0 left-1">
                <div>
                  <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
                    Player 8
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C1}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(0, 1)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(0, 1)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(0, 1)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                  <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
                    Player 9
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C2}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(1, 2)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(1, 2)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(1, 2)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                  <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
                    Player 10
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C3}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(2, 3)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(2, 3)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(2, 3)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                  <h1 className="md:text-xs text-[8px] uppercase font-semibold text-white">
                    Player 11
                    <span className="text-yellow-300 md:mx-1 mx-0">
                      {" "}
                      : {cardData?.C4}
                    </span>
                  </h1>
                  {cardData?.desc &&
                    cardData?.desc
                      ?.split(",")
                      ?.slice(3, 4)
                      ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                      <img
                        src={cardData?.desc
                          ?.split(",")
                          ?.slice(3, 4)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.image
                          )}
                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                        alt={cardData?.desc
                          ?.split(",")
                          ?.slice(3, 4)
                          ?.map(
                            (i) => cardsData?.find((c) => c.code == i)?.name
                          )}
                      />
                    )}
                </div>
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* NEW TABLE PART WITH HTML STRUCTURE - ONLY DESIGN CHANGED */}
            <div className="cards32b casino-detail">
              <div className="casino-table">
                {/* First Table Box - Players Back/Lay and Odd/Even */}
                <div className="casino-table-box">
                  {/* Left Box - Players 8,9,10,11 Back/Lay */}
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.slice(0, 4)
                          ?.map((item, idx) => (
                            <div className="casino-table-row" key={item.sid}>
                              <div className="casino-nation-detail">
                                <div className="casino-nation-name">
                                  {item.nation}
                                </div>
                                {/* Exposure Display - Your Original Logic */}
                                <div
                                  className={
                                    placeBet && betData.stake > 0
                                      ? betData?.oddType === "casino_odds"
                                        ? betData?.sid ===
                                          (item.sid || item.sectionId)
                                          ? betData?.oddCategory === "Back"
                                            ? "text-green-800 mr-6"
                                            : "text-red-600 mr-6"
                                          : betData?.oddCategory === "Back"
                                          ? "text-red-600 mr-6"
                                          : "text-green-800 mr-6"
                                        : "text-black mr-6"
                                      : (() => {
                                          const totalValue =
                                            myCurrentCasinoBets?.currentCasinoBets
                                              ?.filter(
                                                (doc) =>
                                                  doc.currentBet.mid ==
                                                  cardData?.mid
                                              )
                                              ?.filter(
                                                (doc) =>
                                                  doc.currentBet.oddType ==
                                                    "casino_odds" &&
                                                  doc.exposure
                                                    .isPreviousExposure == false
                                              )
                                              ?.sort(
                                                (a, b) =>
                                                  new Date(b.createdAt) -
                                                  new Date(a.createdAt)
                                              )?.[0];
                                          return Number(
                                            totalValue?.currentBet?.otherInfo?.[
                                              item.sid || item.sectionId
                                            ]
                                          ) > 0
                                            ? "text-green-800 mr-6"
                                            : "text-red-600 mr-6";
                                        })()
                                  }
                                >
                                  {placeBet && betData.stake > 0
                                    ? betData?.oddType === "casino_odds"
                                      ? betData?.sid ===
                                        (item.sid || item.sectionId)
                                        ? betData?.oddCategory === "Back"
                                          ? betData?.profit !== undefined
                                            ? `+ ${betData?.profit}`
                                            : null
                                          : betData?.loss !== undefined
                                          ? `- ${betData?.loss}`
                                          : null
                                        : betData?.oddCategory === "Back"
                                        ? betData?.loss !== undefined
                                          ? `- ${betData?.loss}`
                                          : null
                                        : betData?.profit !== undefined
                                        ? `+ ${betData?.profit}`
                                        : null
                                      : null
                                    : (() => {
                                        const totalValue =
                                          myCurrentCasinoBets?.currentCasinoBets
                                            ?.filter(
                                              (doc) =>
                                                doc.currentBet.mid ==
                                                cardData?.mid
                                            )
                                            ?.filter(
                                              (doc) =>
                                                doc.currentBet.oddType ==
                                                  "casino_odds" &&
                                                doc.exposure
                                                  .isPreviousExposure == false
                                            )
                                            ?.sort(
                                              (a, b) =>
                                                new Date(b.createdAt) -
                                                new Date(a.createdAt)
                                            )?.[0];
                                        return totalValue?.currentBet
                                          ?.otherInfo?.[
                                          item.sid || item.sectionId
                                        ];
                                      })()}
                                </div>
                              </div>
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ||
                                  item.b1 === "0"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.b1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Back " + item?.nation,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: item?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">{item.b1}</span>
                              </div>
                              <div
                                className={`casino-odds-box lay ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ||
                                  item.l1 === "0"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.l1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Lay " + item?.nation,
                                      boxColor: "bg-[#FAA9BA]",
                                      matchOdd: item?.l1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Lay",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">{item.l1}</span>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="casino-table-box-divider" />

                  {/* Right Box - Odd/Even */}
                  {/* Right Box - Odd/Even */}
                  <div className="casino-table-right-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Odd</div>
                      <div className="casino-odds-box back">Even</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        // Get unique player names for Odd/Even - Players 8,9,10,11
                        ["Player 8", "Player 9", "Player 10", "Player 11"]?.map(
                          (playerName) => {
                            const oddItem =
                              casinoData?.data?.data?.data?.t2?.find(
                                (v) => v.nation === `${playerName} Odd`
                              );

                            const evenItem =
                              casinoData?.data?.data?.data?.t2?.find(
                                (v) => v.nation === `${playerName} Even`
                              );

                            return (
                              <div
                                className="casino-table-row"
                                key={playerName}
                              >
                                <div className="casino-nation-detail">
                                  <div className="casino-nation-name">
                                    {playerName}
                                  </div>
                                </div>

                                {/* Odd Column */}
                                <div
                                  className={`casino-odds-box back ${
                                    remainingTime <= 3 ||
                                    oddItem?.gstatus === "SUSPENDED" ||
                                    oddItem?.b1 === "0"
                                      ? "suspended-box"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (
                                      !oddItem ||
                                      remainingTime <= 3 ||
                                      oddItem.gstatus === "SUSPENDED" ||
                                      oddItem.b1 === "0"
                                    )
                                      return;
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: oddItem?.nation,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: oddItem?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: oddItem?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <span className="casino-odds">
                                    {oddItem?.b1 || "0"}
                                  </span>
                                </div>

                                {/* Even Column */}
                                <div
                                  className={`casino-odds-box back ${
                                    remainingTime <= 3 ||
                                    evenItem?.gstatus === "SUSPENDED" ||
                                    evenItem?.b1 === "0"
                                      ? "suspended-box"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    if (
                                      !evenItem ||
                                      remainingTime <= 3 ||
                                      evenItem.gstatus === "SUSPENDED" ||
                                      evenItem.b1 === "0"
                                    )
                                      return;
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: evenItem?.nation,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: evenItem?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: evenItem?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }}
                                >
                                  <span className="casino-odds">
                                    {evenItem?.b1 || "0"}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                </div>

                {/* Second Table Box - Color Bets and Totals */}
                <div className="casino-table-box mt-3">
                  <div className="casino-table-left-box">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Back</div>
                      <div className="casino-odds-box lay">Lay</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.filter(
                            (v) =>
                              v.nation.includes("Black") ||
                              v.nation.includes("Red") ||
                              v.nation.includes("Two Black Two Red")
                          )
                          ?.map((item, idx) => (
                            <div className="casino-table-row" key={item.sid}>
                              <div className="casino-nation-detail">
                                <div className="casino-nation-name">
                                  {item.nation}
                                </div>
                                {/* Exposure Display - Your Original Logic */}
                                <div
                                  className={
                                    placeBet && betData.stake > 0
                                      ? betData?.oddType === "casino_odds"
                                        ? betData?.sid ===
                                          (item.sid || item.sectionId)
                                          ? betData?.oddCategory === "Back"
                                            ? "text-green-800 mr-6"
                                            : "text-red-600 mr-6"
                                          : betData?.oddCategory === "Back"
                                          ? "text-red-600 mr-6"
                                          : "text-green-800 mr-6"
                                        : "text-black mr-6"
                                      : (() => {
                                          const totalValue =
                                            myCurrentCasinoBets?.currentCasinoBets
                                              ?.filter(
                                                (doc) =>
                                                  doc.currentBet.mid ==
                                                  cardData?.mid
                                              )
                                              ?.filter(
                                                (doc) =>
                                                  doc.currentBet.oddType ==
                                                    "casino_odds" &&
                                                  doc.exposure
                                                    .isPreviousExposure == false
                                              )
                                              ?.sort(
                                                (a, b) =>
                                                  new Date(b.createdAt) -
                                                  new Date(a.createdAt)
                                              )?.[0];
                                          return Number(
                                            totalValue?.currentBet?.otherInfo?.[
                                              item.sid || item.sectionId
                                            ]
                                          ) > 0
                                            ? "text-green-800 mr-6"
                                            : "text-red-600 mr-6";
                                        })()
                                  }
                                >
                                  {placeBet && betData.stake > 0
                                    ? betData?.oddType === "casino_odds"
                                      ? betData?.sid ===
                                        (item.sid || item.sectionId)
                                        ? betData?.oddCategory === "Back"
                                          ? betData?.profit !== undefined
                                            ? `+ ${betData?.profit}`
                                            : null
                                          : betData?.loss !== undefined
                                          ? `- ${betData?.loss}`
                                          : null
                                        : betData?.oddCategory === "Back"
                                        ? betData?.loss !== undefined
                                          ? `- ${betData?.loss}`
                                          : null
                                        : betData?.profit !== undefined
                                        ? `+ ${betData?.profit}`
                                        : null
                                      : null
                                    : (() => {
                                        const totalValue =
                                          myCurrentCasinoBets?.currentCasinoBets
                                            ?.filter(
                                              (doc) =>
                                                doc.currentBet.mid ==
                                                cardData?.mid
                                            )
                                            ?.filter(
                                              (doc) =>
                                                doc.currentBet.oddType ==
                                                  "casino_odds" &&
                                                doc.exposure
                                                  .isPreviousExposure == false
                                            )
                                            ?.sort(
                                              (a, b) =>
                                                new Date(b.createdAt) -
                                                new Date(a.createdAt)
                                            )?.[0];
                                        return totalValue?.currentBet
                                          ?.otherInfo?.[
                                          item.sid || item.sectionId
                                        ];
                                      })()}
                                </div>
                              </div>
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ||
                                  item.b1 === "0"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.b1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Back " + item?.nation,
                                      boxColor: "bg-[#72bbef]",
                                      matchOdd: item?.b1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Back",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">{item.b1}</span>
                              </div>
                              <div
                                className={`casino-odds-box lay ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ||
                                  item.l1 === "0"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (
                                    item.l1 !== "0" &&
                                    remainingTime > 3 &&
                                    item.gstatus !== "SUSPENDED"
                                  ) {
                                    setPlaceBet(true);
                                    const newBetData = {
                                      betName: "Lay " + item?.nation,
                                      boxColor: "bg-[#FAA9BA]",
                                      matchOdd: item?.l1,
                                      stake: 0,
                                      mid: cardData?.mid,
                                      sid: item?.sid,
                                      oddType: "casino_odds",
                                      oddCategory: "Lay",
                                    };
                                    setBetData(newBetData);
                                    setLatestBetData(newBetData);
                                  }
                                }}
                              >
                                <span className="casino-odds">{item.l1}</span>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="casino-table-box-divider" />

                  {/* Totals Section */}
                  <div className="casino-table-right-box cards32total">
                    <div className="casino-table-header">
                      <div className="casino-nation-detail" />
                      <div className="casino-odds-box back">Back</div>
                    </div>
                    <div className="casino-table-body">
                      {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                        casinoData?.data?.data?.data?.t2
                          ?.filter((v) => v.nation.includes("Total"))
                          ?.map((item, idx) => (
                            <div className="casino-table-row" key={item.sid}>
                              <div className="casino-nation-detail">
                                <div className="casino-nation-name">
                                  {item.nation}
                                </div>
                              </div>
                              <div
                                className={`casino-odds-box back ${
                                  remainingTime <= 3 ||
                                  item.gstatus === "SUSPENDED" ||
                                  item.b1 === "0"
                                    ? "suspended-box"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (
                                    remainingTime <= 3 ||
                                    item.gstatus === "SUSPENDED" ||
                                    item.b1 === "0"
                                  )
                                    return;
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nation,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: item?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }}
                              >
                                <span className="casino-odds">{item.b1}</span>
                              </div>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>

                {/* Numbers Section */}
                <div className="casino-table-full-box mt-3 card32numbers">
                  <h4 className="w-100 text-center mb-2">
                    <b>
                      {Array.isArray(casinoData?.data?.data?.data?.t2)
                        ? casinoData.data.data.data.t2.find((v) =>
                            v.nation.includes("Single")
                          )?.b1 || "0"
                        : "0"}
                    </b>
                  </h4>
                  <div className="card32numbers-container">
                    {Array.isArray(casinoData?.data?.data?.data?.t2) &&
                      casinoData?.data?.data?.data?.t2
                        ?.filter((v) => v.nation.includes("Single"))
                        ?.sort((a, b) => {
                          // Sort numbers in correct order: 1,2,3,4,5,6,7,8,9,0
                          const numA =
                            parseInt(a.nation.replace("Single", "")) || 0;
                          const numB =
                            parseInt(b.nation.replace("Single", "")) || 0;
                          return numA - numB;
                        })
                        ?.map((item) => (
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 ||
                              item.gstatus === "SUSPENDED" ||
                              item.b1 === "0"
                                ? "suspended-box"
                                : ""
                            }`}
                            key={item.sid}
                            onClick={() => {
                              if (
                                remainingTime <= 3 ||
                                item.gstatus === "SUSPENDED" ||
                                item.b1 === "0"
                              )
                                return;
                              setPlaceBet(true);
                              const newBetData = {
                                betName: item?.nation,
                                boxColor: "bg-[#72bbef]",
                                matchOdd: item?.b1,
                                stake: 0,
                                mid: cardData?.mid,
                                sid: item?.sid,
                                oddType: "casino_odds",
                                oddCategory: "",
                              };
                              setBetData(newBetData);
                              setLatestBetData(newBetData);
                            }}
                          >
                            <span className="casino-odds">
                              {item.nation.replace("Single", "")}
                            </span>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rest of your existing code for results */}
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
                      <div className="grid grid-cols-1 place-items-center my-4">
                        <div className="col-span-1 w-full place-items-start relative">
                          <div className="flex flex-col gap-2 items-center justify-center">
                            {individualResultData?.cards
                              ?.split(",")
                              ?.slice(0, 8)
                              ?.map((item, index) => (
                                <div className="flex justify-center relative items-center gap-2">
                                  {index < 4 && (
                                    <>
                                      <h1> {`Player ${index + 8} :`}</h1>
                                      <img
                                        className="md:h-[54px] h-[34px] "
                                        src={
                                          cardsData.find((v) => v.code == item)
                                            .image
                                        }
                                      />
                                      {getResultText(
                                        individualResultData?.win
                                      ) ==
                                        index + 8 && (
                                        <div className="absolute text-success text-2xl -right-10 top-1/3 animate-bounce">
                                          <FontAwesomeIcon
                                            style={{ color: "green" }}
                                            icon={faTrophy}
                                          />
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              ))}
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
                    </div>
                  ) : (
                    <div className="w-full h-full flex justify-center items-center my-4">
                      <i className="fa fa-spinner fa-spin"/>
                    </div>
                  )}
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
                <>
                  <span className="result result-b">T</span>
                  <span className="result result-a">D</span>
                </>
              )}
            </div>
            {/* result end */}
          </div>

          {/* Right Sidebar */}
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
                    (doc) => doc.gtype == "card32eu"
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

      {/* Mobile Bet Popup */}
      <div className={`${placeBet ? "block" : "hidden"}`}>
        <div className="fixed inset-0 flex  items-start justify-center z-50 md:hidden">
          <div className="absolute top-0 inset-0  bg-gray-900 opacity-50"></div>

          <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
            <CasinoMobileBetPopup
              time={remainingTime}
              gameType="casino"
              gameName={item?.slug}
              item={item}
              odds={casinoData?.data?.data?.data?.t2?.filter(
                (doc) => doc.gtype == "card32eu"
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

export default Cards32b;
