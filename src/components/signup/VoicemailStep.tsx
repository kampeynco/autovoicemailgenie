
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVoicemailRecorder } from "@/hooks/useVoicemailRecorder";
import RecordingUI from "./RecordingUI";
import FileUploadUI from "./FileUploadUI";
import AudioDisplay from "./AudioDisplay";

interface VoicemailStepProps {
  onComplete: () => Promise<void>;
  isSubmitting: boolean;
}

const VoicemailStep = ({ onComplete, isSubmitting }: VoicemailStepProps) => {
  const { data, updateData, prevStep } = useSignUp();
  const { toast } = useToast();
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
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Prepare the file to upload
      const fileToUpload = uploadedFile || new File([recordedBlob!], 'voicemail.webm', { 
        type: recordedBlob!.type 
      });
      
      // Generate a unique filename
      const fileName = `voicemail_${Date.now()}.${fileToUpload.name.split('.').pop()}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error } = await supabase.storage
        .from('voicemails')
        .upload(fileName, fileToUpload);

      if (error) {
        throw new Error(error.message);
      }

      // Get the public URL
      const { data: pathData } = supabase.storage
        .from('voicemails')
        .getPublicUrl(fileName);

      // Update the sign up context with the file path
      updateData({ voicemailPath: pathData.publicUrl });
      
      // Complete sign up
      await onComplete();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-[#073127]">Voicemail Message</h2>
          <p className="mt-1 text-sm text-gray-500">
            Record or upload a voicemail message for your committee.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            {isRecording || recordedBlob ? (
              <RecordingUI 
                isRecording={isRecording} 
                onStartRecording={startRecording} 
                onStopRecording={stopRecording} 
              />
            ) : uploadedFile ? null : (
              <div className="space-y-4">
                <RecordingUI 
                  isRecording={isRecording} 
                  onStartRecording={startRecording} 
                  onStopRecording={stopRecording} 
                />
                <p className="text-sm text-gray-500">Or</p>
                <FileUploadUI onFileSelected={handleFileSelected} />
              </div>
            )}
            
            <AudioDisplay 
              blob={recordedBlob}
              file={uploadedFile}
              onClearRecording={clearRecording}
              onClearFile={clearFile}
            />
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            type="button" 
            variant="outline"
            className="w-1/2 h-12"
            onClick={prevStep}
            disabled={isSubmitting || isUploading}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="w-1/2 h-12 bg-[#004838] hover:bg-[#003026]"
            disabled={isSubmitting || isUploading || (!recordedBlob && !uploadedFile)}
          >
            {isSubmitting || isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : "Complete Sign Up"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VoicemailStep;
