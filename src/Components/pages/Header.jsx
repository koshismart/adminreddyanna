import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import { io } from "socket.io-client";
import { decodedTokenData, signout } from "../../Helper/auth";
import { getMyBalance } from "../../Helper/users";
import { allDepositWithdrawRequests } from "../../Helper/request";
import { usePermissions } from "../../Hooks/usePermissions";
import ChangePassword from "../component/report/Changepassword";
import RuleModal from "../component/RuleModal";

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  // Real-time states
  const [Balance, setBalance] = useState(null);
  const [DepositWithdrawCount, setDepositWithdrawCount] = useState(0);

  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies(["Admin"]);

  // Get user data for displaying username and userType
  const {
    PersonalDetails = {},
    __type: userType = "",
    userId = "",
  } = decodedTokenData(cookies) || {};

  const { AccessPermissions } = usePermissions();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleSidebarToggle = () => {
    onToggleSidebar();
  };

  const openChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
    closeDropdown();
  };

  const closeChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const openRulesModal = () => {
    setIsRulesModalOpen(true);
  };

  const closeRulesModal = () => {
    setIsRulesModalOpen(false);
  };

  // Data fetching for balance
  const { data: MyBalance } = useQuery(["myBalance", { cookies }], async () => {
    const data = await getMyBalance(cookies);
    setBalance(data?.Balance);
    return data;
  });

  // Data fetching for deposit/withdraw requests
  const { data: DepositWithdraw, refetch: refetchDWCount } = useQuery(
    ["depositWithdrawRequest", { cookies }],
    async () => {
      const data = await allDepositWithdrawRequests(cookies);
      return data;
    },
    {
      onSuccess: (data) => {
        setDepositWithdrawCount(
          data?.allRequests?.filter((doc) => doc.status === "Pending").length
        );
      },
    }
  );

  // Authentication check
  if (
    MyBalance?.error === "Token has expired" ||
    MyBalance?.error === "Invalid token" ||
    DepositWithdraw?.error === "Invalid token" ||
    DepositWithdraw?.error === "Token has expired"
  ) {
    signout(userId, removeCookie, () => {
      navigate("/login");
      window.location.reload();
    });
  }

  // Socket.io real-time functionality
  useEffect(() => {
    let socket;

    const connectSocket = () => {
      socket = io(import.meta.env.VITE_SERVER_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      // Balance update events
      const updateBalance = (data) => {
        setBalance(data?.Balance);
      };

      const updateDepositWithdrawCount = (data) => {
        setDepositWithdrawCount((prevCount) => prevCount + Number(data.count));
      };

      socket.on(`sendchips${userId}`, updateBalance);
      socket.on(`recievechips${userId}`, updateBalance);
      socket.on(`updatechips${userId}`, (data) => {
        setBalance((prevBalance) => prevBalance + Number(data.Balance));
      });
      socket.on(
        `sendDepositWithdrawCount${userId}`,
        updateDepositWithdrawCount
      );

      // Multiple login prevention
      if (!AccessPermissions?.featureAccessPermissions?.enableMultipleLogin) {
        socket.on(`leaveOldSignIn${userId}`, (data) => {
          if (data.success) {
            signout(userId, removeCookie, () => {
              navigate("/login");
              window.location.reload();
            });
          }
        });

        socket.emit("requestLoginBroadcast", {
          event: `leaveOldSignIn${userId}`,
          data: {
            success: true,
            message: "New Login Detected",
          },
        });
      }

      // User login status
      socket.emit("userLoginStatus", {
        event: `userLoginStatus`,
        data: {
          success: true,
          userId: userId,
          status: "Online",
          message: "Sign-In Detected",
        },
      });
    };

    // Internet connection handler
    const handleOnline = () => {
      if (userId && socket) {
        if (!AccessPermissions?.featureAccessPermissions?.enableMultipleLogin) {
          socket.emit("requestLoginBroadcast", {
            event: `leaveOldSignIn${userId}`,
            data: {
              success: true,
              message: "New Login Detected",
            },
          });
        }
      }
    };

    // Page visibility handler
    const handleVisibilityChange = () => {
      if (!socket) return;

      if (document.visibilityState === "visible") {
        socket.emit("userLoginStatus", {
          event: "userLoginStatus",
          data: {
            success: true,
            userId: userId,
            status: "Online",
            message: "Sign-In Detected",
          },
        });
      } else if (document.visibilityState === "hidden") {
        socket.emit("userLoginStatus", {
          event: "userLoginStatus",
          data: {
            success: true,
            userId: userId,
            status: "Offline",
            message: "Offline Detected",
          },
        });
      }
    };

    if (userId) {
      connectSocket();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (socket) {
        socket.off(`sendchips${userId}`);
        socket.off(`receivechips${userId}`);
        socket.off(`updatechips${userId}`);
        socket.off(`sendDepositWithdrawCount${userId}`);
        socket.off(`leaveOldSignIn${userId}`);
        socket.disconnect();
      }
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, removeCookie, navigate, AccessPermissions]);

  // console.log("Header - Sidebar open:", isSidebarOpen);
  // console.log("Header - Dropdown open:", isDropdownOpen);

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box">
              <a
                href="/admin/home"
                aria-current="page"
                className="logo router-link-exact-active router-link-active"
              >
                <span className="logo-lg">
                  <img
                    src="https://sitethemedata.com/sitethemes/d247.com/front/logo.png"
                    alt=""
                    className="site-logo"
                  />
                </span>
              </a>
            </div>
            <button
              id="vertical-menu-btn"
              type="button"
              className="btn btn-sm px-3 font-size-16 header-item"
              onClick={handleSidebarToggle}
            >
              <i className="fa fa-fw fa-bars" />
            </button>
            <div className="site-searchbox mt-3 d-none d-lg-inline-block">
              <div
                tabIndex={-1}
                role="combobox"
                aria-owns="listbox-null"
                className="multiselect"
              >
                <div className="multiselect__select" />
                <div className="multiselect__tags">
                  <div
                    className="multiselect__tags-wrap"
                    style={{ display: "none" }}
                  />

                  <div
                    className="multiselect__spinner"
                    style={{ display: "none" }}
                  />
                  <input
                    name=""
                    type="text"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Search User"
                    tabIndex={0}
                    aria-controls="listbox-null"
                    className="multiselect__input"
                    style={{ width: 0, position: "absolute", padding: 0 }}
                  />
                  <span className="multiselect__placeholder">Search User</span>
                </div>
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
                    <li style={{ display: "none" }}>
                      <span className="multiselect__option">
                        <span>No elements found</span>
                      </span>
                    </li>
                    <li>
                      <span className="multiselect__option">
                        List is empty.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex">
            <div className="dropdown b-dropdown d-inline-block d-lg-none ml-2 btn-group">
              <button
                aria-haspopup="menu"
                aria-expanded="false"
                type="button"
                className="btn dropdown-toggle btn-black header-item noti-icon"
              >
                <i className="mdi mdi-magnify" />
              </button>
              <ul
                role="menu"
                tabIndex={-1}
                className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-right"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
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
                          />
                          <div
                            className="multiselect__spinner"
                            style={{ display: "none" }}
                          />{" "}
                          <input
                            name=""
                            type="text"
                            autoComplete="off"
                            spellCheck="false"
                            placeholder="Search User"
                            tabIndex={0}
                            aria-controls="listbox-null"
                            className="multiselect__input"
                            style={{
                              width: 0,
                              position: "absolute",
                              padding: 0,
                            }}
                          />
                          <span className="multiselect__placeholder">
                            Search User
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
                            <li style={{ display: "none" }}>
                              <span className="multiselect__option">
                                <span>No elements found</span>
                              </span>
                            </li>
                            <li>
                              <span className="multiselect__option">
                                List is empty.
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </ul>
            </div>

            {/* Deposit/Withdraw Count Display */}
            {AccessPermissions?.featureAccessPermissions?.depositWithdrawl && (
              <div className="dropdown d-none d-sm-inline-block ml-1">
                <button type="button" className="btn header-item noti-icon">
                  <span className="balance nowrap">
                    D/W:
                    <span className="balance-value">
                      <b>{DepositWithdrawCount?.toFixed(0) || 0}</b>
                    </span>
                  </span>
                </button>
              </div>
            )}

            {/* Desktop Balance Display */}
            <div className="dropdown d-none d-sm-inline-block ml-1">
              <button type="button" className="btn header-item noti-icon">
                <span className="balance nowrap">
                  Pts:
                  <span className="balance-value">
                    <b>{Balance?.toFixed(1) || 0}</b>
                  </span>
                </span>
              </button>
            </div>

            {/* Desktop Rules Button */}
            <div className="d-none d-sm-inline-block rules-icon nowrap">
              <span className="main-rules">
                <button
                  onClick={openRulesModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "inherit",
                    cursor: "pointer",
                    textDecoration: "none",
                    padding: 0,
                    font: "inherit",
                  }}
                >
                  <i className="fas fa-info-circle mr-1" />
                  Rules
                </button>
              </span>
            </div>

            <div className="dropdown b-dropdown btn-group">
              <button
                className="btn dropdown-toggle btn-black header-item"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
              >
                {/* Display username and userType from PersonalDetails */}
                <span className="ml-1">
                  {PersonalDetails?.userName || "viveksingh001"}
                  {/* [{userType}] */}
                </span>{" "}
                <i className="mdi mdi-chevron-down" />
              </button>
              <ul
                role="menu"
                tabIndex={-1}
                className={`dropdown-menu dropdown-menu-right ${
                  isDropdownOpen ? "show" : ""
                }`}
                style={{ display: isDropdownOpen ? "block" : "none" }}
              >
                {/* Mobile-only balance display */}
                <div className="dropdown d-sm-none ml-1 mr-1">
                  <div className="bal-box">
                    <span className="balance nowrap">
                      Pts:
                      <span className="balance-value">
                        <b>{Balance?.toFixed(1) || 0}</b>
                      </span>
                    </span>
                  </div>
                </div>

                {/* Mobile-only deposit/withdraw count */}
                {AccessPermissions?.featureAccessPermissions
                  ?.depositWithdrawl && (
                  <div className="dropdown d-sm-none ml-1 mr-1">
                    <div className="bal-box">
                      <span className="balance nowrap">
                        D/W:
                        <span className="balance-value">
                          <b>{DepositWithdrawCount?.toFixed(0) || 0}</b>
                        </span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Mobile-only rules link */}
                <button
                  className="dropdown-item d-sm-none"
                  onClick={openRulesModal}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.375rem 1.5rem",
                    color: "#212529",
                  }}
                >
                  <i className="fas fa-info-circle mr-1" /> Rules
                </button>

                {/* Regular dropdown items */}
                <li role="presentation">
                  <a
                    className="dropdown-item"
                    href="/admin/secureauth"
                    onClick={closeDropdown}
                  >
                    <i className="bx bx-lock-open font-size-16 align-middle mr-1" />
                    Secure Auth
                  </a>
                </li>

                <button
                  className="dropdown-item"
                  onClick={openChangePasswordModal}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    textAlign: "left",
                    padding: "0.375rem 1.5rem",
                    color: "#212529",
                  }}
                >
                  <i className="bx bx-wallet font-size-16 align-middle mr-1" />
                  Change Password
                </button>

                <div className="dropdown-divider" />

                <Link
                  to="/login"
                  className="dropdown-item text-danger"
                  onClick={closeDropdown}
                >
                  <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>
                  Logout
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <ChangePassword onClose={closeChangePasswordModal} />
      )}

      {/* Rules Modal */}
      {isRulesModalOpen && <RuleModal onClose={closeRulesModal} />}
    </>
  );
};

export default Header;

// import React, { useState, useContext, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useCookies } from "react-cookie";
// import { useQuery } from "react-query";
// import { io } from "socket.io-client";
// import { decodedTokenData, signout } from "../../Helper/auth";
// import { getMyBalance } from "../../Helper/users";
// import { allDepositWithdrawRequests } from "../../Helper/request";
// import { usePermissions } from "../../Hooks/usePermissions";
// import ChangePassword from "../component/report/Changepassword";
// import RuleModal from "../component/RuleModal";

// const Header = ({ onToggleSidebar, isSidebarOpen }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
//     useState(false);
//   const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

//   // Real-time states
//   const [Balance, setBalance] = useState(null);
//   const [DepositWithdrawCount, setDepositWithdrawCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   const navigate = useNavigate();
//   // Update this line - get both 'token' and 'Admin' cookies
//   const [cookies, removeCookie, setCookie] = useCookies(["token", "Admin"]);

//   // Get the token - check both names
//   const authToken = cookies.token || cookies.Admin;

//   // Debug cookies
//   useEffect(() => {
//     console.log("All cookies:", cookies);
//     console.log("Auth token available:", !!authToken);
//     console.log("Token value:", authToken ? "Present" : "Missing");
//   }, [cookies, authToken]);

//   // Get user data for displaying username and userType
//   const {
//     PersonalDetails = {},
//     __type: userType = "",
//     userId = "",
//   } = decodedTokenData({ token: authToken }) || {};

//   const { AccessPermissions } = usePermissions();

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const closeDropdown = () => {
//     setIsDropdownOpen(false);
//   };

//   const handleSidebarToggle = () => {
//     onToggleSidebar();
//   };

//   const openChangePasswordModal = () => {
//     setIsChangePasswordModalOpen(true);
//     closeDropdown();
//   };

//   const closeChangePasswordModal = () => {
//     setIsChangePasswordModalOpen(false);
//   };

//   const openRulesModal = () => {
//     setIsRulesModalOpen(true);
//   };

//   const closeRulesModal = () => {
//     setIsRulesModalOpen(false);
//   };

//   // Enhanced token validation function
//   const validateToken = (data) => {
//     if (!data) return false;

//     if (
//       data?.error === "Token has expired" ||
//       data?.error === "Invalid token" ||
//       data?.message === "Unauthorized" ||
//       data?.status === 401
//     ) {
//       console.log("Token validation failed:", data?.error || data?.message);
//       return false;
//     }
//     return true;
//   };

//   // Handle signout
//   const handleSignout = () => {
//     signout(userId, removeCookie, () => {
//       navigate("/login");
//       window.location.reload();
//     });
//   };

//   // Data fetching for balance with error handling
//   const {
//     data: MyBalance,
//     error: balanceError,
//     isError: isBalanceError,
//     isLoading: isBalanceLoading,
//   } = useQuery(
//     ["myBalance", authToken],
//     async () => {
//       try {
//         if (!authToken) {
//           throw new Error("No authentication token found");
//         }

//         // Pass token to API function
//         const data = await getMyBalance({ token: authToken });

//         if (!validateToken(data)) {
//           throw new Error("Authentication failed");
//         }

//         setBalance(data?.Balance || 0);
//         setIsLoading(false);
//         return data;
//       } catch (error) {
//         console.error("Balance fetch error:", error);
//         setIsLoading(false);
//         throw error;
//       }
//     },
//     {
//       retry: 0,
//       enabled: !!authToken,
//       refetchOnWindowFocus: false,
//       staleTime: 30000,
//       onError: (error) => {
//         console.log("Balance query error:", error);
//         if (
//           error.message.includes("Authentication") ||
//           error.message.includes("token")
//         ) {
//           handleSignout();
//         }
//       },
//     }
//   );

//   // Data fetching for deposit/withdraw requests with error handling
//   const {
//     data: DepositWithdraw,
//     error: dwError,
//     isError: isDWError,
//     isLoading: isDWLoading,
//     refetch: refetchDWCount,
//   } = useQuery(
//     ["depositWithdrawRequest", authToken],
//     async () => {
//       try {
//         if (!authToken) {
//           throw new Error("No authentication token found");
//         }

//         const data = await allDepositWithdrawRequests({ token: authToken });

//         if (!validateToken(data)) {
//           throw new Error("Authentication failed");
//         }

//         return data;
//       } catch (error) {
//         console.error("Deposit/Withdraw fetch error:", error);
//         throw error;
//       }
//     },
//     {
//       onSuccess: (data) => {
//         if (data && data.allRequests) {
//           const pendingCount = data.allRequests.filter(
//             (doc) => doc.status === "Pending"
//           ).length;
//           setDepositWithdrawCount(pendingCount);
//         }
//       },
//       retry: 0,
//       enabled: !!authToken,
//       refetchOnWindowFocus: false,
//       staleTime: 30000,
//       onError: (error) => {
//         console.log("D/W query error:", error);
//         if (
//           error.message.includes("Authentication") ||
//           error.message.includes("token")
//         ) {
//           handleSignout();
//         }
//       },
//     }
//   );

//   // Check authentication status on mount
//   useEffect(() => {
//     console.log("Header Mount - Cookies:", cookies);
//     console.log("Header Mount - Auth Token:", authToken);
//     console.log("Header Mount - UserId:", userId);

//     if (!authToken) {
//       console.log("No authentication token found, redirecting to login");
//       navigate("/login");
//       return;
//     }

//     if (userId) {
//       setIsLoading(false);
//     }
//   }, [cookies, authToken, navigate, userId]);

//   // Handle query errors
//   useEffect(() => {
//     if (isBalanceError || isDWError) {
//       const error = balanceError || dwError;
//       console.log("Query authentication error detected:", error);

//       if (
//         error?.message?.includes("token") ||
//         error?.message?.includes("auth") ||
//         error?.message?.includes("Authentication")
//       ) {
//         handleSignout();
//       }
//     }
//   }, [isBalanceError, isDWError, balanceError, dwError]);

//   // Socket.io real-time functionality
//   useEffect(() => {
//     let socket;
//     let reconnectAttempts = 0;
//     const maxReconnectAttempts = 5;

//     const connectSocket = () => {
//       if (!userId || !authToken) {
//         console.log("Socket: Missing userId or token");
//         return;
//       }

//       try {
//         console.log("Socket: Connecting...");
//         socket = io(import.meta.env.VITE_SERVER_URL, {
//           transports: ["websocket", "polling"],
//           reconnection: true,
//           reconnectionAttempts: maxReconnectAttempts,
//           reconnectionDelay: 1000,
//           reconnectionDelayMax: 5000,
//           auth: {
//             token: authToken,
//           },
//           query: {
//             userId: userId,
//           },
//         });

//         // Connection events
//         socket.on("connect", () => {
//           console.log("Socket: Connected successfully");
//           reconnectAttempts = 0;

//           // Register user as online
//           socket.emit("userLoginStatus", {
//             userId: userId,
//             status: "Online",
//             timestamp: new Date().toISOString(),
//           });
//         });

//         socket.on("connect_error", (error) => {
//           console.error("Socket connection error:", error);
//           reconnectAttempts++;

//           if (reconnectAttempts >= maxReconnectAttempts) {
//             console.log("Max reconnection attempts reached");
//             if (socket) socket.disconnect();
//           }

//           // Check for authentication errors
//           if (
//             error.message.includes("auth") ||
//             error.message.includes("token") ||
//             error.message.includes("Unauthorized")
//           ) {
//             console.log("Socket auth error detected");
//             setTimeout(() => {
//               handleSignout();
//             }, 1000);
//           }
//         });

//         // Balance update events
//         socket.on(`sendchips${userId}`, (data) => {
//           console.log("Balance update - sendchips:", data);
//           if (data?.Balance !== undefined) {
//             setBalance(data.Balance);
//           }
//         });

//         socket.on(`recievechips${userId}`, (data) => {
//           console.log("Balance update - recievechips:", data);
//           if (data?.Balance !== undefined) {
//             setBalance(data.Balance);
//           }
//         });

//         socket.on(`updatechips${userId}`, (data) => {
//           console.log("Balance update - updatechips:", data);
//           if (data?.Balance !== undefined) {
//             setBalance((prev) => {
//               const newBalance = (prev || 0) + Number(data.Balance);
//               return newBalance;
//             });
//           }
//         });

//         // Deposit/Withdraw count updates
//         socket.on(`sendDepositWithdrawCount${userId}`, (data) => {
//           console.log("D/W count update:", data);
//           if (data?.count !== undefined) {
//             setDepositWithdrawCount((prev) => prev + Number(data.count));
//           }
//         });

//         // Multiple login prevention
//         socket.on(`leaveOldSignIn${userId}`, (data) => {
//           console.log("Multiple login detected:", data);
//           if (data?.success) {
//             alert(
//               "New login detected from another device. You are being logged out."
//             );
//             handleSignout();
//           }
//         });

//         // Force logout event
//         socket.on(`forceLogout${userId}`, (data) => {
//           console.log("Force logout received:", data);
//           if (data?.forceLogout) {
//             alert("You have been logged out by the system.");
//             handleSignout();
//           }
//         });

//         // Handle disconnection
//         socket.on("disconnect", (reason) => {
//           console.log("Socket disconnected:", reason);
//           if (
//             reason === "io server disconnect" ||
//             reason === "transport close"
//           ) {
//             // Server initiated disconnect - possible auth issue
//             setTimeout(() => {
//               if (!socket.connected) {
//                 handleSignout();
//               }
//             }, 2000);
//           }
//         });
//       } catch (error) {
//         console.error("Socket setup error:", error);
//       }
//     };

//     // Page visibility handler
//     const handleVisibilityChange = () => {
//       if (!socket || !socket.connected || !userId) return;

//       if (document.visibilityState === "visible") {
//         socket.emit("userLoginStatus", {
//           userId: userId,
//           status: "Online",
//           timestamp: new Date().toISOString(),
//         });
//       } else if (document.visibilityState === "hidden") {
//         socket.emit("userLoginStatus", {
//           userId: userId,
//           status: "Away",
//           timestamp: new Date().toISOString(),
//         });
//       }
//     };

//     // Network status handler
//     const handleOnline = () => {
//       console.log("Network: Online");
//       if (userId && authToken) {
//         // Refresh data when coming back online
//         refetchDWCount();
//       }
//     };

//     const handleOffline = () => {
//       console.log("Network: Offline");
//     };

//     // Initialize socket if user is authenticated
//     if (userId && authToken) {
//       connectSocket();
//     }

//     // Add event listeners
//     window.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     // Cleanup function
//     return () => {
//       console.log("Header cleanup - disconnecting socket");

//       if (socket) {
//         // Send offline status before disconnecting
//         if (socket.connected && userId) {
//           socket.emit("userLoginStatus", {
//             userId: userId,
//             status: "Offline",
//             timestamp: new Date().toISOString(),
//           });
//         }

//         // Remove all listeners
//         socket.off("connect");
//         socket.off("connect_error");
//         socket.off("disconnect");
//         socket.off(`sendchips${userId}`);
//         socket.off(`recievechips${userId}`);
//         socket.off(`updatechips${userId}`);
//         socket.off(`sendDepositWithdrawCount${userId}`);
//         socket.off(`leaveOldSignIn${userId}`);
//         socket.off(`forceLogout${userId}`);

//         // Disconnect
//         socket.disconnect();
//       }

//       // Remove event listeners
//       window.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, [userId, authToken, refetchDWCount]);

//   // Show loading state
//   if (isLoading) {
//     return (
//       <header id="page-topbar">
//         <div className="navbar-header">
//           <div className="d-flex justify-content-center align-items-center w-100 py-2">
//             <div className="spinner-border text-primary" role="status">
//               <span className="sr-only">Loading...</span>
//             </div>
//             <span className="ml-2">Loading...</span>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   // If no user ID, show minimal header
//   if (!userId) {
//     return (
//       <header id="page-topbar">
//         <div className="navbar-header">
//           <div className="d-flex">
//             <div className="navbar-brand-box">
//               <a href="/" className="logo">
//                 <span className="logo-lg">
//                   <img
//                     src="https://sitethemedata.com/sitethemes/d247.com/front/logo.png"
//                     alt="Logo"
//                     className="site-logo"
//                   />
//                 </span>
//               </a>
//             </div>
//           </div>
//           <div className="d-flex">
//             <Link to="/login" className="btn btn-primary">
//               Login
//             </Link>
//           </div>
//         </div>
//       </header>
//     );
//   }

//   return (
//     <>
//       <header id="page-topbar">
//         <div className="navbar-header">
//           <div className="d-flex">
//             <div className="navbar-brand-box">
//               <a href="/admin/home" className="logo">
//                 <span className="logo-lg">
//                   <img
//                     src="https://sitethemedata.com/sitethemes/d247.com/front/logo.png"
//                     alt="Logo"
//                     className="site-logo"
//                   />
//                 </span>
//               </a>
//             </div>

//             <button
//               id="vertical-menu-btn"
//               type="button"
//               className="btn btn-sm px-3 font-size-16 header-item"
//               onClick={handleSidebarToggle}
//             >
//               <i className="fa fa-fw fa-bars" />
//             </button>

//             <div className="site-searchbox mt-3 d-none d-lg-inline-block">
//               <div className="input-group">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search User"
//                 />
//                 <div className="input-group-append">
//                   <button className="btn btn-primary" type="button">
//                     <i className="mdi mdi-magnify" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="d-flex">
//             {/* Mobile Search */}
//             <div className="dropdown b-dropdown d-inline-block d-lg-none ml-2">
//               <button
//                 type="button"
//                 className="btn dropdown-toggle btn-black header-item noti-icon"
//               >
//                 <i className="mdi mdi-magnify" />
//               </button>
//             </div>

//             {/* Deposit/Withdraw Count Display */}
//             {AccessPermissions?.featureAccessPermissions?.depositWithdrawl && (
//               <div className="dropdown d-none d-sm-inline-block ml-1">
//                 <button type="button" className="btn header-item noti-icon">
//                   <span className="balance nowrap">
//                     D/W:{" "}
//                     <span className="balance-value">
//                       <b>{DepositWithdrawCount.toFixed(0)}</b>
//                     </span>
//                   </span>
//                 </button>
//               </div>
//             )}

//             {/* Desktop Balance Display */}
//             <div className="dropdown d-none d-sm-inline-block ml-1">
//               <button type="button" className="btn header-item noti-icon">
//                 <span className="balance nowrap">
//                   Pts:{" "}
//                   <span className="balance-value">
//                     <b>{Balance?.toFixed(1) || "0.0"}</b>
//                   </span>
//                 </span>
//               </button>
//             </div>

//             {/* Desktop Rules Button */}
//             <div className="d-none d-sm-inline-block ml-2">
//               <button
//                 onClick={openRulesModal}
//                 className="btn header-item"
//                 style={{
//                   background: "none",
//                   border: "none",
//                   color: "#fff",
//                 }}
//               >
//                 <i className="fas fa-info-circle mr-1" />
//                 Rules
//               </button>
//             </div>

//             {/* User Dropdown */}
//             <div className="dropdown b-dropdown btn-group">
//               <button
//                 className="btn dropdown-toggle btn-black header-item"
//                 onClick={toggleDropdown}
//                 aria-expanded={isDropdownOpen}
//               >
//                 <span className="ml-1">
//                   {PersonalDetails?.userName || "User"}
//                 </span>
//                 <i className="mdi mdi-chevron-down" />
//               </button>

//               <div
//                 className={`dropdown-menu dropdown-menu-right ${
//                   isDropdownOpen ? "show" : ""
//                 }`}
//                 style={{ display: isDropdownOpen ? "block" : "none" }}
//               >
//                 {/* Mobile-only balance display */}
//                 <div className="d-sm-none p-3">
//                   <div className="balance-section">
//                     <div className="mb-2">
//                       <span className="text-muted">Balance:</span>
//                       <span className="font-weight-bold ml-2">
//                         {Balance?.toFixed(1) || "0.0"} Pts
//                       </span>
//                     </div>
//                     {AccessPermissions?.featureAccessPermissions
//                       ?.depositWithdrawl && (
//                       <div>
//                         <span className="text-muted">Pending D/W:</span>
//                         <span className="font-weight-bold ml-2">
//                           {DepositWithdrawCount}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                   <div className="dropdown-divider" />
//                 </div>

//                 {/* Mobile-only rules link */}
//                 <button
//                   className="dropdown-item d-sm-none"
//                   onClick={openRulesModal}
//                 >
//                   <i className="fas fa-info-circle mr-2" />
//                   Rules
//                 </button>

//                 <div className="dropdown-divider d-sm-none" />

//                 {/* Regular dropdown items */}
//                 <Link
//                   to="/admin/secureauth"
//                   className="dropdown-item"
//                   onClick={closeDropdown}
//                 >
//                   <i className="bx bx-lock-open mr-2" />
//                   Secure Auth
//                 </Link>

//                 <button
//                   className="dropdown-item"
//                   onClick={openChangePasswordModal}
//                 >
//                   <i className="bx bx-wallet mr-2" />
//                   Change Password
//                 </button>

//                 <div className="dropdown-divider" />

//                 <button
//                   className="dropdown-item text-danger"
//                   onClick={handleSignout}
//                 >
//                   <i className="bx bx-power-off mr-2" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Change Password Modal */}
//       {isChangePasswordModalOpen && (
//         <ChangePassword onClose={closeChangePasswordModal} />
//       )}

//       {/* Rules Modal */}
//       {isRulesModalOpen && <RuleModal onClose={closeRulesModal} />}
//     </>
//   );
// };

// export default Header;
