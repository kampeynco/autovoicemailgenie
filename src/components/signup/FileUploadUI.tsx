
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface FileUploadUIProps {
  onFileSelected: (file: File) => void;
}

const FileUploadUI = ({ onFileSelected }: FileUploadUIProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Add file size check (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive"
        });
        return;
      }
      
      setIsUploading(true);
      
      // Simulate a brief delay to show loading state
      setTimeout(() => {
        onFileSelected(file);
        setIsUploading(false);
      }, 500);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={triggerFileUpload}
        className="mx-2"
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-2" /> 
        {isUploading ? "Processing..." : "Upload Audio File"}
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/mpeg,audio/wav,audio/x-aiff,audio/webm"
        className="hidden"
      />
    </>
  );
};

export default FileUploadUI;
