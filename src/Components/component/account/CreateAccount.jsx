import React, { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import SuccessPopup from "../../../Popups/SuccessPopup";
import ErrorPopup from "../../../Popups/ErrorPopup";
import {
  decodedTokenData,
  getWhiteListData,
  signout,
} from "../../../Helper/auth";
import {
  getCurrentSportsSettings,
  createNewUser,
  uploadWebsiteLogo,
} from "../../../Helper/users";
import { usePermissions } from "../../../Hooks/usePermissions";
import { getAvailableAdminPanels } from "../../../Hooks/getAvailableAdminPanels";

const CreateAccount = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [userExists, setUserExists] = useState(null);
  const [socket, setSocket] = useState(null);
  const [sportSetting, setSportSetting] = useState({});

  const {
    userId,
    __type: userType = "",
    commissionSettings = {},
    commissionLenaYaDena = {},
  } = decodedTokenData(cookies) || {};

  // Get current sport settings
  const { data: currentSportsData } = useQuery(
    ["currentSportsSettings", { cookies, userId }],
    () => getCurrentSportsSettings(cookies, userId),
    {
      enabled: !!userId,
    }
  );

  // Get Domain URL for Whitelisting
  const [fullUrl, setFullUrl] = useState("");
  useEffect(() => {
    try {
      setFullUrl(window.location.href);
    } catch (error) {
      console.error("Error capturing URL:", error);
    }
  }, []);

  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEVELOPMENT_MODE_URL
      : fullUrl;

  const { data: whiteListData } = useQuery(
    ["whiteListData", baseUrl],
    () => getWhiteListData(baseUrl),
    {
      enabled: !!fullUrl,
    }
  );

  // Checking Permissions Accessibility
  const { AccessPermissions } = usePermissions();

  // Get Available Admin-Panels Accessibility
  const { MyAvailableAdminPanels } = getAvailableAdminPanels();
  const availablePanels = MyAvailableAdminPanels?.availableAdminPanels || [];

  // Signout Accessibility
  useEffect(() => {
    if (
      currentSportsData?.error === "Token has expired" ||
      currentSportsData?.error === "Invalid token"
    ) {
      signout(userId, removeCookie, () => {
        navigate("/login");
        window.location.reload();
      });
    }
    setSportSetting(currentSportsData?.sportsSettings || {});
  }, [currentSportsData]);

  // Form States
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    password: "",
    confirmPassword: "",
    userNumber: "",
    remark: "",
    selectOption: "",
    AdminUrl: "",
    ClientUrl: "",
    CommonName: "",
    count: 15,
    commissionSettings: {
      percentageWise: commissionSettings?.percentageWise || false,
      partnerShipWise: commissionSettings?.partnerShipWise || false,
    },
    commissionLenaYaDena: {
      commissionLena: commissionLenaYaDena?.commissionLena || false,
      commissionDena: commissionLenaYaDena?.commissionDena || false,
    },
  });

  // PANEL HEIRARCKY
  const panelHierarchy = {
    Developer: [
      "TechAdmin",
      "SuperAdmin",
      "Admin",
      "MiniAdmin",
      "SuperMaster",
      "Master",
      "SuperAgent",
      "Agent",
      "Client",
    ],
    TechAdmin: [
      "SuperAdmin",
      "Admin",
      "MiniAdmin",
      "SuperMaster",
      "Master",
      "SuperAgent",
      "Agent",
      "Client",
    ],
    SuperAdmin: [
      "Admin",
      "MiniAdmin",
      "SuperMaster",
      "Master",
      "SuperAgent",
      "Agent",
      "Client",
    ],
    Admin: [
      "MiniAdmin",
      "SuperMaster",
      "Master",
      "SuperAgent",
      "Agent",
      "Client",
    ],
    MiniAdmin: ["SuperMaster", "Master", "SuperAgent", "Agent", "Client"],
    SuperMaster: ["Master", "SuperAgent", "Agent", "Client"],
    Master: ["SuperAgent", "Agent", "Client"],
    SuperAgent: ["Agent", "Client"],
    Agent: ["Client"],
  };

  // Filter opt based on available panels
  const opt =
    panelHierarchy[userType]?.filter((panel) =>
      availablePanels.includes(panel)
    ) || [];

  // USER ID CHECK TIMER
  const [userIdCheckTimer, setUserIdCheckTimer] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("loginIdCheck", (exists) => {
        setUserExists(exists);
      });
    }
  }, [socket]);

  useEffect(() => {
    return () => {
      if (userIdCheckTimer) clearTimeout(userIdCheckTimer);
    };
  }, [userIdCheckTimer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "userId" && socket) {
      if (userIdCheckTimer) clearTimeout(userIdCheckTimer);

      const newTimer = setTimeout(() => {
        socket.emit("checkLoginId", value, whiteListData?.whiteListData?._id);
      }, 300);

      setUserIdCheckTimer(newTimer);
    }
  };

  const createUserMutation = useMutation(createNewUser, {
    onSuccess: (data) => {
      setIsLoading(false);
      if (data.success) {
        SuccessPopup(data.msg || "User Created");
        setFormData({
          userId: "",
          userName: "",
          password: "",
          confirmPassword: "",
          userNumber: "",
          remark: "",
          selectOption: "",
          AdminUrl: "",
          ClientUrl: "",
          CommonName: "",
          count: 15,
          commissionSettings: {
            percentageWise: commissionSettings?.percentageWise || false,
            partnerShipWise: commissionSettings?.partnerShipWise || false,
          },
          commissionLenaYaDena: {
            commissionLena: commissionLenaYaDena?.commissionLena || false,
            commissionDena: commissionLenaYaDena?.commissionDena || false,
          },
        });
        setSportSetting({});
        queryClient.invalidateQueries(["whitelistedDomains", { cookies }]);
      } else {
        if (
          data?.error === "Token has expired" ||
          data?.error === "Invalid token"
        ) {
          signout(userId, removeCookie, () => {
            navigate("/login");
            window.location.reload();
          });
        }
        ErrorPopup(
          data?.error || data.message || data.msg || "Something went wrong",
          2000
        );
      }
    },
    onError: (error) => {
      setIsLoading(false);
      ErrorPopup(error.message || error.error || "Something went wrong", 2000);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formDataObj = new FormData(event.target);

    if (formDataObj.get("password") !== formDataObj.get("confirmPassword")) {
      setIsLoading(false);
      return ErrorPopup("Passwords do not match", 2000);
    }

    const userData = {
      PersonalDetails: {
        userName: formDataObj.get("userName") || formDataObj.get("fullname"),
        loginId: formDataObj.get("userId"),
        password: formDataObj.get("password"),
      },
      remarks: formDataObj.get("remark"),
      commissionSettings: formData.commissionSettings,
      commissionLenaYaDena: formData.commissionLenaYaDena,
      sportsSettings: sportSetting,
      whiteList: {
        AdminUrl: formDataObj.get("AdminUrl") || "",
        ClientUrl: formDataObj.get("ClientUrl") || "",
        CommonName: formDataObj.get("CommonName") || "",
      },
    };

    if (formData.selectOption !== "Client") {
      userData.allowedNoOfUsers = parseInt(formDataObj.get("count")) || 15;
    }

    try {
      const result = await createUserMutation.mutateAsync({
        userType: formData.selectOption,
        cookies,
        userData,
      });

      if (result.success && formDataObj.get("Logo")) {
        const logoFormData = new FormData();
        logoFormData.append("Logo", formDataObj.get("Logo"));

        await uploadWebsiteLogo({
          userId: result?.whitelist?._id,
          cookies,
          logoFormData,
        });
      }

      event.target.reset();
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset();
      setFormData({
        userId: "",
        userName: "",
        password: "",
        confirmPassword: "",
        userNumber: "",
        remark: "",
        selectOption: "",
        AdminUrl: "",
        ClientUrl: "",
        CommonName: "",
        count: 15,
        commissionSettings: {
          percentageWise: commissionSettings?.percentageWise || false,
          partnerShipWise: commissionSettings?.partnerShipWise || false,
        },
        commissionLenaYaDena: {
          commissionLena: commissionLenaYaDena?.commissionLena || false,
          commissionDena: commissionLenaYaDena?.commissionDena || false,
        },
      });
      setSportSetting({});
    }
  };

  return (
    <>
      <div>
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">Create Account</h4>{" "}
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="/admin/home" className="" target="_self">
                      Home
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a
                      href="/admin/users"
                      className="router-link-active"
                      target="_self"
                    >
                      Users
                    </a>
                  </li>
                  <li className="breadcrumb-item active">
                    <span aria-current="location">Create Account</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>{" "}
        <form onSubmit={handleSubmit} ref={formRef} method="post">
          <div className="row">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Login ID:</label>{" "}
                        <input
                          placeholder="Login ID"
                          type="text"
                          name="userId"
                          value={formData.userId}
                          onChange={handleChange}
                          className="form-control animation"
                          aria-required="true"
                          required
                        />{" "}
                        {userExists !== null && (
                          <small
                            className={
                              userExists ? "text-danger" : "text-success"
                            }
                          >
                            {userExists ? "User already exists" : "Available"}
                          </small>
                        )}
                      </div>
                    </div>{" "}
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Password:</label>{" "}
                        <input
                          placeholder="Password"
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="form-control animation"
                          aria-required="true"
                          required
                        />{" "}
                      </div>
                    </div>
                  </div>{" "}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>User Name:</label>{" "}
                        <input
                          placeholder="User Name"
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          className="form-control animation"
                        />{" "}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Confirm Password:</label>{" "}
                        <input
                          placeholder="Confirm Password"
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="form-control animation"
                          required
                        />{" "}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Full Name:</label>{" "}
                    <input
                      placeholder="Full Name"
                      type="text"
                      name="fullname"
                      className="form-control animation"
                    />{" "}
                  </div>{" "}
                  <div className="form-group">
                    <label>Credit Amount:</label>{" "}
                    <input
                      placeholder="Credit Amount"
                      type="number"
                      name="camt"
                      className="form-control"
                    />{" "}
                  </div>{" "}
                  <div className="form-group tag-select">
                    <label>User Type:</label>{" "}
                    <select
                      name="selectOption"
                      value={formData.selectOption}
                      onChange={handleChange}
                      className="form-control"
                      aria-required="true"
                      required
                    >
                      <option value="">Select User Type</option>{" "}
                      {opt.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>{" "}
                  </div>{" "}
                  {formData.selectOption !== "Client" &&
                    formData.selectOption !== "" && (
                      <div className="form-group">
                        <label>Allowed Downline Accounts:</label>{" "}
                        <input
                          placeholder="Count"
                          type="number"
                          name="count"
                          value={formData.count}
                          onChange={handleChange}
                          className="form-control"
                        />{" "}
                      </div>
                    )}
                  <h4 className="card-title">Partnership Information</h4>{" "}
                  <div>
                    <div className="form-group">
                      <label>Partnership With No Return:</label>{" "}
                      <input
                        placeholder="Partnership With No Return"
                        type="text"
                        name="spart1"
                        maxLength={4}
                        className="form-control animation"
                      />{" "}
                      <p className="help is-success m-0 d-inline-block">
                        Our : 0 | Down Line: 0
                      </p>
                    </div>{" "}
                  </div>{" "}
                  <div className="d-flex justify-content-end align-items-center">
                    <input
                      placeholder="Transaction Code"
                      type="password"
                      name="mpassword"
                      className="form-control"
                      required
                    />{" "}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary ml-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          Creating...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">General Information</h4>{" "}
                  <div className="form-group">
                    <label>City:</label>{" "}
                    <input
                      placeholder="City"
                      type="text"
                      name="city"
                      className="form-control animation"
                    />{" "}
                  </div>{" "}
                  <div className="form-group">
                    <label>Mobile Number:</label>{" "}
                    <input
                      placeholder="Mobile Number"
                      type="text"
                      name="mono"
                      maxLength={15}
                      className="form-control animation"
                    />{" "}
                  </div>{" "}
                  <div className="form-group">
                    <label>Remark:</label>{" "}
                    <textarea
                      placeholder="Remark"
                      name="remark"
                      value={
                        formData.remark
                          ? formData.remark
                          : "creating account for " + formData.userId
                      }
                      onChange={handleChange}
                      className="form-control"
                      rows="3"
                    />{" "}
                  </div>{" "}
                  <div className="d-flex justify-content-end align-items-center mt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={isLoading}
                      className="btn btn-secondary mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary"
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          Creating...
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAccount;








