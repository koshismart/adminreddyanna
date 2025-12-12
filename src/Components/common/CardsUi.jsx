import React, { useEffect, useState } from "react";
import cardsData from "../../assets/cards/data";

export const Slider = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data && data.split(",").length > 5) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data?.split(",").length);
    }
  }, [data]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data?.split(",").length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data?.split(",").length - 1 : prevIndex - 1
    );
  };

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === data?.split(",").length - 5;

  return (
    <div className="relative md:w-48 w-28 ps-3">
      <div className="overflow-hidden">
        <div
          className={`flex ${
            data?.split(",").length >= 6 && ""
          }  md:gap-2 gap-1 transition-transform duration-500`}
          style={{ transform: `translateX(-${currentIndex * 34}px)` }}
        >
          {data?.split(",").map((v, idx) => (
            <img
              className="h-[24px] md:h-[34px] rounded-sm img-fluid"
              key={idx}
              src={cardsData?.find((card) => card.code == v)?.image || ""}
              alt={v}
            />
          ))}
        </div>
      </div>
      {data?.split(",").length > 5 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isPrevDisabled}
            className={`absolute top-1/2 -left-2 text-xl transform -translate-y-1/2 text-white font-semibold p-2 ${
              isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &#8249;
          </button>
          <button
            onClick={nextSlide}
            disabled={isNextDisabled}
            className={`absolute top-1/2 -right-5 text-xl transform -translate-y-1/2 text-white font-semibold p-2 ${
              isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

const CardsUi = ({ cardsData, game, gettingCardData }) => {
  // console.log(gettingCardData);
  console.log(game);

  if (!gettingCardData) {
    return null;
  } else {
    return (
      <>
        {game == "Ander Bahar" && (
          <>
            <Slider />
            <h1 className="text-white text-sm font-semibold uppercase">
              Ander
            </h1>
            <div className="flex gap-1 w-[20vw] overflow-x-auto no-scrollbar">
              {gettingCardData?.aall?.split(",").map((v, idx) => (
                <img
                  className="w-[34px] rounded-md img-fluid "
                  key={idx}
                  src={cardsData?.find((card) => card.code == v).image}
                  alt={v}
                />
              ))}
            </div>

            <h1 className="text-white text-sm font-semibold uppercase">
              Bahar
            </h1>
            <div className="flex gap-1 w-[20vw] overflow-x-auto no-scrollbar">
              {gettingCardData?.aall?.split(",").map((v, idx) => (
                <img
                  className="w-[34px] rounded-md img-fluid"
                  key={idx}
                  src={cardsData?.find((card) => card.code == v).image}
                  alt={v}
                />
              ))}
            </div>
          </>
        )}
        {(game == "6 Player Poker" ||
          game == "DRAGON TIGER- 20-20" ||
          game == "20-20 DRAGON TIGER LION" ||
          game == "Lucky 7 B" ||
          game == "Instant Worli" ||
          game == "20-20 DRAGON TIGER 2" ||
          game == "CasinoWar" ||
          game == "BollyWood Table") && (
          <>
            {game == "20-20 DRAGON TIGER LION" ||
              game == "Lucky 7 B" ||
              (game == "BollyWood Table" && (
                <h4 className="text-white text-sm font-semibold uppercase">
                  {game == "Lucky 7 B" || game == "BollyWood Table"
                    ? "Card"
                    : game == "CasinoWar" && "Dealer"}
                </h4>
              ))}
            <div className={`flex gap-1 mt-1 ${game ? "" : "mt-1"}`}>
              <div className="col text-white">
                {cardsData &&
                  cardsData.find((i) => i.code == gettingCardData?.C1) && (
                    <img
                      src={
                        cardsData.find((i) => i.code == gettingCardData?.C1)
                          .image
                      }
                      className="w-[34px] rounded-md img-fluid"
                      alt={
                        cardsData.find((i) => i.code == gettingCardData?.C1)
                          .name
                      }
                    />
                  )}
              </div>
              <div className="col text-white">
                {cardsData &&
                  cardsData.find((i) => i.code == gettingCardData?.C2) && (
                    <img
                      src={
                        cardsData.find((i) => i.code == gettingCardData?.C2)
                          .image
                      }
                      className="w-[34px] rounded-md img-fluid"
                      alt={
                        cardsData.find((i) => i.code == gettingCardData?.C2)
                          .name
                      }
                    />
                  )}
              </div>
              <div className="col text-white">
                {cardsData &&
                  cardsData.find((i) => i.code == gettingCardData?.C3) && (
                    <img
                      src={
                        cardsData.find((i) => i.code == gettingCardData?.C3)
                          .image
                      }
                      className="w-[34px] rounded-md img-fluid"
                      alt={
                        cardsData.find((i) => i.code == gettingCardData?.C3)
                          .name
                      }
                    />
                  )}
              </div>
              <div className="col text-white">
                {cardsData &&
                  cardsData.find((i) => i.code == gettingCardData?.C4) && (
                    <img
                      src={
                        cardsData.find((i) => i.code == gettingCardData?.C4)
                          .image
                      }
                      className="w-[34px] rounded-md img-fluid"
                      alt={
                        cardsData.find((i) => i.code == gettingCardData?.C4)
                          .name
                      }
                    />
                  )}
              </div>

              <div className="col text-white">
                {cardsData &&
                  cardsData.find((i) => i.code == gettingCardData?.C5) && (
                    <img
                      src={
                        cardsData.find((i) => i.code == gettingCardData?.C5)
                          .image
                      }
                      className="w-[34px] rounded-md img-fluid"
                      alt={
                        cardsData.find((i) => i.code == gettingCardData?.C5)
                          .name
                      }
                    />
                  )}
              </div>
              <div className="col text-white">
                {cardsData &&
                  cardsData.find((i) => i.code == gettingCardData?.C6) && (
                    <img
                      src={
                        cardsData.find((i) => i.code == gettingCardData?.C6)
                          .image
                      }
                      className="w-[34px] rounded-md img-fluid"
                      alt={
                        cardsData.find((i) => i.code == gettingCardData?.C6)
                          .name
                      }
                    />
                  )}
              </div>
            </div>
            {game == "CasinoWar" && (
              <>
                <h4 className="text-white my-1 pb-0 text-sm font-semibold uppercase">
                  {game == "Lucky 7 B" || game == "BollyWood Table"
                    ? "Card"
                    : game == "CasinoWar" && "Dealer"}
                </h4>
                <div className="col text-white"></div>
              </>
            )}
          </>
        )}
        {(game == "Poker- 1 Day" || game == "Poker- 20-20") && (
          <>
            {/* row 1 [players] */}
            <div className="flex gap-8 my-1">
              {/* player A */}
              <div>
                <h4 className="text-white text-sm font-semibold uppercase">
                  Player A
                </h4>
                <div className="flex gap-2">
                  <div className="col text-white">
                    {cardsData &&
                      cardsData.find((i) => i.code == gettingCardData?.C1) && (
                        <img
                          src={
                            cardsData.find((i) => i.code == gettingCardData?.C1)
                              .image
                          }
                          className="w-[34px] rounded-md img-fluid"
                          alt={
                            cardsData.find((i) => i.code == gettingCardData?.C1)
                              .name
                          }
                        />
                      )}
                  </div>
                  <div className="col text-white">
                    {cardsData &&
                      cardsData.find((i) => i.code == gettingCardData?.C2) && (
                        <img
                          src={
                            cardsData.find((i) => i.code == gettingCardData?.C2)
                              .image
                          }
                          className="w-[34px] rounded-md  img-fluid"
                          alt={
                            cardsData.find((i) => i.code == gettingCardData?.C2)
                              .name
                          }
                        />
                      )}
                  </div>
                </div>
              </div>
              {/* player B */}
              <div>
                <h4 className="text-white text-end text-sm font-semibold uppercase">
                  Player B
                </h4>
                <div className="flex gap-2">
                  <div className="col text-white">
                    {cardsData &&
                      cardsData.find((i) => i.code == gettingCardData?.C3) && (
                        <img
                          src={
                            cardsData.find((i) => i.code == gettingCardData?.C3)
                              .image
                          }
                          className="w-[34px] rounded-md img-fluid"
                          alt={
                            cardsData.find((i) => i.code == gettingCardData?.C3)
                              .name
                          }
                        />
                      )}
                  </div>
                  <div className="col text-white">
                    {cardsData &&
                      cardsData.find((i) => i.code == gettingCardData?.C4) && (
                        <img
                          src={
                            cardsData.find((i) => i.code == gettingCardData?.C4)
                              .image
                          }
                          className="w-[34px] rounded-md img-fluid"
                          alt={
                            cardsData.find((i) => i.code == gettingCardData?.C4)
                              .name
                          }
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
            {/* row 2 [board] */}
            <div>
              <h4 className="text-white text-sm font-semibold uppercase">
                board
              </h4>
              <div className="flex gap-2">
                <div className="col text-white">
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C5) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C5)
                            .image
                        }
                        className="w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C5)
                            .name
                        }
                      />
                    )}
                </div>
                <div className="col text-white">
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C6) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C6)
                            .image
                        }
                        className="w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C6)
                            .name
                        }
                      />
                    )}
                </div>
                <div className="col text-white">
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C7) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C7)
                            .image
                        }
                        className="w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C7)
                            .name
                        }
                      />
                    )}
                </div>
                <div className="col text-white">
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C8) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C8)
                            .image
                        }
                        className="w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C8)
                            .name
                        }
                      />
                    )}
                </div>
                <div className="col text-white">
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C9) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C9)
                            .image
                        }
                        className="w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C9)
                            .name
                        }
                      />
                    )}
                </div>
              </div>
            </div>
          </>
        )}

        {(game == "3 Patti T20" || game == "3 Patti One Day") && (
          <>
            {console.log(gettingCardData)}
            {console.log(Array.isArray(gettingCardData))}
            {Array.isArray(gettingCardData) ? (
              <>
                {gettingCardData.map((i, idx) => (
                  <div key={idx}>
                    {console.log(i)}
                    <h4 className="text-white text-sm font-semibold uppercase">
                      {i.nat}
                    </h4>
                    <div className="flex gap-2">
                      <div className="col text-white">
                        <img
                          src={cardsData.find((c) => c.code == i?.C1).image}
                          className="w-[34px] rounded-md img-fluid"
                          alt={cardsData.find((c) => c.code == i?.C1).name}
                        />
                      </div>
                      <div className="col text-white">
                        <img
                          src={cardsData.find((c) => c.code == i?.C2).image}
                          className="w-[34px] rounded-md img-fluid"
                          alt={cardsData.find((c) => c.code == i?.C2).name}
                        />
                      </div>
                      <div className="col text-white">
                        <img
                          src={cardsData.find((c) => c.code == i?.C3).image}
                          className="w-[34px] rounded-md img-fluid"
                          alt={cardsData.find((c) => c.code == i?.C3).name}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div>
                  <h4 className="text-white text-sm font-semibold uppercase">
                    Player A
                  </h4>
                  <div className="flex gap-2">
                    <div className="col text-white">
                      {cardsData &&
                        cardsData.find(
                          (i) => i.code == gettingCardData?.C1
                        ) && (
                          <img
                            src={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C1
                              ).image
                            }
                            className="w-[34px] rounded-md img-fluid"
                            alt={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C1
                              ).name
                            }
                          />
                        )}
                    </div>
                    <div className="col text-white">
                      {cardsData &&
                        cardsData.find(
                          (i) => i.code == gettingCardData?.C2
                        ) && (
                          <img
                            src={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C2
                              ).image
                            }
                            className="w-[34px] rounded-md img-fluid"
                            alt={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C2
                              ).name
                            }
                          />
                        )}
                    </div>
                    <div className="col text-white">
                      {cardsData &&
                        cardsData.find(
                          (i) => i.code == gettingCardData?.C3
                        ) && (
                          <img
                            src={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C3
                              ).image
                            }
                            className="w-[34px] rounded-md img-fluid"
                            alt={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C3
                              ).name
                            }
                          />
                        )}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white text-sm font-semibold uppercase">
                    Player B
                  </h4>
                  <div className="flex gap-2">
                    <div className="col text-white">
                      {cardsData &&
                        cardsData.find(
                          (i) => i.code == gettingCardData?.C4
                        ) && (
                          <img
                            src={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C4
                              ).image
                            }
                            className="w-[34px] rounded-md img-fluid"
                            alt={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C4
                              ).name
                            }
                          />
                        )}
                    </div>
                    <div className="col text-white">
                      {cardsData &&
                        cardsData.find(
                          (i) => i.code == gettingCardData?.C5
                        ) && (
                          <img
                            src={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C5
                              ).image
                            }
                            className="w-[34px] rounded-md img-fluid"
                            alt={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C5
                              ).name
                            }
                          />
                        )}
                    </div>
                    <div className="col text-white">
                      {cardsData &&
                        cardsData.find(
                          (i) => i.code == gettingCardData?.C6
                        ) && (
                          <img
                            src={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C6
                              ).image
                            }
                            className="w-[34px] rounded-md img-fluid"
                            alt={
                              cardsData.find(
                                (i) => i.code == gettingCardData?.C6
                              ).name
                            }
                          />
                        )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {game == "3 Patti Test" && (
          <div className="grid grid-rows-3 gap-0">
            <div>
              <h4 className="text-white text-sm font-semibold uppercase">
                Tiger
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C1) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C1)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C1)
                            .name
                        }
                      />
                    )}
                </div>
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C2) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C2)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C2)
                            .name
                        }
                      />
                    )}
                </div>
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C3) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C3)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C3)
                            .name
                        }
                      />
                    )}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold uppercase">
                Lion
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C4) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C4)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C4)
                            .name
                        }
                      />
                    )}
                </div>
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C5) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C5)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C5)
                            .name
                        }
                      />
                    )}
                </div>
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C6) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C6)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C6)
                            .name
                        }
                      />
                    )}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold uppercase">
                Dragon
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C7) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C7)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C7)
                            .name
                        }
                      />
                    )}
                </div>
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C8) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C8)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C8)
                            .name
                        }
                      />
                    )}
                </div>
                <div>
                  {cardsData &&
                    cardsData.find((i) => i.code == gettingCardData?.C9) && (
                      <img
                        src={
                          cardsData.find((i) => i.code == gettingCardData?.C9)
                            .image
                        }
                        className="w-full max-w-[34px] rounded-md img-fluid"
                        alt={
                          cardsData.find((i) => i.code == gettingCardData?.C9)
                            .name
                        }
                      />
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
        {game == "DragonTiger- 1 Day" && (
          <div className="flex gap-2">
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == gettingCardData?.C1) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == gettingCardData?.C1).image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == gettingCardData?.C1).name
                    }
                  />
                )}
            </div>
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == gettingCardData?.C2) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == gettingCardData?.C2).image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == gettingCardData?.C2).name
                    }
                  />
                )}
            </div>
          </div>
        )}
        {(game == "Amar Akbar Anthony" || game == "Lucky 7 A") && (
          <>
            <div className="text-white">
              {cardsData &&
                cardsData.find((i) => i.code == gettingCardData?.C1) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == gettingCardData?.C1).image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == gettingCardData?.C1).name
                    }
                  />
                )}
            </div>
          </>
        )}
        {(game == "32 CARD A" || game == "32 CARD B") && (
          <>
            <h4 className="text-white text-sm font-semibold uppercase">
              Player 8 :
              <span className="text-red-600 font-semibold">
                {gettingCardData?.C1}
              </span>
            </h4>
            <div className="col mx-2 text-white">
              {gettingCardData?.desc &&
                gettingCardData?.desc
                  ?.split(",")
                  ?.slice(0, 1)
                  ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                  <img
                    src={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(0, 1)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.image)}
                    className="w-[34px] rounded-md img-fluid"
                    alt={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(0, 1)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.name)}
                  />
                )}
            </div>
            <h4 className="text-white text-sm font-semibold uppercase">
              Player 9 :
              <span className="text-red-600 font-semibold">
                {gettingCardData?.C2}
              </span>
            </h4>
            <div className="col mx-2 text-white">
              {gettingCardData?.desc &&
                gettingCardData?.desc
                  ?.split(",")
                  ?.slice(1, 2)
                  ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                  <img
                    src={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(1, 2)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.image)}
                    className="w-[34px] rounded-md img-fluid"
                    alt={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(1, 2)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.name)}
                  />
                )}
            </div>
            <h4 className="text-white text-sm font-semibold uppercase">
              Player 10 :
              <span className="text-red-600 font-semibold">
                {gettingCardData?.C2}
              </span>
            </h4>
            <div className="col mx-2 text-white">
              {gettingCardData?.desc &&
                gettingCardData?.desc
                  ?.split(",")
                  ?.slice(2, 3)
                  ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                  <img
                    src={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(2, 3)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.image)}
                    className="w-[34px] rounded-md img-fluid"
                    alt={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(2, 3)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.name)}
                  />
                )}
            </div>
            <h4 className="text-white text-sm font-semibold uppercase">
              Player 11 :
              <span className="text-red-600 font-semibold">
                {gettingCardData?.C4}
              </span>
            </h4>
            <div className="col mx-2 text-white">
              {gettingCardData?.desc &&
                gettingCardData?.desc
                  ?.split(",")
                  ?.slice(3, 4)
                  ?.map((i) => cardsData?.find((c) => c.code == i)) && (
                  <img
                    src={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(3, 4)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.image)}
                    className="w-[34px] rounded-md img-fluid"
                    alt={gettingCardData?.desc
                      ?.split(",")
                      ?.slice(3, 4)
                      ?.map((i) => cardsData?.find((c) => c.code == i)?.name)}
                  />
                )}
            </div>
          </>
        )}
        {game == "Five Five Cricket" && (
          <>
            <div className="text-white">
              {
                <img
                  className="w-[34px] rounded-md img-fluid"
                  src={
                    cardsData?.find((c) => c?.code == gettingCardData?.C1)
                      ?.image
                  }
                  alt={
                    cardsData?.find((c) => c?.code == gettingCardData?.C1)?.name
                  }
                />
              }
            </div>
            <div className="text-white mt-1">
              {
                <img
                  className="w-[34px] rounded-md img-fluid"
                  src={
                    cardsData?.find((c) => c?.code == gettingCardData?.C2)
                      ?.image
                  }
                  alt={
                    cardsData?.find((c) => c?.code == gettingCardData?.C2)?.name
                  }
                />
              }
            </div>
            <div className="text-white mt-1">
              {
                <img
                  className="w-[34px] rounded-md img-fluid"
                  src={
                    cardsData?.find((c) => c?.code == gettingCardData?.C3)
                      ?.image
                  }
                  alt={
                    cardsData?.find((c) => c?.code == gettingCardData?.C3)?.name
                  }
                />
              }
            </div>
            <div className="text-white mt-1">
              {
                <img
                  className="w-[34px] rounded-md img-fluid"
                  src={
                    cardsData?.find((c) => c?.code == gettingCardData?.C4)
                      ?.image
                  }
                  alt={
                    cardsData?.find((c) => c?.code == gettingCardData?.C4)?.name
                  }
                />
              }
            </div>
            <div className="text-white mt-1">
              {
                <img
                  className="w-[34px] rounded-md img-fluid"
                  src={
                    cardsData?.find((c) => c?.code == gettingCardData?.C5)
                      ?.image
                  }
                  alt={
                    cardsData?.find((c) => c?.code == gettingCardData?.C5)?.name
                  }
                />
              }
            </div>
            <div className="text-white mt-1">
              {
                <img
                  className="w-[34px] rounded-md img-fluid"
                  src={
                    cardsData?.find((c) => c?.code == gettingCardData?.C6)
                      ?.image
                  }
                  alt={
                    cardsData?.find((c) => c?.code == gettingCardData?.C6)?.name
                  }
                />
              }
            </div>
          </>
        )}
      </>
    );
  }
};

export default CardsUi;
