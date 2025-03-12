
import React from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import AccountStep from "./AccountStep";
import CommitteeStep from "./CommitteeStep";
import VoicemailStep from "./VoicemailStep";
import { useSignUpSteps } from "./hooks/useSignUpSteps";

const StepsContent = () => {
  const { currentStep } = useSignUp();
  const { 
    isSubmitting, 
    voicemailError, 
    handleCommitteeStepComplete,
    handleVoicemailStepComplete,
    handleSkipVoicemail
  } = useSignUpSteps();

  return (
    <div className="bg-white rounded-lg">
      {currentStep === 1 && <AccountStep />}
      {currentStep === 2 && <CommitteeStep onComplete={handleCommitteeStepComplete} isSubmitting={isSubmitting} />}
      {currentStep === 3 && (
        <VoicemailStep 
          onComplete={handleVoicemailStepComplete} 
          isSubmitting={isSubmitting}
          error={voicemailError}
          onSkipVoicemail={handleSkipVoicemail}
        />
      )}
    </div>
  );
};

export default StepsContent;
