import React from "react";
import GradientButton from "./GradientButton";
import cardsData from "../../assets/cards/data";
import seven from "../../assets/7.webp";

const SevenOdds = () => {
  return (
    <div className="w-full my-2">
      <div className="bg-gray-300 grid grid-cols-3 w-full py-3 justify-items-center">
        <div className="w-full text-center">
          <GradientButton name="Low Card" rate={0} />
        </div>
        <div className="flex justify-center items-center">
          <img src={seven} />
        </div>
        <div className="w-full text-center">
          <GradientButton name="High Card" rate={0} />
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-3 my-2 justify-items-center">
        <div className="bg-gray-300 w-full grid grid-cols-2 justify-items-center">
          <div className="w-full text-center">
            <GradientButton name="Even" rate={0} />
          </div>
          <div className="w-full text-center">
            <GradientButton name="Odd" rate={0} />
          </div>
        </div>
        <div className="bg-gray-300 w-full grid grid-cols-2 justify-items-center">
          <div className="w-full text-center">
            <GradientButton
              name={"gh"}
              symbol={true}
              symbolTop={true}
              rate={0}
            />
          </div>
          <div className="w-full text-center">
            <GradientButton
              name={"hj"}
              symbol={true}
              symbolBottom={true}
              rate={0}
            />
          </div>
        </div>
      </div>
      {/* <div className="bg-gray-200 my-2 ">
        <div className="gird grid-rows-3 justify-items-center">
          <div className="flex justify-end items-center"> icon</div>
          <div className="flex justify-center items-center">
            <span>12</span>
          </div>
          <div className="flex justify-center items-center">
            <div className="container">
              <div className="flex mx-auto my-4 w-3/4 overflow-x-auto gap-4 justify-center">
                {cardsData?.map((i, idx) => (
                  <>
                    <img key={idx} className="w-10" src={i.image} />
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default SevenOdds;
