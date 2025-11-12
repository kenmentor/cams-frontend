import React from "react";
import { MdLocationSearching, MdSearch } from "react-icons/md";
import { useAuthStore } from "@/app/store/authStore";
import UserAvatar from "./avater";
import { LuUserSearch } from "react-icons/lu";
import Link from "next/link";
import { BiUser } from "react-icons/bi";

// Define types for props
interface keyword {
  searchWord: string;
  limit: number;
  category?: string;
  id?: string;
}

type SearchBarProps = {
  setKeyword: React.Dispatch<React.SetStateAction<keyword>>;
  searchType?: string;
};

const SearchBar = ({ setKeyword, searchType }: SearchBarProps) => {
  const user = useAuthStore((state) => state.user);
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword((prev) => ({
      ...prev,
      searchWord: e.target.value,
    }));
  };

  return (
    <header
      className={`fixed left-0 right-0 bg-white top-0 px-6 py-3 flex items-center ${
        user ? "gap-4" : "gap-4"
      } shadow-md z-50`}
    >
      {/* Search Input Wrapper */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search with location..."
          className="w-full h-12 pl-12 pr-4 rounded bg-gray-100 text-gray-700 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        {/* Search Icon Inside Input */}
        {searchType == "location" && (
          <MdLocationSearching className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        )}

        {searchType == "word" && (
          <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        )}
        {searchType == "user" && (
          <LuUserSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
        )}
        {}
      </div>
      {!user && (
        <Link href={"/Signup"}>
          <button className=" flex items-center justify-center gap-1 rounded-sm  py-1  text-sm border-blue-600 border text-blue-600 bg-transparent hover:text-white">
            <BiUser /> Sign Up
          </button>
        </Link>
      )}
      <UserAvatar />
    </header>
  );
};

export default SearchBar;
