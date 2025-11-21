"use client";

import React, { useEffect, useRef, useState } from "react";
import FlotingShape from "@/components/FlotingShape";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { useParams, useRouter } from "next/navigation";
import { BiLoader } from "react-icons/bi";
import { toast } from "sonner";

const ScreenBlocker = () => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <BiLoader className="animate-spin text-white" size={40} />
  </div>
);

const VerifyEmailPage = () => {
  const { urlCode } = useParams();
  const router = useRouter();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [isRedirecting, setIsRedirecting] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Autofill URL code if present
  useEffect(() => {
    if (urlCode) {
      const initialCode = urlCode.toString().slice(0, 6).split("");
      const paddedCode = [
        ...initialCode,
        ...Array(6 - initialCode.length).fill(""),
      ];
      setCode(paddedCode);
    }
  }, [urlCode]);

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    // Paste handling
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) newCode[i] = pasted[i] || "";
      setCode(newCode);

      const nextFocus = newCode.findIndex((c) => c === "");
      if (nextFocus !== -1) inputRefs.current[nextFocus].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length < 6) {
      toast.error("Please enter the complete 6-digit code.");
      return;
    }

    try {
      const response = await verifyEmail(verificationCode);
      console.log("Verification response:", response);
      if (response?.status === 200 || response?.data?.status === 200) {
        setIsRedirecting(true);
        setTimeout(() => router.push("/Login"), 1500);
        toast.success("Email verified successfully!");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Error verifying email.");
    }
  };

  // Auto-submit when all fields filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) handleSubmit();
  }, [code]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white-200 via-blue-200 to-blue-200 flex items-center justify-center overflow-hidden">
      {isRedirecting && <ScreenBlocker />}

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

      <div className="max-w-md w-full bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
            Verify Your Email
          </h2>
          <p className="text-center text-gray-300 mb-6">
            Enter the 6-digit code sent to your email address
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between">
              {code.map((digit, index) => (
                <input
                  key={index}
                  //@ts-expect-error i dont have much time to fixe this launch is today
                  ref={(el) => (inputRefs.current[index] = el!)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-500 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLoading ? (
                <BiLoader className="animate-spin mx-auto" size={24} />
              ) : (
                "Verify Email"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
