"use client";
import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

// Landing page component for Campus Activity Management System
// Built with React + Tailwind CSS + Framer Motion
// Primary theme: blue-500 + white

export default function CampusLanding() {
  const container = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Top nav */}
      <header className="backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
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
                    d="M12 6v6l4 2"
                  />
                </svg>
              </div>
              <span className="font-semibold text-lg">CampusPulse</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <a className="hover:text-slate-900" href="#features">
              Features
            </a>
            <a className="hover:text-slate-900" href="#preview">
              Preview
            </a>

            <a className="hover:text-slate-900" href="#contact">
              Contact
            </a>
            <a
              href="/Signup"
              className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow hover:scale-[1.01] transform transition"
            >
              Get Started
            </a>
          </nav>

          <div className="md:hidden">
            <button
              aria-label="Open menu"
              className="p-2 rounded-lg bg-gray-100"
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
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* decorative shapes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute -left-32 -top-28 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-100/50 to-indigo-100/30 blur-3xl pointer-events-none"
          />

          <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex-1"
            >
              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-extrabold leading-tight"
              >
                Organize, Collaborate, <br />{" "}
                <span className="text-blue-500">and Enjoy Campus Life </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-lg text-slate-600 max-w-xl"
              >
                CampusPulse helps student leaders, clubs, and campus admins run
                events, coordinate volunteers, and engage students
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex gap-3">
                <a
                  href="/Login"
                  className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg hover:shadow-xl transform transition hover:-translate-y-0.5"
                >
                  Get Started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Learn more
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-6 text-sm text-slate-500"
              >
                Trusted by student unions at universities and colleges across
                the country.
              </motion.div>

              {/* small feature chips */}
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                  Event scheduling
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                  Volunteer signups
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm">
                  Club dashboards
                </span>
              </motion.div>
            </motion.div>

            {/* Mockup / preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex-1 max-w-xl w-full"
            >
              <div className="relative rounded-2xl shadow-2xl ring-1 ring-slate-100 p-6 bg-gradient-to-b from-white to-blue-50">
                {/* <div className="absolute -right-10 -top-10 w-40 h-40 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 opacity-10 blur-2xl" />
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="w-28 h-7 rounded-lg bg-white/60 backdrop-blur-sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/70" />
                    <div className="w-8 h-8 rounded-full bg-white/70" />
                    <div className="w-8 h-8 rounded-full bg-white/70" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-3">
                    <div className="h-36 rounded-lg bg-white shadow-inner p-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-slate-600">
                          Upcoming
                        </div>
                        <div className="text-sm text-slate-400">Today</div>
                      </div>
                      <div className="space-y-2">
                        <div className="p-2 rounded-md bg-blue-50 border border-blue-100">
                          Club fair • 3:00 PM
                        </div>
                        <div className="p-2 rounded-md bg-white/60 border border-slate-100">
                          Study group • 5:00 PM
                        </div>
                        <div className="p-2 rounded-md bg-white/60 border border-slate-100">
                          Hackathon kickoff • 6:00 PM
                        </div>
                      </div>
                    </div>

                    <div className="h-20 rounded-lg bg-white p-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-500">Engagement</div>
                        <div className="text-lg font-semibold">
                          78% active this week
                        </div>
                      </div>
                      <div className="w-24 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                        Graph
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-24 rounded-lg bg-white p-3 flex items-center justify-center">
                      Calendar
                    </div>
                    <div className="h-36 rounded-lg bg-white p-3">
                      Quick actions
                    </div>
                  </div>
                </div> */}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div
              variants={fadeUp}
              className="rounded-xl p-6 bg-gradient-to-b from-white to-blue-50 shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Event Management</h3>
                  <p className="text-sm text-slate-600">
                    Create events, manage RSVPs, and automate reminders.
                    Built-in templates for campus events.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl p-6 bg-white shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-3-3h-2M9 20H4v-2a3 3 0 013-3h2m6-4a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Club Collaboration</h3>
                  <p className="text-sm text-slate-600">
                    Private club spaces, announcement boards, and shared
                    resources keep every club organized.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="rounded-xl p-6 bg-white shadow"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 11V3m0 8a4 4 0 100 8 4 4 0 000-8zM21 21H3"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Student Analytics</h3>
                  <p className="text-sm text-slate-600">
                    Measure engagement, attendance, and event impact with simple
                    dashboards for organizers.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA */}

        {/* Footer */}
      </main>
    </div>
  );
}
