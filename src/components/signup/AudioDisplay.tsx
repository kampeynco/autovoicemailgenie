
import { Button } from "@/components/ui/button";
import { Mic, Upload } from "lucide-react";

interface AudioDisplayProps {
  blob: Blob | null;
  file: File | null;
  onClearRecording?: () => void;
  onClearFile?: () => void;
}

const AudioDisplay = ({ blob, file, onClearRecording, onClearFile }: AudioDisplayProps) => {
  if (blob) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <Mic className="h-8 w-8 text-white" />
        </div>
        <p className="text-sm text-gray-500 mb-4">Voicemail recorded successfully!</p>
        <audio controls className="w-full max-w-xs">
          <source src={URL.createObjectURL(blob)} type={blob.type} />
          Your browser does not support the audio element.
        </audio>
        {onClearRecording && (
          <Button
            type="button"
            variant="outline"
            onClick={onClearRecording}
            className="mt-4"
          >
            Record again
          </Button>
        )}
      </div>
    );
  }

  if (file) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
          <Upload className="h-8 w-8 text-white" />
        </div>
        <p className="text-sm text-gray-500 mb-4">File uploaded: {file.name}</p>
        <audio controls className="w-full max-w-xs">
          <source src={URL.createObjectURL(file)} type={file.type} />
          Your browser does not support the audio element.
        </audio>
        {onClearFile && (
          <Button
            type="button"
            variant="outline"
            onClick={onClearFile}
            className="mt-4"
          >
            Choose different file
          </Button>
        )}
      </div>
    );
  }

  return null;
};

export default AudioDisplay;
