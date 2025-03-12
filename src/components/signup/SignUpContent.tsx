
import React from "react";
import StepsIndicator from "./StepsIndicator";
import StepsContent from "./StepsContent";
import MobileLinks from "./MobileLinks";

const SignUpContent = () => {
  // Steps data
  const steps = [
    { id: 1, name: "Account" },
    { id: 2, name: "Committee" },
    { id: 3, name: "Voicemail" }
  ];

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <MobileLinks />
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>
          <p className="text-gray-600 mb-6">
            Enter the details below to create your account today
          </p>
          
          {/* Steps indicator */}
          <StepsIndicator steps={steps} />
          
          <StepsContent />
        </div>
      </div>
    </div>
  );
};

export default SignUpContent;
