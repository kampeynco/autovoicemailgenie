
import { Building, User } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CommitteeTypeSelectionProps {
  committeeType: string;
  updateData: (data: any) => void;
}

const CommitteeTypeSelection = ({ committeeType, updateData }: CommitteeTypeSelectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="committeeType">Committee Type</Label>
      <div className="flex flex-col space-y-4">
        <div 
          className={`border rounded-md p-4 cursor-pointer transition-all ${
            committeeType === "organization" 
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
            committeeType === "candidate" 
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
  );
};

export default CommitteeTypeSelection;
