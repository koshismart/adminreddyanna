import React from "react";

const UserAuthnatication = () => {
  return (
    <div>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">User Authentication</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">User Authentication</span>
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
                <div className="row mb-3">
                  <div className="col-md-12">
                    <div className="d-inline-block">
                      <div
                        id="export_1763984518710"
                        className="d-inline-block disabled"
                      >
                        <button
                          type="button"
                          disabled="disabled"
                          className="btn mr-1 btn-success disabled"
                        >
                          <i className="fas fa-file-excel" />
                        </button>
                      </div>{" "}
                      <button
                        type="button"
                        disabled="disabled"
                        className="btn btn-danger disabled"
                      >
                        <i className="fas fa-file-pdf" />
                      </button>
                    </div>
                  </div>
                </div>{" "}
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
                          id="__BVID__2635"
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
                          id="__BVID__2636"
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
                      aria-colcount={2}
                      className="table b-table table-bordered b-table-fixed"
                    >
                      {/**/}
                      {/**/}
                      <thead role="rowgroup" className="">
                        {/**/}
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
                            tabIndex={0}
                            aria-colindex={2}
                            aria-sort="none"
                            className="position-relative"
                          >
                            <div>Authentication</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        {/**/}
                        <tr role="row" className="b-table-empty-row">
                          <td colSpan={2} role="cell" className="">
                            <div role="alert" aria-live="polite">
                              <div className="text-center my-2">
                                There are no records to show
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/**/}
                      </tbody>
                      {/**/}
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
                            aria-hidden="true"
                            className="page-item disabled"
                          >
                            <span
                              role="menuitem"
                              aria-label="Go to first page"
                              aria-disabled="true"
                              className="page-link"
                            >
                              «
                            </span>
                          </li>
                          <li
                            role="presentation"
                            aria-hidden="true"
                            className="page-item disabled"
                          >
                            <span
                              role="menuitem"
                              aria-label="Go to previous page"
                              aria-disabled="true"
                              className="page-link"
                            >
                              ‹
                            </span>
                          </li>
                          {/**/}
                          {/**/}
                          <li role="presentation" className="page-item active">
                            <button
                              role="menuitemradio"
                              type="button"
                              aria-label="Go to page 1"
                              aria-checked="true"
                              aria-posinset={1}
                              aria-setsize={1}
                              tabIndex={0}
                              className="page-link"
                            >
                              1
                            </button>
                          </li>
                          {/**/}
                          {/**/}
                          <li
                            role="presentation"
                            aria-hidden="true"
                            className="page-item disabled"
                          >
                            <span
                              role="menuitem"
                              aria-label="Go to next page"
                              aria-disabled="true"
                              className="page-link"
                            >
                              ›
                            </span>
                          </li>
                          <li
                            role="presentation"
                            aria-hidden="true"
                            className="page-item disabled"
                          >
                            <span
                              role="menuitem"
                              aria-label="Go to last page"
                              aria-disabled="true"
                              className="page-link"
                            >
                              »
                            </span>
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
  );
};

export default UserAuthnatication;
