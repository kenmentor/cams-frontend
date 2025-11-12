"use client";

import React, { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { motion } from "framer-motion";
import Price from "./price";
import { useAuthStore } from "@/app/store/authStore";

import { useRouter } from "next/navigation";
import { propertyCategory } from "@/app/data";

interface keyword {
  searchWord: string;
  limit: number;
  category?: string;
  id?: string;
}
type SearchboxProps = {
  setKeyword: React.Dispatch<React.SetStateAction<keyword>>;
};

const Searchbox = ({ setKeyword }: SearchboxProps) => {
  const [activeCategories, setActiveCategories] = useState<string>();
  const [price, setPrice] = useState(false);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  console.log(activeCategories);
  const toggleCategory = (category: string) => {
    setActiveCategories(category);
  };

  function onclickPrice() {
    setPrice((prev) => !prev);
  }
  function handleClick() {
    router.push("/upload");
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-3">
      <nav className="flex  gap-3">
        {/* Upload Button */}
        {user?.role == "host" && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="flex items-center justify-center gap-1 rounded-md px-4 py-2 text-sm font-medium bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition-all"
          >
            <IoAdd className="size-5 font-bold" />
            <span className="hidden sm:inline">Create an event</span>
          </motion.button>
        )}

        {/* Price Toggle */}

        {/* Category Select */}

        {propertyCategory.map((element, index) => (
          <motion.option
            className={` outline-blue-500 border flex justify-center items-center text-blue-500 w-full  px-3 py-2 rounded-md text-sm cursor-pointer  ${
              activeCategories == element && "bg-blue-500 text-white"
            }`}
            key={index}
            onClick={() => toggleCategory(element)}
            whileTap={{ scale: 0.95 }}
            value={element}
          >
            {element}
          </motion.option>
        ))}
      </nav>

      {/* Price Input */}
      {price && <Price setKeyword={setKeyword} />}

      {/* Advanced Filter Button */}
    </div>
  );
};

export default Searchbox;
