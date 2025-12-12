import React from "react";

const GeneralLock = () => {
  return (
    <div data-v-b00d14ae="">
      <div data-v-b00d14ae="">
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">General Lock</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">General Lock</span>
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
                <div className="user-lock-container">
                  <div className="m-t-20">
                    <div>
                      <form method="post" className="ajaxFormSubmit">
                        <div className="row row5">
                          <div className="col-md-3">
                            <div
                              className="form-group user-lock-search"
                              style={{ position: "relative" }}
                            >
                              <div
                                tabIndex={-1}
                                role="combobox"
                                aria-owns="listbox-null"
                                className="multiselect"
                                autoComplete="random"
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
                                    placeholder="Search By Client Name"
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
                                    Search By Client Name
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
                                        <span>No elements found</span>
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
                            </div>
                          </div>{" "}
                          <div className="col-md-2">
                            <div className="form-group">
                              <input
                                type="password"
                                placeholder="Transaction Code"
                                className="form-control d-inline-block"
                              />
                            </div>
                          </div>{" "}
                          <div className="col-md-2">
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
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>{" "}
                  {/**/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralLock;
