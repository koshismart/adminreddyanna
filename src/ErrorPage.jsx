import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600 p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4 animate-bounce">
        403
      </h1>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized Action</h2>
      <p className="text-center max-w-md mb-6">
        Sorry, you don't have permission to access this page or perform this
        action.
      </p>
      <Link
        to="/"
        className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default ErrorPage;
