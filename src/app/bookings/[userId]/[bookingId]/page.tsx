"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";

import Footer from "@/components/footer";

interface BookingDetail {
  host: string;
  guest: string;
  amounte: number;
  house: string;
  status: string;
  paymentId: string;
  checkIn: string;
  checkOut: string;
  timestamps: Date;
}

const BASE_URL = "https://agent-with-me-backend.onrender.com/v1";

const Page: React.FC = () => {
  const [data, setData] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { userId, bookingId } = useParams();

  const fetchBooking = async () => {
    try {
      const { data } = await axios.get<BookingDetail>(
        `${BASE_URL}/booking/${userId}/${bookingId}?role=${user?.role}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setData(data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBooking();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Booking not found.
      </div>
    );
  }

  return (
    <>
      <main className="px-6 py-10 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Booking Details</h1>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <DetailRow label="Guest" value={data.guest} />
          <DetailRow label="Host" value={data.host} />
          <DetailRow
            label="Amount"
            value={`₦${data.amounte.toLocaleString()}`}
          />
          <DetailRow label="House" value={data.house} />
          <DetailRow
            label="Status"
            value={
              <span
                className={`px-3 py-1 rounded-full text-white text-sm ${
                  data.status === "confirmed"
                    ? "bg-green-500"
                    : data.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              >
                {data.status}
              </span>
            }
          />
          <DetailRow label="Payment ID" value={data.paymentId} />
          <DetailRow
            label="Check-in"
            value={new Date(data.checkIn).toLocaleDateString()}
          />
          <DetailRow
            label="Check-out"
            value={new Date(data.checkOut).toLocaleDateString()}
          />
          <DetailRow
            label="Created At"
            value={new Date(data.timestamps).toLocaleString()}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between border-b border-gray-100 pb-2">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

export default Page;
