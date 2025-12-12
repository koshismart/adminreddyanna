import React from "react";

const MultiLoginAccount = () => {
  return (
    <div>
      <div data-v-b00d14ae="">
        <div data-v-b00d14ae="">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0 font-size-18">Multi Login Account</h4>{" "}
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="/admin/home" className="" target="_self">
                        Home
                      </a>
                    </li>
                    <li className="breadcrumb-item active">
                      <span aria-current="location">Multi Login Account</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body create-account-container">
                  <form method="post" data-vv-scope="userInsert">
                    <div className="create-account-form">
                      <div>
                        <h5 className="mb-0">Personal Information</h5>{" "}
                        <div className="row">
                          <div className="col-md-3 form-group">
                            <label>Client ID</label>{" "}
                            <input
                              type="text"
                              name="uname"
                              data-vv-as="Client ID"
                              className="form-control"
                              aria-required="true"
                              aria-invalid="false"
                            />{" "}
                            {/**/}
                          </div>{" "}
                          <div className="col-md-3 form-group">
                            <label>Full Name</label>{" "}
                            <input
                              type="text"
                              name="fullname"
                              data-vv-as="Full Name"
                              className="form-control"
                              aria-required="true"
                              aria-invalid="false"
                            />{" "}
                            {/**/}
                          </div>{" "}
                          <div className="col-md-3 form-group">
                            <label>Password</label>{" "}
                            <input
                              type="password"
                              data-vv-as="Password"
                              name="password"
                              className="form-control"
                              aria-required="false"
                              aria-invalid="false"
                            />{" "}
                            {/**/}
                          </div>{" "}
                          <div className="col-md-3 form-group">
                            <label>Confirm Password</label>{" "}
                            <input
                              type="password"
                              name="cpass"
                              data-vv-as="Confirm Password"
                              className="form-control"
                              aria-required="true"
                              aria-invalid="false"
                            />{" "}
                            {/**/}
                          </div>
                        </div>
                      </div>{" "}
                      <div className="mt-2 previlages">
                        <h5 className="mb-0">Privileges</h5>{" "}
                        <div className="previlage-box">
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue="true"
                                  id="__BVID__1770"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1770"
                                >
                                  All
                                </label>
                              </div>
                            </div>
                          </div>{" "}
                          <br />{" "}
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={1}
                                  id="__BVID__1771"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1771"
                                >
                                  DashBoard
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={2}
                                  id="__BVID__1772"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1772"
                                >
                                  Market Analysis
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={4}
                                  id="__BVID__1773"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1773"
                                >
                                  User List
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={5}
                                  id="__BVID__1774"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1774"
                                >
                                  Insert User
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={6}
                                  id="__BVID__1775"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1775"
                                >
                                  Bank
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={8}
                                  id="__BVID__1776"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1776"
                                >
                                  Account Statement
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={9}
                                  id="__BVID__1777"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1777"
                                >
                                  Party Win Loss
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={10}
                                  id="__BVID__1778"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1778"
                                >
                                  Current Bets
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={11}
                                  id="__BVID__1779"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1779"
                                >
                                  User History
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={12}
                                  id="__BVID__1780"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1780"
                                >
                                  General Lock
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={13}
                                  id="__BVID__1781"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1781"
                                >
                                  Casino Result
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={14}
                                  id="__BVID__1782"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1782"
                                >
                                  Live Casino Result
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={15}
                                  id="__BVID__1783"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1783"
                                >
                                  Our Casino
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={16}
                                  id="__BVID__1784"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1784"
                                >
                                  Events
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={17}
                                  id="__BVID__1785"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1785"
                                >
                                  Market Search Analysis
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={19}
                                  id="__BVID__1786"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1786"
                                >
                                  Login User creation
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={54}
                                  id="__BVID__1787"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1787"
                                >
                                  Withdraw
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={55}
                                  id="__BVID__1788"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1788"
                                >
                                  Deposit
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={56}
                                  id="__BVID__1789"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1789"
                                >
                                  Credit Reference
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={57}
                                  id="__BVID__1790"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1790"
                                >
                                  User Info
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={58}
                                  id="__BVID__1791"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1791"
                                >
                                  User Password Change
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={59}
                                  id="__BVID__1792"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1792"
                                >
                                  User Lock
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={60}
                                  id="__BVID__1793"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1793"
                                >
                                  Bet Lock
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={62}
                                  id="__BVID__1794"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1794"
                                >
                                  TurnOver
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={90}
                                  id="__BVID__1795"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1795"
                                >
                                  CouponReport
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={91}
                                  id="__BVID__1796"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1796"
                                >
                                  active user
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="previlage-item">
                            <div>
                              <div className="custom-control custom-checkbox">
                                <input
                                  data-vv-as="Privileges"
                                  type="checkbox"
                                  name="plist"
                                  className="custom-control-input"
                                  defaultValue={95}
                                  id="__BVID__1797"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="__BVID__1797"
                                >
                                  Agent Assign
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                        {/**/}{" "}
                        <div className="previlage-master mt-2">
                          <div className="form-group mb-0">
                            <input
                              type="password"
                              name="mpass"
                              placeholder="Transaction Code"
                              className="form-control mpass-text"
                              aria-required="true"
                              aria-invalid="false"
                            />{" "}
                            <button type="submit" className="btn btn-success">
                              Submit
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
                      </div>
                    </div>
                  </form>{" "}
                  <div className="outer mt-4">
                    <div className="inner">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th className="fixed-col-1">Action</th>
                            <th className="fixed-col-2">Username</th>
                            <th className="fixed-col-3">Full Name</th>
                            <th>DashBoard</th>
                            <th>Market Analysis</th>
                            <th>User List</th>
                            <th>Insert User</th>
                            <th>Bank</th>
                            <th>Account Statement</th>
                            <th>Party Win Loss</th>
                            <th>Current Bets</th>
                            <th>User History</th>
                            <th>General Lock</th>
                            <th>Casino Result</th>
                            <th>Live Casino Result</th>
                            <th>Our Casino</th>
                            <th>Events</th>
                            <th>Market Search Analysis</th>
                            <th>Login User creation</th>
                            <th>Withdraw</th>
                            <th>Deposit</th>
                            <th>Credit Reference</th>
                            <th>User Info</th>
                            <th>User Password Change</th>
                            <th>User Lock</th>
                            <th>Bet Lock</th>
                            <th>TurnOver</th>
                            <th>CouponReport</th>
                            <th>Active user</th>
                            <th>Marketing</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td
                              className="fixed-col-1 d-flex gap-1 align-items-center"
                              style={{
                                borderBottom: "1px solid rgb(222, 226, 230)",
                              }}
                            >
                              <a className="text-white btn btn-primary pointer">
                                U
                              </a>
                              <a className="text-white btn btn-info pointer">
                                S
                              </a>
                              <a
                                href="#"
                                className="text-white btn btn-success"
                              >
                                P
                              </a>
                            </td>
                            <td
                              className="fixed-col-2"
                              style={{
                                borderBottom: "1px solid rgb(222, 226, 230)",
                              }}
                            >
                              AZMAL
                            </td>
                            <td
                              className="fixed-col-3"
                              style={{
                                borderBottom: "1px solid rgb(222, 226, 230)",
                              }}
                            >
                              jhatuazmal
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center"
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center"
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                            <td
                              className="text-center "
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              <i className="fas fa-check-circle" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/**/} {/**/}
        </div>
      </div>
    </div>
  );
};

export default MultiLoginAccount;
