"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loainding";
import HeaderCustom from "@/components/HeaderCostum";
import { useAuthStore } from "@/app/store/authStore";
import { useReactToPrint } from "react-to-print";
import { FaTrash, FaCheck } from "react-icons/fa";
import { findSourceMap } from "node:module";

interface RequestData {
  _id: string;
  createdAt: string;
  accepted?: boolean;
  guest: { userName: string } | string;
  host: { userName: string } | string;
  event: { _id?: string; title?: string; thumbnail: string } | string;
  house?: string;
  note?: string;
}

const app = axios.create({
  baseURL: "https://agent-with-me-backend.onrender.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default function RequestsPage() {
  const { userId } = useParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [requests, setRequests] = useState<RequestData[]>([
    {
      _id: "req_001",
      createdAt: "2025-11-25T10:00:00Z",
      accepted: true,
      guest: { userName: "John Emmanuel" },
      host: { userName: "Dr. Kingsley Okoro" },
      event: { _id: "event_001", title: "Tech Innovators Summit" },
      house: "Faculty of Physical Sciences",
      note: "First-time visitor",
    },
    {
      _id: "req_002",
      createdAt: "2025-11-26T14:30:00Z",
      accepted: false,
      guest: "Chioma Okafor",
      host: { userName: "Prof. Bassey Etim" },
      event: { title: "UNICAL Cultural Festival", _id: "event_002" },
      house: "Faculty of Arts",
      note: "Cultural society leader",
    },
    {
      _id: "req_003",
      createdAt: "2025-11-27T16:15:00Z",
      accepted: true,
      guest: { userName: "David Udo" },
      host: "Engr. Stella Nwachukwu",
      event: { _id: "event_003", title: "Frontend Dev Bootcamp" },
      house: "Department of Computer Science",
      note: "Bootcamp participant",
    },
    {
      _id: "req_004",
      createdAt: "2025-11-28T18:20:00Z",
      accepted: true,
      guest: "Blessing Peters",
      host: { userName: "Mr. Samuel Ogar" },
      event: { _id: "event_004", title: "Gospel Music Night" },
      house: "Music Hall",
      note: "Choir member",
    },
    {
      _id: "req_005",
      createdAt: "2025-11-29T09:45:00Z",
      accepted: false,
      guest: "Uche Nwosu",
      host: { userName: "Mrs. Joy Akpan" },
      event: { title: "AI & Robotics Workshop", _id: "event_005" },
      house: "Engineering Department",
      note: "Workshop attendee",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [data, setData] = useState<RequestData>();

  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Invitation Card",
  });
  const fetchRequest = async () => {
    try {
      const data = await app.get(
        `http://localhost:5036/v1/request/list/692418d703e786bb5fa43804?role=guest&page=1&limit=200`
      );
      console.log(
        "Request fetched successfully",
        data.data,
        `/v1/request/list/${userId}?role=${user.role}&page=1&limit=200`
      );
      setRequests(data.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user) return;
    fetchRequest();
    setError(null);
    setLoading(true);
  }, [user, userId]);
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this request?")) {
      setRequests((prev) => prev.filter((r) => r._id !== id));
      // Optionally send DELETE request to backend
      app.delete(`/v1/request/${id}`);
    }
  };

  const toggleAttendance = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, accepted: !r.accepted } : r))
    );
    // Optionally send PATCH request to backend to update attendance
    // app.patch(`/v1/request/${id}`, { accepted: !currentValue })
  };

  const filteredRequests = useMemo(() => {
    if (!query.trim()) return requests;
    const q = query.toLowerCase();
    return requests.filter((r) => {
      const guest =
        typeof r.guest === "string" ? r.guest : r.guest?.userName ?? "";
      const host = typeof r.host === "string" ? r.host : r.host?.userName ?? "";
      const house = r.house ?? "";
      const title =
        typeof r.event === "string" ? r.event : r.event?.title ?? "";
      return [guest, host, house, title, r._id].some((v) =>
        v.toLowerCase().includes(q)
      );
    });
  }, [requests, query]);

  if (!user) return <Loading />;

  return (
    <div className="pt-[70px]">
      <HeaderCustom text="My Requests" />
      <div className="p-4 max-w-4xl mx-auto text-[#E7E9EA]">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by guest, host, house..."
          className="px-3 py-2 rounded border border-[#2F3336] bg-[#0F1419] text-[#E7E9EA] w-full mb-4"
        />

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="p-4 bg-red-600 rounded">{error}</div>
        ) : filteredRequests.length === 0 ? (
          <p>No requests found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((r) => {
              const guest =
                typeof r.guest === "string" ? r.guest : r.guest?.userName;
              const host =
                typeof r.host === "string" ? r.host : r.host?.userName;
              const title =
                typeof r.event === "string" ? r.event : r.event?.title;

              return (
                <div
                  key={r._id}
                  className="p-4 bg-[#0F1419] rounded-lg border border-[#2F3336] flex flex-col justify-between hover:bg-[#16181C]"
                >
                  <div className=" w-full h-[250px] ">
                    <img
                      src={r.event?.thumbnail}
                      alt=""
                      className="h-full w-full object-cover "
                    />
                  </div>

                  <div onClick={() => router.push(`${user.role}/${r._id}/`)}>
                    <p className="font-semibold">{guest}</p>
                    <p className="text-sm text-[#AEB5B9]">Host: {host}</p>
                    <p className="text-sm">Event: {title}</p>
                    {r.house && <p className="text-sm">House: {r.house}</p>}
                    <p className="text-xs text-[#9AA3A7]">
                      Created: {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-2 flex gap-2 flex-wrap">
                    {r.accepted && (
                      <button
                        onClick={() => {
                          printRef.current = document.getElementById(
                            `invitation-${r._id}`
                          );
                          handlePrint();
                        }}
                        className="px-3 py-1 rounded bg-[#1D9BF0] text-black font-semibold flex items-center gap-1"
                      >
                        Print Invitation
                      </button>
                    )}

                    {/* <button
                      onClick={() => toggleAttendance(r._id)}
                      className={`px-3 py-1 rounded font-semibold flex items-center gap-1 ${
                        r.accepted
                          ? "bg-green-500 text-black"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      <FaCheck /> {r.accepted ? "Attended" : "Mark Attendance"}
                    </button> */}

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-3 py-1 rounded bg-red-600 text-white font-semibold flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>

                  {/* Hidden printable card */}
                  {r.accepted && (
                    <div
                      id={`invitation-${r._id}`}
                      className="p-6 bg-white text-black rounded-lg"
                      style={{ display: "none" }}
                    >
                      <h2 className="text-2xl font-bold mb-2">{title}</h2>
                      <p>Dear {guest},</p>
                      <p>
                        You are invited to attend <strong>{title}</strong>{" "}
                        hosted by <strong>{host}</strong> at{" "}
                        {r.house || "the venue"}.
                      </p>
                      <p>Date: {new Date(r.createdAt).toLocaleDateString()}</p>
                      <p>Note: {r.note || "-"}</p>
                      <p className="mt-4">Looking forward to seeing you!</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
