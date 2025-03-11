
import React from "react";
import { Button } from "@/components/ui/button";
import { useVoicemailRecorder } from "@/hooks/useVoicemailRecorder";
import RecordingUI from "../signup/RecordingUI";
import FileUploadUI from "../signup/FileUploadUI";
import AudioDisplay from "../signup/AudioDisplay";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const VoicemailTab = () => {
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

  const handleSave = async () => {
    if (!recordedBlob && !uploadedFile) {
      toast({
        title: "Missing Voicemail",
        description: "Please record or upload a voicemail message.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Mock implementation - would be replaced with actual save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Voicemail Updated",
        description: "Your voicemail message has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update voicemail message.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Voicemail Message</h2>
        <p className="text-sm text-gray-500 mb-4">
          Record or upload a voicemail message for your committee. Voicemails should be no more than 30 seconds.
        </p>
        
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
              <p className="text-xs text-gray-500 mt-2">Accepted file types: MP3, WAV, or AIFF.</p>
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

      <div className="flex justify-end">
        <Button 
          className="bg-[#004838] hover:bg-[#003026]"
          onClick={handleSave}
          disabled={isUploading || (!recordedBlob && !uploadedFile)}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default VoicemailTab;
