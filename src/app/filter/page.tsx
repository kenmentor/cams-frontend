"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useRouter } from "next/navigation";
// If you actually have this component, it will render; if not, remove it.

import HeaderCustom from "@/components/HeaderCostum";
import StepPill from "@/components/StepPill";

import Screen1 from "@/components/filterScreen/Screen1";
import Screen2 from "@/components/filterScreen/Screen2";
import Screen3 from "@/components/filterScreen/Screen3";
import Screen4 from "@/components/filterScreen/Screen4";
import Screen5 from "@/components/filterScreen/screen5";

type Filters = {
  state: string;
  lga: string;
  landmark: string;
  type: string;
  min: number;
  max: number;
  amenities: string[];
};

const STATES = {
  Lagos: ["Ikeja", "Surulere", "Lekki", "Yaba"],
  "Abuja FCT": ["Wuse", "Garki", "Maitama", "Gwarinpa"],
  Rivers: ["Obio-Akpor", "Port Harcourt", "Okrika"],
  "Cross River": ["Calabar Municipality", "Calabar South", "Ogoja"],
};

const PROPERTY_TYPES = [
  "Self-Contain",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "Studio",
  "Duplex",
];

const variants = {
  enter: { opacity: 0, y: 10, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const Filter: React.FC = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    state: "",
    lga: "",
    landmark: "",
    type: "",
    min: 0,
    max: 10_000_000,
    amenities: [],
  });

  const goNext = () => setStep((s) => Math.min(5, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submit = () => {
    // Navigate to results page with query params (adjust path to your app)
    const params = new URLSearchParams({
      state: filters.state,
      lga: filters.lga,
      landmark: filters.landmark,
      type: filters.type,
      min: String(filters.min),
      max: String(filters.max),
      amenities: filters.amenities.join(","),
    }).toString();

    router.push(`/homepage?${params}`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(60%_80%_at_20%_10%,rgba(56,78,234,0.10),transparent),radial-gradient(50%_60%_at_80%_20%,rgba(0,0,0,0.2),transparent)] bg-slate-950 pt-20">
      {/* Top Bar */}
      <HeaderCustom text="Filter" />
      {/* Container */}
      <div className="mx-auto w-full max-w-6xl px-4 pb-20">
        {/* Card */}
        <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />

          {/* Steps Header */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <StepPill index={1} active={step === 1} done={step > 1} />
              <div
                className={classNames(
                  "h-px flex-1",
                  step > 1 ? "bg-blue-500/50" : "bg-slate-800"
                )}
              />
              <StepPill index={2} active={step === 2} done={step > 2} />
              <div
                className={classNames(
                  "h-px flex-1",
                  step > 2 ? "bg-blue-500/50" : "bg-slate-800"
                )}
              />
              <StepPill index={3} active={step === 3} done={step > 3} />
              <div
                className={classNames(
                  "h-px flex-1",
                  step > 3 ? "bg-blue-500/50" : "bg-slate-800"
                )}
              />
              <StepPill index={4} active={step === 4} done={step > 4} />
              <div
                className={classNames(
                  "h-px flex-1",
                  step > 4 ? "bg-blue-500/50" : "bg-slate-800"
                )}
              />
              <StepPill index={5} active={step === 5} done={false} />
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <Screen1
                  variants={variants}
                  filters={filters}
                  setFilters={setFilters}
                  states={STATES}
                />
              )}

              {step === 2 && (
                <Screen2
                  variants={variants}
                  filters={filters}
                  setFilters={setFilters}
                  PROPERTY_TYPES={PROPERTY_TYPES}
                />
              )}

              {step === 3 && (
                <Screen3
                  variants={variants}
                  filters={filters}
                  setFilters={setFilters}
                />
              )}

              {step === 4 && (
                <Screen4
                  variants={variants}
                  filters={filters}
                  setFilters={setFilters}
                  states={STATES}
                />
              )}

              {step === 5 && (
                <Screen5
                  variants={variants}
                  filters={filters}
                  setFilters={setFilters}
                />
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                onClick={goBack}
                disabled={step === 1}
                className={classNames(
                  "px-4 py-2 rounded-xl border transition",
                  step === 1
                    ? "border-slate-800 text-white cursor-not-allowed"
                    : "border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-800/50"
                )}
              >
                Back
              </button>

              <div className="flex-1" />

              {step < 5 ? (
                <button
                  onClick={goNext}
                  //   disabled={!canGoNext}
                  className={classNames(
                    "px-5 py-2 rounded-xl font-semibold transition",

                    "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_6px_20px_-5px_rgba(37,99,235,0.6)]"
                  )}
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={submit}
                  className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_6px_20px_-5px_rgba(37,99,235,0.6)]"
                >
                  See Homes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
