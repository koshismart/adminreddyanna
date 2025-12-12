import React, { useState } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = ({ isOpen }) => {
  const [activeDropdown, setActiveDropdown] = useState({
    account: false,
    reports: true,
    events: false,
  });

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  return (
    <div className={` vertical-menu ${isOpen ? "" : "collapsed"}`}>
      <div className="h-100" data-simplebar="init">
        <div className="simplebar-wrapper" style={{ margin: 0 }}>
          <div className="simplebar-height-auto-observer-wrapper">
            <div className="simplebar-height-auto-observer" />
          </div>
          <div className="simplebar-mask">
            <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
              <div
                className="simplebar-content-wrapper"
                tabIndex={0}
                role="region"
                aria-label="scrollable content"
                style={{
                  height: "100%",
                  overflow: isOpen ? "hidden scroll" : "hidden",
                }}
              >
                <div className="simplebar-content" style={{ padding: 0 }}>
                  <div
                    id="sidebar-menu"
                    style={{ display: isOpen ? "block" : "none" }}
                  >
                    <ul id="side-menu" className="metismenu list-unstyled">
                      <li className="mm-active">
                        <a href="/admin/home" className="side-nav-link-ref">
                          <i className="bx bx-home-circle" />
                          <span>Dashboard</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="/admin/market-analysis"
                          className="side-nav-link-ref"
                        >
                          <i className="bx bxs-bar-chart-alt-2" />
                          <span>Market Analysis</span>
                        </a>
                      </li>
                      <li>
                        <Link
                          to="/admin/createaccount"
                          className="side-nav-link-ref"
                        >
                          <i className="bx bx-user-plus" />
                          <span>Multi Login Account</span>
                        </Link>
                      </li>

                      {/* Account Dropdown */}
                      <li className={activeDropdown.account ? "mm-active" : ""}>
                        <a
                          href="#"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown("account");
                          }}
                          aria-expanded={activeDropdown.account}
                        >
                          <i className="bx bx-user-circle" />
                          <span>Account</span>
                        </a>
                        <ul
                          className={`sub-menu ${
                            activeDropdown.account ? "mm-show" : ""
                          }`}
                          style={{
                            display: activeDropdown.account ? "block" : "none",
                          }}
                        >
                          {/* <li>
                            <Link to="/users" className="side-nav-link-ref">
                              Account List
                            </Link>
                          </li> */}
                          <li>
                            <Link to="/user/all" className="side-nav-link-ref">
                              Account List
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/users/insertuser"
                              className="side-nav-link-ref"
                            >
                              Create Account
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <Link
                          to="/admin/reports/bank"
                          className="side-nav-link-ref"
                        >
                          <i className="bx bxs-bank" /> <span>Bank</span>
                        </Link>
                      </li>

                      {/* Reports Dropdown */}
                      <li className={activeDropdown.reports ? "mm-active" : ""}>
                        <a
                          href="#"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown("reports");
                          }}
                          aria-expanded={activeDropdown.reports}
                        >
                          <i className="bx bx-file" /> <span>Reports</span>
                        </a>
                        <ul
                          className={`sub-menu mm-collapse ${
                            activeDropdown.reports ? "mm-show" : ""
                          }`}
                          style={{
                            display: activeDropdown.reports ? "block" : "none",
                          }}
                        >
                          <li>
                            <Link
                              to="/admin/reports/accountstatement"
                              className="side-nav-link-ref"
                            >
                              Account Statement
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reports/profitloss"
                              className="side-nav-link-ref"
                            >
                              Party Win Loss
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="current-bets"
                              className="side-nav-link-ref"
                            >
                              Current Bets
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reports/userhistory"
                              className="side-nav-link-ref"
                            >
                              User History
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/settings/userlock"
                              className="side-nav-link-ref"
                            >
                              General Lock
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reports/casinoresult"
                              className="side-nav-link-ref"
                            >
                              Our Casino Result
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reports/livecasinoreport"
                              className="side-nav-link-ref"
                            >
                              Live Casino Result
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reports/turnover"
                              className="side-nav-link-ref"
                            >
                              Turn Over
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/admin/reports/authlist"
                              className="side-nav-link-ref"
                            >
                              User Authentication
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <Link
                          to="/admin/casino/list"
                          className="side-nav-link-ref"
                        >
                          <i className="mdi mdi-cards-playing-outline" />{" "}
                          <span>Our Casino</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/vcasino/list"
                          className="side-nav-link-ref router-link-exact-active router-link-active"
                          aria-current="page"
                        >
                          <span className="badge badge-pill badge-success float-right">
                            New
                          </span>
                          <i className="mdi mdi-cards-playing-outline" />
                          <span>Virtual Casino</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/casino/vip"
                          className="side-nav-link-ref"
                        >
                          <span className="badge badge-pill badge-success float-right">
                            New
                          </span>
                          <i className="mdi mdi-cards-playing-outline" />
                          <span>Vip Casino</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/pcasino/list"
                          className="side-nav-link-ref"
                        >
                          <span className="badge badge-pill badge-success float-right">
                            New
                          </span>{" "}
                          <i className="mdi mdi-cards-playing-outline" />
                          <span>Premium Casino</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/tcasino/list"
                          className="side-nav-link-ref"
                        >
                          <span className="badge badge-pill badge-success float-right">
                            New
                          </span>
                          <i className="mdi mdi-cards-playing-outline" />
                          <span>Tembo Casino</span>
                        </Link>
                      </li>

                      {/* Events Dropdown */}
                      <li className={activeDropdown.events ? "mm-active" : ""}>
                        <a
                          href="#"
                          className="has-arrow"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown("events");
                          }}
                          aria-expanded={activeDropdown.events}
                        >
                          <i className="bx bxs-calendar-event" />{" "}
                          <span>Events</span>
                        </a>
                        <ul
                          className={`sub-menu ${
                            activeDropdown.events ? "mm-show" : ""
                          }`}
                          style={{
                            display: activeDropdown.events ? "block" : "none",
                          }}
                        >
                          <li>
                            <a href="#" className="has-arrow sport40">
                              <span>Politics</span> <span> (1)</span>
                            </a>
                            <ul className="sub-menu">
                              <li className="text-dark">
                                <a
                                  href="/admin/game/details/B2Y8+fXp42FFgKg8GdCtVw==/q2IG5mmQaY2PSIldTgFJGw=="
                                  className="side-nav-link-ref"
                                >
                                  <span>Bihar Election 2025</span>
                                </a>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
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

export default LeftSidebar;
