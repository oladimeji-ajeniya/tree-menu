import React from "react";

const Breadcrumb = () => {
  return (
    <div className="flex items-center space-x-2">
      {/* Folder Icon */}
      <div className="text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7a1 1 0 011-1h3.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0011 9h7a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
          />
        </svg>
      </div>

      {/* Slash */}
      <span className="text-gray-400">/</span>

      {/* Menu Text */}
      <span className="text-gray-800 font-medium">Menus</span>
    </div>
  );
};

export default Breadcrumb;
