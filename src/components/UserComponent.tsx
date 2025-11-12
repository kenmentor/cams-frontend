import React from "react";
import { BiUser } from "react-icons/bi";
import { MdVerifiedUser } from "react-icons/md";

interface Data {
  _id: string;
  email?: string;
  userName?: string;
  rank?: string;
  adminVerified?: boolean;
  role?: string;
  profileImage?: string;
  dateJoined?: string;
  numBookings?: number;
}

const UserComponent: React.FC<Data> = ({
  _id,
  email,
  userName,
  rank,
  adminVerified,
  role,
  profileImage,
  dateJoined,
  numBookings,
}) => {
  return (
    <a
      href={`/profile/${_id}`}
      className="block relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] p-6 w-full md:w-96 mx-auto mb-6 border border-gray-200/40 dark:border-gray-700/40"
    >
      <div className="flex items-center gap-6">
        {/* Profile Image */}
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center bg-gradient-to-r bg-blue-500 text-white shadow-md">
            <BiUser className="w-10 h-10" />
          </div>
        )}

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold flex items-center gap-2 truncate">
            {userName || "Unknown User"}
            {adminVerified && (
              <MdVerifiedUser className="text-blue-500 text-xl" />
            )}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {email || "No email provided"}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Role:
              </span>{" "}
              {role || "N/A"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-200">
                Rank:
              </span>{" "}
              {rank || 0}
            </p>
            {dateJoined && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Joined:
                </span>{" "}
                {new Date(dateJoined).toLocaleDateString()}
              </p>
            )}
            {numBookings !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  Properties/Bookings:
                </span>{" "}
                {numBookings}
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default UserComponent;
