// import React, { useContext, useEffect, useRef, useState } from "react";
// import { useCookies } from "react-cookie";
// import { useQuery, useQueryClient } from "react-query";
// import { Link, useLocation } from "react-router-dom";
// import { PlaceBetUseContext } from "../../Context/placeBetContext";
// import {
//   // casinoGameOdds,
//   // casinoGameTopTenResult,
//   casinoIndividualResult,
// } from "../../helpers/casino";
// import Frame from "../common/Frame";
// import useCountdown from "../../hook/useCountdown";
// import HeaderTab from "../common/HeaderTab";
// import Header from "../common/Header";
// import CardsUi from "../common/CardsUi";
// import Timer from "../common/Timer";
// import PlaceBet from "../common/PlaceBet";
// import cardsData, { allKings, cardShape } from "../../assets/cards/data";
// import ComplexOdds from "../common/ComplexOdds";
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

// const Race20 = ({
//   myCurrentCasinoBets,
//   refetchCurrentBets,
//   refetchCasinoBetHistory,
//   CasinoBetHistory,
//   casinoSpecialPermission,
//   casinoData,
// }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);

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
//     // remainingTime==0||
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

//   // result modal
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const calculateProfitLoss = (currentBets, item, option) => {
//     if (option == "main_odds") {
//       let totalProfitLoss = 0;
//       currentBets?.currentCasinoBets
//         ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
//         ?.filter(
//           (doc) =>
//             doc?.currentBet?.oddCategory == "Back" ||
//             doc?.currentBet?.oddCategory == "Lay"
//         )
//         ?.forEach((bet, index) => {
//           const { oddCategory, profit, loss, sid } = bet?.currentBet;

//           const adjustment =
//             oddCategory === "Back" ? Number(profit) : -Number(loss);

//           if (["1", "2", "3", "4"].includes(sid)) {
//             if (sid === item?.sid || sid === item?.sectionId) {
//               totalProfitLoss += adjustment;
//             } else {
//               totalProfitLoss -=
//                 oddCategory === "Back" ? Number(loss) : -Number(profit);
//             }
//           }
//         });

//       return (
//         <span
//           className={`${
//             totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
//           } mr-6`}
//         >
//           {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
//         </span>
//       );
//     }
//     if (option == "total_point") {
//       let totalProfitLoss = 0;
//       currentBets?.currentCasinoBets
//         ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
//         ?.filter((doc) => doc.currentBet.sid == "5")
//         ?.forEach((bet, index) => {
//           const { oddCategory, profit, loss, sid } = bet?.currentBet;

//           const adjustment =
//             oddCategory === "Yes" ? Number(profit) : -Number(loss);

//           if (["5"].includes(sid)) {
//             if (sid === item?.sid || sid === item?.sectionId) {
//               totalProfitLoss += adjustment;
//             } else {
//               totalProfitLoss -=
//                 oddCategory === "Yes" ? Number(loss) : -Number(profit);
//             }
//           }
//         });

//       return (
//         <span
//           className={`${
//             totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
//           } mr-6`}
//         >
//           {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
//         </span>
//       );
//     }
//     if (option == "total_cards") {
//       let totalProfitLoss = 0;
//       currentBets?.currentCasinoBets
//         ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
//         ?.filter((doc) => doc.currentBet.sid == "6")
//         ?.forEach((bet, index) => {
//           const { oddCategory, profit, loss, sid } = bet?.currentBet;

//           const adjustment =
//             oddCategory === "Yes" ? Number(profit) : -Number(loss);

//           if (["6"].includes(sid)) {
//             if (sid === item?.sid || sid === item?.sectionId) {
//               totalProfitLoss += adjustment;
//             } else {
//               totalProfitLoss -=
//                 oddCategory === "Yes" ? Number(loss) : -Number(profit);
//             }
//           }
//         });

//       return (
//         <span
//           className={`${
//             totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
//           } mr-6`}
//         >
//           {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
//         </span>
//       );
//     }
//   };

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
//             <div className="p-2 hidden md:block bg-secondaryBackground text-white">
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
//               <div className="absolute top-2 left-2">
//                 {cardShape.map((item) => (
//                   <div key={item.code} className="flex items-center">
//                     <div>
//                       <img className="w-[34px]" src={item.image} />
//                     </div>
//                     <div className="flex relative">
//                       {cardData?.desc
//                         ?.split(",")
//                         .filter((v) => v.includes(item.code))
//                         .map((filteredCard) => {
//                           const card = cardsData.find(
//                             (card) => card.code === filteredCard
//                           );
//                           if (card && card.code.includes(item.code)) {
//                             card.codeRace = item.codeRace;
//                           }

//                           return card ? (
//                             <div key={card.codeRace} className="my-1">
//                               <img
//                                 className="max-h-[24px] ms-1"
//                                 key={card.code}
//                                 src={card.image}
//                                 alt={card.code}
//                               />
//                             </div>
//                           ) : null;
//                         })}
//                     </div>
//                   </div>
//                 ))}
//                 {/* <CardsUi
//                   gettingCardData={cardData}
//                   cardsData={cardsData}
//                   game={item?.gameName}
//                 /> */}
//               </div>
//               {/* timer */}
//               <div className="absolute bottom-2 right-2">
//                 <Timer time={endTime} />
//               </div>
//             </div>
//             {Array.isArray(casinoData?.data?.data?.data?.t2) && (
//               <div className="my-1">
//                 {/* top */}
//                 <div className="grid grid-cols-4 place-items-center bg-gray-300 py-1">
//                   {casinoData?.data?.data?.data?.t2
//                     ?.filter((v) => v.nat.includes("K"))
//                     ?.map((item) => (
//                       <div className="md:col-span-1 col-span-2 flex flex-col justify-center items-center">
//                         <img
//                           className="max-h-[44px]"
//                           src={allKings.find((v) => v.name == item.nat).image}
//                         />

//                         <div className="grid grid-cols-2 my-2 justify-items-center relative w-full">
//                           {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
//                             <>
//                               <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                 <span className="text-white opacity-100">
//                                   <i class="ri-lock-2-fill text-xl"></i>
//                                 </span>
//                               </div>
//                               <div className="border max-w-[60px] w-[60px] min-h-10  mx-auto border-1 flex flex-col justify-center items-center  bg-blue-300">
//                                 <div className="md:text-sm text-xs  font-semibold my-0">
//                                   {item.b1}
//                                 </div>
//                                 {/* <div className="text-xs">{item.bs1}</div> */}
//                               </div>
//                               <div className=" max-w-[60px] w-[60px] mx-auto  flex flex-col justify-center items-center bg-red-300">
//                                 <div className="text-sm font-semibold my-0">
//                                   {item.l1}
//                                 </div>

//                                 {/* <div className="text-xs">{item.ls1}</div> */}
//                               </div>
//                             </>
//                           ) : (
//                             <>
//                               <div
//                                 onClick={(e) => {
//                                   setPlaceBet(true);
//                                   const newBetData = {
//                                     betName: item?.nat,
//                                     boxColor: "bg-[#B2D6F0]",
//                                     matchOdd: item?.b1,
//                                     stake: 0,
//                                     mid: cardData?.mid,
//                                     sid: item?.sid,
//                                     oddType: "casino_odds",
//                                     oddCategory: "Back",
//                                   };
//                                   setBetData(newBetData);
//                                   setLatestBetData(newBetData);
//                                 }}
//                                 className=" cursor-pointer max-w-[60px] w-[60px] min-h-10  mx-auto border-1 flex flex-col justify-center items-center hover:bg-blue-400  bg-blue-300"
//                               >
//                                 <div className="md:text-sm text-xs  font-semibold my-0">
//                                   {item.b1}
//                                 </div>
//                                 {/* <div className="text-xs">{item.bs1}</div> */}
//                               </div>
//                               <div
//                                 onClick={(e) => {
//                                   setPlaceBet(true);
//                                   const newBetData = {
//                                     betName: item?.nat,
//                                     boxColor: "bg-[#FAA9BA]",
//                                     matchOdd: item?.l1,
//                                     stake: 0,
//                                     mid: cardData?.mid,
//                                     sid: item?.tsection,
//                                     oddType: "casino_odds",
//                                     oddCategory: "Lay",
//                                   };
//                                   setBetData(newBetData);
//                                   setLatestBetData(newBetData);
//                                 }}
//                                 className=" cursor-pointer max-w-[60px] w-[60px] mx-auto flex flex-col justify-center items-center hover:bg-red-400 bg-red-300"
//                               >
//                                 <div className="text-sm font-semibold my-0">
//                                   {item.l1}
//                                 </div>
//                                 {/* <div className="text-xs">{item.ls1}</div> */}
//                               </div>
//                             </>
//                           )}
//                         </div>
//                         <div className="min-h-6 mb-2 ">
//                           {calculateProfitLoss(
//                             myCurrentCasinoBets,
//                             item,
//                             "main_odds"
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//                 {/* bottom */}
//                 <div className="grid grid-cols-3 place-content-center gap-1 my-1 py-1">
//                   <div className="md:col-span-1 col-span-3">
//                     {casinoData?.data?.data?.data?.t2
//                       ?.filter((v) => v.nat.includes("Total"))
//                       ?.map((item) => (
//                         <div className="">
//                           <div className=" bg-gray-300 w-full min-h-[88px]">
//                             <div className="text-sm px-2 font-semibold gap-5 flex justify-evenly w-full items-center">
//                               <div className="text-nowrap flex justify-center items-end">
//                                 {item.nat}
//                               </div>
//                               <div className="w-full gap-1 my-1 text-center">
//                                 <div className="flex">
//                                   <div className="w-full">
//                                     <div className="text-xs flex justify-center items-center">
//                                       Yes
//                                     </div>
//                                     <div
//                                       className={` relative min-h-10   mx-auto flex flex-col justify-center items-center ${
//                                         remainingTime <= 0
//                                           ? ""
//                                           : "hover:bg-blue-400"
//                                       }    bg-blue-300`}
//                                     >
//                                       {(remainingTime <= 3 ||
//                                         item.gstatus == "SUSPENDED") && (
//                                         <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                           <span className="text-white opacity-100">
//                                             <i class="ri-lock-2-fill text-xl"></i>
//                                           </span>
//                                         </div>
//                                       )}
//                                       {/* <div className="md:text-sm text-xs  font-semibold my-0">
//                                       {item.b1}
//                                     </div> */}
//                                       {/* <div className="text-xs">{item.bs1}</div> */}

//                                       <div
//                                         onClick={(e) => {
//                                           setPlaceBet(true);
//                                           const newBetData = {
//                                             betName: item?.nat,
//                                             boxColor: "bg-[#B2D6F0]",
//                                             matchOdd: item?.b1,
//                                             stake: 0,
//                                             mid: cardData?.mid,
//                                             sid: item?.sid,
//                                             oddType: "casino_odds",
//                                             oddCategory: "Yes",
//                                           };
//                                           setBetData(newBetData);
//                                           setLatestBetData(newBetData);
//                                         }}
//                                         className="md:text-sm cursor-pointer text-xs  font-semibold my-0"
//                                       >
//                                         {item.b1}
//                                       </div>
//                                     </div>
//                                   </div>
//                                   <div className="w-full">
//                                     <div className="text-xs flex justify-center items-center">
//                                       No
//                                     </div>
//                                     <div
//                                       className={`  relative mx-auto  flex min-h-10 flex-col justify-center items-center  ${
//                                         remainingTime <= 0
//                                           ? ""
//                                           : "hover:bg-red-400"
//                                       } bg-red-300`}
//                                     >
//                                       {(remainingTime <= 3 ||
//                                         item.gstatus == "SUSPENDED") && (
//                                         <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                           <span className="text-white opacity-100">
//                                             <i class="ri-lock-2-fill text-xl"></i>
//                                           </span>
//                                         </div>
//                                       )}

//                                       {/* <div className="md:text-sm text-xs font-semibold my-0">
//                                       {item.l1}
//                                     </div> */}

//                                       <div
//                                         onClick={(e) => {
//                                           setPlaceBet(true);
//                                           const newBetData = {
//                                             betName: item?.nat,
//                                             boxColor: "bg-[#FAA9BA]",
//                                             matchOdd: item?.l1,
//                                             stake: 0,
//                                             mid: cardData?.mid,
//                                             sid: item?.sid,
//                                             oddType: "casino_odds",
//                                             oddCategory: "No",
//                                           };
//                                           setBetData(newBetData);
//                                           setLatestBetData(newBetData);
//                                         }}
//                                         className="md:text-sm cursor-pointer text-xs font-semibold my-0"
//                                       >
//                                         {item.l1}
//                                       </div>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 {/* {calculateProfitLoss(
//                                   myCurrentCasinoBets,
//                                   item,
//                                   item.nat.includes("card")
//                                     ? "total_cards"
//                                     : "total_point"
//                                 )} */}
//                                 <div className="text-red-500">
//                                   {(() => {
//                                     const filteredBet =
//                                       myCurrentCasinoBets?.currentCasinoBets
//                                         ?.filter(
//                                           (doc) =>
//                                             doc.currentBet.mid == cardData?.mid
//                                         )
//                                         ?.filter(
//                                           (doc) =>
//                                             doc.currentBet.oddType ===
//                                               "casino_odds" &&
//                                             doc.currentBet.sid ===
//                                               (item?.sid || item.sectionId) &&
//                                             doc.exposure.isPreviousExposure ==
//                                               false
//                                         )
//                                         .sort(
//                                           (a, b) =>
//                                             new Date(b.createdAt) -
//                                             new Date(a.createdAt)
//                                         )?.[0];
//                                     return filteredBet?.exposure?.exposure;
//                                   })()}
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                   <div className="md:col-span-2 col-span-3">
//                     <div className="grid grid-cols-3 place-items-center bg-gray-300 py-2 ">
//                       {casinoData?.data?.data?.data?.t2
//                         ?.filter((v) => v.nat.includes("Win"))
//                         ?.map((item) => (
//                           <div className="col-span-1 w-4/5">
//                             <div className="justify-center flex items-center text-sm font-semibold">
//                               {item.nat}
//                             </div>
//                             <div className="  min-h-9 relative   mx-auto  flex flex-col justify-center items-center hover:bg-blue-400 bg-blue-300">
//                               {remainingTime <= 3 ||
//                               item.gstatus == "SUSPENDED" ? (
//                                 <>
//                                   <div className="absolute inset-0 bg-black opacity-80 flex w-full h-full justify-center items-center font-bold uppercase z-10">
//                                     <span className="text-white opacity-100">
//                                       <i class="ri-lock-2-fill text-xl"></i>
//                                     </span>
//                                   </div>
//                                   <div className="md:text-sm text-xs  font-semibold my-0">
//                                     {item.b1}
//                                   </div>
//                                 </>
//                               ) : (
//                                 <>
//                                   <div
//                                     onClick={(e) => {
//                                       setPlaceBet(true);
//                                       const newBetData = {
//                                         betName: item?.nat,
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
//                                     className="md:text-sm cursor-pointer text-xs  font-semibold my-0"
//                                   >
//                                     {item.b1}
//                                   </div>
//                                 </>
//                               )}
//                             </div>
//                             <div className="min-h-6">
//                               <span className="text-red-600 flex items-center justify-center  font-bold">
//                                 {(() => {
//                                   const filteredBets =
//                                     myCurrentCasinoBets?.currentCasinoBets
//                                       ?.filter(
//                                         (doc) =>
//                                           doc.currentBet.mid == cardData?.mid
//                                       )
//                                       ?.filter(
//                                         (doc) =>
//                                           doc.currentBet.oddType ===
//                                             "casino_odds" &&
//                                           doc.currentBet.sid === item?.sid
//                                       );

//                                   return filteredBets?.length
//                                     ? filteredBets.reduce(
//                                         (acc, doc) =>
//                                           acc + Number(doc.currentBet.stake),
//                                         0
//                                       ) * -1
//                                     : null;
//                                 })()}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

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
//                     <div className="my-3 w-full ">
//                       <div>
//                         <h4 className=" flex justify-end items-center text-sm font-semibold px-2">
//                           Round Id:{individualResultData?.mid}
//                         </h4>
//                       </div>

//                       <div className="flex flex-col justify-center items-start gap-2">
//                         <div className="flex justify-evenly w-full">
//                           <div>
//                             {cardShape.map((item) => (
//                               <div
//                                 key={item.code}
//                                 className="flex items-center"
//                               >
//                                 <div>
//                                   <img className="w-[44px]" src={item.image} />
//                                 </div>
//                                 <div className="flex relative">
//                                   {individualResultData?.cards
//                                     ?.split(",")
//                                     .filter((v) => v.includes(item.code))
//                                     .map((filteredCard) => {
//                                       const card = cardsData.find(
//                                         (card) => card.code === filteredCard
//                                       );
//                                       if (
//                                         card &&
//                                         card.code.includes(item.code)
//                                       ) {
//                                         card.codeRace = item.codeRace;
//                                       }

//                                       return card ? (
//                                         <div key={card.codeRace} className="">
//                                           <img
//                                             className="max-h-[44px]"
//                                             key={card.code}
//                                             src={card.image}
//                                             alt={card.code}
//                                           />

//                                           {card.codeRace ==
//                                             individualResultData.win && (
//                                             <div className="absolute text-success text-2xl top-3 -right-[75%] animate-bounce">
//                                               <FontAwesomeIcon
//                                                 style={{ color: "green" }}
//                                                 icon={faTrophy}
//                                               />
//                                             </div>
//                                           )}
//                                         </div>
//                                       ) : null;
//                                     })}
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                           <div className=" h-full text-lg font-semibold  w-fit px-3 py-1 border-blue-400 flex flex-col justify-center items-center border-2">
//                             <h1>W</h1>
//                             <h1>I</h1>
//                             <h1>N</h1>
//                             <h1>N</h1>
//                             <h1>E</h1>
//                             <h1>R</h1>
//                           </div>
//                         </div>
//                       </div>
//                       <p className="flex my-3 justify-center items-center font-normal text-sm">
//                         Result:{individualResultData?.desc}
//                       </p>
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
//             <div className="flex justify-end md:mt-1 m-1 gap-1">
//               {/* {console.log(toptenResult)} */}
//               {casinoData?.data?.data?.result &&
//                 casinoData?.data?.data?.result?.map((item, index) => (
//                   <img
//                     src={
//                       cardShape?.find((v) => v?.codeRace == item?.result)?.image
//                     }
//                     key={index}
//                     onClick={(e) => {
//                       e.preventDefault();
//                       casinoIndividualResult(cookies, item.mid).then((res) => {
//                         setIndividualResultData(res?.data?.data?.[0]);
//                       });
//                       setIsModalOpen(true);
//                     }}
//                     className={`h-7 object-cover border border-1 border-black cursor-pointer hover:bg-gray-300 flex justify-center items-center w-7 rounded-full`}
//                   />
//                 ))}
//             </div>
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
//                   odds={casinoData?.data?.data?.data?.t2}
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
//               odds={casinoData?.data?.data?.data?.t2}
//               refetchCurrentBets={refetchCurrentBets}
//               myCurrentBets={myCurrentCasinoBets}
//             />
//           </div>
//         </div>
//       </div>

//       {bet && (
//         <div className="md:w-[100%] md:hidden   md:ms-1 h-fit  flex-col">
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

// export default Race20;

import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation } from "react-router-dom";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { casinoIndividualResult } from "../../helpers/casino";
import Frame from "../common/Frame";
import useCountdown from "../../hook/useCountdown";
import HeaderTab from "../common/HeaderTab";
import Header from "../common/Header";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import PlaceBet from "../common/PlaceBet";
import cardsData, { allKings, cardShape } from "../../assets/cards/data";
import ComplexOdds from "../common/ComplexOdds";
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

const Race20 = ({
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateProfitLoss = (currentBets, item, option) => {
    if (option == "main_odds") {
      let totalProfitLoss = 0;
      currentBets?.currentCasinoBets
        ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
        ?.filter(
          (doc) =>
            doc?.currentBet?.oddCategory == "Back" ||
            doc?.currentBet?.oddCategory == "Lay"
        )
        ?.forEach((bet, index) => {
          const { oddCategory, profit, loss, sid } = bet?.currentBet;

          const adjustment =
            oddCategory === "Back" ? Number(profit) : -Number(loss);

          if (["1", "2", "3", "4"].includes(sid)) {
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
          className={`${
            totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
          } mr-6`}
        >
          {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
        </span>
      );
    }
    if (option == "total_point") {
      let totalProfitLoss = 0;
      currentBets?.currentCasinoBets
        ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
        ?.filter((doc) => doc.currentBet.sid == "5")
        ?.forEach((bet, index) => {
          const { oddCategory, profit, loss, sid } = bet?.currentBet;

          const adjustment =
            oddCategory === "Yes" ? Number(profit) : -Number(loss);

          if (["5"].includes(sid)) {
            if (sid === item?.sid || sid === item?.sectionId) {
              totalProfitLoss += adjustment;
            } else {
              totalProfitLoss -=
                oddCategory === "Yes" ? Number(loss) : -Number(profit);
            }
          }
        });

      return (
        <span
          className={`${
            totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
          } mr-6`}
        >
          {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
        </span>
      );
    }
    if (option == "total_cards") {
      let totalProfitLoss = 0;
      currentBets?.currentCasinoBets
        ?.filter((doc) => doc.currentBet.mid == cardData?.mid)
        ?.filter((doc) => doc.currentBet.sid == "6")
        ?.forEach((bet, index) => {
          const { oddCategory, profit, loss, sid } = bet?.currentBet;

          const adjustment =
            oddCategory === "Yes" ? Number(profit) : -Number(loss);

          if (["6"].includes(sid)) {
            if (sid === item?.sid || sid === item?.sectionId) {
              totalProfitLoss += adjustment;
            } else {
              totalProfitLoss -=
                oddCategory === "Yes" ? Number(loss) : -Number(profit);
            }
          }
        });

      return (
        <span
          className={`${
            totalProfitLoss > 0 ? "text-green-500" : "text-red-500"
          } mr-6`}
        >
          {totalProfitLoss === 0 ? null : totalProfitLoss.toFixed(0)}
        </span>
      );
    }
  };

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
            {/* <div className="p-2 hidden md:block bg-secondaryBackground text-white">
              <Header
                gameName={item?.gameName}
                min={casinoData?.data?.data?.data?.t2?.[0]?.min}
                max={casinoData?.data?.data?.data?.t2?.[0]?.max}
                mid={cardData?.mid}
              />
            </div> */}
            <div className="casino-video">
              <Frame item={item} />

              {/* card */}
              <div className="absolute top-2 left-2">
                {cardShape.map((item) => (
                  <div key={item.code} className="flex items-center">
                    <div>
                      <img className="w-[34px]" src={item.image} />
                    </div>
                    <div className="flex relative">
                      {cardData?.desc
                        ?.split(",")
                        .filter((v) => v.includes(item.code))
                        .map((filteredCard) => {
                          const card = cardsData.find(
                            (card) => card.code === filteredCard
                          );
                          if (card && card.code.includes(item.code)) {
                            card.codeRace = item.codeRace;
                          }

                          return card ? (
                            <div key={card.codeRace} className="my-1">
                              <img
                                className="max-h-[24px] ms-1"
                                key={card.code}
                                src={card.image}
                                alt={card.code}
                              />
                            </div>
                          ) : null;
                        })}
                    </div>
                  </div>
                ))}
              </div>
              {/* timer */}
              <div className="absolute bottom-2 right-2">
                <Timer time={endTime} />
              </div>
            </div>

            {/* NEW CASINO TABLE DESIGN */}
            {Array.isArray(casinoData?.data?.data?.data?.t2) && (
              <div className="race20 casino-detail">
                <div className="casino-table">
                  {/* First Row - Kings */}
                  <div className="casino-table-box">
                    {casinoData?.data?.data?.data?.t2
                      ?.filter((v) => v.nat.includes("K"))
                      ?.map((item) => (
                        <div className="casino-odd-box-container">
                          <div className="casino-nation-name">
                            <img
                              src={
                                allKings.find((v) => v.name == item.nat)?.image
                              }
                              alt={item.nat}
                            />
                          </div>
                          <div
                            className={`casino-odds-box back ${
                              remainingTime <= 3 || item.gstatus == "SUSPENDED"
                                ? "suspended-box"
                                : ""
                            }`}
                            onClick={(e) => {
                              if (
                                remainingTime > 3 &&
                                item.gstatus !== "SUSPENDED"
                              ) {
                                setPlaceBet(true);
                                const newBetData = {
                                  betName: item?.nat,
                                  boxColor: "bg-[#B2D6F0]",
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
                            <div className="casino-volume">10000</div>
                          </div>
                          <div
                            className={`casino-odds-box lay ${
                              remainingTime <= 3 || item.gstatus == "SUSPENDED"
                                ? "suspended-box"
                                : ""
                            }`}
                            onClick={(e) => {
                              if (
                                remainingTime > 3 &&
                                item.gstatus !== "SUSPENDED"
                              ) {
                                setPlaceBet(true);
                                const newBetData = {
                                  betName: item?.nat,
                                  boxColor: "bg-[#FAA9BA]",
                                  matchOdd: item?.l1,
                                  stake: 0,
                                  mid: cardData?.mid,
                                  sid: item?.tsection,
                                  oddType: "casino_odds",
                                  oddCategory: "Lay",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                              }
                            }}
                          >
                            <span className="casino-odds">{item.l1}</span>
                            <div className="casino-volume">10000</div>
                          </div>
                          <div className="casino-nation-book text-center w-100">
                            {calculateProfitLoss(
                              myCurrentCasinoBets,
                              item,
                              "main_odds"
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Second Row - Total Points and Cards */}
                  <div className="casino-table-box mt-3">
                    <div className="casino-table-left-box">
                      {/* Total Points */}
                      <div className="casino-odd-box-container">
                        <div className="casino-nation-name"></div>
                        <div className="casino-nation-name">No</div>
                        <div className="casino-nation-name">Yes</div>
                      </div>
                      {casinoData?.data?.data?.data?.t2
                        ?.filter((v) => v.nat.includes("Total points"))
                        ?.map((item) => (
                          <div className="casino-odd-box-container">
                            <div className="casino-nation-name">
                              Total points
                            </div>
                            <div
                              className={`casino-odds-box lay ${
                                remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED"
                                  ? "suspended-box"
                                  : ""
                              }`}
                              onClick={(e) => {
                                if (
                                  remainingTime > 3 &&
                                  item.gstatus !== "SUSPENDED"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#FAA9BA]",
                                    matchOdd: item?.l1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "No",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">{item.l1}</span>
                              <div className="casino-volume text-center">0</div>
                            </div>
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED"
                                  ? "suspended-box"
                                  : ""
                              }`}
                              onClick={(e) => {
                                if (
                                  remainingTime > 3 &&
                                  item.gstatus !== "SUSPENDED"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: item?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Yes",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">{item.b1}</span>
                              <div className="casino-volume text-center">0</div>
                            </div>
                            <div className="casino-nation-book"></div>
                          </div>
                        ))}

                      {/* Total Cards */}
                      <div className="casino-odd-box-container">
                        <div className="casino-nation-name"></div>
                        <div className="casino-nation-name">No</div>
                        <div className="casino-nation-name">Yes</div>
                      </div>
                      {casinoData?.data?.data?.data?.t2
                        ?.filter((v) => v.nat.includes("Total cards"))
                        ?.map((item) => (
                          <div className="casino-odd-box-container">
                            <div className="casino-nation-name">
                              Total cards
                            </div>
                            <div
                              className={`casino-odds-box lay ${
                                remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED"
                                  ? "suspended-box"
                                  : ""
                              }`}
                              onClick={(e) => {
                                if (
                                  remainingTime > 3 &&
                                  item.gstatus !== "SUSPENDED"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#FAA9BA]",
                                    matchOdd: item?.l1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "No",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">{item.l1}</span>
                              <div className="casino-volume text-center">0</div>
                            </div>
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED"
                                  ? "suspended-box"
                                  : ""
                              }`}
                              onClick={(e) => {
                                if (
                                  remainingTime > 3 &&
                                  item.gstatus !== "SUSPENDED"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: item?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Yes",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">{item.b1}</span>
                              <div className="casino-volume text-center">0</div>
                            </div>
                            <div className="casino-nation-book"></div>
                          </div>
                        ))}
                    </div>

                    {/* Win with options */}
                    <div className="casino-table-right-box">
                      {casinoData?.data?.data?.data?.t2
                        ?.filter((v) => v.nat.includes("Win"))
                        ?.map((item) => (
                          <div className="casino-odd-box-container">
                            <div className="casino-nation-name">{item.nat}</div>
                            <div
                              className={`casino-odds-box back ${
                                remainingTime <= 3 ||
                                item.gstatus == "SUSPENDED"
                                  ? "suspended-box"
                                  : ""
                              }`}
                              onClick={(e) => {
                                if (
                                  remainingTime > 3 &&
                                  item.gstatus !== "SUSPENDED"
                                ) {
                                  setPlaceBet(true);
                                  const newBetData = {
                                    betName: item?.nat,
                                    boxColor: "bg-[#B2D6F0]",
                                    matchOdd: item?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: item?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "",
                                  };
                                  setBetData(newBetData);
                                  setLatestBetData(newBetData);
                                }
                              }}
                            >
                              <span className="casino-odds">{item.b1}</span>
                            </div>
                            <div className="casino-nation-book text-center w-100 text-danger">
                              <span className="text-red-600">
                                {(() => {
                                  const filteredBets =
                                    myCurrentCasinoBets?.currentCasinoBets
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.mid == cardData?.mid
                                      )
                                      ?.filter(
                                        (doc) =>
                                          doc.currentBet.oddType ===
                                            "casino_odds" &&
                                          doc.currentBet.sid === item?.sid
                                      );

                                  return filteredBets?.length
                                    ? filteredBets.reduce(
                                        (acc, doc) =>
                                          acc + Number(doc.currentBet.stake),
                                        0
                                      ) * -1
                                    : null;
                                })()}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of your existing code for results and modals */}
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
      <div className="modal-title h4 font-bold">{item.gameName}</div>

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
      console.log("individualResultData", individualResultData), 
        <div className="casino-result-modal">

          {/* ROUND INFO */}
          <div className="casino-result-round-id flex justify-between text-sm font-semibold">
            <span><b>Round Id:</b> {individualResultData?.mid}</span>
            <span><b>Match Time:</b> {individualResultData?.mtime}</span>
          </div>

          {/* PLAYER CARDS (A,B,C,D) */}
        

{/* ONLY ONE CARD — CENTER ME SHOW */}
{/* ===== RACE 20 CARDS DYNAMIC ===== */}
{(() => {
  const all = (individualResultData?.cards || "")
    .split(",")
    .filter(c => c !== "1");

  const groups = { S: [], H: [], C: [], D: [] };

  all.forEach(c => {
    if (c.includes("SS")) groups.S.push(c);
    else if (c.includes("HH")) groups.H.push(c);
    else if (c.includes("CC")) groups.C.push(c);
    else if (c.includes("DD")) groups.D.push(c);
  });

  const icons = {
    S: "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/spade.png",
    H: "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/heart.png",
    C: "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/club.png",
    D: "https://g1ver.sprintstaticdata.com/v80/static/front/img/icons/diamond.png",
  };

  // Winner Suit
 // Winner Suit
const win = individualResultData?.winnat || "";

// Mapping Winner to Correct K Card
let winnerCardCode = null;

if (win.includes("Heart")) winnerCardCode = "KHH";
else if (win.includes("Diamond")) winnerCardCode = "KDD";
else if (win.includes("Spade")) winnerCardCode = "KSS";
else if (win.includes("Club")) winnerCardCode = "KCC";

// Winner Suit Alphabet
const winnerSuit =
  win.includes("Heart") ? "H" :
  win.includes("Diamond") ? "D" :
  win.includes("Spade") ? "S" :
  win.includes("Club") ? "C" : null;

// Winner Card Image Fetch
const winnerCardImg = cardsData.find(x => x.code === winnerCardCode)?.image;


  return (
    <div className="race-result-box">

      {Object.keys(groups).map(suit => {
        const list = groups[suit];
        const isWinner = suit === winnerSuit;

        return (
          <div key={suit} className="casino-result-cards relative">

            {/* Suit Icon */}
            <img src={icons[suit]} className="h-[30px]" />

            {/* Cards */}
            {list.map((card, i) => {
              const img = cardsData.find(x => x.code === card)?.image;
              return <img key={i} src={img} className="h-[50px]" />;
            })}

            {/* Trophy + Winner Card */}
            {isWinner && (
              <div className="casino-winner-icon absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <i className="fas fa-trophy text-yellow-500 text-3xl mb-1"></i>
                
                {winnerCardImg && (
                  <img src={winnerCardImg} className="h-[50px]" />
                )}
              </div>
            )}

          </div>
        );
      })}

      <div className="video-winner-text">
        {"WINNER".split("").map((l, i) => <div key={i}>{l}</div>)}
      </div>

    </div>
  );
})()}






          
<div className="row mt-2 justify-content-center">
  <div className="col-md-6">
    <div className="casino-result-desc">

      {/* Winner */}
      <div className="casino-result-desc-item">
        <div>Winner</div>
        <div>{individualResultData?.winnat ?? "-"}</div>
      </div>

      {/* Points */}
      <div className="casino-result-desc-item">
        <div>Points</div>
        <div>{individualResultData?.win ?? "-"}</div>
      </div>

      {/* Cards Count */}
      <div className="casino-result-desc-item">
        <div>Cards</div>
        <div>{individualResultData?.cards?.length ?? "-"}</div>
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
            <div className="flex justify-end md:mt-1 m-1 gap-1">
              {casinoData?.data?.data?.result &&
                casinoData?.data?.data?.result?.map((item, index) => (
                  <img
                    src={
                      cardShape?.find((v) => v?.codeRace == item?.result)?.image
                    }
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      casinoIndividualResult(cookies, item.mid).then((res) => {
                        setIndividualResultData(res?.data?.data?.[0]);
                      });
                      setIsModalOpen(true);
                    }}
                    className={`h-7 object-cover border border-1 border-black cursor-pointer hover:bg-gray-300 flex justify-center items-center w-7 rounded-full`}
                  />
                ))}
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
                  odds={casinoData?.data?.data?.data?.t2}
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
              odds={casinoData?.data?.data?.data?.t2}
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

export default Race20;
