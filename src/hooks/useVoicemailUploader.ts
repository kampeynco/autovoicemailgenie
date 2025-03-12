
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useVoicemailUploader = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const ensureVoicemailsBucketExists = async () => {
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error checking buckets:", listError);
        toast({
          title: "Storage Error",
          description: "Could not check storage buckets. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === 'voicemails');
      
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('voicemails', {
          public: true,
        });
        
        if (createError) {
          console.error("Error creating voicemails bucket:", createError);
          toast({
            title: "Storage Error",
            description: "Could not create storage bucket. Please try again.",
            variant: "destructive"
          });
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Bucket check/creation error:", error);
      toast({
        title: "Storage Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    isUploading,
    setIsUploading,
    ensureVoicemailsBucketExists
  };
};
