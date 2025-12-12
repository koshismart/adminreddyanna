import React from "react";

const OurCasinoResult = () => {
  return (
    <div>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Our Casino Result</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Our Casino Result</span>
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
                    <div className="col-md-3 mb-2">
                      <div className="mx-datepicker">
                        <div className="mx-input-wrapper">
                          <input
                            name="date"
                            type="text"
                            autoComplete="off"
                            placeholder=""
                            className="mx-input"
                          />
                          <i className="mx-icon-calendar">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1024 1024"
                              width="1em"
                              height="1em"
                            >
                              <path d="M940.218182 107.054545h-209.454546V46.545455h-65.163636v60.50909H363.054545V46.545455H297.890909v60.50909H83.781818c-18.618182 0-32.581818 13.963636-32.581818 32.581819v805.236363c0 18.618182 13.963636 32.581818 32.581818 32.581818h861.090909c18.618182 0 32.581818-13.963636 32.581818-32.581818V139.636364c-4.654545-18.618182-18.618182-32.581818-37.236363-32.581819zM297.890909 172.218182V232.727273h65.163636V172.218182h307.2V232.727273h65.163637V172.218182h176.872727v204.8H116.363636V172.218182h181.527273zM116.363636 912.290909V442.181818h795.927273v470.109091H116.363636z" />
                            </svg>
                          </i>
                        </div>
                      </div>
                    </div>{" "}
                    <div className="col-md-3 mb-2">
                      <select
                        name="gtype"
                        className="form-control is-invalid"
                        aria-required="true"
                        aria-invalid="true"
                      >
                        <option value="">Select Casino</option>{" "}
                        <option value="teen">Teenpatti 1-day</option>
                        <option value="poker">Poker 1-Day</option>
                        <option value="3cardj">3 Cards Judgement</option>
                        <option value="aaa">Amar Akbar Anthony</option>
                        <option value="ab20">Andar Bahar</option>
                        <option value="abj">Andar Bahar 2</option>
                        <option value="baccarat">Baccarat</option>
                        <option value="baccarat2">Baccarat 2</option>
                        <option value="btable">Bollywood Casino</option>
                        <option value="card32">32 Cards A</option>
                        <option value="card32eu">32 Cards B</option>
                        <option value="cmatch20">Cricket Match 20-20</option>
                        <option value="cmeter">Casino Meter</option>
                        <option value="cricketv">Cricket V</option>
                        <option value="cricketv2">Cricket V2</option>
                        <option value="cricketv3">5Five Cricket</option>
                        <option value="dt20">20-20 Dragon Tiger</option>
                        <option value="dt202">20-20 Dragon Tiger 2</option>
                        <option value="dt6">1 Day Dragon Tiger</option>
                        <option value="dtl20">20-20 D T L</option>
                        <option value="lottcard">lottcard</option>
                        <option value="lucky7">Lucky 7 - A</option>
                        <option value="lucky7eu">Lucky 7 - B</option>
                        <option value="poker20">20-20 Poker</option>
                        <option value="poker6">Poker 6 Players</option>
                        <option value="teen20">20-20 Teenpatti</option>
                        <option value="teen8">Teenpatti Open</option>
                        <option value="teen9">Teenpatti Test</option>
                        <option value="war">Casino War</option>
                        <option value="worli">Worli Matka</option>
                        <option value="worli2">Instant Worli</option>
                        <option value="teen6">Teenpatti - 2.0</option>
                        <option value="queen">Queen</option>
                        <option value="race20">Race20</option>
                        <option value="lucky7eu2">Lucky 7 - C</option>
                        <option value="superover">Super Over</option>
                        <option value="trap">The Trap</option>
                        <option value="patti2">2 Cards Teenpatti</option>
                        <option value="teensin">29Card Baccarat</option>
                        <option value="teenmuf">Muflis Teenpatti</option>
                        <option value="race17">Race to 17</option>
                        <option value="teen20b">20-20 Teenpatti B</option>
                        <option value="trio">Trio</option>
                        <option value="notenum">Note Number</option>
                        <option value="teen2024">Teen 20 24</option>
                        <option value="kbc">K.B.C</option>
                        <option value="teen120">1 CARD 20-20</option>
                        <option value="teen1">1 CARD ONE-DAY</option>
                        <option value="vteen20">V-20-20 Teenpatti</option>
                        <option value="vteen">V-Teenpatti 1-day</option>
                        <option value="vdt6">V-1 Day Dragon Tiger</option>
                        <option value="vdt20">V-20-20 Dragon Tiger</option>
                        <option value="vlucky7">V-Lucky 7 - A</option>
                        <option value="vrace17">V-Race to 17</option>
                        <option value="vteenmuf">V-Muflis Teenpatti</option>
                        <option value="vaaa">V-Amar Akbar Anthony</option>
                        <option value="vbtable">V-Bollywood Casino</option>
                        <option value="vbaccarat">V-Baccarat</option>
                        <option value="vtrio">V-Trio</option>
                        <option value="vtrap">V-The Trap</option>
                        <option value="ab3">ANDAR BAHAR 50 CARDS</option>
                        <option value="vdtl20">V-20-20 D T L</option>
                        <option value="aaa2">Amar Akbar Anthony 2</option>
                        <option value="roulette">roulette</option>
                        <option value="race2">Race to 2nd</option>
                        <option value="teen3">Instant Teenpatti</option>
                        <option value="dum10">Dus ka Dum</option>
                        <option value="cmeter1">1 Card Meter</option>
                        <option value="teen32">Instant Teenpatti 2.0</option>
                        <option value="sicbo">Sic Bo</option>
                        <option value="ballbyball">Ball by ball</option>
                        <option value="roulette1">roulette1</option>
                        <option value="teen33">Instant Teenpatti 3.0</option>
                        <option value="roulette2">roulette2</option>
                        <option value="superover2">Super Over2</option>
                        <option value="roulette3">roulette3</option>
                        <option value="sicbo2">Sic Bo 2</option>
                        <option value="teen41">Queen top open teenpatti</option>
                        <option value="teen42">Jack top open teenpatti</option>
                        <option value="lucky15">Lucky 15</option>
                        <option value="goal">Goal</option>
                        <option value="ab4">Andar-Bahar 150 card</option>
                        <option value="superover3">Mini SuperOver</option>
                        <option value="ourroullete">Unique Roulette</option>
                        <option value="teen20c">20-20 Teenpatti C</option>
                        <option value="btable2">Bollywood Casino 2</option>
                        <option value="teenjoker">Teenpatti Joker</option>
                        <option value="joker1">Unlimited Joker One Day</option>
                        <option value="joker20">Teenpatti Joker 20-20</option>
                        <option value="joker120">Unlimited Joker 20-20</option>
                        <option value="poison20">Teenpatti Poison 20-20</option>
                        <option value="teenunique">Unique Teenpatti</option>
                        <option value="poison">Teenpatti Poison One Day</option>
                        <option value="roulette11">Golden Roulette</option>
                        <option value="roulette12">Beach Roulette</option>
                        <option value="roulette13">Regular Roulette</option>
                        <option value="pteen">Premium Teenpatti 1-day</option>
                        <option value="pteen20">Premium 20-20 Teenpatti</option>
                        <option value="pdt6">Premium 1 Day Dragon Tiger</option>
                        <option value="pdt20">
                          Premium 20-20 Dragon Tiger
                        </option>
                        <option value="plucky7">Premium Lucky 7</option>
                        <option value="pcard32">Premium 32 Cards</option>
                        <option value="pbaccarat">Premium Baccarat</option>
                        <option value="tteen">Tembo Teenpatti 1-day</option>
                        <option value="tteen20">Tembo 20-20 Teenpatti</option>
                        <option value="tdt6">Tembo 1 Day Dragon Tiger</option>
                        <option value="tdt20">Tembo 20-20 Dragon Tiger</option>
                        <option value="tlucky7">Tembo Lucky 7</option>
                        <option value="tcard32">Tembo 32 Cards</option>
                        <option value="tbaccarat">Tembo Baccarat</option>
                        <option value="lucky5">Lucky 6</option>
                        <option value="mogambo">Mogambo</option>
                        <option value="dolidana">Dolidana</option>
                        <option value="teen20v">20-20 Teenpatti VIP</option>
                        <option value="worli3">Matka</option>
                        <option value="teen62">V VIP Teenpatti 1-day</option>
                      </select>
                    </div>{" "}
                    <div className="col-md-6 mb-2">
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
                          id="export_1763983634202"
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
                          id="__BVID__2525"
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
                          id="__BVID__2526"
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
                            <div>Market Id</div>
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
                            <div>Winner</div>
                            <span className="sr-only">
                              {" "}
                              (Click to sort ascending)
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody role="rowgroup">
                        <tr role="row" aria-rowindex="1" class="">
                          <td aria-colindex="1" role="cell" class="">
                            <a href="" class="link-default">
                              128251129151647
                            </a>
                          </td>
                          <td aria-colindex="2" role="cell" class="">
                            4 K K
                          </td>
                        </tr>
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
        </div>{" "}
        {/**/}
      </div>
    </div>
  );
};

export default OurCasinoResult;
