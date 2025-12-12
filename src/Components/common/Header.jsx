// import React, { useState } from "react";
// import T20 from "../../assets/rules/t20-rules.webp";
// import Poker from "../../assets/rules/poker-rules.webp";
// import andarBahar from "../../assets/rules/ab-rules.webp";
// import Card32 from "../../assets/rules/32_cards_rule.webp";
// // import Lucky7 from "../../assets/rules/lucky7-rules.webp";
// import baccarat1 from "../../assets/rules/baccarat1rules.webp";
// import baccarat2 from "../../assets/rules/baccarat2-rules.webp";
// import dragonTiger20 from "../../assets/rules/dragon-tiger-20-rules.webp";
// import dtl20 from "../../assets/rules/dtl20-rules.webp";
// import casinowar from "../../assets/rules/war-rules.webp";
// import circket2020 from "../../assets/rules/cricketmatch.png";
// import AAA from "../../assets/rules/aaaRules.webp";
// import fiveFiveCricket from "../../assets/rules/5fivecricktrules (1).webp";
// import race2020 from "../../assets/rules/race20Rules.webp";
// import bollywood from "../../assets/rules/bollywoodtable-rules.webp";
// import SuperOver from "../../assets/rules/superover.jpg";
// import { Lucky7_ARulesData } from "../../Context/CasinoRulesData";

// const RuleModal = ({ gameName, setIsModalOpen }) => {
//   const getImage = (game) => {
//     console.log("my game name ", game);
//     switch (game) {
//       case "3 Patti T20":
//       case "3 Patti Test":
//       case "3 Patti One Day":
//       case "OpenTeenPatti":
//         return T20;
//       case "Poker- 1 Day":
//       case "Poker- 20-20":
//       case "6 Player Poker":
//         return Poker;
//       case "Ander Bahar":
//       case "Ander Bahar 2":
//         return andarBahar;
//       case "32 CARD A":
//       case "32 CARD B":
//         return Card32;
//       case "Lucky 7":
//         return Lucky7_ARulesData;

//       case "Lucky 7 B":
//       case "Instant Worli":
//         return Lucky7;
//       case "BACCARAT1":
//         return baccarat1;
//       case "BACCARAT2":
//         return baccarat2;
//       case "DRAGON TIGER- 20-20":
//       case "20-20 DRAGON TIGER 2":
//       case "1 Day Dragon Tiger":
//         return dragonTiger20;
//       case "20-20 DRAGON TIGER LION":
//         return dtl20;
//       case "CasinoWar":
//         return casinowar;
//       case "20-20 CRICKET MATCH":
//         return circket2020;
//       case "Amar Akbar Anthony":
//         return AAA;
//       case "Five Five Cricket":
//         return fiveFiveCricket;
//       case "Race 2020":
//         return race2020;
//       case "BollyWood Table":
//         return bollywood;
//       case "Super Over":
//         return SuperOver;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-[99]">
//       <div
//         className="absolute inset-0 bg-gray-900 opacity-50"
//         onClick={() => {
//           setIsModalOpen(false);
//         }}
//       ></div>

//       <div className="bg-white md:relative  absolute top-0 w-full z-[99] md:max-w-3xl max-w-[23rem] mx-auto">
//         <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b">
//           <h2 className="text-xl font-bold">{gameName + " - Rule"}</h2>
//           <button
//             className=" focus:outline-none"
//             onClick={() => {
//               setIsModalOpen(false);
//             }}
//           >
//             <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
//           </button>
//         </div>
//         <div className="h-[500px] overflow-y-auto text-black">
//           {gameName !== "20-20 CRICKET MATCH" && getImage(gameName) ? (
//             <img className="w-full" src={getImage(gameName)} />
//           ) : (
//             <>
//               <ul className="list-disc p-4 mx-3 text-wrap">
//                 <li className="my-1">
//                   This is a game of twenty-20 cricket. We will alreadty have
//                   score of first batting team, & score of second batting team up
//                   to 19.4 overs. At this stage second batting team will be
//                   always 12 run short of first batting team(IF THE SCORE IS
//                   TIED, SECOND BAT WILL WIN). This 12 run has to be scored by 2
//                   scoring shots or (two steps).
//                 </li>
//                 <li className="my-1">
//                   1st step is to be select a scoring shot from 2 , 3 , 4 , 5 , 6
//                   ,7 , 8 , 9 , 10. The one who bet will get rate according to
//                   the scoring shot he select from 2 to 10, & that will be
//                   considered as ball number 19.5.
//                 </li>
//                 <li className="my-1">
//                   2nd step is to open a card from 40 card deck of 1 to 10 of all
//                   suites. This will be considered last ball of the match. This
//                   twenty-20 game consist of scoring shots of 1 run to 10 runs.
//                 </li>
//                 <li className="text-red-900 my-1 font-bold uppercase">
//                   IF THE SCORE IS TIED SECOND BAT WILL WIN
//                 </li>
//               </ul>
//             </>
//           )}
//           {/* )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// const Header = ({ gameName, min, max, mid }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const handleRules = (e, game) => {
//     e.preventDefault();
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="px-2 bg-secondaryBackground text-white flex justify-between py-1">
//       <h1 className="uppercase">
//         {gameName && gameName}

//         {gameName !== "3 Card Judgment" && (
//           <>
//             {" - "}

//             <span
//               onClick={(e) => handleRules(e, gameName)}
//               className="underline  capitalize ms-1 my-0 hover:no-underline cursor-pointer"
//             >
//               Rules
//             </span>
//           </>
//         )}
//       </h1>

//       <h1 className="hidden md:block">
//         {mid && (
//           <>
//             Round Id :<span>{mid && mid}</span>{" "}
//           </>
//         )}
//         {min && (
//           <>
//             | Min: <span>{min && min}</span>{" "}
//           </>
//         )}
//         {max && (
//           <>
//             | Max: <span>{max && max}</span>{" "}
//           </>
//         )}
//       </h1>
//       {isModalOpen && (
//         <RuleModal gameName={gameName} setIsModalOpen={setIsModalOpen} />
//       )}
//     </div>
//   );
// };

// export default Header;

import React, { useState } from "react";
import T20 from "../../assets/rules/t20-rules.webp";
import Poker from "../../assets/rules/poker-rules.webp";
import andarBahar from "../../assets/rules/ab-rules.webp";
import Card32 from "../../assets/rules/32_cards_rule.webp";

import baccarat1 from "../../assets/rules/baccarat1rules.webp";
import baccarat2 from "../../assets/rules/baccarat2-rules.webp";
import dragonTiger20 from "../../assets/rules/dragon-tiger-20-rules.webp";

import casinowar from "../../assets/rules/war-rules.webp";
import circket2020 from "../../assets/rules/cricketmatch.png";
import AAA from "../../assets/rules/aaaRules.webp";
import fiveFiveCricket from "../../assets/rules/5fivecricktrules (1).webp";
import race2020 from "../../assets/rules/race20Rules.webp";
// import bollywood from "../../assets/rules/bollywoodtable-rules.webp";
import SuperOver from "../../assets/rules/superover.jpg";
import {
  Lucky7_ARulesData,
  CasinoWarRulesData,
  dtl20,
  DragonTiger2020RulesData,
  Poker1DayRulesData,
  Poker2020RulesData,
  teen33,
  teen1,
  teenPattiTestRulesData,
  teenPattiOpenRulesData,
  teenpattipoison1day,
  teenPatti2020RulesData,
  baccarat,
  teen41,
  teen42,
  Cmeter1,
  Teenpatti3,
  Race2,
  AmarAkbarAnthony2,
  Teen1,
  Teen120,
  NoteNumber,
  Trio,
  Dum10,
  Teenpatti,
  Race17,
  MuflishTeenpatti,
  CardBaccarat29,
  Patti2,
  Trap,
  Superover,
  Teen6,
  CrickMatch2020,
  Btable,
  AmarAkbarAnthony,
  Goal,
  Lucky15,
  Poison,
  Poison20,
  Joker20,
  Joker1,
  Joker120,
  Sicbo,
  Sicbo2,
  Abj,
  Cmeter,
} from "../../Context/CasinoRulesData";

const RuleModal = ({ gameName, setIsModalOpen }) => {
  const getImage = (game) => {
    console.log("my game name ", game);
    switch (game) {
      case "3 Patti T20":
      case "3 Patti Test":
      case "3 Patti One Day":
      case "OpenTeenPatti":
        return T20;
      case "Poker- 1 Day":
      case "Poker- 20-20":
      case "6 Player Poker":
        return Poker;
      case "32 CARD A":
      case "32 CARD B":
        return Card32;
      case "Lucky 7 B":
      case "Instant Worli":
        return Lucky7;
      case "BACCARAT1":
        return baccarat1;
      case "BACCARAT2":
        return baccarat2;
      case "DRAGON TIGER- 20-20":
      case "20-20 DRAGON TIGER 2":
      case "1 Day Dragon Tiger":
        return dragonTiger20;

      case "CasinoWar":
        return casinowar;
      case "20-20 CRICKET MATCH":
        return circket2020;
     
      case "Five Five Cricket":
        return fiveFiveCricket;
      case "Race 2020":
        return race2020;
      case "Super Over":
        return SuperOver;
        case "2 Cards Teenpatti":
          return Patti2;
          case "super over":
            return SuperOver;
            case "cricket match 20-20":
              return CrickMatch2020;
              case "Teenpatti Poison 20-20":
                return Poison20
      default:
        return null;
    }
  };

  // New function to check if we have rules data for a game
  const hasRulesData = (game) => {
    switch (game) {
      case "Lucky 7":
        return true;
      case "Lucky7 B":
        return true;
     
      case "20-20 DTL":
        return true;
      case "20-20 Dragon Tiger 2":
        return true;
      case "20-20 Dragon Tiger":
        return true;
      case "1 Day Dragon Tiger":
        return true;
      case "One Day Poker":
        return true;
      case "20-20 Poker":
        return true;
      case "Poker 6 Player":
        return true;
      case "32 Card A":
        return true;
      case "32 Cards B":
        return true;
      case "Casino war":
        return true;
      case "Teenpatti Test":
        return true;
      case "Teenpatti open":
        return true;
      case "Teenpatti onday":
        return true;
      case "20-20 Teenpatti":
        return true;
      case "baccarat":
        return true;
        case "Queen Top Open Teenpatti":
        return true;
        case "Jack Top Open Teenpatti":
        return true;
        case "1 Card Meter":
        return true;
        case "Instant Teenpatti":
        return true;
        case "Race to 2nd":
        return true;
        case "Amar Akbar Anthony 2":
        return true;
        case "1 CARD ONE-DAY":
        return true;
        case "1 CARD 20-20":
        return true;
        case "Note Number":
        return true;
        case "Trio":
        return true;
        case "Dus ka Dum":
        return true;
        case "20-20 Teenpatti B":
        return true;
        case "Race to 17":
        return true;
        case "Muflis Teenpatti":
        return true;
        case "29Card Baccarat":
        return true;
        case "2 Cards Teenpatti":
        return true;
        case "The Trap":
        return true;
        case "super over":
        return true;
        case "Teenpatti - 2.0":
        return true;
        case "Cricket Match 20-20":
        return true;
        case "Bollywood Casino":
        return true;
        case "Amar Akbar Anthony":
          return true;
          case "Goal":
            return true;
            case "Lucky 15":
              return true;
              case "Teenpatti Poison One Day":
                return true;
                case "Teenpatti Poison 20-20":
                  return true;
                  case "Teenpatti Joker 20-20":
                    return true;
                    case "Unlimited Joker Oneday":
                      return true;
                      case "Unlimited Joker 20-20":
                        return true;
                        case "Sic Bo":
                          return true;
                          case "Sic Bo 2":
                            return true;
                            case "Andar Bahar 2":
                              return true
                              case "Casino Meter":
                                return true
      default:
        return false;
    }
  };

  // New function to get rules content
  const getRulesContent = (game) => {
    switch (game) {
      case "Lucky 7":
        return Lucky7_ARulesData.content;
      case "Lucky7 B":
        return Lucky7_ARulesData.content;
      
      case "20-20 DTL":
        return dtl20.content;
      case "20-20 Dragon Tiger 2":
        return DragonTiger2020RulesData.content;
      case "20-20 Dragon Tiger":
        return DragonTiger2020RulesData.content;
      case "1 Day Dragon Tiger":
        return DragonTiger2020RulesData.content;
      case "One Day Poker":
        return Poker1DayRulesData.content;
      case "20-20 Poker":
        return Poker2020RulesData.content;
      case "Poker 6 Player":
        return teen33.content;
      case "32 Card A":
        return teen1.content;
      case "32 Cards B":
        return teen1.content;
      case "Casino war":
        return CasinoWarRulesData.content;
      case "Teenpatti Test":
        return teenPattiTestRulesData.content;
      case "Teenpatti open":
        return teenPattiOpenRulesData.content;
      case "Teenpatti onday":
        return teenpattipoison1day.content;
      case "baccarat":
        return baccarat.content;
      case "20-20 Teenpatti":
        return teenPatti2020RulesData.content;
       case "Queen Top Open Teenpatti":
        return teen41.content;
case "Jack Top Open Teenpatti":
return teen42.content;
case "1 Card Meter":
return Cmeter1.content;
case "Instant Teenpatti":
return Teenpatti3.content;
case "Race to 2nd":
return Race2.content;
case "Amar Akbar Anthony 2":
return AmarAkbarAnthony2.content;
case "1 CARD ONE-DAY":
return Teen1  .content;
case "1 CARD 20-20":
return Teen120.content;
case "Note Number":
return NoteNumber.content;
case "Trio":
return Trio.content;
case "Dus ka Dum":
return Dum10.content;
case "20-20 Teenpatti B":
return Teenpatti.content;
case "Race to 17":
return Race17.content;
case "Muflis Teenpatti":
return MuflishTeenpatti.content;
case "29Card Baccarat":
return CardBaccarat29.content;
case "2 Cards Teenpatti":
return Patti2.content;
case "The Trap":
return Trap.content;
case "super over":
return Superover.content;
case "Teenpatti - 2.0":
return Teen6.content;
case "Cricket Match 20-20":
return CrickMatch2020.content;
case "Bollywood Casino":
return Btable.content;
case "Amar Akbar Anthony":
return AmarAkbarAnthony.content;
case "Goal":
return Goal.content;
case "Lucky 15":
return Lucky15.content;
case "poison":
return Poison.content;
case "poison20":
  return Poison20.content;
  case "Teenpatti Joker 20-20":
    return Joker20.content;
    case "Unlimited Joker Oneday":
      return Joker1.content;
      case "Unlimited Joker 20-20":
        return Joker120.content;
        case "Sic Bo":
          return Sicbo.content;
          case "Sic Bo 2":
            return Sicbo2.content;
            case "Andar Bahar 2":
              return Abj.content;
              case "Casino Meter":
                return Cmeter.content;
default:
return null;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99]">
      <div
        className="absolute inset-0 bg-gray-900 opacity-50"
        onClick={() => {
          setIsModalOpen(false);
        }}
      ></div>

      <div className="bg-white md:relative absolute top-0 w-full z-[99] md:max-w-3xl max-w-[23rem] mx-auto">
        <div className="modal-header">
          <h2 className="modal-title h4">{gameName + " - Rule"}</h2>
          <button
            className="focus:outline-none"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <i className="cursor-pointer fa-solid fa-xmark text-white hover:text-red-400"></i>
          </button>
        </div>
        <div className="h-[500px] overflow-y-auto text-black">
          {/* For 20-20 CRICKET MATCH - show cricket rules */}
          {gameName === "20-20 CRICKET MATCH" ? (
            <>
              <ul className="list-disc p-4 mx-3 text-wrap">
                <li className="my-1">
                  This is a game of twenty-20 cricket. We will alreadty have
                  score of first batting team, & score of second batting team up
                  to 19.4 overs. At this stage second batting team will be
                  always 12 run short of first batting team(IF THE SCORE IS
                  TIED, SECOND BAT WILL WIN). This 12 run has to be scored by 2
                  scoring shots or (two steps).
                </li>
                <li className="my-1">
                  1st step is to be select a scoring shot from 2 , 3 , 4 , 5 , 6
                  ,7 , 8 , 9 , 10. The one who bet will get rate according to
                  the scoring shot he select from 2 to 10, & that will be
                  considered as ball number 19.5.
                </li>
                <li className="my-1">
                  2nd step is to open a card from 40 card deck of 1 to 10 of all
                  suites. This will be considered last ball of the match. This
                  twenty-20 game consist of scoring shots of 1 run to 10 runs.
                </li>
                <li className="text-red-900 my-1 font-bold uppercase">
                  IF THE SCORE IS TIED SECOND BAT WILL WIN
                </li>
              </ul>
            </>
          ) : // For games with rules data - show the rules content
          hasRulesData(gameName) ? (
            <div className="p-4">{getRulesContent(gameName)}</div>
          ) : // For other games - show image if available
          getImage(gameName) ? (
            <img
              className="w-full"
              src={getImage(gameName)}
              alt={`${gameName} Rules`}
            />
          ) : (
            <div className="p-4 text-center">
              <p>No rules available for this game.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Header = ({ gameName, min, max, mid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleRules = (e, game) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <div className="casino-header">
      <span className="casino-name">
        {gameName && gameName}

        {gameName !== "3 Card Judgment" && (
          <a className="ms-1" onClick={(e) => handleRules(e, gameName)}>
            <small>Rules</small>
          </a>
        )}
      </span>

      {mid && (
        <span className="casino-rid d-none d-xl-inline-block">
          <small>
            Round ID: <span>{mid}</span>
          </small>
        </span>
      )}

      {isModalOpen && (
        <RuleModal gameName={gameName} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default Header;
