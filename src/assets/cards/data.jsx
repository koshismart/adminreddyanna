import one from "./0.jpg";
// import queenD from "./queen_of_diamonds2.png";

//shape
import CC from "./Clubs.webp";
import DD from "./diamond.webp";
import HH from "./heart.webp";
import SS from "./spades.webp";

//club //chidi
import aceC from "./cards/ACC.webp";
import twoC from "./cards/2CC.webp";
import threeC from "./cards/3CC.webp";
import fourC from "./cards/4CC.webp";
import fiveC from "./cards/5CC.webp";
import sixC from "./cards/6CC.webp";
import sevenC from "./cards/7CC.webp";
import eightC from "./cards/8CC.webp";
import nineC from "./cards/9CC.webp";
import tenC from "./cards/10CC.webp";
import jackC from "./cards/JCC.webp";
import queenC from "./cards/QCC.webp";
import kingC from "./cards/KCC.webp";

//heart //lal-pan
import aceD from "./cards/ADD.webp";
import twoD from "./cards/2DD.webp";
import threeD from "./cards/3DD.webp";
import fourD from "./cards/4DD.webp";
import fiveD from "./cards/5DD.webp";
import sixD from "./cards/6DD.webp";
import sevenD from "./cards/7DD.webp";
import eightD from "./cards/8DD.webp";
import nineD from "./cards/9DD.webp";
import tenD from "./cards/10DD.webp";
import jackD from "./cards/JDD.webp";
import queenD from "./cards/QDD.webp";
import kingD from "./cards/KDD.webp";

//spades //kala-pan
import aceH from "./cards/AHH.webp";
import twoH from "./cards/2HH.webp";
import threeH from "./cards/3HH.webp";
import fourH from "./cards/4HH.webp";
import fiveH from "./cards/5HH.webp";
import sixH from "./cards/6HH.webp";
import sevenH from "./cards/7HH.webp";
import eightH from "./cards/8HH.webp";
import nineH from "./cards/9HH.webp";
import tenH from "./cards/10HH.webp";
import jackH from "./cards/JHH.webp";
import queenH from "./cards/QHH.webp";
import kingH from "./cards/KHH.webp";

// diamond //eet
import aceS from "./cards/ASS.webp";
import twoS from "./cards/2SS.webp";
import threeS from "./cards/3SS.webp";
import fourS from "./cards/4SS.webp";
import fiveS from "./cards/5SS.webp";
import sixS from "./cards/6SS.webp";
import sevenS from "./cards/7SS.webp";
import eightS from "./cards/8SS.webp";
import nineS from "./cards/9SS.webp";
import tenS from "./cards/10SS.webp";
import jackS from "./cards/JSS.webp";
import queenS from "./cards/QSS.webp";
import kingS from "./cards/KSS.webp";

//king
import KS from "./KHH.webp";
import KH from "./KDD.webp";
import KC from "./KCC.webp";
import KD from "./KSS.webp";

// type or variant
import A from "./types/A.webp";
import two from "./types/2.webp";
import three from "./types/3.webp";
import four from "./types/4.webp";
import five from "./types/5.webp";
import six from "./types/6.webp";
import seven from "./types/7.webp";
import eight from "./types/8.webp";
import nine from "./types/9.webp";
import ten from "./types/10.webp";
import jack from "./types/J.webp";
import queen from "./types/q.webp";
import king from "./types/k.webp";

//shapes for andar bahar
import s from "./shapes/SS.webp";
import d from "./shapes/DD.webp";
import c from "./shapes/CC.webp";
import h from "./shapes/HH.webp";

// example data
// A: Ace
// 2-10: Number cards
// J: Jack
// Q: Queen
// K: King
// Suits:

// C: Clubs
// D: Diamonds
// H: Hearts
// S: Spades

// QCC - Queen of Clubs
// 7HH - 7 of Hearts
// JDD - Jack of Diamonds
// 3HH - 3 of Hearts
// 2HH - 2 of Hearts
// 9CC - 9 of Clubs

// "mid": "0",
// "autotime": "0",
// "remark": "",
// "gtype": "teen20",
// "min": 100,
// "max": 300000,
// "C1": "10HH",
// "C2": "KHH",
// "C3": "5SS",
// "C4": "2DD",
// "C5": "2HH",
// "C6": "JSS"
const cardsData = [
  //backside
  { code: 0, name: "back", image: one },
  { code: 1, name: "back", image: one },
  { code: "1", name: "back", image: one },
  //clubs
  { code: "ACC", name: "Ace of Clubs", image: aceC },
  { code: "2CC", name: "2 of Clubs", image: twoC },
  { code: "3CC", name: "3 of Clubs", image: threeC },
  { code: "4CC", name: "4 of Clubs", image: fourC },
  { code: "5CC", name: "5 of Clubs", image: fiveC },
  { code: "6CC", name: "6 of Clubs", image: sixC },
  { code: "7CC", name: "7 of Clubs", image: sevenC },
  { code: "8CC", name: "8 of Clubs", image: eightC },
  { code: "9CC", name: "9 of Clubs", image: nineC },
  { code: "10CC", name: "10 of Clubs", image: tenC },
  { code: "JCC", name: "Jack of Clubs", image: jackC },
  { code: "QCC", name: "Queen of Clubs", image: queenC },
  { code: "KCC", name: "King of Clubs", image: kingC },
  //diamond
  { code: "ADD", name: "Ace of Diamonds", image: aceD },
  { code: "2DD", name: "2 of Diamonds", image: twoD },
  { code: "3DD", name: "3 of Diamonds", image: threeD },
  { code: "4DD", name: "4 of Diamonds", image: fourD },
  { code: "5DD", name: "5 of Diamonds", image: fiveD },
  { code: "6DD", name: "6 of Diamonds", image: sixD },
  { code: "7DD", name: "7 of Diamonds", image: sevenD },
  { code: "8DD", name: "8 of Diamonds", image: eightD },
  { code: "9DD", name: "9 of Diamonds", image: nineD },
  { code: "10DD", name: "10 of Diamonds", image: tenD },
  { code: "JDD", name: "Jack of Diamonds", image: jackD },
  { code: "QDD", name: "Queen of Diamonds", image: queenD },
  { code: "KDD", name: "King of Diamonds", image: kingD },
  //heart
  { code: "AHH", name: "Ace of Hearts", image: aceH },
  { code: "2HH", name: "2 of Hearts", image: twoH },
  { code: "3HH", name: "3 of Hearts", image: threeH },
  { code: "4HH", name: "4 of Hearts", image: fourH },
  { code: "5HH", name: "5 of Hearts", image: fiveH },
  { code: "6HH", name: "6 of Hearts", image: sixH },
  { code: "7HH", name: "7 of Hearts", image: sevenH },
  { code: "8HH", name: "8 of Hearts", image: eightH },
  { code: "9HH", name: "9 of Hearts", image: nineH },
  { code: "10HH", name: "10 of Hearts", image: tenH },
  { code: "JHH", name: "Jack of Hearts", image: jackH },
  { code: "QHH", name: "Queen of Hearts", image: queenH },
  { code: "KHH", name: "King of Hearts", image: kingH },
  //spades
  { code: "ASS", name: "Ace of Spades", image: aceS },
  { code: "2SS", name: "2 of Spades", image: twoS },
  { code: "3SS", name: "3 of Spades", image: threeS },
  { code: "4SS", name: "4 of Spades", image: fourS },
  { code: "5SS", name: "5 of Spades", image: fiveS },
  { code: "6SS", name: "6 of Spades", image: sixS },
  { code: "7SS", name: "7 of Spades", image: sevenS },
  { code: "8SS", name: "8 of Spades", image: eightS },
  { code: "9SS", name: "9 of Spades", image: nineS },
  { code: "10SS", name: "10 of Spades", image: tenS },
  { code: "JSS", name: "Jack of Spades", image: jackS },
  { code: "QSS", name: "Queen of Spades", image: queenS },
  { code: "KSS", name: "King of Spades", image: kingS },
];
const cardShape = [
  { code: "CC", codeRace: 3, image: CC },
  { code: "DD", codeRace: 2, image: DD },
  { code: "HH", codeRace: 1, image: HH },
  { code: "SS", codeRace: 4, image: SS },
];
const cardShapeForAndarBahar = [
  {
    code: "CC",
    name: "Club",
    dragonT: "Club",
    lucky: "Black",
    casinoName: "Club",
    image: c,
  },
  {
    code: "DD",
    name: "Diamond",
    dragonT: "Heart",
    lucky: "Red",
    casinoName: "Heart",
    image: d,
  },
  {
    code: "HH",
    name: "Heart",
    dragonT: "Spade",
    lucky: "Black",
    casinoName: "Spade",
    image: h,
  },
  {
    code: "SS",
    name: "Spade",
    dragonT: "Diamond",
    lucky: "Red",
    casinoName: "Diamond",
    image: s,
  },
];
const allKings = [
  { code: 3, name: "K of club", image: KC },
  { code: 2, name: "K of diamond", image: KD },
  { code: 1, name: "K of spade", image: KS },
  { code: 4, name: "K of heart", image: KH },
];
const cardVariant = [
  { code: "1", name: "A ", image: A },
  { code: "A", name: "A ", image: A },
  { code: "2", name: "2", image: two },
  { code: "3", name: "3", image: three },
  { code: "4", name: "4", image: four },
  { code: "5", name: "5", image: five },
  { code: "6", name: "6", image: six },
  { code: "7", name: "7", image: seven },
  { code: "8", name: "8", image: eight },
  { code: "9", name: "9 ", image: nine },
  { code: "10", name: "10", image: ten },
  { code: "J", name: "J", image: jack },
  { code: "Q", name: "Q", image: queen },
  { code: "K", name: "K", image: king },
  { code: 0, name: "back", image: one },
  { code: "11", name: "J", image: jack },
  { code: "12", name: "Q", image: queen },
  { code: "13", name: "K", image: king },
  { code: "31", name: "J", image: jack },
  { code: "32", name: "Q", image: queen },
  { code: "33", name: "K", image: king },
  { code: "21", name: "A ", image: A },
  { code: "22", name: "2", image: two },
  { code: "23", name: "3", image: three },
  { code: "24", name: "4", image: four },
  { code: "25", name: "5", image: five },
  { code: "26", name: "6", image: six },
  { code: "27", name: "7", image: seven },
  { code: "28", name: "8", image: eight },
  { code: "29", name: "9 ", image: nine },
  { code: "30", name: "10", image: ten },
];

const rankMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  J: 11,
  Q: 12,
  K: 13,
};
export default cardsData;
export { cardShape, allKings, cardVariant, cardShapeForAndarBahar, rankMap };
