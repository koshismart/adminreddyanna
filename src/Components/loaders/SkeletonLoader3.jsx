// SkeletonLoader.jsx
import React from "react";

const SkeletonLoader3 = () => {
  return (
    <div className="bg-gray-100 p-2">
      <div className="flex w-full flex-col gap-4">
        <div className="w-full flex items-center gap-4">
          <div className="skeleton h-9 w-9 shrink-0 rounded-full"></div>
          <div className="flex flex-col gap-2 w-16">
            <div className="skeleton h-2"></div>
            <div className="skeleton h-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader3;
