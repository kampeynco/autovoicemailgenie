
import { useSignUp } from "@/contexts/SignUpContext";
import { useState, useEffect } from "react";
import CommitteeTypeSelection from "./committees/CommitteeTypeSelection";
import CandidateForm from "./committees/CandidateForm";
import OrganizationForm from "./committees/OrganizationForm";
import SubmitButtonSection from "./committees/SubmitButtonSection";
import { useCommitteeValidation } from "./committees/CommitteeValidation";

interface CommitteeStepProps {
  onComplete: () => Promise<boolean>;
  isSubmitting: boolean;
}

const CommitteeStep = ({ onComplete, isSubmitting }: CommitteeStepProps) => {
  const { data, updateData, nextStep, prevStep } = useSignUp();
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const { validateCommitteeData } = useCommitteeValidation();

  // Debugging: log current committee type on mount and when it changes
  useEffect(() => {
    console.log("Current committee type:", data.committeeType);
  }, [data.committeeType]);

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

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <CommitteeTypeSelection
          committeeType={data.committeeType}
          updateData={updateData}
        />
        
        {data.committeeType === "organization" && (
          <OrganizationForm 
            organizationName={data.organizationName}
            updateData={updateData}
          />
        )}
        
        {data.committeeType === "candidate" && (
          <CandidateForm
            candidateFirstName={data.candidateFirstName}
            candidateMiddleInitial={data.candidateMiddleInitial}
            candidateLastName={data.candidateLastName}
            candidateSuffix={data.candidateSuffix || "none"}
            updateData={updateData}
          />
        )}
        
        <SubmitButtonSection 
          isSubmitting={isSubmitting || localSubmitting} 
          onBack={prevStep}
        />
      </div>
    </form>
  );
};

export default CommitteeStep;
