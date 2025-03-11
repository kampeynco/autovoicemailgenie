
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CommitteeStep = () => {
  const { data, updateData, nextStep, prevStep } = useSignUp();
  const { toast } = useToast();

  useEffect(() => {
    // Clear form fields when committee type changes
    if (data.committeeType === "organization") {
      updateData({
        candidateFirstName: "",
        candidateMiddleInitial: "",
        candidateLastName: "",
        candidateSuffix: ""
      });
    } else if (data.committeeType === "candidate") {
      updateData({
        organizationName: ""
      });
    }
  }, [data.committeeType, updateData]);

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
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="committeeType">Committee Type</Label>
          <Select 
            value={data.committeeType} 
            onValueChange={(value) => updateData({ committeeType: value as "organization" | "candidate" })}
          >
            <SelectTrigger id="committeeType" className="h-12">
              <SelectValue placeholder="Select committee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organization">Organization</SelectItem>
              <SelectItem value="candidate">Candidate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {data.committeeType === "organization" && (
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Enter organization name"
              value={data.organizationName}
              onChange={(e) => updateData({ organizationName: e.target.value })}
              className="h-12"
            />
          </div>
        )}
        
        {data.committeeType === "candidate" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidateFirstName">First Name</Label>
              <Input
                id="candidateFirstName"
                placeholder="Enter first name"
                value={data.candidateFirstName}
                onChange={(e) => updateData({ candidateFirstName: e.target.value })}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidateMiddleInitial">Middle Initial</Label>
              <Input
                id="candidateMiddleInitial"
                placeholder="Enter middle initial"
                value={data.candidateMiddleInitial}
                onChange={(e) => updateData({ candidateMiddleInitial: e.target.value })}
                className="h-12"
                maxLength={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidateLastName">Last Name</Label>
              <Input
                id="candidateLastName"
                placeholder="Enter last name"
                value={data.candidateLastName}
                onChange={(e) => updateData({ candidateLastName: e.target.value })}
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="candidateSuffix">Suffix</Label>
              <Input
                id="candidateSuffix"
                placeholder="E.g., Jr., Sr., III"
                value={data.candidateSuffix}
                onChange={(e) => updateData({ candidateSuffix: e.target.value })}
                className="h-12"
              />
            </div>
          </div>
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
