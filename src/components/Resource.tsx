"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { BiCalendarEvent, BiEdit } from "react-icons/bi";
import { GrGroup } from "react-icons/gr";

// Define the resource type
type ResourceProps = {
  header: string;
  thumbnail: string;
  maxguest: number;
  id: string;
  location: string;
  category?: string;
  isNew?: boolean;
  gallery: { src: string; alt: string }[];

  hostId: string;
  userId?: string;
  eventdate?: string;
};

const Resource = ({
  header,
  thumbnail,
  maxguest,
  id,
  hostId,
  location,
  category = "academics",
  eventdate = "s",
  userId,
}: ResourceProps) => {
  let categoryStyle = "text-blue-500 bg-blue-100 ";

  if (category === "sport") {
    categoryStyle = "text-blue-500";
  }
  if (category === "club") {
    categoryStyle = "text-orange-500";
  }

  if (category === "academic") {
    categoryStyle = "text-green-500";
  }

  if (category === "social") {
    categoryStyle = "text-green-500";
  }

  if (category === "workshop") {
    categoryStyle = "text-green-500";
  }
  const router = useRouter();
  const isOwner = hostId === userId;
  function handleEdit() {
    router.push(`/edit-post/${id}`);
  }

  return (
    <motion.div
      className="relative  bg-gray-50 rounded-sm overflow-hidden border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* New Badge (Replace later) */}
      <span
        onClick={handleEdit}
        className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md"
      >
        <BiEdit />
      </span>

      {/* Thumbnail Section */}
      <div className="relative h-52 w-full overflow-hidden">
        {isOwner && (
          <span
            onClick={handleEdit}
            className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md z-10"
          >
            <BiEdit />
          </span>
        )}

        <Image
          src={thumbnail}
          alt={"hhh"}
          layout="fill"
          objectFit="cover"
          unoptimized={true}
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Details Section */}
      <div className="p-4 space-y-3">
        {/* Title, Price & Category */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {header}
          </h2>

          <span className="text-lg font-bold text-blue-500 flex items-center gap-2">
            <BiCalendarEvent />
            {eventdate.toLocaleString()}
          </span>
          <span className="text-lg font-bold text-blue-500 flex items-center gap-2">
            <GrGroup />
            {maxguest.toLocaleString()}
          </span>
        </div>

        {/* Landmark & Category */}
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <FaMapMarkerAlt className="text-red-500" /> {location}
        </p>
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          {/* Category */}
          <p
            className={`${categoryStyle} text-[10px] sm:text-xs font-medium  px-2 py-1 rounded-lg`}
          >
            {category}
          </p>
        </div>

        {/* View Details Button */}
        <Link
          href={`/${id}/resource-details`}
          className="block text-center text-white  bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-2 rounded-sm font-medium hover:text-blue-500"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default Resource;
