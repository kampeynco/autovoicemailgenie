
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { saveVoicemail } from "@/services/voicemailService";

export const useSignUpSteps = () => {
  const { signUp } = useAuth();
  const { data, resetData, updateData } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voicemailError, setVoicemailError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Handle uploading the voicemail
  const handleVoicemailUpload = async () => {
    if (!data.userId) {
      console.log("Missing user ID");
      return false;
    }

    if (!data.voicemailFile && !data.recordedBlob) {
      console.log("No voicemail file or recording to upload");
      return true; // Not an error if no file
    }
    
    try {
      console.log("Starting voicemail upload for user:", data.userId);
      
      await saveVoicemail({
        userId: data.userId,
        name: "Default Voicemail",
        description: null,
        uploadedFile: data.voicemailFile,
        recordedBlob: data.recordedBlob || null,
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

  return {
    isSubmitting,
    voicemailError,
    handleCommitteeStepComplete,
    handleVoicemailStepComplete,
    handleSkipVoicemail,
  };
};
