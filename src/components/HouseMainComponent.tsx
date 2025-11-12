"use client";

import Resource from "@/components/Resource";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loainding";
import Error from "@/components/Erro";
import { motion } from "framer-motion";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import Req from "@/app/utility/axois";
// import { useSearchParams } from "next/navigation";

interface ResourceType {
  header: string;
  views: number;
  description: string;
  id: string;
  thumbnail: string;
  location: string;
  gallery: { src: string; alt: string }[];
  maxguest: number;
  eventdate: string;
  _id: string;
  host: string;
}

interface keyword {
  searchWord: string;
  limit: number;

  category?: string;
  id?: string;
}

interface HouseMainComponent {
  keyword?: keyword;
  bardge?: number;
  page: boolean;
  userId?: string;
}

const HouseMainComponent: React.FC<HouseMainComponent> = ({
  keyword,
  bardge = 1,
  page = true,
  userId,
}) => {
  const [data, setData] = useState<ResourceType[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(keyword);
  const user = useAuthStore((state) => state.user);
  console.log(user);
  const router = useRouter();
  const { base, app } = Req;
  useEffect(() => {
    //https://agent-with-me-backend.onrender.com
    const finalUrl = `${base}/v1/event&category=${
      keyword?.category || ""
    }&searchWord=${keyword?.searchWord || ""}&limit=${
      keyword?.limit || ""
    }&userId=${userId || ""}`;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = (await app.get(finalUrl)).data;
        const result = await res.data;
        console.log(result);
        console.log(keyword?.searchWord);
        console.log(bardge);
        setData(result);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    console.log("gfgg");

    fetchData();
  }, [page ? keyword : ""]);
  function handleRequest() {
    router.push("/book-on-request");
  }
  return (
    <main className="px-6 py-10 ">
      {loading ? (
        <Loading />
      ) : error ? (
        <Error />
      ) : (
        <motion.div
          className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {data.length > 0 ? (
            data.map((resource) => (
              <Resource
                key={resource._id}
                thumbnail={resource.thumbnail || "/de/d"}
                id={resource._id}
                header={resource.header}
                gallery={resource.gallery}
                location={resource.location}
                hostId={resource?.host}
                userId={user?._id}
                maxguest={resource.maxguest}
                eventdate={resource.eventdate}
              />
            ))
          ) : (
            <div>
              <p className="text-gray-500 text-center col-span-full">
                Tell our Agent What You Want
              </p>
              <button onClick={handleRequest}>Request</button>
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
};

export default HouseMainComponent;
