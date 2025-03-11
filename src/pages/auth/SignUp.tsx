
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AccountStep from "@/components/signup/AccountStep";
import CommitteeStep from "@/components/signup/CommitteeStep";
import VoicemailStep from "@/components/signup/VoicemailStep";

const SignUp = () => {
  const { signUp } = useAuth();
  const { data, currentStep, resetData } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Steps indicator
  const steps = [
    { id: 1, name: "Account" },
    { id: 2, name: "Committee" },
    { id: 3, name: "Voicemail" }
  ];

  // Handle the final step (complete sign up)
  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      // Register user
      const { user, error } = await signUp(data.email, data.password);
      
      if (error) throw error;
      if (!user) throw new Error("Failed to create user account");
      
      // Create committee record
      const committeeData = {
        user_id: user.id,
        type: data.committeeType,
        organization_name: data.committeeType === "organization" ? data.organizationName : null,
        candidate_first_name: data.committeeType === "candidate" ? data.candidateFirstName : null,
        candidate_middle_initial: data.committeeType === "candidate" ? data.candidateMiddleInitial : null,
        candidate_last_name: data.committeeType === "candidate" ? data.candidateLastName : null,
        candidate_suffix: data.committeeType === "candidate" ? data.candidateSuffix : null
      };
      
      const { error: committeeError } = await supabase
        .from("committees")
        .insert(committeeData);
      
      if (committeeError) throw committeeError;
      
      // Create voicemail record
      const { error: voicemailError } = await supabase
        .from("voicemails")
        .insert({
          user_id: user.id,
          file_path: data.voicemailPath
        });
      
      if (voicemailError) throw voicemailError;
      
      // Reset sign up data
      resetData();
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your account has been created successfully. You can now sign in.",
      });
      
      // Redirect to sign in
      navigate("/auth/signin");
      
    } catch (error: any) {
      console.error("Sign up process error:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during the sign up process",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-[#073127]">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/auth/signin" className="font-medium text-[#004838] hover:text-[#003026]">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {/* Steps indicator */}
        <div className="flex justify-between items-center">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex-1 text-center ${
                currentStep === step.id 
                  ? "text-[#004838] font-medium" 
                  : currentStep > step.id 
                    ? "text-[#004838]" 
                    : "text-gray-400"
              }`}
            >
              <div 
                className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
                  currentStep === step.id 
                    ? "bg-[#004838] text-white" 
                    : currentStep > step.id 
                      ? "bg-[#004838] text-white" 
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.id}
              </div>
              <p className="mt-1 text-sm">{step.name}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          {currentStep === 1 && <AccountStep />}
          {currentStep === 2 && <CommitteeStep />}
          {currentStep === 3 && <VoicemailStep onComplete={handleComplete} isSubmitting={isSubmitting} />}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
