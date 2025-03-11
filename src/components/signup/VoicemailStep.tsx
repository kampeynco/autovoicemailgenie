
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/contexts/SignUpContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Upload, StopCircle } from "lucide-react";

interface VoicemailStepProps {
  onComplete: () => Promise<void>;
  isSubmitting: boolean;
}

const VoicemailStep = ({ onComplete, isSubmitting }: VoicemailStepProps) => {
  const { data, updateData, prevStep } = useSignUp();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        // Stop all tracks to properly close the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Recording Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('audio/')) {
        setUploadedFile(file);
        setRecordedBlob(null); // Clear any recorded audio
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an audio file.",
          variant: "destructive",
        });
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have a recorded blob or uploaded file
    if (!recordedBlob && !uploadedFile) {
      toast({
        title: "Missing Voicemail",
        description: "Please record or upload a voicemail message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Prepare the file to upload
      const fileToUpload = uploadedFile || new File([recordedBlob!], 'voicemail.webm', { 
        type: recordedBlob!.type 
      });
      
      // Generate a unique filename
      const fileName = `voicemail_${Date.now()}.${fileToUpload.name.split('.').pop()}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error } = await supabase.storage
        .from('voicemails')
        .upload(fileName, fileToUpload);

      if (error) {
        throw new Error(error.message);
      }

      // Get the public URL
      const { data: pathData } = supabase.storage
        .from('voicemails')
        .getPublicUrl(fileName);

      // Update the sign up context with the file path
      updateData({ voicemailPath: pathData.publicUrl });
      
      // Complete sign up
      await onComplete();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-[#073127]">Voicemail Message</h2>
          <p className="mt-1 text-sm text-gray-500">
            Record or upload a voicemail message for your committee.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 animate-pulse">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-4">Recording in progress...</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={stopRecording}
                  className="flex items-center"
                >
                  <StopCircle className="h-4 w-4 mr-2" /> Stop Recording
                </Button>
              </div>
            ) : recordedBlob ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-4">Voicemail recorded successfully!</p>
                <audio controls className="w-full max-w-xs">
                  <source src={URL.createObjectURL(recordedBlob)} type={recordedBlob.type} />
                  Your browser does not support the audio element.
                </audio>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRecordedBlob(null)}
                  className="mt-4"
                >
                  Record again
                </Button>
              </div>
            ) : uploadedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm text-gray-500 mb-4">File uploaded: {uploadedFile.name}</p>
                <audio controls className="w-full max-w-xs">
                  <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type} />
                  Your browser does not support the audio element.
                </audio>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                  className="mt-4"
                >
                  Choose different file
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={startRecording}
                  className="mx-2"
                >
                  <Mic className="h-4 w-4 mr-2" /> Record Voicemail
                </Button>
                <p className="text-sm text-gray-500">Or</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileUpload}
                  className="mx-2"
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload Audio File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/*"
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button 
            type="button" 
            variant="outline"
            className="w-1/2 h-12"
            onClick={prevStep}
            disabled={isSubmitting || isUploading}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            className="w-1/2 h-12 bg-[#004838] hover:bg-[#003026]"
            disabled={isSubmitting || isUploading || (!recordedBlob && !uploadedFile)}
          >
            {isSubmitting || isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : "Complete Sign Up"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default VoicemailStep;
