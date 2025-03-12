
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignUp } from "@/contexts/SignUpContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AccountStep from "./AccountStep";
import CommitteeStep from "./CommitteeStep";
import VoicemailStep from "./VoicemailStep";
import StepsIndicator from "./StepsIndicator";
import { uploadVoicemail } from "@/services/voicemailUploadService";

const SignUpContent = () => {
  const { signUp } = useAuth();
  const { data, currentStep, resetData } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Steps data
  const steps = [
    { id: 1, name: "Account" },
    { id: 2, name: "Committee" },
    { id: 3, name: "Voicemail" }
  ];

  // Handle the final step (complete sign up)
  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // 1. Register user first
      const { user, error } = await signUp(data.email, data.password);
      if (error) throw error;
      if (!user) throw new Error("Failed to create user account");

      // 2. Create committee record
      const committeeData = {
        user_id: user.id,
        type: data.committeeType,
        organization_name: data.committeeType === "organization" ? data.organizationName : null,
        candidate_first_name: data.committeeType === "candidate" ? data.candidateFirstName : null,
        candidate_middle_initial: data.committeeType === "candidate" ? data.candidateMiddleInitial : null,
        candidate_last_name: data.committeeType === "candidate" ? data.candidateLastName : null,
        candidate_suffix: data.committeeType === "candidate" ? data.candidateSuffix : null
      };
      
      const { error: committeeError } = await supabase.from("committees").insert(committeeData);
      if (committeeError) throw committeeError;

      // 3. Upload the voicemail file only after user is created
      if (data.voicemailFile) {
        try {
          await uploadVoicemail(user.id, data.voicemailFile);
        } catch (storageError: any) {
          console.error("Error with storage or voicemail:", storageError);
          // Continue with sign up even if voicemail upload fails
          toast({
            title: "Voicemail Warning",
            description: "Your account was created, but there was an issue with the voicemail: " + storageError.message,
            variant: "destructive"
          });
        }
      }

      // Reset sign up data
      resetData();

      // Show success message
      toast({
        title: "Success!",
        description: "Your account has been created successfully. You can now sign in."
      });

      // Redirect to sign in
      navigate("/auth/signin");
    } catch (error: any) {
      console.error("Sign up process error:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during the sign up process",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Mobile-only logo and header */}
        <div className="block md:hidden text-center">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <h1 className="text-2xl font-semibold text-[#004838] mb-6">Callback Engine</h1>
          </Link>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>
          <p className="text-gray-600 mb-6">
            Enter the details below to create your account today
          </p>
          
          {/* Steps indicator */}
          <StepsIndicator steps={steps} currentStep={currentStep} />
          
          <div className="bg-white rounded-lg">
            {currentStep === 1 && <AccountStep />}
            {currentStep === 2 && <CommitteeStep />}
            {currentStep === 3 && <VoicemailStep onComplete={handleComplete} isSubmitting={isSubmitting} />}
          </div>
          
          {/* Mobile-only "Sign in" link */}
          <div className="mt-6 text-center block md:hidden">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/signin" className="font-medium text-[#004838] hover:text-[#003026]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpContent;
