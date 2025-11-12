"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BiLoader } from "react-icons/bi";
import { toast } from "sonner";

interface Screen2Props {
  next: () => void;
  back: () => void;
  email?: string;
  amount?: number;
  guestId?: string;
  hostId?: string;
  houseId?: string;
}

interface PaymentInitResponse {
  authorization_url: string;
  reference: string;
  bankDetails?: {
    account_name: string;
    account_number: string;
    bank_name: string;
  };
}

const Screen2: React.FC<Screen2Props> = ({
  next,
  back,
  email,
  amount,
  guestId,
  hostId,
  houseId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authorizationUrl, setAuthorizationUrl] = useState<string>("");
  const [transactionReference, setTransactionReference] = useState<string>("");
  const [popupWindow, setPopupWindow] = useState<Window | null>(null);
  const [bankDetails, setBankDetails] = useState<
    PaymentInitResponse["bankDetails"] | null
  >(null);

  // Initialize payment on mount
  useEffect(() => {
    const initializePayment = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "https://agent-with-me-backend.onrender.com/v1/payment/initialize-bank-transfer",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, amount, guestId, hostId, houseId }),
          }
        );

        const data = await res.json();
        if (data.status === 200 || data.ok) {
          setAuthorizationUrl(data.data.authorization_url);
          setTransactionReference(data.data.reference);
          if (data.data.bankDetails) setBankDetails(data.data.bankDetails);
        } else {
          toast.error("Failed to initialize payment.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error initializing payment.");
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();
  }, [email, amount, guestId, hostId, houseId]);

  const handlePayNow = () => {
    if (!authorizationUrl) return toast.error("Payment URL not ready yet.");

    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const newPopup = window.open(
      authorizationUrl,
      "Paystack Payment",
      `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars=yes,status=1`
    );

    if (newPopup) {
      setPopupWindow(newPopup);
      newPopup.focus();
    } else {
      toast.error("Popup blocked! Please allow popups for this site.");
    }
  };

  const handleVerify = async () => {
    if (!transactionReference)
      return toast.error("No transaction reference found.");

    setIsLoading(true);
    try {
      let paymentVerified = false;
      const startTime = Date.now();
      const timeout = 60_000;
      const interval = 3000;

      while (!paymentVerified && Date.now() - startTime < timeout) {
        const res = await fetch(
          `https://agent-with-me-backend.onrender.com/v1/check-payment/${transactionReference}`
        );
        const data = await res.json();

        if (data.status === "success") {
          paymentVerified = true;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
      }

      if (paymentVerified) {
        popupWindow?.close();
        next();
      } else {
        toast.error("Payment not verified yet. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error verifying payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-blue-900 flex justify-center items-center px-4">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Payment
        </h2>
        {bankDetails && (
          <div className="text-gray-200 mb-4 space-y-2">
            <p>Account Name: {bankDetails.account_name}</p>
            <p>Account Number: {bankDetails.account_number}</p>
            <p>Bank Name: {bankDetails.bank_name}</p>
          </div>
        )}

        <p className="text-center text-gray-300 mb-6">
          Click &quot Pay Now &quot to open the Paystack popup, then verify your
          payment.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={back}
            className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            Back
          </button>

          <motion.button
            onClick={handlePayNow}
            className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <BiLoader className="animate-spin mx-auto" size={24} />
            ) : (
              "Pay Now"
            )}
          </motion.button>

          <motion.button
            onClick={handleVerify}
            className="flex-1 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <BiLoader className="animate-spin mx-auto" size={24} />
            ) : (
              "Verify"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Screen2;
