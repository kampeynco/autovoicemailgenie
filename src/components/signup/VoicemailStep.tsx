
import { useState } from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import VoicemailHeader from "./voicemail/VoicemailHeader";
import VoicemailUploadSection from "./voicemail/VoicemailUploadSection";
import SubmitButtonSection from "./committees/SubmitButtonSection";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoicemailStepProps {
  onComplete: () => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
  onSkipVoicemail: () => Promise<void>;
}

const VoicemailStep = ({ 
  onComplete, 
  isSubmitting, 
  error, 
  onSkipVoicemail 
}: VoicemailStepProps) => {
  const { updateData, prevStep, data } = useSignUp();
  const { toast } = useToast();
  const [voicemailFile, setVoicemailFile] = useState<File | null>(null);
  
  const displayError = error;

  // Show an error if somehow we reached this step without a user ID
  const userIdMissing = !data.userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userIdMissing) {
      toast({
        title: "Account Error",
        description: "There was a problem with your account. Please start over.",
        variant: "destructive"
      });
      return;
    }

    if (!voicemailFile) {
      toast({
        title: "Missing Voicemail",
        description: "Please record or upload a voicemail message.",
        variant: "destructive"
      });
      return;
    }
    
    // Store the file in context for later upload
    updateData({ voicemailFile });
    
    // Proceed to completion
    await onComplete();
  };

  if (userIdMissing) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Account Creation Error</AlertTitle>
        <AlertDescription>
          There was a problem with your account creation. Please try again from the beginning.
          <div className="mt-4">
            <Button 
              type="button" 
              onClick={() => window.location.reload()}
            >
              Start Over
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <VoicemailHeader />
        
        {displayError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {displayError}
              <p className="mt-2">Please try again or you can skip adding a voicemail for now.</p>
              <div className="mt-4 flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onSkipVoicemail}
                  disabled={isSubmitting}
                >
                  Skip for now
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !voicemailFile}
                >
                  Try again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <VoicemailUploadSection onVoicemailUpdate={setVoicemailFile} />
        
        {!displayError && (
          <SubmitButtonSection 
            isSubmitting={isSubmitting} 
            onBack={prevStep} 
          />
        )}
      </div>
    </form>
  );
};

export default VoicemailStep;
