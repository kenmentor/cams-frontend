"use client";
import React, { useState } from "react";
import StepOne from "./uploadScreen/upload1";

import StepThree from "./uploadScreen/upload3";
import StepFour from "./uploadScreen/preview";
import Upload3One from "./uploadScreen/upload3.1";

import { ErroMessage, SuccessMessage, Validation } from "./message";
import UploadingUi from "./UploadingUi";
import FlotingShape from "./FlotingShape";
import { useAuthStore } from "@/app/store/authStore";
import Req from "@/app/utility/axois";

interface formData {
  thumbnail: File | null;
  title: string;
  description: string;
  files: File[];
  category: string;

  location: string;
  type: string;

  maxguest: number; // 👈 add this
  host: string;
}

const UploadWizard = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<formData>({
    title: "",
    description: "",
    files: [],
    category: "",
    thumbnail: null,
    location: "",
    type: "",
    host: "",
    maxguest: 10000,
  });
  const [message, setMessage] = useState("");
  const { base } = Req;
  const goToNextStep = () => {
    // Add validation for step 1
    if (step === 1 && (!formData.title || !formData.description)) {
      setMessage("Please fill in the required fields (Title & Description).");
      return;
    }

    // Add validation for step 2 (example for image files)
    if (step === 2 && formData.files.length === 0) {
      setMessage("Please upload at least one image.");
      return;
    }

    // Add additional validation checks for each step as necessary
    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => setStep((prev) => prev - 1);
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!formData.thumbnail || !formData.title || !formData.description) {
      setMessage("Please fill in all required fields before submitting.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail);
      }
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);

      data.append("location", formData.location);
      data.append("type", formData.type);

      // 👈 "true"/"false"

      data.append("host", user?._id || "");

      data.append("maxgeust", formData.maxguest.toString()); // 👈 default since schema requires it

      // Use gallery instead of files
      formData.files.forEach((file) => {
        data.append("files", file);
      });

      const res = await fetch(`${base}/v1/event`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed");

      setMessage("success");
    } catch (err) {
      console.error(err);
      setMessage("error");
    } finally {
      setLoading(false);
    }
  };

  console.log(user?._id);
  return (
    <div className="max-w-full mx-auto h-full p-6items-center   min-h-screen bg-gradient-to-br from-gray-900 justify-center relative overflow-hidden flex items-center ">
      <FlotingShape
        color="bg-blue-400"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FlotingShape
        color="bg-blue-400"
        size="w-45 h-45"
        top="50%"
        left="70%"
        delay={5}
      />
      <FlotingShape
        color="bg-blue-400"
        size="w-30 h-30"
        top="-30%"
        left="90%"
        delay={2}
      />

      {/* Header with Back Arrow and Progress Tracker */}

      {loading && <UploadingUi />}

      {/* Message */}
      {message === "error" && <ErroMessage setMessage={setMessage} />}
      {message === "success" && <SuccessMessage />}
      {message &&
        message !== "success" &&
        message !== "error" &&
        message !== "" && (
          <Validation message={message} setMessage={setMessage} />
        )}

      {/* Step Components */}
      {step === 1 && (
        <StepOne
          formData={formData}
          setFormData={setFormData}
          goToNextStep={goToNextStep}
          step={step}
        />
      )}

      {step === 2 && (
        <StepThree
          formData={formData}
          setFormData={setFormData}
          goToNextStep={goToNextStep}
          goToPreviousStep={goToPreviousStep}
          step={step}
        />
      )}
      {step === 3 && (
        <Upload3One
          formData={formData}
          goToPreviousStep={goToPreviousStep}
          goToNextStep={goToNextStep}
          setFormData={setFormData}
          step={step}
        />
      )}

      {step === 4 && (
        <StepFour
          formData={formData}
          goToPreviousStep={goToPreviousStep}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default UploadWizard;
