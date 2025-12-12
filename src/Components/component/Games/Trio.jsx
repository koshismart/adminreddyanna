import React, { useContext, useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useQuery, useQueryClient } from "react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { casinoIndividualResult } from "../../helpers/casino";
import useCountdown from "../../hook/useCountdown";
import Header from "../common/Header";
import Timer from "../common/Timer";
import cardsData from "../../assets/cards/data";
import HeaderTab from "../common/HeaderTab";
import { PlaceBetUseContext } from "../../Context/placeBetContext";
import Frame from "../common/Frame";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { getMyCurrentCasinoBets } from "../../helpers/currentBet";
import CasinoBetPopup from "../../PopUps/CasinoBetPopup";
import CasinoMobileBetPopup from "../../PopUps/CasinoMobileBetPopup";
import cricketBall from "../../assets/Cricket_ball.svg";
import useScrollFixed from "../../hook/useFixed";
import { calculateCasinoRate } from "../../utils/casinoRate";
import { getMyCasinoBetHistory } from "../../helpers/betHistory";
import useFilterIndividualBetHistory from "../../hook/useFilterIndividualBetHistory";
import IndividualBetHistoryTable from "../common/IndividualBetHistoryTable";
import { decodedTokenData, signout } from "../../helpers/auth";
import PlaceBet from "../common/PlaceBet";

const TRIO = ({
    myCurrentCasinoBets,
    refetchCurrentBets,
    refetchCasinoBetHistory,
    CasinoBetHistory,
    casinoSpecialPermission,
    casinoData,
}) => {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    console.log("casino ka data", casinoData)
    // Decode token safely
    const { userId } = cookies.user ? decodedTokenData(cookies) || {} : {};

    const location = useLocation();
    const item = location.state?.item;
    const queryClient = useQueryClient();
    const [Countdown, setCountdown] = useState(0);

    const [cardData, setCardData] = useState([]);
    const [individualResultData, setIndividualResultData] = useState(null);
    const [oddsData, setOddsData] = useState([]);
    console.log("odds ka data", oddsData)
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
    const [bet, setBet] = useState(false);

    // Individual bet history
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

    // Authentication error handling
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

    // Process socket data
    useEffect(() => {
        if (casinoData && casinoData.data && casinoData.data.data?.data?.t1) {

            const autotime = parseInt(casinoData.data.data.data.t1?.[0]?.autotime || "8");
            setCountdown(autotime);
            //console.log("auto time ",autotime)
            setOddsData(casinoData.data.data.data.t2 || []);
            setCardData(casinoData.data.data.data.t1);
        } else {
            setOddsData(getFallbackOddsData());
            setCountdown(480);
        }
    }, [casinoData]);

    // Fallback odds data
    const getFallbackOddsData = () => {
        return [
            {
                mid: "157251113115409",
                nat: "Player A",
                sid: "1",
                b1: "1.95",
                gstatus: "0",
                min: 100,
                max: 200000,
            },
            {
                mid: "157251113115409",
                nat: "Player B",
                sid: "2",
                b1: "1.95",
                gstatus: "0",
                min: 100,
                max: 200000,
            },
        ];
    };

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

    // Auto-refresh logic
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
        refetchCurrentBets();
        refetchCasinoBetHistory();
    }

    const getResultText = (result) => {
        if (!result) return "0";
        return result; // For your data, result is either "1" or "2"
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle odds suspension
    useEffect(() => {
        if (latestBetData && oddsData.length > 0) {
            const currentOdds = oddsData.find(
                (data) => data.sid === latestBetData.sid
            );

            if (
                currentOdds &&
                currentOdds.b1 !== latestBetDataRef.current.matchOdd &&
                betData.oddType === "casino_odds"
            ) {
                if (remainingTime <= 4) {
                    setLatestBetData((prev) => ({
                        ...prev,
                        matchOdd: "SUSPENDED",
                    }));
                }
                if (latestBetData.mid !== currentOdds.mid) {
                    setPlaceBet(false);
                }
            }
        }
    }, [remainingTime, oddsData]);

return (
<>
    <div className="block md:hidden">
        <Header
            gameName={item?.gameName}
            min={oddsData?.[0]?.min || 100}
            max={oddsData?.[0]?.max || 200000}
            mid={oddsData?.[0]?.mid}
        />
    </div>
    <HeaderTab
        bet={bet}
        setBet={setBet}
        mid={oddsData?.[0]?.mid}
        myCurrentCasinoBets={myCurrentCasinoBets}
    />
    {!bet && (
        <div className="flex relative w-full h-full gap-1">
            <div className="center-container">
                <div className="w-full relative">
                    <div className="hidden md:block">
                        <Header
                            gameName={item?.gameName}
                            min={oddsData?.[0]?.min || 100}
                            max={oddsData?.[0]?.max || 200000}
                            mid={oddsData?.[0]?.mid}
                        />
                    </div>
                    <div className="casino-video">
                        <Frame item={item} />

                        {/* Display Cards if available */}
                        {cardData.length > 0 && cardData[0].C1 && (
                            <div className="absolute top-0 left-1">
                                <div className="flex gap-2">
                                    {cardData[0].C1 && (
                                        <div className="col text-white">
                                            <img
                                                src={
                                                    cardsData.find((c) => c.code === cardData[0].C1)
                                                        ?.image
                                                }
                                                className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                                alt={
                                                    cardsData.find((c) => c.code === cardData[0].C1)
                                                        ?.name
                                                }
                                            />
                                        </div>
                                    )}
                                    {cardData[0].C2 && (
                                        <div className="col text-white">
                                            <img
                                                src={
                                                    cardsData.find((c) => c.code === cardData[0].C2)
                                                        ?.image
                                                }
                                                className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                                alt={
                                                    cardsData.find((c) => c.code === cardData[0].C2)
                                                        ?.name
                                                }
                                            />
                                        </div>
                                    )}
                                    {cardData[0].C3 && (
                                        <div className="col text-white">
                                            <img
                                                src={
                                                    cardsData.find((c) => c.code === cardData[0].C3)
                                                        ?.image
                                                }
                                                className="h-[24px] md:h-[34px] rounded-sm img-fluid"
                                                alt={
                                                    cardsData.find((c) => c.code === cardData[0].C3)
                                                        ?.name
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Timer */}
                        <div className="absolute bottom-2 right-2">
                            <Timer time={endTime} />
                        </div>
                    </div>
                </div>

                {/* Casino Table Design - Exactly as per your HTML structure */}
                <div className="trio casino-detail">
                    <div className="casino-table">
                        <div className="casino-table-box">
                            {oddsData
                                .filter((v) => v.sid === "1")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                            <i className="fas fa-info-circle" />
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}


                            {oddsData
                                .filter((v) => v.sid === "2")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "3")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}
                        </div>
                        <div className="casino-table-box triocards mt-3">
                            {oddsData
                                .filter((v) => v.sid === "4")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "5")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "6")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "7")
                                .map((item, index) => (
                                    <div key={index} className="casino-odd-box-container">

                                        {/* Top Heading */}
                                        <div className="casino-nation-name pointer">
                                            {item.nat}
                                        </div>

                                        {/* Back Odds Box */}
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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

                                        {/* LAY (static example — suspended delay) */}
                                        <div
                                            className={`casino-odds-box lay ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.b1}</span>
                                                    <span className="casino-volume">{item.bs1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
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
                                ))}
                        </div>
                        <div className="casino-table-box trioodds mt-3">
                            {oddsData
                                .filter((v) => v.sid === "8")
                                .map((item, index) => (
                                    <div className="casino-odd-box-container" key={index}>
                                        <div className="casino-nation-name">{item.nat}</div>
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlaceBet(true);
                                                        const newBetData = {
                                                            betName: "" + item?.nat,
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
                                        <div className="casino-nation-book text-center w-100" />
                                    </div>
                                ))}

                            {oddsData
                                .filter((v) => v.sid === "9")
                                .map((item, index) => (
                                    <div className="casino-odd-box-container" key={index}>
                                        <div className="casino-nation-name">{item.nat}</div>
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlaceBet(true);
                                                        const newBetData = {
                                                            betName: "" + item?.nat,
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
                                        <div className="casino-nation-book text-center w-100" />
                                    </div>
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "10")
                                .map((item, index) => (
                                    <div className="casino-odd-box-container" key={index}>
                                        <div className="casino-nation-name">{item.nat}</div>
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlaceBet(true);
                                                        const newBetData = {
                                                            betName: "" + item?.nat,
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
                                        <div className="casino-nation-book text-center w-100" />
                                    </div>
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "11")
                                .map((item, index) => (
                                    <div className="casino-odd-box-container" key={index}>
                                        <div className="casino-nation-name">{item.nat}</div>
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlaceBet(true);
                                                        const newBetData = {
                                                            betName: "" + item?.nat,
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
                                        <div className="casino-nation-book text-center w-100" />
                                    </div>
                                ))}
                            {oddsData
                                .filter((v) => v.sid === "12")
                                .map((item, index) => (
                                    <div className="casino-odd-box-container" key={index}>
                                        <div className="casino-nation-name">{item.nat}</div>
                                        <div
                                            className={`casino-odds-box back ${remainingTime <= 3 || item.gstatus === "SUSPENDED" ? "suspended-box" : ""
                                                }`}
                                        >
                                            {remainingTime <= 3 || item.gstatus === "SUSPENDED" ? (
                                                <>
                                                    <span className="casino-odds">{item.l1}</span>
                                                    <span className="casino-volume">{item.ls1}</span>
                                                </>
                                            ) : (
                                                <span
                                                    className="casino-odds cursor-pointer hover:text-blue-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPlaceBet(true);
                                                        const newBetData = {
                                                            betName: "" + item?.nat,
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
                                        <div className="casino-nation-book text-center w-100" />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>


                {/* Results Section */}
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

    {/* MODAL MAIN */}
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
          ></button>
        </div>

        {/* BODY */}
        <div className="modal-body p-4">

          {individualResultData ? (
            <>

              {/* ROUND INFO */}
              <div className="casino-result-round-id flex justify-between text-sm font-semibold">
                <span><b>Round Id:</b> {individualResultData?.mid}</span>
                <span><b>Match Time:</b> {individualResultData?.mtime}</span>
              </div>

              {/* CARDS */}
              <div className="text-center mt-4">
                <div className="casino-result-cards flex justify-center flex-wrap gap-2 relative">
                  {individualResultData?.cards
                    ?.split(",")
                    ?.map((card) => (
                      <img
                        key={card}
                        className="h-[60px]"
                        src={cardsData.find((v) => v.code === card)?.image}
                      />
                    ))}
                </div>
              </div>

              {/* DESCRIPTION BOX */}
              {(() => {
                const parts = individualResultData?.newdesc?.split("#") || [];

                const session = parts[0] || "-";          // Yes (27)
                const oneTwoFour = parts[1] || "-";       // 1 2 4 | J Q K
                const color = parts[2] || "-";            // Red
                const oddEven = parts[3] || "-";          // "" empty
                const pattern = parts[4] || "-";          // Pair

                return (
                  <div className="row mt-4 justify-content-center">
                    <div className="col-md-8">
                      <div className="casino-result-desc">

                        <div className="casino-result-desc-item">
                          <div>Session</div>
                          <div>{session}</div>
                        </div>

                        <div className="casino-result-desc-item">
                          <div>1 2 4 / J Q K</div>
                          <div>{oneTwoFour}</div>
                        </div>

                        <div className="casino-result-desc-item">
                          <div>Color</div>
                          <div>{color}</div>
                        </div>

                        <div className="casino-result-desc-item">
                          <div>Odd/Even</div>
                          <div>{oddEven || "-"}</div>
                        </div>

                        <div className="casino-result-desc-item">
                          <div>Pattern</div>
                          <div>{pattern}</div>
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* BET HISTORY */}
              {!filteredBetHistory.length <= 0 && (
                <div className="mt-4">
                  <IndividualBetHistoryTable data={filteredBetHistory} />
                </div>
              )}

            </>
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
console.log("result item", item),   
                <span
                key={index}
                onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
                casinoIndividualResult(cookies, item.mid).then((res) => {
                setIndividualResultData(res?.data?.data?.[0]);
                });
                }}
                className={`result cursor-pointer ${item.win === "0" ? "result-a" : "result-b"
                }`}
                >
                {item.win === "0" ? "R" : "D"}
                </span>

                ))
                ) : (
                <>No Results Found</>
                )}
                </div>
            </div>

            {/* Bet Panel */}
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
                            odds={oddsData}
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
            <div className="absolute top-0 inset-0 bg-gray-900 opacity-50"></div>
            <div className="relative top-[-10px] w-full max-w-md mx-auto z-50">
                <CasinoMobileBetPopup
                    time={remainingTime}
                    gameType="casino"
                    gameName={item?.slug}
                    item={item}
                    refetchCurrentBets={refetchCurrentBets}
                    odds={oddsData}
                    myCurrentBets={myCurrentCasinoBets}
                />
            </div>
        </div>
    </div>

    {/* Mobile Bet View */}
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

export default TRIO;
