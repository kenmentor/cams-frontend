"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Resource from "@/components/Resource";

import Error from "@/components/Erro";
import { useAuthStore } from "@/app/store/authStore";
import Req from "@/app/utility/axois";

interface ResourceType {
  header: string;
  views: number;
  description: string;
  id: string;
  thumbnail: string;
  location: string;
  gallery: { src: string; alt: string }[];
  maxguest: number;
  createdAt: string;
  _id: string;
  host: string;
}

interface keyword {
  searchWord: string;
  limit: number;
  category?: string;
  id?: string;
}

interface HouseMainComponentProps {
  keyword?: keyword;
  bardge?: number;
  page: boolean;
  userId?: string;
}

const HouseMainComponent: React.FC<HouseMainComponentProps> = ({
  keyword,
  bardge = 1,
  page = true,
  userId,
}) => {
  const [data, setData] = useState<ResourceType[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const { base, app } = Req;

  useEffect(() => {
    console.log(bardge);
    const finalUrl = `${base}/v1/event?category=${
      keyword?.category || ""
    }&searchWord=${keyword?.searchWord || ""}&limit=${
      keyword?.limit || ""
    }&userId=${userId || ""}`;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = (await app.get(finalUrl)).data;
        setData(res.data || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page ? keyword : ""]);

  return (
    <main className=" dark:bg-[#111111] min-h-screen">
      {loading ? (
        <div>loading...</div>
      ) : error ? (
        <Error />
      ) : data.length > 0 ? (
        <motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {data.map((resource) => (
            <Resource
              key={resource._id}
              thumbnail={resource.thumbnail || "/placeholder.png"}
              id={resource._id}
              header={resource.header}
              gallery={resource.gallery}
              location={resource.location}
              hostId={resource.host}
              userId={user?._id}
              maxguest={resource.maxguest}
              eventdate={resource.createdAt}
            />
          ))}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No resources found matching your criteria.
          </p>
        </div>
      )}
    </main>
  );
};

export default HouseMainComponent;
