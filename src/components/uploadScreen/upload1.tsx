import Image from "next/image";
import Input from "@/components/Input";
import React, { useState } from "react";
import { BiLocationPlus, BiText } from "react-icons/bi";

import { motion } from "framer-motion";
import Meter from "../meter";

import { GrGroup } from "react-icons/gr";
import { CgCalendar } from "react-icons/cg";

interface formData {
  thumbnail: File | null;
  title: string;
  description: string;
  files: File[];
  category: string;
  maxguest: number;
  location: string;
  type: string;
  date: string;
}

interface StepOneProps {
  formData: formData;
  setFormData: React.Dispatch<React.SetStateAction<formData>>;
  goToNextStep: () => void;
  step: number;
}

// Nigerian States + LGAs mapping

const StepOne: React.FC<StepOneProps> = ({
  formData,
  setFormData,
  goToNextStep,
  step,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(
      (file) => file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setError("Some files exceed the 5MB limit and were not added.");
    } else {
      setError(null);
    }

    setFormData((prev: formData) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className=" max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl "
    >
      <Meter number={5} progress={step} />
      <div className=" p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to to-blue-500 text-transparent bg-clip-text">
          Primary Details
        </h2>

        <form action="">
          {/* Title */}
          <label className="text-gray-400" htmlFor="title">
            Title
          </label>
          <Input
            icon={BiText}
            name="title"
            type="text"
            placeholder="Enter title"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: formData) => ({
                ...prev,
                title: e.target.value,
              }))
            }
          />
          <label className="text-gray-400" htmlFor="title">
            Event Date
          </label>
          <Input
            icon={CgCalendar}
            name="date"
            type="date"
            placeholder="Event Date "
            value={formData.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: formData) => ({
                ...prev,
                date: e.target.value,
              }))
            }
          />
          {/* maxguest */}
          <span className="text-gray-400 text-x mb-0">maxguest</span>
          <Input
            icon={GrGroup}
            id="maxguest"
            type="number"
            placeholder="maxguest eg 20000"
            value={formData.maxguest}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: formData) => ({
                ...prev,
                maxguest: Number(e.target.value),
              }))
            }
          />

          {/* Location */}
          <label className="text-gray-400" htmlFor="location">
            Location
          </label>
          <Input
            icon={BiLocationPlus}
            id="location"
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData((prev: formData) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />

          {/* Address */}

          {/* Description */}
          <label className="text-gray-400" htmlFor="description">
            Description
          </label>
          <div className="relative mb-6">
            <textarea
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev: formData) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full pl-3 pr-3 py-2 bg-gray-500 bg-opacity-50 rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-blue-500 text-white placeholder-gray-400 transition duration-200 h-60"
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="mt-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="text-gray-400"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Preview */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {formData.files.map((file, index) => (
              <div
                key={index}
                className="relative w-full h-32 border border-gray-700 rounded overflow-hidden"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  fill={true}
                />
              </div>
            ))}
          </div>

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={goToNextStep}
              className="px-6 py-2 bg-blue-600 text-gray-100 rounded hover:bg-blue-700 transition"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default StepOne;
