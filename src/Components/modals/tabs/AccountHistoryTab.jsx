import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { getDepositWithdraw } from "../../../Helper/accountStatement";
import { useCookies } from "react-cookie";

const AccountHistoryTab = ({ account }) => {
  const [cookies] = useCookies(["Admin"]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);

  // Use React Query to fetch data
  const {
    data: historyData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    ["accountHistory", account?._id, page, limit],
    () => getDepositWithdraw(cookies, account?._id),
    {
      enabled: !!account?._id && !!cookies?.Admin?.token,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format amount with proper sign
  const formatAmount = (amount, type) => {
    if (amount === undefined || amount === null) return "0.00";
    const numAmount = parseFloat(amount);

    if (type === "withdraw") {
      return `-${numAmount.toFixed(2)}`;
    } else if (type === "deposit") {
      return `+${numAmount.toFixed(2)}`;
    }
    return numAmount.toFixed(2);
  };

  // Get transaction type class for styling
  const getAmountClass = (type) => {
    if (type === "withdraw") {
      return "text-danger";
    } else if (type === "deposit") {
      return "text-success";
    }
    return "text-warning";
  };

  // Extract history data from response
  const transactions = historyData?.data || [];
  const totalRecords = historyData?.count || 0;
  const totalPages = Math.ceil(totalRecords / limit);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setPage(1);
  };

  // Manual refresh
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div>
      {/* Controls */}
      <div className="row mb-3">
        <div className="col-md-6">
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
        <div className="col-md-6 text-right">
          <button
            onClick={handleRefresh}
            className="btn btn-primary btn-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2"></span>
                Loading...
              </>
            ) : (
              <>
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center p-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading transaction history...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="alert alert-danger">
          <h5>Error Loading Data</h5>
          <p>{error?.message || "Failed to load transaction history"}</p>
          <button className="btn btn-primary btn-sm" onClick={handleRefresh}>
            Retry
          </button>
        </div>
      )}

      {/* Success State - Table */}
      {!isLoading && !isError && (
        <div className="table-responsive">
          <div className="table no-footer table-responsive-sm">
            <table
              id="eventsListTbl"
              role="table"
              aria-busy="false"
              className="table b-table table-hover"
            >
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader" scope="col" aria-colindex={1}>
                    <div>Transaction Type</div>
                  </th>
                  <th role="columnheader" scope="col" aria-colindex={2}>
                    <div>Super User</div>
                  </th>
                  <th role="columnheader" scope="col" aria-colindex={3}>
                    <div>User</div>
                  </th>
                  <th
                    role="columnheader"
                    scope="col"
                    aria-colindex={4}
                    className="text-right"
                  >
                    <div>Amount</div>
                  </th>
                  <th role="columnheader" scope="col" aria-colindex={5}>
                    <div>Date & Time</div>
                  </th>
                  <th role="columnheader" scope="col" aria-colindex={6}>
                    <div>Status</div>
                  </th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr key={transaction._id || index} role="row">
                      <td role="cell">
                        <span
                          className={`badge badge-${
                            transaction.type === "deposit"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {transaction.type?.toUpperCase() || "N/A"}
                        </span>
                      </td>
                      <td role="cell">
                        {transaction.superUser?.userName || "System"}
                      </td>
                      <td role="cell">{transaction.user?.userName || "N/A"}</td>
                      <td
                        role="cell"
                        className={`text-right font-weight-bold ${getAmountClass(
                          transaction.type
                        )}`}
                      >
                        {formatAmount(transaction.amount, transaction.type)}
                      </td>
                      <td role="cell">{formatDate(transaction.createdAt)}</td>
                      <td role="cell">
                        <span
                          className={`badge badge-${
                            transaction.status === "completed"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          {transaction.status?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr role="row" className="b-table-empty-row">
                    <td colSpan={6} role="cell">
                      <div role="alert" aria-live="polite">
                        <div className="text-center my-4">
                          <i className="fas fa-history fa-3x text-muted mb-3"></i>
                          <h5>No Transaction History Found</h5>
                          <p>
                            There are no deposit/withdraw records for this
                            account.
                          </p>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={handleRefresh}
                          >
                            Refresh
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && transactions.length > 0 && (
        <div className="row mt-3">
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_info">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalRecords)} of {totalRecords} entries
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <div className="dataTables_paginate paging_simple_numbers float-right">
              <ul className="pagination pagination-rounded mb-0">
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    ‹
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${
                        page === pageNum ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li
                  className={`page-item ${
                    page === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary Info */}
      {!isLoading && !isError && transactions.length > 0 && (
        <div className="alert alert-info mt-3">
          <div className="row">
            <div className="col-md-4">
              <small>
                <strong>Total Deposits:</strong> ₹
                {transactions
                  .filter(
                    (t) => t.type === "deposit" && t.status === "completed"
                  )
                  .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
                  .toFixed(2)}
              </small>
            </div>
            <div className="col-md-4">
              <small>
                <strong>Total Withdrawals:</strong> ₹
                {transactions
                  .filter(
                    (t) => t.type === "withdraw" && t.status === "completed"
                  )
                  .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
                  .toFixed(2)}
              </small>
            </div>
            <div className="col-md-4">
              <small>
                <strong>Account:</strong>{" "}
                {account?.PersonalDetails?.userName || "N/A"}
              </small>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountHistoryTab;

// import React from "react";

// const AccountHistoryTab = ({ account }) => {
//   return (
//     <div className="table-responsive">
//       <div className="table no-footer table-responsive-sm">
//         <table
//           id="eventsListTbl"
//           role="table"
//           aria-busy="false"
//           aria-colcount={5}
//           className="table b-table"
//         >
//           <thead role="rowgroup">
//             <tr role="row">
//               <th role="columnheader" scope="col" aria-colindex={1}>
//                 <div>Super User</div>
//               </th>
//               <th role="columnheader" scope="col" aria-colindex={2}>
//                 <div>User</div>
//               </th>
//               <th role="columnheader" scope="col" aria-colindex={3}>
//                 <div>Transfer From</div>
//               </th>
//               <th role="columnheader" scope="col" aria-colindex={4} className="text-right">
//                 <div>Amount</div>
//               </th>
//               <th role="columnheader" scope="col" aria-colindex={5}>
//                 <div>Date</div>
//               </th>
//             </tr>
//           </thead>
//           <tbody role="rowgroup">
//             <tr role="row" className="b-table-empty-row">
//               <td colSpan={5} role="cell">
//                 <div role="alert" aria-live="polite">
//                   <div className="text-center my-2">There are no records to show</div>
//                 </div>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AccountHistoryTab;
