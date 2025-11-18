"use client";
// @ts-nocheck
import Image from "next/image";
import { motion } from "framer-motion";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiEdit, BiUser } from "react-icons/bi";
import { GrLike } from "react-icons/gr";

import { GoLocation } from "react-icons/go";

import { CgAtlasian } from "react-icons/cg";

type ResourceProps = {
  header: string;
  thumbnail: string;
  maxguest: number;
  id: string;
  location: string;
  category?: string;
  isNew?: boolean;
  gallery?: { src: string; alt: string }[];
  hostId: string;
  userId?: string;
  eventdate?: string | Date;
};

const Resource = ({
  header,
  thumbnail,
  maxguest,
  id,
  hostId,
  location,
  category = "academics",
  eventdate = new Date().toDateString(),
  userId,
}: ResourceProps) => {
  const router = useRouter();
  const isOwner = hostId === userId;

  const handleEdit = () => {
    console.log(maxguest);
    router.push(`/edit-post/${id}`);
  };

  // Category styling
  const categoryColorMap: Record<string, string> = {
    sport: "bg-blue-700/30 text-blue-500",
    sports: "bg-blue-700/30 text-blue-500",
    club: "bg-orange-700/30 text-orange-500",
    clubs: "bg-orange-700/30 text-orange-500",
    academic: "bg-green-700/30 text-green-500",
    academics: "bg-green-700/30 text-green-500 ",

    social: "bg-green-700/30 text-green-500",
    socials: "bg-green-700/30 text-green-500",
    workshop: "bg-green-700/30 text-green-500",
    workshops: "bg-green-700/30 text-green-500",
  };
  // Convert eventdate prop into readable format
  const dateObj = new Date(eventdate);
  const month = dateObj.toLocaleString("default", { month: "short" }); // e.g., "Nov"
  const day = dateObj.getDate(); // e.g., 11

  const categoryStyle =
    categoryColorMap[category] || "bg-gray-100 text-puple-700";

  return (
    <Link
      href={`/${id}/resource-details`}
      className="text-gray-300 hover:text-gray-300"
    >
      <motion.div
        className="relative  bg-[#1C1C1E]rounded-2xl overflow-hidden  dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer shadow-lg "
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.3 }}
      >
        {/* Edit Badge */}
        {isOwner && (
          <span
            onClick={handleEdit}
            className="absolute top-3 left-3 z-10 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-500 transition"
            title="Edit Resource"
          >
            <BiEdit />
          </span>
        )}

        {/* Thumbnail / Hero Image */}
        <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={thumbnail}
            alt={header}
            layout="fill"
            objectFit="cover"
            unoptimized
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="px-[20px] pb-1">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex flex-col items-center justify-center text-center bg-[#0A84FF] text-white rounded-xl w-16 h-16 p-2 shadow-md">
              <span className="text-sm font-medium">{month}</span>
              <span className="text-2xl font-bold">{day}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{header}</h2>
              <p className="text-gray-300 text-sm">
                {new Date(eventdate).toLocaleDateString(undefined, {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="gap-1 flex pb-5">
            <span
              className={` px-2  m-0 flex items-center gap-1  ${categoryStyle} rounded-lg`}
            >
              <CgAtlasian />

              {category}
            </span>
            <span
              className={` m-0 flex items-center px-2 gap-1  bg-orange-700/30 text-orange-500   rounded-lg`}
            >
              <BiUser />
              {"all university can join "}
            </span>
          </div>

          <div className="flex p-3 bg-[#252527] rounded-lg items-center ">
            <div className="flex items-center w-full text-[16px] gap-2">
              <GoLocation /> <p>{location}</p>
            </div>
            <GrLike />
          </div>
        </div>
        {/* Content */}
      </motion.div>
    </Link>
  );
};

export default Resource;
