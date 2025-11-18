"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

import { BiMusic } from "react-icons/bi";
import Link from "next/link";

import Resource from "@/components/Resource";

import { useAuthStore } from "@/app/store/authStore";
import Req from "@/app/utility/axois";
import { MdSports } from "react-icons/md";
import { FcConferenceCall } from "react-icons/fc";
import { BsTools } from "react-icons/bs";

interface ResourceType {
  header: string;
  views: number;
  description: string;
  id: string;
  thumbnail: string;
  location: string;
  gallery: { src: string; alt: string }[];
  maxguest: number;
  eventdate: string;
  _id: string;
  host: string;
}

/**
 * CampusLanding — Apple-inspired Campus Management System landing page
 *
 * Notes:
 * - All original framer-motion variants and structure are preserved.
 * - Colors updated to Apple palette (#0A84FF primary)
 * - Layout refined for generous spacing, clarity, and responsive behavior
 * - No logic, routes, or props changed (non-breaking)
 */

export default function CampusLanding() {
  const [event, setEvent] = useState({
    title: "hello just want hello",
    user: "calala",
  });
  if (false) {
  }
  const [data, setData] = useState<ResourceType[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useAuthStore((state) => state.user);
  const { base, app } = Req;
  const [mobileMenu, setMobileMenu] = useState<boolean>(false);
  useEffect(() => {
    setEvent({
      title: "hello just want hello",
      user: "calala",
    });
    console.log(error);
    const finalUrl = `${base}/v1/event`;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = (await app.get(finalUrl)).data;
        setData(res.data || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#1C1C1E]  text-[#111111] antialiased font-sans">
        {/* Top nav */}
        <header className="backdrop-blur-sm sticky top-0 z-50 bg-[#1C1C1E] text-white">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-[#E5E5EA] bg-gradient-to-br from-[#E5E5EA] to-white">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#0A84FF] shadow">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6l4 2"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-lg leading-tight">
                    CampusPulse
                  </span>
                  <div className="text-xs text-slate-500">
                    Campus Activity Management
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
              <a className="hover:text-[#111111] transition" href="#features">
                Events
              </a>
              <a className="hover:text-[#111111] transition" href="#about">
                About
              </a>
              <Link
                href="/Signup"
                className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A84FF] text-white font-medium shadow-sm hover:shadow-md transform transition hover:-translate-y-0.5"
              >
                Login
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label="Open menu"
                className="p-2 rounded-lg bg-white shadow-sm ring-1 ring-[#E5E5EA]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="md:hidden bg-[#1C1C1E] text-white flex flex-col gap-4 px-6 py-4">
              <a href="#features" className="hover:text-[#0A84FF] transition">
                Events
              </a>
              <a href="#about" className="hover:text-[#0A84FF] transition">
                About
              </a>
              <Link
                href="/Signup"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A84FF] text-white font-medium shadow-sm hover:shadow-md transform transition hover:-translate-y-0.5"
              >
                Login
              </Link>
            </div>
          )}
        </header>
        <main className="">
          {/* Hero */}
          <motion.section className="relative overflow-hidden  lg:px-32 px-6 py-12 bg-[url(/photo-1524368535928-5b5e00ddc76b.jpg)]  ">
            {/* Hero background */}
            <div className="absolute inset-0 bg-[#020072]/50"></div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
              className="relative bg-[url('/download.jpg')] bg-cover bg-center rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Overlay for readability */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>

              {/* Hero content */}
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 p-8 md:p-16">
                {/* Left: Event Title */}
                <div className="absolute px-2 py-0 top-2 left-2 text-white border rounded-full ">
                  coming soon
                </div>
                <div className="flex-1">
                  <h1 className="text-5xl font-bold text-white mb-4">
                    CS WEEK
                  </h1>
                  <h2 className="text-gray-300 text-xl md:text-2xl">
                    {event.title}
                  </h2>
                  <p className="mt-4 text-gray-400 max-w-md">
                    CAMS Plus is your go-to platform to explore and manage all
                    campus events seamlessly. Browse, register, and stay
                    up-to-date with the latest activities.
                  </p>
                  <Link href={"/Signup"}>
                    <button className="  bg-transparent text-white border rounded-full ">
                      View details
                    </button>
                  </Link>
                </div>

                {/* Right: CAMS Plus branding */}
                <div className="flex-1 flex flex-col gap-4">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0A84FF]">
                    CAMS PLUS
                  </h1>
                  <p className="text-gray-300">
                    Your campus, your events, simplified. Plan and participate
                    in campus activities with ease and style.
                  </p>

                  {/* Search inputs */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <div className="flex-1 flex flex-col">
                      <label className="text-gray-200 mb-1">Date</label>
                      <input
                        type="date"
                        className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A84FF] text-black"
                      />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <label className="text-gray-200 mb-1">Event</label>
                      <input
                        type="text"
                        placeholder="Search events..."
                        className="px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A84FF] text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Event categories */}
            </motion.div>
            <div className="flex flex-wrap justify-center gap-8 mt-12 md:mt-32 relative z-10 px-6">
              {[
                { name: "Music", icon: BiMusic },
                { name: "Workshop", icon: BsTools },
                { name: "Seminar", icon: FcConferenceCall },
                { name: "Sports", icon: MdSports },
              ].map((cat, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 100 + index }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    duration: 0.6 + index / 10,
                    ease: "easeOut",
                    delay: 0.4,
                  }}
                  key={cat.name}
                  className="flex flex-col items-center justify-center gap-2 w-32 hover:scale-105 transform transition"
                >
                  <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#0A84FF] shadow-lg">
                    <cat.icon size={50} className="text-white" />
                  </div>
                  <span className="text-white font-medium">
                    {cat.name} Event
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.section>
          {/* CTA Section */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className=" px-6 py-16 flex  md:flex-row items-center justify-center gap-12 bg-[#0A84FF]/10  shadow-lg"
          >
            {/* Left: Text */}
            <div className="flex-1 flex flex-col gap-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Join <span className="text-[#0A84FF]">CAMS PLUS</span> Today!
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Be part of your campus community, explore exciting events,
                workshops, and seminars. Stay updated and never miss an activity
                again!
              </p>
              <div className="mt-4">
                <Link href="/Signup">
                  <button className="px-6 py-3 bg-[#0A84FF] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 hover:scale-105">
                    Get Started Now
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Image or Illustration */}
            {/* <div className="flex-1 flex justify-center md:justify-end relative">
            <img
              src="/cta-illustration.png"
              alt="Students joining campus events"
              className="w-full max-w-md animate-fadeIn"
            /> */}
            {/* Optional floating effect */}
            {/* <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#0A84FF]/20 rounded-full blur-3xl animate-pulse-slow"></div>
          </div> */}
          </motion.section>

          {/* Features */}
          <motion.section
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
            id="features"
            className="max-w-7xl mx-auto px-6 py-20"
          >
            {loading ? (
              <div>loading</div>
            ) : data?.length > 0 ? (
              <motion.div
                className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
              >
                {data.map((resource) => (
                  <Resource
                    key={resource._id}
                    thumbnail={resource.thumbnail || "/placeholder.png"}
                    id={resource._id}
                    header={resource.header}
                    location={resource.location}
                    hostId={resource.host}
                    userId={user?._id}
                    maxguest={resource.maxguest}
                    eventdate={resource.eventdate}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No resources found matching your criteria.
                </p>
              </div>
            )}
            <div className="flex items-center justify-center">
              <Link href="/homepage">
                <button>See All Events</button>
              </Link>
            </div>
          </motion.section>

          {/* CTA - optional expanded area for future content */}
          <motion.section
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
            className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 bg-[#1C1C1E] rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Decorative floating circles */}
            <div className="absolute top-0 left-10 w-36 h-36 bg-[#0A84FF]/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-12 w-48 h-48 bg-[#0A84FF]/10 rounded-full blur-3xl animate-pulse-slow"></div>

            {/* Left: Vector image */}
            <div className="flex-1 flex justify-center md:justify-start relative z-10">
              <img
                src="/Imageframe.png"
                alt="Student listening to music and pointing at book"
                className="w-full max-w-md animate-fadeIn"
              />
              {/* Floating play button */}
              <div className="absolute -top-4 right-8 w-12 h-12 bg-[#0A84FF] rounded-full flex items-center justify-center shadow-lg cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 2v20l16-10L4 2z" />
                </svg>
              </div>
            </div>

            {/* Right: Text content */}
            <div className="flex-1 flex flex-col gap-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-[#0A84FF]">Interactive Learning</span> in
                Action
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Explore a dynamic environment where students can{" "}
                <span className="text-[#0A84FF] font-semibold">
                  listen, learn, and interact
                </span>
                with digital content connected to their studies. Boost your
                learning experience and engage in campus activities
                effortlessly.
              </p>
              <Link href={"/Signup"}>
                <button className="w-max px-6 py-3 bg-[#0A84FF] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
            className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 bg-gradient-to-r from-[#0A84FF]/20 via-[#1C1C1E] to-[#0A84FF]/10 rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Decorative floating circles */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#0A84FF]/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-[#0A84FF]/10 rounded-full blur-3xl animate-pulse-slow"></div>

            {/* Left: Vector image */}
            <div className="flex-1 flex justify-center md:justify-start relative z-10">
              <img
                src="/flat-vector-illustration-college-students-600nw-2649885805-removebg-preview.png"
                alt="Two students looking at a book"
                className="w-full max-w-md animate-fadeIn"
              />
              {/* Small floating icons around the image */}
              <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#0A84FF]/30 rounded-full flex items-center justify-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3"
                  />
                </svg>
              </div>
              <div className="absolute -bottom-6 right-6 w-14 h-14 bg-[#0A84FF]/20 rounded-full "></div>
            </div>

            {/* Right: Text content */}
            <div className="flex-1 flex flex-col gap-6 relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                <span className="text-[#0A84FF]">Collaborate</span> and Learn
                Together
              </h2>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
                Discover a platform where{" "}
                <span className="text-[#0A84FF] font-semibold">
                  students interact
                </span>
                , explore workshops, seminars, and campus activities. Gain
                knowledge,{" "}
                <span className="text-[#0A84FF] font-semibold">
                  share ideas
                </span>
                , and participate in events that elevate your campus experience.
              </p>
              <Link href={"/Signup"}>
                <button className="w-max px-6 py-3 bg-[#0A84FF] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          </motion.section>

          {/* Footer (kept minimal and non-breaking) */}
        </main>
      </div>
      <div className=" opacity-0 p-4"></div>
      <Footer />
    </>
  );
}
