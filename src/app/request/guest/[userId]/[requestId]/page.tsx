"use client";

import { useAuthStore } from "@/app/store/authStore";
import UserAvatar from "@/components/avater";
import HeaderCustom from "@/components/HeaderCostum";
import Loading from "@/components/Loainding";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdCheckCircle, MdPendingActions, MdDelete } from "react-icons/md";

interface RequestData {
  _id: string;
  createdAt: string;
  guest: { userName: string; _id: string };
  host: { userName: string };
  event: { title: string };
  updatedAt: string;
  accepted?: boolean;
}

const app = axios.create({
  baseURL: "https://agent-with-me-backend.onrender.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const RequestDetailsPage = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState<RequestData | null>({
    _id: "",
    createdAt: "hello",
    guest: { userName: "mike", _id: "kekek" },
    host: { userName: "mike" },
    event: { title: "hello event" },
    updatedAt: "0404/44/",
    accepted: true,
  });
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Fetch request data
  async function getData() {
    if (!user) return;
    setLoading(true);
    try {
      const res = await app.get(`/v1/request/${requestId}`);
      setRequest(res.data.data);
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  }

  // Delete request
  async function handleDelete() {
    if (!request) return;
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      await app.delete(`/v1/request/${request._id}`);
      setRequest(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  }

  // Accept request
  async function handleAccept() {
    if (!request) return;
    try {
      setRequest({ ...request, accepted: true });
      await app.put(`/v1/request/${request._id}?status=1`);
    } catch (error) {
      console.error("Error updating request:", error);
    }
  }

  useEffect(() => {
    getData();
  }, [user]);

  if (loading || !user) return <Loading />;

  if (!request) {
    return (
      <>
        <HeaderCustom text="Request Details" />
        <div className="mt-20 text-center text-gray-400 dark:text-gray-300">
          Request not found or has been deleted.
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderCustom text="Request Details" />
      <div className="pt-24 px-4 min-h-[80vh] flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-lg w-full bg-gray-900 dark:bg-[#1C1C1E] rounded-xl shadow-xl p-6 border border-gray-800"
        >
          <div className="flex flex-col items-center gap-4">
            <UserAvatar profileImage="/hello" />
            <p className="text-gray-400 text-sm">
              Created: {new Date(request.createdAt).toLocaleString()}
            </p>
            <p className="text-white font-semibold">
              Guest:{" "}
              <a
                href={`/profile/${request.guest._id}`}
                className="text-[#0A84FF] hover:underline"
              >
                {request.guest.userName}
              </a>
            </p>
            <p className="text-white font-semibold">
              Event: <span className="font-normal">{request.event.title}</span>
            </p>
            <p className="text-white font-semibold">
              Host: <span className="font-normal">{request.host.userName}</span>
            </p>
            <p className="text-gray-400 text-sm">
              Updated: {new Date(request.updatedAt).toLocaleString()}
            </p>

            <div className="flex items-center gap-2 mt-2">
              {request.accepted ? (
                <MdCheckCircle className="text-green-500 w-6 h-6" />
              ) : (
                <MdPendingActions className="text-yellow-400 w-6 h-6" />
              )}
              <span
                className={`${
                  request.accepted ? "text-green-400" : "text-yellow-400"
                } font-medium`}
              >
                {request.accepted ? "Accepted" : "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
            >
              <MdDelete className="w-5 h-5" /> Delete
            </motion.button>

            {user.role === "host" && !request.accepted && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
                >
                  <MdCheckCircle className="w-5 h-5" /> Accept Request
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAccept}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition"
                >
                  Mark as Attended
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RequestDetailsPage;
