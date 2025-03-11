
import React, { useState, useEffect } from "react";
import { formatPhoneNumber } from "@/services/twilioService";
import { CallWithRecording } from "@/types/twilio";
import { formatDistanceToNow, format } from "date-fns";
import {
  PhoneIncoming,
  Play,
  Pause,
  Calendar,
  Clock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CallbacksListProps {
  calls: CallWithRecording[];
}

const CallbacksList: React.FC<CallbacksListProps> = ({ calls }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});
  
  // Cleanup audio elements on unmount
  useEffect(() => {
    return () => {
      // Pause and release all audio elements
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = "";
      });
    };
  }, [audioElements]);
  
  // Handle play/pause
  const togglePlay = (callId: string, recordingUrl: string) => {
    if (!recordingUrl) {
      console.error("No recording URL provided");
      return;
    }
    
    if (!audioElements[callId]) {
      // Create a new audio element if it doesn't exist
      const audio = new Audio(recordingUrl);
      
      audio.onended = () => {
        setPlayingId(null);
      };
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setPlayingId(null);
      };
      
      setAudioElements(prev => ({
        ...prev,
        [callId]: audio
      }));
      
      audio.play().catch(err => {
        console.error("Failed to play audio:", err);
        setPlayingId(null);
      });
      
      setPlayingId(callId);
    } else {
      const audio = audioElements[callId];
      
      if (playingId === callId) {
        // Pause this audio
        audio.pause();
        setPlayingId(null);
      } else {
        // Pause any playing audio
        if (playingId && audioElements[playingId]) {
          audioElements[playingId].pause();
        }
        
        // Play this audio
        audio.play().catch(err => {
          console.error("Failed to play audio:", err);
          setPlayingId(null);
        });
        
        setPlayingId(callId);
      }
    }
  };
  
  if (!calls || calls.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
        <PhoneIncoming className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No callbacks found</h3>
        <p className="mt-2 text-gray-500">
          When supporters call your campaign number, their callbacks will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {calls.map(call => (
        <div 
          key={call.id} 
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
                <Button
                  variant="outline"
                  size="sm"
                  className={`${
                    playingId === call.id 
                      ? "bg-[#004838] text-white hover:bg-[#003026]" 
                      : "border-[#004838] text-[#004838] hover:bg-[#E3F1ED]"
                  }`}
                  onClick={() => togglePlay(call.id, call.recording?.recording_url || "")}
                >
                  {playingId === call.id ? (
                    <>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Play
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {call.has_recording && call.recording && (
              <Accordion type="single" collapsible className="mt-2">
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm text-[#004838] py-2">
                    View Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-2">
                      {call.recording.duration && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Duration: {Math.round(call.recording.duration)} seconds</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Date: {format(new Date(call.call_time), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      
                      {call.recording.transcription && (
                        <div className="mt-3">
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <FileText className="h-4 w-4 mr-2" />
                            <span>Transcription:</span>
                          </div>
                          <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md">
                            {call.recording.transcription}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CallbacksList;
