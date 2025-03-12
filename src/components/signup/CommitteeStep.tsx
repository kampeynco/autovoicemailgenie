
import React from "react";
import CommitteeTypeSelection from "./committees/CommitteeTypeSelection";
import SubmitButtonSection from "./committees/SubmitButtonSection";
import { useCommitteeStep } from "./committees/useCommitteeStep";
import CommitteeFormContainer from "./committees/CommitteeFormContainer";

interface CommitteeStepProps {
  onComplete: () => Promise<boolean>;
  isSubmitting: boolean;
}

const CommitteeStep = ({ onComplete, isSubmitting }: CommitteeStepProps) => {
  const { data, updateData, prevStep, handleSubmit, isLoading } = useCommitteeStep({
    onComplete,
    isSubmitting
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <CommitteeTypeSelection
          committeeType={data.committeeType}
          updateData={updateData}
        />
        
        <CommitteeFormContainer 
          committeeType={data.committeeType}
          organizationName={data.organizationName}
          candidateFirstName={data.candidateFirstName}
          candidateMiddleInitial={data.candidateMiddleInitial}
          candidateLastName={data.candidateLastName}
          candidateSuffix={data.candidateSuffix || "none"}
          updateData={updateData}
        />
        
        <SubmitButtonSection 
          isSubmitting={isLoading} 
          onBack={prevStep}
        />
      </div>
    </form>
  );
};

export default CommitteeStep;
