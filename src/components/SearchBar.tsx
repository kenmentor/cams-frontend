"use client";

import React from "react";
import { MdLocationSearching, MdSearch } from "react-icons/md";
import { LuUserSearch } from "react-icons/lu";
import { BiUser } from "react-icons/bi";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import UserAvatar from "@/components/avater";

interface Keyword {
  searchWord: string;
  limit: number;
  category?: string;
  id?: string;
}

type SearchBarProps = {
  setKeyword: React.Dispatch<React.SetStateAction<Keyword>>;
  searchType?: "location" | "word" | "user";
};

const SearchBar = ({ setKeyword, searchType = "word" }: SearchBarProps) => {
  const user = useAuthStore((state) => state.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword((prev) => ({
      ...prev,
      searchWord: e.target.value,
    }));
  };

  const iconMap = {
    location: (
      <MdLocationSearching className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    ),
    word: (
      <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    ),
    user: (
      <LuUserSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
    ),
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 py-3 bg-white dark:bg-[#111111] shadow-lg flex items-center gap-4 backdrop-blur-sm">
      {/* Search Input */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search for event..."
          className="w-full h-12 pl-12 pr-4 rounded-2xl bg-gray-100 dark:bg-[#1C1C1E] text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300 shadow-sm hover:shadow-md"
          onChange={handleChange}
        />
        {iconMap[searchType]}
      </div>

      {/* Sign Up Button */}
      {!user && (
        <Link href="/Signup">
          <button className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white transition-all duration-300 font-medium text-sm">
            <BiUser size={18} /> Sign Up
          </button>
        </Link>
      )}

      {/* User Avatar */}
      {user && <UserAvatar />}
    </header>
  );
};

export default SearchBar;
