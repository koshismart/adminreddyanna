import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { getDownlineUsers } from "../../../Helper/users";
import { chipDepositWithdraw } from "../../../Helper/chips";
import { getLedger } from "../../../Helper/ledger"; // ✅ Added ledger API
import { decodedTokenData } from "../../../Helper/auth";
import { useParams } from "react-router-dom";
import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import { useMutation } from "react-query";
import {
  bankexportToExcel,
  bankexportToPDF,
} from "../../../Helper/exportHelper";

const Bank = () => {
  const [cookies] = useCookies(["Admin"]);
  const { uniqueId, userId: loginId } = useParams();

  // Debug info on mount
  useEffect(() => {
    console.log("=== BANK DEBUG INFO ===");
    console.log("URL Params:", { uniqueId, loginId });
    console.log("Cookies token available:", !!cookies?.token);
    console.log("Admin cookie available:", !!cookies?.Admin);
  }, [cookies, uniqueId, loginId]);

  // Get current user data
  const currentUserData = decodedTokenData(cookies) || {};
  const currentUserId = currentUserData.userId || currentUserData._id;
  const apiUserId = uniqueId || currentUserId;

  // console.log("=== BANK USER IDS ===");
  // console.log("Current User ID (from cookies):", currentUserId);
  // console.log("Target User ID (from URL):", uniqueId);
  // console.log("API User ID (will be used):", apiUserId);

  // State for form
  const [formData, setFormData] = useState({
    searchKey: "",
    masterPassword: "",
    transactionCode: "",
  });

  const [amounts, setAmounts] = useState({});
  const [statusMessages, setStatusMessages] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchValue, setSearchValue] = useState("");
  const [exportLoading, setExportLoading] = useState({
    excel: false,
    pdf: false,
  });

  // State for ledger data
  const [userLedgerData, setUserLedgerData] = useState({});

  // ✅ Fetch users data
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
    isError: isUsersError,
    error: usersError,
  } = useQuery(
    ["bankUsers", { apiUserId, page, limit, searchValue }],
    () => {
      console.log("🔄 BANK API CALL TRIGGERED");
      console.log("API Parameters:", {
        apiUserId,
        page,
        limit,
        searchValue,
        hasToken: !!cookies?.token,
      });

      if (!apiUserId) {
        console.error("❌ NO USER ID AVAILABLE FOR API CALL");
        return Promise.resolve({
          success: false,
          error: "No user ID available",
          users: [],
        });
      }

      if (!cookies?.token) {
        console.error("❌ NO TOKEN AVAILABLE");
        return Promise.resolve({
          success: false,
          error: "Authentication token missing",
          users: [],
        });
      }

      return getDownlineUsers(
        cookies,
        apiUserId,
        null,
        null,
        page,
        limit,
        searchValue
      );
    },
    {
      enabled: !!apiUserId && !!cookies?.token,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 1,
      onSuccess: (data) => {
        console.log("✅ BANK API SUCCESS:", data?.success);
        console.log("Users count:", data?.users?.length);

        // Jab users data load ho, toh har user ka ledger bhi fetch karein
        if (data?.users && data.users.length > 0) {
          fetchUserLedgers(data.users);
        }
      },
      onError: (error) => {
        console.log("❌ BANK API ERROR:", error);
      },
    }
  );

  // ✅ Function to fetch ledger for each user
  const fetchUserLedgers = async (users) => {
    const ledgerPromises = users.map(async (user) => {
      try {
        const ledgerData = await getLedger(
          cookies,
          user.__type || "Client",
          user.PersonalDetails?.loginId,
          null,
          null
        );

        return {
          userId: user._id,
          ledgerData,
        };
      } catch (error) {
        console.error(`Error fetching ledger for user ${user._id}:`, error);
        return {
          userId: user._id,
          ledgerData: null,
        };
      }
    });

    try {
      const results = await Promise.all(ledgerPromises);
      const ledgerMap = {};

      results.forEach((result) => {
        if (result.ledgerData) {
          ledgerMap[result.userId] = result.ledgerData;
        }
      });

      setUserLedgerData(ledgerMap);
    } catch (error) {
      console.error("Error fetching user ledgers:", error);
    }
  };

  // ✅ Reset state when URL changes
  useEffect(() => {
    console.log("🔄 URL CHANGED - Resetting state");
    setPage(1);
    setSearchValue("");
    setAmounts({});
    setStatusMessages({});
    setUserLedgerData({});
  }, [uniqueId]);

  // Process users data for display
  const accountData =
    usersData?.users?.map((user) => {
      const ledger = userLedgerData[user._id];
      let ledgerBalance = 0;
      let lenaHai = 0;
      let denaHai = 0;

      if (ledger?.success && ledger?.ledger) {
        // Calculate ledger balance
        ledgerBalance = ledger.ledger.reduce(
          (acc, curr) => acc + (Number(curr?.dena) - Number(curr?.lena)),
          0
        );

        // Calculate lena hai (credit)
        lenaHai = ledger.ledger
          .filter((doc) => Number(doc?.dena) - Number(doc?.lena) > 0)
          .reduce(
            (acc, curr) => acc + (Number(curr?.dena) - Number(curr?.lena)),
            0
          );

        // Calculate dena hai (debit)
        denaHai = ledger.ledger
          .filter((doc) => Number(doc?.lena) - Number(doc?.dena) > 0)
          .reduce(
            (acc, curr) => acc + (Number(curr?.lena) - Number(curr?.dena)),
            0
          );
      }

      return {
        id: user._id,
        username: user.PersonalDetails?.userName || "N/A",
        loginId: user.PersonalDetails?.loginId || "N/A",
        cr: user.AccountDetails?.ExposureLimit?.toFixed(2) || "0.00",
        pts: user.AccountDetails?.Balance?.toFixed(2) || "0.00",
        clientPL: user.AccountDetails?.profitLoss?.toFixed(2) || "0.00",
        exposure: user.AccountDetails?.Exposure?.toFixed(2) || "0.00",
        availablePts:
          user.AccountDetails?.Balance && user.AccountDetails?.Exposure
            ? (
                user.AccountDetails.Balance - user.AccountDetails.Exposure
              ).toFixed(2)
            : user.AccountDetails?.Balance?.toFixed(2) || "0.00",
        accountType: user.__type || "Client",
        userLocked: user.userLocked || false,
        ledgerBalance: ledgerBalance.toFixed(2),
        lenaHai: lenaHai.toFixed(2),
        denaHai: denaHai.toFixed(2),
        originalData: user,
      };
    }) || [];

  // Format data for export
  const prepareExportData = () => {
    return accountData.map((user) => ({
      "User Name": user.username,
      "Login ID": user.loginId,
      CR: parseFloat(user.cr).toLocaleString("en-IN"),
      Pts: parseFloat(user.pts).toLocaleString("en-IN"),
      "Client(P/L)": parseFloat(user.clientPL).toLocaleString("en-IN"),
      Exposure: parseFloat(user.exposure).toLocaleString("en-IN"),
      "Available Pts": parseFloat(user.availablePts).toLocaleString("en-IN"),
      "Ledger Balance": parseFloat(user.ledgerBalance).toLocaleString("en-IN"),
      "Lena Hai": parseFloat(user.lenaHai).toLocaleString("en-IN"),
      "Dena Hai": parseFloat(user.denaHai).toLocaleString("en-IN"),
      "Account Type": user.accountType,
      Status: user.userLocked ? "Locked" : "Active",
    }));
  };

  // Handle Excel export
  const handleExcelExport = async () => {
    if (accountData.length === 0) {
      ErrorPopup("No data available to export", 2000);
      return;
    }

    try {
      setExportLoading((prev) => ({ ...prev, excel: true }));
      const exportData = prepareExportData();

      // Call the bankexportToExcel function
      bankexportToExcel(exportData, "bank-users");

      // Show success message after a short delay
      setTimeout(() => {
        SuccessPopup("Excel file downloaded successfully!");
      }, 500);
    } catch (error) {
      console.error("Excel export error:", error);
      ErrorPopup("Failed to export Excel file", 3000);
    } finally {
      setExportLoading((prev) => ({ ...prev, excel: false }));
    }
  };

  // Handle PDF export
  const handlePDFExport = async () => {
    if (accountData.length === 0) {
      ErrorPopup("No data available to export", 2000);
      return;
    }

    try {
      setExportLoading((prev) => ({ ...prev, pdf: true }));
      const exportData = prepareExportData();

      // Call the bankexportToPDF function
      await bankexportToPDF(exportData, "bank-users");

      // Show success message after a short delay
      setTimeout(() => {
        SuccessPopup("PDF file downloaded successfully!");
      }, 500);
    } catch (error) {
      console.error("PDF export error:", error);
      ErrorPopup("Failed to export PDF file", 3000);
    } finally {
      setExportLoading((prev) => ({ ...prev, pdf: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAmountChange = (userId, value) => {
    setAmounts((prev) => ({
      ...prev,
      [userId]: value,
    }));
    // Clear status message when user types
    setStatusMessages((prev) => ({
      ...prev,
      [userId]: "",
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(formData.searchKey);
    setPage(1);
  };

  const handleReset = () => {
    setFormData({
      ...formData,
      searchKey: "",
    });
    setSearchValue("");
    setPage(1);
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  const handleSubmit = async (user) => {
    const userId = user.id;
    const amount = amounts[userId];
    const transactionPassword = formData.transactionCode;

    if (!amount || parseFloat(amount) === 0 || isNaN(amount)) {
      setStatusMessages((prev) => ({
        ...prev,
        [userId]: "Please enter a valid amount",
      }));
      return;
    }

    if (!transactionPassword) {
      setStatusMessages((prev) => ({
        ...prev,
        [userId]: "Please enter transaction code",
      }));
      return;
    }

    // Set loading state for this specific user
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));

    const requestType = parseFloat(amount) > 0 ? "deposit" : "withdraw";

    try {
      await bankMutation.mutateAsync({
        cookies,
        requestType,
        transactionPassword,
        downlineUserId: user.originalData._id,
        uplineUserId: user.originalData.upline?._id || apiUserId,
        amount: Math.abs(parseFloat(amount)),
        userId: userId,
      });
    } catch (error) {
      console.error("Transaction error:", error);
    }
  };

  // ✅ NEW: Function to view ledger for a user
  const handleViewLedger = (user) => {
    const ledger = userLedgerData[user.id];
    if (ledger?.success) {
      const message = `
        User: ${user.username} (${user.loginId})
        Ledger Balance: ₹${user.ledgerBalance}
        Lena Hai: ₹${user.lenaHai}
        Dena Hai: ₹${user.denaHai}
        Total Entries: ${ledger.ledger?.length || 0}
      `;
      SuccessPopup(message, 5000);
    } else {
      ErrorPopup("Ledger data not available for this user", 2000);
    }
  };

  // ✅ NEW: Function to refresh ledger for a specific user
  const handleRefreshLedger = async (userId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));

      // Find the user
      const user = accountData.find((u) => u.id === userId);
      if (!user) return;

      const ledgerData = await getLedger(
        cookies,
        user.accountType,
        user.loginId,
        null,
        null
      );

      setUserLedgerData((prev) => ({
        ...prev,
        [userId]: ledgerData,
      }));

      SuccessPopup("Ledger refreshed successfully", 2000);
    } catch (error) {
      console.error("Error refreshing ledger:", error);
      ErrorPopup("Failed to refresh ledger", 2000);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleTransferAll = async (e) => {
    e.preventDefault();

    if (!formData.masterPassword) {
      ErrorPopup("Please enter master password", 2000);
      return;
    }

    ErrorPopup("Transfer All functionality not implemented yet", 2000);
  };

  const handleAllAction = (user) => {
    // Set the amount to user's available points
    const allAmount = user.availablePts.replace(/,/g, "");
    setAmounts((prev) => ({
      ...prev,
      [user.id]: allAmount,
    }));
  };

  // ✅ Bank transaction mutation
  const bankMutation = useMutation(chipDepositWithdraw, {
    onSuccess: (data, variables) => {
      const { userId } = variables;
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));

      if (data.success === true) {
        SuccessPopup(data?.msg || "Transaction Successful").then(() => {
          // Clear amount for this user
          setAmounts((prev) => ({ ...prev, [userId]: "" }));
          // Clear status message
          setStatusMessages((prev) => ({ ...prev, [userId]: "" }));
          refetchUsers();

          // Refresh ledger data for this user
          if (variables.downlineUserId) {
            handleRefreshLedger(variables.downlineUserId);
          }
        });
      } else {
        setStatusMessages((prev) => ({
          ...prev,
          [userId]: data?.error || data?.errors || "Transaction failed",
        }));
      }
    },
    onError: (error, variables) => {
      const { userId } = variables;
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
      setStatusMessages((prev) => ({
        ...prev,
        [userId]: error?.message || "Something went wrong",
      }));
    },
  });

  // ✅ Show initial loading if cookies not yet loaded
  if (!cookies?.token) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading authentication...</span>
        </div>
        <p className="mt-2">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Bank</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/admin/home" target="_self" data-discover="true">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item active">
                  <span aria-current="location">Bank</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="row bank-panel">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="report-form mb-1">
                <div className="row row5">
                  <div className="col-md-6 mb-2 search-form">
                    <form
                      method="post"
                      className="ajaxFormSubmit"
                      onSubmit={handleSearch}
                    >
                      <div className="d-inline-block form-group form-group-feedback form-group-feedback-right">
                        <input
                          placeholder="Search User"
                          className="form-control"
                          type="text"
                          name="searchKey"
                          value={formData.searchKey}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-inline-block">
                        <button
                          id="submit"
                          className="btn btn-primary mx-1"
                          disabled={isLoadingUsers}
                        >
                          {isLoadingUsers ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-2" />
                              Loading...
                            </>
                          ) : (
                            "Load"
                          )}
                        </button>
                        <button
                          type="button"
                          id="reset"
                          className="btn btn-light"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-6 text-right">
                    <div className="d-inline-block">
                      <div className="d-inline-block">
                        <button
                          type="button"
                          className="btn mr-1 btn-success"
                          onClick={handleExcelExport}
                          disabled={
                            exportLoading.excel || accountData.length === 0
                          }
                          title="Export to Excel"
                        >
                          {exportLoading.excel ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Exporting...
                            </>
                          ) : (
                            <i className="fas fa-file-excel" />
                          )}
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handlePDFExport}
                        disabled={exportLoading.pdf || accountData.length === 0}
                        title="Export to PDF"
                      >
                        {exportLoading.pdf ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Exporting...
                          </>
                        ) : (
                          <i className="fas fa-file-pdf" />
                        )}
                      </button>
                    </div>
                    <form
                      action="#"
                      data-vv-scope="transferAll"
                      className="d-inline-block"
                      onSubmit={handleTransferAll}
                    >
                      <div className="d-inline-block form-group form-group-feedback form-group-feedback-right mx-1">
                        <input
                          placeholder="Transaction Code"
                          className="form-control undefined"
                          type="password"
                          name="transactionCode"
                          value={formData.transactionCode}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="d-inline-block">
                        <button
                          type="submit"
                          id="transferSubmit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Transfer All"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <div id="tickets-table_length" className="dataTables_length">
                    <label className="d-inline-flex align-items-center">
                      {" "}
                      Show&nbsp;{" "}
                      <select
                        className="custom-select custom-select-sm"
                        value={limit}
                        onChange={handleLimitChange}
                        disabled={isLoadingUsers}
                      >
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={250}>250</option>
                        <option value={500}>500</option>
                        <option value={750}>750</option>
                        <option value={1000}>1000</option>
                      </select>
                      &nbsp;entries{" "}
                    </label>
                  </div>
                </div>
              </div>
              <div className="table-responsive mb-0">
                {isLoadingUsers ? (
                  <div className="text-center p-4" style={{ fontSize: "2rem" }}>
                    <i className="fa fa-spinner fa-spin" />
                  </div>
                ) : isUsersError ? (
                  <div className="text-center p-4">
                    <div className="alert alert-danger">
                      <h5>Error Loading Data</h5>
                      <p>{usersError?.message || "Failed to load bank data"}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => refetchUsers()}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : usersData?.success === false ? (
                  <div className="text-center p-4">
                    <div className="alert alert-warning">
                      <p>{usersData?.error || "Unknown error occurred"}</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => refetchUsers()}
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : accountData.length > 0 ? (
                  <div className="table no-footer table-hover table-responsive-sm">
                    <table
                      id="eventsListTbl"
                      role="table"
                      aria-busy="false"
                      aria-colcount={12}
                      className="table b-table "
                    >
                      <colgroup>
                        <col style={{ width: 200 }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: "auto" }} />
                        <col style={{ width: 250 }} />
                        <col style={{ width: 200 }} />
                      </colgroup>
                      <thead role="rowgroup">
                        <tr role="row">
                          <th role="columnheader" scope="col" aria-colindex={1}>
                            <div>User Name</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={2}
                            className="text-right"
                          >
                            <div>CR</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={3}
                            className="text-right"
                          >
                            <div>Pts</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={4}
                            className="text-right"
                          >
                            <div>Client(P/L)</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={5}
                            className="text-right"
                          >
                            <div>Exposure</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={6}
                            className="text-right"
                          >
                            <div>Available Pts</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={7}
                            className="text-right"
                          >
                            <div>Ledger Balance</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={8}
                            className="text-right"
                          >
                            <div>Lena Hai</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={9}
                            className="text-right"
                          >
                            <div>Dena Hai</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={10}
                          >
                            <div>Account Type</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={11}
                          >
                            <div>Action</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            aria-colindex={12}
                          >
                            <div>Status</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {accountData.map((user) => (
                          <tr key={user.id} role="row">
                            <td role="cell">{user.username}</td>
                            <td role="cell" className="text-right">
                              {parseFloat(user.cr).toLocaleString("en-IN")}
                            </td>
                            <td role="cell" className="text-right">
                              {parseFloat(user.pts).toLocaleString("en-IN")}
                            </td>
                            <td role="cell" className="text-right">
                              {parseFloat(user.clientPL).toLocaleString(
                                "en-IN"
                              )}
                            </td>
                            <td role="cell" className="text-right">
                              {parseFloat(user.exposure).toLocaleString(
                                "en-IN"
                              )}
                            </td>
                            <td role="cell" className="text-right">
                              {parseFloat(user.availablePts).toLocaleString(
                                "en-IN"
                              )}
                            </td>
                            <td role="cell" className="text-right">
                              <span
                                className={`font-weight-bold ${
                                  parseFloat(user.ledgerBalance) > 0
                                    ? "text-success"
                                    : parseFloat(user.ledgerBalance) < 0
                                    ? "text-danger"
                                    : ""
                                }`}
                                title="View Ledger"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleViewLedger(user)}
                              >
                                {parseFloat(user.ledgerBalance).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </td>
                            <td role="cell" className="text-right">
                              <span className="text-success">
                                {parseFloat(user.lenaHai).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </td>
                            <td role="cell" className="text-right">
                              <span className="text-danger">
                                {parseFloat(user.denaHai).toLocaleString(
                                  "en-IN"
                                )}
                              </span>
                            </td>
                            <td role="cell">{user.accountType}</td>
                            <td role="cell">
                              <div className="d-flex align-items-center">
                                <button
                                  className="btn btn-sm btn-outline-info mr-1"
                                  onClick={() => handleRefreshLedger(user.id)}
                                  disabled={loadingStates[user.id]}
                                  title="Refresh Ledger"
                                >
                                  <i className="fas fa-sync-alt"></i>
                                </button>
                                <a
                                  className="text-success mr-2"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleAllAction(user)}
                                  title="Use all available points"
                                >
                                  All <i className="fas fa-arrow-right" />
                                </a>
                                <input
                                  className="form-control form-control-sm transfer-amt mx-1"
                                  placeholder="0"
                                  type="number"
                                  value={amounts[user.id] || ""}
                                  onChange={(e) =>
                                    handleAmountChange(user.id, e.target.value)
                                  }
                                  style={{ width: "80px" }}
                                />
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => handleSubmit(user)}
                                  disabled={loadingStates[user.id]}
                                  title="Submit transaction"
                                >
                                  {loadingStates[user.id] ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                  ) : (
                                    "Submit"
                                  )}
                                </button>
                              </div>
                            </td>
                            <td
                              role="cell"
                              className={
                                statusMessages[user.id]?.includes(
                                  "Please enter"
                                ) ||
                                statusMessages[user.id]?.includes("failed") ||
                                statusMessages[user.id]?.includes("wrong")
                                  ? "text-danger"
                                  : statusMessages[user.id]?.includes(
                                      "successful"
                                    )
                                  ? "text-success"
                                  : "text-muted"
                              }
                            >
                              {statusMessages[user.id] ||
                                (user.userLocked ? "Locked" : "Active")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="alert alert-info">
                      <h5>No Accounts Found</h5>
                      <p>No user accounts available to display.</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => refetchUsers()}
                      >
                        Refresh
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="row pt-3">
                <div className="col">
                  <div className="dataTables_paginate paging_simple_numbers float-right">
                    <ul className="pagination pagination-rounded mb-0">
                      <li
                        className={`page-item ${page === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          «
                        </button>
                      </li>
                      <li
                        className={`page-item ${page === 1 ? "disabled" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          ‹
                        </button>
                      </li>
                      <li className="page-item active">
                        <button className="page-link">{page}</button>
                      </li>
                      <li
                        className={`page-item ${
                          !usersData?.hasMore ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage((p) => p + 1)}
                          disabled={!usersData?.hasMore}
                        >
                          ›
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          !usersData?.hasMore ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(usersData?.totalPages || 1)}
                          disabled={!usersData?.hasMore}
                        >
                          »
                        </button>
                      </li>
                    </ul>
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

export default Bank;

// import React, { useState, useEffect } from "react";
// import { useCookies } from "react-cookie";
// import { useQuery } from "react-query";
// import { getDownlineUsers } from "../../../Helper/users";
// import { chipDepositWithdraw } from "../../../Helper/chips";
// import { decodedTokenData } from "../../../Helper/auth";
// import { useParams } from "react-router-dom";
// import SuccessPopup from "../../../Popups/SuccessPopup";
// import ErrorPopup from "../../../Popups/ErrorPopup";
// import { useMutation } from "react-query";
// import {
//   bankexportToExcel,
//   bankexportToPDF,
// } from "../../../Helper/exportHelper";

// const Bank = () => {
//   const [cookies] = useCookies(["Admin"]);
//   const { uniqueId, userId: loginId } = useParams();

//   // Debug info on mount
//   useEffect(() => {
//     console.log("=== BANK DEBUG INFO ===");
//     console.log("URL Params:", { uniqueId, loginId });
//     console.log("Cookies token available:", !!cookies?.token);
//     console.log("Admin cookie available:", !!cookies?.Admin);
//   }, [cookies, uniqueId, loginId]);

//   // Get current user data - SAME AS AccountList
//   const currentUserData = decodedTokenData(cookies) || {};
//   const currentUserId = currentUserData.userId || currentUserData._id;
//   const apiUserId = uniqueId || currentUserId;

//   console.log("=== BANK USER IDS ===");
//   console.log("Current User ID (from cookies):", currentUserId);
//   console.log("Target User ID (from URL):", uniqueId);
//   console.log("API User ID (will be used):", apiUserId);

//   // State for form
//   const [formData, setFormData] = useState({
//     searchKey: "",
//     masterPassword: "",
//     transactionCode: "",
//   });

//   const [amounts, setAmounts] = useState({});
//   const [statusMessages, setStatusMessages] = useState({});
//   const [loadingStates, setLoadingStates] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(25);
//   const [searchValue, setSearchValue] = useState("");
//   const [exportLoading, setExportLoading] = useState({
//     excel: false,
//     pdf: false,
//   });

//   // ✅ FIXED: Fetch users data with SAME configuration as AccountList
//   const {
//     data: usersData,
//     isLoading: isLoadingUsers,
//     refetch: refetchUsers,
//     isError: isUsersError,
//     error: usersError,
//   } = useQuery(
//     ["bankUsers", { apiUserId, page, limit, searchValue }],
//     () => {
//       console.log("🔄 BANK API CALL TRIGGERED");
//       console.log("API Parameters:", {
//         apiUserId,
//         page,
//         limit,
//         searchValue,
//         hasToken: !!cookies?.token,
//       });

//       // ✅ Check if we have valid user ID AND token (SAME as AccountList)
//       if (!apiUserId) {
//         console.error("❌ NO USER ID AVAILABLE FOR API CALL");
//         return Promise.resolve({
//           success: false,
//           error: "No user ID available",
//           users: [],
//         });
//       }

//       if (!cookies?.token) {
//         console.error("❌ NO TOKEN AVAILABLE");
//         return Promise.resolve({
//           success: false,
//           error: "Authentication token missing",
//           users: [],
//         });
//       }

//       return getDownlineUsers(
//         cookies,
//         apiUserId,
//         null,
//         null,
//         page,
//         limit,
//         searchValue
//       );
//     },
//     {
//       // ✅ SAME as AccountList: Only call if we have user ID AND cookies
//       enabled: !!apiUserId && !!cookies?.token,
//       refetchOnWindowFocus: false,
//       keepPreviousData: true, // ✅ ADDED: Same as AccountList
//       retry: 1, // ✅ ADDED: Same as AccountList
//       onSuccess: (data) => {
//         console.log("✅ BANK API SUCCESS:", data?.success);
//         console.log("Users count:", data?.users?.length);
//       },
//       onError: (error) => {
//         console.log("❌ BANK API ERROR:", error);
//       },
//     }
//   );

//   // ✅ FIXED: Reset state when URL changes (SAME as AccountList)
//   useEffect(() => {
//     console.log("🔄 URL CHANGED - Resetting state");
//     setPage(1);
//     setSearchValue("");
//     setAmounts({});
//     setStatusMessages({});
//   }, [uniqueId]);

//   // Process users data for display
//   const accountData =
//     usersData?.users?.map((user) => ({
//       id: user._id,
//       username: user.PersonalDetails?.userName || "N/A",
//       loginId: user.PersonalDetails?.loginId || "N/A",
//       cr: user.AccountDetails?.ExposureLimit?.toFixed(2) || "0.00",
//       pts: user.AccountDetails?.Balance?.toFixed(2) || "0.00",
//       clientPL: user.AccountDetails?.profitLoss?.toFixed(2) || "0.00",
//       exposure: user.AccountDetails?.Exposure?.toFixed(2) || "0.00",
//       availablePts:
//         user.AccountDetails?.Balance && user.AccountDetails?.Exposure
//           ? (
//               user.AccountDetails.Balance - user.AccountDetails.Exposure
//             ).toFixed(2)
//           : user.AccountDetails?.Balance?.toFixed(2) || "0.00",
//       accountType: user.__type || "Client",
//       userLocked: user.userLocked || false,
//       originalData: user,
//     })) || [];

//   // Format data for export
//   const prepareExportData = () => {
//     return accountData.map((user) => ({
//       "User Name": user.username,
//       "Login ID": user.loginId,
//       CR: parseFloat(user.cr).toLocaleString("en-IN"),
//       Pts: parseFloat(user.pts).toLocaleString("en-IN"),
//       "Client(P/L)": parseFloat(user.clientPL).toLocaleString("en-IN"),
//       Exposure: parseFloat(user.exposure).toLocaleString("en-IN"),
//       "Available Pts": parseFloat(user.availablePts).toLocaleString("en-IN"),
//       "Account Type": user.accountType,
//       Status: user.userLocked ? "Locked" : "Active",
//     }));
//   };

//   // Handle Excel export
//   const handleExcelExport = async () => {
//     if (accountData.length === 0) {
//       ErrorPopup("No data available to export", 2000);
//       return;
//     }

//     try {
//       setExportLoading((prev) => ({ ...prev, excel: true }));
//       const exportData = prepareExportData();

//       // Call the bankexportToExcel function
//       bankexportToExcel(exportData, "bank-users");

//       // Show success message after a short delay
//       setTimeout(() => {
//         SuccessPopup("Excel file downloaded successfully!");
//       }, 500);
//     } catch (error) {
//       console.error("Excel export error:", error);
//       ErrorPopup("Failed to export Excel file", 3000);
//     } finally {
//       setExportLoading((prev) => ({ ...prev, excel: false }));
//     }
//   };

//   // Handle PDF export
//   const handlePDFExport = async () => {
//     if (accountData.length === 0) {
//       ErrorPopup("No data available to export", 2000);
//       return;
//     }

//     try {
//       setExportLoading((prev) => ({ ...prev, pdf: true }));
//       const exportData = prepareExportData();

//       // Call the bankexportToPDF function
//       await bankexportToPDF(exportData, "bank-users");

//       // Show success message after a short delay
//       setTimeout(() => {
//         SuccessPopup("PDF file downloaded successfully!");
//       }, 500);
//     } catch (error) {
//       console.error("PDF export error:", error);
//       ErrorPopup("Failed to export PDF file", 3000);
//     } finally {
//       setExportLoading((prev) => ({ ...prev, pdf: false }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleAmountChange = (userId, value) => {
//     setAmounts((prev) => ({
//       ...prev,
//       [userId]: value,
//     }));
//     // Clear status message when user types
//     setStatusMessages((prev) => ({
//       ...prev,
//       [userId]: "",
//     }));
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setSearchValue(formData.searchKey);
//     setPage(1);
//   };

//   const handleReset = () => {
//     setFormData({
//       ...formData,
//       searchKey: "",
//     });
//     setSearchValue("");
//     setPage(1);
//   };

//   const handleLimitChange = (e) => {
//     setLimit(parseInt(e.target.value));
//     setPage(1);
//   };

//   const handleSubmit = async (user) => {
//     const userId = user.id;
//     const amount = amounts[userId];
//     const transactionPassword = formData.transactionCode;

//     if (!amount || parseFloat(amount) === 0 || isNaN(amount)) {
//       setStatusMessages((prev) => ({
//         ...prev,
//         [userId]: "Please enter a valid amount",
//       }));
//       return;
//     }

//     if (!transactionPassword) {
//       setStatusMessages((prev) => ({
//         ...prev,
//         [userId]: "Please enter transaction code",
//       }));
//       return;
//     }

//     // Set loading state for this specific user
//     setLoadingStates((prev) => ({ ...prev, [userId]: true }));

//     const requestType = parseFloat(amount) > 0 ? "deposit" : "withdraw";

//     try {
//       await bankMutation.mutateAsync({
//         cookies,
//         requestType,
//         transactionPassword,
//         downlineUserId: user.originalData._id,
//         uplineUserId: user.originalData.upline?._id || apiUserId,
//         amount: Math.abs(parseFloat(amount)),
//         userId: userId,
//       });
//     } catch (error) {
//       console.error("Transaction error:", error);
//     }
//   };

//   const handleTransferAll = async (e) => {
//     e.preventDefault();

//     if (!formData.masterPassword) {
//       ErrorPopup("Please enter master password", 2000);
//       return;
//     }

//     ErrorPopup("Transfer All functionality not implemented yet", 2000);
//   };

//   const handleAllAction = (user) => {
//     // Set the amount to user's available points
//     const allAmount = user.availablePts.replace(/,/g, "");
//     setAmounts((prev) => ({
//       ...prev,
//       [user.id]: allAmount,
//     }));
//   };

//   // ✅ FIXED: Bank transaction mutation with proper error handling
//   const bankMutation = useMutation(chipDepositWithdraw, {
//     onSuccess: (data, variables) => {
//       const { userId } = variables;
//       setLoadingStates((prev) => ({ ...prev, [userId]: false }));

//       if (data.success === true) {
//         SuccessPopup(data?.msg || "Transaction Successful").then(() => {
//           // Clear amount for this user
//           setAmounts((prev) => ({ ...prev, [userId]: "" }));
//           // Clear status message
//           setStatusMessages((prev) => ({ ...prev, [userId]: "" }));
//           refetchUsers();
//         });
//       } else {
//         setStatusMessages((prev) => ({
//           ...prev,
//           [userId]: data?.error || data?.errors || "Transaction failed",
//         }));
//       }
//     },
//     onError: (error, variables) => {
//       const { userId } = variables;
//       setLoadingStates((prev) => ({ ...prev, [userId]: false }));
//       setStatusMessages((prev) => ({
//         ...prev,
//         [userId]: error?.message || "Something went wrong",
//       }));
//     },
//   });

//   // ✅ Show initial loading if cookies not yet loaded
//   if (!cookies?.token) {
//     return (
//       <div className="text-center p-5">
//         <div className="spinner-border text-primary" role="status">
//           <span className="sr-only">Loading authentication...</span>
//         </div>
//         <p className="mt-2">Loading authentication...</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="row">
//         <div className="col-12">
//           <div className="page-title-box d-flex align-items-center justify-content-between">
//             <h4 className="mb-0 font-size-18">Bank</h4>
//             <div className="page-title-right">
//               <ol className="breadcrumb m-0">
//                 <li className="breadcrumb-item">
//                   <a href="/admin/home" target="_self" data-discover="true">
//                     Home
//                   </a>
//                 </li>
//                 <li className="breadcrumb-item active">
//                   <span aria-current="location">Bank</span>
//                 </li>
//               </ol>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="row bank-panel">
//         <div className="col-12">
//           <div className="card">
//             <div className="card-body">
//               {/* Debug Info (optional) */}
//               {/* <div className="alert alert-info py-2 mb-3">
//                 <small>
//                   <strong>Status:</strong>{" "}
//                   {isLoadingUsers
//                     ? "Loading..."
//                     : accountData.length > 0
//                     ? `${accountData.length} accounts found`
//                     : "No accounts"}{" "}
//                   | <strong>User ID:</strong> {apiUserId}
//                 </small>
//               </div> */}

//               <div className="report-form mb-1">
//                 <div className="row row5">
//                   <div className="col-md-6 mb-2 search-form">
//                     <form
//                       method="post"
//                       className="ajaxFormSubmit"
//                       onSubmit={handleSearch}
//                     >
//                       <div className="d-inline-block form-group form-group-feedback form-group-feedback-right">
//                         <input
//                           placeholder="Search User"
//                           className="form-control"
//                           type="text"
//                           name="searchKey"
//                           value={formData.searchKey}
//                           onChange={handleChange}
//                         />
//                       </div>
//                       <div className="d-inline-block">
//                         <button
//                           id="submit"
//                           className="btn btn-primary mx-1"
//                           disabled={isLoadingUsers}
//                         >
//                           {isLoadingUsers ? (
//                             <>
//                               <i className="fa fa-spinner fa-spin mr-2" />
//                               Loading...
//                             </>
//                           ) : (
//                             "Load"
//                           )}
//                         </button>
//                         <button
//                           type="button"
//                           id="reset"
//                           className="btn btn-light"
//                           onClick={handleReset}
//                         >
//                           Reset
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                   <div className="col-md-6 text-right">
//                     <div className="d-inline-block">
//                       <div className="d-inline-block">
//                         <button
//                           type="button"
//                           className="btn mr-1 btn-success"
//                           onClick={handleExcelExport}
//                           disabled={
//                             exportLoading.excel || accountData.length === 0
//                           }
//                           title="Export to Excel"
//                         >
//                           {exportLoading.excel ? (
//                             <>
//                               <span className="spinner-border spinner-border-sm me-2"></span>
//                               Exporting...
//                             </>
//                           ) : (
//                             <i className="fas fa-file-excel" />
//                           )}
//                         </button>
//                       </div>
//                       <button
//                         type="button"
//                         className="btn btn-danger"
//                         onClick={handlePDFExport}
//                         disabled={exportLoading.pdf || accountData.length === 0}
//                         title="Export to PDF"
//                       >
//                         {exportLoading.pdf ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2"></span>
//                             Exporting...
//                           </>
//                         ) : (
//                           <i className="fas fa-file-pdf" />
//                         )}
//                       </button>
//                     </div>
//                     <form
//                       action="#"
//                       data-vv-scope="transferAll"
//                       className="d-inline-block"
//                       onSubmit={handleTransferAll}
//                     >
//                       <div className="d-inline-block form-group form-group-feedback form-group-feedback-right mx-1">
//                         <input
//                           placeholder="Transaction Code"
//                           className="form-control undefined"
//                           type="password"
//                           name="transactionCode"
//                           value={formData.transactionCode}
//                           onChange={handleChange}
//                         />
//                       </div>
//                       <div className="d-inline-block">
//                         <button
//                           type="submit"
//                           id="transferSubmit"
//                           className="btn btn-primary"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? "Processing..." : "Transfer All"}
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="col-6">
//                   <div id="tickets-table_length" className="dataTables_length">
//                     <label className="d-inline-flex align-items-center">
//                       {" "}
//                       Show&nbsp;{" "}
//                       <select
//                         className="custom-select custom-select-sm"
//                         value={limit}
//                         onChange={handleLimitChange}
//                         disabled={isLoadingUsers}
//                       >
//                         <option value={25}>25</option>
//                         <option value={50}>50</option>
//                         <option value={100}>100</option>
//                         <option value={250}>250</option>
//                         <option value={500}>500</option>
//                         <option value={750}>750</option>
//                         <option value={1000}>1000</option>
//                       </select>
//                       &nbsp;entries{" "}
//                     </label>
//                   </div>
//                 </div>
//               </div>
//               <div className="table-responsive mb-0">
//                 {isLoadingUsers ? (
//                   <div className="text-center p-4" style={{ fontSize: "2rem" }}>
//                     <i className="fa fa-spinner fa-spin" />
//                   </div>
//                 ) : isUsersError ? (
//                   <div className="text-center p-4">
//                     <div className="alert alert-danger">
//                       <h5>Error Loading Data</h5>
//                       <p>{usersError?.message || "Failed to load bank data"}</p>
//                       <button
//                         className="btn btn-primary"
//                         onClick={() => refetchUsers()}
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   </div>
//                 ) : usersData?.success === false ? (
//                   <div className="text-center p-4">
//                     <div className="alert alert-warning">
//                       <p>{usersData?.error || "Unknown error occurred"}</p>
//                       <button
//                         className="btn btn-primary"
//                         onClick={() => refetchUsers()}
//                       >
//                         Retry
//                       </button>
//                     </div>
//                   </div>
//                 ) : accountData.length > 0 ? (
//                   <div className="table no-footer table-hover table-responsive-sm">
//                     <table
//                       id="eventsListTbl"
//                       role="table"
//                       aria-busy="false"
//                       aria-colcount={9}
//                       className="table b-table "
//                     >
//                       <colgroup>
//                         <col style={{ width: 200 }} />
//                         <col style={{ width: "auto" }} />
//                         <col style={{ width: "auto" }} />
//                         <col style={{ width: "auto" }} />
//                         <col style={{ width: "auto" }} />
//                         <col style={{ width: "auto" }} />
//                         <col style={{ width: "auto" }} />
//                         <col style={{ width: 250 }} />
//                         <col style={{ width: 200 }} />
//                       </colgroup>
//                       <thead role="rowgroup">
//                         <tr role="row">
//                           <th role="columnheader" scope="col" aria-colindex={1}>
//                             <div>User Name</div>
//                           </th>
//                           <th
//                             role="columnheader"
//                             scope="col"
//                             aria-colindex={2}
//                             className="text-right"
//                           >
//                             <div>CR</div>
//                           </th>
//                           <th
//                             role="columnheader"
//                             scope="col"
//                             aria-colindex={3}
//                             className="text-right"
//                           >
//                             <div>Pts</div>
//                           </th>
//                           <th
//                             role="columnheader"
//                             scope="col"
//                             aria-colindex={4}
//                             className="text-right"
//                           >
//                             <div>Client(P/L)</div>
//                           </th>
//                           <th
//                             role="columnheader"
//                             scope="col"
//                             aria-colindex={5}
//                             className="text-right"
//                           >
//                             <div>Exposure</div>
//                           </th>
//                           <th
//                             role="columnheader"
//                             scope="col"
//                             aria-colindex={5}
//                             className="text-right"
//                           >
//                             <div>Available Pts</div>
//                           </th>
//                           <th role="columnheader" scope="col" aria-colindex={6}>
//                             <div>Account Type</div>
//                           </th>
//                           <th role="columnheader" scope="col" aria-colindex={7}>
//                             <div>Action</div>
//                           </th>
//                           <th role="columnheader" scope="col" aria-colindex={8}>
//                             <div>Status</div>
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody role="rowgroup">
//                         {accountData.map((user) => (
//                           <tr key={user.id} role="row">
//                             <td role="cell">{user.username}</td>
//                             <td role="cell" className="text-right">
//                               {parseFloat(user.cr).toLocaleString("en-IN")}
//                             </td>
//                             <td role="cell" className="text-right">
//                               {parseFloat(user.pts).toLocaleString("en-IN")}
//                             </td>
//                             <td role="cell" className="text-right">
//                               {parseFloat(user.clientPL).toLocaleString(
//                                 "en-IN"
//                               )}
//                             </td>
//                             <td role="cell" className="text-right">
//                               {parseFloat(user.exposure).toLocaleString(
//                                 "en-IN"
//                               )}
//                             </td>
//                             <td role="cell" className="text-right">
//                               {parseFloat(user.availablePts).toLocaleString(
//                                 "en-IN"
//                               )}
//                             </td>
//                             <td role="cell">{user.accountType}</td>
//                             <td role="cell">
//                               <a
//                                 className="text-success"
//                                 style={{ cursor: "pointer" }}
//                                 onClick={() => handleAllAction(user)}
//                                 title="Use all available points"
//                               >
//                                 All <i className="fas fa-arrow-right" />
//                               </a>
//                               <input
//                                 className="form-control form-control-sm transfer-amt mx-1"
//                                 placeholder="0"
//                                 type="number"
//                                 value={amounts[user.id] || ""}
//                                 onChange={(e) =>
//                                   handleAmountChange(user.id, e.target.value)
//                                 }
//                                 style={{ width: "100px" }}
//                               />
//                               <button
//                                 className="btn btn-info btn-sm"
//                                 onClick={() => handleSubmit(user)}
//                                 disabled={loadingStates[user.id]}
//                                 title="Submit transaction"
//                               >
//                                 {loadingStates[user.id] ? (
//                                   <span className="spinner-border spinner-border-sm"></span>
//                                 ) : (
//                                   "Submit"
//                                 )}
//                               </button>
//                             </td>
//                             <td
//                               role="cell"
//                               className={
//                                 statusMessages[user.id]?.includes(
//                                   "Please enter"
//                                 ) ||
//                                 statusMessages[user.id]?.includes("failed") ||
//                                 statusMessages[user.id]?.includes("wrong")
//                                   ? "text-danger"
//                                   : statusMessages[user.id]?.includes(
//                                       "successful"
//                                     )
//                                   ? "text-success"
//                                   : "text-muted"
//                               }
//                             >
//                               {statusMessages[user.id] ||
//                                 (user.userLocked ? "Locked" : "Active")}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="text-center p-4">
//                     <div className="alert alert-info">
//                       <h5>No Accounts Found</h5>
//                       <p>No user accounts available to display.</p>
//                       <button
//                         className="btn btn-primary"
//                         onClick={() => refetchUsers()}
//                       >
//                         Refresh
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div className="row pt-3">
//                 <div className="col">
//                   <div className="dataTables_paginate paging_simple_numbers float-right">
//                     <ul className="pagination pagination-rounded mb-0">
//                       <li
//                         className={`page-item ${page === 1 ? "disabled" : ""}`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => setPage((p) => Math.max(1, p - 1))}
//                           disabled={page === 1}
//                         >
//                           «
//                         </button>
//                       </li>
//                       <li
//                         className={`page-item ${page === 1 ? "disabled" : ""}`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => setPage((p) => Math.max(1, p - 1))}
//                           disabled={page === 1}
//                         >
//                           ‹
//                         </button>
//                       </li>
//                       <li className="page-item active">
//                         <button className="page-link">{page}</button>
//                       </li>
//                       <li
//                         className={`page-item ${
//                           !usersData?.hasMore ? "disabled" : ""
//                         }`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => setPage((p) => p + 1)}
//                           disabled={!usersData?.hasMore}
//                         >
//                           ›
//                         </button>
//                       </li>
//                       <li
//                         className={`page-item ${
//                           !usersData?.hasMore ? "disabled" : ""
//                         }`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => setPage(usersData?.totalPages || 1)}
//                           disabled={!usersData?.hasMore}
//                         >
//                           »
//                         </button>
//                       </li>
//                     </ul>
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

// export default Bank;
