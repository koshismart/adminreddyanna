import React from "react";
import cardsData from "../../assets/cards/data";

const Modal = ({ title, content, isOpen, onClose }) => {
  // console.log(content);
  console.log(title);
  if (!isOpen) return null;

  if (!content) {
    return null;
  } else {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-gray-900 opacity-50"
          onClick={onClose}
        ></div>

        <div className="bg-white w-full py-3 px-4 rounded-lg z-50 relative max-w-md mx-auto">
          <div className="flex justify-between items-center border-b mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onClose}
            >
              X
            </button>
          </div>
          {!content ? (
            <h2 className="flex justify-center items-center font-semibold text-sm">
              Loading...!!!
            </h2>
          ) : (
            <div className="my-3">
              <div>
                <h4 className="text-end text-sm font-semibold">
                  Round Id:{content?.mid}
                </h4>
              </div>
              {(title == "32 CARD A" || title == "32 CARD B") && (
                <>
                  {console.log(
                    content?.cards
                      ?.split(",")
                      ?.map((item, index) => ({
                        id: index,
                        code: item.trim(),
                      }))
                      .filter((v) => v.code !== "1")
                      .map((item) =>
                        cardsData.find((v) => v.code === item.code)
                      )
                  )}
                  {content?.cards
                    ?.split(",")
                    ?.map((item, index) => ({
                      id: index,
                      code: item.trim(),
                    }))
                    .filter((v) => v.code !== "1")
                    .map((item) => {
                      const cardData = cardsData.find(
                        (v) => v.code === item.code
                      );
                      return cardData ? { ...cardData, id: item.id } : null;
                    })
                    .filter(Boolean)
                    .map((item, idx, arr) => {
                      // console.log(arr);
                      const position = idx % 4;
                      const row = Math.floor(idx / 4);

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-center ${
                            row > 0 ? "mt-4" : ""
                          }`}
                          style={{ order: position }}
                        >
                          <div className="flex flex-col justify-center items-center">
                            <h1 className="py-2 text-sm font-semibold">{`${
                              idx < 4 ? `Player ${idx + 8}` : ""
                            }`}</h1>
                            {idx < 4 && (
                              <img
                                src={item.image}
                                className="img-fluid w-9/12"
                                alt={item.name}
                              />
                            )}
                          </div>

                          {content.win == idx + 1 && (
                            <div className="relative">
                              <h2 className="absolute -right-20 top-0">
                                winner
                              </h2>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </>
              )}
              {(title == "3 Patti T20" ||
                title == "3 Patti Test" ||
                title == "Poker- 1 Day" ||
                title == "Poker- 20-20" ||
                title == "3 Patti One Day") && (
                <>
                  <div className="flex my-10  ">
                    <div className="w-1/2 grid grid-cols-3 relative">
                      <h1 className="absolute -top-10">
                        {title == "3 Patti Test" ? "Tiger" : "Player A"}
                      </h1>
                      {content?.cards
                        ?.split(",")
                        ?.slice(
                          title == "Poker- 1 Day" || title == "Poker- 20-20"
                            ? 0
                            : 2,
                          title == "Poker- 1 Day" || title == "Poker- 20-20"
                            ? 2
                            : 3
                        )
                        ?.map((item, idx) => (
                          <img
                            key={idx}
                            src={cardsData.find((v) => v.code === item).image}
                            alt={cardsData.find((v) => v.code === item).name}
                            className="img-fluid w-9/12"
                          />
                        ))}

                      {content.sid == "11,13" && (
                        <div className="relative">
                          <h2 className="absolute -right-20 top-0">winner</h2>
                        </div>
                      )}
                    </div>

                    {/* Vertical divider */}
                    <div className="border-l-2 border-gray-400 mx-4"></div>

                    <div className="w-1/2 grid grid-cols-3 relative">
                      <h1 className="absolute -top-10">
                        {title == "3 Patti Test" ? "Lion" : "Player B"}
                      </h1>
                      {content?.cards
                        ?.split(",")
                        ?.slice(
                          title == "Poker- 1 Day" || title == "Poker- 20-20"
                            ? 2
                            : 3,
                          title == "Poker- 1 Day" || title == "Poker- 20-20"
                            ? 4
                            : 6
                        )
                        ?.map((item, idx) => (
                          <img
                            key={idx}
                            src={cardsData.find((v) => v.code === item).image}
                            alt={cardsData.find((v) => v.code === item).name}
                            className="img-fluid w-9/12"
                          />
                        ))}

                      {content.sid == "21" && (
                        <div className="relative">
                          <h2 className="absolute -right-20 top-0">winner</h2>
                        </div>
                      )}
                    </div>

                    {title == "3 Patti Test" && (
                      <>
                        <div className="border-l-2 border-gray-400 mx-4"></div>

                        <div className="w-1/2 grid grid-cols-3 relative">
                          <h1 className="absolute -top-10">Dragon</h1>
                          {content?.cards
                            ?.split(",")
                            ?.slice(6, 9)
                            ?.map((item, idx) => (
                              <img
                                key={idx}
                                src={
                                  cardsData.find((v) => v.code === item).image
                                }
                                alt={
                                  cardsData.find((v) => v.code === item).name
                                }
                                className="img-fluid w-9/12"
                              />
                            ))}

                          {content.sid == "31,32" && (
                            <div className="relative">
                              <h2 className="absolute -right-20 top-0">
                                winner
                              </h2>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  {/* Vertical divider */}
                  <div className="border-t-2 my-3 border-gray-400 mx-4"></div>
                  {title == "Poker- 1 Day" ||
                    (title == "Poker- 20-20" && (
                      <>
                        <div className="border-l-2 border-gray-400 mx-4"></div>

                        <div className="w-full grid grid-cols-5 relative h-1/4">
                          <h1 className="absolute buttom-10">Table</h1>
                          {content?.cards
                            ?.split(",")
                            ?.slice(4, 9)
                            ?.map((item, idx) => (
                              <img
                                key={idx}
                                src={
                                  cardsData.find((v) => v.code === item).image
                                }
                                alt={
                                  cardsData.find((v) => v.code === item).name
                                }
                                className="img-fluid w-2/4"
                              />
                            ))}

                          {content.sid == "31,32" && (
                            <div className="relative">
                              <h2 className="absolute -right-20 top-0">
                                winner
                              </h2>
                            </div>
                          )}
                        </div>
                      </>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Modal;
