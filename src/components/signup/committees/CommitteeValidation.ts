
import { useToast } from "@/components/ui/use-toast";
import { validateCommitteeType, validateOrganization, validateCandidate } from "@/utils/ValidationUtils";

interface CommitteeData {
  committeeType: string;
  organizationName: string;
  candidateFirstName: string;
  candidateLastName: string;
}

export const useCommitteeValidation = () => {
  const { toast } = useToast();

  const validateCommitteeData = (data: CommitteeData): boolean => {
    // Check if committee type is selected
    if (!validateCommitteeType(data.committeeType)) {
      toast({
        title: "Error",
        description: "Please select a committee type",
        variant: "destructive",
      });
      return false;
    }

    // Check organization name if organization type
    if (!validateOrganization(data.committeeType, data.organizationName)) {
      toast({
        title: "Error",
        description: "Please enter the organization name",
        variant: "destructive",
      });
      return false;
    }

    // Check candidate names if candidate type
    if (!validateCandidate(data.committeeType, data.candidateFirstName, data.candidateLastName)) {
      toast({
        title: "Error",
        description: "Please enter the candidate's first and last name",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateCommitteeData };
};
