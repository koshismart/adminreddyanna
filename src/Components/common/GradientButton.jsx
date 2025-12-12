import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const GradientButton = ({
  name,
  rate,
  symbol,
  symbolTop,
  symbolBottom,
  time,
  bg,
  game,
  setIsBetModalOpen,
  isBetModalOpen,
}) => {
  console.log(setIsBetModalOpen);
  if (!name) {
    return null;
  } else {
    return (
      <div
        className={`${
          game == "6 Player Poker" ? "grid-rows-1" : "grid-rows-3"
        }grid  ${
          bg === "gray" && "bg-gray-200 p-2"
        } text-center justify-items-center relative`}
      >
        {!game == "6 Player Poker" && (
          <div className="flex items-center justify-center">{rate}</div>
        )}
        {time <= 3 ? (
          <div className="relative w-4/5">
            <button className="gradient cursor-auto w-full text-center flex justify-center items-center relative">
              <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
                <span className="text-white opacity-100">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              {name}
            </button>
          </div>
        ) : symbol ? (
          <button className="gradient w-4/5 text-center flex justify-center items-center">
            {symbolTop && (
              <>
                <span className="text-red-700 text-md">&#9830;</span>
                <span className="text-red-700 text-md">&#9829;</span>
              </>
            )}
            {symbolBottom && (
              <>
                <span className="text-black text-md">&#9827;</span>
                <span className="text-black text-md">&#9824;</span>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setIsBetModalOpen(!isBetModalOpen)}
            className="gradient w-4/5 uppercase"
          >
            {name}
          </button>
        )}
        {!game == "6 Player Poker" && (
          <div className="flex items-center justify-center">0</div>
        )}
      </div>
    );
  }
};

export default GradientButton;
