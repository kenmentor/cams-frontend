"use client";
interface user {
  _id: string;
  email?: string;
  userName?: string;
  rank?: string;
  adminVerified?: boolean;
  role?: string;
  profileImage?: string;
}
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { BiCrown, BiHome } from "react-icons/bi";
import { useAuthStore } from "../store/authStore";
import Loading from "@/components/Loainding";

const Page = () => {
  const [users, setUsers] = useState<user[]>([]);
  const userData = useAuthStore((state) => state.user);
  console.log(userData);
  const app = axios.create({
    baseURL: "https://agent-with-me-backend.onrender.com",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  async function getData() {
    const data = await app.get(
      "https://agent-with-me-backend.onrender.com/v1/user/pioneer"
    );
    console.log(data.data);
    setUsers(data.data.data);
  }
  useEffect(() => {
    getData();
  }, []);
  if (!users && !userData) return <Loading />;
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      <div className="text-center mb-12">
        <a href="/homepage">
          <button className="hover:bg-gray-950 bg-black border-yellow-400 fixed top-1 left-1 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-400/40 shadow-lg hover:shadow-yellow-400/30 transition-all bg-opacity-0 border-opacity-40">
            <BiHome className="w-8 h-8 text-yellow-400 " />
          </button>
        </a>
        <div className="flex items-center justify-center gap-2">
          <BiCrown className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Hall of Fame
          </h2>
          <BiCrown className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="mt-4 text-gray-300 text-lg">
          Honoring our first {users?.length} legendary pioneers 🚀
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-6">
        {users.map((user, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            className={` ${
              user?._id === userData?._id && "animate-bounce"
            } relative p-4 rounded-2xl bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent border border-yellow-400/40 shadow-lg hover:shadow-yellow-400/30 transition-all`}
          >
            <div
              className={` ani absolute inset-0 rounded-2xl bg-gradient-to-tr from-yellow-400/20 via-transparent to-yellow-400/10 blur-xl opacity-40`}
            ></div>
            <div className="relative text-center">
              <p className="text-lg font-semibold">{user.userName}</p>
              <span className="text-xs text-gray-400">Founding Member</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Page;
