
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import CommitteeTypeSelection from "./committees/CommitteeTypeSelection";
import CandidateForm from "./committees/CandidateForm";
import OrganizationForm from "./committees/OrganizationForm";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const CommitteeStep = () => {
  const { data, updateData, nextStep, prevStep } = useSignUp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debugging: log current committee type on mount and when it changes
  useEffect(() => {
    console.log("Current committee type:", data.committeeType);
  }, [data.committeeType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!data.committeeType) {
      toast({
        title: "Error",
        description: "Please select a committee type",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (data.committeeType === "organization" && !data.organizationName) {
      toast({
        title: "Error",
        description: "Please enter the organization name",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (data.committeeType === "candidate") {
      if (!data.candidateFirstName || !data.candidateLastName) {
        toast({
          title: "Error",
          description: "Please enter the candidate's first and last name",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
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
        
        <div className="flex space-x-4">
          <Button 
            type="button" 
            variant="outline"
            className="w-1/2 h-12"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="w-1/2 h-12 bg-[#004838] hover:bg-[#003026]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Next"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommitteeStep;
