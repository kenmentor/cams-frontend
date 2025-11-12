"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp, FaLocationArrow } from "react-icons/fa";

import { useParams } from "next/navigation";
import Footer from "@/components/footer";
import HouseMainComponent from "@/components/HouseMainComponent";
import HeaderCustom from "@/components/HeaderCostum";

import Loading from "@/components/Loainding";
import Req from "@/app/utility/axois";

import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { GrGroup } from "react-icons/gr";
import { BsViewList } from "react-icons/bs";

interface data {
  _id: string;
  title: string;
  description: string;
  currentRequest: number;
  views: number;
  category: string;
  thumbnail: string;
  location: string;
  maxguest: number;
  host: {
    _id: string;
    phoneNumber: number;
  };
}

const RentalPage: React.FC = () => {
  const { resourceId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string>("hello");
  const [modalOpen, setModalOpen] = useState(false);

  const [readMore, setReadMore] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<data>({
    _id: "67a1556ba07c49d55f85b11f",
    title: "HELLO ",
    description: "JUST TESTING IF IT IS WORKING ",
    views: 0,
    maxguest: 3000,
    currentRequest: 3000,
    category: "Mediate",
    thumbnail: "",

    location: "ab",

    host: {
      _id: "",
      phoneNumber: 456,
    },
  });
  console.log("model", modalOpen);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { app, base } = Req;

  async function handleRequest() {
    if (!user?._id) {
      setLoading(false);
      return toast.error("You Need To Login ");
    }
    try {
      if (user?.role !== "host") {
        setLoading(true);
        const res = await app.post(`${base}/v1/request`, {
          hostId: data.host._id,
          guestId: user._id,
          houseId: data._id,
        });
        console.log({
          hostId: data.host._id,
          guestId: user._id,
          houseId: data._id,
        });
        console.log(res);

        router.push(`/request/${user._id}`);
        setLoading(false);
      } else {
        setLoading(true);
        router.push(`/request/${user._id}`);
        setLoading(false);
      }
    } catch (erro) {
      const res = erro.response.data;

      console.log(erro);

      toast.error(res.message);
      if (res.status === 401) router.push(`/request/${user._id}`);
      setLoading(false);
    }
  }

  const handleWhatsAppContact = () => {
    if (!data?.host.phoneNumber) {
      toast.error("Sorry, the agent's phone number is not available.");
      return;
    }

    let phone = data.host.phoneNumber.toString();
    if (phone.startsWith("0")) {
      phone = "234" + phone.slice(1); // Convert 080... → 23480...
    }

    const propertyLink = `${window.location.origin}/property/${data?._id}`;
    const message = `
    Hello, I'm interested in attending the Event:

    🏡 *${data?.title || "Event"}*
    🆔 ID: ${data?._id}
    🔗 Link: ${propertyLink}

  `.trim();

    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  async function getData() {
    try {
      const res = await app.get(
        `https://agent-with-me-backend.onrender.com/v1/house/detail/${resourceId}`
      );
      console.log("helloe", res.data.data);
      const result = res.data;

      if (result && result.data) {
        setData(result.data);
        const thumbnail =
          result.data.thumbnail ||
          (result.data.gallery && result.data.gallery[0]) ||
          "";
        setSelectedImage(thumbnail);
        setLoading(false);
      } else {
        console.error("Invalid data structure:", result);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  }
  async function updateView(id: string) {
    try {
      const res = await fetch(
        `https://agent-with-me-backend.onrender.com/v1/house/`,
        {
          method: "PUT",
          body: id,
        }
      );
      console.log(res.json());
    } catch (err) {
      console.log("Fetch error:", err);
    }
  }

  useEffect(() => {
    getData();
    updateView(data._id);
  }, ["ffj"]);

  let categoryStyle = "text-blue-500";

  if (data.category === "sport") {
    categoryStyle = "text-blue-500";
  }
  if (data.category === "club") {
    categoryStyle = "text-orange-500";
  }

  if (data.category === "academic") {
    categoryStyle = "text-green-500";
  }

  if (data.category === "social") {
    categoryStyle = "text-green-500";
  }

  if (data.category === "workshop") {
    categoryStyle = "text-green-500";
  }

  const brokenImage = ""; // Default placeholder for broken images

  return (
    <>
      {loading && <Loading />}
      <HeaderCustom text={data.title || "Title"} showBackButton={true} />
      <div className="max-w-6xl mx-auto p-6 ite shadow-lg  bg-white rounded mt-16">
        {/* Header & Rating */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {data.title || "Title"}
          </h1>
          <div className="flex items-center gap-1">
            <BsViewList className="text-yellow-500" />
            <span className="text-gray-700 font-semibold">
              4.8 ({data.views || "0"} reviews)
            </span>
          </div>
        </div>

        <p className="text-gray-600 mt-1 flex flex items-center gap-2">
          <FaLocationArrow /> {data.location || "location"},
        </p>
        <p className="text-gray-600 mt-1 flex items-center gap-2 ">
          <GrGroup /> {data.maxguest || "max guest"},
        </p>

        {/* Main Image */}
        <div
          className="relative w-full h-80 mt-4 rounded overflow-hidden cursor-pointer"
          onClick={() => setModalOpen(true)}
        >
          <img
            src={selectedImage || brokenImage}
            alt={data.title || "Title"}
            // layout="fill"

            className="rounded transition duration-300 hover:opacity-80 h-full w-full object-cover"
            onError={(e) => (e.currentTarget.src = brokenImage)} // Handle broken images
          />
        </div>

        {/* Image Gallery - Slider */}

        {/* Pricing & Booking */}
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <p className="text-gray-600">
            <div className="inline bg-gray-200 rounded-xl px-2 py-1 text-center">
              <p className={`${categoryStyle} inline`}>{data.category}</p>
            </div>
          </p>
          {user?.role != "host" ? (
            <button
              disabled
              className="mt-4 w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
              onClick={handleRequest}
            >
              Request
            </button>
          ) : (
            <button
              className="mt-4 w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
              onClick={handleRequest}
            >
              Check Details
            </button>
          )}
          {/* WhatsApp Contact Button */}

          <button
            onClick={handleWhatsAppContact}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 transition"
          >
            <FaWhatsapp className="text-xl" />
            Contact via WhatsApp
          </button>
        </div>
        {/* Description */}
        <div className="text-gray-800 bg-gray-100 p-4 rounded mt-2">
          <h1 className="font-semibold text-lg">Description</h1>
          <div className="relative">
            <p
              className={`transition-all duration-300 ease-in-out ${
                !readMore ? "max-h-20 overflow-hidden" : "max-h-full"
              }`}
              style={{
                WebkitLineClamp: !readMore ? 3 : "none",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
              }}
            >
              {data.description}
              <span
                onClick={() => setReadMore((prev) => !prev)}
                className="text-blue-500 cursor-pointer  "
              >
                {!readMore ? "Read more" : "Show less"}
              </span>
            </p>
          </div>
        </div>

        {/* Modal for Full-Screen Image View */}
      </div>

      <div className="bg-white ">
        {
          <>
            <h1>You may like this events </h1>
            <HouseMainComponent
              keyword={{
                category: data.category,

                searchWord: data.location,
                limit: 6,
                id: data?._id,
              }}
              bardge={1}
              page={false}
            />
          </>
        }
      </div>

      <Footer />
    </>
  );
};

export default RentalPage;
