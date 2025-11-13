"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import Footer from "@/components/footer";
import Loading from "@/components/Loainding";
import SearchBar from "@/components/SearchBar";
import UserComponent from "@/components/UserComponent";
import { BiUserX } from "react-icons/bi";
import Req from "@/app/utility/axois";
interface Data {
  _id: string;
  email?: string;
  userName?: string;
  rank?: string;
  adminVerified?: boolean;
  role?: string;
  profileImage?: string;
}

interface Keyword {
  min?: string;
  max?: string;
  type?: string;
  searchWord?: string;
  limit?: number;
  lga?: string;
  state?: string;
  landmark?: string;
  category?: string;
  id?: string;
}

const Page = () => {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState<Keyword>();
  const user = useAuthStore((state) => state.user);

  const { base, app } = Req;

  async function getData() {
    setLoading(true);
    try {
      const response = await app.get(
        `${base}/user?email=${keyword?.searchWord || ""}`
      );
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  // Fetch when user logs in or keyword changes
  useEffect(() => {
    if (user) getData();
  }, [user, keyword]);

  return (
    <>
      <main className="px-4 pt-14 sm:px-10 lg:px-8 py-10 max-w-7xl mx-auto min-h-screen">
        {/* Search */}
        <div className="mb-8">
          <SearchBar setKeyword={setKeyword} searchType="user" />
        </div>

        {/* User List */}
        {loading ? (
          <Loading />
        ) : data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.map((item) => (
              <UserComponent
                key={item._id}
                _id={item._id}
                email={item.email}
                userName={item.userName}
                adminVerified={item.adminVerified}
                rank={item.rank}
                role={item.role}
                profileImage={item.profileImage}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-16">
            <BiUserX className="text-6xl mb-4 text-gray-400" />
            <p className="text-lg font-medium">
              No users found matching your search.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Page;
