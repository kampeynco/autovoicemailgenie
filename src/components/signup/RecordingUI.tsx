
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RecordingUIProps {
  isRecording: boolean;
  recordingTime?: number;
  recordingProgress?: number;
  maxRecordingTime?: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingUI = ({ 
  isRecording, 
  recordingTime = 0, 
  recordingProgress = 0, 
  maxRecordingTime = 30,
  onStartRecording, 
  onStopRecording 
}: RecordingUIProps) => {
  
  // Format seconds as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (isRecording) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 animate-pulse">
          <Mic className="h-8 w-8 text-white" />
        </div>
        
        <div className="w-full max-w-xs space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Recording in progress...</p>
            <div className="flex items-center text-sm font-medium">
              <Timer className="h-4 w-4 mr-1 text-gray-500" />
              <span className={recordingTime >= maxRecordingTime - 5 ? "text-red-500" : "text-gray-700"}>
                {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
              </span>
            </div>
          </div>
          
          <Progress 
            value={recordingProgress} 
            className={recordingProgress >= 80 ? "bg-gray-200" : "bg-gray-200"}
          />
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              recordingProgress >= 80 ? "bg-red-500" : "bg-green-500"
            }`} 
            style={{ width: `${recordingProgress}%`, marginTop: "-0.5rem" }}
          />
        </div>
        
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
