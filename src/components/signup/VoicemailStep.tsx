
import { useState } from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { useVoicemailUploader } from "@/hooks/useVoicemailUploader";
import VoicemailHeader from "./voicemail/VoicemailHeader";
import VoicemailUploadSection from "./voicemail/VoicemailUploadSection";
import SubmitButtonSection from "./committees/SubmitButtonSection";

interface VoicemailStepProps {
  onComplete: () => Promise<void>;
  isSubmitting: boolean;
}

const VoicemailStep = ({ onComplete, isSubmitting }: VoicemailStepProps) => {
  const { updateData, prevStep } = useSignUp();
  const { toast } = useToast();
  const [voicemailFile, setVoicemailFile] = useState<File | null>(null);
  const { isUploading, setIsUploading, ensureVoicemailsBucketExists } = useVoicemailUploader();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!voicemailFile) {
      toast({
        title: "Missing Voicemail",
        description: "Please record or upload a voicemail message.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      await ensureVoicemailsBucketExists();
      updateData({ voicemailFile });
      await onComplete();
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <VoicemailHeader />
        <VoicemailUploadSection onVoicemailUpdate={setVoicemailFile} />
        <SubmitButtonSection 
          isSubmitting={isSubmitting || isUploading} 
          onBack={prevStep} 
        />
      </div>
    </form>
  );
};

export default VoicemailStep;
