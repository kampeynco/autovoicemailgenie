
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CandidateFormProps {
  candidateFirstName: string;
  candidateMiddleInitial: string;
  candidateLastName: string;
  candidateSuffix: string;
  updateData: (data: any) => void;
}

const CandidateForm = ({
  candidateFirstName,
  candidateMiddleInitial,
  candidateLastName,
  candidateSuffix,
  updateData,
}: CandidateFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="candidateFirstName">First Name</Label>
        <Input
          id="candidateFirstName"
          placeholder="Enter first name"
          value={candidateFirstName}
          onChange={(e) => updateData({ candidateFirstName: e.target.value })}
          className="h-12"
          aria-required="true"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="candidateMiddleInitial">Middle Initial</Label>
        <Input
          id="candidateMiddleInitial"
          placeholder="Enter middle initial"
          value={candidateMiddleInitial}
          onChange={(e) => {
            // Only allow a single character
            if (e.target.value.length <= 1) {
              updateData({ candidateMiddleInitial: e.target.value });
            }
          }}
          className="h-12"
          maxLength={1}
          aria-describedby="middleInitialHint"
        />
        <p id="middleInitialHint" className="text-xs text-gray-500">Optional. Single character only.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="candidateLastName">Last Name</Label>
        <Input
          id="candidateLastName"
          placeholder="Enter last name"
          value={candidateLastName}
          onChange={(e) => updateData({ candidateLastName: e.target.value })}
          className="h-12"
          aria-required="true"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="candidateSuffix">Suffix</Label>
        <Select
          value={candidateSuffix}
          onValueChange={(value) => updateData({ candidateSuffix: value })}
        >
          <SelectTrigger id="candidateSuffix" className="h-12">
            <SelectValue placeholder="Select suffix (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
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
  );
};

export default CandidateForm;
