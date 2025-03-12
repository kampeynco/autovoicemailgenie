
import React from "react";
import RecordingUI from "../../signup/RecordingUI";
import FileUploadUI from "../../signup/FileUploadUI";
import AudioDisplay from "../../signup/AudioDisplay";
import { useToast } from "@/components/ui/use-toast";

interface VoicemailAudioSectionProps {
  isRecording: boolean;
  recordedBlob: Blob | null;
  uploadedFile: File | null;
  startRecording: () => void;
  stopRecording: () => void;
  clearRecording: () => void;
  handleFileSelected: (file: File) => void;
  clearFile: () => void;
}

const VoicemailAudioSection = ({ 
  isRecording, 
  recordedBlob, 
  uploadedFile, 
  startRecording, 
  stopRecording, 
  clearRecording, 
  handleFileSelected, 
  clearFile 
}: VoicemailAudioSectionProps) => {
  return (
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
  );
};

export default VoicemailAudioSection;
