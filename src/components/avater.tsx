"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import { BiHome, BiUser } from "react-icons/bi";

import { MdRequestPage } from "react-icons/md";

import { FaUser } from "react-icons/fa";

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function getInitials(email?: string) {
  if (!email) return "U";
  const name = email.split("@")[0];
  const parts = name.split(".");
  if (parts.length >= 2)
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getColor(email?: string) {
  console.log("hello");
  if (!email) return colors[0];
  const index = email.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function UserAvatar({
  email,
  profileImage,
}: {
  style?: string;
  email?: string;
  profileImage?: string;
}) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const initials = useMemo(
    () => getInitials(email || user?.email),
    [user?.email]
  );
  const color = useMemo(() => getColor(user?.email), [user?.email]);

  const navItems = [
    { label: "Home", icon: <BiHome className="w-5 h-5" />, path: "/homepage" },
    {
      label: "Profile",
      icon: <BiUser className="w-5 h-5" />,
      path: "/profile",
    },

    {
      label: "Request",
      icon: <MdRequestPage className="w-5 h-5" />,
      path: `/request/${user?._id || ""}`,
    },
    {
      label: "Users",
      icon: <BiUser className="w-5 h-5" />,
      path: "/users",
    },
  ];

  return (
    <>
      {/* Avatar (toggle) */}
      {user?.profileImage ? (
        <img
          src={user?.profileImage}
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer shadow-md object-cover "
          alt={user?.email}
        />
      ) : (
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer shadow-md ${color}`}
          onClick={() => setIsOpen(!isOpen)}
          title={user?.email || "Profile"}
        >
          {initials}
        </div>
      )}
      {/* Sidebar with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay (click to close) */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.aside
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col p-6"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div>
                {!user?.profileImage ? (
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer shadow-md ${color}`}
                    title={user?.email || "Profile"}
                  >
                    {!(user?.email || email) ? <FaUser /> : initials}
                  </div>
                ) : (
                  <img
                    src={profileImage || user?.profileImage || ""}
                    className=" w-10 h-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer shadow-md  object-cover "
                  />
                )}
                <h2 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">
                  {user?.userName}
                </h2>
              </div>
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.path);
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    {item.icon}
                    <span className="text-gray-700 dark:text-gray-200">
                      {item.label}
                    </span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
