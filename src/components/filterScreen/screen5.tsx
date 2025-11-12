import SectionHeader from "../sectionHeader";
import { motion } from "framer-motion";

import { BiShield } from "react-icons/bi";

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
const Screen5: React.FC<Screen1> = ({ variants, filters }) => {
  return (
    <motion.div
      key="step5"
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.25 }}
    >
      <SectionHeader
        icon={<BiShield className="text-blue-400" size={24} />}
        title="Review & Apply"
        subtitle="Looks good? Let’s find the best matches for you."
      />

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="text-slate-400 text-sm mb-3">Location</div>
          <div className="space-y-1">
            <div className="text-slate-100 font-medium">
              {filters.state || "—"}
            </div>
            <div className="text-slate-300">{filters.lga || "—"}</div>
            <div className="text-slate-400">{filters.landmark || "—"}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="text-slate-400 text-sm mb-3">Preferences</div>
          <div className="space-y-1">
            <div className="text-slate-100 font-medium">
              {filters.type || "—"}
            </div>
            <div className="text-slate-300">
              ₦{filters.min.toLocaleString()} – ₦{filters.max.toLocaleString()}
            </div>
            <div className="text-slate-400 text-sm">
              {filters.amenities.length > 0
                ? filters.amenities.join(" • ")
                : "No specific amenities selected"}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Screen5;
