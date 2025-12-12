import React from "react";

const HeaderTab = ({ mid, bet, setBet, myCurrentCasinoBets }) => {
  return (
    <ul className="whitespace-nowrap flex w-full text-white bg-primaryBackground py-1 md:hidden">
      <li className={`text-sm font-semibold cursor-pointer my-auto`}>
        <button
          className={`mx-2 ${!bet ? "border-b-2" : ""}`}
          onClick={() => setBet(!bet)}
        >
          Game
        </button>
      </li>
      <li className={`text-sm border-l font-semibold cursor-pointer my-auto`}>
        <button
          className={`mx-4 ${bet ? "border-b-2" : ""}`}
          onClick={() => setBet(true)}
        >
          Placed Bet (
          {myCurrentCasinoBets?.currentCasinoBets?.length > 0
            ? myCurrentCasinoBets?.currentCasinoBets?.length
            : 0}
          )
        </button>
      </li>
      <li className={`text-sm border-l font-semibold cursor-pointer my-auto`}>
        <button className={`mx-4`}>
          Round Id :<span>{mid && mid}</span>{" "}
        </button>
      </li>
    </ul>
  );
};

export default HeaderTab;
