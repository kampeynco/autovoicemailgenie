
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const EmailField = ({ value, onChange, error }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="you@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 ${error ? "border-red-500" : ""}`}
        aria-required="true"
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? "emailError" : undefined}
      />
      {error && (
        <p id="emailError" className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default EmailField;
