import React from "react";

const Screen1 = ({ next, back }: { next: () => void; back: () => void }) => {
  const steps = [
    "Select your preferred booking date and time.",
    "Provide your contact and payment details.",
    "Review the booking summary before confirming.",
    "Receive your booking confirmation via email.",
  ];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* How to Book Section */}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        How to Book
      </h1>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
        {steps.map((step, index) => (
          <li key={index} className="leading-relaxed">
            {step}
          </li>
        ))}
      </ol>

      {/* Terms & Conditions Section */}
      <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
        Terms & Conditions
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
        By proceeding with the booking, you agree to our terms and conditions.
        Cancellations within 24 hours of your booking date may incur additional
        fees. Please ensure you provide accurate information to avoid booking
        issues.
      </p>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={back}
          className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition"
        >
          Back
        </button>
        <button
          onClick={next}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Proceed to Booking
        </button>
      </div>
    </div>
  );
};

export default Screen1;
