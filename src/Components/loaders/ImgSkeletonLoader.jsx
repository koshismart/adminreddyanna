// SkeletonLoader.jsx
import React from "react";

const ImgSkeletonLoader = () => {
  return (
    <div className="bg-gray-100 p-2">
      <div className="flex w-full flex-col gap-4 text-center">
        <div className="skeleton h-24 w-24 shrink-0 rounded-full m-auto"></div>
      </div>
    </div>
  );
};

export default ImgSkeletonLoader;
