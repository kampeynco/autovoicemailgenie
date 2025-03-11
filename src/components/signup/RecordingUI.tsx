
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";

interface RecordingUIProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingUI = ({ isRecording, onStartRecording, onStopRecording }: RecordingUIProps) => {
  if (isRecording) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 animate-pulse">
          <Mic className="h-8 w-8 text-white" />
        </div>
        <p className="text-sm text-gray-500 mb-4">Recording in progress...</p>
        <Button
          type="button"
          variant="outline"
          onClick={onStopRecording}
          className="flex items-center"
        >
          <StopCircle className="h-4 w-4 mr-2" /> Stop Recording
        </Button>
      </div>
    );
  }
  
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onStartRecording}
      className="mx-2"
    >
      <Mic className="h-4 w-4 mr-2" /> Record Voicemail
    </Button>
  );
};

export default RecordingUI;
