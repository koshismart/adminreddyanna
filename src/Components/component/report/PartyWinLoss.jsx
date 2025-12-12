import React, { useState, useEffect, useMemo } from "react";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { getDownlineUsers } from "../../../Helper/users";
import { getMyProfitLossReport } from "../../../Helper/profitLoss";
import { decodedTokenData, signout } from "../../../Helper/auth";
import { useNavigate } from "react-router-dom";
import {
  partyExportToExcel,
  partyExportToPDF,
} from "../../../Helper/exportHelper";

const PartyWinLoss = () => {
  const [cookies] = useCookies(["Admin"]);
  const navigate = useNavigate();

  // Debug logs
  // console.log("🚀 PARTY WIN/LOSS COMPONENT");

  // Get current user data
  const currentUserData = decodedTokenData(cookies) || {};
  const currentUserId = currentUserData.userId || currentUserData._id;
  const apiUserId = currentUserId; // Use current logged in user

  // State for filters
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [sportTypeFilter, setSportTypeFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // Date filters
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return oneMonthAgo.toISOString().substring(0, 10);
  });

  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toLocaleDateString("en-CA");
  });

  // State for export loading
  const [exportLoading, setExportLoading] = useState({
    excel: false,
    pdf: false,
  });

  // ✅ Fetch downline users data (for user list)
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
    isError: isUsersError,
    error: usersError,
  } = useQuery(
    [
      "partyWinLossUsers",
      { apiUserId, page, limit, searchValue, userTypeFilter },
    ],
    () => {
      if (!apiUserId) {
        return Promise.resolve({
          success: false,
          error: "No user ID available",
          users: [],
        });
      }

      if (!cookies?.token) {
        return Promise.resolve({
          success: false,
          error: "Please login to continue",
          users: [],
        });
      }

      // Prepare parameters for getDownlineUsers
      const usertype = userTypeFilter === "all" ? null : userTypeFilter;

      return getDownlineUsers(
        cookies,
        apiUserId,
        usertype,
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
        // Check for authentication errors
        if (
          data?.error?.includes("Authentication") ||
          data?.error?.includes("Invalid token") ||
          data?.error?.includes("Token has expired")
        ) {
          console.error("🔴 Authentication error, logging out");
          signout(currentUserId, () => {
            navigate("/login");
          });
        }
      },
    }
  );

  // ✅ Fetch profit/loss data for selected users
  const {
    data: profitLossData,
    isLoading: isLoadingProfitLoss,
    refetch: refetchProfitLoss,
    isError: isProfitLossError,
    error: profitLossError,
  } = useQuery(
    [
      "profitLossReport",
      { startDate, endDate, sportTypeFilter, page, limit, searchValue },
    ],
    () => {
      const sportType = sportTypeFilter === "all" ? null : sportTypeFilter;

      return getMyProfitLossReport(
        cookies,
        sportType,
        startDate,
        endDate,
        page,
        limit,
        searchValue
      );
    },
    {
      enabled: !!cookies?.token,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 1,
    }
  );

  // Combine both data sources
  const combinedData = useMemo(() => {
    if (!usersData?.users || !profitLossData?.finishedGamesData) {
      return [];
    }

    // Create a map of users by their loginId or username
    const usersMap = {};
    usersData.users.forEach((user) => {
      const loginId = user.PersonalDetails?.loginId;
      const username = user.PersonalDetails?.userName;
      if (loginId) usersMap[loginId] = user;
      if (username) usersMap[username] = user;
    });

    // Combine profit/loss data with user info
    return profitLossData.finishedGamesData
      .map((game, index) => {
        // Try to find user by game name or other identifier
        const itemNo = (page - 1) * limit + index + 1;
        const user = usersMap[game.gameName] || usersData.users[0] || {};

        const accountDetails = user.AccountDetails || {};
        const personalDetails = user.PersonalDetails || {};

        // Get points from user account
        const casinoPts =
          accountDetails.casinoBalance || accountDetails.casinoPts || 0;
        const sportsPts =
          accountDetails.sportsBalance || accountDetails.sportsPts || 0;
        const thirdPartyPts =
          accountDetails.thirdPartyBalance || accountDetails.thirdPartyPts || 0;

        // Calculate profit/loss from game data
        const gameProfitLoss =
          game.myShareProfitLoss || game.totalProfitLoss || 0;

        // Get user type/level
        const userLevel = user.__type || "Client";

        // Get partnership type
        const partnershipType =
          user.partnershipName || "Partnership With No Return";

        return {
          no: itemNo,
          username: personalDetails.userName || game.gameName || "N/A",
          loginId: personalDetails.loginId || "N/A",
          level: userLevel,
          casinoPts: parseFloat(casinoPts).toFixed(2),
          sportsPts: parseFloat(sportsPts).toFixed(2),
          thirdPartyPts: parseFloat(thirdPartyPts).toFixed(2),
          profitLoss: parseFloat(gameProfitLoss).toFixed(2),
          ptype: partnershipType,
          gameData: game,
          userData: user,
        };
      })
      .filter((item) => item.username !== "N/A"); // Filter out items without user data
  }, [usersData, profitLossData, page, limit]);

  // console.log("📊 Combined Data:", {
  //   usersCount: usersData?.users?.length || 0,
  //   profitLossCount: profitLossData?.finishedGamesData?.length || 0,
  //   combinedCount: combinedData.length,
  // });

  // Calculate totals
  const totals = useMemo(() => {
    if (combinedData.length === 0) {
      return {
        casinoPts: "0.00",
        sportsPts: "0.00",
        thirdPartyPts: "0.00",
        profitLoss: "0.00",
      };
    }

    return {
      casinoPts: combinedData
        .reduce((sum, item) => sum + parseFloat(item.casinoPts), 0)
        .toFixed(2),
      sportsPts: combinedData
        .reduce((sum, item) => sum + parseFloat(item.sportsPts), 0)
        .toFixed(2),
      thirdPartyPts: combinedData
        .reduce((sum, item) => sum + parseFloat(item.thirdPartyPts), 0)
        .toFixed(2),
      profitLoss: combinedData
        .reduce((sum, item) => sum + parseFloat(item.profitLoss), 0)
        .toFixed(2),
    };
  }, [combinedData]);

  // Format data for export
  const prepareExportData = () => {
    return combinedData.map((item) => ({
      No: item.no,
      "User Name": item.username,
      "Login ID": item.loginId,
      Level: item.level,
      "Casino Pts": parseFloat(item.casinoPts).toLocaleString("en-IN"),
      "Sports Pts": parseFloat(item.sportsPts).toLocaleString("en-IN"),
      "Third Party Pts": parseFloat(item.thirdPartyPts).toLocaleString("en-IN"),
      "Profit/Loss": parseFloat(item.profitLoss).toLocaleString("en-IN"),
      "Partnership Type": item.ptype,
      "Game Date": item.gameData?.date || "N/A",
      "Sport Type": item.gameData?.sportType || "N/A",
      "Game Name": item.gameData?.gameName || "N/A",
    }));
  };

  // Handle Excel export
  const handleExcelExport = async () => {
    if (combinedData.length === 0) {
      // Note: You might want to add error handling here
      console.error("No data available to export");
      return;
    }

    try {
      setExportLoading((prev) => ({ ...prev, excel: true }));
      const exportData = prepareExportData();
      partyExportToExcel(exportData, "party-win-loss");

      setTimeout(() => {
        // console.log("Excel file downloaded successfully!");
      }, 500);
    } catch (error) {
      console.error("Excel export error:", error);
    } finally {
      setExportLoading((prev) => ({ ...prev, excel: false }));
    }
  };

  // Handle PDF export
  const handlePDFExport = async () => {
    if (combinedData.length === 0) {
      console.error("No data available to export");
      return;
    }

    try {
      setExportLoading((prev) => ({ ...prev, pdf: true }));
      const exportData = prepareExportData();
      await partyExportToPDF(exportData, "party-win-loss");

      setTimeout(() => {
        // console.log("PDF file downloaded successfully!");
      }, 500);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setExportLoading((prev) => ({ ...prev, pdf: false }));
    }
  };

  // Handle search
  const handleSearch = () => {
    setPage(1);
    refetchUsers();
    refetchProfitLoss();
  };

  // Handle reset
  const handleReset = () => {
    setUserTypeFilter("all");
    setSportTypeFilter("all");
    setSearchValue("");
    setPage(1);

    // Reset dates to default
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    setStartDate(oneMonthAgo.toISOString().substring(0, 10));

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setEndDate(tomorrow.toLocaleDateString("en-CA"));
  };

  // Handle search input change
  const handleSearchInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  // Check for authentication errors
  useEffect(() => {
    if (
      usersData?.error?.includes("Authentication") ||
      usersData?.error?.includes("Invalid token") ||
      usersData?.error?.includes("Token has expired") ||
      profitLossData?.error?.includes("Authentication") ||
      profitLossData?.error?.includes("Invalid token") ||
      profitLossData?.error?.includes("Token has expired")
    ) {
      console.error("🔴 Authentication error detected");
      signout(currentUserId, () => {
        navigate("/login");
      });
    }
  }, [usersData, profitLossData]);

  // Show loading state
  const isLoading = isLoadingUsers || isLoadingProfitLoss;
  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-2">Loading party win/loss data...</p>
      </div>
    );
  }

  // Show error state
  const hasError =
    isUsersError ||
    isProfitLossError ||
    usersData?.success === false ||
    profitLossData?.success === false;
  if (hasError) {
    const errorMessage =
      usersError?.message ||
      profitLossError?.message ||
      usersData?.error ||
      profitLossData?.error ||
      "Failed to load data";

    return (
      <div className="text-center p-5">
        <div className="alert alert-danger">
          <h4>Error Loading Data</h4>
          <p>{errorMessage}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              refetchUsers();
              refetchProfitLoss();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Party Win Loss</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/admin/home" target="_self">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item active">
                  <span aria-current="location">Profit Loss</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {/* Filters Form */}
              <form
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <div className="row row5">
                  <div className="form-group col-md-2">
                    <select
                      className="custom-select"
                      value={userTypeFilter}
                      onChange={(e) => setUserTypeFilter(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="Admin">Admin</option>
                      <option value="Agent">Agent</option>
                      <option value="Client">Client</option>
                    </select>
                  </div>

                  <div className="form-group col-md-2">
                    <select
                      className="custom-select"
                      value={sportTypeFilter}
                      onChange={(e) => setSportTypeFilter(e.target.value)}
                    >
                      <option value="all">All Sports</option>
                      <option value="cricket">Cricket</option>
                      <option value="tennis">Tennis</option>
                      <option value="soccer">Soccer</option>
                      <option value="casino">Casino</option>
                    </select>
                  </div>

                  <div className="form-group col-md-2">
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-md-2">
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group col-md-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSearch}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fa fa-spinner fa-spin mr-2"></i>
                          Loading...
                        </>
                      ) : (
                        "Load"
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <div className="d-inline-block">
                      <button
                        type="button"
                        className={`btn btn-success ${
                          combinedData.length === 0 ? "disabled" : ""
                        }`}
                        onClick={handleExcelExport}
                        disabled={
                          exportLoading.excel || combinedData.length === 0
                        }
                        title="Export to Excel"
                      >
                        {exportLoading.excel ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Exporting...
                          </>
                        ) : (
                          <i className="fas fa-file-excel"></i>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-danger ${
                        combinedData.length === 0 ? "disabled" : ""
                      }`}
                      onClick={handlePDFExport}
                      disabled={exportLoading.pdf || combinedData.length === 0}
                      title="Export to PDF"
                    >
                      {exportLoading.pdf ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Exporting...
                        </>
                      ) : (
                        <i className="fas fa-file-pdf"></i>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Search Box */}
              <div className="row mt-2">
                <div className="col-sm-12 col-md-12">
                  <div className="dataTables_filter text-md-right">
                    <label className="d-inline-flex align-items-center">
                      Search:
                      <input
                        type="search"
                        placeholder="Search by username or game..."
                        className="form-control form-control-sm ml-2"
                        value={searchValue}
                        onChange={handleSearchInputChange}
                        onKeyPress={handleKeyPress}
                        style={{ width: "250px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-primary ml-2"
                        onClick={handleSearch}
                        disabled={isLoading}
                      >
                        Go
                      </button>
                    </label>
                  </div>
                </div>
              </div>

              {/* Records per page selector */}
              <div className="row mt-2">
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
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                      &nbsp;entries
                    </label>
                  </div>
                </div>

                {/* <div className="col-sm-12 col-md-6 text-right">
                  <div className="alert alert-info py-2 mb-0">
                    <small>
                      Showing {combinedData.length} of{" "}
                      {profitLossData?.totalProfitLossRecords || 0} records |
                      Page {page} of{" "}
                      {profitLossData?.totalPages || usersData?.totalPages || 1}
                    </small>
                  </div>
                </div> */}
              </div>

              {/* Table */}
              <div className="table-responsive mb-0 mt-3">
                <table
                  id="plTbl"
                  role="table"
                  aria-busy={isLoading ? "true" : "false"}
                  aria-colcount={8}
                  className="table b-table table no-footer table-hover table-bordered"
                >
                  <thead role="rowgroup" className="">
                    <tr role="row" className="">
                      <th role="columnheader" scope="col" aria-colindex={1}>
                        <div>No</div>
                      </th>
                      <th role="columnheader" scope="col" aria-colindex={2}>
                        <div>User Name</div>
                      </th>
                      <th role="columnheader" scope="col" aria-colindex={3}>
                        <div>Level</div>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={4}
                        className="text-right"
                      >
                        <div>Casino Pts</div>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={5}
                        className="text-right"
                      >
                        <div>Sport Pts</div>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={6}
                        className="text-right"
                      >
                        <div>Third Party Pts</div>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={7}
                        className="text-right"
                      >
                        <div>Profit/Loss</div>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={8}
                        className="text-left"
                      >
                        <div>Ptype</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody role="rowgroup">
                    {combinedData.length > 0 ? (
                      combinedData.map((item) => (
                        <tr
                          key={`${item.loginId}-${item.no}`}
                          role="row"
                          className=""
                        >
                          <td aria-colindex={1} role="cell" className="">
                            {item.no}
                          </td>
                          <td aria-colindex={2} role="cell" className="">
                            {item.username}
                            {item.loginId && item.loginId !== item.username && (
                              <small className="d-block text-muted">
                                ({item.loginId})
                              </small>
                            )}
                            {item.gameData?.gameName && (
                              <small className="d-block text-muted">
                                Game: {item.gameData.gameName}
                              </small>
                            )}
                          </td>
                          <td aria-colindex={3} role="cell" className="">
                            {item.level}
                          </td>
                          <td
                            aria-colindex={4}
                            role="cell"
                            className="text-right"
                          >
                            <p className="mb-0">
                              {parseFloat(item.casinoPts).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </td>
                          <td
                            aria-colindex={5}
                            role="cell"
                            className="text-right"
                          >
                            <p className="mb-0">
                              {parseFloat(item.sportsPts).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </td>
                          <td
                            aria-colindex={6}
                            role="cell"
                            className="text-right"
                          >
                            <p className="mb-0">
                              {parseFloat(item.thirdPartyPts).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                          </td>
                          <td
                            aria-colindex={7}
                            role="cell"
                            className="text-right"
                          >
                            <p
                              className={`mb-0 ${
                                parseFloat(item.profitLoss) >= 0
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              {parseFloat(item.profitLoss).toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </p>
                            {item.gameData?.sportType && (
                              <small className="d-block text-muted">
                                {item.gameData.sportType} |{" "}
                                {item.gameData?.date}
                              </small>
                            )}
                          </td>
                          <td
                            aria-colindex={8}
                            role="cell"
                            className="text-left"
                          >
                            {item.ptype}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr role="row" className="b-table-empty-row">
                        <td colSpan={8} role="cell" className="">
                          <div role="alert" aria-live="polite">
                            <div className="text-center my-2">
                              {searchValue
                                ? `No records found for "${searchValue}"`
                                : "There are no records to show"}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot role="rowgroup" className="">
                    <tr role="row" className="">
                      <th role="columnheader" scope="col" aria-colindex={1}>
                        <span />
                      </th>
                      <th role="columnheader" scope="col" aria-colindex={2}>
                        <span />
                      </th>
                      <th role="columnheader" scope="col" aria-colindex={3}>
                        <span />
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={4}
                        className="text-right"
                      >
                        <span>
                          {parseFloat(totals.casinoPts).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={5}
                        className="text-right"
                      >
                        <span>
                          {parseFloat(totals.sportsPts).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={6}
                        className="text-right"
                      >
                        <span>
                          {parseFloat(totals.thirdPartyPts).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={7}
                        className="text-right"
                      >
                        <span
                          className={
                            parseFloat(totals.profitLoss) >= 0
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {parseFloat(totals.profitLoss).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </th>
                      <th
                        role="columnheader"
                        scope="col"
                        aria-colindex={8}
                        className="text-left"
                      >
                        <span />
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Pagination */}
              {(usersData?.hasMore || profitLossData?.hasMore) && (
                <div className="row pt-3">
                  <div className="col">
                    <div className="dataTables_paginate paging_simple_numbers float-right">
                      <ul className="pagination pagination-rounded mb-0">
                        <li
                          className={`page-item ${
                            page === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || isLoading}
                          >
                            «
                          </button>
                        </li>
                        <li
                          className={`page-item ${
                            page === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || isLoading}
                          >
                            ‹
                          </button>
                        </li>
                        <li className="page-item active">
                          <span className="page-link">{page}</span>
                        </li>
                        <li
                          className={`page-item ${
                            !(usersData?.hasMore || profitLossData?.hasMore)
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={
                              !(
                                usersData?.hasMore || profitLossData?.hasMore
                              ) || isLoading
                            }
                          >
                            ›
                          </button>
                        </li>
                        <li
                          className={`page-item ${
                            !(usersData?.hasMore || profitLossData?.hasMore)
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() =>
                              handlePageChange(
                                profitLossData?.totalPages ||
                                  usersData?.totalPages ||
                                  1
                              )
                            }
                            disabled={
                              !(
                                usersData?.hasMore || profitLossData?.hasMore
                              ) || isLoading
                            }
                          >
                            »
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartyWinLoss;
