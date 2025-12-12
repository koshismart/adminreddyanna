import React, { useState } from "react";
import Modal from "./Modal";
import { casinoIndividualResult } from "../../helpers/casino";
import { cardShape } from "../../assets/cards/data";

const LastResults = ({
  data,
  individualResultData,
  gameName,
  setIndividualResultData,
  cookies,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(data);
  console.log(gameName);
  // console.log(individualResultData);
  const getResultText = (result, gameName) => {
    if (gameName == "BollyWood Table") {
      switch (result) {
        case "6":
          return "F";
        case "5":
          return "E";
        case "4":
          return "D";
        case "3":
          return "C";
        case "2":
          return "B";
        case "1":
          return "A";
      }
    } else if (gameName == "BACCARAT1" || gameName == "BACCARAT2") {
      switch (result) {
        case "1":
          return "P";
        case "2":
          return "B";
        default:
          return "T";
      }
    } else if (
      gameName == "Instant Worli" ||
      gameName == "CasinoWar" ||
      gameName == "OpenTeenPatti"
    ) {
      switch (result) {
        default:
          return "R";
      }
    } else if (gameName == "Poker- 20-20") {
      switch (result) {
        case "11":
          return "A";
        case "21":
          return "B";
        case "0":
          return "0";
        default:
          return "";
      }
    } else if (gameName == "32 CARD A" || gameName == "32 CARD B") {
      switch (result) {
        case "4":
          return "11";
        case "3":
          return "10";
        case "2":
          return "9";
        case "1":
          return "8";
        default:
          return "";
      }
    } else if (gameName == "Five Five Cricket") {
      switch (result) {
        case "2":
          return "I";
        case "1":
          return "A";
        case "0":
          return "AB";
        default:
          return "";
      }
    } else if (gameName == "Lucky 7 A" || gameName == "Lucky 7 B") {
      switch (result) {
        case "1":
          return "L";
        case "2":
          return "H";
        case "0":
          return "T";
      }
    } else if (gameName === "3 Patti One Day" && result === "2") {
      return "B";
    } else if (gameName === "Poker- 1 Day") {
      if (result == "11") {
        return "A";
      } else {
        return "B";
      }
    } else if (gameName === "6 Player Poker") {
      console.log(result);
      if (result == "15") {
        return "5";
      } else if (result == "0") {
        return "0";
      } else if (result == "14") {
        return "4";
      } else if (result == "11") {
        return "1";
      } else if (result == "16") {
        return "6";
      } else if (result == "12") {
        return "2";
      }
    }
    if (
      gameName == "DragonTiger- 1 Day" ||
      gameName == "DRAGON TIGER- 20-20" ||
      gameName == "20-20 DRAGON TIGER 2"
    ) {
      switch (result) {
        case "1":
          return "D";
        case "2":
          return "T";
        case "3":
          return "Tie";
        default:
          return "";
      }
    } else if (gameName == "20-20 DRAGON TIGER LION") {
      switch (result) {
        case "1":
          return "D";
        case "21":
          return "T";
        case "41":
          return "L";
        default:
          return "";
      }
    } else if (
      gameName == "Amar Akbar Anthony" &&
      (result == "1" || result == "2" || result == "3")
    ) {
      switch (result) {
        case "1":
          return "C";
        case "2":
          return "A";
        case "3":
          return "B";
      }
    } else {
      switch (result) {
        case "1":
          return "A";
        case "3":
          return "B";
        case "11":
          return "T";
        case "21":
          return "L";
        case "31":
          return "D";
        default:
          return "";
      }
    }
  };

  return (
    <>
      <div className="result bg-[#2c3e50d9] py-1 mb-1">
        <div className="flex text-md justify-between px-2 text-white">
          <p>Last Result</p>
          <p
            className="cursor-pointer text-md hover:underline"
            onClick={() => console.log("view all")}
          >
            View All
          </p>
        </div>
      </div>
      {console.log(data)}
      {gameName == "Race 2020" ? (
        <div className="flex justify-end md:mt-1 m-1 gap-1">
          {data?.map((item, index) => (
            <img
              src={cardShape?.find((v) => v?.codeRace == item?.result)?.image}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                casinoIndividualResult(cookies, item.mid).then((res) => {
                  setIndividualResultData(res.data.data.data[0]);
                });
                setIsModalOpen(true);
              }}
              className={`h-7 object-cover border border-1 border-black cursor-pointer hover:bg-gray-300 flex justify-center items-center w-7 rounded-full`}
            />
          ))}
        </div>
      ) : (
        <div
          className={`flex justify-end ${
            gameName == "DragonTiger- 1 Day" ? "mb-4" : "md:mt-1 m-1"
          } gap-1`}
        >
          {data ? (
            data?.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setIndividualResultData(undefined);
                  setIsModalOpen(true);
                  casinoIndividualResult(cookies, item.mid).then((res) => {
                    setIndividualResultData(res.data.data.data[0]);
                  });
                }}
                className={` h-6  cursor-pointer font-semibold hover:bg-green-950  bg-green-800 ${
                  item.result == 1 ? "text-red-500" : "text-yellow-400"
                }  flex justify-center items-center w-6 rounded-full`}
              >
                {getResultText(item.result, gameName)}
              </div>
            ))
          ) : (
            <>No Results Found</>
          )}

          <Modal
            title={gameName}
            content={individualResultData}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default LastResults;
