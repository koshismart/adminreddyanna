import React, { useState } from "react";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import {
  getClientCurrentBets,
  getClientCurrentCasinoBets,
} from "../../../Helper/bets";
import { decodedTokenData } from "../../../Helper/auth";
import moment from "moment";

const CurrentBets = () => {
  const [cookies] = useCookies(["Admin"]);
  const { usertype, uniqueId, userId } = useParams();

  // Priority order for user ID - URL params first
  const targetUserId = uniqueId || userId;
  const currentUserData = decodedTokenData(cookies) || {};
  const currentUserId = currentUserData.userId || currentUserData._id;

  // Final user ID for API - URL parameter has priority
  const apiUserId = targetUserId || currentUserId;

  console.log("=== DEBUG INFO ===");
  console.log("URL Params:", { usertype, uniqueId, userId });
  console.log("Target User ID (from URL):", targetUserId);
  console.log("Current User ID (from cookies):", currentUserId);
  console.log("API User ID (will be used):", apiUserId);

  const [activeTab, setActiveTab] = useState("sports");
  const [betStatus, setBetStatus] = useState("matchbet"); 
  const [betType, setBetType] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch sports bets data
  const {
    isLoading: sportsLoading,
    data: sportsData,
    refetch: refetchSports,
  } = useQuery(
    ["sportsCurrentBets", { apiUserId, betStatus, betType, searchValue }],
    async () => {
      if (!apiUserId) {
        console.warn("No user ID available");
        return { currentBets: [] };
      }

      const response = await getClientCurrentBets({
        cookies,
        userId: apiUserId,
      });

      console.log("Sports Bets Response:", response);
      return response;
    },
    {
      enabled: activeTab === "sports" && !!apiUserId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Error fetching sports bets:", error);
      },
    }
  );

  // Fetch casino bets data
  const {
    isLoading: casinoLoading,
    data: casinoData,
    refetch: refetchCasino,
  } = useQuery(
    ["casinoCurrentBets", { apiUserId, betStatus, betType, searchValue }],
    async () => {
      if (!apiUserId) {
        console.warn("No user ID available");
        return { currentCasinoBets: [] };
      }

      const response = await getClientCurrentCasinoBets({
        cookies,
        userId: apiUserId,
      });

      console.log("Casino Bets Response:", response);
      return response;
    },
    {
      enabled: activeTab === "casino" && !!apiUserId,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error("Error fetching casino bets:", error);
      },
    }
  );

  // Process sports data
  const sportsBets = sportsData?.currentBets || [];
  const casinoBets = casinoData?.currentCasinoBets || [];

  // Filter data based on search
  const filterData = (data) => {
    if (!searchValue) return data;

    const searchLower = searchValue.toLowerCase();
    return data.filter((bet) => {
      return (
        (bet?.currentBet?.eventName &&
          bet.currentBet.eventName.toLowerCase().includes(searchLower)) ||
        (bet?.currentBet?.betName &&
          bet.currentBet.betName.toLowerCase().includes(searchLower)) ||
        (bet?.currentBet?.sportType &&
          bet.currentBet.sportType.toLowerCase().includes(searchLower)) ||
        (bet?.userName && bet.userName.toLowerCase().includes(searchLower)) ||
        (bet?.currentBet?.marketName &&
          bet.currentBet.marketName.toLowerCase().includes(searchLower)) ||
        (bet?.currentBet?.runnerName &&
          bet.currentBet.runnerName.toLowerCase().includes(searchLower)) ||
        (bet?.currentBet?.nation &&
          bet.currentBet.nation.toLowerCase().includes(searchLower))
      );
    });
  };

  // Apply bet type filter
  const filterByBetType = (data) => {
    if (betType === "all") return data;
    return data.filter((bet) => {
      const oddType = bet?.currentBet?.oddType?.toLowerCase();
      return oddType && oddType.includes(betType.toLowerCase());
    });
  };

  // Apply bet status filter
  const filterByBetStatus = (data) => {
    if (betStatus === "matchbet") {
      return data.filter((bet) => !bet?.isDeleted);
    } else if (betStatus === "deletebet") {
      return data.filter((bet) => bet?.isDeleted);
    }
    return data;
  };

  // Get filtered data based on active tab
  const getFilteredData = () => {
    let data = activeTab === "sports" ? sportsBets : casinoBets;
    data = filterData(data);
    data = filterByBetType(data);
    data = filterByBetStatus(data);
    return data;
  };

  const filteredData = getFilteredData();

  // Pagination
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + entriesPerPage
  );

  // Calculate totals
  const totalStake = filteredData.reduce(
    (total, bet) => total + (Number(bet?.currentBet?.stake) || 0),
    0
  );

  // Refresh data
  const handleRefresh = () => {
    if (activeTab === "sports") {
      refetchSports();
    } else {
      refetchCasino();
    }
    setCurrentPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  // Handle reset
  const handleReset = () => {
    setSearchValue("");
    setCurrentPage(1);
  };

  // Handle delete bet
  const handleDeleteBet = (betId, betType) => {
    if (
      window.confirm(`Are you sure you want to delete this ${betType} bet?`)
    ) {
      console.log("Delete bet:", betId);
      alert(`Bet deleted successfully!`);
      handleRefresh();
    }
  };

  // Handle view bet details
  const handleViewBet = (bet) => {
    console.log("View bet details:", bet);
    alert(
      `Viewing bet details:\nEvent: ${bet?.currentBet?.eventName}\nUser: ${bet?.userName}\nAmount: ₹${bet?.currentBet?.stake}`
    );
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const isLoading = activeTab === "sports" ? sportsLoading : casinoLoading;

  return (
    <div>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0 font-size-18">Current Bets</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/admin/home" className="" target="_self">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item active">
                  <span aria-current="location">Current Bets</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* User Info Display */}
      {(usertype || uniqueId || userId) && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-info py-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>User Info:</strong>
                  {usertype && <span className="ml-2">Type: {usertype}</span>}
                  {uniqueId && <span className="ml-2">ID: {uniqueId}</span>}
                  {userId && <span className="ml-2">Login: {userId}</span>}
                </div>
                <small>Showing bets for: {apiUserId}</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="casino-report-tabs">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              onClick={() => {
                setActiveTab("sports");
                setCurrentPage(1);
                setSearchValue("");
              }}
              className={`nav-link ${activeTab === "sports" ? "active" : ""}`}
            >
              Sports
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => {
                setActiveTab("casino");
                setCurrentPage(1);
                setSearchValue("");
              }}
              className={`nav-link ${activeTab === "casino" ? "active" : ""}`}
            >
              Casino
            </button>
          </li>
        </ul>
      </div>

      {/* Sports Tab Content */}
      {activeTab === "sports" && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="report-form mb-3 row align-items-center">
                  <div className="col-md-4 col-lg-3">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="customRadio"
                        name="betStatus"
                        value="matchbet"
                        checked={betStatus === "matchbet"}
                        onChange={(e) => setBetStatus(e.target.value)}
                        className="custom-control-input"
                      />
                      <label
                        htmlFor="customRadio"
                        className="custom-control-label"
                      >
                        Matched
                      </label>
                    </div>
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="customRadio2"
                        name="betStatus"
                        value="deletebet"
                        checked={betStatus === "deletebet"}
                        onChange={(e) => setBetStatus(e.target.value)}
                        className="custom-control-input"
                      />
                      <label
                        htmlFor="customRadio2"
                        className="custom-control-label"
                      >
                        Deleted
                      </label>
                    </div>
                  </div>
                  <div className="col-md-8 col-lg-4">
                    <div className="custom-control custom-radio custom-control-inline pl-0">
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="soda-all"
                          name="betType"
                          value="all"
                          checked={betType === "all"}
                          onChange={(e) => setBetType(e.target.value)}
                          className="custom-control-input"
                        />
                        <label
                          htmlFor="soda-all"
                          className="custom-control-label"
                        >
                          All
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="soda-back"
                          name="betType"
                          value="back"
                          checked={betType === "back"}
                          onChange={(e) => setBetType(e.target.value)}
                          className="custom-control-input"
                        />
                        <label
                          htmlFor="soda-back"
                          className="custom-control-label"
                        >
                          Back
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="soda-lay"
                          name="betType"
                          value="lay"
                          checked={betType === "lay"}
                          onChange={(e) => setBetType(e.target.value)}
                          className="custom-control-input"
                        />
                        <label
                          htmlFor="soda-lay"
                          className="custom-control-label"
                        >
                          Lay
                        </label>
                      </div>
                    </div>
                    <div className="custom-control-inline">
                      <button
                        title="Refresh Data"
                        type="button"
                        className="btn mr-2 btn-primary"
                        onClick={handleRefresh}
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Load"}
                      </button>
                      <div className="d-inline-block">
                        <button
                          type="button"
                          disabled={filteredData.length === 0}
                          className="btn mr-1 btn-success"
                        >
                          <i className="fas fa-file-excel" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={filteredData.length === 0}
                        className="btn btn-danger"
                      >
                        <i className="fas fa-file-pdf" />
                      </button>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-5 text-right">
                    <div className="custom-control-inline mr-0 mt-1">
                      <h5 className="mb-0">
                        Total Bets:{" "}
                        <span className="mr-2 badge badge-primary">
                          {filteredData.length}
                        </span>
                        Total Amount:{" "}
                        <span className="badge badge-success">
                          ₹{totalStake.toFixed(2)}
                        </span>
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Search and Entries */}
                <div className="row w-100 mb-3">
                  <div className="col-6">
                    <div className="dataTables_length">
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
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        &nbsp;entries
                      </label>
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="dataTables_filter text-md-right">
                      <div className="d-inline-flex align-items-center">
                        <input
                          type="search"
                          placeholder="Search..."
                          className="form-control form-control-sm"
                          value={searchValue}
                          onChange={handleSearchChange}
                          style={{ width: "200px" }}
                        />
                        {searchValue && (
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary ml-2"
                            onClick={handleReset}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sports Table */}
                <div className="table-responsive mb-0">
                  <div className="table no-footer table-responsive-sm">
                    <table
                      id="eventsListTbl"
                      role="table"
                      aria-busy="false"
                      className="table b-table table-bordered"
                    >
                      <thead role="rowgroup" className="">
                        <tr role="row" className="">
                          <th role="columnheader" scope="col">
                            <div>Event Type</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Event Name</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>User Name</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>M Name</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Nation</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            className="text-right"
                          >
                            <div>U Rate</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            className="text-right"
                          >
                            <div>Amount</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Place Date</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>IP</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Browser</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Action</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {isLoading ? (
                          <tr>
                            <td colSpan={11} className="text-center py-4">
                              <div className="text-center my-2">
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                Loading...
                              </div>
                            </td>
                          </tr>
                        ) : paginatedData.length > 0 ? (
                          paginatedData.map((bet, index) => (
                            <tr
                              key={bet?.id || index}
                              className={bet?.isDeleted ? "table-danger" : ""}
                            >
                              <td className="text-right">
                                <span className="badge badge-info">
                                  {bet?.currentBet?.sportType || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                <div className="font-weight-bold">
                                  {bet?.currentBet?.eventName || "N/A"}
                                </div>
                              </td>
                              <td className="text-right">
                                <div>
                                  <strong>{bet?.userName || "N/A"}</strong>
                                  {bet?.userId && (
                                    <div className="small text-muted">
                                      ID: {bet.userId}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="text-right">
                                <div>
                                  <span className="badge badge-light">
                                    {bet?.currentBet?.betName || "N/A"}
                                  </span>
                                </div>
                              </td>
                              <td className="text-right">
                                <span className="badge badge-secondary">
                                  {bet?.currentBet?.nation || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                <span
                                  className={`badge ${
                                    bet?.currentBet?.oddType === "back"
                                      ? "badge-success"
                                      : "badge-warning"
                                  }`}
                                >
                                  {bet?.currentBet?.matchOdd || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                <strong className="text-primary">
                                  ₹
                                  {bet?.currentBet?.stake != null
                                    ? Number(bet.currentBet.stake).toFixed(2)
                                    : "0.00"}
                                </strong>
                              </td>
                              <td className="text-right">
                                {bet?.createdAt
                                  ? moment(bet.createdAt).format(
                                      "YYYY-MM-DD hh:mm A"
                                    )
                                  : "N/A"}
                              </td>
                              <td className="text-right">
                                <code className="small">
                                  {bet?.ipAddress || "N/A"}
                                </code>
                              </td>
                              <td className="text-right">
                                <span className="small">
                                  {bet?.userAgent || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                {betStatus === "matchbet" ? (
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-sm btn-info mr-1"
                                      onClick={() => handleViewBet(bet)}
                                      title="View Details"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    {!bet?.isDeleted && (
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleDeleteBet(bet?.id, "sports")
                                        }
                                        title="Delete Bet"
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      handleDeleteBet(bet?.id, "sports")
                                    }
                                  >
                                    <i className="fas fa-trash"></i> Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr role="row" className="b-table-empty-row">
                            <td colSpan={11} role="cell" className="">
                              <div role="alert" aria-live="polite">
                                <div className="text-center my-4">
                                  <h5>No records found</h5>
                                  <p className="text-muted">
                                    {searchValue
                                      ? "No bets match your search criteria"
                                      : "There are no current bets to display"}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                  <div className="row pt-3">
                    <div className="col">
                      <div className="dataTables_paginate paging_simple_numbers float-right">
                        <ul className="pagination pagination-rounded mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              «
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              ‹
                            </button>
                          </li>

                          {getPaginationNumbers().map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              } ${page === "..." ? "disabled" : ""}`}
                            >
                              {page === "..." ? (
                                <span className="page-link">...</span>
                              ) : (
                                <button
                                  className="page-link"
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              ›
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
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
      )}

      {/* Casino Tab Content */}
      {activeTab === "casino" && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="report-form mb-3 row align-items-center">
                  <div className="col-md-4 col-lg-3">
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="casino-matched"
                        name="casinoBetStatus"
                        value="matchbet"
                        checked={betStatus === "matchbet"}
                        onChange={(e) => setBetStatus(e.target.value)}
                        className="custom-control-input"
                      />
                      <label
                        htmlFor="casino-matched"
                        className="custom-control-label"
                      >
                        Matched
                      </label>
                    </div>
                    <div className="custom-control custom-radio custom-control-inline">
                      <input
                        type="radio"
                        id="casino-deleted"
                        name="casinoBetStatus"
                        value="deletebet"
                        checked={betStatus === "deletebet"}
                        onChange={(e) => setBetStatus(e.target.value)}
                        className="custom-control-input"
                      />
                      <label
                        htmlFor="casino-deleted"
                        className="custom-control-label"
                      >
                        Deleted
                      </label>
                    </div>
                  </div>
                  <div className="col-md-8 col-lg-4">
                    <div className="custom-control custom-radio custom-control-inline pl-0">
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="soda-all-casino"
                          name="betTypeCasino"
                          value="all"
                          checked={betType === "all"}
                          onChange={(e) => setBetType(e.target.value)}
                          className="custom-control-input"
                        />
                        <label
                          htmlFor="soda-all-casino"
                          className="custom-control-label"
                        >
                          All
                        </label>
                      </div>
                    </div>
                    <div className="custom-control-inline">
                      <button
                        title="Refresh Data"
                        type="button"
                        className="btn mr-2 btn-primary"
                        onClick={handleRefresh}
                        disabled={isLoading}
                      >
                        {isLoading ? "Loading..." : "Load"}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-5 text-right">
                    <div className="custom-control-inline mr-0 mt-1">
                      <h5 className="mb-0">
                        Total Casino Bets:{" "}
                        <span className="mr-2 badge badge-primary">
                          {filteredData.length}
                        </span>
                        Total Amount:{" "}
                        <span className="badge badge-success">
                          ₹{totalStake.toFixed(2)}
                        </span>
                      </h5>
                    </div>
                  </div>
                </div>

                {/* Search and Entries for Casino */}
                <div className="row w-100 mb-3">
                  <div className="col-6">
                    <div className="dataTables_length">
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
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        &nbsp;entries
                      </label>
                    </div>
                  </div>
                  <div className="col-6 text-right">
                    <div className="dataTables_filter text-md-right">
                      <div className="d-inline-flex align-items-center">
                        <input
                          type="search"
                          placeholder="Search..."
                          className="form-control form-control-sm"
                          value={searchValue}
                          onChange={handleSearchChange}
                          style={{ width: "200px" }}
                        />
                        {searchValue && (
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary ml-2"
                            onClick={handleReset}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Casino Table */}
                <div className="table-responsive mb-0">
                  <div className="table no-footer table-responsive-sm">
                    <table
                      id="casinoEventsListTbl"
                      role="table"
                      aria-busy="false"
                      className="table b-table table-bordered"
                    >
                      <thead role="rowgroup" className="">
                        <tr role="row" className="">
                          <th role="columnheader" scope="col">
                            <div>Event Name</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>User Name</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Nation</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            className="text-right"
                          >
                            <div>U Rate</div>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            className="text-right"
                          >
                            <div>Amount</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Place Date</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>IP</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Browser</div>
                          </th>
                          <th role="columnheader" scope="col">
                            <div>Action</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {isLoading ? (
                          <tr>
                            <td colSpan={9} className="text-center py-4">
                              <div className="text-center my-2">
                                <span className="spinner-border spinner-border-sm mr-2"></span>
                                Loading...
                              </div>
                            </td>
                          </tr>
                        ) : paginatedData.length > 0 ? (
                          paginatedData.map((bet, index) => (
                            <tr
                              key={bet?.id || index}
                              className={bet?.isDeleted ? "table-danger" : ""}
                            >
                              <td className="text-right">
                                <div className="font-weight-bold">
                                  {bet?.currentBet?.eventName || "N/A"}
                                </div>
                                {bet?.currentBet?.gameType && (
                                  <div className="small text-muted">
                                    {bet.currentBet.gameType}
                                  </div>
                                )}
                              </td>
                              <td className="text-right">
                                <div>
                                  <strong>{bet?.userName || "N/A"}</strong>
                                  {bet?.userId && (
                                    <div className="small text-muted">
                                      ID: {bet.userId}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="text-right">
                                <span className="badge badge-secondary">
                                  {bet?.currentBet?.nation || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                <span className="badge badge-info">
                                  {bet?.currentBet?.matchOdd || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                <strong className="text-primary">
                                  ₹
                                  {bet?.currentBet?.stake != null
                                    ? Number(bet.currentBet.stake).toFixed(2)
                                    : "0.00"}
                                </strong>
                              </td>
                              <td className="text-right">
                                {bet?.createdAt
                                  ? moment(bet.createdAt).format(
                                      "YYYY-MM-DD hh:mm A"
                                    )
                                  : "N/A"}
                              </td>
                              <td className="text-right">
                                <code className="small">
                                  {bet?.ipAddress || "N/A"}
                                </code>
                              </td>
                              <td className="text-right">
                                <span className="small">
                                  {bet?.userAgent || "N/A"}
                                </span>
                              </td>
                              <td className="text-right">
                                {betStatus === "matchbet" ? (
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-sm btn-info mr-1"
                                      onClick={() => handleViewBet(bet)}
                                      title="View Details"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>
                                    {!bet?.isDeleted && (
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleDeleteBet(bet?.id, "casino")
                                        }
                                        title="Delete Bet"
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      handleDeleteBet(bet?.id, "casino")
                                    }
                                  >
                                    <i className="fas fa-trash"></i> Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr role="row" className="b-table-empty-row">
                            <td colSpan={9} role="cell" className="">
                              <div role="alert" aria-live="polite">
                                <div className="text-center my-4">
                                  <h5>No casino bets found</h5>
                                  <p className="text-muted">
                                    {searchValue
                                      ? "No casino bets match your search criteria"
                                      : "There are no current casino bets to display"}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination for Casino */}
                {totalPages > 0 && (
                  <div className="row pt-3">
                    <div className="col">
                      <div className="dataTables_paginate paging_simple_numbers float-right">
                        <ul className="pagination pagination-rounded mb-0">
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              «
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              ‹
                            </button>
                          </li>

                          {getPaginationNumbers().map((page, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                currentPage === page ? "active" : ""
                              } ${page === "..." ? "disabled" : ""}`}
                            >
                              {page === "..." ? (
                                <span className="page-link">...</span>
                              ) : (
                                <button
                                  className="page-link"
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </button>
                              )}
                            </li>
                          ))}

                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              ›
                            </button>
                          </li>
                          <li
                            className={`page-item ${
                              currentPage === totalPages ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
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
      )}
    </div>
  );
};

export default CurrentBets;
