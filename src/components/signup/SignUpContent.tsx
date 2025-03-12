
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
import { saveVoicemail } from "@/services/voicemailService";

const SignUpContent = () => {
  const { signUp } = useAuth();
  const { data, currentStep, resetData, updateData } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voicemailError, setVoicemailError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Steps data
  const steps = [
    { id: 1, name: "Account" },
    { id: 2, name: "Committee" },
    { id: 3, name: "Voicemail" }
  ];

  // Create user account and committee after step 2
  const createUserAndCommittee = async () => {
    setIsSubmitting(true);
    try {
      // 1. Register user first
      const { user: newUser, error } = await signUp(data.email, data.password);
      if (error) throw error;
      if (!newUser) throw new Error("Failed to create user account");
      
      console.log("User created successfully:", newUser.id);

      // 2. Create committee record
      const committeeData = {
        user_id: newUser.id,
        type: data.committeeType,
        organization_name: data.committeeType === "organization" ? data.organizationName : null,
        candidate_first_name: data.committeeType === "candidate" ? data.candidateFirstName : null,
        candidate_middle_initial: data.committeeType === "candidate" ? data.candidateMiddleInitial : null,
        candidate_last_name: data.committeeType === "candidate" ? data.candidateLastName : null,
        candidate_suffix: data.committeeType === "candidate" ? data.candidateSuffix : null
      };
      
      const { error: committeeError } = await supabase.from("committees").insert(committeeData);
      if (committeeError) throw committeeError;
      
      console.log("Committee created successfully for user:", newUser.id);
      
      // Store user ID in context for voicemail step
      updateData({ userId: newUser.id });
      
      // Move to voicemail step
      setIsSubmitting(false);
      return newUser.id;
    } catch (error: any) {
      console.error("Error creating user and committee:", error);
      setIsSubmitting(false);
      toast({
        title: "Sign Up Error",
        description: error.message || "Failed to create your account. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Handle uploading the voicemail using the saveVoicemail function
  const handleVoicemailUpload = async () => {
    if (!data.voicemailFile || !data.userId) {
      console.log("No voicemail file to upload or missing user ID");
      return true; // Not an error if no file
    }
    
    try {
      console.log("Starting voicemail upload for user:", data.userId, "File:", data.voicemailFile.name);
      
      // Use the saveVoicemail function
      await saveVoicemail({
        userId: data.userId,
        name: "Default Voicemail",
        description: null,
        uploadedFile: data.voicemailFile,
        recordedBlob: null,
      });
      
      console.log("Voicemail uploaded successfully");
      toast({
        title: "Voicemail Uploaded",
        description: "Your voicemail greeting has been added to your account.",
      });
      return true;
    } catch (error: any) {
      console.error("Error with voicemail upload:", error);
      setVoicemailError(error.message || "Failed to upload voicemail");
      toast({
        title: "Voicemail Upload Failed",
        description: error.message || "There was a problem uploading your voicemail",
        variant: "destructive"
      });
      return false;
    }
  };

  // Complete the signup and redirect
  const finalizeSignup = () => {
    // Reset sign up data
    resetData();

    // Show success message
    toast({
      title: "Success!",
      description: "Your account has been created successfully. You can now sign in."
    });

    // Redirect to sign in
    navigate("/auth/signin");
  };

  // Handle committee step completion
  const handleCommitteeStepComplete = async () => {
    const userId = await createUserAndCommittee();
    return !!userId; // Return true if account was created successfully
  };

  // Handle the final step (complete sign up with voicemail)
  const handleVoicemailStepComplete = async () => {
    setIsSubmitting(true);
    setVoicemailError(null);
    
    try {
      // Upload the voicemail
      const voicemailUploaded = await handleVoicemailUpload();
      
      if (!voicemailUploaded) {
        // If voicemail upload failed, we'll stay on the current step to allow retry
        setIsSubmitting(false);
        return;
      }
      
      // If everything succeeds, finalize the signup
      finalizeSignup();
    } catch (error: any) {
      console.error("Sign up process error:", error);
      setIsSubmitting(false);
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during the sign up process",
        variant: "destructive"
      });
    }
  };

  // Handle skipping the voicemail step
  const handleSkipVoicemail = async () => {
    setIsSubmitting(true);
    
    try {
      // Just finalize the signup without uploading a voicemail
      finalizeSignup();
    } catch (error: any) {
      console.error("Error when skipping voicemail:", error);
      setIsSubmitting(false);
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during the sign up process",
        variant: "destructive"
      });
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
            {currentStep === 2 && <CommitteeStep onComplete={handleCommitteeStepComplete} isSubmitting={isSubmitting} />}
            {currentStep === 3 && (
              <VoicemailStep 
                onComplete={handleVoicemailStepComplete} 
                isSubmitting={isSubmitting}
                error={voicemailError}
                onSkipVoicemail={handleSkipVoicemail}
              />
            )}
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
