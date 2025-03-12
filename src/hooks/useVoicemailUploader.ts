
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const useVoicemailUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  return {
    isUploading,
    setIsUploading
  };
};
