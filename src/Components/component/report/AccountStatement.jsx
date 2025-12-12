import React, { useState, useEffect } from "react";
import DateRange from "../../date/Daterange";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { getDepositWithdraw } from "../../../Helper/accountStatement";
import { getDownlineUsers } from "../../../Helper/users";
import { getMyProfitLossReport } from "../../../Helper/profitLoss";
import { exportToExcel, exportToPDF } from "../../../Helper/exportHelper";
import moment from "moment";
import { decodedTokenData } from "../../../Helper/auth";

const AccountStatement = () => {
  const [cookies] = useCookies(["token"]);

  const currentUserData = decodedTokenData(cookies) || {};
  const currentUserId = currentUserData.userId || currentUserData._id;
  console.log("AccountStatement - All cookies suthar:", cookies);
  console.log("AccountStatement - Token from cookies suthar:", cookies?.token);
  console.log("AccountStatement - Token type suthar:", typeof cookies?.token);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [statementData, setStatementData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportLoading, setExportLoading] = useState({
    excel: false,
    pdf: false,
  });

  // New state for additional filters
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedType, setSelectedType] = useState("1"); // 1: All, 2: Deposit/Withdraw, 3: Game Report
  const [selectedStatement, setSelectedStatement] = useState("all");
  const [selectedSport, setSelectedSport] = useState("0");
  const [selectedCasino, setSelectedCasino] = useState("all");
  const [userOptions, setUserOptions] = useState([]);

  // Fetch downline users for dropdown
  const { isLoading: isLoadingUsers } = useQuery(
    ["downlineUsers", currentUserId],
    () => getDownlineUsers(cookies, currentUserId, null, null, 1, 100, ""),
    {
      enabled: !!currentUserId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data?.success && data?.users) {
          const options = data.users.map((user) => ({
            value: user._id,
            label: `${user.PersonalDetails?.userName || "N/A"} (${
              user.PersonalDetails?.loginId || "N/A"
            })`,
            userName: user.PersonalDetails?.userName,
            loginId: user.PersonalDetails?.loginId,
          }));
          setUserOptions(options);
        }
      },
    }
  );

  // Prepare API parameters
  const prepareAPIParams = () => {
    const params = {
      userId: selectedUser || currentUserId,
    };

    // Add date range if selected
    if (dateRange.startDate) {
      params.startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
    }
    if (dateRange.endDate) {
      params.endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
    }

    return params;
  };

  // Fetch deposit/withdraw data
  const fetchDepositWithdrawData = async () => {
    const params = prepareAPIParams();
    const response = await getDepositWithdraw(cookies, params.userId);

    if (response?.success) {
      return response.data || [];
    }
    return [];
  };

  // Fetch game report data
  const fetchGameReportData = async () => {
    const params = prepareAPIParams();

    let sportType = null;
    if (selectedStatement === "sport" && selectedSport !== "0") {
      sportType = selectedSport;
    } else if (selectedStatement === "casino") {
      sportType = "casino";
    }

    const response = await getMyProfitLossReport(
      cookies,
      sportType,
      params.startDate,
      params.endDate,
      currentPage,
      entriesPerPage,
      searchValue
    );

    if (response?.success) {
      return response.finishedGamesData || [];
    }
    return [];
  };

  // Main data fetching
  const { isLoading, refetch } = useQuery(
    [
      "statements",
      {
        selectedUser,
        selectedType,
        selectedStatement,
        selectedSport,
        selectedCasino,
        dateRange,
        currentPage,
        entriesPerPage,
        searchValue,
      },
    ],
    async () => {
      let depositData = [];
      let gameData = [];

      // Fetch based on selected type
      if (selectedType === "1" || selectedType === "2") {
        depositData = await fetchDepositWithdrawData();
      }

      if (selectedType === "1" || selectedType === "3") {
        gameData = await fetchGameReportData();
      }

      // Combine data
      let combinedData = [];
      if (selectedType === "1") {
        combinedData = [...depositData, ...gameData];
      } else if (selectedType === "2") {
        combinedData = depositData;
      } else if (selectedType === "3") {
        combinedData = gameData;
      }

      setStatementData(combinedData);
      return { success: true, data: combinedData };
    },
    {
      enabled: false, // Manual trigger only
      refetchOnWindowFocus: false,
    }
  );

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const clearAll = () => {
    setDateRange({ startDate: null, endDate: null });
    setSearchValue("");
    setSelectedUser("");
    setSelectedType("1");
    setSelectedStatement("all");
    setSelectedSport("0");
    setSelectedCasino("all");
    setStatementData([]);
    setCurrentPage(1);
  };

  const handleLoadData = (e) => {
    e.preventDefault();
    refetch();
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setSelectedStatement("all");
    setSelectedSport("0");
    setSelectedCasino("all");
  };

  // Excel Download Handler
  const handleExcelDownload = async () => {
    if (statementData.length === 0) {
      alert("No data available to export");
      return;
    }

    setExportLoading((prev) => ({ ...prev, excel: true }));

    try {
      await exportToExcel(statementData, "account-statement");
    } catch (error) {
      console.error("Excel download failed:", error);
      alert("Failed to download Excel file. Please try again.");
    } finally {
      setExportLoading((prev) => ({ ...prev, excel: false }));
    }
  };

  // PDF Download Handler
  const handlePDFDownload = async () => {
    if (statementData.length === 0) {
      alert("No data available to export");
      return;
    }

    setExportLoading((prev) => ({ ...prev, pdf: true }));

    try {
      await exportToPDF(statementData, "account-statement");
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download PDF file. Please try again.");
    } finally {
      setExportLoading((prev) => ({ ...prev, pdf: false }));
    }
  };

  // Filter data based on search
  const filteredData = statementData.filter(
    (item) =>
      (item.narration?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (item.remark?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
      (item.gameName?.toLowerCase() || "").includes(
        searchValue.toLowerCase()
      ) ||
      (item.fromto?.toLowerCase() || "").includes(searchValue.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <li
        key="prev"
        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
      </li>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <li
          key={1}
          className={`page-item ${currentPage === 1 ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>
      );
      if (startPage > 2) {
        pages.push(
          <li key="ellipsis1" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <li key="ellipsis2" className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      pages.push(
        <li
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    // Next button
    pages.push(
      <li
        key="next"
        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
      >
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </li>
    );

    return pages;
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Account Statement</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Account Statement</span>
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
                <div className="report-form mb-3">
                  <form
                    method="post"
                    className="ajaxFormSubmit"
                    onSubmit={handleLoadData}
                  >
                    <div className="row row5">
                      {/* Client Search */}
                      <div className="col-lg-3">
                        <div
                          className="form-group user-lock-search"
                          style={{ position: "relative" }}
                        >
                          <label htmlFor="d-inline-block">
                            Search By Client Name
                          </label>
                          <select
                            className="form-control"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                            disabled={isLoadingUsers}
                          >
                            <option value="">All Users</option>
                            {userOptions.map((user) => (
                              <option key={user.value} value={user.value}>
                                {user.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Date Range */}
                      <div className="col-lg-3">
                        <label>Select Date Range</label>
                        <div className="mb-3">
                          <DateRange
                            onDateRangeChange={handleDateRangeChange}
                            value={dateRange}
                          />
                        </div>
                      </div>

                      {/* Type Dropdown */}
                      <div className="col-lg-2">
                        <div className="form-group">
                          <label>Type</label>
                          <select
                            className="form-control"
                            value={selectedType}
                            onChange={handleTypeChange}
                          >
                            <option value="1">All</option>
                            <option value="2">Deposit/Withdraw Report</option>
                            <option value="3">Game Report</option>
                          </select>
                        </div>
                      </div>

                      {/* Statement Dropdown - Show only when Type is NOT "All" */}
                      {(selectedType === "2" || selectedType === "3") && (
                        <div className="col-lg-2">
                          <div className="form-group">
                            <label>Statement</label>
                            <select
                              className="form-control"
                              value={selectedStatement}
                              onChange={(e) =>
                                setSelectedStatement(e.target.value)
                              }
                            >
                              {/* For Deposit/Withdraw Report */}
                              {selectedType === "2" && (
                                <>
                                  <option value="all">All</option>
                                  <option value="allcredit">
                                    Credit - All
                                  </option>
                                  <option value="creditupper">
                                    Credit - Upper
                                  </option>
                                  <option value="creditdown">
                                    Credit - Down
                                  </option>
                                  <option value="allbalance">Pts - All</option>
                                  <option value="balanceupper">
                                    Pts - Upper
                                  </option>
                                  <option value="balancedown">
                                    Pts - Down
                                  </option>
                                </>
                              )}

                              {/* For Game Report */}
                              {selectedType === "3" && (
                                <>
                                  <option value="all">All</option>
                                  <option value="sport">Sports</option>
                                  <option value="casino">Casino</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Sports List - Show only when Type is Game Report AND Statement is Sport */}
                      {selectedType === "3" &&
                        selectedStatement === "sport" && (
                          <div className="col-lg-2">
                            <div className="form-group">
                              <label>Sports List</label>
                              <select
                                className="form-control"
                                value={selectedSport}
                                onChange={(e) =>
                                  setSelectedSport(e.target.value)
                                }
                              >
                                <option value="0">All</option>
                                <option value="4">Cricket</option>
                                <option value="2">Tennis</option>
                                <option value="1">Football</option>
                                <option value="62">Soccer</option>
                                <option value="15">Basketball</option>
                                <option value="19">Ice Hockey</option>
                                <option value="8">Table Tennis</option>
                                <option value="18">Volleyball</option>
                                <option value="3">Mixed Martial Arts</option>
                                <option value="6">Boxing</option>
                                <option value="5">Golf</option>
                                <option value="10">Horse Racing</option>
                              </select>
                            </div>
                          </div>
                        )}

                      {/* Casino List - Show only when Type is Game Report AND Statement is Casino */}
                      {selectedType === "3" &&
                        selectedStatement === "casino" && (
                          <div className="col-lg-2">
                            <div className="form-group">
                              <label>Casino List</label>
                              <select
                                className="form-control"
                                value={selectedCasino}
                                onChange={(e) =>
                                  setSelectedCasino(e.target.value)
                                }
                              >
                                <option value="all">All</option>
                                <option value="Teen">Teenpatti 1-day</option>
                                <option value="poker">Poker 1-Day</option>
                                <option value="ab20">Andar Bahar</option>
                                <option value="baccarat">Baccarat</option>
                                <option value="roulette">Roulette</option>
                                <option value="teen20">20-20 Teenpatti</option>
                                <option value="dt20">20-20 Dragon Tiger</option>
                              </select>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="row row5">
                      <div className="col-lg-3">
                        <button
                          type="submit"
                          id="loaddata"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
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
                          onClick={clearAll}
                        >
                          Reset
                        </button>
                        <div
                          id="export_1764133630283"
                          className="d-inline-block"
                        >
                          <button
                            type="button"
                            className={`btn btn-success ${
                              statementData.length === 0 ? "disabled" : ""
                            }`}
                            onClick={handleExcelDownload}
                            disabled={
                              exportLoading.excel ||
                              statementData.length === 0 ||
                              isLoading
                            }
                          >
                            {exportLoading.excel ? (
                              <>
                                <i className="fa fa-spinner fa-spin mr-2" />
                              </>
                            ) : (
                              <>
                                <i className="fas fa-file-excel me-1" />
                                Excel
                              </>
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          className={`btn btn-danger ${
                            statementData.length === 0 ? "disabled" : ""
                          }`}
                          onClick={handlePDFDownload}
                          disabled={
                            exportLoading.pdf ||
                            statementData.length === 0 ||
                            isLoading
                          }
                        >
                          {exportLoading.pdf ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-2" />
                            </>
                          ) : (
                            <>
                              <i className="fas fa-file-pdf me-1" />
                              PDF
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="row">
                  <div className="col-6">
                    <div
                      id="tickets-table_length"
                      className="dataTables_length"
                    >
                      <label className="d-inline-flex align-items-center">
                        Show&nbsp;
                        <select
                          className="custom-select custom-select-sm"
                          value={entriesPerPage}
                          onChange={(e) => {
                            setEntriesPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          disabled={isLoading}
                        >
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={75}>75</option>
                          <option value={100}>100</option>
                          <option value={125}>125</option>
                          <option value={150}>150</option>
                        </select>
                        &nbsp;entries
                      </label>
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div
                      id="tickets-table_filter"
                      className="dataTables_filter text-md-right"
                    >
                      <label className="d-inline-flex align-items-center">
                        <input
                          type="search"
                          placeholder="Search..."
                          className="form-control form-control-sm ml-2 form-control"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          disabled={isLoading}
                        />
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
                      <p className="mt-2">Loading account statement...</p>
                    </div>
                  ) : (
                    <div className="table no-footer table-hover table-responsive-sm">
                      <table
                        role="table"
                        aria-busy="false"
                        aria-colcount={7}
                        className="table b-table table-bordered"
                      >
                        <colgroup>
                          <col style={{ width: 120 }} />
                          <col style={{ width: 80 }} />
                          <col style={{ width: 120 }} />
                          <col style={{ width: 120 }} />
                          <col style={{ width: 120 }} />
                          <col style={{ width: 350 }} />
                          <col style={{ width: 120 }} />
                        </colgroup>
                        <thead role="rowgroup" className="">
                          <tr role="row" className="">
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative"
                            >
                              <div>Date</div>
                            </th>
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative text-right"
                            >
                              <div>Sr No</div>
                            </th>
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative text-right"
                            >
                              <div>Credit</div>
                            </th>
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative text-right"
                            >
                              <div>Debit</div>
                            </th>
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative text-right"
                            >
                              <div>Pts</div>
                            </th>
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative"
                            >
                              <div>Remark</div>
                            </th>
                            <th
                              role="columnheader"
                              scope="col"
                              className="position-relative"
                            >
                              <div>Fromto</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody role="rowgroup">
                          {paginatedData.length > 0 ? (
                            paginatedData.map((data, index) => (
                              <tr key={index} role="row" className="nocursor">
                                <td role="cell" className="">
                                  {moment(data?.createdAt).format(
                                    "DD/MM/YYYY HH:mm:ss"
                                  )}
                                </td>
                                <td role="cell" className="">
                                  <div className="text-right">
                                    {startIndex + index + 1}
                                  </div>
                                </td>
                                <td role="cell" className="">
                                  <div className="text-right">
                                    <span
                                      className={
                                        data?.credit || data?.profit
                                          ? "text-success font-weight-bold"
                                          : ""
                                      }
                                    >
                                      {data?.credit || data?.profit
                                        ? `+${data.credit || data.profit}`
                                        : 0}
                                    </span>
                                  </div>
                                </td>
                                <td role="cell" className="">
                                  <div className="text-right">
                                    <span
                                      className={
                                        data?.debit || data?.loss
                                          ? "text-danger font-weight-bold"
                                          : ""
                                      }
                                    >
                                      {data?.debit || data?.loss
                                        ? `-${data.debit || data.loss}`
                                        : 0}
                                    </span>
                                  </div>
                                </td>
                                <td role="cell" className="">
                                  <div className="text-right">
                                    <span>
                                      {data?.totalUserBalance ||
                                        data?.balance ||
                                        0}
                                    </span>
                                  </div>
                                </td>
                                <td role="cell" className="">
                                  <div>
                                    {data?.narration ||
                                      data?.remark ||
                                      data?.gameName ||
                                      "-"}
                                    {data?.sportType && (
                                      <small className="d-block text-muted">
                                        {data.sportType}
                                      </small>
                                    )}
                                  </div>
                                </td>
                                <td role="cell" className="">
                                  <div>
                                    {data?.fromto || data?.narration || "-"}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                {statementData.length === 0
                                  ? "No data available. Please click 'Load' to fetch data."
                                  : "No matching records found"}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {filteredData.length > 0 && (
                  <div className="row pt-3">
                    <div className="col">
                      <div className="dataTables_paginate paging_simple_numbers float-right">
                        <ul className="pagination pagination-rounded mb-0">
                          {renderPagination()}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {filteredData.length > 0 && (
                  <div className="alert alert-info mt-3">
                    <div className="row">
                      <div className="col-md-4">
                        <small>
                          <strong>Total Records:</strong> {filteredData.length}
                        </small>
                      </div>
                      <div className="col-md-4">
                        <small>
                          <strong>Page:</strong> {currentPage} of {totalPages}
                        </small>
                      </div>
                      <div className="col-md-4">
                        <small>
                          <strong>Showing:</strong> {startIndex + 1} to{" "}
                          {Math.min(
                            startIndex + entriesPerPage,
                            filteredData.length
                          )}{" "}
                          entries
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountStatement;

// import React, { useState, useEffect } from "react";
// import DateRange from "../../date/Daterange";
// import { useCookies } from "react-cookie";
// import { useQuery } from "react-query";
// import { getDepositWithdraw } from "../../../Helper/accountStatement";
// import { getDownlineUsers } from "../../../Helper/users";
// import { getMyProfitLossReport } from "../../../Helper/profitLoss";
// import { exportToExcel, exportToPDF } from "../../../Helper/exportHelper";
// import moment from "moment";
// import { decodedTokenData } from "../../../Helper/auth";
// import { useNavigate } from "react-router-dom";

// const AccountStatement = () => {
//   const navigate = useNavigate();

//   // ✅ Use "token" key
//   const [cookies] = useCookies(["token"]);

//   console.log("🔍 AccountStatement - All cookies suthar:", cookies);
//   console.log("🔍 AccountStatement - Token from cookies surthar:", cookies?.token);
//   console.log("🔍 AccountStatement - Token type suthar:", typeof cookies?.token);

//   // ✅ SIMPLE function to get user data
//   const getCurrentUser = () => {
//     try {
//       // First priority: localStorage (because cookies might have 'undefined' string)
//       if (typeof window !== "undefined") {
//         const storedToken = localStorage.getItem("token");

//         if (
//           storedToken &&
//           storedToken !== "undefined" &&
//           storedToken !== "null"
//         ) {
//           console.log("✅ Using token from localStorage");
//           const userData = decodedTokenData({ token: storedToken });
//           return userData;
//         }
//       }

//       // Second priority: cookies
//       const cookieToken = cookies?.token;
//       if (
//         cookieToken &&
//         cookieToken !== "undefined" &&
//         cookieToken !== "null"
//       ) {
//         console.log("✅ Using token from cookies");
//         const userData = decodedTokenData({ token: cookieToken });
//         return userData;
//       }

//       console.log("❌ No valid token found");
//       return null;
//     } catch (error) {
//       console.error("Error getting current user:", error);
//       return null;
//     }
//   };

//   const currentUserData = getCurrentUser() || {};
//   const currentUserId = currentUserData.userId || currentUserData._id;

//   // ✅ Check authentication on mount
//   useEffect(() => {
//     console.log("=== ACCOUNT STATEMENT MOUNTED ===");
//     console.log("User ID:", currentUserId);
//     console.log("User Data:", currentUserData);

//     // If no user ID, redirect to login
//     if (!currentUserId) {
//       console.log("❌ No user ID found, redirecting to login");
//       const timer = setTimeout(() => {
//         navigate("/admin/signin");
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentUserId, navigate, currentUserData]);

//   // ✅ Show loading if not authenticated
//   if (!currentUserId) {
//     return (
//       <div className="container mt-5">
//         <div className="row justify-content-center">
//           <div className="col-md-6">
//             <div className="card">
//               <div className="card-body text-center">
//                 <div className="spinner-border text-primary mb-3" role="status">
//                   <span className="sr-only">Loading...</span>
//                 </div>
//                 <h5>Checking Authentication...</h5>
//                 <p>Please wait while we restore your session.</p>
//                 <button
//                   className="btn btn-sm btn-outline-primary mt-2"
//                   onClick={() => window.location.reload()}
//                 >
//                   Refresh Page
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Rest of your component remains EXACTLY THE SAME
//   // Copy ALL your existing state and functions from line 30 onwards
//   // DO NOT CHANGE ANYTHING BELOW THIS LINE

//   const [dateRange, setDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [statementData, setStatementData] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [exportLoading, setExportLoading] = useState({
//     excel: false,
//     pdf: false,
//   });

//   const [selectedUser, setSelectedUser] = useState("");
//   const [selectedType, setSelectedType] = useState("1");
//   const [selectedStatement, setSelectedStatement] = useState("all");
//   const [selectedSport, setSelectedSport] = useState("0");
//   const [selectedCasino, setSelectedCasino] = useState("all");
//   const [userOptions, setUserOptions] = useState([]);

//   // Fetch downline users for dropdown
//   const { isLoading: isLoadingUsers } = useQuery(
//     ["downlineUsers", currentUserId],
//     () => getDownlineUsers(cookies, currentUserId, null, null, 1, 100, ""),
//     {
//       enabled: !!currentUserId,
//       refetchOnWindowFocus: false,
//       onSuccess: (data) => {
//         if (data?.success && data?.users) {
//           const options = data.users.map((user) => ({
//             value: user._id,
//             label: `${user.PersonalDetails?.userName || "N/A"} (${
//               user.PersonalDetails?.loginId || "N/A"
//             })`,
//             userName: user.PersonalDetails?.userName,
//             loginId: user.PersonalDetails?.loginId,
//           }));
//           setUserOptions(options);
//         }
//       },
//     }
//   );

//   // Prepare API parameters
//   const prepareAPIParams = () => {
//     const params = {
//       userId: selectedUser || currentUserId,
//     };

//     // Add date range if selected
//     if (dateRange.startDate) {
//       params.startDate = moment(dateRange.startDate).format("YYYY-MM-DD");
//     }
//     if (dateRange.endDate) {
//       params.endDate = moment(dateRange.endDate).format("YYYY-MM-DD");
//     }

//     return params;
//   };

//   // Fetch deposit/withdraw data
//   const fetchDepositWithdrawData = async () => {
//     const params = prepareAPIParams();
//     const response = await getDepositWithdraw(cookies, params.userId);

//     if (response?.success) {
//       return response.data || [];
//     }
//     return [];
//   };

//   // Fetch game report data
//   const fetchGameReportData = async () => {
//     const params = prepareAPIParams();

//     let sportType = null;
//     if (selectedStatement === "sport" && selectedSport !== "0") {
//       sportType = selectedSport;
//     } else if (selectedStatement === "casino") {
//       sportType = "casino";
//     }

//     const response = await getMyProfitLossReport(
//       cookies,
//       sportType,
//       params.startDate,
//       params.endDate,
//       currentPage,
//       entriesPerPage,
//       searchValue
//     );

//     if (response?.success) {
//       return response.finishedGamesData || [];
//     }
//     return [];
//   };

//   // Main data fetching
//   const { isLoading, refetch } = useQuery(
//     [
//       "statements",
//       {
//         selectedUser,
//         selectedType,
//         selectedStatement,
//         selectedSport,
//         selectedCasino,
//         dateRange,
//         currentPage,
//         entriesPerPage,
//         searchValue,
//       },
//     ],
//     async () => {
//       let depositData = [];
//       let gameData = [];

//       // Fetch based on selected type
//       if (selectedType === "1" || selectedType === "2") {
//         depositData = await fetchDepositWithdrawData();
//       }

//       if (selectedType === "1" || selectedType === "3") {
//         gameData = await fetchGameReportData();
//       }

//       // Combine data
//       let combinedData = [];
//       if (selectedType === "1") {
//         combinedData = [...depositData, ...gameData];
//       } else if (selectedType === "2") {
//         combinedData = depositData;
//       } else if (selectedType === "3") {
//         combinedData = gameData;
//       }

//       setStatementData(combinedData);
//       return { success: true, data: combinedData };
//     },
//     {
//       enabled: false, // Manual trigger only
//       refetchOnWindowFocus: false,
//     }
//   );

//   const handleDateRangeChange = (newDateRange) => {
//     setDateRange(newDateRange);
//   };

//   const clearAll = () => {
//     setDateRange({ startDate: null, endDate: null });
//     setSearchValue("");
//     setSelectedUser("");
//     setSelectedType("1");
//     setSelectedStatement("all");
//     setSelectedSport("0");
//     setSelectedCasino("all");
//     setStatementData([]);
//     setCurrentPage(1);
//   };

//   const handleLoadData = (e) => {
//     e.preventDefault();
//     refetch();
//   };

//   const handleTypeChange = (e) => {
//     const value = e.target.value;
//     setSelectedType(value);
//     setSelectedStatement("all");
//     setSelectedSport("0");
//     setSelectedCasino("all");
//   };

//   // Excel Download Handler
//   const handleExcelDownload = async () => {
//     if (statementData.length === 0) {
//       alert("No data available to export");
//       return;
//     }

//     setExportLoading((prev) => ({ ...prev, excel: true }));

//     try {
//       await exportToExcel(statementData, "account-statement");
//     } catch (error) {
//       console.error("Excel download failed:", error);
//       alert("Failed to download Excel file. Please try again.");
//     } finally {
//       setExportLoading((prev) => ({ ...prev, excel: false }));
//     }
//   };

//   // PDF Download Handler
//   const handlePDFDownload = async () => {
//     if (statementData.length === 0) {
//       alert("No data available to export");
//       return;
//     }

//     setExportLoading((prev) => ({ ...prev, pdf: true }));

//     try {
//       await exportToPDF(statementData, "account-statement");
//     } catch (error) {
//       console.error("PDF download failed:", error);
//       alert("Failed to download PDF file. Please try again.");
//     } finally {
//       setExportLoading((prev) => ({ ...prev, pdf: false }));
//     }
//   };

//   // Filter data based on search
//   const filteredData = statementData.filter(
//     (item) =>
//       (item.narration?.toLowerCase() || "").includes(
//         searchValue.toLowerCase()
//       ) ||
//       (item.remark?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
//       (item.gameName?.toLowerCase() || "").includes(
//         searchValue.toLowerCase()
//       ) ||
//       (item.fromto?.toLowerCase() || "").includes(searchValue.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredData.length / entriesPerPage);
//   const startIndex = (currentPage - 1) * entriesPerPage;
//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + entriesPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const renderPagination = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     // Previous button
//     pages.push(
//       <li
//         key="prev"
//         className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
//       >
//         <button
//           className="page-link"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           ‹
//         </button>
//       </li>
//     );

//     // First page
//     if (startPage > 1) {
//       pages.push(
//         <li
//           key={1}
//           className={`page-item ${currentPage === 1 ? "active" : ""}`}
//         >
//           <button className="page-link" onClick={() => handlePageChange(1)}>
//             1
//           </button>
//         </li>
//       );
//       if (startPage > 2) {
//         pages.push(
//           <li key="ellipsis1" className="page-item disabled">
//             <span className="page-link">...</span>
//           </li>
//         );
//       }
//     }

//     // Page numbers
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <li
//           key={i}
//           className={`page-item ${currentPage === i ? "active" : ""}`}
//         >
//           <button className="page-link" onClick={() => handlePageChange(i)}>
//             {i}
//           </button>
//         </li>
//       );
//     }

//     // Last page
//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pages.push(
//           <li key="ellipsis2" className="page-item disabled">
//             <span className="page-link">...</span>
//           </li>
//         );
//       }
//       pages.push(
//         <li
//           key={totalPages}
//           className={`page-item ${currentPage === totalPages ? "active" : ""}`}
//         >
//           <button
//             className="page-link"
//             onClick={() => handlePageChange(totalPages)}
//           >
//             {totalPages}
//           </button>
//         </li>
//       );
//     }

//     // Next button
//     pages.push(
//       <li
//         key="next"
//         className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//       >
//         <button
//           className="page-link"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           ›
//         </button>
//       </li>
//     );

//     return pages;
//   };

//   return (
//     <>
//       <div>
//         <div className="row">
//           <div className="col-12">
//             <div className="page-title-box d-flex align-items-center justify-content-between">
//               <h4 className="mb-0 font-size-18">Account Statement</h4>
//               <div className="page-title-right">
//                 <ol className="breadcrumb m-0">
//                   <li className="breadcrumb-item">
//                     <a href="/admin/home" className="" target="_self">
//                       Home
//                     </a>
//                   </li>
//                   <li className="breadcrumb-item active">
//                     <span aria-current="location">Account Statement</span>
//                   </li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 {/* Authentication Status */}
//                 {/* <div className="alert alert-success py-2 mb-3 d-flex justify-content-between align-items-center">
//                   <small>
//                     <i className="fas fa-user-check mr-2"></i>
//                     <strong>Logged in as:</strong>{" "}
//                     {currentUserData.userName ||
//                       currentUserData.loginId ||
//                       "User"}
//                   </small>
//                   <small className="text-muted">ID: {currentUserId}</small>
//                 </div> */}

//                 {/* REST OF YOUR EXISTING CODE - DO NOT CHANGE */}
//                 <div className="report-form mb-3">
//                   <form
//                     method="post"
//                     className="ajaxFormSubmit"
//                     onSubmit={handleLoadData}
//                   >
//                     <div className="row row5">
//                       {/* Client Search */}
//                       <div className="col-lg-3">
//                         <div
//                           className="form-group user-lock-search"
//                           style={{ position: "relative" }}
//                         >
//                           <label htmlFor="d-inline-block">
//                             Search By Client Name
//                           </label>
//                           <select
//                             className="form-control"
//                             value={selectedUser}
//                             onChange={(e) => setSelectedUser(e.target.value)}
//                             disabled={isLoadingUsers}
//                           >
//                             <option value="">All Users</option>
//                             {userOptions.map((user) => (
//                               <option key={user.value} value={user.value}>
//                                 {user.label}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                       </div>

//                       {/* Date Range */}
//                       <div className="col-lg-3">
//                         <label>Select Date Range</label>
//                         <div className="mb-3">
//                           <DateRange
//                             onDateRangeChange={handleDateRangeChange}
//                             value={dateRange}
//                           />
//                         </div>
//                       </div>

//                       {/* Type Dropdown */}
//                       <div className="col-lg-2">
//                         <div className="form-group">
//                           <label>Type</label>
//                           <select
//                             className="form-control"
//                             value={selectedType}
//                             onChange={handleTypeChange}
//                           >
//                             <option value="1">All</option>
//                             <option value="2">Deposit/Withdraw Report</option>
//                             <option value="3">Game Report</option>
//                           </select>
//                         </div>
//                       </div>

//                       {/* Statement Dropdown - Show only when Type is NOT "All" */}
//                       {(selectedType === "2" || selectedType === "3") && (
//                         <div className="col-lg-2">
//                           <div className="form-group">
//                             <label>Statement</label>
//                             <select
//                               className="form-control"
//                               value={selectedStatement}
//                               onChange={(e) =>
//                                 setSelectedStatement(e.target.value)
//                               }
//                             >
//                               {/* For Deposit/Withdraw Report */}
//                               {selectedType === "2" && (
//                                 <>
//                                   <option value="all">All</option>
//                                   <option value="allcredit">
//                                     Credit - All
//                                   </option>
//                                   <option value="creditupper">
//                                     Credit - Upper
//                                   </option>
//                                   <option value="creditdown">
//                                     Credit - Down
//                                   </option>
//                                   <option value="allbalance">Pts - All</option>
//                                   <option value="balanceupper">
//                                     Pts - Upper
//                                   </option>
//                                   <option value="balancedown">
//                                     Pts - Down
//                                   </option>
//                                 </>
//                               )}

//                               {/* For Game Report */}
//                               {selectedType === "3" && (
//                                 <>
//                                   <option value="all">All</option>
//                                   <option value="sport">Sports</option>
//                                   <option value="casino">Casino</option>
//                                 </>
//                               )}
//                             </select>
//                           </div>
//                         </div>
//                       )}

//                       {/* Sports List - Show only when Type is Game Report AND Statement is Sport */}
//                       {selectedType === "3" &&
//                         selectedStatement === "sport" && (
//                           <div className="col-lg-2">
//                             <div className="form-group">
//                               <label>Sports List</label>
//                               <select
//                                 className="form-control"
//                                 value={selectedSport}
//                                 onChange={(e) =>
//                                   setSelectedSport(e.target.value)
//                                 }
//                               >
//                                 <option value="0">All</option>
//                                 <option value="4">Cricket</option>
//                                 <option value="2">Tennis</option>
//                                 <option value="1">Football</option>
//                                 <option value="62">Soccer</option>
//                                 <option value="15">Basketball</option>
//                                 <option value="19">Ice Hockey</option>
//                                 <option value="8">Table Tennis</option>
//                                 <option value="18">Volleyball</option>
//                                 <option value="3">Mixed Martial Arts</option>
//                                 <option value="6">Boxing</option>
//                                 <option value="5">Golf</option>
//                                 <option value="10">Horse Racing</option>
//                               </select>
//                             </div>
//                           </div>
//                         )}

//                       {/* Casino List - Show only when Type is Game Report AND Statement is Casino */}
//                       {selectedType === "3" &&
//                         selectedStatement === "casino" && (
//                           <div className="col-lg-2">
//                             <div className="form-group">
//                               <label>Casino List</label>
//                               <select
//                                 className="form-control"
//                                 value={selectedCasino}
//                                 onChange={(e) =>
//                                   setSelectedCasino(e.target.value)
//                                 }
//                               >
//                                 <option value="all">All</option>
//                                 <option value="Teen">Teenpatti 1-day</option>
//                                 <option value="poker">Poker 1-Day</option>
//                                 <option value="ab20">Andar Bahar</option>
//                                 <option value="baccarat">Baccarat</option>
//                                 <option value="roulette">Roulette</option>
//                                 <option value="teen20">20-20 Teenpatti</option>
//                                 <option value="dt20">20-20 Dragon Tiger</option>
//                               </select>
//                             </div>
//                           </div>
//                         )}
//                     </div>

//                     <div className="row row5">
//                       <div className="col-lg-3">
//                         <button
//                           type="submit"
//                           id="loaddata"
//                           className="btn btn-primary"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? (
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
//                           onClick={clearAll}
//                         >
//                           Reset
//                         </button>
//                         <div
//                           id="export_1764133630283"
//                           className="d-inline-block"
//                         >
//                           <button
//                             type="button"
//                             className={`btn btn-success ${
//                               statementData.length === 0 ? "disabled" : ""
//                             }`}
//                             onClick={handleExcelDownload}
//                             disabled={
//                               exportLoading.excel ||
//                               statementData.length === 0 ||
//                               isLoading
//                             }
//                           >
//                             {exportLoading.excel ? (
//                               <>
//                                 <i className="fa fa-spinner fa-spin mr-2" />
//                               </>
//                             ) : (
//                               <>
//                                 <i className="fas fa-file-excel me-1" />
//                                 Excel
//                               </>
//                             )}
//                           </button>
//                         </div>
//                         <button
//                           type="button"
//                           className={`btn btn-danger ${
//                             statementData.length === 0 ? "disabled" : ""
//                           }`}
//                           onClick={handlePDFDownload}
//                           disabled={
//                             exportLoading.pdf ||
//                             statementData.length === 0 ||
//                             isLoading
//                           }
//                         >
//                           {exportLoading.pdf ? (
//                             <>
//                               <i className="fa fa-spinner fa-spin mr-2" />
//                             </>
//                           ) : (
//                             <>
//                               <i className="fas fa-file-pdf me-1" />
//                               PDF
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>

//                 <div className="row">
//                   <div className="col-6">
//                     <div
//                       id="tickets-table_length"
//                       className="dataTables_length"
//                     >
//                       <label className="d-inline-flex align-items-center">
//                         Show&nbsp;
//                         <select
//                           className="custom-select custom-select-sm"
//                           value={entriesPerPage}
//                           onChange={(e) => {
//                             setEntriesPerPage(Number(e.target.value));
//                             setCurrentPage(1);
//                           }}
//                           disabled={isLoading}
//                         >
//                           <option value={25}>25</option>
//                           <option value={50}>50</option>
//                           <option value={75}>75</option>
//                           <option value={100}>100</option>
//                           <option value={125}>125</option>
//                           <option value={150}>150</option>
//                         </select>
//                         &nbsp;entries
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-6 text-right">
//                     <div
//                       id="tickets-table_filter"
//                       className="dataTables_filter text-md-right"
//                     >
//                       <label className="d-inline-flex align-items-center">
//                         <input
//                           type="search"
//                           placeholder="Search..."
//                           className="form-control form-control-sm ml-2 form-control"
//                           value={searchValue}
//                           onChange={(e) => setSearchValue(e.target.value)}
//                           disabled={isLoading}
//                         />
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="table-responsive mb-0">
//                   {isLoading ? (
//                     <div
//                       className="text-center p-4"
//                       style={{ fontSize: "2rem" }}
//                     >
//                       <i className="fa fa-spinner fa-spin" />
//                       <p className="mt-2">Loading account statement...</p>
//                     </div>
//                   ) : (
//                     <div className="table no-footer table-hover table-responsive-sm">
//                       <table
//                         role="table"
//                         aria-busy="false"
//                         aria-colcount={7}
//                         className="table b-table table-bordered"
//                       >
//                         <colgroup>
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 80 }} />
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 350 }} />
//                           <col style={{ width: 120 }} />
//                         </colgroup>
//                         <thead role="rowgroup" className="">
//                           <tr role="row" className="">
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative"
//                             >
//                               <div>Date</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Sr No</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Credit</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Debit</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Pts</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative"
//                             >
//                               <div>Remark</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative"
//                             >
//                               <div>Fromto</div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody role="rowgroup">
//                           {paginatedData.length > 0 ? (
//                             paginatedData.map((data, index) => (
//                               <tr key={index} role="row" className="nocursor">
//                                 <td role="cell" className="">
//                                   {moment(data?.createdAt).format(
//                                     "DD/MM/YYYY HH:mm:ss"
//                                   )}
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     {startIndex + index + 1}
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     <span
//                                       className={
//                                         data?.credit || data?.profit
//                                           ? "text-success font-weight-bold"
//                                           : ""
//                                       }
//                                     >
//                                       {data?.credit || data?.profit
//                                         ? `+${data.credit || data.profit}`
//                                         : 0}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     <span
//                                       className={
//                                         data?.debit || data?.loss
//                                           ? "text-danger font-weight-bold"
//                                           : ""
//                                       }
//                                     >
//                                       {data?.debit || data?.loss
//                                         ? `-${data.debit || data.loss}`
//                                         : 0}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     <span>
//                                       {data?.totalUserBalance ||
//                                         data?.balance ||
//                                         0}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div>
//                                     {data?.narration ||
//                                       data?.remark ||
//                                       data?.gameName ||
//                                       "-"}
//                                     {data?.sportType && (
//                                       <small className="d-block text-muted">
//                                         {data.sportType}
//                                       </small>
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div>
//                                     {data?.fromto || data?.userName || "-"}
//                                   </div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="7" className="text-center py-4">
//                                 {statementData.length === 0
//                                   ? "No data available. Please click 'Load' to fetch data."
//                                   : "No matching records found"}
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//                 {filteredData.length > 0 && (
//                   <div className="row pt-3">
//                     <div className="col">
//                       <div className="dataTables_paginate paging_simple_numbers float-right">
//                         <ul className="pagination pagination-rounded mb-0">
//                           {renderPagination()}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {filteredData.length > 0 && (
//                   <div className="alert alert-info mt-3">
//                     <div className="row">
//                       <div className="col-md-4">
//                         <small>
//                           <strong>Total Records:</strong> {filteredData.length}
//                         </small>
//                       </div>
//                       <div className="col-md-4">
//                         <small>
//                           <strong>Page:</strong> {currentPage} of {totalPages}
//                         </small>
//                       </div>
//                       <div className="col-md-4">
//                         <small>
//                           <strong>Showing:</strong> {startIndex + 1} to{" "}
//                           {Math.min(
//                             startIndex + entriesPerPage,
//                             filteredData.length
//                           )}{" "}
//                           entries
//                         </small>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AccountStatement;

// import React, { useState, useEffect } from "react";
// import DateRange from "../../date/Daterange";
// import { useCookies } from "react-cookie";
// import { useQuery } from "react-query";
// import { getDepositWithdraw } from "../../../Helper/accountStatement";
// import { exportToExcel, exportToPDF } from "../../../Helper/exportHelper";
// import moment from "moment";

// const AccountStatement = () => {
//   const [cookies] = useCookies(["Admin"]);
//   const [dateRange, setDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [statementData, setStatementData] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [exportLoading, setExportLoading] = useState({
//     excel: false,
//     pdf: false,
//   });

//   // React Query for data fetching
//   const {
//     isLoading,
//     data: fetchData,
//     refetch,
//   } = useQuery(["statements", { cookies }], () => getDepositWithdraw(cookies), {
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (fetchData?.success) {
//       setStatementData(fetchData.data || []);
//     }
//   }, [fetchData]);

//   const handleDateRangeChange = (newDateRange) => {
//     setDateRange(newDateRange);
//   };

//   const clearAll = () => {
//     setDateRange({ startDate: null, endDate: null });
//     setSearchValue("");
//   };

//   const handleLoadData = (e) => {
//     e.preventDefault();
//     refetch();
//   };

//   // Excel Download Handler
//   const handleExcelDownload = async () => {
//     if (statementData.length === 0) {
//       alert("No data available to export");
//       return;
//     }

//     setExportLoading((prev) => ({ ...prev, excel: true }));

//     try {
//       await exportToExcel(statementData, "account-statement");
//     } catch (error) {
//       console.error("Excel download failed:", error);
//       alert("Failed to download Excel file. Please try again.");
//     } finally {
//       setExportLoading((prev) => ({ ...prev, excel: false }));
//     }
//   };

//   // PDF Download Handler - FIXED
//   const handlePDFDownload = async () => {
//     if (statementData.length === 0) {
//       alert("No data available to export");
//       return;
//     }

//     setExportLoading((prev) => ({ ...prev, pdf: true }));

//     try {
//       await exportToPDF(statementData, "account-statement");
//     } catch (error) {
//       console.error("PDF download failed:", error);
//       alert("Failed to download PDF file. Please try again.");
//     } finally {
//       setExportLoading((prev) => ({ ...prev, pdf: false }));
//     }
//   };

//   // Filter data based on search
//   const filteredData = statementData.filter(
//     (item) =>
//       item.narration?.toLowerCase().includes(searchValue.toLowerCase()) ||
//       item.remark?.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   // Pagination logic
//   const totalPages = Math.ceil(filteredData.length / entriesPerPage);
//   const startIndex = (currentPage - 1) * entriesPerPage;
//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + entriesPerPage
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const renderPagination = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     // Previous button
//     pages.push(
//       <li
//         key="prev"
//         className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
//       >
//         <button
//           className="page-link"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           ‹
//         </button>
//       </li>
//     );

//     // First page
//     if (startPage > 1) {
//       pages.push(
//         <li
//           key={1}
//           className={`page-item ${currentPage === 1 ? "active" : ""}`}
//         >
//           <button className="page-link" onClick={() => handlePageChange(1)}>
//             1
//           </button>
//         </li>
//       );
//       if (startPage > 2) {
//         pages.push(
//           <li key="ellipsis1" className="page-item disabled">
//             <span className="page-link">...</span>
//           </li>
//         );
//       }
//     }

//     // Page numbers
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <li
//           key={i}
//           className={`page-item ${currentPage === i ? "active" : ""}`}
//         >
//           <button className="page-link" onClick={() => handlePageChange(i)}>
//             {i}
//           </button>
//         </li>
//       );
//     }

//     // Last page
//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pages.push(
//           <li key="ellipsis2" className="page-item disabled">
//             <span className="page-link">...</span>
//           </li>
//         );
//       }
//       pages.push(
//         <li
//           key={totalPages}
//           className={`page-item ${currentPage === totalPages ? "active" : ""}`}
//         >
//           <button
//             className="page-link"
//             onClick={() => handlePageChange(totalPages)}
//           >
//             {totalPages}
//           </button>
//         </li>
//       );
//     }

//     // Next button
//     pages.push(
//       <li
//         key="next"
//         className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
//       >
//         <button
//           className="page-link"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           ›
//         </button>
//       </li>
//     );

//     return pages;
//   };

//   return (
//     <>
//       <div>
//         <div className="row">
//           <div className="col-12">
//             <div className="page-title-box d-flex align-items-center justify-content-between">
//               <h4 className="mb-0 font-size-18">Account Statement</h4>
//               <div className="page-title-right">
//                 <ol className="breadcrumb m-0">
//                   <li className="breadcrumb-item">
//                     <a href="/admin/home" className="" target="_self">
//                       Home
//                     </a>
//                   </li>
//                   <li className="breadcrumb-item active">
//                     <span aria-current="location">Account Statement</span>
//                   </li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="report-form mb-3">
//                   <form
//                     method="post"
//                     className="ajaxFormSubmit"
//                     onSubmit={handleLoadData}
//                   >
//                     <div className="row row5">
//                       <div className="col-lg-3">
//                         <div
//                           className="form-group user-lock-search"
//                           style={{ position: "relative" }}
//                         >
//                           <label htmlFor="d-inline-block">
//                             Search By Client Name
//                           </label>
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search..."
//                             value={searchValue}
//                             onChange={(e) => setSearchValue(e.target.value)}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-3">
//                         <label>Select Date Range</label>
//                         <div className="mb-3">
//                           <DateRange
//                             onDateRangeChange={handleDateRangeChange}
//                             value={dateRange}
//                           />
//                         </div>
//                       </div>
//                       <div className="col-lg-2">
//                         <div className="form-group">
//                           <label>Type</label>
//                           <select className="form-control">
//                             <option value={1}>All</option>
//                             <option value={2}>Deposit/Withdraw Report</option>
//                             <option value={3}>Game Report</option>
//                           </select>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="row row5">
//                       <div className="col-lg-3">
//                         <button
//                           type="submit"
//                           id="loaddata"
//                           className="btn btn-primary"
//                           disabled={isLoading}
//                         >
//                           {isLoading ? (
//                             <>
//                               <i className="fa fa-spinner fa-spin mr-2" />
//                             </>
//                           ) : (
//                             "Load"
//                           )}
//                         </button>
//                         <button
//                           type="button"
//                           id="reset"
//                           className="btn btn-light"
//                           onClick={clearAll}
//                         >
//                           Reset
//                         </button>
//                         <div
//                           id="export_1764133630283"
//                           className="d-inline-block"
//                         >
//                           <button
//                             type="button"
//                             className="btn btn-success"
//                             onClick={handleExcelDownload}
//                             disabled={
//                               exportLoading.excel || statementData.length === 0
//                             }
//                           >
//                             {exportLoading.excel ? (
//                               <>
//                                 <i className="fa fa-spinner fa-spin mr-2" />
//                               </>
//                             ) : (
//                               <>
//                                 <i className="fas fa-file-excel me-1" />
//                                 Excel
//                               </>
//                             )}
//                           </button>
//                         </div>
//                         <button
//                           type="button"
//                           className="btn btn-danger"
//                           onClick={handlePDFDownload}
//                           disabled={
//                             exportLoading.pdf || statementData.length === 0
//                           }
//                         >
//                           {exportLoading.pdf ? (
//                             <>
//                               <i className="fa fa-spinner fa-spin mr-2" />
//                             </>
//                           ) : (
//                             <>
//                               <i className="fas fa-file-pdf me-1" />
//                               PDF
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </form>
//                 </div>

//                 <div className="row">
//                   <div className="col-6">
//                     <div
//                       id="tickets-table_length"
//                       className="dataTables_length"
//                     >
//                       <label className="d-inline-flex align-items-center">
//                         Show&nbsp;
//                         <select
//                           className="custom-select custom-select-sm"
//                           value={entriesPerPage}
//                           onChange={(e) => {
//                             setEntriesPerPage(Number(e.target.value));
//                             setCurrentPage(1);
//                           }}
//                         >
//                           <option value={25}>25</option>
//                           <option value={50}>50</option>
//                           <option value={75}>75</option>
//                           <option value={100}>100</option>
//                           <option value={125}>125</option>
//                           <option value={150}>150</option>
//                         </select>
//                         &nbsp;entries
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-6 text-right">
//                     <div
//                       id="tickets-table_filter"
//                       className="dataTables_filter text-md-right"
//                     >
//                       <label className="d-inline-flex align-items-center">
//                         <input
//                           type="search"
//                           placeholder="Search..."
//                           className="form-control form-control-sm ml-2 form-control"
//                           value={searchValue}
//                           onChange={(e) => setSearchValue(e.target.value)}
//                         />
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="table-responsive mb-0">
//                   {isLoading ? (
//                     <div
//                       className="text-center p-4"
//                       style={{ fontSize: "2rem" }}
//                     >
//                       <i className="fa fa-spinner fa-spin" />
//                     </div>
//                   ) : (
//                     <div className="table no-footer table-hover table-responsive-sm">
//                       <table
//                         role="table"
//                         aria-busy="false"
//                         aria-colcount={7}
//                         className="table b-table table-bordered"
//                       >
//                         <colgroup>
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 80 }} />
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 120 }} />
//                           <col style={{ width: 350 }} />
//                           <col style={{ width: 120 }} />
//                         </colgroup>
//                         <thead role="rowgroup" className="">
//                           <tr role="row" className="">
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative"
//                             >
//                               <div>Date</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Sr No</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Credit</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Debit</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative text-right"
//                             >
//                               <div>Pts</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative"
//                             >
//                               <div>Remark</div>
//                             </th>
//                             <th
//                               role="columnheader"
//                               scope="col"
//                               className="position-relative"
//                             >
//                               <div>Fromto</div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody role="rowgroup">
//                           {paginatedData.length > 0 ? (
//                             paginatedData.map((data, index) => (
//                               <tr key={index} role="row" className="nocursor">
//                                 <td role="cell" className="">
//                                   {moment(data?.createdAt).format(
//                                     "DD/MM/YYYY HH:mm:ss"
//                                   )}
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     {startIndex + index + 1}
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     <span
//                                       className={
//                                         data?.credit
//                                           ? "text-success font-weight-bold"
//                                           : ""
//                                       }
//                                     >
//                                       {data?.credit ? `+${data.credit}` : 0}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     <span
//                                       className={
//                                         data?.debit
//                                           ? "text-danger font-weight-bold"
//                                           : ""
//                                       }
//                                     >
//                                       {data?.debit ? `-${data.debit}` : 0}
//                                     </span>
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div className="text-right">
//                                     <span>{data?.totalUserBalance || 0}</span>
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div>
//                                     {data?.narration || data?.remark || "-"}
//                                   </div>
//                                 </td>
//                                 <td role="cell" className="">
//                                   <div>{data?.fromto || "-"}</div>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="7" className="text-center py-4">
//                                 {statementData.length === 0
//                                   ? "No data available"
//                                   : "No matching records found"}
//                               </td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>

//                 {filteredData.length > 0 && (
//                   <div className="row pt-3">
//                     <div className="col">
//                       <div className="dataTables_paginate paging_simple_numbers float-right">
//                         <ul className="pagination pagination-rounded mb-0">
//                           {renderPagination()}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AccountStatement;
