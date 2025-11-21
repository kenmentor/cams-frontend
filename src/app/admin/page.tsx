"use client";

import React, { useState, useMemo, useEffect } from "react";
import { FaTrash, FaUserEdit } from "react-icons/fa";
import Req from "@/app/utility/axois";
import HeaderCustom from "@/components/HeaderCostum";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: "guest" | "host";
  joinedAt: string;
  house?: string;
}

interface EventData {
  _id: string;
  title: string;
  date: string;
  host: string;
  attendees: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function CampusAdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [query, setQuery] = useState("");
  const [password, setPassword] = useState("");
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { base, app } = Req;

  // Admin password check
  const handleLogin = async () => {
    console.log("satr");
    try {
      const res = await fetch(`${base}/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) setAccessGranted(true);
      else alert("Incorrect password!");
    } catch (err) {
      console.error(err);
      alert("Login failed!");
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await app.get("/user");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await app.get("/event");
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessGranted) {
      fetchUsers();
      fetchEvents();
    }
  }, [accessGranted]);

  // User analytics
  const roleStats = useMemo(() => {
    const guestCount = users.filter((u) => u.role === "guest").length;
    const hostCount = users.filter((u) => u.role === "host").length;
    return [
      { name: "Guests", value: guestCount },
      { name: "Hosts", value: hostCount },
    ];
  }, [users]);

  // Event analytics
  const eventStats = useMemo(() => {
    const today = new Date();
    const pastEvents = events.filter((e) => new Date(e.date) < today).length;
    const upcomingEvents = events.filter(
      (e) => new Date(e.date) >= today
    ).length;
    return [
      { name: "Past Events", value: pastEvents },
      { name: "Upcoming Events", value: upcomingEvents },
    ];
  }, [events]);

  // Upgrade guest to host
  const handleUpgrade = async (id: string) => {
    try {
      await app.put(`/user/${id}`, { role: "host" });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "host" } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete user
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      await app.put(`/user/${id}`, { deleted: true }); // Or call delete route if exists
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.house?.toLowerCase().includes(q)
    );
  }, [users, query]);

  if (!accessGranted) {
    return (
      <div className="bg-[#0B0B0D] min-h-screen flex items-center justify-center text-[#E7E9EA]">
        <div className="bg-[#0F1419] p-8 rounded-xl border border-[#2F3336]">
          <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2 rounded border border-[#2F3336] bg-[#0B0B0D] text-[#E7E9EA] w-full mb-4"
          />
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-black font-semibold rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0D] min-h-screen text-[#E7E9EA]">
      <HeaderCustom text="Campus Admin Dashboard" />
      <div className="p-4 max-w-7xl mx-auto space-y-8">
        {loading && <p>Loading data...</p>}

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#0F1419] p-4 rounded-xl border border-[#2F3336]">
            <h3 className="text-lg font-semibold mb-2">Users by Role</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roleStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {roleStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-[#0F1419] p-4 rounded-xl border border-[#2F3336]">
            <h3 className="text-lg font-semibold mb-2">
              Events: Past vs Upcoming
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={eventStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label
                >
                  {eventStats.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#0F1419] rounded-xl border border-[#2F3336] p-4">
          <h3 className="text-lg font-semibold mb-4">All Users</h3>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="px-3 py-2 rounded border border-[#2F3336] bg-[#0B0B0D] text-[#E7E9EA] w-full mb-4"
          />
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2F3336]">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">House</th>
                <th className="p-2">Joined</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-[#2F3336] hover:bg-[#16181C]"
                >
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capptalize">{u.role}</td>
                  <td className="p-2">{u.house || "-"}</td>
                  <td className="p-2">
                    {new Date(u.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 flex gap-2">
                    {u.role === "guest" && (
                      <button
                        onClick={() => handleUpgrade(u._id)}
                        className="px-2 py-1 bg-green-500 text-black rounded flex items-center gap-1"
                      >
                        <FaUserEdit /> Upgrade
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Events Table */}
        <div className="bg-[#0F1419] rounded-xl border border-[#2F3336] p-4">
          <h3 className="text-lg font-semibold mb-4">All Events</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2F3336]">
                <th className="p-2">Title</th>
                <th className="p-2">Host</th>
                <th className="p-2">Date</th>
                <th className="p-2">Attendees</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr
                  key={e._id}
                  className="border-b border-[#2F3336] hover:bg-[#16181C]"
                >
                  <td className="p-2">{e.title}</td>
                  <td className="p-2">{e.host}</td>
                  <td className="p-2">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{e.attendees}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
