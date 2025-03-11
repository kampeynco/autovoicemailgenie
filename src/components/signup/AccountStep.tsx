
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const AccountStep = () => {
  const { data, updateData, nextStep } = useSignUp();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className={`h-12 ${errors.email ? "border-red-500" : ""}`}
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "emailError" : undefined}
          />
          {errors.email && (
            <p id="emailError" className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              className={`h-12 pr-10 ${errors.password ? "border-red-500" : ""}`}
              aria-required="true"
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "passwordError" : "passwordHint"}
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
          {errors.password ? (
            <p id="passwordError" className="text-sm text-red-500 mt-1">{errors.password}</p>
          ) : (
            <p id="passwordHint" className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-12 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
              aria-required="true"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby={errors.confirmPassword ? "confirmPasswordError" : undefined}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirmPasswordError" className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full h-12 bg-[#004838] hover:bg-[#003026] mt-8 font-medium"
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
    </form>
  );
};

export default AccountStep;
