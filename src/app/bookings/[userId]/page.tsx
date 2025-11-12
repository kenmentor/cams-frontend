"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

import HeaderCustom from "@/components/HeaderCostum";
import Footer from "@/components/footer";
import BookingComponent from "@/components/bookingcomponent";
import Loading from "@/components/Loainding";

interface BookingData {
  host: string;
  guest: string;
  amounte: number;
  house: string;
  status: string;
  paymentId: string;
  checkIn: string;
  checkOut: string;
  timestamps: boolean;
}

const BASE_URL = "https://agent-with-me-backend.onrender.com/v1";

const Page: React.FC = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { userId } = useParams();

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get<BookingData[]>(
        `${BASE_URL}/booking/${userId}?role=${user?.role}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <HeaderCustom text="Your Bookings" />
      <main className="px-6 py-10 mt-10 space-y-6">
        {bookings.length > 0 ? (
          bookings.map((item) => (
            <BookingComponent key={item.paymentId} {...item} />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            You have no booking record
          </p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Page;
