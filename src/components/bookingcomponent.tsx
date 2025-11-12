import React from "react";
import { format } from "date-fns";

interface BookingData {
  host?: string;
  guest?: string;
  amounte?: number;
  house?: string;
  status?: string;
  paymentId?: string;
  checkIn?: string;
  checkOut?: string;
  timestamps?: boolean;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const BookingComponent: React.FC<BookingData> = ({
  host,
  guest,
  amounte,
  house,
  status = "pending",
  paymentId,
  checkIn,
  checkOut,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {house || "Property"}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColors[status.toLowerCase()] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
        <p>
          <span className="font-semibold">Host:</span> {host || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Guest:</span> {guest || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Amount:</span>{" "}
          {amounte ? `₦${amounte.toLocaleString()}` : "N/A"}
        </p>
        <p>
          <span className="font-semibold">Payment ID:</span>{" "}
          {paymentId || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Check In:</span>{" "}
          {checkIn ? format(new Date(checkIn), "dd MMM yyyy") : "N/A"}
        </p>
        <p>
          <span className="font-semibold">Check Out:</span>{" "}
          {checkOut ? format(new Date(checkOut), "dd MMM yyyy") : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default BookingComponent;
