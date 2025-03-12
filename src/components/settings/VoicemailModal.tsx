
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVoicemailRecorder } from "@/hooks/useVoicemailRecorder";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import VoicemailForm from "./voicemail/VoicemailForm";
import VoicemailAudioSection from "./voicemail/VoicemailAudioSection";
import { saveVoicemail } from "@/services/voicemailService";

interface VoicemailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVoicemailSaved: () => void;
  editVoicemail?: {
    id: string;
    name: string;
    description: string | null;
  } | null;
}

const VoicemailModal = ({ isOpen, onClose, onVoicemailSaved, editVoicemail }: VoicemailModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [name, setName] = useState(editVoicemail?.name || "");
  const [description, setDescription] = useState(editVoicemail?.description || "");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const {
    isRecording,
    recordedBlob,
    startRecording,
    stopRecording,
    clearRecording
  } = useVoicemailRecorder();

  // Update form when editVoicemail changes
  useEffect(() => {
    if (editVoicemail) {
      setName(editVoicemail.name);
      setDescription(editVoicemail.description || "");
    }
  }, [editVoicemail]);

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
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to save a voicemail.",
        variant: "destructive"
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please provide a name for your voicemail.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      await saveVoicemail({
        userId: user.id,
        voicemailId: editVoicemail?.id,
        name,
        description: description || null,
        uploadedFile,
        recordedBlob
      });
      
      toast({
        title: "Voicemail Saved",
        description: "Your voicemail has been saved successfully.",
      });
      
      onVoicemailSaved();
      onClose();
    } catch (error: any) {
      console.error("Error saving voicemail:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save voicemail.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editVoicemail ? "Edit Voicemail" : "Add New Voicemail"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <VoicemailForm 
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
          />
          
          <VoicemailAudioSection 
            isRecording={isRecording}
            recordedBlob={recordedBlob}
            uploadedFile={uploadedFile}
            startRecording={startRecording}
            stopRecording={stopRecording}
            clearRecording={clearRecording}
            handleFileSelected={handleFileSelected}
            clearFile={clearFile}
          />
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            className="bg-[#004838] hover:bg-[#003026]"
            onClick={handleSave}
            disabled={isUploading || !name.trim()}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : "Save Voicemail"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoicemailModal;
