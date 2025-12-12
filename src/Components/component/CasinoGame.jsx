import React, { Component, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TEEN_20 from "./Games/TEEN_20";
import TEEN_9 from "./Games/TEEN_9";
import TEEN from "./Games/TEEN";
import POKER_1_DAY from "./Games/POKER_1_DAY";
import POKER_20 from "./Games/POKER_20";
import POKER_9 from "./Games/POKER_9";
import AB_20 from "./Games/AB_20";
import DRAGON_TIGER_6 from "./Games/DRAGON_TIGER_6";
import AmarAkbarAnthony from "./Games/AAA";
import Lucky7 from "./Games/Lucky7a";
import TEEN_8 from "./Games/TEEN_8";
import DRAGON_TIGER_20 from "./Games/DRAGON_TIGER_20";
import DRAGON_TIGER_LION_20 from "./Games/DRAGON_TIGER_LION_20";
import Lucky7b from "./Games/Lucky7b";
import CricketV3 from "./Games/CricketV3";
import SuperOver from "./Games/SuperOver";
import Cards32 from "./Games/Cards32";
import Cards32b from "./Games/Cards32b";
import Race20 from "./Games/Race20";
import ThreeCard from "./Games/ThreeCard";
import ABJ from "./Games/ABJ";
import BollywoodTable from "./Games/BollywoodTable";
import Worli2 from "./Games/Worli2";
import Baccarat from "./Games/Baccarat";
import Baccrat2 from "./Games/Baccrat2";
import CasinoWar from "./Games/CasinoWar";
import CricketMatch20 from "./Games/CricketMatch20";
import DragonTiger202 from "./Games/DragonTiger202";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { getMyCurrentCasinoBets } from "../helpers/currentBet";
import { decodedTokenData, isAuthenticated } from "../helpers/auth";
import { io } from "socket.io-client";
import { getMyCasinoBetHistory } from "../helpers/betHistory";
import { usePermissions } from "../hook/usePermissions";
import { useUserPermissions } from "../hook/useUserPermissions";
import { getSocket } from "../utils/socketClient";
import TEEN_33 from "./Games/TEEN_33";
import TEEN_20c from "./Games/TEEN_20c";
import Joker_20 from "./Games/Joker_20";
import Poison_20 from "./Games/Poison_20";
import Goal from "./Games/Goal";
import Teenmuf from "./Games/Teenmuf";
import TEEN_20b from "./Games/TEEN_20b";
import TEEN_32 from "./Games/TEEN_32";
import Ballbyball from "./Games/Ballbyball";
import Lucky7c from "./Games/Lucky7c";
import BollywoodTable2 from "./Games/BollywoodTable2";
import Teen_41 from "./Games/Teen_41";
import TEEN_3 from "./Games/TEEN_3";
import TEEN_42 from "./Games/TEEN_42";
import Poison from "./Games/Poison";
import Joker_120 from "./Games/Joker_120";
import Joker_1 from "./Games/Joker_1";
import SuperOver_3 from "./Games/SuperOver_3";
import AB_4 from "./Games/AB_4";
import Race2 from "./Games/Race2";
import AmarAkbarAnthony_2 from "./Games/AAA_2";
import DusKaDum from "./Games/Dum_10";
import Cmeter_1 from "./Games/Cmeter_1";
import AB_3 from "./Games/AB_3";
import Lucky_5 from "./Games/Lucky_5";
import TEEN_1 from "./Games/Teen_1";
import Trap from "./Games/Trap";
import TEEN_120 from "./Games/Teen_120";
import TRIO from "./Games/Trio";
import RACE_17 from "./Games/Race_17";
import Teensin from "./Games/TEENSIN";
import Patti_2 from "./Games/Patti_2";
import Queen from "./Games/Queen";
import Teen_6 from "./Games/Teen_6";
import Lucky_15 from "./Games/Lucky_15";
import SuperOver_2 from "./Games/SuperOver_2";
import Notenum from "./Games/Notenum";
import Uniqueteenpatti from "./Games/Uniqueteenpatti";
import Sicbo from "./Games/Sicbo";
import Sicbo2 from "./Games/Sicbo2";
import Cmeter from "./Games/Cmeter";
import KBC from "./Games/KBC";

const CasinoGame = () => {
  let { gameName } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const { userId } = cookies.token ? decodedTokenData(cookies) || {} : {};
  const { token } = isAuthenticated(cookies);
  const [casinoData, setCasinoData] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("Game Name from URL:", gameName);
    console.log({ userId });
    console.log({ token });
    if (!userId || gameName == undefined || !token) return;

    // ✅ ensure same socket instance always reused
    if (!socketRef.current) {
      socketRef.current = getSocket(userId);
    }
    const socket = socketRef.current;
    const slug = gameName.toLowerCase();
    const roomName = `${userId}:${slug}`;

    const joinRoom = () => {
      if (socket.connected) {
        console.log(`Joining room: ${roomName}`);
        socket.emit("joinCasinoEvent", userId, slug, token);
      }
    };

    const handleGameData = (data) => {
      setCasinoData(data);
    };

    const handleConnect = () => {
      console.log("Socket connected, rejoining room:", roomName);
      joinRoom();
    };

    const handleOnline = () => {
      console.log("Browser online, reconnecting socket...");
      if (!socket.connected) socket.connect();
      else joinRoom();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") joinRoom();
    };

    // // 🧼 Remove previous listeners (safe no-op if none exist)
    socket.off(`casino:${slug}`);
    socket.off("connect");

    // ✅ Add listeners once
    socket.on(`casino:${slug}`, handleGameData);
    socket.on("connect", handleConnect);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // join immediately if already connected
    if (socket.connected) joinRoom();

    // 🧹 Cleanup
    return () => {
      console.log("Leaving room:", roomName);
      socketRef.current = false;
      socket.emit("leaveCasinoEvent", userId, slug);
      socket.off(`casino:${slug}`, handleGameData);
      socket.off("connect", handleConnect);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, gameName, token]); // ✅ cleaned dependency array

  // Fetching Casino Bet History
  const { data: CasinoBetHistory, refetch: refetchCasinoBetHistory } = useQuery(
    ["getMyCasinoBetHistory", { cookies, casinoGameName: gameName }],
    ({ queryKey }) => {
      const [, { cookies, casinoGameName }] = queryKey;
      return getMyCasinoBetHistory({ cookies, casinoGameName });
    },
    {
      enabled: !!gameName,
    }
  );

  //get my current casino bets
  const { data: myCurrentCasinoBets, refetch: refetchCurrentBets } = useQuery(
    ["myCurrentBets", { cookies, casinoGameName: gameName }],
    () => getMyCurrentCasinoBets({ cookies, casinoGameName: gameName }),
    { enabled: !!gameName }
  );

  // GET ACCESS PERMISSIONS
  const { UserPermissions } = useUserPermissions();

  let component;
  if (gameName == "TEEN_20" || gameName == "t20Odds" || gameName == "teen20") {
    component = (
      <TEEN_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN_9" ||
    gameName == "testtp" ||
    gameName == "teen9"
  ) {
    component = (
      <TEEN_9
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN" ||
    gameName == "tponeday" ||
    gameName == "teen"
  ) {
    component = (
      <TEEN
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "POKER_1_DAY" ||
    gameName == "onedaypoker" ||
    gameName == "poker"
  ) {
    component = (
      <POKER_1_DAY
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "POKER_20" ||
    gameName == "onedaypoker20" ||
    gameName == "poker20"
  ) {
    component = (
      <POKER_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "POKER_9" ||
    gameName == "poker6player" ||
    gameName == "poker6"
  ) {
    component = (
      <POKER_9
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "AB_20" ||
    gameName == "Andarbahar" ||
    gameName == "ab20"
  ) {
    component = (
      <AB_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "ABJ" ||
    gameName == "Andarbahar2" ||
    gameName == "abj"
  ) {
    component = (
      <ABJ
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "AAA" || gameName == "AAA" || gameName == "aaa") {
    component = (
      <AmarAkbarAnthony
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "LUCKY7EU2" ||
    gameName == "lucky7eu2" ||
    gameName == "lucky7eu2"
  ) {
    component = (
      <Lucky7c
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "LUCKY7" ||
    gameName == "lucky7" ||
    gameName == "lucky7"
  ) {
    component = (
      <Lucky7
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "LUCKY7EU" ||
    gameName == "lucky7B" ||
    gameName == "lucky7eu"
  ) {
    component = (
      <Lucky7b
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN_8" ||
    gameName == "opentp" ||
    gameName == "teen8"
  ) {
    component = (
      <TEEN_8
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "DRAGON_TIGER_6" ||
    gameName == "dragontiger1day" ||
    gameName == "dt6"
  ) {
    component = (
      <DRAGON_TIGER_6
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "DRAGON_TIGER_20" ||
    gameName == "dt20b" ||
    gameName == "dt20"
  ) {
    component = (
      <DRAGON_TIGER_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "DRAGON_TIGER_LION_20" || gameName == "dtl20") {
    component = (
      <DRAGON_TIGER_LION_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
    // component = <DRAGON_TIGER_LION_20 />;
  } else if (
    gameName == "CRICKET_V3" ||
    gameName == "cricketv3" ||
    gameName == "fivewicket"
  ) {
    component = (
      <CricketV3
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "super over" ||
    gameName == "Superover" ||
    gameName == "superover"
  ) {
    component = (
      <SuperOver
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "CARD_32" ||
    gameName == "card32a" ||
    gameName == "card32"
  ) {
    component = (
      <Cards32
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "CARD32EU" ||
    gameName == "card32b" ||
    gameName == "card32eu"
  ) {
    component = (
      <Cards32b
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "RACE20" ||
    gameName == "race2020" ||
    gameName == "race20"
  ) {
    component = (
      <Race20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "THREE_CARD" ||
    gameName == "Cards3J" ||
    gameName == "3cardj"
  ) {
    component = (
      <ThreeCard
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "BOLLYWOOD_TABLE" ||
    gameName == "ddb" ||
    gameName == "btable"
  ) {
    component = (
      <BollywoodTable
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "BOLLYWOOD_TABLE" ||
    gameName == "ddb" ||
    gameName == "btable2"
  ) {
    component = (
      <BollywoodTable2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "WORLI2" ||
    gameName == "worliinstant" ||
    gameName == "worli2"
  ) {
    component = (
      <Worli2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "BACCARAT" || gameName == "baccarat") {
    component = (
      <Baccarat
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "BACCARAT2" || gameName == "baccarat2") {
    component = (
      <Baccrat2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "CASINO_WAR" ||
    gameName == "warcasino" ||
    gameName == "war"
  ) {
    component = (
      <CasinoWar
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "CRICKET_MATCH_20" ||
    gameName == "cricket2020" ||
    gameName == "cmatch20"
  ) {
    component = (
      <CricketMatch20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN32" ||
    gameName == "Instantteenpatti2.0" ||
    gameName == "teen32"
  ) {
    component = (
      <TEEN_32
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN33" ||
    gameName == "Instantteenpatti3.0" ||
    gameName == "teen33"
  ) {
    component = (
      <TEEN_33
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "TEEN20c" ||
    gameName == "teen20c" ||
    gameName == "teen20c"
  ) {
    component = (
      <TEEN_20c
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "TEEN20b" ||
    gameName == "teen20b" ||
    gameName == "teen20b"
  ) {
    component = (
      <TEEN_20b
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "JOKER20" ||
    gameName == "joker20" ||
    gameName == "joker20"
  ) {
    component = (
      <Joker_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "Teenpatti Poison 20-20" ||
    gameName == "poison20" ||
    gameName == "poison20"
  ) {
    component = (
      <Poison_20
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName === "GOAl" || gameName == "goal" || gameName == "goal") {
    component = (
      <Goal
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "TEENMUF" ||
    gameName == "teenmuf" ||
    gameName == "teenmuf"
  ) {
    component = (
      <Teenmuf
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName === "BALLBYBALL" ||
    gameName == "ballbyball" ||
    gameName == "ballbyball"
  ) {
    component = (
      <Ballbyball
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "DRAGON_TIGER_20_2" ||
    gameName == "dt20202" ||
    gameName == "dt202"
  ) {
    component = (
      <DragonTiger202
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  }

  // yogesh ki table
  else if (
    gameName == "Queen Top Open Teenpatti" ||
    gameName == "TEEN41" ||
    gameName == "teen41"
  ) {
    component = (
      <Teen_41
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Instant Teenpatti" ||
    gameName == "TEEN3" ||
    gameName == "teen3"
  ) {
    component = (
      <TEEN_3
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Jack Top Open Teenpatti" ||
    gameName == "TEEN42" ||
    gameName == "teen42"
  ) {
    component = (
      <TEEN_42
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Teenpatti Poison One Day" ||
    gameName == "Poison" ||
    gameName == "poison"
  ) {
    component = (
      <Poison
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Unlimited Joker 20-20" ||
    gameName == "Joker120" ||
    gameName == "joker120"
  ) {
    component = (
      <Joker_120
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Unlimited Joker Oneday" ||
    gameName == "Joker1" ||
    gameName == "joker1"
  ) {
    component = (
      <Joker_1
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Mini SuperOver" ||
    gameName == "SuperOver3" ||
    gameName == "superover3"
  ) {
    component = (
      <SuperOver_3
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "ANDAR BAHAR 150 CARDS" ||
    gameName == "AB4" ||
    gameName == "ab4"
  ) {
    component = (
      <AB_4
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Race to 2nd" ||
    gameName == "Race2" ||
    gameName == "race2"
  ) {
    component = (
      <Race2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Amar Akbar Anthony 2" ||
    gameName == "AAA2" ||
    gameName == "aaa2"
  ) {
    component = (
      <AmarAkbarAnthony_2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Dus ka Dum" ||
    gameName == "Dum10" ||
    gameName == "dum10"
  ) {
    component = (
      <DusKaDum
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "1 Card Meter" ||
    gameName == "Cmeter1" ||
    gameName == "cmeter1"
  ) {
    component = (
      <Cmeter_1
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "Andar" || gameName == "Ab3" || gameName == "ab3") {
    component = (
      <AB_3
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Lucky6" ||
    gameName == "Lucky5" ||
    gameName == "lucky5"
  ) {
    component = (
      <Lucky_5
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN1" ||
    gameName == "Teen1" ||
    gameName == "teen1"
  ) {
    component = (
      <TEEN_1
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "TRAP" || gameName == "Trap" || gameName == "trap") {
    component = (
      <Trap
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "TEEN120" ||
    gameName == "Teen120" ||
    gameName == "teen120"
  ) {
    component = (
      <TEEN_120
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "TRIO" || gameName == "Trio" || gameName == "trio") {
    component = (
      <TRIO
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "RACE17" ||
    gameName == "Race17" ||
    gameName == "race17"
  ) {
    component = (
      <RACE_17
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "29Card Baccarat" ||
    gameName == "Teensin" ||
    gameName == "teensin"
  ) {
    component = (
      <Teensin
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "2 Cards Teenpatti" ||
    gameName == "Patti2" ||
    gameName == "patti2"
  ) {
    component = (
      <Patti_2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "QUEEN" ||
    gameName == "Queen" ||
    gameName == "queen"
  ) {
    component = (
      <Queen
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Teenpatti - 2.0" ||
    gameName == "Teen6" ||
    gameName == "teen6"
  ) {
    component = (
      <Teen_6
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Lucky 15" ||
    gameName == "Lucky15" ||
    gameName == "lucky15"
  ) {
    component = (
      <Lucky_15
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "super over2" ||
    gameName == "Superover2" ||
    gameName == "superover2"
  ) {
    component = (
      <SuperOver_2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Note Number" ||
    gameName == "Notenum" ||
    gameName == "notenum"
  ) {
    component = (
      <Notenum
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Unique Teenpatti" ||
    gameName == "Teenunique" ||
    gameName == "teenunique"
  ) {
    component = (
      <Uniqueteenpatti
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Sic Bo" ||
    gameName == "Sicbo" ||
    gameName == "sicbo"
  ) {
    component = (
      <Sicbo
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Sic Bo 2" ||
    gameName == "Sicbo2" ||
    gameName == "sicbo2"
  ) {
    component = (
      <Sicbo2
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (
    gameName == "Casino Meter" ||
    gameName == "Cmeter" ||
    gameName == "cmeter"
  ) {
    component = (
      <Cmeter
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  } else if (gameName == "K.B.C" || gameName == "Kbc" || gameName == "kbc") {
    component = (
      <KBC
        CasinoBetHistory={CasinoBetHistory}
        myCurrentCasinoBets={myCurrentCasinoBets}
        refetchCurrentBets={refetchCurrentBets}
        refetchCasinoBetHistory={refetchCasinoBetHistory}
        casinoSpecialPermission={
          UserPermissions?.userPermissions?.canBypassCasinoBet || false
        }
        casinoData={casinoData}
      />
    );
  }
  return <div className="center-main-container casino-page">{component}</div>;
};

export default CasinoGame;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import TEEN_20 from "./Games/TEEN_20";
// import TEEN_9 from "./Games/TEEN_9";
// import TEEN from "./Games/TEEN";
// import POKER_1_DAY from "./Games/POKER_1_DAY";
// import POKER_20 from "./Games/POKER_20";
// import POKER_9 from "./Games/POKER_9";
// import AB_20 from "./Games/AB_20";
// import DRAGON_TIGER_6 from "./Games/DRAGON_TIGER_6";
// import AmarAkbarAnthony from "./Games/AAA";
// import Lucky7 from "./Games/Lucky7a";
// import TEEN_8 from "./Games/TEEN_8";
// import TEEN_33 from "./Games/TEEN_33";
// import DRAGON_TIGER_20 from "./Games/DRAGON_TIGER_20";
// import DRAGON_TIGER_LION_20 from "./Games/DRAGON_TIGER_LION_20";
// import Lucky7b from "./Games/Lucky7b";
// import CricketV3 from "./Games/CricketV3";
// import SuperOver from "./Games/SuperOver";
// import Cards32 from "./Games/Cards32";
// import Cards32b from "./Games/Cards32b";
// import Race20 from "./Games/Race20";
// import ThreeCard from "./Games/ThreeCard";
// import ABJ from "./Games/ABJ";
// import BollywoodTable from "./Games/BollywoodTable";
// import Worli2 from "./Games/Worli2";
// import Baccarat from "./Games/Baccarat";
// import Baccrat2 from "./Games/Baccrat2";
// import CasinoWar from "./Games/CasinoWar";
// import CricketMatch20 from "./Games/CricketMatch20";
// import DragonTiger202 from "./Games/DragonTiger202";
// import { useQuery } from "react-query";
// import { useCookies } from "react-cookie";
// import { getMyCurrentCasinoBets } from "../helpers/currentBet";
// import { decodedTokenData } from "../helpers/auth";
// import { io } from "socket.io-client";
// import { getMyCasinoBetHistory } from "../helpers/betHistory";
// import { usePermissions } from "../hook/usePermissions";
// import { useUserPermissions } from "../hook/useUserPermissions";

// const CasinoGame = () => {
//   let { gameName } = useParams();
//   const [cookies, setCookie, removeCookie] = useCookies(["user"]);

//   // Fetching Casino Bet History
//   const { data: CasinoBetHistory, refetch: refetchCasinoBetHistory } = useQuery(
//     ["getMyCasinoBetHistory", { cookies, casinoGameName: gameName }],
//     ({ queryKey }) => {
//       const [, { cookies, casinoGameName }] = queryKey;
//       return getMyCasinoBetHistory({ cookies, casinoGameName });
//     },
//     {
//       enabled: !!gameName,
//     }
//   );

//   //get my current casino bets
//   const { data: myCurrentCasinoBets, refetch: refetchCurrentBets } = useQuery(
//     ["myCurrentBets", { cookies, casinoGameName: gameName }],
//     () => getMyCurrentCasinoBets({ cookies, casinoGameName: gameName }),
//     { enabled: !!gameName }
//   );

//   // GET ACCESS PERMISSIONS
//   const { UserPermissions } = useUserPermissions();

//   let component;
//   if (gameName == "TEEN_20" || gameName == "t20Odds" || gameName == "teen20") {
//     component = (
//       <TEEN_20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "TEEN_9" ||
//     gameName == "testtp" ||
//     gameName == "teen9"
//   ) {
//     component = (
//       <TEEN_9
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "TEEN" ||
//     gameName == "tponeday" ||
//     gameName == "teen"
//   ) {
//     component = (
//       <TEEN
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "POKER_1_DAY" ||
//     gameName == "onedaypoker" ||
//     gameName == "poker"
//   ) {
//     component = (
//       <POKER_1_DAY
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "POKER_20" ||
//     gameName == "onedaypoker20" ||
//     gameName == "poker20"
//   ) {
//     component = (
//       <POKER_20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "POKER_9" ||
//     gameName == "poker6player" ||
//     gameName == "poker6"
//   ) {
//     component = (
//       <POKER_9
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "AB_20" ||
//     gameName == "Andarbahar" ||
//     gameName == "ab20"
//   ) {
//     component = (
//       <AB_20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "ABJ" ||
//     gameName == "Andarbahar2" ||
//     gameName == "abj"
//   ) {
//     component = (
//       <ABJ
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (gameName == "AAA" || gameName == "AAA" || gameName == "aaa") {
//     component = (
//       <AmarAkbarAnthony
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName === "LUCKY7" ||
//     gameName == "lucky7" ||
//     gameName == "lucky7"
//   ) {
//     component = (
//       <Lucky7
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "LUCKY7EU" ||
//     gameName == "lucky7B" ||
//     gameName == "lucky7eu"
//   ) {
//     component = (
//       <Lucky7b
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "TEEN_8" ||
//     gameName == "opentp" ||
//     gameName == "teen8"
//   ) {
//     component = (
//       <TEEN_8
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "DRAGON_TIGER_6" ||
//     gameName == "dragontiger1day" ||
//     gameName == "dt6"
//   ) {
//     component = (
//       <DRAGON_TIGER_6
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "DRAGON_TIGER_20" ||
//     gameName == "dt20b" ||
//     gameName == "dt20"
//   ) {
//     component = (
//       <DRAGON_TIGER_20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (gameName == "DRAGON_TIGER_LION_20" || gameName == "dtl20") {
//     component = (
//       <DRAGON_TIGER_LION_20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//     // component = <DRAGON_TIGER_LION_20 />;
//   } else if (gameName == "CRICKET_V3" || gameName == "fivewicket") {
//     component = (
//       <CricketV3
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "SUPEROVER" ||
//     gameName == "Superover" ||
//     gameName == "superover"
//   ) {
//     component = (
//       <SuperOver
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "CARD_32" ||
//     gameName == "card32a" ||
//     gameName == "card32"
//   ) {
//     component = (
//       <Cards32
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "CARD32EU" ||
//     gameName == "card32b" ||
//     gameName == "card32eu"
//   ) {
//     component = (
//       <Cards32b
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "RACE20" ||
//     gameName == "race2020" ||
//     gameName == "race20"
//   ) {
//     component = (
//       <Race20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "THREE_CARD" ||
//     gameName == "Cards3J" ||
//     gameName == "3cardj"
//   ) {
//     component = (
//       <ThreeCard
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "BOLLYWOOD_TABLE" ||
//     gameName == "ddb" ||
//     gameName == "btable"
//   ) {
//     component = (
//       <BollywoodTable
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "WORLI2" ||
//     gameName == "worliinstant" ||
//     gameName == "worli2"
//   ) {
//     component = (
//       <Worli2
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (gameName == "BACCARAT" || gameName == "baccarat") {
//     component = (
//       <Baccarat
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (gameName == "BACCARAT2" || gameName == "baccarat2") {
//     component = (
//       <Baccrat2
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "CASINO_WAR" ||
//     gameName == "warcasino" ||
//     gameName == "war"
//   ) {
//     component = (
//       <CasinoWar
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "CRICKET_MATCH_20" ||
//     gameName == "cricket2020" ||
//     gameName == "cmatch20"
//   ) {
//     component = (
//       <CricketMatch20
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "DRAGON_TIGER_20_2" ||
//     gameName == "dt20202" ||
//     gameName == "dt202"
//   ) {
//     component = (
//       <DragonTiger202
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   } else if (
//     gameName == "TEEN_33" ||
//     gameName == "opentp" ||
//     gameName == "teen33"
//   ) {
//     component = (
//       <TEEN_33
//         CasinoBetHistory={CasinoBetHistory}
//         myCurrentCasinoBets={myCurrentCasinoBets}
//         refetchCurrentBets={refetchCurrentBets}
//         refetchCasinoBetHistory={refetchCasinoBetHistory}
//         casinoSpecialPermission={
//           UserPermissions?.userPermissions?.canBypassCasinoBet || false
//         }
//       />
//     );
//   }
//   return <div className="center-main-container casino-page">{component}</div>;
// };

// export default CasinoGame;
