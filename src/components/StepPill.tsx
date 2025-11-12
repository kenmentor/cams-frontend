import { GoCheckCircleFill } from "react-icons/go";

const StepPill = ({
  index,
  active,
  done,
}: {
  index: number;
  active: boolean;
  done: boolean;
}) => (
  <div
    className={[
      "h-9 min-w-9 px-3 rounded-full flex items-center justify-center text-sm font-semibold",
      active
        ? "bg-blue-600 text-white shadow-lg"
        : done
        ? "bg-blue-100 text-blue-700 border border-blue-200"
        : "bg-slate-100 text-slate-500",
    ].join(" ")}
  >
    {done ? <GoCheckCircleFill className="text-blue-600" /> : index}
  </div>
);
export default StepPill;
