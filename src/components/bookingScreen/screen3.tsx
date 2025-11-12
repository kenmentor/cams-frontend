import React from "react";
import FlotingShape from "../FlotingShape";
import { motion } from "framer-motion";
import { BsCheckCircle, BsDownload } from "react-icons/bs";
import { toast } from "sonner";

const Screen3 = () => {
  const handleDownloadReceipt = () => {
    // Example placeholder
    toast.loading("Downloading receipt...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-900 flex justify-center items-center relative overflow-hidden">
      {/* Floating shapes */}
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

      {/* Card */}
      <div className="max-w-lg w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8 text-center"
        >
          {/* Success Icon */}
          <BsCheckCircle className="mx-auto text-green-400" size={60} />

          <h2 className="text-3xl font-bold mt-4 text-green-400">
            Booking Confirmed!
          </h2>
          <p className="text-gray-300 mt-2">
            You have successfully booked this property.
          </p>

          {/* Next Steps */}
          <div className="mt-6 text-left">
            <h3 className="text-lg font-semibold text-white">
              What to do next:
            </h3>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Check your email for booking details.</li>
              <li>Contact the property manager to arrange a visit.</li>
              <li>Bring payment receipt on the day of viewing.</li>
            </ul>
          </div>

          {/* Placeholder Map */}
          <div className="mt-6 bg-gray-700 h-40 rounded-lg flex items-center justify-center text-gray-400">
            Map Placeholder
          </div>

          {/* Buttons */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center justify-center gap-2"
            >
              <BsDownload /> Download Receipt
            </button>
            <a href="/homepage" className=" text-white">
              <button className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition duration-200">
                Back to Home
              </button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Screen3;
