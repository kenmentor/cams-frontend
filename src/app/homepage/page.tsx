"use client";

import SearchBar from "@/components/SearchBar";
import React, { useState, useEffect, Suspense } from "react";
import Searchbox from "@/components/searchbox";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import HouseMainComponent from "@/components/HouseMainComponent";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/Loainding";

interface Keyword {
  category: string;
  searchWord: string;
  limit: number;
}

const PageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [keyword, setKeyword] = useState<Keyword>({
    searchWord: "",
    limit: 50,
    category: "",
  });
  const [bardge, setBardge] = useState(1);

  useEffect(() => {
    setBardge(1);
    if (searchParams) {
      const lga = searchParams.get("lga") || "";
      const landmark = searchParams.get("landmark") || "";
      const category = searchParams.get("category") || "";

      setKeyword({
        searchWord: landmark || lga,
        limit: 50,
        category,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    const query = new URLSearchParams();
    if (keyword.category) query.set("category", keyword.category);

    router.replace(`?${query.toString()}`);
  }, [keyword, router]);

  return (
    <>
      <div className="min-h-screen bg-[#1C1C1E] text-white pt-16 antialiased font-sans">
        {/* Header Section */}
        <motion.header
          className="px-6 py-10 bg-[#2C2C2E]/80 backdrop-blur-md shadow-sm border-b border-[#3A3A3C] mx-auto w-full z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          role="banner"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Welcome to <span className="text-[#0A84FF]">CampusPulse</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-400 mt-3 max-w-2xl mx-auto">
              Browse thousands of upcoming campus events and empower student
              leaders to organize, coordinate volunteers, and engage your
              community.
            </p>
          </div>
        </motion.header>

        {/* Search Section */}

        <div className="max-w-4xl mx-auto space-y-4 z-10">
          {/* SearchBar */}
          <SearchBar setKeyword={setKeyword} searchType="location" />

          {/* Searchbox */}

          <Searchbox setKeyword={setKeyword} />
        </div>

        {/* Main Listing / Results */}

        <HouseMainComponent page={true} keyword={keyword} bardge={bardge} />
      </div>

      <Footer />
    </>
  );
};

const Page: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <PageContent />
  </Suspense>
);

export default Page;
