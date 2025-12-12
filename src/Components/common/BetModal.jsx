import React from "react";
import BetPopup from "../../PopUps/BetPopup";

const BetModal = ({ isOpen, onClose, betData, placeBet, setPlaceBet }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-end md:justify-end z-50 bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i>
        </button>
        <div className="ml-1 w-full">
          <div>
            <h1 className="text-xl font-bold underline mt-0">
              <i className="mr-2 fa-solid fa-circle-info"></i>Bollywood Casino
            </h1>
          </div>
          <div className="w-full">
            <div className="">
              {placeBet && (
                <BetPopup
                  betData={betData}
                  placeBet={placeBet}
                  setPlaceBet={setPlaceBet}
                />
              )}
            </div>
            <div className="bg-[#04303E] py-1 px-4 font-semibold mt-3 text-white">
              My Bet
            </div>
            <div className="bg-gray-100 text-black flex justify-between px-4">
              <p>Matched Bet </p>
              <p>Odds</p>
              <p>Stake</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetModal;
