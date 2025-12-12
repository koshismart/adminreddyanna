import React, { useState, useEffect } from "react";
import { useMutation } from "react-query";
import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import { changeTransactionPassword } from "../../../Helper/users";
import { useCookies } from "react-cookie";

const ChangeTransactionPassword = ({ account }) => {
  const [cookies] = useCookies(["Admin"]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPass: "",
    tcode: "",
  });

  // Initialize form when account changes
  useEffect(() => {
    if (account) {
      // Reset form when account changes
      setFormData({
        password: "",
        confirmPass: "",
        tcode: "",
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const transactionPasswordChangeMutation = useMutation(
    changeTransactionPassword,
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSuccess: (data) => {
        setIsLoading(false);
        if (data?.success === true) {
          SuccessPopup(
            data?.msg || "Transaction password changed successfully!"
          );

          // Reset form on success
          setFormData({
            password: "",
            confirmPass: "",
            tcode: "",
          });
        } else {
          ErrorPopup(
            data?.error ||
              data?.errors ||
              data?.msg ||
              data?.message ||
              "Failed to change transaction password",
            2000
          );
        }
      },
      onError: (error) => {
        setIsLoading(false);
        ErrorPopup(
          error?.response?.data?.message ||
            error?.message ||
            "Network error. Please try again.",
          2000
        );
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.password.trim()) {
      ErrorPopup("New transaction password is required", 2000);
      return;
    }

    if (!formData.confirmPass.trim()) {
      ErrorPopup("Please confirm your password", 2000);
      return;
    }

    if (formData.password !== formData.confirmPass) {
      ErrorPopup("Passwords do not match", 2000);
      return;
    }

    if (!formData.tcode.trim()) {
      ErrorPopup("Current transaction code is required", 2000);
      return;
    }

    if (formData.password.length < 6) {
      ErrorPopup("Password must be at least 6 characters", 2000);
      return;
    }

    // Prepare request data
    const requestData = {
      userId: account?._id,
      cookies,
      transactionPassword: formData.password,
      currentTransactionCode: formData.tcode,
    };

    // Call mutation
    transactionPasswordChangeMutation.mutate(requestData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-horizontal">
      <div className="form-group row">
        <label className="col-form-label col-4">New Password</label>
        <div className="col-8 form-group-feedback form-group-feedback-right">
          <input
            placeholder="Enter new transaction password"
            className="form-control"
            type="password"
            value={formData.password}
            onChange={handleChange}
            name="password"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-form-label col-4">Confirm Password</label>
        <div className="col-8 form-group-feedback form-group-feedback-right">
          <input
            placeholder="Confirm new transaction password"
            className="form-control"
            type="password"
            value={formData.confirmPass}
            onChange={handleChange}
            name="confirmPass"
            required
            disabled={isLoading}
            minLength={6}
          />
        </div>
      </div>

      <div className="form-group row">
        <label className="col-form-label col-4">Current Code</label>
        <div className="col-8 form-group-feedback form-group-feedback-right">
          <input
            placeholder="Enter current transaction code"
            className="form-control"
            type="password"
            value={formData.tcode}
            onChange={handleChange}
            name="tcode"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-12 text-right">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Processing...
              </>
            ) : (
              <>
                Update Transaction Password
                <i className="fas fa-key ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChangeTransactionPassword;
