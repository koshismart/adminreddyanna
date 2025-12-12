import React from "react";

const LiveCasinoResult = () => {
  return (
    <div>
      <div className="live-bets-report">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Live Casino Result</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Casino Result</span>
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
                <form
                  method="post"
                  data-vv-scope="casinoResult"
                  className="ajaxFormSubmit"
                >
                  <div className="row row5 mb-3">
                    <div className="col-xl-2 mb-3">
                      <select
                        name="reportType"
                        className="form-control"
                        aria-required="true"
                        aria-invalid="false"
                      >
                        <option value="">Select Casino Type</option>{" "}
                        <option value="settled">Settled Bets</option>{" "}
                        <option value="unsettled">UnSettled Bets</option>
                      </select>
                    </div>{" "}
                    <div className="form-group col-xl-2">
                      <div
                        tabIndex={-1}
                        role="combobox"
                        aria-owns="listbox-null"
                        className="multiselect"
                      >
                        <div className="multiselect__select" />{" "}
                        <div className="multiselect__tags">
                          <div
                            className="multiselect__tags-wrap"
                            style={{ display: "none" }}
                          />{" "}
                          {/**/}{" "}
                          <div
                            className="multiselect__spinner"
                            style={{ display: "none" }}
                          />{" "}
                          <input
                            name=""
                            type="text"
                            autoComplete="off"
                            spellCheck="false"
                            placeholder="Select option"
                            tabIndex={0}
                            aria-controls="listbox-null"
                            className="multiselect__input"
                            style={{
                              width: 0,
                              position: "absolute",
                              padding: 0,
                            }}
                          />{" "}
                          {/**/}{" "}
                          <span className="multiselect__placeholder">
                            Select option
                          </span>
                        </div>{" "}
                        <div
                          tabIndex={-1}
                          className="multiselect__content-wrapper"
                          style={{ maxHeight: 300, display: "none" }}
                        >
                          <ul
                            role="listbox"
                            id="listbox-null"
                            className="multiselect__content"
                            style={{ display: "block" }}
                          >
                            {" "}
                            {/**/}{" "}
                            <li style={{ display: "none" }}>
                              <span className="multiselect__option">
                                No elements found. Consider changing the search
                                query.
                              </span>
                            </li>{" "}
                            <li>
                              <span className="multiselect__option">
                                List is empty.
                              </span>
                            </li>{" "}
                          </ul>
                        </div>
                      </div>
                    </div>{" "}
                    {/**/}{" "}
                    <div className="col-xl-2 mb-3">
                      <select
                        name="gtype"
                        className="form-control"
                        aria-required="true"
                        aria-invalid="false"
                      >
                        <option value="">Select</option>{" "}
                        <option value="ezugi">Ezugi</option>
                        <option value="ss">Super Spade</option>
                        <option value="qt">Slot 3</option>
                        <option value="evo">Evolution</option>
                        <option value="cockfight">CockFight</option>
                        <option value="ludo">Ludo Classic</option>
                        <option value="pop-the-ball">PopTheBall</option>
                        <option value="binary">Binary</option>
                        <option value="tgs">Slot 2</option>
                        <option value="slot">Slot</option>
                        <option value="tgslive">VivoGames-LuckyStreak</option>
                        <option value="rummy">Rummy</option>
                        <option value="ludo-lands">Ludo Lands</option>
                        <option value="vivo">vivo gaming</option>
                        <option value="snakes-and-ladders">
                          snakes and ladders
                        </option>
                        <option value="smart">Smart Soft</option>
                        <option value="astar">Astar Game</option>
                        <option value="bc">Creedroomz</option>
                        <option value="tembo">Tembo</option>
                        <option value="lottery">Lottery</option>
                        <option value="av">Aviator</option>
                        <option value="ds">Dragoon soft</option>
                        <option value="bcslot">Pascal Game</option>
                        <option value="scratch">Scratch</option>
                        <option value="darwin">Darwin</option>
                        <option value="pg">Pocket Game</option>
                        <option value="bet">Bet Core</option>
                        <option value="jilli">Jili</option>
                        <option value="win">Win</option>
                        <option value="gemini1">Gemini</option>
                        <option value="amigo">Amigo</option>
                        <option value="egt">EGT</option>
                        <option value="studio21">Studio 21</option>
                      </select>
                    </div>{" "}
                    <div className="col-xl mb-3">
                      <button
                        type="submit"
                        id="loaddata"
                        className="btn btn-primary"
                      >
                        Load
                      </button>{" "}
                      <button
                        type="button"
                        id="reset"
                        className="btn btn-light"
                      >
                        Reset
                      </button>{" "}
                      <div className="d-inline-block ml-3">
                        <div
                          id="export_1763983900073"
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
                          id="__BVID__2595"
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
                          id="__BVID__2596"
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
                      aria-colcount={7}
                      className="table b-table table-bordered"
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
                            <div>Game Name</div>
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
                            <div>Type</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            tabIndex={0}
                            aria-colindex={3}
                            aria-sort="none"
                            className="position-relative text-right"
                          >
                            <div>Amount</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            tabIndex={0}
                            aria-colindex={4}
                            aria-sort="none"
                            className="position-relative text-right"
                          >
                            <div>Total</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            tabIndex={0}
                            aria-colindex={5}
                            aria-sort="none"
                            className="position-relative"
                          >
                            <div>Date</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            tabIndex={0}
                            aria-colindex={6}
                            aria-sort="none"
                            className="position-relative"
                          >
                            <div>Round Id</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                          <th
                            role="columnheader"
                            scope="col"
                            tabIndex={0}
                            aria-colindex={7}
                            aria-sort="none"
                            className="position-relative"
                          >
                            <div>Transaction Id</div>
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
                          <td colSpan={7} role="cell" className="">
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
        </div>{" "}
        {/**/}
      </div>
    </div>
  );
};

export default LiveCasinoResult;
