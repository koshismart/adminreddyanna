import React, { useState } from "react";
import LeftSidebar from "./component/LeftSidebar";
import RightSidebar from "./component/RightSidebar";
import Header from "./Pages/Header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./component/Footer";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Exact matches - only these specific paths
  const exactHideRoutes = [
    "/users",
    "/admin/createaccount",
    "/admin/users/insertuser",
    "/admin/reports/bank",
    "/admin/reports/accountstatement",
    "/admin/reports/profitloss",
    "/current-bets",
    "/admin/reports/userhistory",
    "/admin/settings/userlock",
    "/admin/reports/casinoresult",
    "/admin/reports/livecasinoreport",
    "/admin/reports/turnover",
    "/admin/reports/authlist",
    "/admin/casino/list",
    "/admin/vcasino/list",
    "/admin/pcasino/list",
    "/admin/tcasino/list",
    "/admin/casino/vip",
  ];

  // Partial matches - any route starting with these
  const partialHideRoutes = [
    "/user/all", // Will match /user/all/69292d8391464fc23c0c9441/dev5 etc.
  ];

  const shouldShowRightSidebar = !(
    exactHideRoutes.includes(location.pathname) ||
    partialHideRoutes.some((route) => location.pathname.startsWith(route))
  );

  return (
    <>
      <div>
        <Header onToggleSidebar={toggleSidebar} />
        <div className="main-content">
          <LeftSidebar isOpen={isSidebarOpen} />
          <div className={`page-content ${isSidebarOpen ? "expaned" : ""}`}>
            <Outlet />
            {shouldShowRightSidebar && <RightSidebar />}
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;


























// import React, { useState } from "react";
// import LeftSidebar from "./component/LeftSidebar";
// import RightSidebar from "./component/RightSidebar";
// import Header from "./Pages/Header";
// import { Outlet, useLocation } from "react-router-dom";
// import Footer from "./component/Footer";

// const Layout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const location = useLocation();

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   // Define routes where RightSidebar should NOT show
//   const hideRightSidebarRoutes = [
//     // "/admin/createaccount",
//     "/user/all",
//     "/user/all/:userId/:loginId",
//     "/users",
//     "/admin/users/insertuser",
//     "/admin/reports/bank",
//     "/admin/reports/accountstatement",
//     "/admin/reports/profitloss",
//     "/admin/reports/currentbets",
//     "/admin/reports/userhistory",
//     "/admin/settings/userlock",
//     "/admin/reports/casinoresult",
//     "/admin/reports/livecasinoreport",
//     "/admin/reports/turnover",
//     "/admin/reports/authlist",
//     "/admin/casino/list",
//     "/admin/vcasino/list",
//     "/admin/pcasino/list",
//     "/admin/tcasino/list",
//     "/admin/casino/vip",
//     // Add more routes here where you don't want RightSidebar
//   ];

//   const shouldShowRightSidebar = !hideRightSidebarRoutes.includes(
//     location.pathname
//   );

//   return (
//     <>
//       <div>
//         <Header onToggleSidebar={toggleSidebar} />
//         <div className="main-content">
//           <LeftSidebar isOpen={isSidebarOpen} />
//           <div className={`page-content ${isSidebarOpen ? "expaned" : ""}`}>
//             {/* oulet page all render */}
//             <Outlet />
//             {/*  RightSidebar */}
//             {shouldShowRightSidebar && <RightSidebar />}
//             <Footer />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Layout;
