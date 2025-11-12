import SectionHeader from "../sectionHeader";
import { motion } from "framer-motion";

import { BiDollar } from "react-icons/bi";

type Filters = {
  state: string;
  lga: string;
  landmark: string;
  type: string;
  min: number;
  max: number;
  amenities: string[];
};
interface Screen1 {
  filters: Filters;
  variants: {
    enter: { opacity: number; y: number; scale: number };
    center: { opacity: number; y: number; scale: number };
    exit: { opacity: number; y: number; scale: number };
  };
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}
const Screen3: React.FC<Screen1> = ({ variants, filters, setFilters }) => {
  const quickSetBudget = (tier: "budget" | "standard" | "premium") => {
    if (tier === "budget")
      setFilters((f) => ({ ...f, min: 100_000, max: 400_000 }));
    if (tier === "standard")
      setFilters((f) => ({ ...f, min: 400_000, max: 1_000_000 }));
    if (tier === "premium")
      setFilters((f) => ({ ...f, min: 1_000_000, max: 3_000_000 }));
  };

  return (
    <motion.div
      key="step3"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        icon={<BiDollar className="text-blue-400" size={24} />}
        title="Set your budget"
        subtitle="You can adjust later—this just helps us filter the best options."
      />

      {/* Presets */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => quickSetBudget("budget")}
          className="rounded-full border border-slate-800 bg-slate-800/60 px-4 py-2 text-slate-200 hover:border-slate-700"
        >
          Budget
        </button>
        <button
          onClick={() => quickSetBudget("standard")}
          className="rounded-full border border-slate-800 bg-slate-800/60 px-4 py-2 text-slate-200 hover:border-slate-700"
        >
          Standard
        </button>
        <button
          onClick={() => quickSetBudget("premium")}
          className="rounded-full border border-slate-800 bg-slate-800/60 px-4 py-2 text-slate-200 hover:border-slate-700"
        >
          Premium
        </button>
      </div>

      {/* Range */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm">Min</span>
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
              ₦{filters.min.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={1_000_000_000}
            step={10_000}
            value={filters.min}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                min: Math.min(Number(e.target.value), f.max),
              }))
            }
            className="w-full accent-emerald-400"
          />
        </div>

        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 text-sm">Max</span>
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-200">
              ₦{filters.max.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={10_000_000}
            step={10_000}
            value={filters.max}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                max: Math.max(Number(e.target.value), f.min),
              }))
            }
            className="w-full accent-blue-400"
          />
        </div>
      </div>

      <p className="mt-3 text-slate-400 text-sm">
        We’ll show homes between{" "}
        <span className="text-emerald-300 font-medium">
          ₦{filters.min.toLocaleString()}
        </span>{" "}
        and{" "}
        <span className="text-blue-300 font-medium">
          ₦{filters.max.toLocaleString()}
        </span>
        .
      </p>
    </motion.div>
  );
};
export default Screen3;
