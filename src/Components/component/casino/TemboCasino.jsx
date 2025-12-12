import React, { useState } from "react";

const TemboCasino = () => {
  const [activeTab, setActiveTab] = useState("all");

  const casinoCategories = [
    { id: "all", name: "All Casino" },
    { id: "teenpatti", name: "Teenpatti" },
    { id: "baccarat", name: "Baccarat" },
    { id: "dragontiger", name: "Dragon Tiger" },
    { id: "lucky7", name: "Lucky 7" },
    { id: "cards32", name: "32 Cards" },
  ];

  const casinoGames = [
    {
      id: "tteen",
      name: "Tembo Teenpatti",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tteen.jpg",
      link: "/admin/tcasino/tteen",
    },
    {
      id: "tteen20",
      name: "Tembo Teenpatti 20",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tteen20.jpg",
      link: "/admin/tcasino/tteen20",
    },
    {
      id: "tbaccarat",
      name: "Tembo Baccarat",
      category: "baccarat",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tbaccarat.jpg",
      link: "/admin/tcasino/tbaccarat",
    },
    {
      id: "tdt20",
      name: "Tembo Dragon Tiger 20",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tdt20.jpg",
      link: "/admin/tcasino/tdt20",
    },
    {
      id: "tdt6",
      name: "Tembo Dragon Tiger 6",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tdt6.jpg",
      link: "/admin/tcasino/tdt6",
    },
    {
      id: "tcard32",
      name: "Tembo 32 Cards",
      category: "cards32",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tcard32.jpg",
      link: "/admin/tcasino/tcard32",
    },
    {
      id: "tlucky7",
      name: "Tembo Lucky 7",
      category: "lucky7",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/tlucky7.jpg",
      link: "/admin/tcasino/tlucky7",
    },
  ];

  const filteredGames =
    activeTab === "all"
      ? casinoGames
      : casinoGames.filter((game) => game.category === activeTab);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleArrowClick = (direction) => {
    const currentIndex = casinoCategories.findIndex(
      (cat) => cat.id === activeTab
    );
    let newIndex;

    if (direction === "left") {
      newIndex =
        currentIndex <= 0 ? casinoCategories.length - 1 : currentIndex - 1;
    } else {
      newIndex =
        currentIndex >= casinoCategories.length - 1 ? 0 : currentIndex + 1;
    }

    setActiveTab(casinoCategories[newIndex].id);
  };

  return (
    <div data-v-b00d14ae="">
      <div data-v-b00d14ae="">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Tembo Casino</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Tembo Casino</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="card">
          <div className="casino-tabs-admin p-2">
            <div className="casino-tabs-menu w-100">
              <div
                className="arrow-tabs arrow-left"
                onClick={() => handleArrowClick("left")}
              >
                <i className="mdi mdi-chevron-left" />
              </div>
              <ul className="nav nav-tabs nav-tabs-custom">
                {casinoCategories.map((category) => (
                  <li key={category.id} className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === category.id ? "active" : ""
                      }`}
                      onClick={() => handleTabClick(category.id)}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div
                className="arrow-tabs arrow-right"
                onClick={() => handleArrowClick("right")}
              >
                <i className="mdi mdi-chevron-right" />
              </div>
            </div>
          </div>{" "}
          <div className="casino-banners">
            {filteredGames.map((game) => (
              <div key={game.id} className="casino-banner-item">
                <a href={game.link} className="">
                  <img
                    className="img-fluid"
                    src={game.image}
                    alt={game.name}
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

export default TemboCasino;
