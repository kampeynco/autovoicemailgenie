
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { Building, User } from "lucide-react";
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
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="committeeType">Committee Type</Label>
          <div className="flex flex-col space-y-4">
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                data.committeeType === "organization" 
                  ? "border-[#004838] bg-[#E3F1ED]" 
                  : "border-gray-200 hover:border-[#004838]"
              }`}
              onClick={() => updateData({ committeeType: "organization" })}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-sm p-2 bg-[#004838] text-white">
                  <Building className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#073127]">Organization</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    For organizations, PACs, and committees
                  </p>
                </div>
              </div>
            </div>
            
            <div 
              className={`border rounded-md p-4 cursor-pointer transition-all ${
                data.committeeType === "candidate" 
                  ? "border-[#004838] bg-[#E3F1ED]" 
                  : "border-gray-200 hover:border-[#004838]"
              }`}
              onClick={() => updateData({ committeeType: "candidate" })}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-sm p-2 bg-[#004838] text-white">
                  <User className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#073127]">Candidate</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    For individual candidate committees
                  </p>
                </div>
              </div>
            </div>
          </div>
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
              <Select
                value={data.candidateSuffix || ""}
                onValueChange={(value) => updateData({ candidateSuffix: value })}
              >
                <SelectTrigger id="candidateSuffix" className="h-12">
                  <SelectValue placeholder="Select suffix (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="Jr.">Jr.</SelectItem>
                  <SelectItem value="Sr.">Sr.</SelectItem>
                  <SelectItem value="I">I</SelectItem>
                  <SelectItem value="II">II</SelectItem>
                  <SelectItem value="III">III</SelectItem>
                  <SelectItem value="IV">IV</SelectItem>
                  <SelectItem value="V">V</SelectItem>
                  <SelectItem value="Esq.">Esq.</SelectItem>
                  <SelectItem value="MD">MD</SelectItem>
                  <SelectItem value="PhD">PhD</SelectItem>
                </SelectContent>
              </Select>
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
