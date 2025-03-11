
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import CommitteeTypeSelection from "./committees/CommitteeTypeSelection";
import CandidateForm from "./committees/CandidateForm";
import OrganizationForm from "./committees/OrganizationForm";
import { useEffect } from "react";

const CommitteeStep = () => {
  const { data, updateData, nextStep, prevStep } = useSignUp();
  const { toast } = useToast();

  // Debugging: log current committee type on mount and when it changes
  useEffect(() => {
    console.log("Current committee type:", data.committeeType);
  }, [data.committeeType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!data.committeeType) {
      toast({
        title: "Error",
        description: "Please select a committee type",
        variant: "destructive",
      });
      return;
    }

    if (data.committeeType === "organization" && !data.organizationName) {
      toast({
        title: "Error",
        description: "Please enter the organization name",
        variant: "destructive",
      });
      return;
    }

    if (data.committeeType === "candidate") {
      if (!data.candidateFirstName || !data.candidateLastName) {
        toast({
          title: "Error",
          description: "Please enter the candidate's first and last name",
          variant: "destructive",
        });
        return;
      }
    }

    // Move to next step
    nextStep();
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
            candidateSuffix={data.candidateSuffix || ""}
            updateData={updateData}
          />
        )}
        
        <div className="flex space-x-4">
          <Button 
            type="button" 
            variant="outline"
            className="w-1/2 h-12"
            onClick={prevStep}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="w-1/2 h-12 bg-[#004838] hover:bg-[#003026]"
          >
            Next
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommitteeStep;
