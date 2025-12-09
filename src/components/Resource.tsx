"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BiEdit, BiUser } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { GrLike } from "react-icons/gr";
import { CgAtlasian } from "react-icons/cg";

type ResourceProps = {
  id: string;
  header: string;
  thumbnail: string;
  maxguest: number;
  location: string;
  category?: string;
  hostId: string;
  userId?: string;
  eventdate?: string | Date;
  isNew?: boolean;
};

// Random tag generator (adds life to the UI)
const randomTags = [
  "🔥 Trending",
  "⭐ Sponsored",
  "🎉 Limited Slots",
  "📣 Open to All",
  "🚀 Featured",
  "🌟 Popular Pick",
];

const getRandomTag = () =>
  randomTags[Math.floor(Math.random() * randomTags.length)];

const categoryColorMap: Record<string, string> = {
  sport: "bg-blue-700/20 text-blue-400 border border-blue-600/40",
  sports: "bg-blue-700/20 text-blue-400 border border-blue-600/40",
  club: "bg-orange-700/20 text-orange-400 border border-orange-600/40",
  clubs: "bg-orange-700/20 text-orange-400 border border-orange-600/40",
  academic: "bg-green-700/20 text-green-400 border border-green-600/40",
  academics: "bg-green-700/20 text-green-400 border border-green-600/40",
  workshop: "bg-purple-700/20 text-purple-400 border border-purple-600/40",
  workshops: "bg-purple-700/20 text-purple-400 border border-purple-600/40",
  social: "bg-pink-700/20 text-pink-400 border border-pink-600/40",
  socials: "bg-pink-700/20 text-pink-400 border border-pink-600/40",
};

export default function Resource({
  id,
  header,
  thumbnail,
  location,
  hostId,
  userId,
  category = "academic",
  eventdate = new Date(),
}: ResourceProps) {
  const router = useRouter();
  const isOwner = hostId === userId;
  const randomTag = getRandomTag();

  const dateObj = new Date(eventdate);
  const month = dateObj.toLocaleString("default", { month: "short" });
  const day = dateObj.getDate();

  const categoryStyle =
    categoryColorMap[category.toLowerCase()] ||
    "bg-gray-700/20 text-gray-300 border border-gray-600/40";

  const handleEdit = () => {
    router.push(`/edit-post/${id}`);
  };

  return (
    <Link href={`/${id}/resource-details`} className="text-gray-300">
      <motion.div
        className="relative bg-[#1C1C1E] rounded-2xl overflow-hidden dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
        whileTap={{ scale: 0.97 }}
      >
        {/* Edit Badge */}
        {isOwner && (
          <button
            onClick={handleEdit}
            className="absolute top-3 left-3 z-20 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-500 transition"
            title="Edit Resource"
          >
            <BiEdit />
          </button>
        )}

        {/* Hero Image */}
        <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden rounded-t-2xl">
          <Image
            src={thumbnail}
            alt={header}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="px-5 pb-4 pt-3">
          {/* Date + Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col items-center justify-center bg-[#0A84FF]/90 text-white rounded-xl w-16 h-16 p-2 shadow">
              <span className="text-sm font-medium">{month}</span>
              <span className="text-2xl font-bold">{day}</span>
            </div>

            <div>
              <h2 className="text-lg font-semibold leading-snug">{header}</h2>

              <p className="text-gray-400 text-sm">
                {dateObj.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  year: "numeric",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pb-4">
            <span
              className={`px-2 py-1 flex items-center gap-1 rounded-lg text-sm ${categoryStyle}`}
            >
              <CgAtlasian /> {category}
            </span>

            <span className="px-2 py-1 flex items-center gap-1 bg-orange-700/20 text-orange-400 rounded-lg border border-orange-600/40 text-sm">
              <BiUser /> All University Students
            </span>

            {/* Random dynamic tag */}
            <span className="px-2 py-1 bg-[#2E2E30] text-gray-300 rounded-lg border border-gray-700 text-sm">
              {randomTag}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between bg-[#252527] rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-[15px]">
              <GoLocation />
              <p>{location}</p>
            </div>

            <GrLike />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
