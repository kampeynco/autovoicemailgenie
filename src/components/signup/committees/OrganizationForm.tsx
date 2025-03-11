
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrganizationFormProps {
  organizationName: string;
  updateData: (data: any) => void;
}

const OrganizationForm = ({ organizationName, updateData }: OrganizationFormProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="organizationName">Organization Name</Label>
      <Input
        id="organizationName"
        placeholder="Enter organization name"
        value={organizationName}
        onChange={(e) => updateData({ organizationName: e.target.value })}
        className="h-12"
      />
    </div>
  );
};

export default OrganizationForm;
