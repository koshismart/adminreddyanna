import React, { useState } from "react";
import Select from "./component/Select";
import Input from "./component/Input";
import { decodedTokenData } from "../Helper/auth";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import { ledgerSettleApi } from "../Helper/ledger";
import SuccessPopup from "../Popups/SuccessPopup";
import ErrorPopup from "../Popups/ErrorPopup";

const LedgerSettle = ({
  item,
  bgColor,
  refetch,
  bgBorder,
  textColor,
  title,
  modeOfLenDen,
  amount,
}) => {
  const [cookies] = useCookies(["Admin"]);
  const [smallModal, setSmallModal] = useState(false);

  const { userId } = decodedTokenData(cookies);

  const initialFormData = {
    modeOfLenDen,
    amount: amount,
    settledAmount: "",
    reason: "",
    selectOption: "",
    userId: item?.createdFor,
    uplineId: userId,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const ledgerSettle = useMutation(ledgerSettleApi, {
    onSuccess: (data) => {
      if (data.success) {
        SuccessPopup(data.msg, 2000);
        refetch(), setFormData(initialFormData);
        setSmallModal(false);
      } else {
        ErrorPopup(data.error || "Something went wrong", 2000);
      }
    },
    onError: (error) => {
      ErrorPopup(error || "Something went wrong", 2000);
    },
  });

  const { isLoading } = ledgerSettle;

  const handleSubmit = (e) => {
    e.preventDefault();
    ledgerSettle.mutate({ cookies, formData });
  };

  const openModal = () => setSmallModal(true);
  const closeModal = () => {
    setFormData(initialFormData);
    setSmallModal(false);
  };

  return (
    <div>
      <button
        onClick={openModal}
        className={`w-fit py-2 px-4 ${bgColor} rounded ${
          textColor || "text-white"
        } ${bgBorder} border cursor-pointer sm:flex items-center justify-center gap-2 tracking-wider`}
      >
        {title}
      </button>

      {smallModal && (
        <form onSubmit={handleSubmit}>
          <dialog id="my_modal_2" className="modal bg-black bg-opacity-50" open>
            <div className="modal-box w-9/12 max-w-2xl p-3 m-2 flex flex-col gap-5 rounded text-base">
              <div className="flex items-center gap-2 justify-between p-5 bg-[#045662] text-white">
                <div className="flex justify-between gap-1">
                  <span
                    onClick={closeModal}
                    className="font-semibold cursor-pointer"
                  >
                    <i className="ri-arrow-left-line"></i>
                  </span>
                  <h1 className="uppercase text-lg font-semibold">
                    {`${item?.createdFor?.PersonalDetails?.loginId || ""} (${
                      item?.createdFor?.PersonalDetails?.userName || ""
                    })`}
                  </h1>
                </div>
                <div
                  className={`btn btn-sm ${
                    modeOfLenDen === "Credit (Lena)"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  {modeOfLenDen}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 text-start"
                  >
                    Amount (₹₹)
                  </label>
                  <Input
                    name="amount"
                    type="number"
                    value={formData.amount}
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="settledAmount"
                    className="block text-sm font-medium text-gray-700 text-start"
                  >
                    Settled Amount (₹₹) *
                  </label>
                  <Input
                    name="settledAmount"
                    type="number"
                    value={formData.settledAmount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="selectOption"
                    className="block text-sm font-medium text-gray-700 text-start"
                  >
                    Payment Type
                  </label>
                  <Select
                    defaultName="Please select an option"
                    name="selectOption"
                    value={formData.selectOption}
                    onChange={handleChange}
                    opt={["Payment Liya", "Payment Diya"]}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="reason"
                    className="block text-sm font-medium text-gray-700 text-start"
                  >
                    Reason *
                  </label>
                  <Input
                    name="reason"
                    type="text"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter A Reason Here ..."
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded w-full mt-4 flex items-center justify-center"
                >
                  {isLoading && (
                    <span className="loading loading-spinner loading-md"></span>
                  )}
                  Settle Now
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded w-full mt-4 flex items-center justify-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </dialog>
        </form>
      )}
    </div>
  );
};

export default LedgerSettle;
