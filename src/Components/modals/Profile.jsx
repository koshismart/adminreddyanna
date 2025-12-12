import React, { useState } from "react";
import ProfileTab from "./tabs/ProfileTab";
import ChangePasswordTab from "./tabs/ChangePasswordTab";
import UserLockTab from "./tabs/UserLockTab";
import AccountHistoryTab from "./tabs/AccountHistoryTab";
import EditProfileTab from "./tabs/EditProfileTab";
import AccountStatementTab from "./tabs/AccountStatementTab";
import changeTransactionPassword from "./tabs/changeTransactionPassword";

const Profile = ({ isOpen, onClose, account }) => {
  const [activeTab, setActiveTab] = useState("profile");

  if (!isOpen || !account) return null;

  const tabs = [
    { id: "profile", label: "Profile", component: ProfileTab },
    {
      id: "changePassword",
      label: "Change Password",
      component: ChangePasswordTab,
    },
     {
      id: "changeTransactionPassword",
      label: "change Transaction Password",
      component:changeTransactionPassword,
    },
    { id: "userLock", label: "User lock", component: UserLockTab },
    {
      id: "accountHistory",
      label: "Account history",
      component: AccountHistoryTab,
    },
    { id: "editProfile", label: "Edit Profile", component: EditProfileTab },
    {
      id: "accountStatement",
      label: "Account statement",
      component: AccountStatementTab,
    },
  ];

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="popup-model">
      <div
        id="__BVID__4036___BV_modal_outer_"
        style={{ position: "absolute", zIndex: 1040 }}
      >
        <div
          id="__BVID__4036"
          role="dialog"
          aria-describedby="__BVID__4036___BV_modal_body_"
          className="modal fade bgopacity show d-block"
          aria-modal="true"
          style={{ display: "block" }}
        >
          <div
            className="modal-dialog modal-xl "
            style={{ maxHeight: "-webkit-fill-available" }}
          >
            <span tabIndex={0} />
            <div
              id="__BVID__4036___BV_modal_content_"
              tabIndex={-1}
              className="modal-content"
            >
              <header
                id="__BVID__4036___BV_modal_header_"
                className="modal-header bg-primary"
              >
                <h5 className="modal-title text-uppercase text-white">
                  {account.PersonalDetails?.userName || "N/A"}
                </h5>
                <button
                  type="button"
                  onClick={onClose}
                  className="close text-white"
                >
                  ×
                </button>
              </header>
              <div
                id="__BVID__4036___BV_modal_body_"
                className="modal-body theme-bg"
              >
                <div className="tabs" id="__BVID__4059">
                  <div className="">
                    <ul
                      role="tablist"
                      className="nav nav-tabs"
                      id="__BVID__4059__BV_tab_controls_"
                    >
                      {tabs.map((tab, index) => (
                        <li
                          key={tab.id}
                          role="presentation"
                          className="nav-item"
                        >
                          <a
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            aria-setsize={tabs.length}
                            aria-posinset={index + 1}
                            className={`nav-link ${
                              activeTab === tab.id ? "tab-bg-info active" : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <span
                              className="d-inline-block d-sm-none"
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              {tab.label
                                .split(" ")
                                .map((word) => word.charAt(0))
                                .join("")}
                            </span>
                            <span
                              className="d-none d-sm-inline-block"
                              style={{ color: "rgb(73, 80, 87)" }}
                            >
                              {tab.label}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className="tab-content text-muted"
                    id="__BVID__4059__BV_tab_container_"
                  >
                    <div
                      role="tabpanel"
                      aria-hidden="false"
                      className="tab-pane active"
                    >
                      {ActiveComponent && <ActiveComponent account={account} />}
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

export default Profile;