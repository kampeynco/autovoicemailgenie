
import React from "react";

interface Step {
  id: number;
  name: string;
}

interface StepsIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepsIndicator = ({ steps, currentStep }: StepsIndicatorProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`flex-1 text-center ${
            currentStep === step.id
              ? "text-[#004838] font-medium"
              : currentStep > step.id
              ? "text-[#004838]"
              : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
              currentStep === step.id
                ? "bg-[#004838] text-white"
                : currentStep > step.id
                ? "bg-[#004838] text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.id}
          </div>
          <p className="mt-1 text-sm">{step.name}</p>
        </div>
      ))}
    </div>
  );
};

export default StepsIndicator;
