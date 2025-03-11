
import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  recordingUrl: string;
  callId: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ recordingUrl, callId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio element when component mounts
    if (recordingUrl && !audio) {
      const newAudio = new Audio(recordingUrl);
      
      newAudio.onended = () => {
        setIsPlaying(false);
      };
      
      newAudio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying(false);
      };
      
      setAudio(newAudio);
    }
    
    // Cleanup on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
        setAudio(null);
      }
    };
  }, [recordingUrl, audio]);
  
  const togglePlay = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error("Failed to play audio:", err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };
  
  if (!recordingUrl) return null;
  
  return (
    <Button
      variant="outline"
      size="sm"
      className={`${
        isPlaying 
          ? "bg-[#004838] text-white hover:bg-[#003026]" 
          : "border-[#004838] text-[#004838] hover:bg-[#E3F1ED]"
      }`}
      onClick={togglePlay}
    >
      {isPlaying ? (
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
  );
};

export default AudioPlayer;
