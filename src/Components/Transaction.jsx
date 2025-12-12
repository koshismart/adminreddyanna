import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "./component/Table";
import Select from "./component/Select";
import ButtonOnly from "./component/ButtonOnly";
import DatePicker from "react-datepicker";
import Input from "./component/Input";
import Table2 from "./component/Table2";

const Transaction = () => {
  const { type } = useParams();
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
      name: "Collection Name",
      selector: (row) => row.amount,
      sortable: true,
      width: "130px",
      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Debit",
      selector: (row) => row.balance,
      sortable: true,
      width: "100px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Credit",
      selector: (row) => row.balance,
      sortable: true,
      width: "100px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Balance",
      selector: (row) => row.balance,
      sortable: true,
      width: "100px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Payment Type",
      selector: (row) => row.balance,
      sortable: true,
      width: "160px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Remark",
      selector: (row) => row.balance,
      sortable: true,
      width: "150px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
    {
      name: "Done By",
      selector: (row) => row.balance,
      sortable: true,
      width: "200px",

      style: {
        background: "#9FCDDF",
        border: "1px solid white",
      },
    },
  ];
  const data = [
    {
      narration: (
        <div className="flex flex-col">
          <h1 className="text-sm">Chips deposited to qwerty01</h1>
          <small className="text-xs">Jun 18 2024 08:57:03 PM</small>
        </div>
      ),
      amount: <p className="font-medium text-sm text-red-700">1,500.00</p>,
      balance: (
        <p className="font-medium text-sm text-green-800">289,556,433.00</p>
      ),
    },
    {
      narration: (
        <div className="flex flex-col">
          <h1 className="text-sm">Chips deposited to qwerty01</h1>
          <small className="text-xs">Jun 18 2024 08:57:03 PM</small>
        </div>
      ),
      amount: <p className="font-medium text-sm text-green-600">1,500.00</p>,
      balance: (
        <p className="font-medium text-sm text-green-800">289,556,433.00</p>
      ),
    },
  ];

  const date = new Date().toISOString().substring(0, 10);
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
            {type + " - Transaction"}
          </h1>
        </div>
        <div className="grid lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-2 grid-cols-2 w-full md:my-2 my-3">
          <div className="w-full flex items-center justify-center">
            <h2 className="text-red-600 text-xl font-semibold py-8">Dena : </h2>
          </div>
          <div className="w-full flex items-center justify-center">
            <h2 className="text-green-600 text-xl font-semibold py-8">
              Lena :{" "}
            </h2>
          </div>
          <div className="w-full flex items-center justify-center">
            <h2 className="text-red-600 text-xl font-semibold py-8">
              Balance: ( ){" "}
            </h2>
          </div>
          <div className="w-full flex items-center justify-center">
            <button className="btn btn-gray px-8 py-2">Delete</button>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-2 sm:px-4 px-2">
          <Select
            defaultName={"Client"}
            name={"client"}
            opt={["Yes", "No"]}
            // value={userLockedFilter}
            // onChange={(e) => {
            //   setUserLockedFilter(e.target.value);
            //   filterData(e);
            // }}
          />
          <Select
            defaultName={"Collection"}
            name={"fancylocked"}
            opt={["Yes", "No"]}
            // value={fancyLockedFilter}
            // onChange={(e) => {
            //   setFancyLockedFilter(e.target.value);
            //   filterData(e);
            // }}
          />
          <div className="w-full px-2 text-black border rounded-md flex justify-between">
            <DatePicker
              selected={date}
              // onChange={(date) => setStartDate(date)}
              className="w-full py-1 px-1"
              dateFormat="yyyy-MM-dd"
              withPortal
            />
            <i class="ri-calendar-todo-fill m-auto mr-1"></i>
          </div>
          <Input name={"amount"} type={"number"} placeholder={"Amount"} />
          <Select
            defaultName={"Payment Type"}
            name={"fancylocked"}
            opt={["Yes", "No"]}
            // value={fancyLockedFilter}
            // onChange={(e) => {
            //   setFancyLockedFilter(e.target.value);
            //   filterData(e);
            // }}
          />
          <Input name={"remark"} placeholder={"Remark"} />
        </div>
        <div className="flex w-[15%] my-3 mx-4 gap-2">
          <ButtonOnly
            bgColor={"bg-blue-400"}
            width={"w-full"}
            title={"Submit"}
          />
        </div>
        <div>
          <Table2 selectableRows={true} columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Transaction;
