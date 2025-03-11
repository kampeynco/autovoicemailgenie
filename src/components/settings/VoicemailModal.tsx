
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useVoicemailRecorder } from "@/hooks/useVoicemailRecorder";
import RecordingUI from "../signup/RecordingUI";
import FileUploadUI from "../signup/FileUploadUI";
import AudioDisplay from "../signup/AudioDisplay";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
      let filePath = null;
      
      // Only upload a new file if we have one
      if (uploadedFile || recordedBlob) {
        const fileToUpload = uploadedFile || new File([recordedBlob!], "recording.webm", { type: recordedBlob!.type });
        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        // Make sure the voicemails bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const voicemailsBucketExists = buckets?.some(bucket => bucket.name === 'voicemails');
        
        if (!voicemailsBucketExists) {
          // Create the bucket if it doesn't exist
          await supabase.storage.createBucket('voicemails', {
            public: true,
          });
        }
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('voicemails')
          .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('voicemails')
          .getPublicUrl(fileName);
          
        filePath = publicUrlData.publicUrl;
      }

      // Create or update voicemail record in database
      if (editVoicemail) {
        // Update existing voicemail
        const updateData: any = { 
          name, 
          description: description || null,
        };
        
        // Only update file_path if a new file was uploaded
        if (filePath) {
          updateData.file_path = filePath;
        }
        
        const { error } = await supabase
          .from('voicemails')
          .update(updateData)
          .eq('id', editVoicemail.id);
          
        if (error) throw error;
      } else {
        // Create new voicemail
        if (!filePath) {
          throw new Error("No audio file was provided");
        }
        
        const { error } = await supabase
          .from('voicemails')
          .insert({ 
            user_id: user.id,
            name,
            description: description || null,
            file_path: filePath,
            is_default: false
          });
          
        if (error) throw error;
      }
      
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
          <div className="space-y-2">
            <Label htmlFor="voicemail-name">Name</Label>
            <Input 
              id="voicemail-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Voicemail name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="voicemail-description">Description (optional)</Label>
            <Textarea 
              id="voicemail-description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this voicemail"
            />
          </div>
          
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
