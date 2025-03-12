
import { useState } from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import { useCommitteeValidation } from "./CommitteeValidation";

interface UseCommitteeStepProps {
  onComplete: () => Promise<boolean>;
  isSubmitting: boolean;
}

export const useCommitteeStep = ({ onComplete, isSubmitting }: UseCommitteeStepProps) => {
  const { data, updateData, nextStep, prevStep } = useSignUp();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const { validateCommitteeData } = useCommitteeValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalSubmitting(true);
    
    // Validation
    if (!validateCommitteeData(data)) {
      setLocalSubmitting(false);
      return;
    }

    // Create user account and committee
    const success = await onComplete();
    
    if (success) {
      // Move to next step only if account creation was successful
      nextStep();
    }
    
    setLocalSubmitting(false);
  };

  return {
    data,
    updateData,
    prevStep,
    handleSubmit,
    isLoading: isSubmitting || localSubmitting
  };
};
