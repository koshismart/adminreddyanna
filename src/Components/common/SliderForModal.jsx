import React, { useState } from "react";
import cardsData from "../../assets/cards/data";

const SliderForModal = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data?.split(",").length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data?.split(",").length - 1 : prevIndex - 1
    );
  };


  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === data?.split(",").length - 15;
  return (
    <div className="relative max-w-full ps-3">
      <div className="overflow-hidden">
        <div
          className={`flex ${
            data?.split(",").length >= 15 ? "":"justify-center"
          }  md:gap-2 gap-1 transition-transform duration-500`}
          style={{ transform: `translateX(-${currentIndex * 44}px)` }}
        >
          {data
            ?.split(",")
            .filter((item) => item !== "")
            .map((v, idx) => (
              <img
                className="h-[34px] md:h-[44px] rounded-sm img-fluid"
                key={idx}
                src={cardsData?.find((card) => card.code == v).image}
                alt={v}
              />
            ))}
        </div>
      </div>
      {data?.split(",").length >= 15 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isPrevDisabled}
            className={`absolute top-1/2 -left-2 text-xl transform -translate-y-1/2 text-black font-semibold p-2 ${
              isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &#8249;
          </button>
          <button
            onClick={nextSlide}
            disabled={isNextDisabled}
            className={`absolute top-1/2 -right-5 text-xl transform -translate-y-1/2 text-black font-semibold p-2 ${
              isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

export default SliderForModal;
