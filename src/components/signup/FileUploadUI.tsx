
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";

interface FileUploadUIProps {
  onFileSelected: (file: File) => void;
}

const FileUploadUI = ({ onFileSelected }: FileUploadUIProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onFileSelected(file);
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
      >
        <Upload className="h-4 w-4 mr-2" /> Upload Audio File
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/mpeg,audio/wav,audio/x-aiff"
        className="hidden"
      />
    </>
  );
};

export default FileUploadUI;
