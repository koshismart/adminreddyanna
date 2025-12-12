import React, { useState, useContext } from "react";
import DataTable from "react-data-table-component";
import { MenuHanderContextBtn } from "../Context/MenuHandlerContext";
// import SearchInput from "../component/SearchInput";

const AccountStatementTable = ({ data, isLoading }) => {
  const { menuLeftSmall } = useContext(MenuHanderContextBtn);
  const [searchValue, setSearchValue] = useState("");
  const [entries, setEntries] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Format data for table
  const formattedData = data?.map((item, index) => ({
    id: item._id || index,
    date: moment(item?.createdAt).format("DD/MM/YYYY hh:mm:ss"),
    srNo: index + 1,
    credit: item?.credit || "0",
    debit: item?.debit || "0",
    pts: item?.totalUserBalance || "0",
    remark: item?.narration || "",
    fromto: "-", // You can add fromto data if available
  }));

  // Filter data based on search
  const filteredData = formattedData?.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  // Paginate data
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
      sortable: true,
      width: "150px",
    },
    {
      name: "Sr No",
      selector: (row) => row.srNo,
      sortable: true,
      width: "80px",
      right: true,
    },
    {
      name: "Credit",
      selector: (row) => row.credit,
      sortable: true,
      width: "120px",
      right: true,
      cell: (row) => (
        <div className="text-right">
          {row.credit !== "-" ? `+${row.credit}` : row.credit}
        </div>
      ),
    },
    {
      name: "Debit",
      selector: (row) => row.debit,
      sortable: true,
      width: "120px",
      right: true,
      cell: (row) => (
        <div className="text-right">
          {row.debit !== "0" ? `-${row.debit}` : row.debit}
        </div>
      ),
    },
    {
      name: "Pts",
      selector: (row) => row.pts,
      sortable: true,
      width: "120px",
      right: true,
    },
    {
      name: "Remark",
      selector: (row) => row.remark,
      sortable: true,
      width: "350px",
    },
    {
      name: "Fromto",
      selector: (row) => row.fromto,
      sortable: true,
      width: "120px",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#045662",
        color: "#fff",
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        border: "1px solid #128CA3",
        borderBottom: "0.5px solid #f5f5f5",
      },
    },
    cells: {
      style: {
        border: "1px solid #dee2e6",
      },
    },
  };

  const handleEntriesChange = (e) => {
    setEntries(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div
      className={`${
        menuLeftSmall ? "md:w-full" : "lg:w-[100%]"
      } md:w-full transition-all duration-200`}
    >
      {/* Table Controls */}
      <div className="row mb-3">
        <div className="col-6">
          <div className="dataTables_length">
            <label className="d-inline-flex align-items-center">
              Show&nbsp;
              <select
                className="custom-select custom-select-sm"
                value={entries}
                onChange={handleEntriesChange}
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
          <div className="dataTables_filter text-md-right">
            <label className="d-inline-flex align-items-center">
              <input
                type="search"
                placeholder="Search..."
                className="form-control form-control-sm ml-2 form-control"
                value={searchValue}
                onChange={handleSearch}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-responsive mb-0">
        <DataTable
          columns={columns}
          data={paginatedData || []}
          progressPending={isLoading}
          customStyles={customStyles}
          noDataComponent={
            <div className="text-center py-4">No data available</div>
          }
        />
      </div>

      {/* Pagination */}
      <div className="row pt-3">
        <div className="col">
          <div className="dataTables_paginate paging_simple_numbers float-right">
            <ul className="pagination pagination-rounded mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  ‹
                </button>
              </li>

              {[...Array(Math.ceil((filteredData?.length || 0) / entries))].map(
                (_, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${
                  currentPage >=
                  Math.ceil((filteredData?.length || 0) / entries)
                    ? "disabled"
                    : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={
                    currentPage >=
                    Math.ceil((filteredData?.length || 0) / entries)
                  }
                >
                  ›
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatementTable;
