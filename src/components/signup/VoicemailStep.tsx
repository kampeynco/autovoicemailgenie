
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVoicemailRecorder } from "@/hooks/useVoicemailRecorder";
import RecordingUI from "./RecordingUI";
import FileUploadUI from "./FileUploadUI";
import AudioDisplay from "./AudioDisplay";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VoicemailStepProps {
  onComplete: () => Promise<void>;
  isSubmitting: boolean;
}

const VoicemailStep = ({
  onComplete,
  isSubmitting
}: VoicemailStepProps) => {
  const {
    data,
    updateData,
    prevStep
  } = useSignUp();
  const {
    toast
  } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    isRecording,
    recordedBlob,
    startRecording,
    stopRecording,
    clearRecording
  } = useVoicemailRecorder();

  const handleFileSelected = (file: File) => {
    // Check if file is of the right type
    const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-aiff'];
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an MP3, WAV, or AIFF file.",
        variant: "destructive"
      });
      return;
    }
    setUploadedFile(file);
    clearRecording(); // Clear any recorded audio
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if we have a recorded blob or uploaded file
    if (!recordedBlob && !uploadedFile) {
      toast({
        title: "Missing Voicemail",
        description: "Please record or upload a voicemail message.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);

      // Prepare the file to upload, but don't upload yet
      const fileToUpload = uploadedFile || new File([recordedBlob!], 'voicemail.webm', {
        type: recordedBlob!.type
      });

      // Store the file in the context to be uploaded after user creation
      updateData({
        voicemailFile: fileToUpload
      });

      // Complete sign up (this will create user first, then handle the upload)
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

  return <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium text-[#073127]">Voicemail Message</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-left">Voicemails should be no more than 30 seconds.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Record or upload a voicemail message for your committee.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            {isRecording || recordedBlob ? <RecordingUI isRecording={isRecording} onStartRecording={startRecording} onStopRecording={stopRecording} /> : uploadedFile ? null : <div className="space-y-4">
                <RecordingUI isRecording={isRecording} onStartRecording={startRecording} onStopRecording={stopRecording} />
                <p className="text-sm text-gray-500">Or</p>
                <FileUploadUI onFileSelected={handleFileSelected} />
                <p className="text-xs text-gray-500 mt-2">Accepted file types: MP3, WAV, or AIFF.</p>
              </div>}
            
            <AudioDisplay blob={recordedBlob} file={uploadedFile} onClearRecording={clearRecording} onClearFile={clearFile} />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button type="button" variant="outline" className="w-1/2 h-12" onClick={prevStep} disabled={isSubmitting || isUploading}>
            Back
          </Button>
          <Button type="submit" className="w-1/2 h-12 bg-[#004838] hover:bg-[#003026]" disabled={isSubmitting || isUploading || !recordedBlob && !uploadedFile}>
            {isSubmitting || isUploading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : "Complete Sign Up"}
          </Button>
        </div>
      </div>
    </form>;
};

export default VoicemailStep;
