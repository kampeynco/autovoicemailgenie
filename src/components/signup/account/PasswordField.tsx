
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  hint?: string;
}

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "••••••••",
  hint,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-700 font-medium">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`h-12 pr-10 ${error ? "border-red-500" : ""}`}
          aria-required="true"
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}Error` : hint ? `${id}Hint` : undefined}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      </div>
      {error ? (
        <p id={`${id}Error`} className="text-sm text-red-500 mt-1">{error}</p>
      ) : hint ? (
        <p id={`${id}Hint`} className="text-xs text-gray-500 mt-1">{hint}</p>
      ) : null}
    </div>
  );
};

export default PasswordField;
