import React, { useState, useEffect } from "react";
import DateRange from "../../date/Daterange";
import { useQuery } from "react-query";
import { decodedTokenData } from "../../../Helper/auth";
import { useCookies } from "react-cookie";
import { getLoginReport } from "../../../Helper/users";
import {
  exportToExcel,
  exportToPDF,
  exportPasswordHistoryToExcel,
  exportPasswordHistoryToPDF,
} from "../../../Helper/excelHelper";

const Userhistory = () => {
  const [cookies] = useCookies(["Admin"]);
  const { userId, PersonalDetails } = decodedTokenData(cookies) || {};
  // const selectedUser = PersonalDetails?.loginId || "N/A";

  const [activeTab, setActiveTab] = useState("login");
  const [loginDateRange, setLoginDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [passwordDateRange, setPasswordDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(PersonalDetails?.loginId);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch login history data
  const {
    isLoading: loginLoading,
    data: loginData,
    refetch: refetchLogin,
  } = useQuery(
    ["loginHistory", { cookies, dateRange: loginDateRange, selectedUser }],
    async () => {
      try {
        const response = await getLoginReport({
          cookies,
          startDate: loginDateRange.startDate,
          endDate: loginDateRange.endDate,
          loginId: selectedUser || null,
        });
        return response;
      } catch (error) {
        console.error("Error fetching login history:", error);
        return { loginReports: [] };
      }
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  // Fetch password change history data
  const {
    isLoading: passwordLoading,
    data: passwordData,
    refetch: refetchPassword,
  } = useQuery(
    [
      "passwordHistory",
      { cookies, dateRange: passwordDateRange, selectedUser },
    ],
    async () => {
      try {
        const response = await getLoginReport({
          cookies,
          startDate: passwordDateRange.startDate,
          endDate: passwordDateRange.endDate,
          loginId: selectedUser || null,
        });
        return response;
      } catch (error) {
        console.error("Error fetching password history:", error);
        return { passwordReports: [] };
      }
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const handleLoginDateRangeChange = (range) => {
    setLoginDateRange(range);
    setCurrentPage(1);
  };

  const handlePasswordDateRangeChange = (range) => {
    setPasswordDateRange(range);
    setCurrentPage(1);
  };

  const handleLoadData = () => {
    if (activeTab === "login") {
      refetchLogin();
    } else {
      refetchPassword();
    }
  };

  const handleReset = () => {
    if (activeTab === "login") {
      setLoginDateRange({ startDate: null, endDate: null });
    } else {
      setPasswordDateRange({ startDate: null, endDate: null });
    }
    setSelectedUser("");
    setSearchValue("");
    setCurrentPage(1);
    setShowDropdown(false);
  };

  const handleEyeClick = (item) => {
    const ipDetails = {
      ip: item.IpAddress,
      city: item.city || "N/A",
      country: item.country || "N/A",
      mobile: "False",
    };

    setModalData({
      ip: ipDetails.ip,
      city: ipDetails.city,
      country: ipDetails.country,
      mobile: ipDetails.mobile,
      username: item.username || "",
      date: item.loginDate,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  // Handle Excel Export
  const handleExcelExport = () => {
    try {
      const currentData = getCurrentData();
      if (!currentData || currentData.length === 0) {
        alert("No data available to export");
        return;
      }

      if (activeTab === "login") {
        exportToExcel(currentData, "login-history");
      } else {
        // Add username to password history data before export
        const dataWithUsername = currentData.map((item) => ({
          ...item,
          username: "",
        }));
        exportPasswordHistoryToExcel(dataWithUsername, "password-history");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed: " + error.message);
    }
  };

  // Handle PDF Export
  const handlePDFExport = async () => {
    try {
      const currentData = getCurrentData();
      if (!currentData || currentData.length === 0) {
        alert("No data available to export");
        return;
      }

      if (activeTab === "login") {
        await exportToPDF(currentData, "login-history");
      } else {
        // Add username to password history data before export
        const dataWithUsername = currentData.map((item) => ({
          ...item,
          username: selectedUser,
        }));
        await exportPasswordHistoryToPDF(dataWithUsername, "password-history");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed: " + error.message);
    }
  };

  // Filter data based on search
  const filterData = (data) => {
    if (!data || !searchValue) return data;

    return data.filter((item) =>
      Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  };

  // Paginate data
  const paginateData = (data) => {
    if (!data) return [];
    const filteredData = filterData(data);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Get current tab data
  const getCurrentData = () => {
    if (activeTab === "login") {
      return loginData?.loginReports || [];
    } else {
      return passwordData?.passwordReports || [];
    }
  };

  const currentData = getCurrentData();
  const filteredData = filterData(currentData);
  const paginatedData = paginateData(currentData);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  // Sample users list
  const sampleUsers = [
    { id: 1, username: "user001" },
    { id: 2, username: "user002" },
    { id: 3, username: "admin001" },
    { id: 4, username: "testuser" },
    { id: 5, username: selectedUser },
  ];

  const handleUserSelect = (user) => {
    setSelectedUser(user.username);
    setShowDropdown(false);
  };

  const handleUserInputChange = (e) => {
    setSelectedUser(e.target.value);
    setShowDropdown(true);
  };

  const filteredUsers = sampleUsers.filter((user) =>
    user.username.toLowerCase().includes(selectedUser.toLowerCase())
  );

  return (
    <div>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">User History</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">User History</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="tabs">
                  <div className="">
                    <ul role="tablist" className="nav nav-tabs">
                      <li role="presentation" className="nav-item">
                        <button
                          role="tab"
                          aria-selected={activeTab === "login"}
                          aria-setsize={2}
                          aria-posinset={1}
                          onClick={() => setActiveTab("login")}
                          className={`nav-link ${
                            activeTab === "login" ? "active tab-bg-primary" : ""
                          }`}
                          id="login-tab-button"
                          aria-controls="login-tab"
                        >
                          <span>Login History</span>
                        </button>
                      </li>
                      <li role="presentation" className="nav-item">
                        <button
                          role="tab"
                          aria-selected={activeTab === "password"}
                          aria-setsize={2}
                          aria-posinset={2}
                          onClick={() => setActiveTab("password")}
                          className={`nav-link ${
                            activeTab === "password"
                              ? "active tab-bg-primary"
                              : ""
                          }`}
                          id="password-tab-button"
                          aria-controls="password-tab"
                          tabIndex={-1}
                        >
                          <span>Change Password History</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content p-2 text-muted">
                    {/* Login History Tab */}
                    <div
                      role="tabpanel"
                      aria-hidden={activeTab !== "login"}
                      className={`tab-pane ${
                        activeTab === "login" ? "active" : ""
                      }`}
                      id="login-tab"
                      aria-labelledby="login-tab-button"
                    >
                      {" "}
                      <form data-vv-scope="InserUserAccount" method="post">
                        <div className="row row5">
                          {/* Multiselect for User Selection */}
                          <div className="form-group col-xl-3">
                            <div
                              className="form-group user-lock-search"
                              style={{ position: "relative" }}
                            >
                              <div
                                tabIndex={-1}
                                role="combobox"
                                aria-owns="listbox-null"
                                className="multiselect"
                              >
                                <div
                                  className="multiselect__select"
                                  onClick={() => setShowDropdown(!showDropdown)}
                                />
                                <div className="multiselect__tags">
                                  <div
                                    className="multiselect__tags-wrap"
                                    style={{ display: "none" }}
                                  />
                                  <div
                                    className="multiselect__spinner"
                                    style={{ display: "none" }}
                                  />
                                  <input
                                    autoComplete="off"
                                    spellCheck="false"
                                    placeholder="Select user"
                                    tabIndex={0}
                                    aria-controls="listbox-null"
                                    className="multiselect__input"
                                    type="text"
                                    value={selectedUser}
                                    onChange={handleUserInputChange}
                                    onFocus={() => setShowDropdown(true)}
                                    style={{
                                      width: "100%",
                                      position: "unset",
                                      padding: "0 12px",
                                    }}
                                  />
                                  <span
                                    className="multiselect__placeholder"
                                    style={{
                                      display: selectedUser ? "none" : "block",
                                    }}
                                  >
                                    {/* Select user */}
                                  </span>
                                </div>
                                <div
                                  tabIndex={-1}
                                  className="multiselect__content-wrapper"
                                  style={{
                                    maxHeight: 300,
                                    display: showDropdown ? "block" : "none",
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    zIndex: 1000,
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <ul
                                    role="listbox"
                                    id="listbox-null"
                                    className="multiselect__content"
                                    style={{ display: "block" }}
                                  >
                                    {filteredUsers.length > 0 ? (
                                      filteredUsers.map((user) => (
                                        <li
                                          key={user.id}
                                          style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => handleUserSelect(user)}
                                          className="multiselect__option multiselBg"
                                        >
                                          {user.username}
                                        </li>
                                      ))
                                    ) : (
                                      <li style={{ padding: "8px 12px" }}>
                                        <span className="multiselect__option multiselBg">
                                          No users found
                                        </span>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group col-xl-3">
                            <DateRange
                              onDateRangeChange={handleLoginDateRangeChange}
                              value={loginDateRange}
                            />
                          </div>{" "}
                          <div className="form-group col-xl-6">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleLoadData}
                              disabled={loginLoading}
                            >
                              {loginLoading ? (
                                 <>
                               <i className="fa fa-spinner fa-spin mr-2" />
      
                                     </>
                                  ) : "Load"}
   
                            </button>
                            <button
                              type="button"
                              id="reset"
                              className="btn btn-light"
                              onClick={handleReset}
                            >
                              Reset
                            </button>{" "}
                            <div
                              id="export_1763983131794"
                              className="d-inline-block"
                            >
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleExcelExport}
                                disabled={
                                  !currentData || currentData.length === 0
                                }
                              >
                                <i className="fas fa-file-excel" />
                              </button>
                            </div>{" "}
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handlePDFExport}
                              disabled={
                                !currentData || currentData.length === 0
                              }
                            >
                              <i className="fas fa-file-pdf" />
                            </button>
                          </div>
                        </div>
                      </form>{" "}
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
                        </div>{" "}
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
                              />
                            </label>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="table-responsive mb-0">
                        <div className="table no-footer table-hover table-responsive-sm">
                          <table
                            id="eventsListTbl"
                            role="table"
                            aria-busy="false"
                            aria-colcount={6}
                            className="table b-table"
                          >
                            <thead role="rowgroup" className="">
                              <tr role="row" className="">
                                <th
                                  role="columnheader"
                                  scope="col"
                                  tabIndex={0}
                                  aria-colindex={1}
                                  aria-sort="none"
                                  className="position-relative"
                                >
                                  <div>Country</div>
                                  <span className="sr-only">
                                    {" "}
                                    (Click to sort ascending)
                                  </span>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={2}
                                  className=""
                                >
                                  <div>Region</div>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={3}
                                  className=""
                                >
                                  <div>ISP</div>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={4}
                                  className=""
                                >
                                  <div>IP Address</div>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={5}
                                  className=""
                                >
                                  <div>Login Time</div>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={6}
                                  className=""
                                >
                                  <div>Detail</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody role="rowgroup">
                              {loginLoading ? (
                                <tr>
                                  <td colSpan={6} className="text-center">
                                    <div
                                      className="text-center p-4"
                                      style={{ fontSize: "2rem" }}
                                    >
                                      <i className="fa fa-spinner fa-spin" />
                                    </div>
                                  </td>
                                </tr>
                              ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                  <tr key={index} role="row" className="">
                                    <td
                                      aria-colindex={1}
                                      role="cell"
                                      className=""
                                    >
                                      {item.country || "N/A"}
                                    </td>
                                    <td
                                      aria-colindex={2}
                                      role="cell"
                                      className=""
                                    >
                                      <div>{item.region || "N/A"}</div>
                                    </td>
                                    <td
                                      aria-colindex={3}
                                      role="cell"
                                      className=""
                                    >
                                      {item.isp || "N/A"}
                                    </td>
                                    <td
                                      aria-colindex={4}
                                      role="cell"
                                      className=""
                                    >
                                      {item.IpAddress || "N/A"}
                                    </td>
                                    <td
                                      aria-colindex={5}
                                      role="cell"
                                      className=""
                                    >
                                      <div>{item.loginDate || "N/A"}</div>
                                    </td>
                                    <td
                                      aria-colindex={6}
                                      role="cell"
                                      className=""
                                    >
                                      <p
                                        className="text-center pointer mb-0"
                                        onClick={() => handleEyeClick(item)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <i className="fas fa-eye" />
                                      </p>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr role="row" className="b-table-empty-row">
                                  <td colSpan={6} role="cell" className="">
                                    <div role="alert" aria-live="polite">
                                      <div className="text-center my-2">
                                        There are no records to show
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>{" "}
                      <div className="row pt-3">
                        <div className="col">
                          <div className="dataTables_paginate paging_simple_numbers float-right">
                            <ul className="pagination pagination-rounded mb-0">
                              <ul
                                role="menubar"
                                aria-disabled="false"
                                aria-label="Pagination"
                                className="pagination dataTables_paginate paging_simple_numbers my-0 b-pagination justify-content-end"
                              >
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to first page"
                                    className="page-link"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                  >
                                    «
                                  </button>
                                </li>
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to previous page"
                                    className="page-link"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={currentPage === 1}
                                  >
                                    ‹
                                  </button>
                                </li>
                                {Array.from(
                                  { length: Math.min(5, totalPages) },
                                  (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                      pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                      pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                      pageNum = totalPages - 4 + i;
                                    } else {
                                      pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                      <li
                                        key={pageNum}
                                        role="presentation"
                                        className={`page-item ${
                                          currentPage === pageNum
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        <button
                                          role="menuitemradio"
                                          type="button"
                                          aria-label={`Go to page ${pageNum}`}
                                          aria-checked={currentPage === pageNum}
                                          aria-posinset={pageNum}
                                          aria-setsize={totalPages}
                                          tabIndex={0}
                                          className="page-link"
                                          onClick={() =>
                                            setCurrentPage(pageNum)
                                          }
                                        >
                                          {pageNum}
                                        </button>
                                      </li>
                                    );
                                  }
                                )}
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to next page"
                                    className="page-link"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                    disabled={currentPage === totalPages}
                                  >
                                    ›
                                  </button>
                                </li>
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to last page"
                                    className="page-link"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                  >
                                    »
                                  </button>
                                </li>
                              </ul>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Change Password History Tab */}
                    <div
                      role="tabpanel"
                      aria-hidden={activeTab !== "password"}
                      className={`tab-pane ${
                        activeTab === "password" ? "active" : ""
                      }`}
                      id="password-tab"
                      aria-labelledby="password-tab-button"
                    >
                      {" "}
                      <form data-vv-scope="cpAccount" method="post">
                        <div className="row">
                          {/* Multiselect for User Selection */}
                          <div className="form-group col-xl-3">
                            <div
                              className="form-group user-lock-search"
                              style={{ position: "relative" }}
                            >
                              <div
                                tabIndex={-1}
                                role="combobox"
                                aria-owns="listbox-null"
                                className="multiselect"
                              >
                                <div
                                  className="multiselect__select"
                                  onClick={() => setShowDropdown(!showDropdown)}
                                />
                                <div className="multiselect__tags">
                                  <div
                                    className="multiselect__tags-wrap"
                                    style={{ display: "none" }}
                                  />
                                  <div
                                    className="multiselect__spinner"
                                    style={{ display: "none" }}
                                  />
                                  <input
                                    autoComplete="off"
                                    spellCheck="false"
                                    placeholder="Select user"
                                    tabIndex={0}
                                    aria-controls="listbox-null"
                                    className="multiselect__input"
                                    type="text"
                                    value={selectedUser}
                                    onChange={handleUserInputChange}
                                    onFocus={() => setShowDropdown(true)}
                                    style={{
                                      width: "100%",
                                      position: "unset",
                                      padding: "0 12px",
                                    }}
                                  />
                                  <span
                                    className="multiselect__placeholder"
                                    style={{
                                      display: selectedUser ? "none" : "block",
                                    }}
                                  >
                                    Select user
                                  </span>
                                </div>
                                <div
                                  tabIndex={-1}
                                  className="multiselect__content-wrapper"
                                  style={{
                                    maxHeight: 300,
                                    display: showDropdown ? "block" : "none",
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    zIndex: 1000,
                                    backgroundColor: "white",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                  }}
                                >
                                  <ul
                                    role="listbox"
                                    id="listbox-null"
                                    className="multiselect__content"
                                    style={{ display: "block" }}
                                  >
                                    {filteredUsers.length > 0 ? (
                                      filteredUsers.map((user) => (
                                        <li
                                          key={user.id}
                                          style={{
                                            padding: "8px 12px",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => handleUserSelect(user)}
                                          className="multiselect__option multiselBg"
                                        >
                                          {user.username}
                                        </li>
                                      ))
                                    ) : (
                                      <li style={{ padding: "8px 12px" }}>
                                        <span className="multiselect__option multiselBg">
                                          No users found
                                        </span>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group col-xl-3">
                            <DateRange
                              onDateRangeChange={handlePasswordDateRangeChange}
                              value={passwordDateRange}
                            />
                          </div>{" "}
                          <div className="form-group col-xl-4">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleLoadData}
                              disabled={passwordLoading}
                            >
                              {passwordLoading ? "Loading..." : "Load"}
                            </button>{" "}
                            <button
                              type="button"
                              id="reset1"
                              className="btn btn-light"
                              onClick={handleReset}
                            >
                              Reset
                            </button>{" "}
                            <div
                              id="export_1763983131806"
                              className="d-inline-block"
                            >
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleExcelExport}
                                disabled={
                                  !currentData || currentData.length === 0
                                }
                              >
                                <i className="fas fa-file-excel" />
                              </button>
                            </div>{" "}
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handlePDFExport}
                              disabled={
                                !currentData || currentData.length === 0
                              }
                            >
                              <i className="fas fa-file-pdf" />
                            </button>
                          </div>
                        </div>
                      </form>{" "}
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
                        </div>{" "}
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
                              />
                            </label>
                          </div>
                        </div>
                      </div>{" "}
                      <div className="table-responsive mb-0">
                        <div className="table no-footer table-hover table-responsive-sm">
                          <table
                            id="eventsListTbl"
                            role="table"
                            aria-busy="false"
                            aria-colcount={4}
                            className="table b-table"
                          >
                            <thead role="rowgroup" className="">
                              <tr role="row" className="">
                                <th
                                  role="columnheader"
                                  scope="col"
                                  tabIndex={0}
                                  aria-colindex={1}
                                  aria-sort="none"
                                  className="position-relative"
                                >
                                  <div>Username</div>
                                  <span className="sr-only">
                                    {" "}
                                    (Click to sort ascending)
                                  </span>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={2}
                                  className=""
                                >
                                  <div>Date</div>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={3}
                                  className=""
                                >
                                  <div>IP</div>
                                </th>
                                <th
                                  role="columnheader"
                                  scope="col"
                                  aria-colindex={4}
                                  className=""
                                >
                                  <div>Detail</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody role="rowgroup">
                              {passwordLoading ? (
                                <tr>
                                  <td colSpan={4} className="text-center">
                                    <div
                                      className="text-center p-4"
                                      style={{ fontSize: "2rem" }}
                                    >
                                      <i className="fa fa-spinner fa-spin" />
                                    </div>
                                  </td>
                                </tr>
                              ) : paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                  <tr key={index} role="row" className="">
                                    <td
                                      aria-colindex={1}
                                      role="cell"
                                      className=""
                                    >
                                      <p className="mb-0">{selectedUser}</p>
                                    </td>
                                    <td
                                      aria-colindex={2}
                                      role="cell"
                                      className=""
                                    >
                                      <div>{item.loginDate || "N/A"}</div>
                                    </td>
                                    <td
                                      aria-colindex={3}
                                      role="cell"
                                      className=""
                                    >
                                      {item.IpAddress || "N/A"}
                                    </td>
                                    <td
                                      aria-colindex={4}
                                      role="cell"
                                      className=""
                                    >
                                      <p
                                        className="text-center pointer mb-0"
                                        onClick={() => handleEyeClick(item)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <i className="fas fa-eye" />
                                      </p>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr role="row" className="b-table-empty-row">
                                  <td colSpan={4} role="cell" className="">
                                    <div role="alert" aria-live="polite">
                                      <div className="text-center my-2">
                                        There are no records to show
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>{" "}
                      <div className="row pt-3">
                        <div className="col">
                          <div className="dataTables_paginate paging_simple_numbers float-right">
                            {/* Similar pagination as login tab */}
                            <ul className="pagination pagination-rounded mb-0">
                              <ul
                                role="menubar"
                                aria-disabled="false"
                                aria-label="Pagination"
                                className="pagination dataTables_paginate paging_simple_numbers my-0 b-pagination justify-content-end"
                              >
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to first page"
                                    className="page-link"
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                  >
                                    «
                                  </button>
                                </li>
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to previous page"
                                    className="page-link"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                      )
                                    }
                                    disabled={currentPage === 1}
                                  >
                                    ‹
                                  </button>
                                </li>
                                {Array.from(
                                  { length: Math.min(5, totalPages) },
                                  (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                      pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                      pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                      pageNum = totalPages - 4 + i;
                                    } else {
                                      pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                      <li
                                        key={pageNum}
                                        role="presentation"
                                        className={`page-item ${
                                          currentPage === pageNum
                                            ? "active"
                                            : ""
                                        }`}
                                      >
                                        <button
                                          role="menuitemradio"
                                          type="button"
                                          aria-label={`Go to page ${pageNum}`}
                                          aria-checked={currentPage === pageNum}
                                          aria-posinset={pageNum}
                                          aria-setsize={totalPages}
                                          tabIndex={0}
                                          className="page-link"
                                          onClick={() =>
                                            setCurrentPage(pageNum)
                                          }
                                        >
                                          {pageNum}
                                        </button>
                                      </li>
                                    );
                                  }
                                )}
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to next page"
                                    className="page-link"
                                    onClick={() =>
                                      setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                      )
                                    }
                                    disabled={currentPage === totalPages}
                                  >
                                    ›
                                  </button>
                                </li>
                                <li
                                  role="presentation"
                                  className={`page-item ${
                                    currentPage === totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    role="menuitem"
                                    aria-label="Go to last page"
                                    className="page-link"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                  >
                                    »
                                  </button>
                                </li>
                              </ul>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && modalData && (
        <div style={{ position: "absolute", zIndex: 1040 }}>
          <div
            role="dialog"
            aria-describedby="modal-body"
            className="modal fade show"
            aria-modal="true"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-sm">
              <span tabIndex={0} />
              <div tabIndex={-1} className="modal-content">
                <header className="modal-header bg-success">
                  <h5 className="modal-title text-uppercase text-white">
                    IP Detail
                  </h5>{" "}
                  <button
                    type="button"
                    onClick={closeModal}
                    className="close text-white"
                  >
                    ×
                  </button>
                </header>
                <div id="modal-body" className="modal-body">
                  {" "}
                  <div className="table-responsive">
                    <table
                      role="table"
                      className="table b-table table-striped table-hover table-bordered table-sm b-table-caption-top"
                    >
                      <thead role="rowgroup" className="thead-dark">
                        <tr role="row" className="">
                          <th role="columnheader" scope="col" className="">
                            Key
                          </th>{" "}
                          <th role="columnheader" scope="col" className="">
                            Value
                          </th>
                        </tr>
                      </thead>{" "}
                      <tbody role="rowgroup">
                        <tr role="row" className="">
                          <td role="cell" className="">
                            <b>IP:</b>
                          </td>{" "}
                          <td role="cell" className="">
                            {modalData.ip}
                          </td>
                        </tr>{" "}
                        <tr role="row" className="">
                          <td role="cell" className="">
                            <b>City:</b>
                          </td>{" "}
                          <td role="cell" className="">
                            {modalData.city}
                          </td>
                        </tr>{" "}
                        <tr role="row" className="">
                          <td role="cell" className="">
                            <b>Country:</b>
                          </td>{" "}
                          <td role="cell" className="">
                            {modalData.country}
                          </td>
                        </tr>{" "}
                        <tr role="row" className="">
                          <td role="cell" className="">
                            <b>Mobile:</b>
                          </td>{" "}
                          <td role="cell" className="">
                            {modalData.mobile}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <span tabIndex={0} />
            </div>
          </div>
          <div className="modal-backdrop show" onClick={closeModal} />
        </div>
      )}
    </div>
  );
};

export default Userhistory;

// import React, { useState, useEffect } from "react";
// import DateRange from "../../date/Daterange";
// import { useQuery } from "react-query";
// import { decodedTokenData } from "../../../Helper/auth";
// import { useCookies } from "react-cookie";
// import { getLoginReport } from "../../../Helper/users";

// const Userhistory = () => {
//   const [cookies] = useCookies(["Admin"]);
//   const { userId } = decodedTokenData(cookies) || {};

//   const [activeTab, setActiveTab] = useState("login");
//   const [loginDateRange, setLoginDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [passwordDateRange, setPasswordDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState("");

//   // Fetch login history data
//   const {
//     isLoading: loginLoading,
//     data: loginData,
//     refetch: refetchLogin,
//   } = useQuery(
//     ["loginHistory", { cookies, dateRange: loginDateRange, selectedUser }],
//     async () => {
//       try {
//         const response = await getLoginReport({
//           cookies,
//           startDate: loginDateRange.startDate,
//           endDate: loginDateRange.endDate,
//           loginId: selectedUser || null,
//         });
//         return response;
//       } catch (error) {
//         console.error("Error fetching login history:", error);
//         return { loginReports: [] };
//       }
//     },
//     {
//       enabled: false, // We'll manually trigger this with refetch
//       refetchOnWindowFocus: false,
//     }
//   );

//   // Fetch password change history data
//   const {
//     isLoading: passwordLoading,
//     data: passwordData,
//     refetch: refetchPassword,
//   } = useQuery(
//     [
//       "passwordHistory",
//       { cookies, dateRange: passwordDateRange, selectedUser },
//     ],
//     async () => {
//       try {
//         // Using same API for demo - replace with getPasswordHistory when available
//         const response = await getLoginReport({
//           cookies,
//           startDate: passwordDateRange.startDate,
//           endDate: passwordDateRange.endDate,
//           loginId: selectedUser || null,
//         });
//         return response;
//       } catch (error) {
//         console.error("Error fetching password history:", error);
//         return { passwordReports: [] };
//       }
//     },
//     {
//       enabled: false, // We'll manually trigger this with refetch
//       refetchOnWindowFocus: false,
//     }
//   );

//   const handleLoginDateRangeChange = (range) => {
//     setLoginDateRange(range);
//     setCurrentPage(1);
//   };

//   const handlePasswordDateRangeChange = (range) => {
//     setPasswordDateRange(range);
//     setCurrentPage(1);
//   };

//   const handleLoadData = () => {
//     if (activeTab === "login") {
//       refetchLogin();
//     } else {
//       refetchPassword();
//     }
//   };

//   const handleReset = () => {
//     if (activeTab === "login") {
//       setLoginDateRange({ startDate: null, endDate: null });
//     } else {
//       setPasswordDateRange({ startDate: null, endDate: null });
//     }
//     setSelectedUser("");
//     setSearchValue("");
//     setCurrentPage(1);
//   };

//   const handleEyeClick = (item) => {
//     const ipDetails = {
//       ip: item.IpAddress,
//       city: item.city || "N/A",
//       country: item.country || "N/A",
//       mobile: "False",
//     };

//     setModalData({
//       ip: ipDetails.ip,
//       city: ipDetails.city,
//       country: ipDetails.country,
//       mobile: ipDetails.mobile,
//       username: item.username || "N/A",
//       date: item.loginDate,
//     });
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setModalData(null);
//   };

//   // Filter data based on search
//   const filterData = (data) => {
//     if (!data || !searchValue) return data;

//     return data.filter((item) =>
//       Object.values(item).some((value) =>
//         value?.toString().toLowerCase().includes(searchValue.toLowerCase())
//       )
//     );
//   };

//   // Paginate data
//   const paginateData = (data) => {
//     if (!data) return [];
//     const filteredData = filterData(data);
//     const startIndex = (currentPage - 1) * entriesPerPage;
//     const endIndex = startIndex + entriesPerPage;
//     return filteredData.slice(startIndex, endIndex);
//   };

//   // Get current tab data
//   const getCurrentData = () => {
//     if (activeTab === "login") {
//       return loginData?.loginReports || [];
//     } else {
//       return passwordData?.passwordReports || loginData?.loginReports || [];
//     }
//   };

//   const currentData = getCurrentData();
//   const filteredData = filterData(currentData);
//   const paginatedData = paginateData(currentData);
//   const totalPages = Math.ceil(filteredData.length / entriesPerPage);

//   // For password history tab - using same data structure for demo
//   const passwordHistoryData = paginatedData;

//   return (
//     <div>
//       <div>
//         <div className="row">
//           <div className="col-12">
//             <div className="page-title-box d-flex align-items-center justify-content-between">
//               <h4 className="mb-0 font-size-18">User History</h4>{" "}
//               <div className="page-title-right">
//                 <ol className="breadcrumb m-0">
//                   <li className="breadcrumb-item">
//                     <a href="/admin/home" className="" target="_self">
//                       Home
//                     </a>
//                   </li>
//                   <li className="breadcrumb-item active">
//                     <span aria-current="location">User History</span>
//                   </li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>{" "}
//         <div className="row">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="tabs">
//                   <div className="">
//                     <ul role="tablist" className="nav nav-tabs">
//                       <li role="presentation" className="nav-item">
//                         <button
//                           role="tab"
//                           aria-selected={activeTab === "login"}
//                           aria-setsize={2}
//                           aria-posinset={1}
//                           onClick={() => setActiveTab("login")}
//                           className={`nav-link ${
//                             activeTab === "login" ? "active tab-bg-primary" : ""
//                           }`}
//                           id="login-tab-button"
//                           aria-controls="login-tab"
//                         >
//                           <span>Login History</span>
//                         </button>
//                       </li>
//                       <li role="presentation" className="nav-item">
//                         <button
//                           role="tab"
//                           aria-selected={activeTab === "password"}
//                           aria-setsize={2}
//                           aria-posinset={2}
//                           onClick={() => setActiveTab("password")}
//                           className={`nav-link ${
//                             activeTab === "password"
//                               ? "active tab-bg-primary"
//                               : ""
//                           }`}
//                           id="password-tab-button"
//                           aria-controls="password-tab"
//                           tabIndex={-1}
//                         >
//                           <span>Change Password History</span>
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="tab-content p-2 text-muted">
//                     {/* Login History Tab */}
//                     <div
//                       role="tabpanel"
//                       aria-hidden={activeTab !== "login"}
//                       className={`tab-pane ${
//                         activeTab === "login" ? "active" : ""
//                       }`}
//                       id="login-tab"
//                       aria-labelledby="login-tab-button"
//                     >
//                       {" "}
//                       <form data-vv-scope="InserUserAccount" method="post">
//                         <div className="row row5">
//                           {/* Multiselect for User Selection */}
//                           <div className="form-group col-xl-3">
//                             <div
//                               className="form-group user-lock-search"
//                               style={{ position: "relative" }}
//                             >
//                               <div
//                                 tabIndex={-1}
//                                 role="combobox"
//                                 aria-owns="listbox-null"
//                                 className="multiselect"
//                               >
//                                 <div className="multiselect__select" />
//                                 <div className="multiselect__tags">
//                                   <div
//                                     className="multiselect__tags-wrap"
//                                     style={{ display: "none" }}
//                                   />
//                                   <div
//                                     className="multiselect__spinner"
//                                     style={{ display: "none" }}
//                                   />
//                                   <input
//                                     autoComplete="off"
//                                     spellCheck="false"
//                                     placeholder="Select user"
//                                     tabIndex={0}
//                                     aria-controls="listbox-null"
//                                     className="multiselect__input"
//                                     type="text"
//                                     value={selectedUser}
//                                     onChange={(e) =>
//                                       setSelectedUser(e.target.value)
//                                     }
//                                     style={{
//                                       width: "100%",
//                                       position: "unset",
//                                       padding: "0 12px",
//                                     }}
//                                   />
//                                   <span
//                                     className="multiselect__placeholder"
//                                     style={{
//                                       display: selectedUser ? "none" : "block",
//                                     }}
//                                   >
//                                     {/* Select user */}
//                                   </span>
//                                 </div>
//                                 <div
//                                   tabIndex={-1}
//                                   className="multiselect__content-wrapper"
//                                   style={{ maxHeight: 300, display: "none" }}
//                                 >
//                                   <ul
//                                     role="listbox"
//                                     id="listbox-null"
//                                     className="multiselect__content"
//                                     style={{ display: "block" }}
//                                   >
//                                     <li style={{}}>
//                                       <span className="multiselect__option multiselBg">
//                                         List is empty.
//                                       </span>
//                                     </li>
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="form-group col-xl-3">
//                             <DateRange
//                               onDateRangeChange={handleLoginDateRangeChange}
//                               value={loginDateRange}
//                             />
//                           </div>{" "}
//                           <div className="form-group col-xl-6">
//                             <button
//                               type="button"
//                               className="btn btn-primary"
//                               onClick={handleLoadData}
//                               disabled={loginLoading}
//                             >
//                               {loginLoading ? "Loading..." : "Load"}
//                             </button>{" "}
//                             <button
//                               type="button"
//                               id="reset"
//                               className="btn btn-light"
//                               onClick={handleReset}
//                             >
//                               Reset
//                             </button>{" "}
//                             <div
//                               id="export_1763983131794"
//                               className="d-inline-block disabled"
//                             >
//                               <button
//                                 type="button"
//                                 disabled="disabled"
//                                 className="btn btn-success disabled"
//                               >
//                                 <i className="fas fa-file-excel" />
//                               </button>
//                             </div>{" "}
//                             <button
//                               type="button"
//                               disabled="disabled"
//                               className="btn btn-danger disabled"
//                             >
//                               <i className="fas fa-file-pdf" />
//                             </button>
//                           </div>
//                         </div>
//                       </form>{" "}
//                       <div className="row">
//                         <div className="col-6">
//                           <div
//                             id="tickets-table_length"
//                             className="dataTables_length"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               Show&nbsp;
//                               <select
//                                 className="custom-select custom-select-sm"
//                                 value={entriesPerPage}
//                                 onChange={(e) => {
//                                   setEntriesPerPage(Number(e.target.value));
//                                   setCurrentPage(1);
//                                 }}
//                               >
//                                 <option value={25}>25</option>
//                                 <option value={50}>50</option>
//                                 <option value={75}>75</option>
//                                 <option value={100}>100</option>
//                                 <option value={125}>125</option>
//                                 <option value={150}>150</option>
//                               </select>
//                               &nbsp;entries
//                             </label>
//                           </div>
//                         </div>{" "}
//                         <div className="col-6 text-right">
//                           <div
//                             id="tickets-table_filter"
//                             className="dataTables_filter text-md-right"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               <input
//                                 type="search"
//                                 placeholder="Search..."
//                                 className="form-control form-control-sm ml-2 form-control"
//                                 value={searchValue}
//                                 onChange={(e) => setSearchValue(e.target.value)}
//                               />
//                             </label>
//                           </div>
//                         </div>
//                       </div>{" "}
//                       <div className="table-responsive mb-0">
//                         <div className="table no-footer table-hover table-responsive-sm">
//                           <table
//                             id="eventsListTbl"
//                             role="table"
//                             aria-busy="false"
//                             aria-colcount={6}
//                             className="table b-table"
//                           >
//                             <thead role="rowgroup" className="">
//                               <tr role="row" className="">
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   tabIndex={0}
//                                   aria-colindex={1}
//                                   aria-sort="none"
//                                   className="position-relative"
//                                 >
//                                   <div>Country</div>
//                                   <span className="sr-only">
//                                     {" "}
//                                     (Click to sort ascending)
//                                   </span>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={2}
//                                   className=""
//                                 >
//                                   <div>Region</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={3}
//                                   className=""
//                                 >
//                                   <div>ISP</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={4}
//                                   className=""
//                                 >
//                                   <div>IP Address</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={5}
//                                   className=""
//                                 >
//                                   <div>Login Time</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={6}
//                                   className=""
//                                 >
//                                   <div>Detail</div>
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody role="rowgroup">
//                               {loginLoading ? (
//                                 <tr>
//                                   <td colSpan={6} className="text-center">
//                                     <div
//                                       className="spinner-border"
//                                       role="status"
//                                     >
//                                       <span className="sr-only">
//                                         Loading...
//                                       </span>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ) : paginatedData.length > 0 ? (
//                                 paginatedData.map((item, index) => (
//                                   <tr key={index} role="row" className="">
//                                     <td
//                                       aria-colindex={1}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.country || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={2}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <div>{item.region || "N/A"}</div>
//                                     </td>
//                                     <td
//                                       aria-colindex={3}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.isp || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={4}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.IpAddress || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={5}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <div>{item.loginDate || "N/A"}</div>
//                                     </td>
//                                     <td
//                                       aria-colindex={6}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <p
//                                         className="text-center pointer mb-0"
//                                         onClick={() => handleEyeClick(item)}
//                                         style={{ cursor: "pointer" }}
//                                       >
//                                         <i className="fas fa-eye" />
//                                       </p>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr role="row" className="b-table-empty-row">
//                                   <td colSpan={6} role="cell" className="">
//                                     <div role="alert" aria-live="polite">
//                                       <div className="text-center my-2">
//                                         There are no records to show
//                                       </div>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>{" "}
//                       <div className="row pt-3">
//                         <div className="col">
//                           <div className="dataTables_paginate paging_simple_numbers float-right">
//                             <ul className="pagination pagination-rounded mb-0">
//                               <ul
//                                 role="menubar"
//                                 aria-disabled="false"
//                                 aria-label="Pagination"
//                                 className="pagination dataTables_paginate paging_simple_numbers my-0 b-pagination justify-content-end"
//                               >
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === 1 ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to first page"
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(1)}
//                                     disabled={currentPage === 1}
//                                   >
//                                     «
//                                   </button>
//                                 </li>
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === 1 ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to previous page"
//                                     className="page-link"
//                                     onClick={() =>
//                                       setCurrentPage((prev) =>
//                                         Math.max(prev - 1, 1)
//                                       )
//                                     }
//                                     disabled={currentPage === 1}
//                                   >
//                                     ‹
//                                   </button>
//                                 </li>
//                                 {Array.from(
//                                   { length: Math.min(5, totalPages) },
//                                   (_, i) => {
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                       pageNum = i + 1;
//                                     } else if (currentPage <= 3) {
//                                       pageNum = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                       pageNum = totalPages - 4 + i;
//                                     } else {
//                                       pageNum = currentPage - 2 + i;
//                                     }

//                                     return (
//                                       <li
//                                         key={pageNum}
//                                         role="presentation"
//                                         className={`page-item ${
//                                           currentPage === pageNum
//                                             ? "active"
//                                             : ""
//                                         }`}
//                                       >
//                                         <button
//                                           role="menuitemradio"
//                                           type="button"
//                                           aria-label={`Go to page ${pageNum}`}
//                                           aria-checked={currentPage === pageNum}
//                                           aria-posinset={pageNum}
//                                           aria-setsize={totalPages}
//                                           tabIndex={0}
//                                           className="page-link"
//                                           onClick={() =>
//                                             setCurrentPage(pageNum)
//                                           }
//                                         >
//                                           {pageNum}
//                                         </button>
//                                       </li>
//                                     );
//                                   }
//                                 )}
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === totalPages ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to next page"
//                                     className="page-link"
//                                     onClick={() =>
//                                       setCurrentPage((prev) =>
//                                         Math.min(prev + 1, totalPages)
//                                       )
//                                     }
//                                     disabled={currentPage === totalPages}
//                                   >
//                                     ›
//                                   </button>
//                                 </li>
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === totalPages ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to last page"
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(totalPages)}
//                                     disabled={currentPage === totalPages}
//                                   >
//                                     »
//                                   </button>
//                                 </li>
//                               </ul>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Change Password History Tab */}
//                     <div
//                       role="tabpanel"
//                       aria-hidden={activeTab !== "password"}
//                       className={`tab-pane ${
//                         activeTab === "password" ? "active" : ""
//                       }`}
//                       id="password-tab"
//                       aria-labelledby="password-tab-button"
//                     >
//                       {" "}
//                       <form data-vv-scope="cpAccount" method="post">
//                         <div className="row">
//                           {/* Multiselect for User Selection */}
//                           <div className="form-group col-xl-3">
//                             <div
//                               className="form-group user-lock-search"
//                               style={{ position: "relative" }}
//                             >
//                               <div
//                                 tabIndex={-1}
//                                 role="combobox"
//                                 aria-owns="listbox-null"
//                                 className="multiselect"
//                               >
//                                 <div className="multiselect__select" />
//                                 <div className="multiselect__tags">
//                                   <div
//                                     className="multiselect__tags-wrap"
//                                     style={{ display: "none" }}
//                                   />
//                                   <div
//                                     className="multiselect__spinner"
//                                     style={{ display: "none" }}
//                                   />
//                                   <input
//                                     autoComplete="off"
//                                     spellCheck="false"
//                                     placeholder="Select user"
//                                     tabIndex={0}
//                                     aria-controls="listbox-null"
//                                     className="multiselect__input"
//                                     type="text"
//                                     value={selectedUser}
//                                     onChange={(e) =>
//                                       setSelectedUser(e.target.value)
//                                     }
//                                     style={{
//                                       width: "100%",
//                                       position: "unset",
//                                       padding: "0 12px",
//                                     }}
//                                   />
//                                   <span
//                                     className="multiselect__placeholder"
//                                     style={{
//                                       display: selectedUser ? "none" : "block",
//                                     }}
//                                   >
//                                     Select user
//                                   </span>
//                                 </div>
//                                 <div
//                                   tabIndex={-1}
//                                   className="multiselect__content-wrapper"
//                                   style={{ maxHeight: 300, display: "none" }}
//                                 >
//                                   <ul
//                                     role="listbox"
//                                     id="listbox-null"
//                                     className="multiselect__content"
//                                     style={{ display: "block" }}
//                                   >
//                                     <li style={{}}>
//                                       <span className="multiselect__option multiselBg">
//                                         List is empty.
//                                       </span>
//                                     </li>
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="form-group col-xl-3">
//                             <DateRange
//                               onDateRangeChange={handlePasswordDateRangeChange}
//                               value={passwordDateRange}
//                             />
//                           </div>{" "}
//                           <div className="form-group col-xl-4">
//                             <button
//                               type="button"
//                               className="btn btn-primary"
//                               onClick={handleLoadData}
//                               disabled={passwordLoading}
//                             >
//                               {passwordLoading ? "Loading..." : "Load"}
//                             </button>{" "}
//                             <button
//                               type="button"
//                               id="reset1"
//                               className="btn btn-light"
//                               onClick={handleReset}
//                             >
//                               Reset
//                             </button>{" "}
//                             <div
//                               id="export_1763983131806"
//                               className="d-inline-block disabled"
//                             >
//                               <button
//                                 type="button"
//                                 disabled="disabled"
//                                 className="btn btn-success disabled"
//                               >
//                                 <i className="fas fa-file-excel" />
//                               </button>
//                             </div>{" "}
//                             <button
//                               type="button"
//                               disabled="disabled"
//                               className="btn btn-danger disabled"
//                             >
//                               <i className="fas fa-file-pdf" />
//                             </button>
//                           </div>
//                         </div>
//                       </form>{" "}
//                       <div className="row">
//                         <div className="col-6">
//                           <div
//                             id="tickets-table_length"
//                             className="dataTables_length"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               Show&nbsp;
//                               <select
//                                 className="custom-select custom-select-sm"
//                                 value={entriesPerPage}
//                                 onChange={(e) => {
//                                   setEntriesPerPage(Number(e.target.value));
//                                   setCurrentPage(1);
//                                 }}
//                               >
//                                 <option value={25}>25</option>
//                                 <option value={50}>50</option>
//                                 <option value={75}>75</option>
//                                 <option value={100}>100</option>
//                                 <option value={125}>125</option>
//                                 <option value={150}>150</option>
//                               </select>
//                               &nbsp;entries
//                             </label>
//                           </div>
//                         </div>{" "}
//                         <div className="col-6 text-right">
//                           <div
//                             id="tickets-table_filter"
//                             className="dataTables_filter text-md-right"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               <input
//                                 type="search"
//                                 placeholder="Search..."
//                                 className="form-control form-control-sm ml-2 form-control"
//                                 value={searchValue}
//                                 onChange={(e) => setSearchValue(e.target.value)}
//                               />
//                             </label>
//                           </div>
//                         </div>
//                       </div>{" "}
//                       <div className="table-responsive mb-0">
//                         <div className="table no-footer table-hover table-responsive-sm">
//                           <table
//                             id="eventsListTbl"
//                             role="table"
//                             aria-busy="false"
//                             aria-colcount={4}
//                             className="table b-table"
//                           >
//                             <thead role="rowgroup" className="">
//                               <tr role="row" className="">
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   tabIndex={0}
//                                   aria-colindex={1}
//                                   aria-sort="none"
//                                   className="position-relative"
//                                 >
//                                   <div>Username</div>
//                                   <span className="sr-only">
//                                     {" "}
//                                     (Click to sort ascending)
//                                   </span>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={2}
//                                   className=""
//                                 >
//                                   <div>Date</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={3}
//                                   className=""
//                                 >
//                                   <div>IP</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={4}
//                                   className=""
//                                 >
//                                   <div>Detail</div>
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody role="rowgroup">
//                               {passwordLoading ? (
//                                 <tr>
//                                   <td colSpan={4} className="text-center">
//                                     <div
//                                       className="spinner-border"
//                                       role="status"
//                                     >
//                                       <span className="sr-only">
//                                         Loading...
//                                       </span>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ) : passwordHistoryData.length > 0 ? (
//                                 passwordHistoryData.map((item, index) => (
//                                   <tr key={index} role="row" className="">
//                                     <td
//                                       aria-colindex={1}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <p className="mb-0">
//                                         {selectedUser || "N/A"}{" "}
//                                         (undefined/undefined)
//                                       </p>
//                                     </td>
//                                     <td
//                                       aria-colindex={2}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <div>{item.loginDate || "N/A"}</div>
//                                     </td>
//                                     <td
//                                       aria-colindex={3}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.IpAddress || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={4}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <p
//                                         className="text-center pointer mb-0"
//                                         onClick={() => handleEyeClick(item)}
//                                         style={{ cursor: "pointer" }}
//                                       >
//                                         <i className="fas fa-eye" />
//                                       </p>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr role="row" className="b-table-empty-row">
//                                   <td colSpan={4} role="cell" className="">
//                                     <div role="alert" aria-live="polite">
//                                       <div className="text-center my-2">
//                                         There are no records to show
//                                       </div>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>{" "}
//                       <div className="row pt-3">
//                         <div className="col">
//                           <div className="dataTables_paginate paging_simple_numbers float-right">
//                             {/* Similar pagination as login tab */}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal Popup */}
//       {showModal && modalData && (
//         <div style={{ position: "absolute", zIndex: 1040 }}>
//           <div
//             role="dialog"
//             aria-describedby="modal-body"
//             className="modal fade show"
//             aria-modal="true"
//             style={{ display: "block" }}
//           >
//             <div className="modal-dialog modal-sm">
//               <span tabIndex={0} />
//               <div tabIndex={-1} className="modal-content">
//                 <header className="modal-header bg-success">
//                   <h5 className="modal-title text-uppercase text-white">
//                     IP Detail
//                   </h5>{" "}
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="close text-white"
//                   >
//                     ×
//                   </button>
//                 </header>
//                 <div id="modal-body" className="modal-body">
//                   {" "}
//                   <div className="table-responsive">
//                     <table
//                       role="table"
//                       className="table b-table table-striped table-hover table-bordered table-sm b-table-caption-top"
//                     >
//                       <thead role="rowgroup" className="thead-dark">
//                         <tr role="row" className="">
//                           <th role="columnheader" scope="col" className="">
//                             Key
//                           </th>{" "}
//                           <th role="columnheader" scope="col" className="">
//                             Value
//                           </th>
//                         </tr>
//                       </thead>{" "}
//                       <tbody role="rowgroup">
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>IP:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.ip}
//                           </td>
//                         </tr>{" "}
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>City:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.city}
//                           </td>
//                         </tr>{" "}
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>Country:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.country}
//                           </td>
//                         </tr>{" "}
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>Mobile:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.mobile}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               <span tabIndex={0} />
//             </div>
//           </div>
//           <div className="modal-backdrop show" onClick={closeModal} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Userhistory;

// import React, { useState, useEffect } from "react";
// import DateRange from "../../date/Daterange";
// import { useQuery } from "react-query";
// import { decodedTokenData } from "../../../Helper/auth";
// import { useCookies } from "react-cookie";
// import { getLoginReport } from "../../../Helper/users";
// import {
//   exportToExcel,
//   exportToPDF,
//   exportPasswordHistoryToExcel,
//   exportPasswordHistoryToPDF,
// } from "../../../Helper/excelHelper";
// const Userhistory = () => {
//   const [cookies] = useCookies(["Admin"]);
//   const { userId } = decodedTokenData(cookies) || {};

//   const [activeTab, setActiveTab] = useState("login");
//   const [loginDateRange, setLoginDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [passwordDateRange, setPasswordDateRange] = useState({
//     startDate: null,
//     endDate: null,
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState(null);
//   const [searchValue, setSearchValue] = useState("");
//   const [entriesPerPage, setEntriesPerPage] = useState(25);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedUser, setSelectedUser] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [usersList, setUsersList] = useState([]);

//   // Fetch login history data
//   const {
//     isLoading: loginLoading,
//     data: loginData,
//     refetch: refetchLogin,
//   } = useQuery(
//     ["loginHistory", { cookies, dateRange: loginDateRange, selectedUser }],
//     async () => {
//       try {
//         const response = await getLoginReport({
//           cookies,
//           startDate: loginDateRange.startDate,
//           endDate: loginDateRange.endDate,
//           loginId: selectedUser || null,
//         });
//         return response;
//       } catch (error) {
//         console.error("Error fetching login history:", error);
//         return { loginReports: [] };
//       }
//     },
//     {
//       enabled: false,
//       refetchOnWindowFocus: false,
//     }
//   );

//   // Fetch password change history data
//   const {
//     isLoading: passwordLoading,
//     data: passwordData,
//     refetch: refetchPassword,
//   } = useQuery(
//     [
//       "passwordHistory",
//       { cookies, dateRange: passwordDateRange, selectedUser },
//     ],
//     async () => {
//       try {
//         const response = await getLoginReport({
//           cookies,
//           startDate: passwordDateRange.startDate,
//           endDate: passwordDateRange.endDate,
//           loginId: selectedUser || null,
//         });
//         return response;
//       } catch (error) {
//         console.error("Error fetching password history:", error);
//         return { passwordReports: [] };
//       }
//     },
//     {
//       enabled: false,
//       refetchOnWindowFocus: false,
//     }
//   );

//   const handleLoginDateRangeChange = (range) => {
//     setLoginDateRange(range);
//     setCurrentPage(1);
//   };

//   const handlePasswordDateRangeChange = (range) => {
//     setPasswordDateRange(range);
//     setCurrentPage(1);
//   };

//   const handleLoadData = () => {
//     if (activeTab === "login") {
//       refetchLogin();
//     } else {
//       refetchPassword();
//     }
//   };

//   const handleReset = () => {
//     if (activeTab === "login") {
//       setLoginDateRange({ startDate: null, endDate: null });
//     } else {
//       setPasswordDateRange({ startDate: null, endDate: null });
//     }
//     setSelectedUser("");
//     setSearchValue("");
//     setCurrentPage(1);
//     setShowDropdown(false);
//   };

//   const handleEyeClick = (item) => {
//     const ipDetails = {
//       ip: item.IpAddress,
//       city: item.city || "N/A",
//       country: item.country || "N/A",
//       mobile: "False",
//     };

//     setModalData({
//       ip: ipDetails.ip,
//       city: ipDetails.city,
//       country: ipDetails.country,
//       mobile: ipDetails.mobile,
//       username: item.username || "N/A",
//       date: item.loginDate,
//     });
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setModalData(null);
//   };

//   // Handle Excel Export - FIXED VERSION
//   const handleExcelExport = () => {
//     try {
//       const currentData = getCurrentData();
//       if (!currentData || currentData.length === 0) {
//         alert("No data available to export");
//         return;
//       }

//       if (activeTab === "login") {
//         exportPasswordHistoryToExcel(currentData, "login-history");
//       } else {
//         exportPasswordHistoryToExcel(currentData, "password-history");
//       }
//     } catch (error) {
//       console.error("Export error:", error);
//       alert("Export failed: " + error.message);
//     }
//   };

//   // Handle PDF Export - FIXED VERSION
//   const handlePDFExport = async () => {
//     try {
//       const currentData = getCurrentData();
//       if (!currentData || currentData.length === 0) {
//         alert("No data available to export");
//         return;
//       }

//       if (activeTab === "login") {
//         await exportToPDF(currentData, "login-history");
//       } else {
//         await exportPasswordHistoryToPDF(currentData, "password-history");
//       }
//     } catch (error) {
//       console.error("Export error:", error);
//       alert("Export failed: " + error.message);
//     }
//   };

//   // Filter data based on search
//   const filterData = (data) => {
//     if (!data || !searchValue) return data;

//     return data.filter((item) =>
//       Object.values(item).some((value) =>
//         value?.toString().toLowerCase().includes(searchValue.toLowerCase())
//       )
//     );
//   };

//   // Paginate data
//   const paginateData = (data) => {
//     if (!data) return [];
//     const filteredData = filterData(data);
//     const startIndex = (currentPage - 1) * entriesPerPage;
//     const endIndex = startIndex + entriesPerPage;
//     return filteredData.slice(startIndex, endIndex);
//   };

//   // Get current tab data
//   const getCurrentData = () => {
//     if (activeTab === "login") {
//       return loginData?.loginReports || [];
//     } else {
//       return passwordData?.passwordReports || [];
//     }
//   };

//   const currentData = getCurrentData();
//   const filteredData = filterData(currentData);
//   const paginatedData = paginateData(currentData);
//   const totalPages = Math.ceil(filteredData.length / entriesPerPage);

//   // For password history tab
//   const passwordHistoryData = paginatedData;

//   // Sample users list
//   const sampleUsers = [
//     { id: 1, username: "user001" },
//     { id: 2, username: "user002" },
//     { id: 3, username: "admin001" },
//     { id: 4, username: "testuser" },
//   ];

//   const handleUserSelect = (user) => {
//     setSelectedUser(user.username);
//     setShowDropdown(false);
//   };

//   const handleUserInputChange = (e) => {
//     setSelectedUser(e.target.value);
//     setShowDropdown(true);
//   };

//   const filteredUsers = sampleUsers.filter((user) =>
//     user.username.toLowerCase().includes(selectedUser.toLowerCase())
//   );

//   return (
//     <div>
//       <div>
//         <div className="row">
//           <div className="col-12">
//             <div className="page-title-box d-flex align-items-center justify-content-between">
//               <h4 className="mb-0 font-size-18">User History</h4>{" "}
//               <div className="page-title-right">
//                 <ol className="breadcrumb m-0">
//                   <li className="breadcrumb-item">
//                     <a href="/admin/home" className="" target="_self">
//                       Home
//                     </a>
//                   </li>
//                   <li className="breadcrumb-item active">
//                     <span aria-current="location">User History</span>
//                   </li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>{" "}
//         <div className="row">
//           <div className="col-12">
//             <div className="card">
//               <div className="card-body">
//                 <div className="tabs">
//                   <div className="">
//                     <ul role="tablist" className="nav nav-tabs">
//                       <li role="presentation" className="nav-item">
//                         <button
//                           role="tab"
//                           aria-selected={activeTab === "login"}
//                           aria-setsize={2}
//                           aria-posinset={1}
//                           onClick={() => setActiveTab("login")}
//                           className={`nav-link ${
//                             activeTab === "login" ? "active tab-bg-primary" : ""
//                           }`}
//                           id="login-tab-button"
//                           aria-controls="login-tab"
//                         >
//                           <span>Login History</span>
//                         </button>
//                       </li>
//                       <li role="presentation" className="nav-item">
//                         <button
//                           role="tab"
//                           aria-selected={activeTab === "password"}
//                           aria-setsize={2}
//                           aria-posinset={2}
//                           onClick={() => setActiveTab("password")}
//                           className={`nav-link ${
//                             activeTab === "password"
//                               ? "active tab-bg-primary"
//                               : ""
//                           }`}
//                           id="password-tab-button"
//                           aria-controls="password-tab"
//                           tabIndex={-1}
//                         >
//                           <span>Change Password History</span>
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                   <div className="tab-content p-2 text-muted">
//                     {/* Login History Tab */}
//                     <div
//                       role="tabpanel"
//                       aria-hidden={activeTab !== "login"}
//                       className={`tab-pane ${
//                         activeTab === "login" ? "active" : ""
//                       }`}
//                       id="login-tab"
//                       aria-labelledby="login-tab-button"
//                     >
//                       {" "}
//                       <form data-vv-scope="InserUserAccount" method="post">
//                         <div className="row row5">
//                           {/* Multiselect for User Selection */}
//                           <div className="form-group col-xl-3">
//                             <div
//                               className="form-group user-lock-search"
//                               style={{ position: "relative" }}
//                             >
//                               <div
//                                 tabIndex={-1}
//                                 role="combobox"
//                                 aria-owns="listbox-null"
//                                 className="multiselect"
//                               >
//                                 <div
//                                   className="multiselect__select"
//                                   onClick={() => setShowDropdown(!showDropdown)}
//                                 />
//                                 <div className="multiselect__tags">
//                                   <div
//                                     className="multiselect__tags-wrap"
//                                     style={{ display: "none" }}
//                                   />
//                                   <div
//                                     className="multiselect__spinner"
//                                     style={{ display: "none" }}
//                                   />
//                                   <input
//                                     autoComplete="off"
//                                     spellCheck="false"
//                                     placeholder="Select user"
//                                     tabIndex={0}
//                                     aria-controls="listbox-null"
//                                     className="multiselect__input"
//                                     type="text"
//                                     value={selectedUser}
//                                     onChange={handleUserInputChange}
//                                     onFocus={() => setShowDropdown(true)}
//                                     style={{
//                                       width: "100%",
//                                       position: "unset",
//                                       padding: "0 12px",
//                                     }}
//                                   />
//                                   <span
//                                     className="multiselect__placeholder"
//                                     style={{
//                                       display: selectedUser ? "none" : "block",
//                                     }}
//                                   >
//                                     {/* Select user */}
//                                   </span>
//                                 </div>
//                                 <div
//                                   tabIndex={-1}
//                                   className="multiselect__content-wrapper"
//                                   style={{
//                                     maxHeight: 300,
//                                     display: showDropdown ? "block" : "none",
//                                     position: "absolute",
//                                     top: "100%",
//                                     left: 0,
//                                     right: 0,
//                                     zIndex: 1000,
//                                     backgroundColor: "white",
//                                     border: "1px solid #ccc",
//                                     borderRadius: "4px",
//                                   }}
//                                 >
//                                   <ul
//                                     role="listbox"
//                                     id="listbox-null"
//                                     className="multiselect__content"
//                                     style={{ display: "block" }}
//                                   >
//                                     {filteredUsers.length > 0 ? (
//                                       filteredUsers.map((user) => (
//                                         <li
//                                           key={user.id}
//                                           style={{
//                                             padding: "8px 12px",
//                                             cursor: "pointer",
//                                           }}
//                                           onClick={() => handleUserSelect(user)}
//                                           className="multiselect__option multiselBg"
//                                         >
//                                           {user.username}
//                                         </li>
//                                       ))
//                                     ) : (
//                                       <li style={{ padding: "8px 12px" }}>
//                                         <span className="multiselect__option multiselBg">
//                                           No users found
//                                         </span>
//                                       </li>
//                                     )}
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="form-group col-xl-3">
//                             <DateRange
//                               onDateRangeChange={handleLoginDateRangeChange}
//                               value={loginDateRange}
//                             />
//                           </div>{" "}
//                           <div className="form-group col-xl-6">
//                             <button
//                               type="button"
//                               className="btn btn-primary"
//                               onClick={handleLoadData}
//                               disabled={loginLoading}
//                             >
//                               {loginLoading ? "Loading..." : "Load"}
//                             </button>{" "}
//                             <button
//                               type="button"
//                               id="reset"
//                               className="btn btn-light"
//                               onClick={handleReset}
//                             >
//                               Reset
//                             </button>{" "}
//                             <div
//                               id="export_1763983131794"
//                               className="d-inline-block"
//                             >
//                               <button
//                                 type="button"
//                                 className="btn btn-success"
//                                 onClick={handleExcelExport}
//                                 disabled={
//                                   !currentData || currentData.length === 0
//                                 }
//                               >
//                                 <i className="fas fa-file-excel" />
//                               </button>
//                             </div>{" "}
//                             <button
//                               type="button"
//                               className="btn btn-danger"
//                               onClick={handlePDFExport}
//                               disabled={
//                                 !currentData || currentData.length === 0
//                               }
//                             >
//                               <i className="fas fa-file-pdf" />
//                             </button>
//                           </div>
//                         </div>
//                       </form>{" "}
//                       <div className="row">
//                         <div className="col-6">
//                           <div
//                             id="tickets-table_length"
//                             className="dataTables_length"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               Show&nbsp;
//                               <select
//                                 className="custom-select custom-select-sm"
//                                 value={entriesPerPage}
//                                 onChange={(e) => {
//                                   setEntriesPerPage(Number(e.target.value));
//                                   setCurrentPage(1);
//                                 }}
//                               >
//                                 <option value={25}>25</option>
//                                 <option value={50}>50</option>
//                                 <option value={75}>75</option>
//                                 <option value={100}>100</option>
//                                 <option value={125}>125</option>
//                                 <option value={150}>150</option>
//                               </select>
//                               &nbsp;entries
//                             </label>
//                           </div>
//                         </div>{" "}
//                         <div className="col-6 text-right">
//                           <div
//                             id="tickets-table_filter"
//                             className="dataTables_filter text-md-right"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               <input
//                                 type="search"
//                                 placeholder="Search..."
//                                 className="form-control form-control-sm ml-2 form-control"
//                                 value={searchValue}
//                                 onChange={(e) => setSearchValue(e.target.value)}
//                               />
//                             </label>
//                           </div>
//                         </div>
//                       </div>{" "}
//                       <div className="table-responsive mb-0">
//                         <div className="table no-footer table-hover table-responsive-sm">
//                           <table
//                             id="eventsListTbl"
//                             role="table"
//                             aria-busy="false"
//                             aria-colcount={6}
//                             className="table b-table"
//                           >
//                             <thead role="rowgroup" className="">
//                               <tr role="row" className="">
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   tabIndex={0}
//                                   aria-colindex={1}
//                                   aria-sort="none"
//                                   className="position-relative"
//                                 >
//                                   <div>Country</div>
//                                   <span className="sr-only">
//                                     {" "}
//                                     (Click to sort ascending)
//                                   </span>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={2}
//                                   className=""
//                                 >
//                                   <div>Region</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={3}
//                                   className=""
//                                 >
//                                   <div>ISP</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={4}
//                                   className=""
//                                 >
//                                   <div>IP Address</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={5}
//                                   className=""
//                                 >
//                                   <div>Login Time</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={6}
//                                   className=""
//                                 >
//                                   <div>Detail</div>
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody role="rowgroup">
//                               {loginLoading ? (
//                                 <tr>
//                                   <td colSpan={6} className="text-center">
//                                     <div
//                                       className="spinner-border"
//                                       role="status"
//                                     >
//                                       <span className="sr-only">
//                                         Loading...
//                                       </span>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ) : paginatedData.length > 0 ? (
//                                 paginatedData.map((item, index) => (
//                                   <tr key={index} role="row" className="">
//                                     <td
//                                       aria-colindex={1}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.country || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={2}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <div>{item.region || "N/A"}</div>
//                                     </td>
//                                     <td
//                                       aria-colindex={3}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.isp || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={4}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.IpAddress || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={5}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <div>{item.loginDate || "N/A"}</div>
//                                     </td>
//                                     <td
//                                       aria-colindex={6}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <p
//                                         className="text-center pointer mb-0"
//                                         onClick={() => handleEyeClick(item)}
//                                         style={{ cursor: "pointer" }}
//                                       >
//                                         <i className="fas fa-eye" />
//                                       </p>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr role="row" className="b-table-empty-row">
//                                   <td colSpan={6} role="cell" className="">
//                                     <div role="alert" aria-live="polite">
//                                       <div className="text-center my-2">
//                                         There are no records to show
//                                       </div>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>{" "}
//                       <div className="row pt-3">
//                         <div className="col">
//                           <div className="dataTables_paginate paging_simple_numbers float-right">
//                             <ul className="pagination pagination-rounded mb-0">
//                               <ul
//                                 role="menubar"
//                                 aria-disabled="false"
//                                 aria-label="Pagination"
//                                 className="pagination dataTables_paginate paging_simple_numbers my-0 b-pagination justify-content-end"
//                               >
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === 1 ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to first page"
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(1)}
//                                     disabled={currentPage === 1}
//                                   >
//                                     «
//                                   </button>
//                                 </li>
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === 1 ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to previous page"
//                                     className="page-link"
//                                     onClick={() =>
//                                       setCurrentPage((prev) =>
//                                         Math.max(prev - 1, 1)
//                                       )
//                                     }
//                                     disabled={currentPage === 1}
//                                   >
//                                     ‹
//                                   </button>
//                                 </li>
//                                 {Array.from(
//                                   { length: Math.min(5, totalPages) },
//                                   (_, i) => {
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                       pageNum = i + 1;
//                                     } else if (currentPage <= 3) {
//                                       pageNum = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                       pageNum = totalPages - 4 + i;
//                                     } else {
//                                       pageNum = currentPage - 2 + i;
//                                     }

//                                     return (
//                                       <li
//                                         key={pageNum}
//                                         role="presentation"
//                                         className={`page-item ${
//                                           currentPage === pageNum
//                                             ? "active"
//                                             : ""
//                                         }`}
//                                       >
//                                         <button
//                                           role="menuitemradio"
//                                           type="button"
//                                           aria-label={`Go to page ${pageNum}`}
//                                           aria-checked={currentPage === pageNum}
//                                           aria-posinset={pageNum}
//                                           aria-setsize={totalPages}
//                                           tabIndex={0}
//                                           className="page-link"
//                                           onClick={() =>
//                                             setCurrentPage(pageNum)
//                                           }
//                                         >
//                                           {pageNum}
//                                         </button>
//                                       </li>
//                                     );
//                                   }
//                                 )}
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === totalPages ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to next page"
//                                     className="page-link"
//                                     onClick={() =>
//                                       setCurrentPage((prev) =>
//                                         Math.min(prev + 1, totalPages)
//                                       )
//                                     }
//                                     disabled={currentPage === totalPages}
//                                   >
//                                     ›
//                                   </button>
//                                 </li>
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === totalPages ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to last page"
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(totalPages)}
//                                     disabled={currentPage === totalPages}
//                                   >
//                                     »
//                                   </button>
//                                 </li>
//                               </ul>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Change Password History Tab */}
//                     <div
//                       role="tabpanel"
//                       aria-hidden={activeTab !== "password"}
//                       className={`tab-pane ${
//                         activeTab === "password" ? "active" : ""
//                       }`}
//                       id="password-tab"
//                       aria-labelledby="password-tab-button"
//                     >
//                       {" "}
//                       <form data-vv-scope="cpAccount" method="post">
//                         <div className="row">
//                           {/* Multiselect for User Selection */}
//                           <div className="form-group col-xl-3">
//                             <div
//                               className="form-group user-lock-search"
//                               style={{ position: "relative" }}
//                             >
//                               <div
//                                 tabIndex={-1}
//                                 role="combobox"
//                                 aria-owns="listbox-null"
//                                 className="multiselect"
//                               >
//                                 <div
//                                   className="multiselect__select"
//                                   onClick={() => setShowDropdown(!showDropdown)}
//                                 />
//                                 <div className="multiselect__tags">
//                                   <div
//                                     className="multiselect__tags-wrap"
//                                     style={{ display: "none" }}
//                                   />
//                                   <div
//                                     className="multiselect__spinner"
//                                     style={{ display: "none" }}
//                                   />
//                                   <input
//                                     autoComplete="off"
//                                     spellCheck="false"
//                                     placeholder="Select user"
//                                     tabIndex={0}
//                                     aria-controls="listbox-null"
//                                     className="multiselect__input"
//                                     type="text"
//                                     value={selectedUser}
//                                     onChange={handleUserInputChange}
//                                     onFocus={() => setShowDropdown(true)}
//                                     style={{
//                                       width: "100%",
//                                       position: "unset",
//                                       padding: "0 12px",
//                                     }}
//                                   />
//                                   <span
//                                     className="multiselect__placeholder"
//                                     style={{
//                                       display: selectedUser ? "none" : "block",
//                                     }}
//                                   >
//                                     {/* Select user */}
//                                   </span>
//                                 </div>
//                                 <div
//                                   tabIndex={-1}
//                                   className="multiselect__content-wrapper"
//                                   style={{
//                                     maxHeight: 300,
//                                     display: showDropdown ? "block" : "none",
//                                     position: "absolute",
//                                     top: "100%",
//                                     left: 0,
//                                     right: 0,
//                                     zIndex: 1000,
//                                     backgroundColor: "white",
//                                     border: "1px solid #ccc",
//                                     borderRadius: "4px",
//                                   }}
//                                 >
//                                   <ul
//                                     role="listbox"
//                                     id="listbox-null"
//                                     className="multiselect__content"
//                                     style={{ display: "block" }}
//                                   >
//                                     {filteredUsers.length > 0 ? (
//                                       filteredUsers.map((user) => (
//                                         <li
//                                           key={user.id}
//                                           style={{
//                                             padding: "8px 12px",
//                                             cursor: "pointer",
//                                           }}
//                                           onClick={() => handleUserSelect(user)}
//                                           className="multiselect__option multiselBg"
//                                         >
//                                           {user.username}
//                                         </li>
//                                       ))
//                                     ) : (
//                                       <li style={{ padding: "8px 12px" }}>
//                                         <span className="multiselect__option multiselBg">
//                                           No users found
//                                         </span>
//                                       </li>
//                                     )}
//                                   </ul>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                           <div className="form-group col-xl-3">
//                             <DateRange
//                               onDateRangeChange={handlePasswordDateRangeChange}
//                               value={passwordDateRange}
//                             />
//                           </div>{" "}
//                           <div className="form-group col-xl-4">
//                             <button
//                               type="button"
//                               className="btn btn-primary"
//                               onClick={handleLoadData}
//                               disabled={passwordLoading}
//                             >
//                               {passwordLoading ? "Loading..." : "Load"}
//                             </button>{" "}
//                             <button
//                               type="button"
//                               id="reset1"
//                               className="btn btn-light"
//                               onClick={handleReset}
//                             >
//                               Reset
//                             </button>{" "}
//                             <div
//                               id="export_1763983131806"
//                               className="d-inline-block"
//                             >
//                               <button
//                                 type="button"
//                                 className="btn btn-success"
//                                 onClick={handleExcelExport}
//                                 disabled={
//                                   !currentData || currentData.length === 0
//                                 }
//                               >
//                                 <i className="fas fa-file-excel" />
//                               </button>
//                             </div>{" "}
//                             <button
//                               type="button"
//                               className="btn btn-danger"
//                               onClick={handlePDFExport}
//                               disabled={
//                                 !currentData || currentData.length === 0
//                               }
//                             >
//                               <i className="fas fa-file-pdf" />
//                             </button>
//                           </div>
//                         </div>
//                       </form>{" "}
//                       <div className="row">
//                         <div className="col-6">
//                           <div
//                             id="tickets-table_length"
//                             className="dataTables_length"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               Show&nbsp;
//                               <select
//                                 className="custom-select custom-select-sm"
//                                 value={entriesPerPage}
//                                 onChange={(e) => {
//                                   setEntriesPerPage(Number(e.target.value));
//                                   setCurrentPage(1);
//                                 }}
//                               >
//                                 <option value={25}>25</option>
//                                 <option value={50}>50</option>
//                                 <option value={75}>75</option>
//                                 <option value={100}>100</option>
//                                 <option value={125}>125</option>
//                                 <option value={150}>150</option>
//                               </select>
//                               &nbsp;entries
//                             </label>
//                           </div>
//                         </div>{" "}
//                         <div className="col-6 text-right">
//                           <div
//                             id="tickets-table_filter"
//                             className="dataTables_filter text-md-right"
//                           >
//                             <label className="d-inline-flex align-items-center">
//                               <input
//                                 type="search"
//                                 placeholder="Search..."
//                                 className="form-control form-control-sm ml-2 form-control"
//                                 value={searchValue}
//                                 onChange={(e) => setSearchValue(e.target.value)}
//                               />
//                             </label>
//                           </div>
//                         </div>
//                       </div>{" "}
//                       <div className="table-responsive mb-0">
//                         <div className="table no-footer table-hover table-responsive-sm">
//                           <table
//                             id="eventsListTbl"
//                             role="table"
//                             aria-busy="false"
//                             aria-colcount={4}
//                             className="table b-table"
//                           >
//                             <thead role="rowgroup" className="">
//                               <tr role="row" className="">
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   tabIndex={0}
//                                   aria-colindex={1}
//                                   aria-sort="none"
//                                   className="position-relative"
//                                 >
//                                   <div>Username</div>
//                                   <span className="sr-only">
//                                     {" "}
//                                     (Click to sort ascending)
//                                   </span>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={2}
//                                   className=""
//                                 >
//                                   <div>Date</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={3}
//                                   className=""
//                                 >
//                                   <div>IP</div>
//                                 </th>
//                                 <th
//                                   role="columnheader"
//                                   scope="col"
//                                   aria-colindex={4}
//                                   className=""
//                                 >
//                                   <div>Detail</div>
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody role="rowgroup">
//                               {passwordLoading ? (
//                                 <tr>
//                                   <td colSpan={4} className="text-center">
//                                     <div
//                                       className="spinner-border"
//                                       role="status"
//                                     >
//                                       <span className="sr-only">
//                                         Loading...
//                                       </span>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               ) : passwordHistoryData.length > 0 ? (
//                                 passwordHistoryData.map((item, index) => (
//                                   <tr key={index} role="row" className="">
//                                     <td
//                                       aria-colindex={1}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <p className="mb-0">
//                                         {selectedUser || "N/A"}
//                                       </p>
//                                     </td>
//                                     <td
//                                       aria-colindex={2}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <div>{item.loginDate || "N/A"}</div>
//                                     </td>
//                                     <td
//                                       aria-colindex={3}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       {item.IpAddress || "N/A"}
//                                     </td>
//                                     <td
//                                       aria-colindex={4}
//                                       role="cell"
//                                       className=""
//                                     >
//                                       <p
//                                         className="text-center pointer mb-0"
//                                         onClick={() => handleEyeClick(item)}
//                                         style={{ cursor: "pointer" }}
//                                       >
//                                         <i className="fas fa-eye" />
//                                       </p>
//                                     </td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr role="row" className="b-table-empty-row">
//                                   <td colSpan={4} role="cell" className="">
//                                     <div role="alert" aria-live="polite">
//                                       <div className="text-center my-2">
//                                         There are no records to show
//                                       </div>
//                                     </div>
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>{" "}
//                       <div className="row pt-3">
//                         <div className="col">
//                           <div className="dataTables_paginate paging_simple_numbers float-right">
//                             {/* Similar pagination as login tab */}
//                             <ul className="pagination pagination-rounded mb-0">
//                               <ul
//                                 role="menubar"
//                                 aria-disabled="false"
//                                 aria-label="Pagination"
//                                 className="pagination dataTables_paginate paging_simple_numbers my-0 b-pagination justify-content-end"
//                               >
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === 1 ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to first page"
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(1)}
//                                     disabled={currentPage === 1}
//                                   >
//                                     «
//                                   </button>
//                                 </li>
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === 1 ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to previous page"
//                                     className="page-link"
//                                     onClick={() =>
//                                       setCurrentPage((prev) =>
//                                         Math.max(prev - 1, 1)
//                                       )
//                                     }
//                                     disabled={currentPage === 1}
//                                   >
//                                     ‹
//                                   </button>
//                                 </li>
//                                 {Array.from(
//                                   { length: Math.min(5, totalPages) },
//                                   (_, i) => {
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                       pageNum = i + 1;
//                                     } else if (currentPage <= 3) {
//                                       pageNum = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                       pageNum = totalPages - 4 + i;
//                                     } else {
//                                       pageNum = currentPage - 2 + i;
//                                     }

//                                     return (
//                                       <li
//                                         key={pageNum}
//                                         role="presentation"
//                                         className={`page-item ${
//                                           currentPage === pageNum
//                                             ? "active"
//                                             : ""
//                                         }`}
//                                       >
//                                         <button
//                                           role="menuitemradio"
//                                           type="button"
//                                           aria-label={`Go to page ${pageNum}`}
//                                           aria-checked={currentPage === pageNum}
//                                           aria-posinset={pageNum}
//                                           aria-setsize={totalPages}
//                                           tabIndex={0}
//                                           className="page-link"
//                                           onClick={() =>
//                                             setCurrentPage(pageNum)
//                                           }
//                                         >
//                                           {pageNum}
//                                         </button>
//                                       </li>
//                                     );
//                                   }
//                                 )}
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === totalPages ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to next page"
//                                     className="page-link"
//                                     onClick={() =>
//                                       setCurrentPage((prev) =>
//                                         Math.min(prev + 1, totalPages)
//                                       )
//                                     }
//                                     disabled={currentPage === totalPages}
//                                   >
//                                     ›
//                                   </button>
//                                 </li>
//                                 <li
//                                   role="presentation"
//                                   className={`page-item ${
//                                     currentPage === totalPages ? "disabled" : ""
//                                   }`}
//                                 >
//                                   <button
//                                     role="menuitem"
//                                     aria-label="Go to last page"
//                                     className="page-link"
//                                     onClick={() => setCurrentPage(totalPages)}
//                                     disabled={currentPage === totalPages}
//                                   >
//                                     »
//                                   </button>
//                                 </li>
//                               </ul>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal Popup */}
//       {showModal && modalData && (
//         <div style={{ position: "absolute", zIndex: 1040 }}>
//           <div
//             role="dialog"
//             aria-describedby="modal-body"
//             className="modal fade show"
//             aria-modal="true"
//             style={{ display: "block" }}
//           >
//             <div className="modal-dialog modal-sm">
//               <span tabIndex={0} />
//               <div tabIndex={-1} className="modal-content">
//                 <header className="modal-header bg-success">
//                   <h5 className="modal-title text-uppercase text-white">
//                     IP Detail
//                   </h5>{" "}
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="close text-white"
//                   >
//                     ×
//                   </button>
//                 </header>
//                 <div id="modal-body" className="modal-body">
//                   {" "}
//                   <div className="table-responsive">
//                     <table
//                       role="table"
//                       className="table b-table table-striped table-hover table-bordered table-sm b-table-caption-top"
//                     >
//                       <thead role="rowgroup" className="thead-dark">
//                         <tr role="row" className="">
//                           <th role="columnheader" scope="col" className="">
//                             Key
//                           </th>{" "}
//                           <th role="columnheader" scope="col" className="">
//                             Value
//                           </th>
//                         </tr>
//                       </thead>{" "}
//                       <tbody role="rowgroup">
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>IP:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.ip}
//                           </td>
//                         </tr>{" "}
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>City:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.city}
//                           </td>
//                         </tr>{" "}
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>Country:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.country}
//                           </td>
//                         </tr>{" "}
//                         <tr role="row" className="">
//                           <td role="cell" className="">
//                             <b>Mobile:</b>
//                           </td>{" "}
//                           <td role="cell" className="">
//                             {modalData.mobile}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//               <span tabIndex={0} />
//             </div>
//           </div>
//           <div className="modal-backdrop show" onClick={closeModal} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Userhistory;
