
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVoicemailUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // We no longer need this function for signup since bucket creation requires admin permissions
  // The voicemailUploadService.ts already handles checking if the bucket exists
  const ensureVoicemailsBucketExists = async () => {
    // Return true to indicate success without attempting bucket creation
    // The bucket creation should be handled on the server side or by an admin
    return true;
  };

  return {
    isUploading,
    setIsUploading,
    ensureVoicemailsBucketExists
  };
};
