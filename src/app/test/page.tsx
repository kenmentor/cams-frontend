"use client";

import { useEffect, useState } from "react";
import {
  FaWhatsapp,
  FaLocationArrow,
  FaCalendarAlt,
  FaShareAlt,
} from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/footer";
import HouseMainComponent from "@/components/HouseMainComponent";
import HeaderCustom from "@/components/HeaderCostum";
import Loading from "@/components/Loainding";
import Req from "@/app/utility/axois";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "sonner";
import { GrGroup } from "react-icons/gr";
import { BsViewList } from "react-icons/bs";
import { BiTime, BiUser } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import ClientMap from "@/components/ClientMapWrapper";
import Map from "@/components/Map";
import Countdown from "react-countdown";

interface Data {
  _id: string;
  title: string;
  description: string;
  currentRequest?: number;
  views: number;
  category: string;
  thumbnail: string;
  location: string;
  maxguest: number;
  dateTime?: string;
  host: { _id: string; phoneNumber?: number };
  available?: boolean;
}

const RentalPage: React.FC = () => {
  const { resourceId } = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { app, base } = Req;

  const [selectedImage, setSelectedImage] = useState<string>("");
  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [data, setData] = useState<Data>({
    _id: "",
    title: "",
    description: "",
    views: 0,
    maxguest: 0,
    currentRequest: 0,
    category: "",
    thumbnail: "",
    location: "",
    host: { _id: "" },
    available: true,
  });

  // Fetch event data
  async function getData() {
    try {
      const res = await app.get(`${base}/v1/event/detail/${resourceId}`);
      const result = res.data?.data;
      if (result) {
        setData(result);
        setSelectedImage(result.thumbnail || "");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  }

  // RSVP request
  async function handleRequest() {
    if (!user?._id) return toast.error("You need to login");
    setRequestLoading(true);
    try {
      if (user?.role !== "host") {
        await app.post(`${base}/v1/request`, {
          host: data.host._id,
          guest: user._id,
          event: data._id,
        });
      }
      toast.success("Request sent successfully");
      router.push(
        `/request/${user.role === "geust" ? "guest" : user.role}/${user._id}`
      );
    } catch (erro: any) {
      toast.error(erro.response?.data?.message || "Something went wrong");
    } finally {
      setRequestLoading(false);
    }
  }

  const handleWhatsAppContact = () => {
    if (!data?.host.phoneNumber)
      return toast.error("Organizer's phone not available");
    let phone = data.host.phoneNumber!.toString();
    if (phone.startsWith("0")) phone = "234" + phone.slice(1);
    const link = `${window.location.origin}/property/${data._id}`;
    const message = encodeURIComponent(
      `Hello, I'm interested in attending the Event:\n\n🏡 ${data.title}\n🆔 ID: ${data._id}\n🔗 Link: ${link}`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  useEffect(() => {
    getData();
  }, [resourceId]);

  if (loading) return <Loading />;

  const brokenImage = "/favicon.png";

  return (
    <div className="bg-[#111111] min-h-screen text-white">
      <HeaderCustom text={data.title || "Event"} showBackButton />

      {/* Hero Banner */}
      <div className="relative w-full h-96 md:h-[28rem] overflow-hidden rounded-b-3xl shadow-lg">
        <img
          src={selectedImage || brokenImage}
          alt={data.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 md:p-12 rounded-b-3xl">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
              {data.title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="bg-[#0A84FF] px-4 py-1 rounded-full font-semibold shadow-md">
                {data.category}
              </div>
              {data.dateTime && (
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <FaCalendarAlt />{" "}
                  <Countdown
                    date={new Date(data.dateTime)}
                    renderer={({
                      days,
                      hours,
                      minutes,
                      seconds,
                      completed,
                    }) => {
                      if (completed) return <span>Event Started</span>;
                      return (
                        <span>
                          {days}d {hours}h {minutes}m {seconds}s
                        </span>
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-[#1C1C1E] rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-8">
          {/* Left Panel */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-gray-300">
              <div className="flex items-center gap-2 font-medium">
                <FaLocationArrow className="text-[#0A84FF]" /> {data.location}
              </div>
              <div className="flex items-center gap-2 font-medium">
                <GrGroup className="text-[#30D158]" /> {data.maxguest}{" "}
                participants
              </div>
              <div className="flex items-center gap-2 font-medium">
                <BsViewList className="text-[#FFD60A]" /> {data.views} views
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#2C2C2E] p-6 rounded-2xl shadow-inner">
              <h2 className="text-2xl font-semibold mb-3">Event Description</h2>
              <p
                className={`transition-all duration-300 ease-in-out ${
                  !readMore ? "max-h-36 overflow-hidden" : "max-h-full"
                }`}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: !readMore ? 5 : "none",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {data.description}
                <span
                  onClick={() => setReadMore((prev) => !prev)}
                  className="text-[#0A84FF] cursor-pointer ml-1 font-semibold"
                >
                  {!readMore ? "Read more" : "Show less"}
                </span>
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex gap-1 items-center bg-[#404042] rounded-md p-2 text-[16px] text-purple-300">
                  <BiUser className="text-purple-500" /> Every student can
                  attend
                </div>
                <div className="flex gap-1 items-center bg-[#404042] rounded-md p-2 text-[16px] text-orange-300">
                  <BiTime className="text-orange-500" /> Event Duration: 3hrs
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                onClick={handleRequest}
                className="flex-1 py-4 rounded-2xl bg-[#FF375F] text-white font-semibold shadow-lg hover:bg-[#FF1F4A] transition transform hover:scale-105 flex justify-center items-center"
              >
                {!requestLoading ? (
                  user?.role !== "host" ? (
                    "RSVP"
                  ) : (
                    "Check Details"
                  )
                ) : (
                  <CgSpinner className="animate-spin size-8" />
                )}
              </button>
              <button
                onClick={handleWhatsAppContact}
                className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#30D158] text-white font-semibold shadow-lg hover:bg-[#28B84E] transition transform hover:scale-105"
              >
                <FaWhatsapp className="text-xl" /> Contact Organizer
              </button>
              <button
                onClick={() => toast.success("Reminder Set!")}
                className="flex-1 py-4 rounded-2xl bg-[#0A84FF] text-white font-semibold shadow-lg hover:bg-[#0066FF] transition transform hover:scale-105"
              >
                Set Reminder
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 hidden md:flex flex-col gap-4">
            <div className="w-full h-80 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={selectedImage || brokenImage}
                alt={data.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Event Location</h2>
          <ClientMap />
        </div>

        {/* Suggested Events */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">
            You may like these events
          </h2>
          <HouseMainComponent
            keyword={{
              category: "",
              searchWord: "",
              limit: 6,
              id: data._id,
            }}
            page={false}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RentalPage;
