import React, { useState, useRef, useEffect } from "react";

const OurCasino = () => {
  const [activeTab, setActiveTab] = useState("all");
  const tabsContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const casinoCategories = [
    { id: "all", name: "All Casino" },
    { id: "roulette", name: "Roulette" },
    { id: "teenpatti", name: "Teenpatti" },
    { id: "poker", name: "Poker" },
    { id: "baccarat", name: "Baccarat" },
    { id: "dragontiger", name: "Dragon Tiger" },
    { id: "cards32", name: "32 Cards" },
    { id: "andarbahar", name: "Andar Bahar" },
    { id: "lucky7", name: "Lucky 7" },
    { id: "cardjudgement", name: "3 Card Judgement" },
    { id: "casinowar", name: "Casino War" },
    { id: "worli", name: "Worli" },
    { id: "sports", name: "Sports" },
    { id: "bollywood", name: "Bollywood" },
    { id: "lottery", name: "Lottery" },
    { id: "queen", name: "Queen" },
    { id: "race", name: "Race" },
    { id: "others", name: "Others" },
  ];

  const casinoGames = [
    // All Casino Games
    {
      id: "dolidana",
      category: "all",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/dolidana.gif",
    },
    {
      id: "mogambo",
      category: "all",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/mogambo.gif",
    },
    {
      id: "lucky5",
      category: "all",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/lucky5.jpg",
    },

    // Roulette Games
    {
      id: "roulette12",
      category: "roulette",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/roulette12.jpg",
    },
    {
      id: "roulette13",
      category: "roulette",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/roulette13.jpg",
    },
    {
      id: "roulette11",
      category: "roulette",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/roulette11.jpg",
    },
    {
      id: "ourroullete",
      category: "roulette",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/ourroullete.jpg",
    },

    // Teenpatti Games
    {
      id: "poison",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/poison.jpg",
    },
    {
      id: "teenunique",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teenunique.jpg",
    },
    {
      id: "poisonteenpatti20",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/poison20.jpg",
    },
    {
      id: "jokerteenpatti120",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/joker120.jpg",
    },
    {
      id: "joker20",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/joker20.jpg",
    },
    {
      id: "jokerteenpatti1",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/joker1.jpg",
    },
    {
      id: "teenpattit20c",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen20c.jpg",
    },
    {
      id: "teen41",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen41.jpg",
    },
    {
      id: "teen42",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen42.jpg",
    },
    {
      id: "teenpattiinstant3",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen33.jpg",
    },
    {
      id: "teenpattiinstant2",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen32.jpg",
    },
    {
      id: "teenpattioneday",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen.jpg",
    },
    {
      id: "teenpattit20",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen20.jpg",
    },
    {
      id: "teenpattitest",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen9.jpg",
    },
    {
      id: "teenpattiopen",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen8.jpg",
    },
    {
      id: "teenpatti2",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen6.jpg",
    },
    {
      id: "teenpatti2cards",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/patti2.jpg",
    },
    {
      id: "teenmuf",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teenmuf.jpg",
    },
    {
      id: "teenpattit20b",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen20b.jpg",
    },
    {
      id: "1card2020",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen120.jpg",
    },
    {
      id: "1card1day",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen1.jpg",
    },
    {
      id: "teenpattiinstant",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teen3.jpg",
    },

    // Poker Games
    {
      id: "pokeroneday",
      category: "poker",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/poker.jpg",
    },
    {
      id: "poker20",
      category: "poker",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/poker20.jpg",
    },
    {
      id: "poker6player",
      category: "poker",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/poker6.jpg",
    },

    // Baccarat Games
    {
      id: "baccarat",
      category: "baccarat",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/baccarat.jpg",
    },
    {
      id: "baccarat2",
      category: "baccarat",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/baccarat2.jpg",
    },
    {
      id: "29cardbaccarat",
      category: "baccarat",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/teensin.jpg",
    },

    // Dragon Tiger Games
    {
      id: "dragontigert20",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/dt20.jpg",
    },
    {
      id: "dragontigeroneday",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/dt6.jpg",
    },
    {
      id: "dragontigerliont20",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/dtl20.jpg",
    },
    {
      id: "dragontigert202",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/dt202.jpg",
    },

    // 32 Cards Games
    {
      id: "card32a",
      category: "cards32",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/card32.jpg",
    },
    {
      id: "card32b",
      category: "cards32",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/card32eu.jpg",
    },

    // Andar Bahar Games
    {
      id: "andar-bahar",
      category: "andarbahar",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/ab20.jpg",
    },
    {
      id: "andar-bahar2",
      category: "andarbahar",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/abj.jpg",
    },
    {
      id: "ab4",
      category: "andarbahar",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/ab4.jpg",
    },
    {
      id: "ab3",
      category: "andarbahar",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/ab3.jpg",
    },

    // Lucky 7 Games
    {
      id: "lucky7",
      category: "lucky7",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/lucky7.jpg",
    },
    {
      id: "lucky7eu",
      category: "lucky7",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/lucky7eu.jpg",
    },
    {
      id: "lucky7eu2",
      category: "lucky7",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/lucky7eu2.jpg",
    },
    {
      id: "lucky15",
      category: "lucky7",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/lucky15.jpg",
    },

    // 3 Card Judgement Games
    {
      id: "3cardj",
      category: "cardjudgement",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/3cardj.jpg",
    },

    // Casino War Games
    {
      id: "war",
      category: "casinowar",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/war.jpg",
    },

    // Worli Games
    {
      id: "worli",
      category: "worli",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/worli.jpg",
    },
    {
      id: "instantworli",
      category: "worli",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/worli2.jpg",
    },

    // Sports Games
    {
      id: "superover3",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/superover3.jpg",
    },
    {
      id: "goal",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/goal.jpg",
    },
    {
      id: "superover2",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/superover2.jpg",
    },
    {
      id: "ballbyball",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/ballbyball.jpg",
    },
    {
      id: "cricketv3",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/cricketv3.jpg",
    },
    {
      id: "cmatch20",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/cmatch20.jpg",
    },
    {
      id: "superover",
      category: "sports",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/superover.jpg",
    },

    // Bollywood Games
    {
      id: "bollywoodtable2",
      category: "bollywood",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/btable2.jpg",
    },
    {
      id: "bollywoodtable",
      category: "bollywood",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/btable.jpg",
    },

    // Lottery Games
    {
      id: "lottery",
      category: "lottery",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/lottcard.jpg",
    },

    // Queen Games
    {
      id: "queen",
      category: "queen",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/queen.jpg",
    },

    // Race Games
    {
      id: "race20",
      category: "race",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/race20.jpg",
    },
    {
      id: "raceto17",
      category: "race",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/race17.jpg",
    },
    {
      id: "race2",
      category: "race",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/race2.jpg",
    },

    // Others Games
    {
      id: "sicbo2",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/sicbo2.jpg",
    },
    {
      id: "sicbo",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/sicbo.jpg",
    },
    {
      id: "aaa",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/aaa.jpg",
    },
    {
      id: "meter",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/cmeter.jpg",
    },
    {
      id: "trap",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/trap.jpg",
    },
    {
      id: "trio",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/trio.jpg",
    },
    {
      id: "notenum",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/notenum.jpg",
    },
    {
      id: "kbc",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/kbc.jpg",
    },
    {
      id: "aaa2",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/aaa2.jpg",
    },
    {
      id: "dum10",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/dum10.jpg",
    },
    {
      id: "cmeter1",
      category: "others",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/cmeter1.jpg",
    },
  ];

  const filteredGames =
    activeTab === "all"
      ? casinoGames
      : casinoGames.filter((game) => game.category === activeTab);

  const scrollTabs = (direction) => {
    if (!tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const scrollAmount = 200;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }

    // Update arrow visibility after a short delay
    setTimeout(updateArrowVisibility, 100);
  };

  const updateArrowVisibility = () => {
    if (!tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    updateArrowVisibility();

    // Add resize listener
    window.addEventListener("resize", updateArrowVisibility);

    return () => {
      window.removeEventListener("resize", updateArrowVisibility);
    };
  }, []);

  useEffect(() => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.addEventListener(
        "scroll",
        updateArrowVisibility
      );
    }

    return () => {
      if (tabsContainerRef.current) {
        tabsContainerRef.current.removeEventListener(
          "scroll",
          updateArrowVisibility
        );
      }
    };
  }, []);

  return (
    <div data-v-b00d14ae="">
      <div data-v-b00d14ae="">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Our Casino</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Our Casino</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="card">
          <div className="casino-tabs-admin p-2">
            <div
              className="casino-tabs-menu w-100"
              style={{ position: "relative" }}
            >
              {showLeftArrow && (
                <div
                  className="arrow-tabs arrow-left"
                  onClick={() => scrollTabs("left")}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <i className="mdi mdi-chevron-left" />
                </div>
              )}
              <ul
                className="nav nav-tabs nav-tabs-custom"
                ref={tabsContainerRef}
                style={{
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                  flexWrap: "nowrap",
                  scrollBehavior: "smooth",
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE and Edge
                  padding: "0 40px", // Add padding for arrows
                }}
              >
                {casinoCategories.map((category) => (
                  <li
                    key={category.id}
                    className="nav-item"
                    style={{ display: "inline-block", float: "none" }}
                  >
                    <button
                      onClick={() => setActiveTab(category.id)}
                      className={`nav-link ${
                        activeTab === category.id ? "active" : ""
                      }`}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              {/* Hide scrollbar for Webkit browsers */}
              <style>
                {`
                  .nav-tabs-custom::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {showRightArrow && (
                <div
                  className="arrow-tabs arrow-right"
                  onClick={() => scrollTabs("right")}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                  }}
                >
                  <i className="mdi mdi-chevron-right" />
                </div>
              )}
            </div>
          </div>{" "}
          <div className="casino-banners">
            {filteredGames.map((game) => (
              <div key={game.id} className="casino-banner-item">
                <a href={`/admin/casino/${game.id}`} className="">
                  <img
                    className="img-fluid"
                    src={game.image}
                    alt={game.id}
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCasino;
