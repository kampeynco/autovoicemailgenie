
import { useSignUp } from "@/contexts/SignUpContext";
import { useState, useEffect } from "react";
import CommitteeTypeSelection from "./committees/CommitteeTypeSelection";
import CandidateForm from "./committees/CandidateForm";
import OrganizationForm from "./committees/OrganizationForm";
import SubmitButtonSection from "./committees/SubmitButtonSection";
import { useCommitteeValidation } from "./committees/CommitteeValidation";

const CommitteeStep = () => {
  const { data, updateData, nextStep, prevStep } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { validateCommitteeData } = useCommitteeValidation();

  // Debugging: log current committee type on mount and when it changes
  useEffect(() => {
    console.log("Current committee type:", data.committeeType);
  }, [data.committeeType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!validateCommitteeData(data)) {
      setIsSubmitting(false);
      return;
    }

    // Simulate a slight delay for better UX
    setTimeout(() => {
      setIsSubmitting(false);
      // Move to next step
      nextStep();
    }, 500);
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
          isSubmitting={isSubmitting} 
          onBack={prevStep}
        />
      </div>
    </form>
  );
};

export default CommitteeStep;
