import React, { useState } from 'react';

const Slider = ({ gettingCardData, cardsData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardArray = gettingCardData?.aall?.split(",");
  const totalCards = cardArray?.length;

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handlePrev}
        className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentIndex === 0}
      >
        Prev
      </button>
      <div className="flex gap-1 overflow-hidden">
        {cardArray?.map((v, idx) => (
          <img
            className={`w-[34px] rounded-md img-fluid transition-transform duration-300 ${idx < currentIndex ? '-translate-x-full' : ''} ${idx > currentIndex ? 'translate-x-full' : ''}`}
            key={idx}
            src={cardsData?.find((card) => card.code === v)?.image}
            alt={v}
          />
        ))}
      </div>
      <button
        onClick={handleNext}
        className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded ${currentIndex === totalCards - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={currentIndex === totalCards - 1}
      >
        Next
      </button>
    </div>
  );
};

export default Slider;
