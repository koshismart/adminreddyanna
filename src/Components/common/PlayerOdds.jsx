import React, { useState } from "react";
import BetModal from "./BetModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Locked from "./Locked";

const PlayerOdds = ({
  remainingTime,
  game,
  setIsBetModalOpen,
  isBetModalOpen,
  position,
  data,
  type,
  betData,
  setBetData,
}) => {
  console.log(game);
  // console.log(data);

  const extractPlayerNumber = (nat) => {
    const match = nat.match(/Player (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };
  const handleplaceBet = (e, item) => {
    e.stopPropagation();
    setIsBetModalOpen(!isBetModalOpen);
    console.log("Item clicked:", item);
    // setBetData(item);
    // setBetData({
    //   betName: data?.rname,
    //   boxColor: "bg-[#B2D6F0]",
    //   matchOdd: data?.b3,
    //   stake: 0,
    //   sid: data?.sid,
    //   oddType: "match_odds",
    //   oddCategory: "Back",
    // });
  };
  return (
    <div className="w-full mt-1">
      {game == "OpenTeenPatti" && (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <div className="flex  mb-1 gap-1">
              <div className="bg-gray-300 w-3/5 p-1"></div>
              <div className="w-8/12">
                <div className="grid w-full grid-cols-2 gap-1">
                  <div className="md:py-1  w-full bg-blue-300 text-xs font-semibold flex justify-center items-center">
                    Back (Min: 100 Max: 100000)
                  </div>
                  <div className=" bg-blue-300 text-xs font-semibold flex justify-center items-center">
                    (Min: 100 Max: 100000)
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const seen = new Set();
              const playerItems = data?.data?.t2?.filter((v) =>
                v?.nat?.includes("Player")
              );
              const nonPlayerItems = data?.data?.t2?.filter(
                (v) => !v?.nat?.includes("Player")
              );

              const pairedItems = playerItems?.map((item, index) => {
                const nonPlayerItem = nonPlayerItems[index];
                const baseNat = item?.nat
                  ?.replace(/Odd/g, "")
                  ?.replace(/Even/g, "")
                  .trim();

                if (!seen?.has(baseNat)) {
                  seen?.add(baseNat);
                  return (
                    <div className="flex gap-1 mb-1" key={baseNat}>
                      <div className="bg-gray-300 w-3/5 flex items-center p-1 font-semibold text-sm">
                        {baseNat}
                      </div>
                      <div className="w-8/12">
                        <div className="grid grid-cols-2 gap-1">
                          {remainingTime <= 3 ? (
                            <>
                              <div className="relative">
                                <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                  <span className="text-white"> LOCKED</span>
                                </div>
                                <div className="uppercase  p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                  <div>{item.rate}</div>
                                  <div>{0}</div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div
                              onClick={(e) => handleplaceBet(e, item)}
                              className="uppercase hover:bg-blue-400 cursor-pointer p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                            >
                              <div>{item.rate}</div>
                              <div>{0}</div>
                            </div>
                          )}

                          {nonPlayerItem && (
                            <>
                              {remainingTime <= 3 ? (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white"> LOCKED</span>
                                  </div>
                                  <div className="uppercase p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div>{nonPlayerItem.nat}</div>
                                    <div>{nonPlayerItem.rate}</div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  key={nonPlayerItem.sid}
                                  onClick={(e) =>
                                    handleplaceBet(e, nonPlayerItem)
                                  }
                                  className="uppercase p-1 hover:bg-blue-400 cursor-pointer bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                                >
                                  <div>{nonPlayerItem.nat}</div>
                                  <div>{nonPlayerItem.rate}</div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              });

              return pairedItems?.filter((item) => item !== null);
            })()}
          </div>
        </div>
      )}
      {game == "3 Patti T20" && (
        <div className="grid grid-cols-2 gap-1">
          <div className="grid grid-rows-3 gap-1">
            <div className="bg-gray-300 uppercase font-semibold flex items-center"></div>
            {data?.data?.t2
              ?.filter((item) => item?.nat?.includes("Player"))
              ?.map((item) => (
                <div
                  key={item.sid}
                  className="bg-gray-300 ps-1 text-sm uppercase font-semibold flex items-center"
                >
                  {item.nat}
                </div>
              ))}
          </div>
          <div className="grid grid-rows-3 gap-1">
            <div className="grid grid-cols-2 gap-1">
              <div className="bg-blue-300 uppercase font-semibold flex justify-center items-center">
                Back
              </div>
              <div className="bg-blue-300"></div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {remainingTime <= 3 ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div className="bg-blue-300 cursor-pointer  uppercase font-semibold text-center">
                      <div className="text-center text-sm">1.98</div>
                      <div className="text-sm text-center">0</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div className="bg-blue-300 cursor-pointer text-center uppercase font-semibold">
                      <div className="uppercase text-center text-sm">
                        Pair plus a
                      </div>
                      <div className="text-sm text-center">0</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setIsBetModalOpen(true)}
                    className="bg-blue-300 cursor-pointer hover:bg-blue-400 uppercase font-semibold text-center"
                  >
                    <div className="text-center text-sm">1.98</div>
                    <div className="text-sm text-center">0</div>
                  </div>
                  <div
                    onClick={() => setIsBetModalOpen(true)}
                    className="bg-blue-300 cursor-pointer hover:bg-blue-400 uppercase font-semibold text-center"
                  >
                    <div className="uppercase text-center text-sm">
                      Pair plus a
                    </div>
                    <div className="text-sm text-center">0</div>
                  </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {remainingTime <= 3 ? (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div className="bg-blue-300 cursor-pointer uppercase font-semibold text-center">
                      <div className="text-center text-sm">1.98</div>
                      <div className="text-sm text-center">0</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div className="bg-blue-300 cursor-pointer uppercase font-semibold text-center">
                      <div className="uppercase text-center text-sm">
                        Pair plus b
                      </div>
                      <div className="text-sm text-center">0</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    onClick={() => setIsBetModalOpen(true)}
                    className="bg-blue-300 cursor-pointer hover:bg-blue-400 uppercase font-semibold text-center"
                  >
                    <div className="text-center text-sm">1.98</div>
                    <div className="text-sm text-center">0</div>
                  </div>
                  <div
                    onClick={() => setIsBetModalOpen(true)}
                    className="bg-blue-300 cursor-pointer hover:bg-blue-400 uppercase font-semibold text-center"
                  >
                    <div className="uppercase text-center text-sm">
                      Pair plus b
                    </div>
                    <div className="text-sm text-center">0</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {game == "Five Five Cricket" && <></>}

      {game == "Poker- 1 Day" && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            {/* head Section */}
            <div className="bg-gray-300">
              <div className="flex flex-wrap gap-1 justify-end">
                <div className="bg-blue-300  w:10 md:w-20 flex justify-center items-center md:text-sm py-1 px-2 text-xs font-semibold md:uppercase">
                  Back
                </div>
                <div className="bg-red-300 w:10 md:w-20 flex justify-center items-center md:text-sm py-1 px-2 text-xs font-semibold md:uppercase">
                  Lay
                </div>
              </div>
            </div>

            {/* Players data Section */}
            <div className="mt-1 flex">
              <div className="w-full bg-gray-200  grid grid-cols-2 gap-1 items-center">
                {data?.data?.t2?.map((item) => (
                  <>
                    <div className="ms-2 ">
                      <p className="text-sm font-normal">{item.nat}</p>
                      <p className="text-sm font-normal">0</p>
                    </div>
                    {/* right */}
                    {console.log(item)}
                    <div className="flex gap-1 justify-end">
                      {remainingTime < 4 || item.gstatus == "SUSPENDED" ? (
                        <>
                          <div className="relative">
                            <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <FontAwesomeIcon icon={faLock} />
                              </span>
                            </div>
                            <div className="bg-blue-300 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold uppercase">
                              <p className="text-sm font-normal">{item.b1}</p>
                              <p className="text-sm font-normal">{item.bs1}</p>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <FontAwesomeIcon icon={faLock} />
                              </span>
                            </div>
                            <div className="bg-red-300 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold uppercase">
                              <p className="text-sm font-normal">{item.l1}</p>
                              <p className="text-sm font-normal">{item.ls1}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            onClick={() => setIsBetModalOpen(true)}
                            className="bg-blue-300 cursor-pointer hover:bg-blue-400 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold uppercase"
                          >
                            <p className="text-sm font-normal">{item.b1}</p>
                            <p className="text-sm font-normal">{item.bs1}</p>
                          </div>
                          <div
                            onClick={() => setIsBetModalOpen(true)}
                            className=" bg-red-300 w-20 cursor-pointer hover:bg-red-400 flex justify-center items-center flex-col text-sm py-1 font-semibold uppercase"
                          >
                            <p className="text-sm font-normal">{item.l1}</p>
                            <p className="text-sm font-normal">{item.ls1}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div>
              {/* head Section */}
              <div className="bg-gray-300">
                <div className="flex flex-wrap gap-1 justify-end">
                  <div className="bg-blue-300 w-20 flex justify-center items-center text-sm py-1 font-semibold uppercase">
                    Back
                  </div>
                  <div className="bg-blue-300 w-20 flex justify-center items-center text-sm py-1 font-semibold uppercase">
                    Back
                  </div>
                </div>
              </div>

              {/* Players data Section */}
              <div className="bg-gray-200 mt-2 flex">
                <div className="w-full grid grid-cols-2 items-center">
                  {/* left */}
                  <div className="ms-2">
                    <p className="text-sm font-normal">Player A</p>
                  </div>
                  <div className="flex gap-1 mb-1 justify-end">
                    {data?.data?.t3
                      .filter((v) => v.nat.includes("Player A"))
                      .map((item) => (
                        <>
                          {remainingTime < 4 ? (
                            <>
                              <div className="relative">
                                <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                  <span className="text-white opacity-100">
                                    <FontAwesomeIcon icon={faLock} />
                                  </span>
                                </div>
                                <div className="bg-blue-300 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold">
                                  <p className="text-xs text-center font-semibold">
                                    {item.nat}
                                  </p>

                                  <p className="text-xs text-center font-semibold">
                                    {item.b1}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                onClick={() => setIsBetModalOpen(true)}
                                className=" hover:bg-blue-400 bg-blue-300 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold"
                              >
                                <p className="text-xs text-center font-semibold">
                                  {item.nat}
                                </p>
                                <p className="text-xs text-center font-semibold">
                                  {item.b1}
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      ))}
                  </div>
                  <div className="ms-2">
                    <p className="text-sm font-normal">Player B</p>
                  </div>
                  <div className="flex gap-1 justify-end">
                    {data?.data?.t3
                      .filter((v) => v.nat.includes("Player B"))
                      .map((item) => (
                        <>
                          {remainingTime < 4 || item.gstatus === "SUSPENDED" ? (
                            <>
                              <div className="relative">
                                <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                  <span className="text-white opacity-100">
                                    <FontAwesomeIcon icon={faLock} />
                                  </span>
                                </div>
                                <div className="bg-blue-300 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold">
                                  <p className="text-xs text-center font-semibold">
                                    {item.nat}
                                  </p>

                                  <p className="text-xs text-center font-semibold">
                                    {item.b1}
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                onClick={() => setIsBetModalOpen(true)}
                                className=" hover:bg-blue-400 bg-blue-300 w-20 flex justify-center items-center flex-col text-sm py-1 font-semibold"
                              >
                                <p className="text-xs text-center font-semibold">
                                  {item.nat}
                                </p>
                                <p className="text-xs text-center font-semibold">
                                  {item.b1}
                                </p>
                              </div>
                            </>
                          )}
                        </>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(game == "3 Patti One Day" || game == "DragonTiger- 1 Day") && (
        <>
          <div className="bg-gray-200">
            <div className="grid grid-cols-2 justify-items-end">
              <div></div>
              <div className="flex gap-1">
                <div
                  className={`bg-blue-300 ${
                    game == "DragonTiger- 1 Day"
                      ? "w-10 md:w-20 font-semibold"
                      : "w-20 md:w-40 font-bold"
                  } flex justify-center items-center  uppercase`}
                >
                  {position == "odd&&even" ? "Odd" : "Back"}
                </div>
                <div
                  className={`${
                    position == "odd&&even" ? "bg-blue-300" : "bg-red-300"
                  } ${
                    game == "DragonTiger- 1 Day"
                      ? "w-10 md:w-20 font-semibold"
                      : "w-20 md:w-40 font-bold"
                  } flex justify-center items-center  uppercase`}
                >
                  {position == "odd&&even" ? "Even" : "Lay"}
                </div>
              </div>
            </div>
          </div>
          {data?.data?.t1?.map((item) => (
            <div className="bg-gray-200 my-1">
              <div className="flex flex-wrap justify-between items-center">
                <div className="text-center ms-2">
                  <div className="font-bold my-0 text-xs">
                    {/* {game == "DragonTiger- 1 Day" ? "Dragon" : "Player A"} */}
                    {item.nat}
                  </div>
                  {position == "odd&&even" ? null : (
                    <span className="text-xs">0</span>
                  )}
                </div>
                <div className="flex h-[8vh] gap-1 relative">
                  {remainingTime <= 3 || item.gstatus == "SUSPENDED" ? (
                    <>
                      <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                        <span className="text-white opacity-100 uppercase">
                          <FontAwesomeIcon icon={faLock} />
                        </span>
                      </div>
                      <div
                        onClick={() => setIsBetModalOpen(true)}
                        className={`bg-blue-300 ${
                          game == "DragonTiger- 1 Day"
                            ? "w-10 md:w-20 font-semibold"
                            : "w-20 md:w-40 font-bold"
                        } flex flex-col justify-center items-center cursor-pointer text-center font-bold uppercase`}
                      >
                        <div className="text-sm font-semibold">{item.b1}</div>
                        <div className="text-xs font-normal">{item.bs1}</div>
                      </div>
                      <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                        <span className="text-white opacity-100 uppercase">
                          <FontAwesomeIcon icon={faLock} />
                        </span>
                      </div>
                      <div
                        onClick={() => setIsBetModalOpen(true)}
                        className={`${
                          position == "odd&&even" ? "bg-blue-300" : "bg-red-300"
                        } ${
                          game == "DragonTiger- 1 Day"
                            ? "w-10 md:w-20 font-semibold"
                            : "w-20 md:w-40 font-bold"
                        } flex flex-col justify-center items-center cursor-pointer text-center font-bold uppercase`}
                      >
                        <div className="text-sm font-semibold">{item.l1}</div>
                        <div className="text-xs font-normal">{item.ls1}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => setIsBetModalOpen(true)}
                        className={`bg-blue-300 hover:bg-blue-400 ${
                          game == "DragonTiger- 1 Day"
                            ? "w-10 md:w-20 font-semibold"
                            : "w-20 md:w-40 font-bold"
                        } flex flex-col justify-center items-center cursor-pointer text-center font-bold uppercase`}
                      >
                        <div className="text-sm font-semibold">{item.b1}</div>
                        <div className="text-xs font-normal">{item.bs1}</div>
                      </div>
                      <div
                        onClick={() => setIsBetModalOpen(true)}
                        className={`${
                          position == "odd&&even"
                            ? "bg-blue-300 hover:bg-blue-400"
                            : "bg-red-300 hover:bg-red-400"
                        } ${
                          game == "DragonTiger- 1 Day"
                            ? "w-10 md:w-20 font-semibold"
                            : "w-20 md:w-40 font-bold"
                        }  cursor-pointer text-center flex flex-col justify-center items-center font-bold uppercase`}
                      >
                        <div className="text-sm flex font-semibold">
                          {item.l1}
                        </div>
                        <div className="text-xs font-normal">{item.ls1}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {/* <div className="text-center ms-2">
                <div className="font-bold my-0 text-xs">
                  {game == "DragonTiger- 1 Day" ? "Dragon" : "Player A"}
                </div>
                {position == "odd&&even" ? null : (
                  <span className="text-xs">0</span>
                )}
              </div> */}
          {/* <div className="flex h-[8vh] gap-1 relative">
                {remainingTime < 4 ? (
                  <>
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100 uppercase">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div
                      className={`bg-blue-300 ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      } cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100 uppercase">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div
                      className={`${
                        position == "odd&&even" ? "bg-blue-300" : "bg-red-300"
                      } ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      }  cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => setIsBetModalOpen(true)}
                      className={`bg-blue-300  ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      } cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                    <div
                      onClick={() => setIsBetModalOpen(true)}
                      className={`${
                        position == "odd&&even" ? "bg-blue-300" : "bg-red-300"
                      }  ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      } cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                  </>
                )}
              </div> */}

          {/* <div className="bg-gray-200 mb-1">
            <div className="flex flex-wrap justify-between items-center">
              <div className="text-center ms-2">
                <div className="font-bold text-xs">
                  {game == "DragonTiger- 1 Day" ? "Tiger" : "Player A"}
                </div>

                {position == "odd&&even" ? null : (
                  <span className="text-xs">0</span>
                )}
              </div>

              <div className="flex h-[8vh] gap-1 relative">
                {remainingTime < 4 ? (
                  <>
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100 uppercase">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div
                      className={`bg-blue-300 ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      }  cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                      <span className="text-white opacity-100 uppercase">
                        <FontAwesomeIcon icon={faLock} />
                      </span>
                    </div>
                    <div
                      className={`${
                        position == "odd&&even" ? "bg-blue-300" : "bg-red-300"
                      } ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      } cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => setIsBetModalOpen(true)}
                      className={`bg-blue-300 ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      }  cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                    <div
                      onClick={() => setIsBetModalOpen(true)}
                      className={`${
                        position == "odd&&even" ? "bg-blue-300" : "bg-red-300"
                      } ${
                        game == "DragonTiger- 1 Day"
                          ? "w-10 md:w-20 font-semibold"
                          : "w-20 md:w-40 font-bold"
                      }  cursor-pointer text-center font-bold uppercase`}
                    >
                      <div>0</div>
                      <div>0</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div> */}
        </>
      )}
      {game == "32 CARD A" && (
        <>
          <div className="grid grid-cols-2 gap-1">
            <div className="grid bg-gray-200 grid-cols-2">
              <div></div>
              <div className="flex justify-end gap-1">
                <div
                  className={`bg-blue-300 w-10 md:w-20 font-semibold flex justify-center items-center uppercase`}
                >
                  Back
                </div>
                <div
                  className={`bg-red-300 flex w-10 md:w-20 font-semibold justify-center items-center  uppercase`}
                >
                  Lay
                </div>
              </div>
            </div>
            <div className="grid bg-gray-200 grid-cols-2">
              <div></div>
              <div className="flex justify-end gap-1">
                <div
                  className={`bg-blue-300 w-10 md:w-20 font-semibold flex justify-center items-center uppercase`}
                >
                  Back
                </div>
                <div
                  className={`bg-red-300 flex w-10 md:w-20 font-semibold justify-center items-center  uppercase`}
                >
                  Lay
                </div>
              </div>
            </div>
            {data?.data?.t2.map((item) => (
              <>
                <div className="flex">
                  <div className="bg-gray-200 w-full">
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="text-center ms-2">
                        <div className="font-bold py-1 text-xs">{item.nat}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex relative">
                    {remainingTime <= 3 ? (
                      <>
                        <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                          <span className="text-white opacity-100 uppercase">
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </div>
                        <div
                          onClick={() => setIsBetModalOpen(!isBetModalOpen)}
                          className="bg-blue-300 cursor-pointer text-center justify-center items-center w-10 md:w-20 font-semibold uppercase"
                        >
                          <h1 className="font-semibold text-sm">{item.b1}</h1>
                          <p className="font-normal text-xs">{item.bs1}</p>
                        </div>
                        <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                          <span className="text-white opacity-100 uppercase">
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </div>
                        <div
                          onClick={() => setIsBetModalOpen(!isBetModalOpen)}
                          className="bg-red-300  cursor-pointer text-center  justify-center items-center w-10 md:w-20 font-semibold uppercase"
                        >
                          <h1 className="font-semibold text-sm">{item.l1}</h1>
                          <p className="font-normal text-xs">{item.ls1}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          onClick={(e) => {
                            handleplaceBet(e, item),
                              setIsBetModalOpen(!isBetModalOpen);
                          }}
                          className="bg-blue-300 cursor-pointer text-center justify-center items-center w-10 md:w-20 font-semibold uppercase"
                        >
                          <h1 className="font-semibold text-sm">{item.b1}</h1>
                          <p className="font-normal text-xs">{item.bs1}</p>
                        </div>
                        <div
                          onClick={() => setIsBetModalOpen(!isBetModalOpen)}
                          className="bg-red-300  cursor-pointer text-center  justify-center items-center w-10 md:w-20 font-semibold uppercase"
                        >
                          <h1 className="font-semibold text-sm">{item.l1}</h1>
                          <p className="font-normal text-xs">{item.ls1}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ))}
          </div>
        </>
      )}
      {game === "32 CARD B" && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="border border-1 p-2 my-2">
              <div className="flex mb-1 gap-1">
                <div className="bg-gray-300 w-full p-1"></div>
                <div className=" w-2/5">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="uppercase p-1 bg-blue-300 text-sm font-semibold flex justify-center items-center">
                      Back
                    </div>
                    <div className="uppercase p-1 bg-red-300 text-sm font-semibold flex justify-center items-center">
                      Lay
                    </div>
                  </div>
                </div>
              </div>

              {(() => {
                const seen = new Set();
                return data?.data?.t2
                  .filter((item) => {
                    const playerNumber = extractPlayerNumber(item?.nat);
                    return playerNumber !== null && playerNumber % 2 === 0;
                  })
                  .map((item) => {
                    const baseNat = item.nat
                      .replace(/Odd/g, "")
                      .replace(/Even/g, "")
                      .trim();
                    if (!seen.has(baseNat)) {
                      seen.add(baseNat);
                      return (
                        <div className="flex gap-1">
                          <div
                            className="bg-gray-300 flex items-center w-full p-2 mb-1 font-semibold text-sm "
                            key={baseNat}
                          >
                            {baseNat}
                          </div>

                          <div className=" w-2/5">
                            <div className="relative">
                              {remainingTime <= 3 ||
                              item.gstatus == "SUSPENDED" ? (
                                <div className="grid grid-cols-2 gap-1 mb-1">
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white opacity-100">
                                      <FontAwesomeIcon icon={faLock} />
                                    </span>
                                  </div>
                                  <div className="uppercase  cursor-pointer p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.b1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.bs1}
                                    </div>
                                  </div>
                                  <div className="uppercase p-1 cursor-pointer bg-red-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.l1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.ls1}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="grid grid-cols-2 gap-1 mb-1">
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase hover:bg-blue-400 cursor-pointer p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.b1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.bs1}
                                      </div>
                                    </div>
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase p-1 hover:bg-red-400 cursor-pointer bg-red-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.l1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.ls1}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                  .filter((item) => item !== null);
              })()}
            </div>
            <div className="border border-1 p-2 my-2">
              <div className="flex mb-1 gap-1">
                <div className="bg-gray-300 w-full p-1"></div>
                <div className=" w-2/5">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="uppercase p-1 bg-blue-300 text-sm font-semibold flex justify-center items-center">
                      Back
                    </div>
                    <div className="uppercase p-1 bg-red-300 text-sm font-semibold flex justify-center items-center">
                      Lay
                    </div>
                  </div>
                </div>
              </div>
              {(() => {
                const seen = new Set();
                return data?.data?.t2
                  .filter(
                    (v) =>
                      !v?.nat?.includes("Player") &&
                      !v.nat.includes("Single") &&
                      !v.nat.includes("Total")
                  )
                  .map((item) => {
                    const baseNat = item.nat
                      .replace(/Odd/g, "")
                      .replace(/Even/g, "")
                      .trim();
                    if (!seen.has(baseNat)) {
                      seen.add(baseNat);
                      return (
                        <div className="flex gap-1">
                          <div
                            className="bg-gray-300 w-full mb-1  p-1 font-semibold text-sm "
                            key={baseNat}
                          >
                            {baseNat}
                          </div>
                          <div className=" w-2/5">
                            <div className="relative">
                              {remainingTime <= 3 ||
                              item.gstatus == "SUSPENDED" ? (
                                <div className="grid grid-cols-2 gap-1 mb-1">
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white opacity-100">
                                      <FontAwesomeIcon icon={faLock} />
                                    </span>
                                  </div>
                                  <div className="uppercase hover:bg-blue-400 cursor-pointer p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.b1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.bs1}
                                    </div>
                                  </div>
                                  <div className="uppercase p-1 hover:bg-red-400 cursor-pointer bg-red-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.l1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.ls1}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="grid grid-cols-2 gap-1 mb-1">
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase hover:bg-blue-400 cursor-pointer p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.b1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.bs1}
                                      </div>
                                    </div>
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase p-1 hover:bg-red-400 cursor-pointer bg-red-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.l1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.ls1}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                  .filter((item) => item !== null);
              })()}
            </div>
          </div>

          <div>
            <div className="border border-1 p-2 my-2">
              <div className="flex mb-1 gap-1">
                <div className="bg-gray-300 w-full p-1"></div>
                <div className=" w-2/5">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="uppercase p-1 bg-blue-300 text-sm font-semibold flex justify-center items-center">
                      Odd
                    </div>
                    <div className="uppercase p-1 bg-blue-300  text-sm font-semibold flex justify-center items-center">
                      Even
                    </div>
                  </div>
                </div>
              </div>
              {(() => {
                const seen = new Set();
                return data?.data?.t2
                  .filter((item) => {
                    const playerNumber = extractPlayerNumber(item?.nat);
                    return playerNumber !== null && playerNumber % 2 !== 0;
                  })
                  .map((item) => {
                    const baseNat = item.nat
                      .replace(/Odd/g, "")
                      .replace(/Even/g, "")
                      .trim();

                    if (!seen.has(baseNat)) {
                      seen.add(baseNat);
                      return (
                        <div className="flex gap-1">
                          <div
                            className="bg-gray-300 flex items-center w-full mb-1 p-1 font-semibold text-sm "
                            key={baseNat}
                          >
                            {baseNat}
                          </div>
                          <div className=" w-2/5">
                            <div className="relative">
                              {remainingTime <= 3 ||
                              item.gstatus == "SUSPENDED" ? (
                                <div className="grid grid-cols-2 gap-1 mb-1">
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white opacity-100">
                                      <FontAwesomeIcon icon={faLock} />
                                    </span>
                                  </div>
                                  <div className="uppercase  p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.b1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.bs1}
                                    </div>
                                  </div>
                                  <div className="uppercase p-1  bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.l1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.ls1}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="grid grid-cols-2 gap-1 mb-1">
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase hover:bg-blue-400 cursor-pointer p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.b1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.bs1}
                                      </div>
                                    </div>
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase p-1 hover:bg-blue-400 cursor-pointer bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.l1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.ls1}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                  .filter((item) => item !== null);
              })()}
            </div>
            <div className="border border-1 p-2 my-2">
              {(() => {
                const seen = new Set();
                return data?.data?.t2
                  .filter((v) => v.nat.includes("Total"))
                  .map((item) => {
                    const baseNat = item.nat
                      .replace(/Odd/g, "")
                      .replace(/Even/g, "")
                      .trim();
                    if (!seen.has(baseNat)) {
                      seen.add(baseNat);
                      return (
                        <div className="flex gap-1">
                          <div
                            className="bg-gray-300 w-full flex items-center mb-1 p-1 font-semibold text-sm "
                            key={baseNat}
                          >
                            {baseNat}
                          </div>
                          <div className=" w-2/5">
                            <div className="relative">
                              {remainingTime <= 3 ||
                              item.gstatus == "SUSPENDED" ? (
                                <div className="grid grid-cols-1 gap-1 mb-1">
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white opacity-100">
                                      <FontAwesomeIcon icon={faLock} />
                                    </span>
                                  </div>
                                  <div className="uppercase p-1 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center">
                                    <div className="text-sm font-semibold">
                                      {item.b1}
                                    </div>
                                    <div className="text-xs font-normal">
                                      {item.bs1}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="grid grid-cols-1 gap-1 mb-1">
                                    <div
                                      onClick={(e) => handleplaceBet(e, item)}
                                      className="uppercase p-1 cursor-pointer hover:bg-blue-400 bg-blue-300 text-sm font-semibold flex flex-col justify-center items-center"
                                    >
                                      <div className="text-sm font-semibold">
                                        {item.b1}
                                      </div>
                                      <div className="text-xs font-normal">
                                        {item.bs1}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                  .filter((item) => item !== null);
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerOdds;
