import { IoLocationOutline } from "react-icons/io5";
import SectionHeader from "../sectionHeader";
import { motion } from "framer-motion";
import { useMemo } from "react";

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
  states: {
    Lagos: string[];
    "Abuja FCT": string[];
    Rivers: string[];
    "Cross River": string[];
  };
}
const Screen1: React.FC<Screen1> = ({
  variants,
  filters,
  setFilters,
  states,
}) => {
  const lgaOptions = useMemo(
    () => states[filters.state] ?? [],
    [filters.state]
  );
  function classNames(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(" ");
  }
  return (
    <motion.div
      key="step1"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        icon={<IoLocationOutline className="text-blue-400" size={24} />}
        title="Where are you looking?"
        subtitle="Tell us your preferred area. We’ll tailor results to your location."
      />

      <div className="grid md:grid-cols-3 gap-4">
        {/* State */}
        <div>
          <label className="text-slate-300 text-sm mb-2 block">State</label>
          <div className="relative">
            <select
              value={filters.state}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  state: e.target.value,
                  lga: "",
                }))
              }
              className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select state</option>
              {Object.keys(states).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LGA */}
        <div>
          <label className="text-slate-300 text-sm mb-2 block">LGA</label>
          <div className="relative">
            <select
              value={filters.lga}
              onChange={(e) =>
                setFilters((f) => ({ ...f, lga: e.target.value }))
              }
              disabled={!filters.state}
              className={classNames(
                "w-full bg-slate-800/70 border rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2",
                !filters.state
                  ? "border-slate-800 text-slate-500"
                  : "border-slate-700 focus:ring-blue-600"
              )}
            >
              <option value="">Select LGA</option>
              {lgaOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Landmark */}
        <div>
          <label className="text-slate-300 text-sm mb-2 block">
            Landmark / Area
          </label>
          <input
            value={filters.landmark}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                landmark: e.target.value,
              }))
            }
            placeholder="e.g., Admiralty Way, Marian Rd"
            className="w-full bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Screen1;
