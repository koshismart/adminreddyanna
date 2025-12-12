// SkeletonLoader.jsx
import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 opacity-75">
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-32 w-32 shrink-0 rounded-full bg-gray-300/50"></div>
          <div className="flex flex-col gap-4 w-full">
            <div className="skeleton h-4"></div>
            <div className="skeleton h-4"></div>
            <div className="skeleton h-4"></div>
          </div>
        </div>
        <div className="skeleton h-60 w-full"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
