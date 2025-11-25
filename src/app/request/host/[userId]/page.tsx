"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { MdGridView, MdTableChart, MdFileDownload } from "react-icons/md";
import HeaderCustom from "@/components/HeaderCostum";
import Loading from "@/components/Loainding";
import { useAuthStore } from "@/app/store/authStore";
import Req from "@/app/utility/axois";
/*
  Improved, production-ready Requests admin page.
  - Role-aware: shows requests differently for host vs guest
  - Better fetching with abort + error handling
  - Optimistic UI for accept/delete with rollback on failure
  - Separate small components (RequestCard / RequestRow) for clarity
  - Event image support with graceful fallback
  - CSV export, bulk actions, search, filters, sorting
  - Typesafe-ish (keeps compatibility with existing backend shapes)
*/

type ReqGuest = { userName: string; _id?: string; thumbnail: string };
type ReqHost = { userName: string; _id?: string; thumbnail: string };
type ReqEvent = {
  _id?: string;
  title?: string;
  image?: string;
  thumbnail: string;
};

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

function formatDateISO(d?: string) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

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

/* ---------- Small presentational components ---------- */
function EventImage({ src, title }: { src?: string; title?: string }) {
  // simple <img> with fallback to generated placeholder
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    title || "Event"
  )}&background=111827&color=ffffff&size=256`;
  return (
    <img
      src={src || fallback}
      alt={title || "event image"}
      className="w-20 h-16 object-cover rounded-md bg-[#0B1220]"
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallback;
      }}
    />
  );
}

function RequestCard({
  r,
  onAccept,
  onDelete,
  onSelect,
  selected,
}: {
  r: RequestData;
  onAccept: (r: RequestData, v?: boolean) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selected?: boolean;
}) {
  const guestName = r.guest?.userName;
  const hostName = r.host?.userName;
  const ev =
    typeof r.event === "string"
      ? { _id: r.event, title: "Event" }
      : r.event || { _id: "unknown", title: "Event" };
  return (
    <div className="bg-[#0F1419] p-3 rounded-xl border border-[#2F3336] shadow-sm flex flex-col justify-between">
      <div className="flex gap-3">
        <EventImage src={r?.event?.thumbnail} title={(ev as any).title} />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold">{guestName}</p>
              <p className="text-sm text-[#AEB5B9] flex">
                host:{""}
                {hostName}
              </p>
            </div>
            <input
              type="checkbox"
              checked={!!selected}
              onChange={() => onSelect(r._id)}
            />
          </div>
          <p className="text-sm text-[#E7E9EA] mt-2">
            Event: {(ev as any).title}
          </p>

          <p className="text-xs text-[#9AA3A7]">
            Created: {formatDateISO(r.createdAt)}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        {r.accepted !== true && (
          <button
            onClick={() => onAccept(r, true)}
            className="px-2 py-1 bg-[#1D9BF0] text-black rounded text-sm"
          >
            Accept
          </button>
        )}
        <button
          onClick={() => onDelete(r._id)}
          className="px-2 py-1 bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function RequestRow({
  r,
  onAccept,
  onDelete,
  onSelect,
  selected,
}: {
  r: RequestData;
  onAccept: (r: RequestData, v?: boolean) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selected?: boolean;
}) {
  const guestName = typeof r.guest === "string" ? r.guest : r.guest?.userName;
  const hostName = typeof r.host === "string" ? r.host : r.host?.userName;
  const evTitle = typeof r.event === "string" ? r.event : r.event?.title;
  return (
    <tr className="border-b border-[#2F3336]">
      <td className="p-2">
        <input
          type="checkbox"
          checked={!!selected}
          onChange={() => onSelect(r._id)}
        />
      </td>
      <td className="p-2">{guestName}</td>
      <td className="p-2">{hostName}</td>
      <td className="p-2">{evTitle}</td>
      <td className="p-2">{r.house}</td>
      <td className="p-2">
        {r.accepted === true
          ? "Accepted"
          : r.accepted === false
          ? "Rejected"
          : "Pending"}
      </td>
      <td className="p-2">{formatDateISO(r.createdAt)}</td>
      <td className="p-2 flex gap-2">
        {r.accepted !== true && (
          <button
            onClick={() => onAccept(r, true)}
            className="px-2 py-1 bg-[#1D9BF0] text-black rounded text-sm"
          >
            Accept
          </button>
        )}
        <button
          onClick={() => onDelete(r._id)}
          className="px-2 py-1 bg-red-600 text-white rounded text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

/* ---------- Main component ---------- */
export default function RequestsAdminDashboard() {
  const user = useAuthStore((s) => s.user);

  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { base, app } = Req;

  // UI statea
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [groupByEvent, setGroupByEvent] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  console.log("user", user);
  console.log("requests", requests);
  // Fetch requests (role aware) with abort support
  async function fetchRequests() {
    try {
      setError(null);
      setLoading(true);
      const data = await app.get(
        `/v1/request/list/${user?._id}?role=${user?.role}&page=1&limit=200`
      );
      console.log(data);
      setRequests(data.data.data || []);
    } catch (error) {
      console.error(error);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchRequests();
  }, [user]);

  // events map used for filters / KPIs
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
      const id = (ev as any)._id ?? "unknown";
      if (!map.has(id))
        map.set(id, { id, title: (ev as any).title ?? "Event", items: [] });
      map.get(id)!.items.push(r);
    }
    return map;
  }, [requests]);

  const stats = useMemo(
    () => ({
      total: requests.length,
      accepted: requests.filter((r) => r.accepted === true).length,
      pending: requests.filter((r) => r.accepted !== true).length,
    }),
    [requests]
  );

  // Filtered list
  const filtered = useMemo(() => {
    let list = [...requests];
    if (statusFilter !== "all") {
      list = list.filter((r) =>
        statusFilter === "accepted" ? Boolean(r.accepted) : r.accepted !== true
      );
    }
    if (eventFilter !== "all") {
      list = list.filter((r) =>
        typeof r.event === "string"
          ? r.event === eventFilter
          : (r.event?._id ?? "") === eventFilter
      );
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

  /* ---------- Actions ---------- */
  async function toggleAccept(req: RequestData, newAccepted = true) {
    if (!req?._id) return;
    setRequests((prev) =>
      prev.map((r) => (r._id === req._id ? { ...r, accepted: newAccepted } : r))
    );
    try {
      await app.put(`/v1/request/${req._id}`, { status: newAccepted ? 1 : 0 });
    } catch (err) {
      console.error("toggleAccept failed", err);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === req._id ? { ...r, accepted: !newAccepted } : r
        )
      );
      alert("Failed to update status");
    }
  }

  async function deleteRequest(reqId: string) {
    if (!confirm("Delete this request?")) return;
    const backup = requests;
    setRequests((prev) => prev.filter((r) => r._id !== reqId));
    try {
      await app.delete(`/v1/request/${reqId}`);
    } catch (err) {
      console.error("delete failed", err);
      setRequests(backup);
      alert("Delete failed");
    }
  }

  async function bulkAccept() {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!ids.length) return alert("No selection");
    const backup = requests;
    setRequests((prev) =>
      prev.map((r) => (ids.includes(r._id) ? { ...r, accepted: true } : r))
    );
    setSelected({});
    try {
      await Promise.all(ids.map((id) => app.put(`/v1/request/${id}?status=1`)));
    } catch (err) {
      console.error("bulk accept failed", err);
      setRequests(backup);
      alert("Bulk accept failed");
    }
  }

  async function bulkDelete() {
    const ids = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => k);
    if (!ids.length) return alert("No selection");
    if (!confirm(`Delete ${ids.length} requests?`)) return;
    const backup = requests;
    setRequests((prev) => prev.filter((r) => !ids.includes(r._id)));
    setSelected({});
    try {
      await Promise.all(ids.map((id) => app.delete(`/v1/request/${id}`)));
    } catch (err) {
      console.error("bulk delete failed", err);
      setRequests(backup);
      alert("Bulk delete failed");
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
      guest: typeof r.guest === "string" ? r.guest : r.guest?.userName,
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
      <HeaderCustom
        text={user.role === "host" ? "Host Requests" : "Requests Management"}
      />
      <div className="p-4 md:p-6 lg:p-8 mt-[70px]  mx-auto text-[#E7E9EA] bg-[#000000]  h-svh">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#000000] rounded-xl p-4 border border-[#2F3336] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Requests Dashboard</h2>
                <p className="text-sm text-[#AEB5B9]">
                  search, filter, group, act.
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
          </div>

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

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="p-4 bg-red-600 rounded mt-4">{error}</div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <RequestCard
                key={r._id}
                r={r}
                onAccept={toggleAccept}
                onDelete={deleteRequest}
                onSelect={toggleSelect}
                selected={!!selected[r._id]}
              />
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
                <RequestRow
                  key={r._id}
                  r={r}
                  onAccept={toggleAccept}
                  onDelete={deleteRequest}
                  onSelect={toggleSelect}
                  selected={!!selected[r._id]}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
