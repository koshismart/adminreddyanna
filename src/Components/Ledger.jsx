import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "./component/Topbar";
import DatePicker from "react-datepicker";
import Select from "./component/Select";
import ButtonOnly from "./component/ButtonOnly";
import Table from "./component/Table";
import { MenuHanderContextBtn } from "./Context/MenuHandlerContext";
import { getLedger, getMyLedger } from "../Helper/ledger";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
import { decodedTokenData, signout } from "../Helper/auth";
import { Input } from "postcss";
import LedgerSettle from "./LedgerSettle";
import SkeletonLoader from "./loaders/SkeletonLoader1";
import SkeletonLoader2 from "./loaders/SkeletonLoader2";
import Table2 from "./component/Table2";

const Ledger = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const { menuLeftSmall } = useContext(MenuHanderContextBtn);

  const [cookies, setCookie, removeCookie] = useCookies(["Admin"]);

  const { userId } = decodedTokenData(cookies) || {}; //GET USER DATA

  // Date Filter  --------------------------------------------------------
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const oneMonthAgo = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      today.getDate()
    );
    return oneMonthAgo.toISOString().substring(0, 10);
  });

  const [ledgerData, setLedgerData] = useState([]);

  // GET ALL TYPE OF LEDGER DATA
  const { isLoading, data, refetch } = useQuery(
    ["ledger", { cookies, type, startDate, endDate }],
    async () => {
      let fetchData;
      switch (type) {
        case "my-ledger":
          fetchData = await getMyLedger(cookies);
          setLedgerData(fetchData);
          break;
        case "super-admin":
          fetchData = await getLedger(cookies, "SuperAdmin");
          setLedgerData(fetchData);
          break;
        case "admin":
          fetchData = await getLedger(cookies, "Admin");
          setLedgerData(fetchData);
          break;
        case "mini-admin":
          fetchData = await getLedger(cookies, "MiniAdmin");
          setLedgerData(fetchData);
          break;
        case "super-master":
          fetchData = await getLedger(cookies, "SuperMaster");
          setLedgerData(fetchData);
          break;
        case "master":
          fetchData = await getLedger(cookies, "Master");
          setLedgerData(fetchData);
          break;
        case "super-agent":
          fetchData = await getLedger(cookies, "SuperAgent");
          setLedgerData(fetchData);
          break;
        case "agent":
          fetchData = await getLedger(cookies, "Agent");
          setLedgerData(fetchData);
          break;
        case "client":
          fetchData = await getLedger(cookies, "Client");
          setLedgerData(fetchData);
          break;
        default:
          setLedgerData([]);
      }
      return fetchData;
    }
  );

  // IF ERROR SIGNOUT
  if (data?.error === "Token has expired" || data?.error === "Invalid token") {
    signout(userId, removeCookie, () => {
      navigate("/login");
      window.location.reload();
    });
  }

  useEffect(() => {
    refetch();
  }, [type]); // Refetch data when type changes

  // COMMON TABLE COLOUMN
  const columns = [
    {
      name: "User Detail",
      width: "150px",
      selector: (row) => row.userDetail,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Balance",
      selector: (row) => row.balance,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
  ];

  // FOR UPLINE LENA LEDGERS DATA  ----------------------------------------------------------------
  const uplinelenaledgerData = ledgerData?.ledger
    ?.filter((doc) => Number(doc?.dena) - Number(doc?.lena) > 0)
    ?.map((item) => ({
      userDetail: (
        <p className="font-medium text-sm whitespace-normal">
          {item?.createdFor?.upline?.PersonalDetails?.loginId +
            ` (${item?.createdFor?.upline?.PersonalDetails?.userName})`}
        </p>
      ),
      balance: (
        <p className="px-4 py-2 text-center font-medium flex justify-center gap-6 m-auto">
          <span className="m-auto">
            ₹{(Number(item?.dena) - Number(item?.lena))?.toFixed(2)}
          </span>
        </p>
      ),
    }));

  // FOR UPLINE DENA LEDGERS DATA  ----------------------------------------------------------------
  const uplinedenaledgerData = ledgerData?.ledger
    ?.filter((doc) => Number(doc?.lena) - Number(doc?.dena) > 0)
    ?.map((item) => ({
      userDetail: (
        <p className="font-medium text-sm whitespace-normal">
          {item?.createdFor?.upline?.PersonalDetails?.loginId +
            ` (${item?.createdFor?.upline?.PersonalDetails?.userName})`}
        </p>
      ),
      balance: (
        <p className="px-4 py-2 text-center font-medium flex justify-center gap-6 m-auto">
          <span className="m-auto">
            ₹{(Number(item?.lena) - Number(item?.dena))?.toFixed(2)}
          </span>
        </p>
      ),
    }));

  // FOR DOWNLINE LEDGERS (SUPERMASTER, MASTER, AGENT ETC...)  -------------------------------------
  const lenaledgerData = ledgerData?.ledger
    ?.filter((doc) => Number(doc?.lena) - Number(doc?.dena) > 0)
    ?.map((item) => ({
      userDetail: (
        <p className="font-medium text-sm whitespace-normal">
          {item?.createdFor?.PersonalDetails?.loginId +
            ` (${item?.createdFor?.PersonalDetails?.userName})`}
        </p>
      ),
      balance: (
        <p className="px-4 py-2 text-center font-medium flex justify-center gap-6 m-auto">
          <span className="m-auto">
            ₹{(Number(item?.lena) - Number(item?.dena))?.toFixed(2)}
          </span>
          <LedgerSettle
            item={item}
            bgColor={"bg-green-600"}
            bgBorder={"bg-gray-700"}
            textColor={"text-white"}
            title={<i class="ri-cash-fill text-sm"> Settle</i>}
            modeOfLenDen={"Credit (Lena)"}
            amount={(item.lena - item.dena).toFixed(2)}
            refetch={refetch}
          />
        </p>
      ),
    }));

  // FOR DOWNLINE LEDGERS (SUPERMASTER, MASTER, AGENT ETC...)  -------------------------------------
  const denaledgerData = ledgerData?.ledger
    ?.filter((doc) => Number(doc?.dena) - Number(doc?.lena) > 0)
    ?.map((item) => ({
      userDetail: (
        <p className="font-medium text-sm whitespace-normal">
          {item?.createdFor?.PersonalDetails?.loginId +
            ` (${item?.createdFor?.PersonalDetails?.userName})`}
        </p>
      ),
      balance: (
        <p className="px-4 py-2 text-center font-medium flex justify-center gap-6 m-auto">
          <span className="m-auto">
            ₹{(Number(item?.dena) - Number(item?.lena))?.toFixed(2)}
          </span>
          <LedgerSettle
            item={item}
            bgColor={"bg-green-600"}
            bgBorder={"bg-gray-700"}
            textColor={"text-white"}
            title={<i class="ri-cash-fill text-sm"> Settle</i>}
            modeOfLenDen={"Debit (Dena)"}
            amount={(item.dena - item.lena).toFixed(2)}
            refetch={refetch}
          />
        </p>
      ),
    }));

  // FOR DOWNLINE LEDGERS (SUPERMASTER, MASTER, AGENT ETC...)  -------------------------------------
  const clearlenadenaledgerData = ledgerData?.ledger
    ?.filter(
      (doc) =>
        Number(doc?.dena) == Number(doc?.lena) &&
        Number(doc?.dena) != 0 &&
        Number(doc?.lena) != 0
    )
    ?.map((item) => ({
      userDetail: (
        <p className="font-medium text-sm whitespace-normal">
          {item?.createdFor?.PersonalDetails?.loginId +
            ` (${item?.createdFor?.PersonalDetails?.userName})`}
        </p>
      ),
      balance: (
        <p className="font-medium text-sm">₹{item?.clear?.toFixed(2)}</p>
      ),
    }));

  return (
    <div className="w-full h-full py-2 ">
      <div className="md:m-4 m-2 bg-white border">
        <div className="flex items-center gap-2 justify-start p-5  bg-[#045662] text-white">
          <span
            onClick={() => navigate(-1)}
            className="font-semibold cursor-pointer"
          >
            <i class="ri-arrow-left-line m-auto"></i>
          </span>
          <h1 className="uppercase text-lg font-semibold">
            {type == "my-ledger" ? "my" : type} Ledger
          </h1>
        </div>
        {type == "my-ledger" ? (
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-5 py-4 sm:px-4 px-2">
            <div className="w-full bg-green-600 flex justify-between px-6 py-2 rounded-md text-white">
              <h2 className=" text-2xl  ">Lena Hai 👉</h2>
              <h2 className="text-2xl">
                ₹{" "}
                {ledgerData?.ledger
                  ?.filter((doc) => Number(doc?.dena) - Number(doc?.lena) > 0)
                  ?.reduce(
                    (acc, curr) =>
                      acc + (Number(curr?.dena) - Number(curr?.lena)),
                    0
                  )
                  ?.toFixed(2)}
              </h2>
            </div>
            <div className="w-full bg-red-600 flex justify-between px-6 py-2 rounded-md text-white">
              <h2 className=" text-2xl ">Dena Hai 👉</h2>
              <h2 className="text-2xl  ">
                ₹ {"-"}
                {ledgerData?.ledger
                  ?.filter((doc) => Number(doc?.lena) - Number(doc?.dena) > 0)
                  ?.reduce(
                    (acc, curr) =>
                      acc + (Number(curr?.lena) - Number(curr?.dena)),
                    0
                  )
                  ?.toFixed(2)}
              </h2>
            </div>
            <div className="w-full bg-slate-300 flex justify-between px-6 py-2 rounded-md text-white">
              <h2 className=" text-2xl  text-black">Balance 👉</h2>
              <h2
                className={`text-2xl ${
                  ledgerData?.ledger
                    ?.reduce(
                      (acc, curr) =>
                        acc + Number(curr?.dena) - Number(curr?.lena),
                      0
                    )
                    ?.toFixed(2) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ₹{" "}
                {ledgerData?.ledger
                  ?.reduce(
                    (acc, curr) =>
                      acc + Number(curr?.dena) - Number(curr?.lena),
                    0
                  )
                  ?.toFixed(2)}
              </h2>
            </div>
          </div>
        ) : (
          <div className="w-full grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-5 py-4 sm:px-4 px-2">
            <div className="w-full bg-green-600 flex justify-between px-6 py-2 rounded-md text-white">
              <h2 className=" text-2xl">Lena Hai 👇</h2>
              <h2 className="text-2xl">
                ₹
                {ledgerData?.ledger
                  ?.filter((doc) => Number(doc?.lena) - Number(doc?.dena) > 0)
                  ?.reduce(
                    (acc, curr) =>
                      acc + (Number(curr?.lena) - Number(curr?.dena)),
                    0
                  )
                  ?.toFixed(2)}
              </h2>
            </div>
            <div className="w-full overflow-x-hidden block md:hidden">
              <Table2 columns={columns} data={lenaledgerData} />
            </div>
            <div className="w-full bg-red-600 flex justify-between px-6 py-2 rounded-md text-white">
              <h2 className=" text-2xl ">Dena Hai 👇</h2>
              <h2 className="text-2xl  ">
                ₹
                {ledgerData?.ledger
                  ?.filter((doc) => Number(doc?.dena) - Number(doc?.lena) > 0)
                  ?.reduce(
                    (acc, curr) =>
                      acc + (Number(curr?.dena) - Number(curr?.lena)),
                    0
                  )
                  ?.toFixed(2)}
              </h2>
            </div>
            <div className="w-full overflow-x-hidden block md:hidden">
              <Table2 columns={columns} data={denaledgerData} />
            </div>
            <div className="w-full bg-slate-300 flex justify-between px-6 py-2 rounded-md text-white">
              <h2 className=" text-2xl text-black">Clear Hai 👇</h2>
              <h2 className=" text-2xl text-black">
                ₹
                {ledgerData?.ledger
                  ?.filter(
                    (doc) =>
                      doc.lena == 0 &&
                      doc.dena == 0 &&
                      doc?.statements?.length > 0
                  )
                  ?.reduce((acc, curr) => acc + Number(curr?.clear), 0)
                  ?.toFixed(2)}
              </h2>
            </div>
            <div className="w-full overflow-x-hidden block md:hidden">
              <Table2 columns={columns} data={clearlenadenaledgerData} />
            </div>
          </div>
        )}
        {type == "my-ledger" ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-5 py-4 sm:px-4 px-2">
            <div className="w-full overflow-x-hidden hidden md:block">
              {isLoading ? (
                <SkeletonLoader2 />
              ) : (
                <Table2 columns={columns} data={uplinelenaledgerData} />
              )}
            </div>
            <div className="w-full overflow-x-hidden hidden md:block">
              {isLoading ? (
                <SkeletonLoader2 />
              ) : (
                <Table2 columns={columns} data={uplinedenaledgerData} />
              )}
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-5 py-4 sm:px-4 px-2">
            <div className="w-full overflow-x-hidden hidden md:block">
              {isLoading ? (
                <SkeletonLoader2 />
              ) : (
                <Table2 columns={columns} data={lenaledgerData} />
              )}
            </div>
            <div className="w-full overflow-x-hidden hidden md:block">
              {isLoading ? (
                <SkeletonLoader2 />
              ) : (
                <Table2 columns={columns} data={denaledgerData} />
              )}
            </div>
            <div className="w-full overflow-x-hidden hidden md:block">
              {isLoading ? (
                <SkeletonLoader2 />
              ) : (
                <Table2 columns={columns} data={clearlenadenaledgerData} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ledger;
