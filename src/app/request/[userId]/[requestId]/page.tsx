"use client";

import { useAuthStore } from "@/app/store/authStore";
import UserAvatar from "@/components/avater";
import HeaderCustom from "@/components/HeaderCostum";
import Loading from "@/components/Loainding";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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
    _id: "string",
    createdAt: "string",
    guest: { userName: "string", _id: "hello" },
    host: { userName: "micky mouse" },

    event: { title: "string" },
    updatedAt: "string",
    accepted: false,
  });
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  async function getData() {
    if (!user) return;
    try {
      const res = await app.get(`/v1/request/${requestId}`);
      setRequest(res.data.data);
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!request) return;
    if (confirm("Are you sure you want to delete this request?")) {
      try {
        await app.delete(
          `https://agent-with-me-backend.onrender.com/v1/request/${request._id}`
        );
        setRequest(null);
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  }

  async function handleUpdate() {
    if (!request) return;
    try {
      setRequest({ ...request, accepted: true });
      await app.put(
        `https://agent-with-me-backend.onrender.com/v1/request/${request._id}?status=1`
      );
    } catch (error) {
      console.error("Error updating request:", error);
    }
  }

  useEffect(() => {
    // getData();
  }, [user]);

  if (loading || !user) return <Loading />;

  if (!request) {
    return (
      <>
        <HeaderCustom text="Request Details" />
        <div className="mt-8 text-center text-gray-500">
          Request not found or has been deleted.
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderCustom text="Request Details" />
      <div className="pt-10 h-lvh w-lvw">
        <div className="mt-8 p-6 max-w-lg mx-auto  dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <UserAvatar profileImage="/hello" />
            <p className="text-sm text-gray-500">
              Created: {new Date(request.createdAt).toLocaleString()}
            </p>
            <p className="font-semibold">
              Guest:{" "}
              <span className="font-normal">
                <a
                  href={`/profile/${request.guest._id}`}
                  className="text-white"
                >
                  {request.guest.userName}
                </a>
              </span>
            </p>
            <p className="font-semibold">
              Event: <span className="font-normal">{request.event.title}</span>
            </p>
            <p className="font-semibold">
              Host: <span className="font-normal">{request.host.userName}</span>
            </p>
            <p className="text-sm text-gray-500">
              Updated: {new Date(request.updatedAt).toLocaleString()}
            </p>
            <p className="font-semibold">
              Status:{" "}
              <span
                className={`${
                  request.accepted ? "text-green-600" : "text-yellow-600"
                } font-medium`}
              >
                {request.accepted ? "Accepted" : "Pending"}
              </span>
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Delete
            </button>

            {user.role === "host" && !request.accepted && (
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Accept Request
              </button>
            )}
            {user.role === "host" && !request.accepted && (
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Mark as attend
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestDetailsPage;
