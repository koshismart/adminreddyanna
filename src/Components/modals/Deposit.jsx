// import React from "react";

// const Deposit = ({ isOpen, onClose, account }) => {
//   if (!isOpen) return null;

//   // FIXED: Safe data access with fallbacks
//   const username =
//     account?.PersonalDetails?.userName || account?.username || "Unknown User";
//   const balance = account?.AccountDetails?.Balance || account?.pts || "0.00";
//   const profitLoss = account?.AccountDetails?.profitLoss || "0.00";

//   return (
//     <div className="popup-model">
//       <div style={{ position: "absolute", zIndex: 1040 }}>
//         <div
//           role="dialog"
//           aria-describedby="__BVID__73___BV_modal_body_"
//           className="modal fade bgopacity show d-block"
//           aria-modal="true"
//           style={{ display: "block" }}
//         >
//           <div className="modal-dialog modal-md">
//             <span tabIndex={0} />
//             <div tabIndex={-1} className="modal-content">
//               <header className="modal-header bg-success">
//                 <h6 className="modal-title text-uppercase text-white">
//                   Deposit - {username}
//                 </h6>
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="close text-white"
//                 >
//                   ×
//                 </button>
//               </header>
//               <div className="modal-body createUsers">
//                 <div className="tabs">
//                   <div className="">
//                     <ul role="tablist" className="nav nav-tabs">
//                       <li role="presentation" className="nav-item">
//                         <a
//                           role="tab"
//                           aria-selected="true"
//                           aria-setsize={1}
//                           aria-posinset={1}
//                           href="#"
//                           target="_self"
//                           className="nav-link active tab-bg-success"
//                         >
//                           Deposit
//                         </a>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="tab-content text-muted">
//                     <div
//                       role="tabpanel"
//                       aria-hidden="false"
//                       className="tab-pane active"
//                     >
//                       <form action="#">
//                         <div className="form-group row">
//                           <label className="col-form-label col-4">
//                             {username}
//                           </label>
//                           <div className="col-8">
//                             <div className="row">
//                               <div className="col-6">
//                                 <input
//                                   placeholder="Balance"
//                                   readOnly=""
//                                   className="form-control txt-right"
//                                   type="text"
//                                   defaultValue={
//                                     typeof balance === "string"
//                                       ? balance.replace(/,/g, "")
//                                       : balance
//                                   }
//                                   name="userDipositeusrnameamount"
//                                 />
//                               </div>
//                               <div className="col-6">
//                                 <input
//                                   placeholder="Balance"
//                                   readOnly=""
//                                   className="form-control txt-right"
//                                   type="text"
//                                   defaultValue={
//                                     typeof balance === "string"
//                                       ? balance.replace(/,/g, "")
//                                       : balance
//                                   }
//                                   name="userDipositeusrnameNamount"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="col-form-label col-4">
//                             Profit/Loss
//                           </label>
//                           <div className="col-8">
//                             <div className="row">
//                               <div className="col-6">
//                                 <input
//                                   placeholder="P/L"
//                                   readOnly=""
//                                   className="form-control txt-right"
//                                   type="text"
//                                   defaultValue={profitLoss}
//                                   name="userDipositepl"
//                                 />
//                               </div>
//                               <div className="col-6">
//                                 <input
//                                   placeholder="P/L"
//                                   readOnly=""
//                                   className="form-control txt-right"
//                                   type="text"
//                                   defaultValue={profitLoss}
//                                   name="userDipositeplnew"
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="col-form-label col-4">Amount</label>
//                           <div className="col-8 form-group-feedback form-group-feedback-right">
//                             <input
//                               placeholder="Amount"
//                               min={0}
//                               className="form-control txt-right "
//                               type="number"
//                               defaultValue=""
//                               name="amount"
//                             />
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="col-form-label col-4">Remark</label>
//                           <div className="col-8 form-group-feedback form-group-feedback-right">
//                             <textarea
//                               name="remark"
//                               placeholder="Remark"
//                               className="form-control textareaheight "
//                               defaultValue={""}
//                             />
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <label className="col-form-label col-4">
//                             Transaction Code
//                           </label>
//                           <div className="col-8 form-group-feedback form-group-feedback-right">
//                             <input
//                               placeholder="Transaction Code"
//                               aria-required="true"
//                               aria-invalid="false"
//                               className="form-control "
//                               type="password"
//                               defaultValue=""
//                               name="tcode"
//                             />
//                           </div>
//                         </div>
//                         <div className="form-group row">
//                           <div className="col-12 text-right">
//                             <button type="submit" className="btn btn-success">
//                               Submit
//                               <i className="fas fa-sign-in-alt ml-1" />
//                             </button>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Deposit;

import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useMutation } from "react-query";
import SuccessPopup from "../../Popups/SuccessPopup";
import ErrorPopup from "../../Popups/ErrorPopup";

// Move API function outside component
const depositChips = async ({
  cookies,
  userId,
  amount,
  remark,
  transactionCode,
}) => {
  const token = cookies?.token || cookies?.Admin?.token;

  if (!token) {
    throw new Error("Authentication token not found");
  }

// /get/my/account/operation/report

  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/v1/deposit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        amount: Number(amount),
        remark,
        transactionCode,
      }),
    }
  );

  return response.json();
};

const Deposit = ({ isOpen, onClose, account }) => {
  // Hooks should ALWAYS be at the top, before any condition
  const [cookies] = useCookies(["token"]);
  const [formData, setFormData] = useState({
    amount: "",
    remark: "",
    transactionCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Now useMutation hook
  const depositMutation = useMutation(depositChips, {
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.success) {
        SuccessPopup(data.msg || "Deposit successful").then(() => {
          setFormData({ amount: "", remark: "", transactionCode: "" });
          onClose();
        });
      } else {
        ErrorPopup(data.error || data.msg || "Deposit failed", 2000);
      }
    },
    onError: (error) => {
      setIsLoading(false);
      ErrorPopup(error.message || "Network error", 2000);
    },
  });

  // Now check for isOpen
  if (!isOpen) return null;

  // Safe data access with fallbacks
  const username =
    account?.PersonalDetails?.userName || account?.username || "Unknown User";
  const balance = account?.AccountDetails?.Balance || account?.pts || "0.00";
  const profitLoss = account?.AccountDetails?.profitLoss || "0.00";
  const userId = account?._id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = formData.amount;
    const remark = formData.remark || `Deposit to ${username}`;
    const transactionCode = formData.transactionCode;

    // Validation
    if (!amount || Number(amount) <= 0) {
      ErrorPopup("Please enter a valid amount", 2000);
      return;
    }

    if (!transactionCode) {
      ErrorPopup("Please enter transaction code", 2000);
      return;
    }

    if (!userId) {
      ErrorPopup("User ID not found", 2000);
      return;
    }

    try {
      await depositMutation.mutateAsync({
        cookies,
        userId,
        amount,
        remark,
        transactionCode,
      });
    } catch (error) {
      console.error("Deposit error:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="popup-model">
      <div style={{ position: "absolute", zIndex: 1040 }}>
        <div
          role="dialog"
          aria-describedby="__BVID__73___BV_modal_body_"
          className="modal fade bgopacity show d-block"
          aria-modal="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-md">
            <span tabIndex={0} />
            <div tabIndex={-1} className="modal-content">
              <header className="modal-header bg-success">
                <h6 className="modal-title text-uppercase text-white">
                  Deposit - {username}
                </h6>
                <button
                  type="button"
                  onClick={onClose}
                  className="close text-white"
                  disabled={isLoading}
                >
                  ×
                </button>
              </header>
              <div className="modal-body createUsers">
                <div className="tabs">
                  <div className="">
                    <ul role="tablist" className="nav nav-tabs">
                      <li role="presentation" className="nav-item">
                        <a
                          role="tab"
                          aria-selected="true"
                          aria-setsize={1}
                          aria-posinset={1}
                          href="#"
                          target="_self"
                          className="nav-link active tab-bg-success"
                        >
                          Deposit
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content text-muted">
                    <div
                      role="tabpanel"
                      aria-hidden="false"
                      className="tab-pane active"
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="form-group row">
                          <label className="col-form-label col-4">
                            {username}
                          </label>
                          <div className="col-8">
                            <div className="row">
                              <div className="col-6">
                                <input
                                  placeholder="Current Balance"
                                  readOnly
                                  className="form-control txt-right"
                                  type="text"
                                  value={
                                    typeof balance === "string"
                                      ? balance.replace(/,/g, "")
                                      : balance
                                  }
                                  name="currentBalance"
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  placeholder="Balance After"
                                  readOnly
                                  className="form-control txt-right"
                                  type="text"
                                  value={
                                    (typeof balance === "string"
                                      ? parseFloat(balance.replace(/,/g, ""))
                                      : parseFloat(balance)) +
                                    (parseFloat(formData.amount) || 0)
                                  }
                                  name="balanceAfter"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-form-label col-4">
                            Profit/Loss
                          </label>
                          <div className="col-8">
                            <div className="row">
                              <div className="col-6">
                                <input
                                  placeholder="Current P/L"
                                  readOnly
                                  className="form-control txt-right"
                                  type="text"
                                  value={profitLoss}
                                  name="currentPL"
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  placeholder="P/L After"
                                  readOnly
                                  className="form-control txt-right"
                                  type="text"
                                  value={profitLoss}
                                  name="plAfter"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-form-label col-4">Amount</label>
                          <div className="col-8 form-group-feedback form-group-feedback-right">
                            <input
                              placeholder="Amount"
                              min="1"
                              className="form-control txt-right"
                              type="number"
                              name="amount"
                              required
                              disabled={isLoading}
                              onChange={handleChange}
                              value={formData.amount}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-form-label col-4">Remark</label>
                          <div className="col-8 form-group-feedback form-group-feedback-right">
                            <textarea
                              name="remark"
                              placeholder="Remark"
                              className="form-control textareaheight"
                              onChange={handleChange}
                              value={formData.remark}
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-form-label col-4">
                            Transaction Code
                          </label>
                          <div className="col-8 form-group-feedback form-group-feedback-right">
                            <div className="position-relative">
                              <input
                                placeholder="Transaction Code"
                                aria-required="true"
                                className="form-control"
                                type={showPassword ? "text" : "password"}
                                name="transactionCode"
                                required
                                disabled={isLoading}
                                onChange={handleChange}
                                value={formData.transactionCode}
                              />
                              <button
                                type="button"
                                className="btn btn-sm position-absolute"
                                style={{
                                  right: "5px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                }}
                                onClick={togglePasswordVisibility}
                              >
                                <i
                                  className={
                                    showPassword
                                      ? "ri-eye-fill"
                                      : "ri-eye-off-fill"
                                  }
                                ></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="form-group row">
                          <div className="col-12 text-right">
                            <button
                              type="button"
                              onClick={onClose}
                              className="btn btn-light mr-2"
                              disabled={isLoading}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn btn-success"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <span className="spinner-border spinner-border-sm mr-2"></span>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  Submit
                                  <i className="fas fa-sign-in-alt ml-1" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
