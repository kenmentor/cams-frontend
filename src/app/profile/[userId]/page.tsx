"use client";

import React, { useEffect, useState } from "react";
import { GoVerified } from "react-icons/go";
import HouseMainComponent from "@/components/HouseMainComponent";
import Loading from "@/components/Loainding";

import { useParams } from "next/navigation";
import UserAvatar from "@/components/avater";

interface user {
  role: string;
  profileImage: string;
  username: string;
  adminVerified: boolean;
  email: string;
  phoneNumber: number;
  dateOfBirth?: Date;
  socialMedia: [string];
  rank: number;
}

const ProfilePage = () => {
  const { userId }: { userId: string } = useParams();
  const [user, setuser] = useState<user>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://agent-with-me-backend.onrender.com/v1/user/${userId}`
        );
        const result = await res.json();
        setuser(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  const isHost = user?.role === "host";
  console.log("this is the user", user);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="flex flex-col md:flex-row h-auto md:h-screen overflow-hidden max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-full md:w-80 bg-white dark:bg-gray-800 p-6 border-b md:border-b-0 md:border-r overflow-y-auto">
          <div className="flex flex-col items-center">
            {user?.profileImage ? (
              <img
                src={user?.profileImage || "/profile.jpg"}
                alt="Profile"
                className="w-28 h-28 object-cover rounded-full border-4 border-blue-500 shadow"
              />
            ) : (
              <UserAvatar email={user.email} />
            )}
            <h2 className="text-lg font-semibold mt-4 flex items-center gap-1 text-center">
              {user?.username || "Unknown User"}
              {user?.adminVerified && (
                <GoVerified className="text-blue-500" title="Verified" />
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-300 break-all text-center">
              {user?.email}
            </p>

            <div className="mt-6 text-left w-full text-sm space-y-2">
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {user?.phoneNumber || "N/A"}
              </p>
              <p>
                <span className="font-medium">DOB:</span>{" "}
                {user?.dateOfBirth &&
                  new Date(user?.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Rank:</span> #{user?.rank || 0}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user?.role}
              </p>
              <p className="font-medium mt-4">Socials:</p>
              <ul className="list-disc ml-5 break-all">
                {(user?.socialMedia || []).map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 overflow-y-auto p-6">
          {isHost ? (
            <>
              <h1 className="text-2xl font-bold mb-2">Your Uploaded Houses</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Browse and manage the properties you&apos;ve listed
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <HouseMainComponent userId={userId} page={false} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                This User Has No Properties Listed.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
