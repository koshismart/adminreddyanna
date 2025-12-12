import moment from "moment";
import React, { useState } from "react";

const IndividualBetHistoryTable = ({ data }) => {
  
  const [filter, setFilter] = useState("all");

  const filteredData = data.filter((item) => {
    if (filter === "all") return true;
    if (filter === "lay") return item?.currentBet?.oddCategory === "lay";
    if (filter === "back") return item?.currentBet?.oddCategory === "back";
    if (filter === "win") return item?.currentBet.profit !== "";
    if (filter === "loss") return item?.currentBet.loss !== "";
  });

  const getProfitAndLoss = (data) => {
    let totalProfit = 0;
    let totalLoss = 0;

    data?.forEach((bet) => {
      const profit = parseFloat(bet.currentBet.profit) || 0;
      const loss = parseFloat(bet.currentBet.loss) || 0;

      totalProfit += profit;
      totalLoss += loss;
    });

    const totalAmount = (totalProfit - totalLoss).toFixed(2);

    return totalAmount;
  };

  return (
    <div className="container mx-auto p-2 md:p-4 ">
      <div className="flex md:flex-row flex-col md:justify-between items-center">
        <div className="mb-2 flex flex-wrap gap-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={() => setFilter("all")}
              className="form-radio"
            />
            <span className="ml-2 text-sm md:text-base">All</span>
          </label>
          {/* <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="lay"
              checked={filter === "lay"}
              onChange={() => setFilter("lay")}
              className="form-radio"
            />
            <span className="ml-2 text-sm md:text-base">Lay</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="back"
              checked={filter === "back"}
              onChange={() => setFilter("back")}
              className="form-radio"
            />
            <span className="ml-2 text-sm md:text-base">Back</span>
          </label> */}
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="win"
              checked={filter === "win"}
              onChange={() => setFilter("win")}
              className="form-radio"
            />
            <span className="ml-2 text-sm md:text-base">Win</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="loss"
              checked={filter === "loss"}
              onChange={() => setFilter("loss")}
              className="form-radio"
            />
            <span className="ml-2 text-sm md:text-base">Loss</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="font-semibold text-xs uppercase">
            Total Bets: <span>{filteredData.length}</span>
          </div>
          <div className="font-semibold text-xs uppercase">
            Total P/L:{" "}
            <span
              className={`${
                getProfitAndLoss(filteredData).includes("-")
                  ? "text-red-800"
                  : "text-green-800"
              }`}
            >
              {getProfitAndLoss(filteredData)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-[40vh] h-fit overflow-y-auto no-scrollbar">
        <table className="min-w-full text-sm md:text-base border-spacing-px border-separate border-slate-400">
          <thead className="bg-gray-300 sticky top-0 z-10 pt-2">
            <tr className="">
              <th className="py-2 px-4 md:px-4 text-left font-medium text-gray-600">
                Nation
              </th>
              <th className="py-2 px-2 md:px-4 text-left font-medium text-gray-600">
                Result
              </th>
              <th className="py-2 px-2 md:px-4 text-left font-medium text-gray-600">
                Odds
              </th>
              <th className="py-2 px-2 md:px-4 text-left font-medium text-gray-600">
                Stake
              </th>
              <th className="py-2 px-2 text-center md:px-4  font-medium text-gray-600">
                P/L
              </th>
              {data[0]?.currentBet?.sportType === "cricket" && (
                <th className="py-2 px-2 text-center md:px-4  font-medium text-gray-600">
                  Score/Winner
                </th>
              )}

              <th className="py-2 px-6 md:px-4 text-left font-medium text-gray-600">
                Date
              </th>
            </tr>
          </thead>

          <tbody className="">
            {filteredData.map(
              (item, index) => (
                console.log(item),
                (
                  <tr
                    key={index}
                    className={`text-nowrap ${item?.currentBet?.boxColor}`}
                  >
                    <td className="py-2 px-2 md:px-4 text-gray-800">
                      {item?.currentBet?.betName}
                    </td>
                    <td className="py-2 px-2 text-center md:px-4 text-gray-800">
                      {item?.currentBet?.profit != "" ? (
                        <p className="text-green-800 font-semibold">Won</p>
                      ) : item?.currentBet?.loss != "" ? (
                        <p className="text-red-800 font-semibold">Lost</p>
                      ) : (
                        <p className="text-red-800 font-semibold">Tie</p>
                      )}
                    </td>
                    <td className="py-2 px-2 md:px-4 text-gray-800">
                      {item?.currentBet?.matchOdd}
                    </td>
                    <td className="py-2 px-2 md:px-4 text-gray-800">
                      {item?.currentBet?.stake}
                    </td>

                    <td className="py-2 px-2 text-center md:px-4 text-gray-800">
                      {item?.currentBet?.profit && (
                        <p className="text-green-800 font-semibold">
                          +{item?.currentBet?.profit}
                        </p>
                      )}
                      {item?.currentBet?.loss && (
                        <p className="text-red-800 font-semibold">
                          -{item?.currentBet?.loss}
                        </p>
                      )}
                    </td>
                    {data[0]?.currentBet?.sportType === "cricket" && (
                      <td className="py-2 px-2 text-center md:px-4 text-gray-800">
                        {item?.betResult}
                      </td>
                    )}
                    <td className="py-2 px-2 md:px-4 text-gray-800">
                      {moment(item?.updatedAt).format("DD/MM hh:mm A")}
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndividualBetHistoryTable;
