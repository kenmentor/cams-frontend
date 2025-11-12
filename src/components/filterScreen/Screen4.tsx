import { BiBoltCircle } from "react-icons/bi";

import SectionHeader from "../sectionHeader";
import { motion } from "framer-motion";

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
const Screen4: React.FC<Screen1> = ({ variants, filters, setFilters }) => {
  const AMENITIES = [
    "Steady Power",
    "Water Supply",
    "Parking",
    "Security",
    "Furnished",
    "Pet Friendly",
    "Air Conditioning",
  ];
  const toggleAmenity = (a: string) => {
    setFilters((f) =>
      f.amenities.includes(a)
        ? { ...f, amenities: f.amenities.filter((x) => x !== a) }
        : { ...f, amenities: [...f.amenities, a] }
    );
  };
  function classNames(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(" ");
  }
  return (
    <motion.div
      key="step4"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        icon={<BiBoltCircle className="text-blue-400" size={24} />}
        title="Any must-have amenities?"
        subtitle="Select everything that matters. This helps refine your results."
      />

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {AMENITIES.map((a) => {
          const active = filters.amenities.includes(a);
          return (
            <button
              key={a}
              onClick={() => toggleAmenity(a)}
              className={classNames(
                "rounded-2xl border px-4 py-3 text-left transition",
                active
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
              )}
            >
              <div className="text-slate-100 font-medium">{a}</div>
              <div className="text-slate-400 text-sm mt-1">
                {a === "Security"
                  ? "24/7 monitoring"
                  : "Filter by availability"}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
export default Screen4;
