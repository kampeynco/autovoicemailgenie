import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AccountStep from "@/components/signup/AccountStep";
import CommitteeStep from "@/components/signup/CommitteeStep";
import VoicemailStep from "@/components/signup/VoicemailStep";
import { Eye, EyeOff } from "lucide-react";
const SignUp = () => {
  const {
    signUp
  } = useAuth();
  const {
    data,
    currentStep,
    resetData
  } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  // Steps indicator
  const steps = [{
    id: 1,
    name: "Account"
  }, {
    id: 2,
    name: "Committee"
  }, {
    id: 3,
    name: "Voicemail"
  }];

  // Handle the final step (complete sign up)
  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // Register user
      const {
        user,
        error
      } = await signUp(data.email, data.password);
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
      const {
        error: committeeError
      } = await supabase.from("committees").insert(committeeData);
      if (committeeError) throw committeeError;

      // Create voicemail record
      const {
        error: voicemailError
      } = await supabase.from("voicemails").insert({
        user_id: user.id,
        file_path: data.voicemailPath
      });
      if (voicemailError) throw voicemailError;

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
  return <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 bg-[#004838] text-white flex-col justify-center px-12">
        <div className="mb-8">
          <h1 className="font-semibold text-white text-4xl">Callback Engine</h1>
        </div>
        <h2 className="text-4xl font-bold mb-4">Create an account</h2>
        <p className="text-lg mb-12">Join Callback Engine to skip endless fundraising calls and reach more donors with less effort.</p>
        <div>
          <p className="text-white/90">
            Already have an account?{" "}
            <Link to="/auth/signin" className="underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile-only logo and header */}
          <div className="block md:hidden text-center">
            <h1 className="text-2xl font-semibold text-[#004838] mb-6">Callback Engine</h1>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Get started</h2>
            <p className="text-gray-600 mb-6">
              Enter the details below to create your account today
            </p>
            
            {/* Steps indicator */}
            <div className="flex justify-between items-center mb-8">
              {steps.map(step => <div key={step.id} className={`flex-1 text-center ${currentStep === step.id ? "text-[#004838] font-medium" : currentStep > step.id ? "text-[#004838]" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full ${currentStep === step.id ? "bg-[#004838] text-white" : currentStep > step.id ? "bg-[#004838] text-white" : "bg-gray-200 text-gray-600"}`}>
                    {step.id}
                  </div>
                  <p className="mt-1 text-sm">{step.name}</p>
                </div>)}
            </div>
            
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
    </div>;
};
export default SignUp;