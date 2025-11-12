"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";
import { useAuthStore } from "@/app/store/authStore";
import UserAvatar from "./avater";
import { BiUser } from "react-icons/bi";

type HeaderProps = {
  text: string;
  showBackButton?: boolean; // Optional back button toggle
};

const HeaderCustom = ({ text, showBackButton = true }: HeaderProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setIsVisible(window.scrollY < lastScrollY || window.scrollY === 0);
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  console.log("hello");
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white text-gray-600 shadow-md"
      initial={{ y: -80 }}
      animate={{ y: isVisible ? 0 : -80 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Button (Only Show When Needed) */}
      {showBackButton && (
        <Link href={"/homepage"}>
          <MdArrowBackIos className="text-gray-600 h-8 w-8" />
        </Link>
      )}
      {/* Title */}
      <h1 className="text-lg font-semibold text-center flex-1 truncate">
        {text}
      </h1>
      {/*Right Side Content (Empty for Now) hello */}{" "}
      {!user && (
        <Link href={"/Login"}>
          <button className=" pc flex items-center justify-center gap-1 rounded-sm  py-1 mx-2 text-sm border-blue-600 border text-blue-600 bg-transparent hover:text-white">
            <BiUser /> Login
          </button>
        </Link>
      )}
      <UserAvatar profileImage={user?.profileImage} />
    </motion.header>
  );
};

export default HeaderCustom;
