import React, { useContext } from "react";
import CardBox from "./component/CardBox";
import { nanoid } from "nanoid";
import { AdminDirectContext } from "./Context/AdminDirectFormContext";
import Table from "./component/Table";
import Topbar from "./component/Topbar";
import Table2 from "./component/Table2";
import { useMutation } from "react-query";
import { refreshRedisCacheAll } from "../Helper/auth";
import ErrorPopup from "../Popups/ErrorPopup";
import WarningPopup from "../Popups/WarningPopup";
import { useCookies } from "react-cookie";
import SuccessPopup from "../Popups/SuccessPopup";

const Setting = () => {
  const { profileBtn, accountBtn } = useContext(AdminDirectContext);
  const [cookies, setCookie, removeCookie] = useCookies(["Admin"]);

  const columns = [
    {
      name: "Title",
      selector: (row) => row.narration,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Sport",
      selector: (row) => row.amount,
      sortable: true,
      width: "200px",
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Open Date",
      selector: (row) => row.balance,
      sortable: true,
      width: "200px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Declared",
      selector: (row) => row.balance,
      sortable: true,
      width: "200px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Won By",
      selector: (row) => row.balance,
      sortable: true,
      width: "200px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Profit/Loss",
      selector: (row) => row.balance,
      sortable: true,
      width: "200px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
  ];

  const refreshRedisCacheMutation = useMutation(refreshRedisCacheAll, {
    onSuccess: (data) => {
      if (data.success === true) {
        return SuccessPopup(data?.msg || "Cache Restored Successfully");
      }
      if (data.success === false) {
        return ErrorPopup(
          data?.error ||
            data?.errors ||
            data?.msg ||
            data?.message ||
            "Something went wrong",
          2000
        );
      } else {
        return ErrorPopup("Something went wrong", 2000);
      }
    },
    onError: (error) => {
      return ErrorPopup(error || "Something went wrong", 2000);
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Handle form submission logic here
    try {
      const { isConfirmed } = await WarningPopup(
        "Are you sure you want to clear and restore cache !!!",
        null,
        "Yes, Clear It"
      );

      if (!isConfirmed) return; // Stop if the user clicks Cancel

      await refreshRedisCacheMutation.mutateAsync({
        cookies,
      });
    } catch (error) {
      return ErrorPopup(error.message, 2000);
    }
  };

  return (
    <div className="w-full h-full py-2 ">
      <div className="md:m-4 m-2 bg-white border">
        <Topbar
          backBtn={true}
          icon={"ri-trophy-line"}
          title={"Setting"}
          button={[]}
          dropdowns={[]}
        />
        <div className="w-full grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-5 py-4 sm:px-4 px-2">
          {[
            {
              title: "Statement",
              link: "/admin/accountStatement",
            },
            {
              title: "A/c operations",
              link: "/admin/wbt-operation",
            },
            {
              title: "Profit & loss",
              link: `/admin/profit-loss/${nanoid()}`,
            },
            {
              title: "All Banner",
              link: "/banner",
            },
            {
              title: "Page",
              link: "/pages",
            },
            {
              title: "Casino Slider",
              link: "/casino-sliders",
            },
          ].map((item, index) => {
            return (
              <div key={index}>
                <CardBox
                  classList="flex justify-center text-sm"
                  link={item.link}
                  title={item.title}
                />
              </div>
            );
          })}
          <div className={`w-full  bg-[#045662] rounded-sm text-white`}>
            <div className={`w-full py-5 cursor-pointer px-5`}>
              <h1
                onClick={() => {
                  profileBtn.setProfile((state) => !state);
                  setMenuClose(true);
                }}
                className="flex justify-center "
              >
                {"Change Password"}
              </h1>
            </div>
          </div>
          <div className={`w-full  bg-[#045662] rounded-sm text-white`}>
            <div className={`w-full py-5 cursor-pointer px-5`}>
              <h1 onClick={onSubmit} className="flex justify-center ">
                {"Restore Cache"}
              </h1>
            </div>
          </div>
        </div>
        <div>
          <Table2 columns={columns} data={[]} />
        </div>
      </div>
    </div>
  );
};

export default Setting;
