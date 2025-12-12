import React from "react";
import { Link } from "react-router-dom";
import ball from "../../assets/balls";

const PlaceBet = ({ game, bet, data }) => {
  return (
    <div
      className={`w-full h-full ${
        !bet && "mt-1"
      } bg-white max-h-fit overflow-y-auto no-scrollbar`}
    >
      {bet ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-1 text-left text-sm font-semibold text-black"
                >
                  Matched Bet
                </th>
                <th
                  scope="col"
                  className="px-4 py-1 text-center text-sm font-semibold text-black"
                >
                  Odds
                </th>
                <th
                  scope="col"
                  className="px-4 py-1 text-center text-sm font-semibold text-black"
                >
                  Stake
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.currentCasinoBets?.map((doc, index) => (
                <tr
                  key={index}
                  className={
                    doc?.currentBet?.boxColor
                      ? doc?.currentBet.boxColor
                      : "bg-gray-600"
                  }
                >
                  <td className="px-4 py-1 text-black text-sm">
                    {doc?.currentBet?.betName}
                  </td>
                  <td className="px-4 py-1 text-center text-black text-sm">
                    {doc?.currentBet?.matchOdd}
                  </td>
                  <td className="px-4 py-1 text-center text-black text-sm">
                    {doc?.currentBet?.stake}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <div className="sidebar-title">
            <h4>My Bet</h4>
            <Link to="/reports/current-bet">View All</Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Matched Bet</th>
                  <th className="text-end">Odds</th>
                  <th className="text-end">Stake</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.currentCasinoBets?.map((doc, index) => (
                  <tr
                    key={index}
                    className={
                      doc?.currentBet?.boxColor
                        ? doc?.currentBet.boxColor
                        : "bg-gray-600"
                    }
                  >
                    <td className="px-4 py-1 text-black text-sm">
                      {doc?.currentBet?.betName}
                    </td>
                    <td className="px-4 py-1 text-center text-black text-sm">
                      {doc?.currentBet?.matchOdd}
                    </td>
                    <td className="px-4 py-1 text-center text-black text-sm">
                      {doc?.currentBet?.stake}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* tabular ui */}
      {game === "Poker- 1 Day" && (
        <div className="h-full">
          <div className="bg-primaryBackground text-white flex justify-center py-1">
            <h3>Rules</h3>
          </div>
          <div className="py-2">
            <div className="flex justify-center border py-1 font-bold">
              <h1>Bonus 1 (2 Cards Bonus)</h1>
            </div>
            <div className="space-y-0">
              {[
                { title: "Pair (2-10)", value: "1 TO 3" },
                { title: "A/Q or A/J Off Suited", value: "1 TO 5" },
                { title: "Pair (JQK)", value: "1 TO 10" },
                { title: "A/K Off Suited", value: "1 TO 15" },
                { title: "A/Q or A/J Suited", value: "1 TO 20" },
                { title: "A/K Suited", value: "1 TO 25" },
                { title: "A/A", value: "1 TO 30" },
              ].map((item, index) => (
                <div key={index} className="flex">
                  <div className="w-3/4 px-2 py-1 border">{item.title}</div>
                  <div className="w-1/4 px-2 py-1 border">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center border py-1 font-bold mt-4">
              <h1>Bonus 2 (7 Cards Bonus)</h1>
            </div>
            <div className="space-y-0">
              {[
                { title: "Three of a Kind", value: "1 TO 3" },
                { title: "Straight", value: "1 TO 4" },
                { title: "Flush", value: "1 TO 6" },
                { title: "Full House", value: "1 TO 8" },
                { title: "Four of a Kind", value: "1 TO 30" },
                { title: "Straight Flush", value: "1 TO 50" },
                { title: "Royal Flush", value: "1 TO 100" },
              ].map((item, index) => (
                <div key={index} className="flex">
                  <div className="w-3/4 px-2 py-1 border">{item.title}</div>
                  <div className="w-1/4 px-2 py-1 border">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(game === "OpenTeenPatti" || game === "3 Patti T20") && (
        <div className="h-full">
          <div className="bg-primaryBackground text-white flex justify-center py-1">
            <h3>Rules</h3>
          </div>
          <div className="py-2">
            {/* Pair Plus Section */}
            <div className="flex justify-center border py-1 font-bold">
              <h1>Pair Plus</h1>
            </div>
            <div className="space-y-0">
              {[
                { title: "Pair", value: "1 TO 1" },
                { title: "Flush", value: "1 TO 4" },
                { title: "Straight", value: "1 TO 6" },
                { title: "Trio", value: "1 TO 30" },
                { title: "Straight Flush", value: "1 TO 40" },
              ].map((item, index) => (
                <div key={index} className="flex">
                  <div className="w-3/4 px-2 py-1 border">{item.title}</div>
                  <div className="w-1/4 px-2 py-1 border">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {game == "Five Five Cricket" && (
        <div className="h-full">
          <div className="bg-primaryBackground text-white flex justify-center py-1">
            <h3>Rules</h3>
          </div>

          <div>
            <div className="flex justify-center gap-2">
              {/* left */}
              <div className="w-full border">
                <div className=" flex justify-center items-center">
                  <h2 className="text-lg py-1">AUS</h2>
                </div>
                <div className="w-full grid grid-cols-2 justify-between items-center">
                  <div className="col-span-1 border-l border-t">
                    <h2 className="flex justify-center items-center">Cards</h2>
                    {["A", "2", "3", "4", "6", "10", "K"].map((item) => (
                      <div className="border-t border-b flex justify-center items-center py-1 ">
                        <div className="w-6 h-6 bg-black font-bold text-white flex justify-center items-center text-sm">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="col-span-1 border-l border-t">
                      <h2 className="flex justify-center items-center">
                        Value
                      </h2>
                      {["1", "2", "3", "4", "6", "0", "Wicket"].map((item) => (
                        <div className="border-t border-b flex justify-center items-center py-1">
                          {item !== "Wicket" ? item + " Run" : item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full border">
                <div className=" flex justify-center items-center">
                  <h2 className="text-lg py-1">IND</h2>
                </div>
                <div className="w-full grid grid-cols-2 justify-between items-center">
                  <div className="col-span-1 border-l border-t">
                    <h2 className="flex justify-center items-center">Cards</h2>
                    {["A", "2", "3", "4", "6", "10", "K"].map((item) => (
                      <div className="border-t border-b flex justify-center items-center py-1 ">
                        <div className="w-6 h-6 bg-black font-bold text-white flex justify-center items-center text-sm">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="col-span-1 border-l border-t">
                      <h2 className="flex justify-center items-center">
                        Value
                      </h2>
                      {["1", "2", "3", "4", "6", "0", "Wicket"].map((item) => (
                        <div className="border-t border-b flex justify-center items-center py-1">
                          {item !== "Wicket" ? item + " Run" : item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {game == "Super Over" && (
        <div className="h-full">
          <div className="bg-primaryBackground text-white flex justify-center py-1">
            <h3 className="text-center">
              ENG VS RSA <br />
              INNING'S CARD RULES
            </h3>
          </div>

          <div>
            <div className="">
              {/* left */}
              <div className="w-full border">
                <div className="w-full grid grid-cols-3 justify-between items-center">
                  <div className="col-span-1 border-l border-t">
                    <h2 className="flex justify-center items-center">Cards</h2>
                    {["A", "2", "3", "4", "6", "10", "K"].map((item) => (
                      <div className="border-t border-b flex justify-center items-center py-1 ">
                        <div className=" gap-3 flex items-center justify-center ">
                          <div className="w-5 h-6 border-yellow-300 border-2 text-black flex justify-center items-center text-sm">
                            {item}
                          </div>
                          <div>X</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-1 border-l border-t">
                    <h2 className="flex justify-center items-center">Count</h2>
                    {["5", "5", "5", "5", "5", "5", "5"].map((item) => (
                      <div className="border-t border-b flex justify-center items-center py-1 ">
                        <div className="w-6 h-6  flex justify-center items-center text-sm">
                          {item}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="col-span-1 border-l border-t">
                      <h2 className="flex justify-center items-center">
                        Value
                      </h2>
                      {["1", "2", "3", "4", "6", "10", "Wicket"].map((item) => (
                        <div className="border-t border-b flex justify-center items-center py-1">
                          <img
                            src={ball?.find((v) => v.rule == item)?.ball}
                            className="h-6 w-6"
                            alt={item}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceBet;
