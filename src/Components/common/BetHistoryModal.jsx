import React, { useState } from "react";
import BetPopup from "../../PopUps/BetPopup";
import IntCasinoIndividualBetHistoryTable from "./IntCasinoIndividualBetHistoryTable";
import IndividualBetHistoryTable from "./IndividualBetHistoryTable";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { getMyCasinoBetHistory, getMyQtGamesBetHistory, getMySportBetHistory } from "../../helpers/betHistory";
import moment from "moment";
import { getCasinoResultList } from "../../helpers/casino";
import DatePicker from "react-datepicker";

const BetHistoryModal = ({ setIsModalOpen,modalData,setModalData,activeTab }) => {
    if(!["1","5","5"].includes(activeTab)) return null;

  return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-gray-900 opacity-50"
            onClick={() => {
              setIsModalOpen(false);
              setModalData(null);
            }}
          ></div>

          {/* CASINO MODAL */}
          {activeTab=="5" ? (
            <div className="bg-white md:relative absolute top-0 w-full z-50 max-w-3xl md:max-w-4xl mx-auto">
              <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
                <h2 className="text-xl font-bold">
                  {modalData?.[0]?.currentBet?.eventName}
                </h2>
                <button
                  className="focus:outline-none"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
                </button>
              </div>
              {casinoResult?.success && casinoResult?.casinoResults?.[0] ? (
                <div className="my-3 w-full">
                  <div>
                    <h4 className="flex justify-end items-center text-sm font-semibold px-2">
                      Round Id: {casinoResult.casinoResults[0].mid}
                    </h4>
                  </div>
                  {/* Individual Game Result */}
                  {/* {renderGameIndividualResult(
                    casinoResult.casinoResults[0].casinoGameName
                  )} */}
                  {/* Bet History Table */}
                  <div>
                    {modalData.length > 0 && (
                      <IndividualBetHistoryTable data={modalData} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex justify-center items-center my-4">
                  <i className="fa fa-spinner fa-spin"/>
                </div>
              )}
            </div>
          ) :  (
            // SPORT MODAL
            <div className="bg-white md:relative absolute top-0 w-full z-50 max-w-3xl mx-auto">
              <div className="flex bg-secondaryBackground text-white py-3 px-4 justify-between items-center border-b mb-4">
                <h2 className="text-xl font-bold">
                  {modalData?.[0]?.currentBet?.eventName}
                </h2>
                <button
                  className="focus:outline-none"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  <i className="cursor-pointer fa-solid fa-xmark text-red-500 hover:text-red-400"></i>
                </button>
              </div>
              {modalData?.[0] ? (
                <div className="my-3 w-full ">
                  <div>
                    <h4 className="flex justify-between items-center text-sm font-semibold px-2 sm:px-4">
                      <div>
                        <div>
                          Odds :{" "}
                          {modalData?.[0]?.currentBet?.oddType === "match_odds"
                            ? "# Match"
                            : modalData?.[0]?.currentBet?.oddType ===
                              "bookmaker"
                            ? "# Bookmaker"
                            : modalData?.[0]?.currentBet?.oddType === "fancy"
                            ? "# Fancy"
                            : ""}
                        </div>
                        <div>
                          Position: {modalData?.[0]?.currentBet?.oddCategory}
                        </div>
                      </div>
                      <div>Event Id: #{modalData?.[0]?.currentBet.eventId}</div>
                    </h4>
                  </div>
                  <div>
                    {!modalData.length <= 0 &&
                      (activeTab=="3" ? (
                        <IntCasinoIndividualBetHistoryTable data={modalData} />
                      ) : (
                        <IndividualBetHistoryTable data={modalData} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex justify-center items-center my-4">
                  <i className="fa fa-spinner fa-spin"/>
                </div>
              )}
            </div>
          ) }
        </div>
      )
};

export default BetHistoryModal;
