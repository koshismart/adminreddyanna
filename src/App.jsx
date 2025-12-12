import React, { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// Icon CSS
import "@mdi/font/css/materialdesignicons.min.css";

const Login = lazy(() => import("./Login/Login"));
const Layout = lazy(() => import("./Components/Layout"));
const MultiLoginAccount = lazy(() =>
  import("./Components/component/multiLoginAccount")
);
const CreateAccount = lazy(() =>
  import("./Components/component/account/CreateAccount")
);
const AccountList = lazy(() =>
  import("./Components/component/account/AccountList")
);
const Bank = lazy(() => import("./Components/component/report/Bank"));
const AccountStatement = lazy(() =>
  import("./Components/component/report/AccountStatement")
);
const PartyWinLoss = lazy(() =>
  import("./Components/component/report/PartyWinLoss")
);
const CurrentBets = lazy(() =>
  import("./Components/component/report/CurrentBets")
);
const Userhistory = lazy(() =>
  import("./Components/component/report/Userhistory")
);
const GeneralLock = lazy(() =>
  import("./Components/component/report/GeneralLock")
);
const TurnOver = lazy(() => import("./Components/component/report/TurnOver"));
const OurCasino = lazy(() => import("./Components/component/casino/OurCasino"));
const TemboCasino = lazy(() =>
  import("./Components/component/casino/TemboCasino")
);
const VipCasino = lazy(() => import("./Components/component/casino/VipCasino"));
const PremiumCasino = lazy(() =>
  import("./Components/component/casino/PremiumCasino")
);
const VirtualCasino = lazy(() =>
  import("./Components/component/casino/VirtualCasino")
);
const UserAuthnatication = lazy(() =>
  import("./Components/component/report/UserAuthnatication")
);
const OurCasinoResult = lazy(() =>
  import("./Components/component/report/OurCasinoResult")
);
const LiveCasinoResult = lazy(() =>
  import("./Components/component/report/LiveCasinoResult")
);

const App = () => {
  return (
    <>
      <Suspense
        fallback={
          <div
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <i className="fa fa-spinner fa-spin" style={{ fontSize: "40px" }} />
          </div>
        }
      >
        <Routes>
          {/* Default redirect */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route
              path="/admin/createaccount"
              element={<MultiLoginAccount />}
            />
            {/* <Route path="/users" element={<AccountList />} /> */}
            <Route
              path="/user/:usertype?/:uniqueId?/:userId?"
              element={<AccountList />}
            />
            <Route path="/user" element={<AccountList />} />
            <Route
              path="/current-bets/:usertype?/:uniqueId?/:userId?"
              element={<CurrentBets />}
            />
            <Route path="/admin/current-bets" element={<CurrentBets />} />

            <Route path="/admin/users/insertuser" element={<CreateAccount />} />
            {/* <Route path="/admin/reports/bank" element={<Bank />} /> */}
            <Route
              path="/admin/reports/bank/:uniqueId?/:userId?"
              element={<Bank />}
            />
            <Route path="/admin/reports/bank" element={<Bank />} />
            <Route
              path="/admin/reports/accountstatement"
              element={<AccountStatement />}
            />
            <Route
              path="/admin/reports/profitloss"
              element={<PartyWinLoss />}
            />
            <Route
              path="/admin/reports/currentbets"
              element={<CurrentBets />}
            />
            <Route
              path="/admin/reports/userhistory"
              element={<Userhistory />}
            />
            <Route path="/admin/settings/userlock" element={<GeneralLock />} />
            <Route path="/admin/reports/turnover" element={<TurnOver />} />
            <Route path="/admin/casino/list" element={<OurCasino />} />
            <Route path="/admin/vcasino/list" element={<VirtualCasino />} />
            <Route path="/admin/pcasino/list" element={<PremiumCasino />} />
            <Route path="/admin/tcasino/list" element={<TemboCasino />} />
            <Route path="/admin/casino/vip" element={<VipCasino />} />
            <Route
              path="/admin/reports/authlist"
              element={<UserAuthnatication />}
            />
            <Route
              path="/admin/reports/casinoresult"
              element={<OurCasinoResult />}
            />
            <Route
              path="/admin/reports/livecasinoreport"
              element={<LiveCasinoResult />}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
