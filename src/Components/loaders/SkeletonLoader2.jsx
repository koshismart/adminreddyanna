// SkeletonLoader.jsx
import React from "react";

const SkeletonLoader2 = () => {
  return (
    <div className="bg-gray-100 p-6">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-2 w-full">
            <div className="skeleton h-2"></div>
            <div className="skeleton h-2"></div>
            <div className="skeleton h-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader2;
