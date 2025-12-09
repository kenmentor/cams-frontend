"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoVerified } from "react-icons/go";
import { BiStar, BiUser } from "react-icons/bi";

import { GrContact } from "react-icons/gr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/app/store/authStore";
import Req from "@/app/utility/axois";
import HeaderCustom from "@/components/HeaderCostum";
import HouseMainComponent from "@/components/HouseMainComponent";

interface State {
  user: {
    role: string;
    _id: string;
    profileImage: string;
    userName: string;
    adminVerified: boolean;
    regNumber: number;
    rank: number;
    email: string;
  };
  logout: () => void;
  setUser: (user: any) => void;
}

const ProfilePage = () => {
  const { app, base } = Req;
  const router = useRouter();

  const userData = useAuthStore((state: State) => state.user);
  const setUser = useAuthStore((state: State) => state.setUser);
  const logout = useAuthStore((state: State) => state.logout);

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    userName: userData?.userName || "",
    email: userData?.email || "",
    regNumber: userData?.regNumber || "",
  });

  const [placeholder, setPlaceholder] = useState(userData?.profileImage || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isHost = userData?.role === "host";
  console.log(userData);
  useEffect(() => {
    setForm({
      userName: userData?.userName || "",
      email: userData?.email || "",
      regNumber: userData?.regNumber || "",
    });
    setPlaceholder(userData?.profileImage || "");
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPlaceholder(URL.createObjectURL(file));

    if (!userData) return toast.error("You need to login");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await fetch(`${base}/v1/user/${userData._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      // setUser(data.data);
      toast.success("Profile image updated");
    } catch (err: any) {
      toast.error(err.message || "Error uploading profile picture");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userData) return toast.error("You need to login");

    try {
      const res = await fetch(`${base}/v1/user/${userData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setUser(data.data);
      toast.success("Profile updated");
      setEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Error updating profile");
    }
  };

  const handleApplyHost = async () => {
    if (!userData) return toast.error("You need to login");

    try {
      const res = app.put(
        `${base}/v1/user/${userData._id}`,

        { applyHost: true }
      );

      const data = await res;
      setUser(data.data);
      toast.success("Host application sent!");
    } catch (err: any) {
      toast.error(err.message || "Error applying for host");
    }
  };

  return (
    <>
      <HeaderCustom text={userData?.email} />
      <main className="min-h-screen bg-gray-100 dark:bg-[#1C1C1E] mt-12 text-gray-800 dark:text-white">
        <div className="flex flex-col md:flex-row md:h-screen max-w-7xl mx-auto overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white dark:bg-[#1C1C1E] p-6 border-b md:border-b-0 md:border-r overflow-y-auto">
            <div className="flex flex-col items-center">
              <div
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {userData?.role == "guest" ? (
                  <img
                    src={placeholder || "/guest.jpg"}
                    alt="Profile"
                    className="w-28 h-28 object-cover rounded-full border-4 border-blue-500 shadow"
                  />
                ) : (
                  <img
                    src={placeholder || "/host.jpg"}
                    alt="Profile"
                    className="w-28 h-28 object-cover rounded-full border-4 border-blue-500 shadow"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-sm">
                    {uploading ? "Uploading..." : "Change"}
                  </span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileUpload}
              />

              <h2 className="text-lg font-semibold mt-4 flex items-center gap-1 text-center">
                {userData?.userName || "User"}
                {userData?.adminVerified ||
                  (userData?.role === "host" && (
                    <GoVerified className="text-blue-500" title="Verified" />
                  ))}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 break-words text-center">
                {userData?.email}
              </p>

              {/* Edit Form */}
              {editing && (
                <div className="mt-4 space-y-2 w-full">
                  <input
                    name="userName"
                    value={form.userName}
                    onChange={handleInputChange}
                    placeholder="User Name"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    name="regNumber"
                    value={form.regNumber}
                    onChange={handleInputChange}
                    placeholder="Reg Number"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleProfileUpdate}
                    className="bg-green-600 text-white py-2 px-4 rounded w-full"
                  >
                    Save
                  </button>
                </div>
              )}

              {/* User Info */}
              <div className="mt-6 text-left w-full text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <GrContact />
                  <span className="font-medium">Reg Number:</span>
                  {userData?.regNumber || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <BiStar />
                  <span className="font-medium">Rank:</span>
                  {userData?.rank || 0}
                </p>
                <p className="flex items-center gap-2">
                  <BiUser />
                  <span className="font-medium">Role:</span> {userData?.role}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <button
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition"
                  onClick={() => setEditing(!editing)}
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
                <button
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700 transition"
                  onClick={() => {
                    logout();
                    router.push("/Login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <section className="flex-1 overflow-y-auto p-4">
            {isHost ? (
              <>
                <h1 className="text-2xl font-bold mb-2">
                  Your Uploaded Houses
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Browse and manage the events you&apos;ve listed.
                </p>
                <HouseMainComponent userId={userData?._id} page={false} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  You currently don&apos;t have any event listed. If you&apos;re
                  interested in becoming a host, please complete the
                  verification process or click below.
                </p>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                  onClick={handleApplyHost}
                >
                  Become a host
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default ProfilePage;
