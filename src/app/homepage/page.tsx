"use client";

import SearchBar from "@/components/SearchBar";
import React, { useState, useEffect, Suspense } from "react";
import Searchbox from "@/components/searchbox";
import { motion } from "framer-motion";
import Footer from "@/components/footer";
import HouseMainComponent from "@/components/HouseMainComponent";
import { useSearchParams, useRouter } from "next/navigation";
import Loading from "@/components/Loainding";
import Resource from "@/components/Resource";

// Define resource type
interface keyword {
  category: string;
  searchWord: string;
  limit: number;
}

const PageContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [keyword, setKeyword] = useState<keyword>({
    searchWord: "",
    limit: 50,

    category: "",
  });
  const [bardge, setBardge] = useState(1);

  // ✅ 1. Load initial state from URL
  useEffect(() => {
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

  // ✅ 2. Whenever keyword changes → update URL
  useEffect(() => {
    const query = new URLSearchParams();

    if (keyword.category) query.set("category", keyword.category);

    // Push new URL without reload
    router.replace(`?${query.toString()}`);
  }, [keyword, router]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 pt-16">
        {/* Header Section */}
        <motion.header
          className="px-6 py-8 bg-blue-600 shadow-md text-white text-center mx-auto w-full "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Welcome to CampusPulse
          </h1>
          <p className="text-gray-200 text-sm sm:text-base md:text-lg mt-2">
            Browse thousands of available and upcoming event wihtin Campus
          </p>
        </motion.header>

        {/* Search Section */}
        <section className="px-6 py-6 bg-white shadow-sm">
          <div className="max-w-4xl mx-auto">
            <SearchBar setKeyword={setKeyword} searchType="location" />

            <div className="mt-4" onScroll={() => setBardge(1)}>
              <Searchbox setKeyword={setKeyword} />
            </div>
          </div>
        </section>

        <HouseMainComponent page={true} keyword={keyword} bardge={bardge} />
      </div>
      <Footer />
    </>
  );
};

const Page: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <PageContent />
    </Suspense>
  );
};

export default Page;
