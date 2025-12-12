// import React from "react";

// const ChangePassword = ({ onClose }) => {
//   return (
//     <div
//       id="__BVID__22"
//       role="dialog"
//       aria-describedby="__BVID__22___BV_modal_body_"
//       className="modal fade show"
//       aria-modal="true"
//       style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-md">
//         <span tabIndex={0} />
//         <div
//           id="__BVID__22___BV_modal_content_"
//           tabIndex={-1}
//           className="modal-content"
//         >
//           <header
//             id="__BVID__22___BV_modal_header_"
//             className="modal-header bg-default"
//           >
//             <h5 className="modal-title text-uppercase">Change Password</h5>{" "}
//             <button type="button" className="close" onClick={onClose}>
//               ×
//             </button>
//           </header>
//           <div id="__BVID__22___BV_modal_body_" className="modal-body">
//             {" "}
//             <form data-vv-scope="ChangePassword" method="post">
//               <div className="form-group">
//                 <input
//                   placeholder="Transaction Code"
//                   data-vv-as="Transaction Code"
//                   type="password"
//                   name="password"
//                   className="form-control"
//                   aria-required="true"
//                   aria-invalid="true"
//                 />{" "}
//                 {/**/}
//               </div>{" "}
//               <div className="form-group">
//                 <input
//                   placeholder="New Password"
//                   type="password"
//                   data-vv-as="New Password"
//                   name="NewPassword"
//                   className="form-control"
//                   aria-required="false"
//                   aria-invalid="false"
//                 />{" "}
//                 {/**/}
//               </div>{" "}
//               <div className="form-group">
//                 <input
//                   placeholder="Confirm New Password"
//                   data-vv-as="Confirm Password"
//                   type="password"
//                   name="ConfirmNewPassword"
//                   className="form-control"
//                   aria-required="true"
//                   aria-invalid="true"
//                 />{" "}
//                 {/**/}
//               </div>{" "}
//               <div className="form-group">
//                 <button type="submit" className="btn btn-primary btn-block">
//                   Change Password
//                   <i className="fas fa-chevron-circle-right ml-2" />
//                 </button>
//               </div>
//             </form>
//           </div>
//           {/**/}
//         </div>
//         <span tabIndex={0} />
//       </div>
//     </div>
//   );
// };
// export default ChangePassword;

import React, { useState } from "react";
import { useMutation } from "react-query";
import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import { updatePassword } from "../../../Helper/auth";
import { useCookies } from "react-cookie";

const ChangePassword = ({ onClose }) => {
  const [cookies] = useCookies(["Admin"]);
  const [formData, setFormData] = useState({
    transactionCode: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [IsLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Mutation for password change
  const passwordChangeMutation = useMutation(updatePassword, {
    onSuccess: (data) => {
      setIsLoading(false);

      if (data.success === true) {
        SuccessPopup(data?.msg || "Password changed successfully!");

        // Reset form on success
        setFormData({
          transactionCode: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });

        // Close modal after successful password change (optional)
        setTimeout(() => {
          if (onClose) onClose();
        }, 1500);

        return;
      }

      if (data.success === false) {
        ErrorPopup(
          data?.error ||
            data?.errors ||
            data?.msg ||
            data?.message ||
            "Something went wrong",
          2000
        );
      } else {
        ErrorPopup("Something went wrong", 2000);
      }
    },
    onError: (error) => {
      setIsLoading(false);
      ErrorPopup(error?.message || "Something went wrong", 2000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.transactionCode.trim()) {
      return ErrorPopup("Transaction code is required", 2000);
    }

    if (!formData.currentPassword.trim()) {
      return ErrorPopup("Current password is required", 2000);
    }

    if (!formData.newPassword.trim()) {
      return ErrorPopup("New password is required", 2000);
    }

    if (!formData.confirmNewPassword.trim()) {
      return ErrorPopup("Confirm new password is required", 2000);
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      return ErrorPopup("New passwords do not match", 2000);
    }

    // Check if new password is different from current password
    if (formData.newPassword === formData.currentPassword) {
      return ErrorPopup(
        "New password must be different from current password",
        2000
      );
    }

    setIsLoading(true);

    try {
      await passwordChangeMutation.mutateAsync({
        cookies,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        // Note: Transaction code is not sent to API based on your API structure
        // If needed, add it to the API call
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setIsLoading(false);
    }
  };

  return (
    <div
      id="__BVID__22"
      role="dialog"
      aria-describedby="__BVID__22___BV_modal_body_"
      className="modal fade show"
      aria-modal="true"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-md">
        <span tabIndex={0} />
        <div
          id="__BVID__22___BV_modal_content_"
          tabIndex={-1}
          className="modal-content"
        >
          <header
            id="__BVID__22___BV_modal_header_"
            className="modal-header bg-default"
          >
            <h5 className="modal-title text-uppercase">Change Password</h5>
            <button
              type="button"
              className="close"
              onClick={onClose}
              disabled={IsLoading}
            >
              ×
            </button>
          </header>
          <div id="__BVID__22___BV_modal_body_" className="modal-body">
            <form
              onSubmit={handleSubmit}
              method="post"
              data-vv-scope="ChangePassword"
            >
              <div className="form-group">
                <input
                  placeholder="Transaction Code"
                  data-vv-as="Transaction Code"
                  type="password"
                  name="transactionCode"
                  value={formData.transactionCode}
                  onChange={handleChange}
                  className="form-control"
                  aria-required="true"
                  disabled={IsLoading}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Current Password"
                  type="password"
                  data-vv-as="Current Password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="form-control"
                  aria-required="true"
                  disabled={IsLoading}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="New Password"
                  type="password"
                  data-vv-as="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-control"
                  aria-required="true"
                  disabled={IsLoading}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Confirm New Password"
                  data-vv-as="Confirm Password"
                  type="password"
                  name="confirmNewPassword"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                  className="form-control"
                  aria-required="true"
                  disabled={IsLoading}
                  required
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={IsLoading}
                >
                  {IsLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                      ></span>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      Change Password
                      <i className="fas fa-chevron-circle-right ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        <span tabIndex={0} />
      </div>
    </div>
  );
};

export default ChangePassword;
