
import React from "react";
import CandidateForm from "./CandidateForm";
import OrganizationForm from "./OrganizationForm";

interface CommitteeFormContainerProps {
  committeeType: string;
  organizationName: string;
  candidateFirstName: string;
  candidateMiddleInitial: string;
  candidateLastName: string;
  candidateSuffix: string;
  updateData: (data: any) => void;
}

const CommitteeFormContainer = ({
  committeeType,
  organizationName,
  candidateFirstName,
  candidateMiddleInitial,
  candidateLastName,
  candidateSuffix,
  updateData
}: CommitteeFormContainerProps) => {
  return (
    <>
      {committeeType === "organization" && (
        <OrganizationForm 
          organizationName={organizationName}
          updateData={updateData}
        />
      )}
      
      {committeeType === "candidate" && (
        <CandidateForm
          candidateFirstName={candidateFirstName}
          candidateMiddleInitial={candidateMiddleInitial}
          candidateLastName={candidateLastName}
          candidateSuffix={candidateSuffix}
          updateData={updateData}
        />
      )}
    </>
  );
};

export default CommitteeFormContainer;
