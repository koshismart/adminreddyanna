import moment from "moment";
import React, { useState } from "react";

const IntCasinoIndividualBetHistoryTable = ({ data }) => {
  const [filter, setFilter] = useState("all");

  const filteredData = data.filter((item) => {
    if (filter === "all") return true;
    if (filter === "win") return item?.credit;
    if (filter === "loss") return item?.debit;
  });

  const getProfitAndLoss = (data) => {
    let totalProfit = 0;
    let totalLoss = 0;

    data?.forEach((bet) => {
      const profit = parseFloat(bet.credit) || 0;
      const loss = parseFloat(bet.debit) || 0;

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
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="filter"
              value="win"
              checked={filter === "win"}
              onChange={() => setFilter("win")}
              className="form-radio"
            />
            <span className="ml-2 text-sm md:text-base">Credit</span>
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
            <span className="ml-2 text-sm md:text-base">Debit</span>
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
                Bet Placed
              </th>
              <th className="py-2 px-4 md:px-4 text-left font-medium text-gray-600">
                Nation
              </th>
              <th className="py-2 px-2 text-center md:px-4  font-medium text-gray-600">
                P/L
              </th>
              <th className="py-2 px-6 md:px-4 text-left font-medium text-gray-600">
                Balance Left
              </th>
            </tr>
          </thead>

          <tbody className="">
            {filteredData.map((item, index) => (
              <tr key={index} className={`text-nowrap bg-[#B2D6F0]`}>
                <td className="py-2 px-2 md:px-4 text-gray-800">
                  {moment(
                    item?.payload?.created?.split("[")[0] // Remove timezone identifier if present
                  ).format("DD/MM/YY hh:mm A") ?? "-"}
                </td>
                <td className="py-2 px-2 md:px-4 text-gray-800 break-words whitespace-normal">
                  <div className="w-40 md:w-full">{item?.narration}</div>
                </td>
                <td className="py-2 px-2 text-center md:px-4 text-gray-800">
                  {item?.credit && !item.debit ? (
                    <p className="text-green-800 font-semibold">
                      +{item?.credit}
                    </p>
                  ) : item?.debit && !item.credit ? (
                    <p className="text-red-800 font-semibold">-{item?.debit}</p>
                  ) : (
                    <p className="text-green-600 font-semibold">+0</p>
                  )}
                </td>
                <td className="py-2 px-2 md:px-4 text-gray-800">
                  {item?.totalUserBalance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IntCasinoIndividualBetHistoryTable;
