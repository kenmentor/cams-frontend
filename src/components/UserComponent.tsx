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
      className="
        block w-full md:w-96 mx-auto mb-6 rounded-2xl border border-[#E5E5EA]
        bg-[#FFFFFF]/80 dark:bg-[#1C1C1E]/70 backdrop-blur-xl
        shadow-sm hover:shadow-lg hover:scale-[1.01]
        transition-all duration-300
        p-6
      "
    >
      <div className="flex items-center gap-5">
        {/* Profile Image */}
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="
              w-20 h-20 rounded-full object-cover 
              border-4 border-[#0A84FF] shadow-md
            "
          />
        ) : (
          <div
            className="
              w-20 h-20 rounded-full 
              flex items-center justify-center
              bg-[#0A84FF] text-white 
              border-4 border-[#0A84FF] shadow-md
            "
          >
            <BiUser className="w-10 h-10" />
          </div>
        )}

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold flex items-center gap-2 truncate text-[#111111] dark:text-[#F2F2F7]">
            {userName || "Unknown User"}
            {adminVerified && (
              <MdVerifiedUser className="text-[#0A84FF] text-xl" />
            )}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {email || "No email provided"}
          </p>

          <div className="mt-3 space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-[#111111] dark:text-[#F2F2F7]">
                Campus Role:
              </span>{" "}
              {role || "N/A"}
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-medium text-[#111111] dark:text-[#F2F2F7]">
                Student Rank:
              </span>{" "}
              {rank || 0}
            </p>

            {dateJoined && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-[#111111] dark:text-[#F2F2F7]">
                  Joined:
                </span>{" "}
                {new Date(dateJoined).toLocaleDateString()}
              </p>
            )}

            {numBookings !== undefined && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium text-[#111111] dark:text-[#F2F2F7]">
                  Registered Activities:
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
