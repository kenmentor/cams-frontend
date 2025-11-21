"use client";

import { useState, useEffect } from "react";
import FlotingShape from "@/components/FlotingShape";
import Input from "@/components/Input";
import { motion } from "framer-motion";
import { BiLoader, BiLock, BiUser } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { GrContact } from "react-icons/gr";
import Link from "next/link";
import { useAuthStore } from "../store/authStore";
import PasswordStrengthMeter from "@/components/passwordStrengthMeter";
import { useRouter } from "next/navigation";

function SignupPage() {
  const signup = useAuthStore((state) => state.signup);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const router = useRouter();
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    regNumber: "",
  });

  const [sentCode, setsentCode] = useState(false);
  const [code, setCode] = useState("99");
  // Track form data updates
  useEffect(() => {
    console.log("Form Data Updated:", formData);
  }, [formData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await signup(formData);
      setCode(data.verifyToken);
      console.log(
        "////////////////////////////////////////////////////////////////////////",
        data
      );
      console.log("Signup response:", data);
      if (data?.status === 200) {
        setsentCode(true); // Show verification message
        router.push(`/verify-email/${data.data.verifyToken}`);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white-200 via-blue-200 to-blue-200 flex items-center justify-center overflow-hidden">
      {/* Floating Shapes Background */}
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

      {/* Glass-Morphic Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            {sentCode ? (
              <div className="flex items-center justify-center p-5">
                <p className="text-green-400 font-semibold text-center">
                  ✅ Check your email to verify your account.
                </p>
              </div>
            ) : (
              <>
                <Input
                  icon={BiUser}
                  type="text"
                  placeholder="Full Name"
                  value={formData.userName}
                  name="userName"
                  onChange={handleChange}
                />
                <Input
                  icon={MdEmail}
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  name="email"
                  onChange={handleChange}
                />
                <Input
                  icon={GrContact}
                  type="number"
                  placeholder="Registration Number"
                  value={formData.regNumber}
                  name="regNumber"
                  onChange={handleChange}
                />
                <Input
                  icon={BiLock}
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                />

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={formData.password} />
              </>
            )}

            <motion.button
              type="submit"
              disabled={isLoading || sentCode}
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.9 }}
            >
              {isLoading ? (
                <BiLoader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </motion.button>

            {error && (
              <p className="text-red-500 font-semibold mt-2 text-center">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Footer: Login Link */}
        <div className="px-8 py-4 bg-gray-900/50 backdrop-blur-sm flex justify-center rounded-b-2xl">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <Link href="/Login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Fullscreen Loader Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <BiLoader size={48} className="text-white animate-spin" />
        </div>
      )}
    </div>
  );
}

export default SignupPage;
