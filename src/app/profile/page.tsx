"use client";

import React, { useEffect, useRef, useState } from "react";
import { GoVerified } from "react-icons/go";
import { useAuthStore } from "@/app/store/authStore";
import HouseMainComponent from "@/components/HouseMainComponent";
import HeaderCustom from "@/components/HeaderCostum";
import { useRouter } from "next/navigation";
import Req from "@/app/utility/axois";
import { toast } from "sonner";

interface state {
  user: {
    role: string;
    _id: string;
    profileImage: string;
    username: string;
    socialMedia: [];
    adminVerified: boolean;
    phoneNumber: number;
    rank: number;
    dateOfBirth: string;
    email: string;
  };
  logout: () => null;
  setUser: () => void; // add this to authStore if not present
}

const ProfilePage = () => {
  const { base } = Req;
  const userData = useAuthStore((state: state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state: state) => state.logout);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] = useState(false);

  const isHost = userData?.role === "host";
  const [placeholder, setPlaceholder] = useState("");
  useEffect(() => {
    setPlaceholder(userData?.profileImage || "");
  }, [userData]);
  const handleProfileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setPlaceholder(URL.createObjectURL(file));
    if (!userData) {
      return toast.error("You Need To Login");
    }
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      // Axios call

      const res = await fetch(`${base}/v1/user/${userData._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = res.json(); // axios auto-wraps
      //@ts-expect-error this error was not what the time
      setUser({ ...data?.data });
      toast.success("profile have been updated");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error uploading profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <HeaderCustom text={userData?.email} />
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 mt-12 text-gray-800 dark:text-white">
        <div className="flex flex-col md:flex-row md:h-screen max-w-7xl mx-auto overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white dark:bg-gray-800 p-6 border-b md:border-b-0 md:border-r overflow-y-auto">
            <div className="flex flex-col items-center">
              <div
                className="relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={placeholder || userData?.profileImage || "/profile.jpg"}
                  alt="Profile"
                  className="w-28 h-28 object-cover rounded-full border-4 border-blue-500 shadow"
                />
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
                {userData?.username || "Unknown User"}
                {userData?.adminVerified && (
                  <GoVerified className="text-blue-500" title="Verified" />
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-300 break-words text-center">
                {userData?.email}
              </p>

              <div className="mt-6 text-left w-full text-sm space-y-2">
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {userData?.phoneNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">DOB:</span>{" "}
                  {new Date(userData?.dateOfBirth).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Rank:</span> #
                  {userData?.rank || 0}
                </p>
                <p>
                  <span className="font-medium">Role:</span> {userData?.role}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
                  Edit Profile
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
          <section className="flex-1 overflow-y-auto p-1">
            {isHost ? (
              <>
                <h1 className="text-2xl font-bold mb-2">
                  Your Uploaded Houses
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Browse and manage the Event you&apos;ve listed.
                </p>

                <HouseMainComponent userId={userData?._id} page={false} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-4">Welcome, Guest!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                  You currently don&apos;t have any Event listed. If you&apos;re
                  interested in becoming a host, please complete the
                  verification process or contact support.
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
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
