
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { uploadVoicemail } from "@/services/voicemailUploadService";
import { useAuth } from "@/contexts/AuthContext";

export const useVoicemailUploader = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadVoicemailFile = async (voicemailFile: File): Promise<string | null> => {
    if (!user) {
      const errorMsg = "You must be logged in to upload a voicemail";
      setUploadError(errorMsg);
      toast({
        title: "Authentication Error",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }

    if (!voicemailFile) {
      const errorMsg = "No file selected for upload";
      setUploadError(errorMsg);
      toast({
        title: "Upload Error",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      console.log("Uploading voicemail file:", voicemailFile.name);
      const filePath = await uploadVoicemail(user.id, voicemailFile);
      
      setIsUploading(false);
      toast({
        title: "Upload Successful",
        description: "Your voicemail has been uploaded successfully."
      });
      
      return filePath;
    } catch (error: any) {
      console.error("Voicemail upload error:", error);
      const errorMsg = error?.message || "Failed to upload voicemail";
      setUploadError(errorMsg);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: errorMsg,
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    isUploading,
    uploadError,
    uploadVoicemailFile,
    setIsUploading,
    setUploadError
  };
};
