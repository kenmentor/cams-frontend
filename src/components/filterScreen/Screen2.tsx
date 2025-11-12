import SectionHeader from "../sectionHeader";
import { motion } from "framer-motion";

import { BiHomeAlt2 } from "react-icons/bi";

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

  PROPERTY_TYPES: string[];
}
const Screen2: React.FC<Screen1> = ({
  variants,
  filters,
  setFilters,
  PROPERTY_TYPES,
}) => {
  function classNames(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(" ");
  }
  return (
    <motion.div
      key="step2"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        icon={<BiHomeAlt2 className="text-blue-400" size={24} />}
        title="What type of place?"
        subtitle="Pick the property type that fits your plan."
      />
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {PROPERTY_TYPES.map((t) => {
          const active = filters.type === t;
          return (
            <button
              key={t}
              onClick={() => setFilters((f) => ({ ...f, type: t }))}
              className={classNames(
                "group rounded-2xl border p-4 text-left transition",
                active
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
              )}
            >
              <div className="text-slate-100 font-medium">{t}</div>
              <div className="text-slate-400 text-sm mt-1">
                {t === "Studio"
                  ? "Compact & efficient"
                  : t === "Duplex"
                  ? "Spacious multi-level"
                  : "Popular choice"}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
export default Screen2;
