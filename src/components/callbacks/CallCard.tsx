
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { PhoneIncoming } from "lucide-react";
import { formatPhoneNumber } from "@/services/twilioService";
import { CallWithRecording } from "@/types/twilio";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AudioPlayer from "./AudioPlayer";
import CallDetails from "./CallDetails";

interface CallCardProps {
  call: CallWithRecording;
}

const CallCard: React.FC<CallCardProps> = ({ call }) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="bg-[#E3F1ED] p-2 rounded-full mr-4">
              <PhoneIncoming className="h-5 w-5 text-[#004838]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {formatPhoneNumber(call.caller_number)}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(call.call_time), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {call.has_recording && call.recording && call.recording.recording_url && (
            <AudioPlayer 
              recordingUrl={call.recording.recording_url}
              callId={call.id}
            />
          )}
        </div>
        
        {call.has_recording && call.recording && (
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="details">
              <AccordionTrigger className="text-sm text-[#004838] py-2">
                View Details
              </AccordionTrigger>
              <AccordionContent>
                <CallDetails 
                  callTime={call.call_time}
                  recording={call.recording}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default CallCard;
