import React, { useState } from "react";
import { useMutation } from "react-query";
import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import { updateUser } from "../../../Helper/users";
import { useCookies } from "react-cookie";

const EditProfileTab = ({ account }) => {
  const [cookies] = useCookies(["Admin"]);
  const [formData, setFormData] = useState({
    fullName: account.PersonalDetails?.userName || "",
    changePasswordLock: false,
    favoriteMaster: false,
    transactionCode: "",
  });
  const [IsLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Mutation for updating user
  const updateUserMutation = useMutation(updateUser, {
    onSuccess: (data) => {
      setIsLoading(false);

      if (data.success === true) {
        SuccessPopup(data?.msg || "Profile updated successfully!", 2000);

        // Reset transaction code on success
        setFormData((prev) => ({
          ...prev,
          transactionCode: "",
        }));

        return;
      }

      ErrorPopup(
        data?.error ||
          data?.errors ||
          data?.msg ||
          data?.message ||
          "Something went wrong",
        2000
      );
    },
    onError: (error) => {
      setIsLoading(false);
      ErrorPopup(error?.message || "Something went wrong", 2000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullName.trim()) {
      return ErrorPopup("Full name is required", 2000);
    }

    if (!formData.transactionCode.trim()) {
      return ErrorPopup("Transaction code is required", 2000);
    }

    setIsLoading(true);

    try {
      // Prepare user data according to your API structure
      const userData = {
        PersonalDetails: {
          userName: formData.fullName.trim(),
          // Include other fields that might need updating
        },
        // You might need to add other fields based on your requirements
        // For example:
        // changePasswordLock: formData.changePasswordLock,
        // favoriteMaster: formData.favoriteMaster,
      };

      await updateUserMutation.mutateAsync({
        documentId: account._id,
        cookies,
        userData,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-vv-scope="UserLock">
      <div className="form-group row">
        <label className="col-form-label col-4">User ID</label>
        <div className="col-8 form-group-feedback-right pl-0">
          <input
            className="form-control bg-light"
            type="text"
            value={account.PersonalDetails?.loginId || "N/A"}
            readOnly
            disabled
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-form-label col-4">Full Name</label>
        <div className="col-8 form-group-feedback-right pl-0">
          <input
            placeholder="Full Name"
            className="form-control"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            name="fullName"
            disabled={IsLoading}
            required
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-form-label col-4">Change Password Lock</label>
        <div
          className="mb-1 custom-control custom-switch"
          style={{ width: "max-content", marginLeft: 20 }}
        >
          <input
            className="custom-control-input"
            id="change-password-lock"
            type="checkbox"
            checked={formData.changePasswordLock}
            onChange={handleChange}
            name="changePasswordLock"
            disabled={IsLoading}
          />
          <label
            className="custom-control-label"
            htmlFor="change-password-lock"
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-form-label col-4">Favorite Master</label>
        <div
          className="mb-1 custom-control custom-switch"
          style={{ width: "max-content", marginLeft: 20 }}
        >
          <input
            className="custom-control-input"
            id="favorite-master"
            type="checkbox"
            checked={formData.favoriteMaster}
            onChange={handleChange}
            name="favoriteMaster"
            disabled={IsLoading}
          />
          <label className="custom-control-label" htmlFor="favorite-master" />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-form-label col-4">Transaction Code</label>
        <div className="col-8 form-group-feedback-right pl-0">
          <input
            placeholder="Transaction Code"
            className="form-control"
            type="password"
            value={formData.transactionCode}
            onChange={handleChange}
            name="transactionCode"
            disabled={IsLoading}
            required
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-12 text-right">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={IsLoading}
          >
            {IsLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                ></span>
                Updating...
              </>
            ) : (
              <>
                Submit <i className="fas fa-sign-in-alt ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional User Information */}
      {/* <div className="card mt-3">
        <div className="card-body">
          <h6 className="card-title">User Information</h6>
          <div className="row">
            <div className="col-md-6">
              <small>
                <strong>Login ID:</strong>{" "}
                {account.PersonalDetails?.loginId || "N/A"}
              </small>
              <br />
              <small>
                <strong>User Type:</strong> {account.__type || "N/A"}
              </small>
              <br />
              <small>
                <strong>Mobile:</strong>{" "}
                {account.PersonalDetails?.mobile || "N/A"}
              </small>
            </div>
            <div className="col-md-6">
              <small>
                <strong>Created At:</strong>{" "}
                {new Date(account.createdAt).toLocaleString() || "N/A"}
              </small>
              <br />
              <small>
                <strong>Status:</strong>{" "}
                {account.userLocked ? "🔒 Locked" : "✅ Active"}
              </small>
              <br />
              <small>
                <strong>Balance:</strong>{" "}
                {account.AccountDetails?.Balance?.toFixed(2) || "0.00"}
              </small>
            </div>
          </div>
        </div>
      </div> */}
    </form>
  );
};

export default EditProfileTab;
