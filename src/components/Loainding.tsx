"use client";

import React from "react";

import { BiLoader } from "react-icons/bi";

const Loading = () => {
  return (
    <div className="fixed w-full inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 h-full">
      <span className="animate-bounce delay-75">Loading</span>
      <span className="animate-bounce">
        <BiLoader size={48} className="text-white animate-spin " />
      </span>
    </div>
  );
};

export default Loading;
