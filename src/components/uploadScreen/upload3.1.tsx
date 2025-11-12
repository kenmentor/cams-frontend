import { motion } from "framer-motion";
import Meter from "../meter";
import { propertyCategory } from "@/app/data"; // ✅ Import categories from centralized file

interface formData {
  thumbnail: File | null;
  title: string;
  description: string;
  files: File[];
  category: string;

  location: string;
  type: string;
}

interface StepTwoProps {
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  step: number;
}

const StepTwo: React.FC<StepTwoProps> = ({
  formData,
  setFormData,
  goToPreviousStep,
  goToNextStep,
  step,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl"
    >
      <Meter number={5} progress={step} />
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 text-transparent bg-clip-text">
          Category
        </h2>

        {/* ✅ Now categories come from data.ts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {propertyCategory.map((category) => (
            <div
              key={category}
              className={`p-3 border rounded cursor-pointer text-center transition ${
                formData.category === category
                  ? "border-blue-500 bg-gray-800"
                  : "border-gray-700"
              }`}
              onClick={() =>
                setFormData((prev: formData) => ({ ...prev, category }))
              }
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8 mx-4 mb-4">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="px-6 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-800 transition"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={goToNextStep}
          className="px-6 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default StepTwo;
