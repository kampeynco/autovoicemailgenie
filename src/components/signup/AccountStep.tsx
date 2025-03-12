
import { useState } from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { validateEmail, validatePassword } from "@/utils/ValidationUtils";
import EmailField from "./account/EmailField";
import PasswordField from "./account/PasswordField";
import SubmitButton from "./account/SubmitButton";

const AccountStep = () => {
  const { data, updateData, nextStep } = useSignUp();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Reset errors
    setErrors({
      email: "",
      password: "",
      confirmPassword: ""
    });
    
    let hasErrors = false;
    
    // Validate email
    if (!data.email) {
      setErrors(prev => ({ ...prev, email: "Email is required" }));
      hasErrors = true;
    } else if (!validateEmail(data.email)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      hasErrors = true;
    }
    
    // Validate password
    if (!data.password) {
      setErrors(prev => ({ ...prev, password: "Password is required" }));
      hasErrors = true;
    } else if (!validatePassword(data.password)) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
      hasErrors = true;
    }
    
    // Validate confirm password
    if (data.password !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      hasErrors = true;
    }
    
    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }
    
    // Show success toast
    toast({
      title: "Success",
      description: "Account details saved",
    });
    
    // Simulate a slight delay for better UX
    setTimeout(() => {
      setIsSubmitting(false);
      // Move to next step
      nextStep();
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <EmailField 
          value={data.email}
          onChange={(value) => updateData({ email: value })}
          error={errors.email}
        />
        
        <PasswordField
          id="password"
          label="Password"
          value={data.password}
          onChange={(value) => updateData({ password: value })}
          error={errors.password}
          hint="Password must be at least 6 characters"
        />
        
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          error={errors.confirmPassword}
        />
        
        <SubmitButton isSubmitting={isSubmitting} />
      </div>
    </form>
  );
};

export default AccountStep;
