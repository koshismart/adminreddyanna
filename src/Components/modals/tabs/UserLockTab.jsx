import React, { useState } from "react";
import { useMutation } from "react-query";
import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import { useCookies } from "react-cookie";

const UserLockTab = ({ account }) => {
  const [cookies] = useCookies(["Admin"]);
  const [formData, setFormData] = useState({
    betLock: !account.bettingLocked,
    userLock: !account.userLocked,
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

  // Function to toggle lock status
  const toggleLockStatus = async (lockType, isLocked) => {
    const token = cookies?.Admin?.token || cookies?.token;

    if (!token) {
      ErrorPopup("Authentication failed", 2000);
      return null;
    }

    // Determine endpoint based on lock type
    const endpoint =
      lockType === "betLock"
        ? `/api/v1/bettingLocked/${account._id}`
        : `/api/v1/userLocked/${account._id}`;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}${endpoint}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ locked: isLocked }),
        }
      );

      return await response.json();
    } catch (error) {
      console.error(`Error toggling ${lockType}:`, error);
      throw error;
    }
  };

  // Mutation for lock operations
  const lockMutation = useMutation(
    ({ lockType, isLocked }) => toggleLockStatus(lockType, isLocked),
    {
      onSuccess: (data, variables) => {
        setIsLoading(false);

        if (data?.success === true) {
          const lockName =
            variables.lockType === "betLock" ? "Betting Lock" : "User Lock";
          const status = variables.isLocked ? "enabled" : "disabled";
          SuccessPopup(`${lockName} ${status} successfully!`, 2000);
          return;
        }

        ErrorPopup(
          data?.error || data?.message || "Something went wrong",
          2000
        );
      },
      onError: (error) => {
        setIsLoading(false);
        ErrorPopup(error?.message || "Something went wrong", 2000);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.transactionCode.trim()) {
      return ErrorPopup("Transaction code is required", 2000);
    }

    setIsLoading(true);

    try {
      // Update Bet Lock if changed
      const currentBetLock = !account.bettingLocked;
      if (formData.betLock !== currentBetLock) {
        await lockMutation.mutateAsync({
          lockType: "betLock",
          isLocked: !formData.betLock,
        });
      }

      // Update User Lock if changed
      const currentUserLock = !account.userLocked;
      if (formData.userLock !== currentUserLock) {
        await lockMutation.mutateAsync({
          lockType: "userLock",
          isLocked: !formData.userLock,
        });
      }

      // If no changes were made
      if (
        formData.betLock === currentBetLock &&
        formData.userLock === currentUserLock
      ) {
        SuccessPopup("No changes made", 2000);
      }

      // Reset transaction code after successful submission
      setFormData((prev) => ({
        ...prev,
        transactionCode: "",
      }));
    } catch (error) {
      console.error("Error updating lock status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-vv-scope="UserLock">
      <div className="form-group row">
        <label className="col-form-label col-4">Bet lock</label>
        <div
          className="mb-1 custom-control custom-switch"
          style={{ width: "max-content", marginLeft: 20 }}
        >
          <input
            className="custom-control-input"
            id="bet-lock"
            type="checkbox"
            checked={formData.betLock}
            onChange={handleChange}
            name="betLock"
            disabled={IsLoading}
          />
          <label className="custom-control-label" htmlFor="bet-lock" />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-form-label col-4">User lock</label>
        <div
          className="mb-1 custom-control custom-switch"
          style={{ width: "max-content", marginLeft: 20 }}
        >
          <input
            className="custom-control-input"
            id="user-lock"
            type="checkbox"
            checked={formData.userLock}
            onChange={handleChange}
            name="userLock"
            disabled={IsLoading}
          />
          <label className="custom-control-label" htmlFor="user-lock" />
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
                Processing...
              </>
            ) : (
              <>
                Submit <i className="fas fa-sign-in-alt ml-1" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Current Status Info */}
      {/* <div className="alert alert-info mt-3">
        <small>
          <i className="fas fa-info-circle mr-1"></i>
          <strong>Current Status:</strong>
          <br />• Betting Lock:{" "}
          {account.bettingLocked ? "🔒 Locked" : "🔓 Unlocked"}
          <br />• User Lock: {account.userLocked ? "🔒 Locked" : "🔓 Unlocked"}
        </small>
      </div> */}
    </form>
  );
};

export default UserLockTab;
