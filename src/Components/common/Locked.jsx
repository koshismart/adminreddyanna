import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Locked = ({ item, grid, oddEven, single }) => {
  return (
    <>
      {single ? (
        <div className={`${grid && "grid grid-cols-1 w-full"}`}>
          <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
            <span className="text-white opacity-100 uppercase">
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
          <div
            className={`bg-blue-300 w-full cursor-auto text-center  font-semibold uppercase`}
          >
            <h1 className="font-semibold text-sm">{item?.b1}</h1>
            <p className="font-normal text-xs">{item?.bs1}</p>
          </div>
          <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
            <span className="text-white">
              {" "}
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
        </div>
      ) : (
        <div className={`${grid && "grid grid-cols-2"}`}>
          <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
            <span className="text-white opacity-100 uppercase">
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
          <div
            className={`bg-blue-300 cursor-auto text-center ${
              grid ? "w-6 md:w-12" : "w-10 md:w-12"
            } font-semibold uppercase`}
          >
            <h1 className="font-semibold text-sm">{item?.b1}</h1>
            <p className="font-normal text-xs">{item?.bs1}</p>
          </div>
          <div className="absolute inset-0 bg-black opacity-50 flex w-full h-full justify-center items-center font-bold uppercase z-10">
            <span className="text-white">
              {" "}
              <FontAwesomeIcon icon={faLock} />
            </span>
          </div>
          <div
            className={`${
              oddEven ? "bg-blue-300" : "bg-red-300"
            }   cursor-pointer text-center ${
              grid ? "w-6 md:w-12" : "w-10 md:w-12"
            }  font-semibold uppercase`}
          >
            <h1 className="font-semibold text-sm">{item?.l1}</h1>
            <p className="font-normal text-xs">{item?.ls1}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Locked;
