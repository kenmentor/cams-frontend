"use client";

import { useAuthStore } from "@/app/store/authStore";
import HeaderCustom from "@/components/HeaderCostum";
import Loading from "@/components/Loainding";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { MdVerified } from "react-icons/md";

interface RequestData {
  _id: string;
  createdAt: string;
  guest: string;
  host: string;
  house: string;
  accepted: boolean;
  updatedAt: string;
}

const app = axios.create({
  baseURL: "https://agent-with-me-backend.onrender.com",
  // baseURL: "https://localhost:5036",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const RequestsPage = () => {
  const { userId } = useParams();
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  async function getData() {
    if (!user) return;

    try {
      const res = await app.get(
        `https://agent-with-me-backend.onrender.com/v1/request/list/${userId}?role=${user.role}`
        // `http://localhost:5036/v1/request/list/${userId}?role=${user.role}`
      );
      setRequests(res.data.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, [user]);

  return (
    <>
      <HeaderCustom text="Your Requests" />
      <div className="flex flex-col gap-4 mt-8 p-4">
        {loading && <Loading />}

        {!loading && requests.length === 0 && (
          <div className="bg-gray-100 dark:bg-gray-800 text-center p-6 rounded-xl shadow">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {user?.role === "guest"
                ? "You have not sent any requests yet."
                : "You have not received any requests yet."}
            </p>
          </div>
        )}

        {!loading &&
          requests.length > 0 &&
          requests.map((request) => (
            <a
              key={request._id}
              href={`${user?.role === "guest" ? request.guest : request.host}/${
                request._id
              }`}
              className="block bg-white dark:bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {request.accepted && <MdVerified className="text-green-500" />}{" "}
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  Created: {new Date(request.createdAt).toLocaleString()}
                </p>
                <p className="font-semibold">
                  Guest: <span className="font-normal">{request.guest}</span>
                </p>
                <p className="font-semibold">
                  Host: <span className="font-normal">{request.host}</span>
                </p>
                <p className="font-semibold">
                  House: <span className="font-normal">{request.house}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Updated: {new Date(request.updatedAt).toLocaleString()}
                </p>
              </div>
            </a>
          ))}
      </div>
    </>
  );
};

export default RequestsPage;
