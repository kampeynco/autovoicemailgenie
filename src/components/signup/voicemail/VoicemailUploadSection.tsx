import { useState } from "react";
import RecordingUI from "../RecordingUI";
import FileUploadUI from "../FileUploadUI";
import AudioDisplay from "../AudioDisplay";
import { useVoicemailRecorder } from "@/hooks/useVoicemailRecorder";
import { useToast } from "@/components/ui/use-toast";

interface VoicemailUploadSectionProps {
  onVoicemailUpdate: (file: File | null) => void;
}

const VoicemailUploadSection = ({ onVoicemailUpdate }: VoicemailUploadSectionProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const {
    isRecording,
    recordedBlob,
    recordingTime,
    recordingProgress,
    MAX_RECORDING_TIME,
    startRecording,
    stopRecording,
    clearRecording,
    updateData
  } = useVoicemailRecorder();

  const handleFileSelected = (file: File) => {
    const acceptedTypes = ['audio/mpeg', 'audio/wav', 'audio/x-aiff', 'audio/webm'];
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an MP3, WAV, WEBM, or AIFF file.",
        variant: "destructive"
      });
      return;
    }
    setUploadedFile(file);
    onVoicemailUpdate(file);
    clearRecording();
  };

  const clearFile = () => {
    setUploadedFile(null);
    onVoicemailUpdate(null);
  };

  const handleRecordingComplete = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'voicemail.webm', {
        type: recordedBlob.type
      });
      onVoicemailUpdate(file);
      updateData({ recordedBlob });
    }
  };

  return (
    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
      {isRecording || recordedBlob ? (
        <RecordingUI 
          isRecording={isRecording}
          recordingTime={recordingTime}
          recordingProgress={recordingProgress}
          maxRecordingTime={MAX_RECORDING_TIME}
          onStartRecording={startRecording} 
          onStopRecording={() => {
            stopRecording();
            handleRecordingComplete();
          }} 
        />
      ) : uploadedFile ? null : (
        <div className="space-y-4">
          <RecordingUI 
            isRecording={isRecording}
            recordingTime={recordingTime}
            recordingProgress={recordingProgress}
            maxRecordingTime={MAX_RECORDING_TIME}
            onStartRecording={startRecording} 
            onStopRecording={() => {
              stopRecording();
              handleRecordingComplete();
            }} 
          />
          <p className="text-sm text-gray-500">Or</p>
          <FileUploadUI onFileSelected={handleFileSelected} />
          <p className="text-xs text-gray-500 mt-2">Accepted file types: MP3, WAV, WEBM, or AIFF.</p>
        </div>
      )}
      
      <AudioDisplay 
        blob={recordedBlob} 
        file={uploadedFile} 
        onClearRecording={() => {
          clearRecording();
          onVoicemailUpdate(null);
        }} 
        onClearFile={clearFile} 
      />
    </div>
  );
};

export default VoicemailUploadSection;
