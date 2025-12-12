import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Table from "./component/Table";
import { useQuery } from "react-query";
import { decodedTokenData, signout } from "../Helper/auth";
import { useCookies } from "react-cookie";
import { getLoginReport } from "../Helper/users";
import SkeletonLoader from "./loaders/SkeletonLoader1";
import moment from "moment";
import Table2 from "./component/Table2";

const Reports = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirected from user data to here
  const clientData = location.state?.data || null;

  const [cookies, setCookie, removeCookie] = useCookies(["Admin"]);

  const { userId } = decodedTokenData(cookies) || {}; //GET USER DATA

  const [myData, setMyData] = useState([]);

  // Fetching reports based on type
  const { isLoading, data, refetch } = useQuery(
    ["reports", { cookies, type }],
    async () => {
      if (!type) return null;

      let fetchData;
      try {
        fetchData = await getLoginReport({
          cookies,
          loginId: clientData?.PersonalDetails?.loginId || null, // Conditionally send loginId
        });

        if (fetchData?.loginReports) {
          setMyData(fetchData?.loginReports.reverse());
        } else {
          setMyData([]);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setMyData([]);
      }

      return fetchData;
    },
    {
      enabled: !!type, // Ensures query runs only when type is valid
    }
  );

  console.log(data);

  // Handle token expiration errors
  useEffect(() => {
    if (
      data?.error === "Token has expired" ||
      data?.error === "Invalid token"
    ) {
      signout(userId, removeCookie, () => {
        navigate("/login");
        window.location.reload();
      });
    }
  }, [data, removeCookie, navigate]);

  // Refetch data on type change
  useEffect(() => {
    refetch();
  }, [type, refetch]);

  // Define table columns
  const columns = [
    {
      name: "S.No",
      selector: (row) => row.sno,
      width: "60px",
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Region",
      selector: (row) => row.region,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "ISP",
      selector: (row) => row.isp,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "IP-Address",
      selector: (row) => row.ipAddress,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Login Time (IST)",
      width: "150px",
      selector: (row) => row.loginDate,
      sortFunction: (a, b) => (moment(a).isBefore(b) ? -1 : 1),
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
  ];

  // Map API data for the table
  const apiData = myData?.map((item, index) => ({
    sno: <p className="font-medium text-sm">{index + 1}</p>,
    country: <h1 className="font-medium text-sm">{item?.country}</h1>,
    region: <h1 className="font-medium text-sm">{item?.region}</h1>,
    isp: <h1 className="font-medium text-sm">{item?.isp}</h1>,
    ipAddress: <h1 className="font-medium text-sm">{item?.IpAddress}</h1>,
    loginDate: <h1 className="font-medium text-sm">{item?.loginDate}</h1>,
  }));

  return (
    <div className="w-full h-full py-2">
      <div className="md:m-4 m-2 bg-white border">
        <div className="flex items-center gap-2 justify-start p-5 bg-[#045662] text-white">
          <span
            onClick={() => navigate(-1)}
            className="font-semibold cursor-pointer"
          >
            <i className="ri-arrow-left-line m-auto"></i>
          </span>
          <h1 className="uppercase text-lg font-semibold">
            {type} Reports{" "}
            {clientData ? (
              <span>
                ➢ {clientData?.PersonalDetails?.loginId} (
                {clientData?.PersonalDetails?.userName})
              </span>
            ) : (
              "➢ My Login Reports"
            )}
          </h1>
        </div>
        <div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <Table2 columns={columns} data={apiData} isLoading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
