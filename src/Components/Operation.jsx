import React from "react";
import Table from "./component/Table";
import { useNavigate } from "react-router-dom";
import Table2 from "./component/Table2";

const Operation = () => {
  const navigate = useNavigate();
  const columns = [
    {
      name: "Date",
      selector: (row) => row.narration,
      sortable: true,
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Operation",
      selector: (row) => row.amount,
      sortable: true,
      width: "200px",
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Description",
      selector: (row) => row.balance,
      sortable: true,
      width: "200px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
  ];

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
          <h1 className="uppercase text-lg font-semibold">{"Operation"}</h1>
        </div>

        <div>
          <Table2 columns={columns} data={[]} />
        </div>
      </div>
    </div>
  );
};

export default Operation;
