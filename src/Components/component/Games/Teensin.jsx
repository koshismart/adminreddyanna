import React, { useContext, useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { Link, useLocation } from "react-router-dom";
import {
    // casinoGameOdds,
    // casinoGameTopTenResult,
    casinoIndividualResult,
} from "../../helpers/casino";
import { decodedTokenData, signout } from "../../helpers/auth";
import { useQuery, useQueryClient } from "react-query";
import useCountdown from "../../hook/useCountdown";
import cricketBall from "../../assets/Cricket_ball.svg";
import cardsData from "../../assets/cards/data";
import BetModal from "../common/BetModal";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import PlaceBet from "../common/PlaceBet";
import CardsUi from "../common/CardsUi";
import Timer from "../common/Timer";
import Header from "../common/Header";
import PlayerOdds from "../common/PlayerOdds";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import Frame from "../common/Frame";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import useScrollFixed from "../../hook/useFixed";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { calculateCasinoRate } from "../../utils/casinoRate";

const Teensin = ({
    myCurrentCasinoBets,
    refetchCurrentBets,
    refetchCasinoBetHistory,
    CasinoBetHistory,
    casinoSpecialPermission,
    casinoData,
}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    console.log("my teen20_c data", casinoData);

    // Decode token safely
    const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

    const location = useLocation();
    const item = location.state?.item;

    const queryClient = useQueryClient();
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

    const [Countdown, setCountdown] = useState(0);

    const [cardData, setCardData] = useState([]);
    const [individualResultData, setIndividualResultData] = useState(null);
    const [isBetModalOpen, setIsBetModalOpen] = useState(false);
    const [bet, setBet] = useState(false);


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
    // if (remainingTime == 0 && !casinoSpecialPermission) {
    //   setPlaceBet(false);
    // }

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
        // console.log(result);
        switch (result) {
            case "1":
                return "A";
            case "2":
                return "B";
            case "0":
                return "0";
        }
    };
    // result modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    //individual bet history
    const filteredBetHistory = useFilterIndividualBetHistory(
        CasinoBetHistory,
        individualResultData
    );

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
gameName={item?.gameName || "29Card Baccarat"}
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

<div className="md:flex relative w-full h-full">
{!bet && (
<>
<div className="center-container">
<div className="w-full relative">
<div className="hidden md:block">
    <Header
        gameName={item?.gameName || "29Card Baccarat"}
        min={cardData?.min}
        max={cardData?.max}
        mid={cardData?.mid}
    />
</div>
<div className="casino-video">
    <Frame item={item} />
    {/* cards */}
    <div className="absolute top-0 left-1">
        {Array.isArray(cardData) ? (
            <>
                {cardData.map((i, idx) => (
                    <div key={idx}>
                        <h4 className="text-white text-xs md:text-sm my-0 font-semibold uppercase">
                            {i.nation}
                        </h4>
                        <div className="flex gap-2">
                            <div className="col text-white">
                                <img
                                    src={
                                        cardsData.find((c) => c.code == i?.C1).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                        cardsData.find((c) => c.code == i?.C1).name
                                    }
                                />
                            </div>
                            <div className="col text-white">
                                <img
                                    src={
                                        cardsData.find((c) => c.code == i?.C2).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                        cardsData.find((c) => c.code == i?.C2).name
                                    }
                                />
                            </div>
                            <div className="col text-white">
                                <img
                                    src={
                                        cardsData.find((c) => c.code == i?.C3).image
                                    }
                                    className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                    alt={
                                        cardsData.find((c) => c.code == i?.C3).name
                                    }
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </>
        ) : (
            <>
                <div>
                    <h4 className="text-white text-xs my-0 md:text-sm font-semibold uppercase">
                        Player A
                    </h4>
                    <div className="flex gap-2">
                        <div className="col text-white">
                            {cardsData &&
                                cardsData.find(
                                    (i) => i.code == cardData?.C1
                                ) && (
                                    <img
                                        src={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C1
                                            ).image
                                        }
                                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                        alt={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C1
                                            ).name
                                        }
                                    />
                                )}
                        </div>
                        <div className="col text-white">
                            {cardsData &&
                                cardsData.find(
                                    (i) => i.code == cardData?.C3
                                ) && (
                                    <img
                                        src={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C3
                                            ).image
                                        }
                                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                        alt={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C3
                                            ).name
                                        }
                                    />
                                )}
                        </div>
                        <div className="col text-white">
                            {cardsData &&
                                cardsData.find(
                                    (i) => i.code == cardData?.C5
                                ) && (
                                    <img
                                        src={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C5
                                            ).image
                                        }
                                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                        alt={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C5
                                            ).name
                                        }
                                    />
                                )}
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="text-white text-xs my-0 md:text-sm font-semibold uppercase">
                        Player B
                    </h4>
                    <div className="flex gap-2">
                        <div className="col text-white">
                            {cardsData &&
                                cardsData.find(
                                    (i) => i.code == cardData?.C2
                                ) && (
                                    <img
                                        src={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C2
                                            ).image
                                        }
                                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                        alt={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C2
                                            ).name
                                        }
                                    />
                                )}
                        </div>
                        <div className="col text-white">
                            {cardsData &&
                                cardsData.find(
                                    (i) => i.code == cardData?.C4
                                ) && (
                                    <img
                                        src={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C4
                                            ).image
                                        }
                                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                        alt={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C4
                                            ).name
                                        }
                                    />
                                )}
                        </div>
                        <div className="col text-white">
                            {cardsData &&
                                cardsData.find(
                                    (i) => i.code == cardData?.C6
                                ) && (
                                    <img
                                        src={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C6
                                            ).image
                                        }
                                        className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                        alt={
                                            cardsData.find(
                                                (i) => i.code == cardData?.C6
                                            ).name
                                        }
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
    {/* Timer */}
    <div className="absolute bottom-2 right-2">
        <Timer time={endTime} />
    </div>
</div>
</div>

{/* odds */}
{/* Teen 20 Odds Section */}
{/* odds */}
<div className="baccarat29 casino-detail">
<div className="casino-table">
    <div className="casino-table-box">
        <div className="casino-table-left-box">
            <div className="casino-table-header">
                <div className="casino-nation-detail">Player A</div>
            </div>
            <div className="casino-table-body">
                <div className="casino-table-row">
                    <div className="casino-odds-box">Winner</div>
                    <div className="casino-odds-box">High Card</div>
                    <div className="casino-odds-box">Pair</div>
                    <div className="casino-odds-box">Color Plus</div>
                </div>
                <div className="casino-table-row">
                    {/* Player A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "1"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "1"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const playerA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "1"
                                    );
                                const newBetData = {
                                    betName: playerA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: playerA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: playerA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "1"
                            )?.b1 || "0"}
                        </span>
                    </div>

                    {/* 3 Baccarat A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "3"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "3"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const baccaratA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "3"
                                    );
                                const newBetData = {
                                    betName: baccaratA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: baccaratA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: baccaratA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "3"
                            )?.b1 || "0"}
                        </span>
                    </div>

                    {/* Total A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "5"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "5"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const totalA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "5"
                                    );
                                const newBetData = {
                                    betName: totalA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: totalA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: totalA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "5"
                            )?.b1 || "0"}
                        </span>
                    </div>

                    {/* Pair Plus A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "7"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "7"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const totalA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "7"
                                    );
                                const newBetData = {
                                    betName: totalA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: totalA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: totalA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "7"
                            )?.b1 || "0"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div className="casino-table-box-divider" />
        <div className="casino-table-right-box">
            <div className="casino-table-header">
                <div className="casino-nation-detail">Player B</div>
            </div>
            <div className="casino-table-body">
                <div className="casino-table-row">
                    <div className="casino-odds-box">Winner</div>
                    <div className="casino-odds-box">High Card</div>
                    <div className="casino-odds-box">Pair</div>
                    <div className="casino-odds-box">Color Plus</div>
                </div>
                <div className="casino-table-row">
                    {/* Player A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "2"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "2"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const playerA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "2"
                                    );
                                const newBetData = {
                                    betName: playerA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: playerA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: playerA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "2"
                            )?.b1 || "0"}
                        </span>
                    </div>

                    {/* 3 Baccarat A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "4"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "4"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const baccaratA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "4"
                                    );
                                const newBetData = {
                                    betName: baccaratA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: baccaratA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: baccaratA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "4"
                            )?.b1 || "0"}
                        </span>
                    </div>

                    {/* Total A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "6"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "6"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const totalA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "6"
                                    );
                                const newBetData = {
                                    betName: totalA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: totalA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: totalA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "6"
                            )?.b1 || "0"}
                        </span>
                    </div>

                    {/* Pair Plus A */}
                    <div
                        className={`casino-odds-box back ${remainingTime <= 3 ||
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "8"
                                )?.gstatus === "0"
                                ? "suspended-box"
                                : "cursor-pointer hover:bg-blue-400"
                            }`}
                        onClick={() => {
                            if (
                                remainingTime > 3 &&
                                casinoData?.data?.data?.data?.t2?.find(
                                    (item) => item.sid === "8"
                                )?.gstatus !== "0"
                            ) {
                                setPlaceBet(true);
                                const totalA =
                                    casinoData?.data?.data?.data?.t2?.find(
                                        (item) => item.sid === "8"
                                    );
                                const newBetData = {
                                    betName: totalA?.nat,
                                    boxColor: "bg-[#72bbef]",
                                    matchOdd: totalA?.b1,
                                    stake: 0,
                                    mid: cardData?.mid,
                                    sid: totalA?.sid,
                                    oddType: "casino_odds",
                                    oddCategory: "Back",
                                };
                                setBetData(newBetData);
                                setLatestBetData(newBetData);
                            }
                        }}
                    >
                        <span className="casino-odds">
                            {casinoData?.data?.data?.data?.t2?.find(
                                (item) => item.sid === "8"
                            )?.b1 || "0"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="casino-table-full-box mt-3">
        <img src="https://g1ver.sprintstaticdata.com/v79/static/front/img/lucky9.png" />
        {Array.isArray(casinoData?.data?.data?.data?.t2) &&
            casinoData?.data?.data?.data?.t2
                .filter((v) => v.sid === "9")
                .map((item, index) => (
                    <div className="casino-odd-box-container" key={index}>
                        <div
                            className={`casino-odds-box back ${item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                }`}
                        >
                            {item.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
                                <span className="casino-odds">{item.b1}</span>
                            ) : (
                                <span
                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                    onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                            betName: "Back on " + item?.nat,
                                            boxColor: "bg-[#B2D6F0]",
                                            matchOdd: calculateCasinoRate(item?.b1),
                                            stake: 0,
                                            mid: item?.mid,
                                            sid: item?.sid,
                                            oddType: "casino_odds",
                                            oddCategory: "Back",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                    }}
                                >
                                    {calculateCasinoRate(item.b1)}
                                </span>
                            )}
                        </div>
                        <div
                            className={`casino-odds-box lay ${item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                }`}
                        >
                            {item.gstatus == "SUSPENDED" || remainingTime <= 3 ? (
                                <span className="casino-odds">{item.l1}</span>
                            ) : (
                                <span
                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                    onClick={() => {
                                        setPlaceBet(true);
                                        const newBetData = {
                                            betName: "Lay on " + item?.nat,
                                            boxColor: "bg-[#faa9ba]",
                                            matchOdd: calculateCasinoRate(item?.l1),
                                            stake: 0,
                                            mid: item?.mid,
                                            sid: item?.sid,
                                            oddType: "casino_odds",
                                            oddCategory: "Lay",
                                        };
                                        setBetData(newBetData);
                                        setLatestBetData(newBetData);
                                    }}
                                >
                                    {calculateCasinoRate(item.l1)}
                                </span>
                            )}
                        </div>
                        <div className="casino-nation-book text-center w-100" />
                    </div>
                ))
        }

    </div>
</div>

</div>

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
<div className="grid grid-cols-2 gap-4 mt-4">

{/* PLAYER A */}
<div className="text-center">
<h4 className="result-title font-bold text-lg">Player A</h4>

<div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
    {individualResultData?.cards
    ?.split(",")
    ?.filter((_, i) => i % 2 === 0)
    ?.map((card) => (
        <img
        key={card}
        className="h-[54px]"
        src={cardsData.find((v) => v.code === card)?.image}
        />
    ))}

    {individualResultData?.win == "1" && (
    <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
        <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
    </div>
    )}
</div>
</div>

{/* PLAYER B */}
<div className="text-center">
<h4 className="result-title font-bold text-lg">Player B</h4>

<div className="casino-result-cards flex justify-center gap-2 mt-2 relative">
    {individualResultData?.cards
    ?.split(",")
    ?.filter((_, i) => i % 2 !== 0)
    ?.map((card) => (
        <img
        key={card}
        className="h-[54px]"
        src={cardsData.find((v) => v.code === card)?.image}
        />
    ))}

    {individualResultData?.win == "2" && (
    <div className="casino-winner-icon relative right-0 top-1/2 -translate-y-1/2">
        <i className="fas fa-trophy text-yellow-500 text-3xl"></i>
    </div>
    )}
</div>
</div>

</div>

{/* DESCRIPTION BOX (Winner, Under/Over etc) */}
{/* DESCRIPTION BOX DYNAMIC */}
{/* DESCRIPTION BOX DYNAMIC */}
<div className="row mt-2 justify-content-center">
  <div className="col-md-6">
    <div className="casino-result-desc">

      {(() => {
        const descArray = individualResultData?.newdesc?.split("#") || [];

        // ✔ 29 Card Baccarat mapping
        const labels = [
          "Winner",
          "High Card",
          "Pair",
          "Color Plus",
          "Lucky 9",
        ];

        return labels.map((label, i) => (
          <div className="casino-result-desc-item" key={i}>
            <div>{label}:</div>
            <div>{descArray[i] || "-"}</div>
          </div>
        ));
      })()}

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
className={`result cursor-pointer ${item.win === "1" ? "result-a" : "result-b"
}`}
>
{item.win === "1" ? "A" : "B"}
</span>

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
        odds={null}
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
<div className="sidebar-box my-bet-container mt-2 d-xl-none">
    <div className="sidebar-title">
        <h4>Rules</h4>
    </div>
    <div className="">
        <div className="table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th colSpan={2} className="text-center">
                            Color Plus Rules
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Straight</td>
                        <td>1 TO 2</td>
                    </tr>
                    <tr>
                        <td>Flush</td>
                        <td>1 TO 5</td>
                    </tr>
                    <tr>
                        <td>Trio</td>
                        <td>1 TO 20</td>
                    </tr>
                    <tr>
                        <td>Straight Flush</td>
                        <td>1 TO 30</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</div>
</div>
</>
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
odds={null}
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
</div>
</>
);
};

export default Teensin;
