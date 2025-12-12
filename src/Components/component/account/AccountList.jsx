import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Deposit from "../../modals/Deposit";
import Withdrawl from "../../modals/Withdrawl";
import Profile from "../../modals/Profile";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { getDownlineUsers } from "../../../Helper/users";
import { decodedTokenData } from "../../../Helper/auth";

const AccountList = () => {
  const navigate = useNavigate();
  const { usertype: userTypeParam, uniqueId, userId: loginId } = useParams();
  const [cookies] = useCookies(["Admin"]);

  // FIX: Priority order for user ID
  const targetUserId = uniqueId; // URL parameter
  const currentUserData = decodedTokenData(cookies) || {};
  const currentUserId = currentUserData.userId || currentUserData._id;

  // FIX: Final user ID for API - URL parameter has priority
  const apiUserId = targetUserId || currentUserId;

  console.log("=== DEBUG INFO Accountlist ===");
  console.log("URL Params:", { userTypeParam, uniqueId, loginId });
  console.log("Target User ID (from URL):", targetUserId);
  console.log("Current User ID (from cookies):", currentUserId);
  console.log("API User ID (will be used):", apiUserId);

  // State for managing popups
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Pagination and search states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchValue, setSearchValue] = useState("");

  // FIX: Proper API call with correct user ID
  const {
    isLoading,
    isError,
    error,
    data: apiData,
    refetch,
  } = useQuery(
    ["accountUsers", { apiUserId, page, limit, searchValue }],
    () => {
      // console.log("🔄 API CALL TRIGGERED");
      // console.log("API Parameters:", {
      //   apiUserId,
      //   page,
      //   limit,
      //   searchValue,
      // });

      // FIX: Ensure we have valid user ID
      if (!apiUserId) {
        // console.error("❌ NO USER ID AVAILABLE FOR API CALL");
        return Promise.resolve({ success: false, error: "No user ID" });
      }

      return getDownlineUsers(
        cookies,
        apiUserId, // ✅ Use the correct user ID
        null, // All user types
        null, // All account types
        page,
        limit,
        searchValue
      );
    },
    {
      enabled: !!apiUserId && !!cookies?.token, // ✅ Only call if we have user ID AND cookies
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 1,
      onSuccess: (data) => {
        // console.log("✅ API SUCCESS:", data);
        console.log("Users count:", data?.users?.length);
      },
      onError: (error) => {
        console.log("❌ API ERROR:", error);
      },
    }
  );

  // FIX: Reset data when URL changes
  useEffect(() => {
    // console.log("🔄 URL CHANGED - Resetting state");
    setPage(1);
    setSearchValue("");
  }, [targetUserId]);

  // Process API data - FIXED: Include all necessary data for popups
  const accountData =
    apiData?.users?.map((user) => ({
      id: user._id,
      username: user.PersonalDetails?.userName || "N/A",
      loginId: user.PersonalDetails?.loginId || "N/A",
      cr: user.AccountDetails?.ExposureLimit?.toFixed(2) || "0.00",
      pts: user.AccountDetails?.Balance?.toFixed(2) || "0.00",
      clientPL: user.AccountDetails?.profitLoss?.toFixed(2) || "0.00",
      clientPLPercent:
        user.AccountDetails?.profitLoss &&
        user.AccountDetails?.Balance &&
        user.AccountDetails.Balance !== 0
          ? (
              (user.AccountDetails.profitLoss / user.AccountDetails.Balance) *
              100
            ).toFixed(2) + "%"
          : "0%",
      exposure: user.AccountDetails?.Exposure?.toFixed(2) || "0.00",
      availablePts:
        user.AccountDetails?.Balance && user.AccountDetails?.Exposure
          ? (
              user.AccountDetails.Balance - user.AccountDetails.Exposure
            ).toFixed(2)
          : user.AccountDetails?.Balance?.toFixed(2) || "0.00",
      betStatus: !user.bettingLocked,
      userStatus: !user.userLocked,
      parentName: user.upline?.PersonalDetails?.userName || "0 PNR",
      accountType: user.__type || "Client",
      fullName: user.PersonalDetails?.userName || "N/A",
      mobileNumber: user.PersonalDetails?.mobile || "N/A",
      city: "N/A",
      creditPts: "0.00",
      casinoPts: "0.00",
      sportsPts: "0.00",
      thirdPartyPts: "0.00",
      createdDate: user.createdAt
        ? new Date(user.createdAt).toLocaleString("en-GB")
        : "N/A",
      partnershipName: "Partnership With No Return",
      userPart: "0",
      ourPart: "100",
      // FIXED: Include all original data for popups
      originalData: {
        ...user,
        // Ensure all required fields are available
        PersonalDetails: user.PersonalDetails || {},
        AccountDetails: user.AccountDetails || {},
        __type: user.__type || "Client",
        _id: user._id,
      },
    })) || [];

  // Handler functions - FIXED: Pass complete account data
  const handleDepositClick = (account) => {
    // console.log("💰 Deposit clicked for:", account.username);
    // console.log("Account data for deposit:", account.originalData);
    setSelectedAccount(account.originalData);
    setShowDeposit(true);
  };

  const handleWithdrawClick = (account) => {
    // console.log("💸 Withdraw clicked for:", account.username);
    // console.log("Account data for withdraw:", account.originalData);
    setSelectedAccount(account.originalData);
    setShowWithdraw(true);
  };

  const handleProfileClick = (account) => {
    // console.log("👤 More/Profile clicked for:", account.username);
    // console.log("Account data for profile:", account.originalData);
    setSelectedAccount(account.originalData);
    setShowProfile(true);
  };

  const handleCloseDeposit = () => {
    console.log("Closing Deposit popup");
    setShowDeposit(false);
    setSelectedAccount(null);
  };

  const handleCloseWithdraw = () => {
    // console.log("Closing Withdraw popup");
    setShowWithdraw(false);
    setSelectedAccount(null);
  };

  const handleCloseProfile = () => {
    // console.log("Closing Profile popup");
    setShowProfile(false);
    setSelectedAccount(null);
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchKey = formData.get("searchKey");
    setSearchValue(searchKey);
    setPage(1);
  };

  // Reset search
  const handleReset = () => {
    setSearchValue("");
    setPage(1);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  // Handle user click - FIXED: Added event parameter
  const handleUserClick = (userId, loginId, userType, event) => {
    // Prevent default behavior
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // console.log("🖱️ User clicked:", {
    //   username: loginId,
    //   userType,
    //   shouldNavigate: userType !== "Client",
    // });

    // Only navigate for non-Client users
    if (userType !== "Client") {
      // console.log("🚀 Navigating to:", `/user/all/${userId}/${loginId}`);
      navigate(`/user/all/${userId}/${loginId}`);
    } else {
      console.log("⛔ Navigation blocked - Client user");
    }
  };

  // Manual refetch
  const handleManualRefetch = () => {
    // console.log("Manual refetch triggered");
    refetch();
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">
                Account List {loginId ? `- ${loginId}` : ""}
              </h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">
                      Account List {loginId ? `- ${loginId}` : ""}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="row account-list">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                {/* Simple Debug Info */}
                {/* <div className="alert alert-info py-2 mb-3">
                  <small>
                    <strong>Status:</strong>{" "}
                    {isLoading
                      ? "Loading..."
                      : accountData.length > 0
                      ? `${accountData.length} accounts found`
                      : "No accounts"}{" "}
                    |<strong> Selected:</strong>{" "}
                    {selectedAccount
                      ? selectedAccount.PersonalDetails?.userName
                      : "None"}
                  </small>
                </div> */}

                <div className="row row5">
                  <div className="col-md-6 mb-2 search-form">
                    <form
                      method="post"
                      className="ajaxFormSubmit"
                      onSubmit={handleSearch}
                    >
                      <div className="d-inline-block form-group form-group-feedback form-group-feedback-right">
                        <input
                          type="text"
                          name="searchKey"
                          placeholder="Search User"
                          className="form-control"
                          defaultValue={searchValue}
                        />
                      </div>
                      <div className="d-inline-block">
                        <button
                          type="submit"
                          id="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Loading..." : "Load"}
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
                  <div className="col-md-6 text-right mb-2">
                    <div className="d-inline-block mr-2">
                      <div id="export_1763977068791" className="d-inline-block">
                        <button
                          type="button"
                          disabled="disabled"
                          className="btn mr-1 btn-success disabled"
                        >
                          <i className="fas fa-file-excel" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled="disabled"
                        className="btn btn-danger disabled"
                      >
                        <i className="fas fa-file-pdf" />
                      </button>
                    </div>
                    <div className="d-inline-block">
                      <Link
                        to="/admin/users/insertuser"
                        className="btn btn-success"
                      >
                        <i aria-hidden="true" className="fa fa-plus" /> CREATE
                        ACCOUNT
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="dataTables_length">
                      <label className="d-inline-flex align-items-center">
                        Show&nbsp;
                        <select
                          className="custom-select custom-select-sm"
                          value={limit}
                          onChange={handleLimitChange}
                          disabled={isLoading}
                        >
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={250}>250</option>
                          <option value={500}>500</option>
                          <option value={750}>750</option>
                          <option value={1000}>1000</option>
                        </select>
                        &nbsp;entries
                      </label>
                    </div>
                  </div>
                </div>

                <div className="table-responsive mb-0">
                  {isLoading ? (
                    <div
                      className="text-center p-4"
                      style={{ fontSize: "2rem" }}
                    >
                      <i className="fa fa-spinner fa-spin" />
                    </div>
                  ) : isError ? (
                    <div className="text-center p-4">
                      <div className="alert alert-danger">
                        <h5>Error Loading Data</h5>
                        <p>{error?.message || "Failed to load accounts"}</p>
                        <button
                          className="btn btn-primary"
                          onClick={handleManualRefetch}
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : apiData?.success === false ? (
                    <div className="text-center p-4">
                      <div className="alert alert-warning">
                        <p>{apiData?.error || "Unknown error occurred"}</p>
                        <button
                          className="btn btn-primary"
                          onClick={handleManualRefetch}
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : accountData.length > 0 ? (
                    <div className="table no-footer table-responsive-sm">
                      <table className="table b-table">
                        <thead>
                          <tr>
                            <th>User Name</th>
                            <th>CR</th>
                            <th>Pts</th>
                            <th>Client(P/L)</th>
                            <th>Client(P/L) %</th>
                            <th>Exposure</th>
                            <th>Available Pts</th>
                            <th>B st</th>
                            <th>U st</th>
                            <th>PName</th>
                            <th>Account Type</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountData.map((account) => (
                            <tr key={account.id}>
                              <td>
                                <span
                                  className={`cursor-pointer ${
                                    account.accountType === "Client"
                                      ? "text-muted cursor-not-allowed"
                                      : "text-primary hover:underline"
                                  }`}
                                  onClick={(e) =>
                                    handleUserClick(
                                      account.id,
                                      account.loginId,
                                      account.accountType,
                                      e
                                    )
                                  }
                                  style={{
                                    cursor:
                                      account.accountType === "Client"
                                        ? "not-allowed"
                                        : "pointer",
                                  }}
                                  title={
                                    account.accountType === "Client"
                                      ? "Client account - cannot navigate"
                                      : `View ${account.username} details`
                                  }
                                >
                                  {account.username}
                                  {/* {account.accountType === "Client" &&
                                    " (Client)"} */}
                                </span>
                              </td>
                              <td className="text-right text-warning">
                                {account.cr}
                              </td>
                              <td className="text-right text-warning">
                                {account.pts}
                              </td>
                              <td className="text-right text-warning">
                                {account.clientPL}
                              </td>
                              <td className="text-right text-warning">
                                {account.clientPLPercent}
                              </td>
                              <td className="text-right text-warning">
                                {account.exposure}
                              </td>
                              <td className="text-right text-warning">
                                {account.availablePts}
                              </td>
                              <td>
                                <div className="custom-control custom-switch">
                                  <input
                                    className="custom-control-input"
                                    disabled
                                    type="checkbox"
                                    checked={account.betStatus}
                                    readOnly
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="custom-control custom-switch">
                                  <input
                                    className="custom-control-input"
                                    disabled
                                    type="checkbox"
                                    checked={account.userStatus}
                                    readOnly
                                  />
                                </div>
                              </td>
                              <td>{account.parentName}</td>
                              <td>{account.accountType}</td>
                              <td>
                                <div className="btn-group">
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => handleDepositClick(account)}
                                    title={`Deposit for ${account.username}`}
                                  >
                                    D
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleWithdrawClick(account)}
                                    title={`Withdraw from ${account.username}`}
                                  >
                                    W
                                  </button>
                                  <button
                                    className="btn btn-info btn-sm"
                                    onClick={() => handleProfileClick(account)}
                                    title={`View ${account.username} profile`}
                                  >
                                    More
                                  </button>
                                </div>
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
                          onClick={handleManualRefetch}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                <div className="row pt-3">
                  <div className="col">
                    <div className="dataTables_paginate paging_simple_numbers float-right">
                      <ul className="pagination pagination-rounded mb-0">
                        <li className="page-item disabled">
                          <span className="page-link">«</span>
                        </li>
                        <li className="page-item disabled">
                          <span className="page-link">‹</span>
                        </li>
                        <li className="page-item active">
                          <button className="page-link">{page}</button>
                        </li>
                        <li className="page-item disabled">
                          <span className="page-link">›</span>
                        </li>
                        <li className="page-item disabled">
                          <span className="page-link">»</span>
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

      {/* Popup Windows - FIXED: Pass complete account data */}
      <Deposit
        isOpen={showDeposit}
        onClose={handleCloseDeposit}
        account={selectedAccount}
      />

      <Withdrawl
        isOpen={showWithdraw}
        onClose={handleCloseWithdraw}
        account={selectedAccount}
      />

      <Profile
        isOpen={showProfile}
        onClose={handleCloseProfile}
        account={selectedAccount}
      />
    </>
  );
};

export default AccountList;






// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Link, useParams, useNavigate } from "react-router-dom";
// import Deposit from "../../modals/Deposit";
// import Withdrawl from "../../modals/Withdrawl";
// import Profile from "../../modals/Profile";
// import { useCookies } from "react-cookie";
// import { useQuery } from "react-query";
// import { getDownlineUsers } from "../../../Helper/users";
// import { decodedTokenData } from "../../../Helper/auth";

// const AccountList = () => {
//   const navigate = useNavigate();
//   const { usertype: userTypeParam, uniqueId, userId: loginId } = useParams();
//   const [cookies] = useCookies(["Admin"]);

//   // User ID Management
//   const targetUserId = uniqueId;
//   const currentUserData = decodedTokenData(cookies) || {};
//   const currentUserId = currentUserData.userId || currentUserData._id;
//   const apiUserId = targetUserId || currentUserId;

//   // State Management
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [showDeposit, setShowDeposit] = useState(false);
//   const [showWithdraw, setShowWithdraw] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(25);
//   const [searchValue, setSearchValue] = useState("");

//   // API Call with React Query
//   const {
//     isLoading,
//     isError,
//     error,
//     data: apiData,
//     refetch,
//   } = useQuery(
//     ["accountUsers", { apiUserId, page, limit, searchValue }],
//     () => {
//       if (!apiUserId) {
//         return Promise.resolve({ success: false, error: "No user ID" });
//       }
//       return getDownlineUsers(cookies, apiUserId, null, null, page, limit, searchValue);
//     },
//     {
//       enabled: !!apiUserId && !!cookies?.token,
//       refetchOnWindowFocus: false,
//       keepPreviousData: true,
//       retry: 1,
//     }
//   );

//   // Reset when URL changes
//   useEffect(() => {
//     setPage(1);
//     setSearchValue("");
//   }, [targetUserId]);

//   // Memoized Data Processing - useMemo for expensive calculations
//   const accountData = useMemo(() =>
//     apiData?.users?.map((user) => ({
//       id: user._id,
//       username: user.PersonalDetails?.userName || "N/A",
//       loginId: user.PersonalDetails?.loginId || "N/A",
//       cr: user.AccountDetails?.ExposureLimit?.toFixed(2) || "0.00",
//       pts: user.AccountDetails?.Balance?.toFixed(2) || "0.00",
//       clientPL: user.AccountDetails?.profitLoss?.toFixed(2) || "0.00",
//       clientPLPercent:
//         user.AccountDetails?.profitLoss && user.AccountDetails?.Balance && user.AccountDetails.Balance !== 0
//           ? ((user.AccountDetails.profitLoss / user.AccountDetails.Balance) * 100).toFixed(2) + "%"
//           : "0%",
//       exposure: user.AccountDetails?.Exposure?.toFixed(2) || "0.00",
//       availablePts:
//         user.AccountDetails?.Balance && user.AccountDetails?.Exposure
//           ? (user.AccountDetails.Balance - user.AccountDetails.Exposure).toFixed(2)
//           : user.AccountDetails?.Balance?.toFixed(2) || "0.00",
//       betStatus: !user.bettingLocked,
//       userStatus: !user.userLocked,
//       parentName: user.upline?.PersonalDetails?.userName || "0 PNR",
//       accountType: user.__type || "Client",
//       fullName: user.PersonalDetails?.userName || "N/A",
//       mobileNumber: user.PersonalDetails?.mobile || "N/A",
//       city: "N/A",
//       creditPts: "0.00",
//       casinoPts: "0.00",
//       sportsPts: "0.00",
//       thirdPartyPts: "0.00",
//       createdDate: user.createdAt
//         ? new Date(user.createdAt).toLocaleString("en-GB")
//         : "N/A",
//       partnershipName: "Partnership With No Return",
//       userPart: "0",
//       ourPart: "100",
//       originalData: {
//         ...user,
//         PersonalDetails: user.PersonalDetails || {},
//         AccountDetails: user.AccountDetails || {},
//         __type: user.__type || "Client",
//         _id: user._id,
//       },
//     })) || [],
//     [apiData?.users] // Only recalculate when apiData.users changes
//   );

//   // Optimized Handlers with useCallback
//   const handleDepositClick = useCallback((account) => {
//     setSelectedAccount(account.originalData);
//     setShowDeposit(true);
//   }, []);

//   const handleWithdrawClick = useCallback((account) => {
//     setSelectedAccount(account.originalData);
//     setShowWithdraw(true);
//   }, []);

//   const handleProfileClick = useCallback((account) => {
//     setSelectedAccount(account.originalData);
//     setShowProfile(true);
//   }, []);

//   const handleCloseDeposit = useCallback(() => {
//     setShowDeposit(false);
//     setSelectedAccount(null);
//   }, []);

//   const handleCloseWithdraw = useCallback(() => {
//     setShowWithdraw(false);
//     setSelectedAccount(null);
//   }, []);

//   const handleCloseProfile = useCallback(() => {
//     setShowProfile(false);
//     setSelectedAccount(null);
//   }, []);

//   // Search Handlers
//   const handleSearch = useCallback((e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const searchKey = formData.get("searchKey");
//     setSearchValue(searchKey);
//     setPage(1);
//   }, []);

//   const handleReset = useCallback(() => {
//     setSearchValue("");
//     setPage(1);
//   }, []);

//   const handleLimitChange = useCallback((e) => {
//     setLimit(parseInt(e.target.value));
//     setPage(1);
//   }, []);

//   // Navigation Handler
//   const handleUserClick = useCallback((userId, loginId, userType, event) => {
//     if (event) {
//       event.preventDefault();
//       event.stopPropagation();
//     }

//     if (userType !== "Client") {
//       navigate(`/user/all/${userId}/${loginId}`);
//     }
//   }, [navigate]);

//   const handleManualRefetch = useCallback(() => {
//     refetch();
//   }, [refetch]);

//   // Render loading, error, or data
//   const renderTableContent = useMemo(() => {
//     if (isLoading) {
//       return (
//         <div className="text-center p-4">
//           <div className="spinner-border text-primary" role="status">
//             <span className="sr-only">Loading...</span>
//           </div>
//           <p className="mt-2">Loading accounts...</p>
//         </div>
//       );
//     }

//     if (isError) {
//       return (
//         <div className="text-center p-4">
//           <div className="alert alert-danger">
//             <h5>Error Loading Data</h5>
//             <p>{error?.message || "Failed to load accounts"}</p>
//             <button className="btn btn-primary" onClick={handleManualRefetch}>
//               Retry
//             </button>
//           </div>
//         </div>
//       );
//     }

//     if (apiData?.success === false) {
//       return (
//         <div className="text-center p-4">
//           <div className="alert alert-warning">
//             <p>{apiData?.error || "Unknown error occurred"}</p>
//             <button className="btn btn-primary" onClick={handleManualRefetch}>
//               Retry
//             </button>
//           </div>
//         </div>
//       );
//     }

//     if (accountData.length > 0) {
//       return (
//         <div className="table no-footer table-responsive-sm">
//           <table className="table b-table">
//             <thead>
//               <tr>
//                 <th>User Name</th>
//                 <th>CR</th>
//                 <th>Pts</th>
//                 <th>Client(P/L)</th>
//                 <th>Client(P/L) %</th>
//                 <th>Exposure</th>
//                 <th>Available Pts</th>
//                 <th>B st</th>
//                 <th>U st</th>
//                 <th>PName</th>
//                 <th>Account Type</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {accountData.map((account) => (
//                 <TableRow
//                   key={account.id}
//                   account={account}
//                   onUserClick={handleUserClick}
//                   onDepositClick={handleDepositClick}
//                   onWithdrawClick={handleWithdrawClick}
//                   onProfileClick={handleProfileClick}
//                 />
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center p-4">
//         <div className="alert alert-info">
//           <h5>No Accounts Found</h5>
//           <p>No user accounts available to display.</p>
//           <button className="btn btn-primary" onClick={handleManualRefetch}>
//             Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }, [
//     isLoading,
//     isError,
//     error,
//     apiData,
//     accountData,
//     handleManualRefetch,
//     handleUserClick,
//     handleDepositClick,
//     handleWithdrawClick,
//     handleProfileClick
//   ]);

//   return (
//     <>
//       <div>
//         {/* Header and other JSX remains same */}
//         <div className="row">
//           <div className="col-12">
//             <div className="page-title-box d-flex align-items-center justify-content-between">
//               <h4 className="mb-0 font-size-18">
//                 Account List {loginId ? `- ${loginId}` : ""}
//               </h4>
//               {/* ... rest of header */}
//             </div>
//           </div>
//         </div>

//         <div className="row account-list">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 {/* Search Form */}
//                 <div className="row row5">
//                   <div className="col-md-6 mb-2 search-form">
//                     <form method="post" className="ajaxFormSubmit" onSubmit={handleSearch}>
//                       <div className="d-inline-block form-group form-group-feedback form-group-feedback-right">
//                         <input
//                           type="text"
//                           name="searchKey"
//                           placeholder="Search User"
//                           className="form-control"
//                           defaultValue={searchValue}
//                         />
//                       </div>
//                       <div className="d-inline-block">
//                         <button type="submit" className="btn btn-primary" disabled={isLoading}>
//                           {isLoading ? "Loading..." : "Load"}
//                         </button>
//                         <button type="button" className="btn btn-light" onClick={handleReset}>
//                           Reset
//                         </button>
//                       </div>
//                     </form>
//                   </div>
//                   {/* ... other controls */}
//                 </div>

//                 {/* Limit Selector */}
//                 <div className="row">
//                   <div className="col-sm-12 col-md-6">
//                     <div className="dataTables_length">
//                       <label className="d-inline-flex align-items-center">
//                         Show&nbsp;
//                         <select
//                           className="custom-select custom-select-sm"
//                           value={limit}
//                           onChange={handleLimitChange}
//                           disabled={isLoading}
//                         >
//                           <option value={25}>25</option>
//                           <option value={50}>50</option>
//                           <option value={100}>100</option>
//                           <option value={250}>250</option>
//                           <option value={500}>500</option>
//                           <option value={750}>750</option>
//                           <option value={1000}>1000</option>
//                         </select>
//                         &nbsp;entries
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Table Content */}
//                 <div className="table-responsive mb-0">
//                   {renderTableContent}
//                 </div>

//                 {/* Pagination */}
//                 <div className="row pt-3">
//                   <div className="col">
//                     <div className="dataTables_paginate paging_simple_numbers float-right">
//                       <ul className="pagination pagination-rounded mb-0">
//                         <li className="page-item disabled"><span className="page-link">«</span></li>
//                         <li className="page-item disabled"><span className="page-link">‹</span></li>
//                         <li className="page-item active"><button className="page-link">{page}</button></li>
//                         <li className="page-item disabled"><span className="page-link">›</span></li>
//                         <li className="page-item disabled"><span className="page-link">»</span></li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popup Modals */}
//       <Deposit isOpen={showDeposit} onClose={handleCloseDeposit} account={selectedAccount} />
//       <Withdrawl isOpen={showWithdraw} onClose={handleCloseWithdraw} account={selectedAccount} />
//       <Profile isOpen={showProfile} onClose={handleCloseProfile} account={selectedAccount} />
//     </>
//   );
// };

// // Separate TableRow Component for better performance
// const TableRow = React.memo(({
//   account,
//   onUserClick,
//   onDepositClick,
//   onWithdrawClick,
//   onProfileClick
// }) => (
//   <tr>
//     <td>
//       <span
//         className={`cursor-pointer ${
//           account.accountType === "Client" ? "text-muted cursor-not-allowed" : "text-primary hover:underline"
//         }`}
//         onClick={(e) => onUserClick(account.id, account.loginId, account.accountType, e)}
//         style={{
//           cursor: account.accountType === "Client" ? "not-allowed" : "pointer",
//         }}
//         title={
//           account.accountType === "Client"
//             ? "Client account - cannot navigate"
//             : `View ${account.username} details`
//         }
//       >
//         {account.username}
//       </span>
//     </td>
//     <td className="text-right text-warning">{account.cr}</td>
//     <td className="text-right text-warning">{account.pts}</td>
//     <td className="text-right text-warning">{account.clientPL}</td>
//     <td className="text-right text-warning">{account.clientPLPercent}</td>
//     <td className="text-right text-warning">{account.exposure}</td>
//     <td className="text-right text-warning">{account.availablePts}</td>
//     <td>
//       <div className="custom-control custom-switch">
//         <input className="custom-control-input" disabled type="checkbox" checked={account.betStatus} readOnly />
//       </div>
//     </td>
//     <td>
//       <div className="custom-control custom-switch">
//         <input className="custom-control-input" disabled type="checkbox" checked={account.userStatus} readOnly />
//       </div>
//     </td>
//     <td>{account.parentName}</td>
//     <td>{account.accountType}</td>
//     <td>
//       <div className="btn-group">
//         <button className="btn btn-success btn-sm" onClick={() => onDepositClick(account)} title={`Deposit for ${account.username}`}>
//           D
//         </button>
//         <button className="btn btn-danger btn-sm" onClick={() => onWithdrawClick(account)} title={`Withdraw from ${account.username}`}>
//           W
//         </button>
//         <button className="btn btn-info btn-sm" onClick={() => onProfileClick(account)} title={`View ${account.username} profile`}>
//           More
//         </button>
//       </div>
//     </td>
//   </tr>
// ));

// export default AccountList;
