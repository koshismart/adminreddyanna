import React, { useState } from "react";
import { useMutation } from "react-query";
import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import { changeUserPassword } from "../../../Helper/users";
import { useCookies } from "react-cookie";

const ChangePasswordTab = ({ account }) => {
  const [cookies] = useCookies(["Admin"]);
  const [formData, setFormData] = useState({
    password: "",
    confirmPass: "",
    tcode: "",
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
  const passwordChangeMutation = useMutation(changeUserPassword, {
    onSuccess: (data) => {
      setIsLoading(false);

      if (data.success === true) {
        SuccessPopup(data?.msg || "Password changed successfully!");

        // Reset form on success
        setFormData({
          password: "",
          confirmPass: "",
          tcode: "",
        });

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
    if (!formData.password.trim()) {
      return ErrorPopup("Password is required", 2000);
    }

    if (!formData.confirmPass.trim()) {
      return ErrorPopup("Confirm password is required", 2000);
    }

    if (formData.password !== formData.confirmPass) {
      return ErrorPopup("Passwords do not match", 2000);
    }

    if (!formData.tcode.trim()) {
      return ErrorPopup("Transaction code is required", 2000);
    }

    setIsLoading(true);

    try {
      await passwordChangeMutation.mutateAsync({
        userId: account._id,
        cookies,
        newPassword: formData.password,
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-horizontal">
      <div className="form-group row">
        <label className="col-form-label col-4">Password</label>
        <div className="col-8 form-group-feedback form-group-feedback-right">
          <input
            placeholder="Password"
            className="form-control"
            type="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
            disabled={IsLoading}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-form-label col-4">Confirm Password</label>
        <div className="col-8 form-group-feedback form-group-feedback-right">
          <input
            placeholder="Confirm Password"
            className="form-control"
            type="password"
            value={formData.confirmPass}
            onChange={handleChange}
            name="confirmPass"
            required
            disabled={IsLoading}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-form-label col-4">Transaction Code</label>
        <div className="col-8 form-group-feedback form-group-feedback-right">
          <input
            placeholder="Transaction Code"
            className="form-control"
            type="password"
            value={formData.tcode}
            onChange={handleChange}
            name="tcode"
            required
            disabled={IsLoading}
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
  );
};

export default ChangePasswordTab;
