// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

import { MdGridView, MdTableChart, MdFileDownload } from "react-icons/md";
import HeaderCustom from "@/components/HeaderCostum";
import Loading from "@/components/Loainding";
import { useAuthStore } from "@/app/store/authStore";

/* ===========================
   Types & Mock Data
   =========================== */
type ReqGuest = { userName: string; _id: string } | string;
type ReqHost = { userName: string } | string;
type ReqEvent = { _id?: string; title?: string } | string;

export interface RequestData {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  guest: ReqGuest;
  host: ReqHost;
  event: ReqEvent;
  accepted?: boolean;
  attended?: boolean;
  house?: string;
  note?: string;
  [k: string]: any;
}

const MOCK_REQUESTS: RequestData[] = [
  {
    _id: "REQ1001",
    createdAt: "2025-11-10T08:00:00Z",
    updatedAt: "2025-11-10T09:00:00Z",
    guest: { userName: "John Mark", _id: "USR001" },
    host: { userName: "Senior Host A" },
    event: { _id: "EVT21", title: "Tech Innovation Summit" },
    house: "Block A",
    accepted: true,
  },
  {
    _id: "REQ1002",
    createdAt: "2025-11-10T09:10:00Z",
    guest: { userName: "Faith Thomas", _id: "USR002" },
    host: { userName: "Hall Manager" },
    event: { _id: "EVT21", title: "Tech Innovation Summit" },
    house: "Block C",
    accepted: false,
  },
  {
    _id: "REQ1003",
    createdAt: "2025-11-09T11:20:00Z",
    guest: { userName: "Samuel Peter", _id: "USR003" },
    host: { userName: "Senior Host A" },
    event: { _id: "EVT33", title: "Music Fiesta Night" },
    house: "Block B",
    accepted: true,
  },
  {
    _id: "REQ1004",
    createdAt: "2025-11-08T13:15:00Z",
    guest: { userName: "Gloria James", _id: "USR004" },
    host: { userName: "Event Manager 2" },
    event: { _id: "EVT40", title: "Cultural Day" },
    house: "Block D",
    accepted: false,
  },
  {
    _id: "REQ1005",
    createdAt: "2025-11-07T07:25:00Z",
    guest: { userName: "Michael John", _id: "USR005" },
    host: { userName: "Host Manager" },
    event: { _id: "EVT21", title: "Tech Innovation Summit" },
    house: "Block A",
    accepted: true,
  },
  {
    _id: "REQ1006",
    createdAt: "2025-11-06T10:05:00Z",
    guest: { userName: "Janet Okoro", _id: "USR006" },
    host: { userName: "Event Officer" },
    event: { _id: "EVT50", title: "Freshers Orientation" },
    house: "Block E",
    accepted: undefined,
  },
  {
    _id: "REQ1007",
    createdAt: "2025-11-05T14:42:00Z",
    guest: { userName: "David Green", _id: "USR007" },
    host: { userName: "Hall Manager" },
    event: { _id: "EVT33", title: "Music Fiesta Night" },
    house: "Block C",
    accepted: false,
  },
  {
    _id: "REQ1008",
    createdAt: "2025-11-04T16:12:00Z",
    guest: { userName: "Chisom Ada", _id: "USR008" },
    host: { userName: "Senior Host A" },
    event: { _id: "EVT50", title: "Freshers Orientation" },
    house: "Block B",
    accepted: undefined,
  },
  {
    _id: "REQ1009",
    createdAt: "2025-11-03T18:00:00Z",
    guest: { userName: "Ibrahim Musa", _id: "USR009" },
    host: { userName: "Event Officer" },
    event: { _id: "EVT40", title: "Cultural Day" },
    house: "Block D",
    accepted: true,
  },
  {
    _id: "REQ1010",
    createdAt: "2025-11-02T08:30:00Z",
    guest: { userName: "Emmanuel Chidi", _id: "USR010" },
    host: { userName: "Hall Manager" },
    event: { _id: "EVT21", title: "Tech Innovation Summit" },
    house: "Block A",
    accepted: false,
  },
];

/* ===========================
   Axios instance (uses your backend if available)
   =========================== */
const app = axios.create({
  baseURL: "https://agent-with-me-backend.onrender.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/* ===========================
   Utility helpers
   =========================== */
function downloadCSV(rows: any[], filename = "export.csv") {
  if (!rows || rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(",")]
    .concat(
      rows.map((r) =>
        keys
          .map((k) => {
            const val = r[k] === null || r[k] === undefined ? "" : String(r[k]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function formatDate(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  return dt.toLocaleString();
}

function sparklinePath(values: number[], width = 120, height = 28) {
  if (!values || values.length === 0) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

/* ===========================
   Main Component
   =========================== */
export default function RequestsAdminDashboard() {
  const { userId } = useParams();

  const user = useAuthStore((s) => s.user);

  // data
  const [requests, setRequests] = useState<RequestData[]>(MOCK_REQUESTS);
  const [loading, setLoading] = useState(true);

  // controls
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [groupByEvent, setGroupByEvent] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [expandedEvent, setExpandedEvent] = useState<Record<string, boolean>>(
    {}
  );
  const [page, setPage] = useState(1);
  const pageSize = 40;

  // Try real API after small delay
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setTimeout(async () => {
          if (!user) return;
          setLoading(true);
          const res = await app.get(
            `/v1/request/list/${userId}?role=${user.role}&page=1&limit=${pageSize}`
          );
          if (!mounted) return;
          const data = res.data?.data ?? [];
          if (Array.isArray(data) && data.length > 0) {
            setRequests(data);
          }
          setLoading(false);
        }, 600);
      } catch (err) {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user, userId]);

  const eventsMap = useMemo(() => {
    const map = new Map<
      string,
      { id: string; title: string; items: RequestData[] }
    >();
    for (const r of requests) {
      const ev =
        typeof r.event === "string"
          ? { _id: r.event, title: (r as any).eventTitle ?? "Event" }
          : r.event || { _id: "unknown", title: "Event" };
      const id = ev._id ?? "unknown";
      if (!map.has(id))
        map.set(id, { id, title: ev.title ?? "Event", items: [] });
      map.get(id)!.items.push(r);
    }
    return map;
  }, [requests]);

  const stats = useMemo(() => {
    const total = requests.length;
    const accepted = requests.filter((r) => r.accepted === true).length;
    const pending = requests.filter((r) => r.accepted !== true).length;
    const perEvent = Array.from(eventsMap.values()).map((e) => ({
      id: e.id,
      title: e.title,
      count: e.items.length,
    }));
    return { total, accepted, pending, perEvent };
  }, [requests, eventsMap]);

  const last7Counts = useMemo(() => {
    const now = new Date();
    const days: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const c = requests.filter(
        (r) => (r.createdAt || "").slice(0, 10) === key
      ).length;
      days.push(c);
    }
    return days;
  }, [requests]);

  const filtered = useMemo(() => {
    let list = [...requests];
    if (statusFilter !== "all") {
      list = list.filter((r) =>
        statusFilter === "accepted" ? Boolean(r.accepted) : !r.accepted
      );
    }
    if (eventFilter !== "all") {
      list = list.filter((r) => {
        const evId = typeof r.event === "string" ? r.event : r.event?._id ?? "";
        return evId === eventFilter;
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => {
        const guestName =
          typeof r.guest === "string" ? r.guest : r.guest?.userName ?? "";
        const hostName =
          typeof r.host === "string" ? r.host : r.host?.userName ?? "";
        const house = r.house ?? "";
        const title = typeof r.event === "string" ? "" : r.event?.title ?? "";
        return [guestName, hostName, house, title, r._id].some((v) =>
          v?.toLowerCase().includes(q)
        );
      });
    }
    list.sort((a, b) => {
      const ta = new Date(a.createdAt || "").getTime() || 0;
      const tb = new Date(b.createdAt || "").getTime() || 0;
      return sortBy === "newest" ? tb - ta : ta - tb;
    });
    return list;
  }, [requests, statusFilter, eventFilter, query, sortBy]);

  const grouped = useMemo(() => {
    if (!groupByEvent)
      return { all: { id: "all", title: "All Requests", items: filtered } };
    const groups = new Map<
      string,
      { id: string; title: string; items: RequestData[] }
    >();
    for (const r of filtered) {
      const ev =
        typeof r.event === "string"
          ? { _id: r.event, title: "" }
          : r.event ?? { _id: "unknown", title: "Event" };
      const id = ev._id ?? "unknown";
      if (!groups.has(id))
        groups.set(id, { id, title: (ev as any).title ?? "Event", items: [] });
      groups.get(id)!.items.push(r);
    }
    return Object.fromEntries(groups);
  }, [filtered, groupByEvent]);

  async function toggleAccept(req: RequestData, newAccepted = true) {
    if (!req?._id) return;
    setRequests((prev) =>
      prev.map((r) => (r._id === req._id ? { ...r, accepted: newAccepted } : r))
    );
    try {
      await app.put(`/v1/request/${req._id}?status=${newAccepted ? 1 : 0}`);
    } catch (err) {
      console.error("toggleAccept failed", err);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === req._id ? { ...r, accepted: !newAccepted } : r
        )
      );
    }
  }

  async function deleteRequest(reqId: string) {
    if (!confirm("Delete this request?")) return;
    const before = requests;
    setRequests((prev) => prev.filter((r) => r._id !== reqId));
    try {
      await app.delete(`/v1/request/${reqId}`);
    } catch (err) {
      console.error("delete failed", err);
      setRequests(before);
    }
  }

  async function bulkAccept() {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!ids.length) return alert("No selection");
    setRequests((prev) =>
      prev.map((r) => (ids.includes(r._id) ? { ...r, accepted: true } : r))
    );
    setSelected({});
    try {
      await Promise.all(ids.map((id) => app.put(`/v1/request/${id}?status=1`)));
    } catch (err) {
      console.error("bulk accept failed", err);
    }
  }

  async function bulkDelete() {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!ids.length) return alert("No selection");
    if (!confirm(`Delete ${ids.length} requests?`)) return;
    const before = requests;
    setRequests((prev) => prev.filter((r) => !ids.includes(r._id)));
    setSelected({});
    try {
      await Promise.all(ids.map((id) => app.delete(`/v1/request/${id}`)));
    } catch (err) {
      console.error("bulk delete failed", err);
      setRequests(before);
    }
  }

  function toggleSelect(id: string) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }

  function clearFilters() {
    setQuery("");
    setEventFilter("all");
    setStatusFilter("all");
  }

  function exportFilteredCSV() {
    const rows = filtered.map((r) => ({
      id: r._id,
      guest: typeof r.guest === "string" ? r.guest : r.guest.userName,
      host: typeof r.host === "string" ? r.host : r.host?.userName,
      event: typeof r.event === "string" ? r.event : r.event?.title,
      house: r.house,
      accepted:
        r.accepted === true
          ? "accepted"
          : r.accepted === false
          ? "rejected"
          : "pending",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt || "",
    }));
    downloadCSV(rows, `requests_${new Date().toISOString().slice(0, 10)}.csv`);
  }

  if (!user) return <Loading />;

  return (
    <>
      <HeaderCustom text="Requests Management" />
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto text-[#E7E9EA] bg-[#000000] mt-10">
        {/* TOP: Analytics + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#000000] rounded-xl p-4 border border-[#2F3336] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Requests Dashboard</h2>
                <p className="text-sm text-[#E7E9EA]">
                  Fast admin triage — search, filter, group, act.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setViewMode((v) => (v === "cards" ? "table" : "cards"))
                  }
                  className="px-3 py-1 rounded border border-[#2F3336] hover:bg-[#16181C] transition"
                >
                  {viewMode === "cards" ? <MdTableChart /> : <MdGridView />}
                </button>
                <button
                  onClick={exportFilteredCSV}
                  className="px-3 py-1 rounded border border-[#2F3336] hover:bg-[#16181C] transition flex items-center gap-1"
                >
                  <MdFileDownload /> CSV
                </button>
              </div>
            </div>

            {/* Sparkline */}
            <svg width="120" height="28" className="mt-4">
              <path
                d={sparklinePath(last7Counts)}
                stroke="#1D9BF0"
                strokeWidth={2}
                fill="none"
              />
            </svg>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2F3336] text-center">
              <p className="text-sm">Total</p>
              <p className="text-lg font-semibold">{stats.total}</p>
            </div>
            <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2F3336] text-center">
              <p className="text-sm">Accepted</p>
              <p className="text-lg font-semibold">{stats.accepted}</p>
            </div>
            <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2F3336] text-center">
              <p className="text-sm">Pending</p>
              <p className="text-lg font-semibold">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 my-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by guest, host, house..."
            className="px-3 py-2 rounded border border-[#2F3336] bg-[#0F1419] text-[#E7E9EA] focus:outline-none focus:border-[#1D9BF0] flex-1 min-w-[180px]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded border border-[#2F3336] bg-[#0F1419] text-[#E7E9EA]"
          >
            <option value="all">All Status</option>
            <option value="accepted">Accepted</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3 py-2 rounded border border-[#2F3336] bg-[#0F1419] text-[#E7E9EA]"
          >
            <option value="all">All Events</option>
            {Array.from(eventsMap.values()).map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} ({ev.items.length})
              </option>
            ))}
          </select>
          <button
            onClick={clearFilters}
            className="px-3 py-2 rounded border border-[#2F3336] hover:bg-[#16181C] transition"
          >
            Clear Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {Object.values(selected).some(Boolean) && (
          <div className="flex gap-2 my-2">
            <button
              onClick={bulkAccept}
              className="px-3 py-1 rounded bg-[#1D9BF0] text-black font-semibold"
            >
              Accept Selected
            </button>
            <button
              onClick={bulkDelete}
              className="px-3 py-1 rounded bg-red-600 text-white font-semibold"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Data List */}
        {loading ? (
          <Loading />
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <div
                key={r._id}
                className="bg-[#0F1419] p-3 rounded-xl border border-[#2F3336] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {typeof r.guest === "string" ? r.guest : r.guest.userName}
                    </p>
                    <input
                      type="checkbox"
                      checked={!!selected[r._id]}
                      onChange={() => toggleSelect(r._id)}
                    />
                  </div>
                  <p className="text-sm text-[#E7E9EA]">
                    Host:{" "}
                    {typeof r.host === "string" ? r.host : r.host?.userName}
                  </p>
                  <p className="text-sm text-[#E7E9EA]">
                    Event:{" "}
                    {typeof r.event === "string" ? r.event : r.event?.title}
                  </p>
                  <p className="text-sm text-[#E7E9EA]">House: {r.house}</p>
                  <p className="text-xs text-[#E7E9EA]">
                    Created: {formatDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  {r.accepted !== true && (
                    <button
                      onClick={() => toggleAccept(r, true)}
                      className="px-2 py-1 bg-[#1D9BF0] text-black rounded text-sm"
                    >
                      Accept
                    </button>
                  )}
                  <button
                    onClick={() => deleteRequest(r._id)}
                    className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full mt-4 border-collapse text-[#E7E9EA]">
            <thead>
              <tr className="border-b border-[#2F3336]">
                <th className="p-2 text-left">Select</th>
                <th className="p-2 text-left">Guest</th>
                <th className="p-2 text-left">Host</th>
                <th className="p-2 text-left">Event</th>
                <th className="p-2 text-left">House</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b border-[#2F3336]">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={!!selected[r._id]}
                      onChange={() => toggleSelect(r._id)}
                    />
                  </td>
                  <td className="p-2">
                    {typeof r.guest === "string" ? r.guest : r.guest.userName}
                  </td>
                  <td className="p-2">
                    {typeof r.host === "string" ? r.host : r.host?.userName}
                  </td>
                  <td className="p-2">
                    {typeof r.event === "string" ? r.event : r.event?.title}
                  </td>
                  <td className="p-2">{r.house}</td>
                  <td className="p-2">
                    {r.accepted === true
                      ? "Accepted"
                      : r.accepted === false
                      ? "Rejected"
                      : "Pending"}
                  </td>
                  <td className="p-2">{formatDate(r.createdAt)}</td>
                  <td className="p-2 flex gap-2">
                    {r.accepted !== true && (
                      <button
                        onClick={() => toggleAccept(r, true)}
                        className="px-2 py-1 bg-[#1D9BF0] text-black rounded text-sm"
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={() => deleteRequest(r._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
