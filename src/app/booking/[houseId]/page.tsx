"use client";

import { useAuthStore } from "@/app/store/authStore";
import Screen1 from "@/components/bookingScreen/screen1";
import Screen2 from "@/components/bookingScreen/screen2";
import Screen3 from "@/components/bookingScreen/screen3";
import FlotingShape from "@/components/FlotingShape";
import Loading from "@/components/Loainding";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface HouseData {
  _id: string;
  images: string[]; // store URLs instead of File for display
  thumbnail: string | null;
  title: string;
  description: string;
  files: string[];
  category: string;
  price: string;
  location: string;
  type: string;
  address: string;
  state: string;
  waterSuply: boolean;
  host: string;
  electricity: number;
}

const BookingPage = () => {
  const [step, setStep] = useState(0);
  const [house, setHouse] = useState<HouseData | null>(null);
  const { houseId } = useParams();

  const user = useAuthStore((state) => state.user);
  const app = axios.create({
    baseURL: "https://agent-with-me-backend.onrender.com",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  function nextStep() {
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setStep((prev) => (prev > 0 ? prev - 1 : 0));
  }

  async function getData() {
    try {
      const res = await app.get(
        `https://agent-with-me-backend.onrender.com/v1/house/detail/${houseId}`
      );
      setHouse(res.data.data);
    } catch (error) {
      console.error("Error fetching house details:", error);
    }
  }

  useEffect(() => {
    getData();
  }, [houseId]);
  if (!user) return <Loading />;
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 ">
      {/* Floating Shapes */}
      <FlotingShape
        color="bg-blue-400"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FlotingShape
        color="bg-blue-400"
        size="w-45 h-45"
        top="50%"
        left="70%"
        delay={5}
      />
      <FlotingShape
        color="bg-blue-400"
        size="w-30 h-30"
        top="-30%"
        left="90%"
        delay={2}
      />

      {/* Step Screens */}
      {step === 1 && <Screen1 next={nextStep} back={prevStep} />}
      {step === 2 && (
        <Screen2
          email={user.email}
          amount={Number(house?.price)}
          guestId={user._id}
          hostId={house?.host}
          houseId={house?._id}
          next={nextStep}
          back={prevStep}
        />
      )}
      {step === 3 && <Screen3 />}

      {/* House Details */}
      {house && step === 0 && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mt-6">
          {house.thumbnail && (
            <img
              src={house.thumbnail}
              alt={house.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {house.title}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {house.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {house.category}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {house.type}
              </p>
              <p>
                <span className="font-semibold">Location:</span>{" "}
                {house.location}
              </p>
              <p>
                <span className="font-semibold">State:</span> {house.state}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {house.address}
              </p>
              <p>
                <span className="font-semibold">Price:</span> ₦{house.price}
              </p>
              <p>
                <span className="font-semibold">Water Supply:</span>{" "}
                {house.waterSuply ? "Available" : "Not Available"}
              </p>
              <p>
                <span className="font-semibold">Electricity:</span>{" "}
                {house.electricity} hrs/day
              </p>
            </div>

            {/* Book Button */}
            <div className="mt-6">
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
