
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/contexts/SignUpContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AccountStep from "@/components/signup/AccountStep";
import CommitteeStep from "@/components/signup/CommitteeStep";
import VoicemailStep from "@/components/signup/VoicemailStep";

const SignUp = () => {
  const { data, currentStep } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCompleteSignUp = async () => {
    try {
      setIsSubmitting(true);
      
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Failed to create user");
      }

      // 2. Insert committee data
      const { error: committeeError } = await supabase
        .from('committees')
        .insert({
          user_id: authData.user.id,
          type: data.committeeType,
          organization_name: data.committeeType === 'organization' ? data.organizationName : null,
          candidate_first_name: data.committeeType === 'candidate' ? data.candidateFirstName : null,
          candidate_middle_initial: data.committeeType === 'candidate' ? data.candidateMiddleInitial : null,
          candidate_last_name: data.committeeType === 'candidate' ? data.candidateLastName : null,
          candidate_suffix: data.committeeType === 'candidate' ? data.candidateSuffix : null,
        });

      if (committeeError) {
        throw new Error(committeeError.message);
      }

      // 3. Insert voicemail data
      const { error: voicemailError } = await supabase
        .from('voicemails')
        .insert({
          user_id: authData.user.id,
          file_path: data.voicemailPath,
        });

      if (voicemailError) {
        throw new Error(voicemailError.message);
      }

      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials",
      });
      
      // Navigate to sign in page
      navigate("/auth/signin");
      
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AccountStep />;
      case 2:
        return <CommitteeStep />;
      case 3:
        return <VoicemailStep onComplete={handleCompleteSignUp} isSubmitting={isSubmitting} />;
      default:
        return <AccountStep />;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEDE8] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="h-10 w-10 rounded-full bg-[#004838] flex items-center justify-center mx-auto">
            <span className="text-white text-sm font-semibold">CE</span>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-[#073127]">Create an Account</h1>
          <p className="mt-2 text-gray-600">Step {currentStep} of 3</p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-sm">
          {renderStep()}
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/auth/signin" className="text-[#004838] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
