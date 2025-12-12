import React from "react";
import GradientButton from "./GradientButton";
import PlayerOdds from "./PlayerOdds";
import { allKings } from "../../assets/cards/data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

function ComplexOdds({
  game,
  cardsData,
  time,
  setIsBetModalOpen,
  isBetModalOpen,
  data,
  tab,
}) {
  console.log(game);
  console.log(data);
  console.log(cardsData);

  const handlePlaceBet = (e, data) => {
    e.stopPropagation();
    setIsBetModalOpen(!isBetModalOpen);
    console.log("Item clicked:", data);
  };

  let groupedData;
  if (data) {
    groupedData = data?.data?.t2?.reduce((acc, item) => {
      if (!acc[item.nat]) {
        acc[item.nat] = { playerA: null, playerB: null };
      }
      if (!acc[item.nat].playerA) {
        acc[item.nat].playerA = item;
      } else {
        acc[item.nat].playerB = item;
      }
      return acc;
    }, {});
  }

  return (
    <div className="w-full mt-1">
      {game == "Ander Bahar" && (
        <div className="grid grid-row-2 gap-3">
          <div className="flex bg-orange-400">
            <div className=" border-2 border-black p-4 flex justify-center items-center">
              Andar
            </div>
            <div className="border-2 border-black flex-row ">
              {/* {data.} */}
            </div>
          </div>
        </div>
      )}
      {game == "Race 2020" && (
        <div className="grid grid-rows-2 gap-2">
          <div className="bg-gray-300 grid grid-cols-4 justify-items-center gap-2">
            {data?.data?.t2
              ?.filter((v) => v.nat.includes("K"))
              .map((item) => (
                <div className="w-full">
                  <div className="flex justify-center items-center gap-3">
                    <img
                      className="w-1/5 object-contain"
                      src={allKings.find((v) => v.name == item.nat).image}
                    />
                    {/* {console.log(item)} */}
                    {/* <span>i</span> */}
                  </div>
                  <div className="grid grid-cols-2 my-2 justify-items-center w-full">
                    <div className="border w-4/5 mx-auto border-1 flex flex-col justify-center items-center hover:border-2 border-blue-700">
                      <div className="text-sm font-semibold my-0">
                        {item.b1}
                      </div>
                      <div className="text-xs">{item.bs1}</div>
                    </div>
                    <div className="border w-4/5 mx-auto border-1 flex flex-col justify-center items-center hover:border-2 border-red-700">
                      <div className="text-sm font-semibold my-0">
                        {item.l1}
                      </div>
                      <div className="text-xs">{item.ls1}</div>
                    </div>
                  </div>
                  <div className="my-2 flex justify-center items-center">
                    {0}
                  </div>
                </div>
              ))}
          </div>
          {/* <div className="flex gap-2 mb-3">
            <div className="bg-gray-300  w-2/5">
              <div className="grid grid-rows-3">
                <div className="flex items-center gap-3 justify-around my-2">
                  <div></div>
                  <div className="text-sm font-semibold">No</div>
                  <div className="text-sm font-semibold">Yes</div>
                </div>
                <div className="flex gap-2 ps-3 items-center justify-around my-2">
                  <div className="text-sm font-semibold">Total points</div>
                  <div className="text-sm font-semibold w-1/4 border mx-auto border-1 flex flex-col justify-center items-center hover:border-2 border-blue-700">
                    {
                      data?.data?.t2?.filter((v) =>
                        v.nat.includes("Total point")
                      )[0].b1
                    }
                    <div className="text-xs">
                      {
                        data?.data?.t2?.filter((v) =>
                          v.nat.includes("Total point")
                        )[0].bs1
                      }
                    </div>
                  </div>
                  <div className="text-sm font-semibold w-1/4 border mx-auto border-1 flex flex-col justify-center items-center hover:border-2 border-red-700">
                    {
                      data?.data?.t2?.filter((v) =>
                        v.nat.includes("Total point")
                      )[0].bs1
                    }
                  </div>
                </div>
                <div className="flex gap-2 ps-3 justify-around my-2">
                  <div className="text-sm font-semibold">Total cards</div>
                  <div className="text-sm font-semibold w-1/4 border mx-auto border-1 flex flex-col justify-center items-center hover:border-2 border-blue-700">
                    {
                      data?.data?.t2?.filter((v) =>
                        v.nat.includes("Total point")
                      )[0].b1
                    }
                    <div className="text-xs">
                      {
                        data?.data?.t2?.filter((v) =>
                          v.nat.includes("Total point")
                        )[0].bs1
                      }
                    </div>
                  </div>
                  <div className="text-sm font-semibold w-1/4 border mx-auto border-1 flex flex-col justify-center items-center hover:border-2 border-red-700">
                    {
                      data?.data?.t2?.filter((v) =>
                        v.nat.includes("Total point")
                      )[0].bs1
                    }
                  </div> </div>
              </div>
            </div>
            <div className="bg-gray-300  w-3/5"></div>
          </div> */}
        </div>
      )}

      {game == "CasinoWar" && (
        <>
          <div
            className={`flex justify-end gap-8 me-3 my-1 ${game ? "" : "mt-1"}`}
          >
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == data?.data?.t1[0]?.C1) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C1)
                        .image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C1)
                        .name
                    }
                  />
                )}
            </div>
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == data?.data?.t1[0]?.C2) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C2)
                        .image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C2)
                        .name
                    }
                  />
                )}
            </div>
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == data?.data?.t1[0]?.C3) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C3)
                        .image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C3)
                        .name
                    }
                  />
                )}
            </div>
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == data?.data?.t1[0]?.C4) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C4)
                        .image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C4)
                        .name
                    }
                  />
                )}
            </div>

            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == data?.data?.t1[0]?.C5) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C5)
                        .image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C5)
                        .name
                    }
                  />
                )}
            </div>
            <div className="col text-white">
              {cardsData &&
                cardsData.find((i) => i.code == data?.data?.t1[0]?.C6) && (
                  <img
                    src={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C6)
                        .image
                    }
                    className="w-[34px] rounded-md img-fluid"
                    alt={
                      cardsData.find((i) => i.code == data?.data?.t1[0]?.C6)
                        .name
                    }
                  />
                )}
            </div>
          </div>
          {/* <div className="grid grid-cols-2"> */}
          <div>
            {Array.from(
              new Set(
                data?.data?.t2
                  .filter((v) => v.nat)
                  .map((item) => {
                    const modifiedNat = item.nat
                      .replace(/[123456]/g, "")
                      .trim();
                    return modifiedNat;
                  })
              )
            ).map((uniqueNat, index) => (
              <div className="flex gap-1" key={index}>
                <div className="bg-gray-300 w-full flex items-center text-sm font-semibold ps-2 mb-1">
                  {uniqueNat}
                </div>
                <div className="grid grid-cols-6 gap-1 w-full">
                  {data?.data?.t2
                    ?.filter((v) => v?.nat?.includes(uniqueNat))
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-blue-300 flex justify-center items-center py-1 w-full mb-1"
                      >
                        {item.b1}
                      </div>
                    ))}
                </div>
              </div>
            ))}
            <div></div>
          </div>
          {/* </div> */}
        </>
      )}
      {game == "BACCARAT1" ||
        (game == "BACCARAT2" && (
          <div className="bg-gray-300 p-2 border border-1">
            <div className="flex gap-2 justify-end items-center">
              {data?.data?.t2
                ?.filter(
                  (v) =>
                    v?.nat?.includes("Perferct Pair") ||
                    v?.nat?.includes("Either Pair") ||
                    v?.nat?.includes("Small") ||
                    v?.nat?.includes("Big")
                )
                .map((item) => (
                  <div key={item.sid} className="relative">
                    {time <= 3 && (
                      <div className="absolute inset-0 mx-2 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                        <span className="text-white uppercase">locked</span>
                      </div>
                    )}
                    <div
                      key={item.sid}
                      className="px-2 py-1 w-full justify-center text-white bg-gray-800 mx-2"
                    >
                      <h1 className="capitalize flex justify-center items-center text-xs font-normal">
                        {item.nat}{" "}
                        <span className="ms-1">
                          {item.b1} : {item.gstatus}
                        </span>
                      </h1>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col items-center md:flex-row my-3">
              <div className="md:w-1/4 w-full">statistics</div>
              <div className="md:w-3/4 w-full">
                <div className="grid grid-cols-5">
                  {data?.data?.t2
                    ?.filter(
                      (v) =>
                        !v?.nat?.includes("Perferct Pair") &&
                        !v?.nat?.includes("Either Pair") &&
                        !v?.nat?.includes("Small") &&
                        !v?.nat?.includes("Big")
                    )
                    .map((item, idx) => (
                      <div className="relative">
                        {time <= 3 ? (
                          <>
                            <div
                              className={`absolute inset-0 ${
                                idx == 0 && "rounded-tl-3xl rounded-bl-3xl me-2"
                              } ${
                                idx == 4 && "rounded-tr-3xl rounded-br-3xl ms-2"
                              } bg-black  opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10`}
                            >
                              <span className="text-white uppercase">
                                locked
                              </span>
                            </div>
                            <div
                              key={item.sid}
                              className={`py-4 w-full text-white ${
                                idx == 0 && "rounded-tl-3xl rounded-bl-3xl me-2"
                              } ${idx == 0 || idx == 1 ? "bg-blue-400" : ""}  ${
                                idx == 2 ? "bg-green-400" : ""
                              } ${idx == 3 || idx == 4 ? "bg-red-600" : ""} ${
                                idx == 4 && "rounded-tr-3xl rounded-br-3xl ms-2"
                              }`}
                            >
                              <h1 className="uppercase flex justify-center text-center items-center text-sm font-semibold">
                                {item.nat}{" "}
                              </h1>
                              <h1 className="text-center">
                                {item.b1} : {item.gstatus}
                              </h1>
                            </div>
                          </>
                        ) : (
                          <div
                            key={item.sid}
                            className={`py-4 text-white ${
                              idx == 0 && "rounded-tl-3xl rounded-bl-3xl me-2"
                            } ${idx == 0 || idx == 1 ? "bg-blue-400" : ""}  ${
                              idx == 2 ? "bg-green-400" : ""
                            } ${idx == 3 || idx == 4 ? "bg-red-600" : ""} ${
                              idx == 4 && "rounded-tr-3xl rounded-br-3xl ms-2"
                            }`}
                          >
                            <h1 className="uppercase flex justify-center text-center items-center text-sm font-semibold">
                              {item.nat}{" "}
                            </h1>
                            <h1 className="text-center">
                              {item.b1} : {item.gstatus}
                            </h1>
                            {/* {console.log(data.data.t1)} */}
                            {/* <img  className="" src={cardsData.filter((v)=>v.code ==data.data.t1[0].C1).image}/> */}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      {game == "Amar Akbar Anthony" && (
        <>
          {/* top */}
          <div className="bg-gray-200 my-1">
            <div className="grid grid-cols-3 py-3 justify-items-center">
              <div className="w-2/3 text-center">
                <h2 className="text-lg font-semibold">
                  <span className="text-red-900 ">A.</span> Amar
                </h2>
                <div className="grid grid-cols-2 w-full">
                  <div className="bg-blue-300 ">0</div>
                  <div className="bg-red-300">0</div>
                </div>
                <span>0</span>
              </div>
              <div className="w-2/3 text-center">
                <h2 className="text-lg font-semibold">
                  <span className="text-red-900 ">B.</span> Akbar
                </h2>
                <div className="grid grid-cols-2 w-full">
                  <div className="bg-blue-300 ">0</div>
                  <div className="bg-red-300">0</div>
                </div>
                <span>0</span>
              </div>
              <div className="w-2/3 text-center">
                <h2 className="text-lg font-semibold">
                  <span className="text-red-900 ">C.</span> Anthony
                </h2>
                <div className="grid grid-cols-2 w-full">
                  <div className="bg-blue-300 ">0</div>
                  <div className="bg-red-300">0</div>
                </div>
                <span>0</span>
              </div>
            </div>
          </div>

          {/* mid */}
          <div className="bg-gray-200 my-1">
            <div className="grid grid-cols-3 py-3 justify-items-center">
              <div className="grid grid-rows-2 gap-3 w-full">
                {/* even */}
                <div className="w-full text-center">
                  <GradientButton name="Even" rate={0} />
                </div>
                {/* odd */}
                <div className="w-full text-center">
                  <GradientButton name="Odd" rate={0} />
                </div>
              </div>
              <div className="grid grid-rows-2 gap-3 w-full">
                {/* card symbol */}
                <div className="w-full text-center">
                  <GradientButton
                    name="Even"
                    symbolTop={true}
                    symbol={true}
                    rate={0}
                  />
                </div>
                {/* card symbol */}
                <div className="w-full text-center">
                  <GradientButton
                    name="Odd"
                    symbolBottom={true}
                    symbol={true}
                    rate={0}
                  />
                </div>
              </div>
              <div className="grid grid-rows-2 gap-3 w-full">
                {/* under 7 */}
                <div className="w-full text-center">
                  <GradientButton name="Under 7" rate={0} />
                </div>
                {/* over 7 */}
                <div className="w-full text-center">
                  <GradientButton name="Over 7" rate={0} />
                </div>
              </div>
            </div>
          </div>
          {/* bottom */}
          {/* <div className="bg-gray-200 my-2 ">
            <div className="gird grid-rows-3 justify-items-center">
              <div className="flex justify-end items-center"> icon</div>
              <div className="flex justify-center items-center">
                <span>12</span>
              </div>
              {}
              <div className="flex justify-center items-center">
                <div className="container">
                  <div className="flex mx-auto my-4 w-3/4 overflow-x-auto gap-4 justify-center">
                    {cardsData?.map((i, idx) => (
                      <>
                        <img key={idx} className="w-10" src={i.image} />
                        {console.log(i)}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </>
      )}
      {game == "DragonTiger- 1 Day" && (
        <>
          {/*  top */}
          <div className="mb-1 grid grid-cols-2 w-full gap-2 justify-center place-items-center">
            {/* left */}
            <PlayerOdds
              remainingTime={time}
              setIsBetModalOpen={setIsBetModalOpen}
              isBetModalOpen={isBetModalOpen}
              game={game}
            />
            {/* right */}
            <div className="w-full">
              <GradientButton time={time} bg={"gray"} name="Pair" rate={0} />
            </div>
          </div>
          {/* mid */}
          <div className="mb-1 grid grid-cols-2 w-full gap-2 justify-center place-items-center">
            {/* left */}
            <PlayerOdds
              remainingTime={time}
              setIsBetModalOpen={setIsBetModalOpen}
              isBetModalOpen={isBetModalOpen}
              game={game}
              position={"odd&&even"}
            />
            {/* right */}
            <PlayerOdds
              remainingTime={time}
              setIsBetModalOpen={setIsBetModalOpen}
              isBetModalOpen={isBetModalOpen}
              game={game}
              symbolType={true}
              color={true}
            />
          </div>
          {/*bottom*/}
          <div className="mb-1 grid grid-cols-2 w-full gap-2 justify-center place-items-center">
            <div className="bg-gray-200">
              <div className="w-full justify-items-end">
                <div className="grid grid-cols-5 gap-2 w-full"></div>
              </div>
            </div>
          </div>
        </>
      )}
      {(game == "DRAGON TIGER- 20-20" || game == "20-20 DRAGON TIGER 2") && (
        <>
          <div className="mb-1 grid grid-cols-4 items-center w-full gap-2 bg-gray-300 justify-center place-items-center">
            <div className="w-full">
              <GradientButton time={time} name="Dragon" rate={0} />
            </div>
            <div className="w-1/2">
              <GradientButton time={time} name="Tie" rate={0} />
            </div>
            <div className="w-full">
              <GradientButton time={time} name="Tiger" rate={0} />
            </div>
            <div className="w-full">
              <GradientButton time={time} name="Pair" rate={0} />
              <div className="mx-3 flex gap-1 justify-end ">
                <h2 className="text-sm">
                  <span className="font-semibold">Min</span>:100
                </h2>
                <h2 className="text-sm">
                  <span className="font-semibold">Max</span>:300000
                </h2>
              </div>
            </div>
          </div>
          <div className="mb-1 grid grid-cols-2 w-full gap-2 justify-center place-items-center">
            <div className="bg-gray-300 w-full">
              <h1 className="uppercase text-xl text-center font-normal">
                Dragon
              </h1>
              <div className="grid grid-cols-2">
                <div className="w-full">
                  <GradientButton time={time} name="Dragon" rate={0} />
                </div>
                <div className="w-full">
                  <GradientButton time={time} name="Dragon" rate={0} />
                  <div className="mx-3 flex gap-1 justify-end ">
                    <h2 className="text-sm">
                      <span className="font-semibold">Min</span>:100
                    </h2>
                    <h2 className="text-sm">
                      <span className="font-semibold">Max</span>:300000
                    </h2>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="w-full">
                  <GradientButton
                    name="Even"
                    time={time}
                    symbolTop={true}
                    symbol={true}
                    rate={0}
                  />
                </div>
                <div className="w-full">
                  <GradientButton
                    name="Even"
                    time={time}
                    symbolTop={true}
                    symbol={true}
                    rate={0}
                  />
                  <div className="mx-3 flex gap-1 justify-end ">
                    <h2 className="text-sm">
                      <span className="font-semibold">Min</span>:100
                    </h2>
                    <h2 className="text-sm">
                      <span className="font-semibold">Max</span>:300000
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-300 w-full">
              <h1 className="uppercase text-xl text-center font-normal">
                Tiger
              </h1>
              <div className="grid grid-cols-2">
                <div className="w-full">
                  <GradientButton time={time} name="Dragon" rate={0} />
                </div>
                <div className="w-full">
                  <GradientButton time={time} name="Dragon" rate={0} />
                  <div className="mx-3 flex gap-1 justify-end ">
                    <h2 className="text-sm">
                      <span className="font-semibold">Min</span>:100
                    </h2>
                    <h2 className="text-sm">
                      <span className="font-semibold">Max</span>:300000
                    </h2>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="w-full">
                  <GradientButton
                    name="Even"
                    time={time}
                    symbolTop={true}
                    symbol={true}
                    rate={0}
                  />
                </div>
                <div className="w-full">
                  <GradientButton
                    name="Even"
                    time={time}
                    symbolTop={true}
                    symbol={true}
                    rate={0}
                  />
                  <div className="mx-3 flex gap-1 justify-end ">
                    <h2 className="text-sm">
                      <span className="font-semibold">Min</span>:100
                    </h2>
                    <h2 className="text-sm">
                      <span className="font-semibold">Max</span>:300000
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {game == "20-20 DRAGON TIGER LION" && (
        <>
          <div className="grid grid-cols-2 gap-2 mb-1">
            <div className="grid grid-cols-2">
              <div className="bg-gray-300 mb-1"></div>
              <div className="grid grid-cols-3 gap-1 mb-1">
                <div className="bg-blue-300 text-sm text-center font-semibold uppercase">
                  Dragon
                </div>
                <div className="bg-blue-300 text-sm text-center font-semibold  uppercase">
                  tiger
                </div>
                <div className="bg-blue-300 text-sm text-center font-semibold  uppercase">
                  lion
                </div>
              </div>
              {data?.data?.t2
                .filter((v) => v?.nat?.includes("D"))
                .slice(0, 9)
                .map((item) => {
                  const modifiedNat = item.nat
                    .replace(/Dragon/g, "")
                    .replace(/D/g, "");
                  return (
                    <>
                      <div className="bg-gray-300 flex items-center mb-1">
                        <h1 className="ms-2 text-sm font-semibold">
                          {modifiedNat}
                        </h1>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mb-1">
                        {data?.data?.t2
                          .filter((item) => item.nat.includes(modifiedNat))
                          .map((item) => (
                            <div key={item.sid} className="relative ">
                              {time <= 3 ? (
                                <>
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white uppercase">
                                      locked
                                    </span>
                                  </div>
                                  <div
                                    key={item.sid}
                                    className="bg-blue-300 text-sm text-center font-semibold uppercase"
                                  >
                                    <h1 className="text-sm font-semibold">
                                      {item.b1}
                                    </h1>

                                    <h1 className="text-sm">{item.gstatus}</h1>
                                  </div>
                                </>
                              ) : (
                                <div
                                  key={item.sid}
                                  className="bg-blue-300 hover:bg-blue-400 cursor-pointer text-sm text-center font-semibold uppercase"
                                  onClick={(e) => handlePlaceBet(e, item)}
                                >
                                  <h1 className="text-sm font-semibold">
                                    {item.b1}
                                  </h1>

                                  <h1 className="text-sm">{item.gstatus}</h1>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </>
                  );
                })}
            </div>
            <div className="grid grid-cols-2">
              <div className="bg-gray-300 mb-1"></div>
              <div className="grid grid-cols-3 gap-1 mb-1">
                <div className="bg-blue-300 text-sm text-center font-semibold uppercase">
                  Dragon
                </div>
                <div className="bg-blue-300 text-sm text-center font-semibold  uppercase">
                  tiger
                </div>
                <div className="bg-blue-300 text-sm text-center font-semibold  uppercase">
                  lion
                </div>
              </div>
              {data?.data?.t2
                .filter((v) => v?.nat?.includes("D"))
                .slice(9, 18)
                .map((item) => {
                  const modifiedNat = item.nat
                    .replace(/Dragon/g, "")
                    .replace(/D/g, "");
                  return (
                    <>
                      <div className="bg-gray-300 flex items-center mb-1">
                        <h1 className="ms-2 text-sm font-semibold">
                          {modifiedNat}
                        </h1>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mb-1">
                        {data?.data?.t2
                          .filter((item) => item.nat.includes(modifiedNat))
                          .map((item) => (
                            <div key={item.sid} className="relative ">
                              {time <= 3 ? (
                                <>
                                  <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                                    <span className="text-white uppercase">
                                      locked
                                    </span>
                                  </div>
                                  <div
                                    key={item.sid}
                                    className="bg-blue-300 text-sm text-center font-semibold uppercase"
                                  >
                                    <h1 className="text-sm font-semibold">
                                      {item.b1}
                                    </h1>

                                    <h1 className="text-sm">{item.gstatus}</h1>
                                  </div>
                                </>
                              ) : (
                                <div
                                  key={item.sid}
                                  className="bg-blue-300 hover:bg-blue-400 cursor-pointer text-sm text-center font-semibold uppercase"
                                  onClick={(e) => handlePlaceBet(e, item)}
                                >
                                  <h1 className="text-sm font-semibold">
                                    {item.b1}
                                  </h1>

                                  <h1 className="text-sm">{item.gstatus}</h1>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </>
      )}
      {game == "3 Patti Test" && (
        <>
          <div className="grid grid-cols-2 gap-1">
            <div className="grid grid-rows-8 gap-1">
              <div className="bg-gray-300 flex items-center py-2"></div>
              <div className="bg-gray-300 flex items-center py-2"></div>

              {data?.data?.t2?.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-300 flex items-center py-2"
                >
                  <h1 className="ms-2 text-sm font-semibold">{item.nat}</h1>
                </div>
              ))}
            </div>

            <div className="grid grid-rows-8 gap-1">
              <div className="bg-blue-300 flex justify-center items-center">
                <h1 className="uppercase font-semibold text-sm text-center">
                  Back
                </h1>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="bg-blue-300 flex justify-center items-center">
                  <h1 className="uppercase font-semibold text-sm text-center">
                    Tiger
                  </h1>
                </div>
                <div className="bg-blue-300 flex justify-center items-center">
                  <h1 className="uppercase font-semibold text-sm text-center">
                    Lion
                  </h1>
                </div>
                <div className="bg-blue-300 flex justify-center items-center">
                  <h1 className="uppercase font-semibold text-sm text-center">
                    Dragon
                  </h1>
                </div>
              </div>

              {data?.data?.t2?.map((item) => (
                <div key={item.id} className="grid grid-cols-3 gap-1">
                  <div className="flex h-[8vh] gap-1 relative">
                    {time <= 3 ? (
                      <>
                        <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                          <span className="text-white opacity-100">
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </div>
                        <div className="bg-blue-300 flex cursor-auto justify-center w-full h-full items-center font-semibold uppercase">
                          {item.trate}
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={(e) => handlePlaceBet(e, item)}
                        className="bg-blue-300 cursor-pointer flex justify-center items-center w-full h-full font-semibold uppercase"
                      >
                        <h1 className="text-sm font-semibold">{item.trate}</h1>
                        <h1 className="text-sm font-semibold">{0}</h1>
                      </div>
                    )}
                  </div>

                  <div className="flex h-[8vh] gap-1 relative">
                    {time <= 3 ? (
                      <>
                        <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                          <span className="text-white opacity-100">
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </div>
                        <div className="bg-blue-300 flex cursor-auto justify-center items-center w-full h-full font-semibold uppercase">
                          {item.lrate}
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={(e) => handlePlaceBet(e, item)}
                        className="bg-blue-300 cursor-pointer flex justify-center items-center w-full h-full font-semibold uppercase"
                      >
                        {item.lrate}
                      </div>
                    )}
                  </div>

                  <div className="flex h-[8vh] gap-1 relative">
                    {time <= 3 ? (
                      <>
                        <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                          <span className="text-white opacity-100">
                            <FontAwesomeIcon icon={faLock} />
                          </span>
                        </div>
                        <div className="bg-blue-300 flex cursor-auto justify-center items-center w-full h-full font-semibold uppercase">
                          {item.drate}
                        </div>
                      </>
                    ) : (
                      <div
                        onClick={(e) => handlePlaceBet(e, item)}
                        className="bg-blue-300 cursor-pointer flex justify-center items-center w-full h-full font-semibold uppercase"
                      >
                        {item.drate}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {game === "Poker- 20-20" && (
        <div className="grid grid-cols-3 gap-1">
          {/* Column for nat */}
          <div className="grid grid-rows-10 gap-1">
            <div className="bg-gray-300 flex items-center py-2"></div>
            {data?.data?.t2
              ?.reduce((acc, item) => {
                if (!acc.find((i) => i.nat === item.nat)) {
                  acc.push(item);
                }
                return acc;
              }, [])
              .map((item) => (
                <div
                  key={item.nat}
                  className="bg-gray-300 flex items-center py-2"
                >
                  <h1 className="ms-2 text-sm font-semibold">{item.nat}</h1>
                </div>
              ))}
          </div>

          {/* Column for Player A rates */}
          <div className="grid grid-rows-10 gap-1">
            <div className="bg-blue-300 flex justify-center items-center py-2">
              Player A
            </div>
            {data?.data?.t2
              ?.reduce((acc, item) => {
                if (!acc.find((i) => i.nat === item.nat)) {
                  acc.push(item);
                }
                return acc;
              }, [])
              .map((item) => (
                <div className="relative" key={item.sid}>
                  {time <= 3 ? (
                    <>
                     <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <FontAwesomeIcon icon={faLock} />
                              </span>
                            </div>
                      <div className="bg-blue-300 flex cursor-auto justify-center w-full h-full items-center font-semibold uppercase">
                        {groupedData && groupedData[item.nat]?.playerA?.rate}
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={(e) =>
                        handlePlaceBet(e, groupedData[item.nat]?.playerA)
                      }
                      className="bg-blue-300 cursor-pointer flex justify-center items-center w-full h-full font-semibold uppercase"
                    >
                      <h1 className="text-sm font-semibold">
                        {groupedData && groupedData[item.nat]?.playerA?.rate}
                      </h1>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Column for Player B rates */}
          <div className="grid grid-rows-10 gap-1">
            <div className="bg-blue-300 flex justify-center items-center py-2">
              Player B
            </div>
            {data?.data?.t2
              ?.reduce((acc, item) => {
                if (!acc.find((i) => i.nat === item.nat)) {
                  acc.push(item);
                }
                return acc;
              }, [])
              .map((item) => (
                <div className="relative" key={item.sid}>
                  {time <= 3 ? (
                    <>
                     <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                              <span className="text-white opacity-100">
                                <FontAwesomeIcon icon={faLock} />
                              </span>
                            </div>
                      <div className="bg-blue-300 hover:bg-blue-400 flex cursor-auto justify-center w-full h-full items-center font-semibold uppercase">
                        {groupedData && groupedData[item.nat]?.playerB?.rate}
                      </div>
                    </>
                  ) : (
                    <div
                      onClick={(e) =>
                        handlePlaceBet(e, groupedData[item.nat]?.playerB)
                      }
                      className="bg-blue-300 hover:bg-blue-400 cursor-pointer flex justify-center items-center w-full h-full font-semibold uppercase"
                    >
                      <h1 className="text-sm font-semibold">
                        {groupedData && groupedData[item.nat]?.playerB?.rate}
                      </h1>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {game == "Instant Worli" && <>{console.log(data)}</>}
      {
        (game = "6 Player Poker" && tab == 1 && (
          <div className="bg-gray-300 grid gap-2 grid-cols-2 px-4">
            <div className="grid grid-rows-3">
              {data?.data?.t2
                ?.filter((v) => v?.nat?.includes("Player"))
                .slice(0, 3)
                .map((item) => (
                  <div className="my-2 w-full">
                    <GradientButton
                      time={time}
                      game={game}
                      name={item.nat}
                      rate={0}
                      setIsBetModalOpen={setIsBetModalOpen}
                      isBetModalOpen={isBetModalOpen}
                    />
                  </div>
                ))}
            </div>

            <div className="grid grid-rows-3">
              {data?.data?.t2
                ?.filter((v) => v?.nat?.includes("Player"))
                .slice(3, 6)
                .map((item) => (
                  <div className="my-2 w-full">
                    <GradientButton
                      time={time}
                      game={game}
                      name={item.nat}
                      rate={0}
                      setIsBetModalOpen={setIsBetModalOpen}
                      isBetModalOpen={isBetModalOpen}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))
      }
      {
        (game = "6 Player Poker" && tab == 2 && (
          <div className="bg-gray-300 grid gap-2 grid-cols-2 px-4">
            <div className="grid grid-rows-3">
              {data?.data?.t2
                ?.filter((v) => !v?.nat?.includes("Player"))
                .slice(0, 3)
                .map((item) => (
                  <div className="my-2 w-full">
                    <GradientButton
                      time={time}
                      game={game}
                      name={item.nat}
                      rate={0}
                      setIsBetModalOpen={setIsBetModalOpen}
                      isBetModalOpen={isBetModalOpen}
                    />
                  </div>
                ))}
            </div>

            <div className="grid grid-rows-3">
              {data?.data?.t2
                ?.filter((v) => !v?.nat?.includes("Player"))
                .slice(3, 6)
                .map((item) => (
                  <div className="my-2 w-full">
                    <GradientButton
                      time={time}
                      game={game}
                      name={item.nat}
                      rate={0}
                    />
                  </div>
                ))}
            </div>
          </div>
        ))
      }
    </div>
  );
}

export default ComplexOdds;
