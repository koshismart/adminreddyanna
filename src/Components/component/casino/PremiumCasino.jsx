import React, { useState } from "react";

const PremiumCasino = () => {
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
      id: "pteen",
      name: "Premium Teenpatti",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/pteen.jpg",
      link: "/admin/pcasino/pteen",
    },
    {
      id: "pteen20",
      name: "Premium Teenpatti 20",
      category: "teenpatti",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/pteen20.jpg",
      link: "/admin/pcasino/pteen20",
    },
    {
      id: "pbaccarat",
      name: "Premium Baccarat",
      category: "baccarat",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/pbaccarat.jpg",
      link: "/admin/pcasino/pbaccarat",
    },
    {
      id: "pdt20",
      name: "Premium Dragon Tiger 20",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/pdt20.jpg",
      link: "/admin/pcasino/pdt20",
    },
    {
      id: "pdt6",
      name: "Premium Dragon Tiger 6",
      category: "dragontiger",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/pdt6.jpg",
      link: "/admin/pcasino/pdt6",
    },
    {
      id: "pcard32",
      name: "Premium 32 Cards",
      category: "cards32",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/pcard32.jpg",
      link: "/admin/pcasino/pcard32",
    },
    {
      id: "plucky7",
      name: "Premium Lucky 7",
      category: "lucky7",
      image: "https://nd.sprintstaticdata.com/casino-icons/lc/plucky7.jpg",
      link: "/admin/pcasino/plucky7",
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
              <h4 className="mb-0 font-size-18">Premium Casino</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Premium Casino</span>
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

export default PremiumCasino;
