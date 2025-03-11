
import React from "react";
import { format } from "date-fns";
import { Clock, Calendar, FileText } from "lucide-react";
import { CallRecording } from "@/types/twilio";

interface CallDetailsProps {
  callTime: string;
  recording?: CallRecording;
}

const CallDetails: React.FC<CallDetailsProps> = ({ callTime, recording }) => {
  return (
    <div className="space-y-3 pt-2">
      {recording?.duration && (
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>Duration: {Math.round(recording.duration)} seconds</span>
        </div>
      )}
      
      <div className="flex items-center text-sm text-gray-600">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Date: {format(new Date(callTime), 'MMM d, yyyy h:mm a')}</span>
      </div>
      
      {recording?.transcription && (
        <div className="mt-3">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <FileText className="h-4 w-4 mr-2" />
            <span>Transcription:</span>
          </div>
          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
            {recording.transcription}
          </p>
        </div>
      )}
    </div>
  );
};

export default CallDetails;
