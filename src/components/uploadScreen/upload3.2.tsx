import React from "react";
import { motion } from "framer-motion";
import { BiCheck } from "react-icons/bi";
import { FcCancel } from "react-icons/fc";
import Meter from "../meter";
import { amenities } from "@/app/data"; // ✅ import amenities

interface formData {
  images: File[];
  thumbnail: File | null;
  title: string;
  description: string;
  files: File[];
  category: string;
  price: string;
  location: string;
  type: string;
  address: string;
  state: string;
  waterSuply: boolean;
  electricity: number;
  amenities: string[];
}

interface Upload3Two {
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  step: number;
}

const Upload3Two: React.FC<Upload3Two> = ({
  formData,
  setFormData,
  goToPreviousStep,
  goToNextStep,
  step,
}) => {
  const toggleAmenity = (amenity: string) => {
    setFormData((prev: formData) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

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
          Amenities & Utilities
        </h2>

        {/* Water supply */}
        <div className="flex gap-5 flex-col mb-6">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, waterSuply: true }))
            }
            className={`w-full flex items-center gap-5 pl-10 pr-3 py-2 rounded-lg border ${
              formData.waterSuply
                ? "border-blue-500 bg-gray-700"
                : "border-gray-700 bg-gray-500 bg-opacity-50"
            }`}
          >
            <BiCheck color="green" size={30} /> Yes, water supply
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, waterSuply: false }))
            }
            className={`w-full flex items-center gap-5 pl-10 pr-3 py-2 rounded-lg border ${
              !formData.waterSuply
                ? "border-red-500 bg-gray-700"
                : "border-gray-700 bg-gray-500 bg-opacity-50"
            }`}
          >
            <FcCancel size={30} /> No water supply
          </button>
        </div>

        {/* Electricity slider */}
        <span className="text-gray-400">Level of power supply</span>
        <div className="p-3 mb-6 bg-gray-500 bg-opacity-50 rounded-lg border border-gray-700 text-white">
          <span>{formData.electricity}%</span>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.electricity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                electricity: Number(e.target.value),
              }))
            }
            className="w-full mt-2"
          />
        </div>

        {/* Amenities checkboxes */}
        <span className="text-gray-400">Select amenities</span>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {amenities.map((amenity) => (
            <label
              key={amenity}
              className={`cursor-pointer px-3 py-2 rounded-lg border text-sm ${
                formData.amenities.includes(amenity)
                  ? "border-blue-500 bg-gray-700 text-white"
                  : "border-gray-700 bg-gray-600 text-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="hidden"
              />
              {amenity}
            </label>
          ))}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between mt-8">
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
      </div>
    </motion.div>
  );
};

export default Upload3Two;
