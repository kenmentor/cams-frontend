"use client";

import React from "react";
import { BiLoader } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="flex flex-col items-center gap-4">
        {/* Loading text */}
        <span className="text-white text-lg font-medium animate-pulse">
          Loading...
        </span>

        {/* Spinner */}
        <BiLoader size={48} className="text-white animate-spin" />
      </div>
    </div>
  );
};

export default Loading;
