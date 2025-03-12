
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const uploadVoicemail = async (userId: string, voicemailFile: File) => {
  console.log("Starting voicemail upload process");
  
  // Check if the voicemails bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    console.error("Error checking buckets:", bucketError);
    throw new Error("Failed to check storage buckets");
  }
  
  const voicemailsBucketExists = buckets?.some(bucket => bucket.name === 'voicemails');
  
  if (!voicemailsBucketExists) {
    console.log("Creating voicemails bucket");
    // Create the bucket if it doesn't exist
    const { error: createBucketError } = await supabase.storage.createBucket('voicemails', {
      public: true,
    });
    
    if (createBucketError) {
      console.error("Error creating bucket:", createBucketError);
      throw new Error("Failed to create storage bucket");
    }
  }
  
  // Generate a unique filename with proper extension
  const fileExtension = voicemailFile.name.split('.').pop() || 
                        (voicemailFile.type === 'audio/webm' ? 'webm' : 
                        voicemailFile.type === 'audio/mpeg' ? 'mp3' : 
                        voicemailFile.type === 'audio/wav' ? 'wav' : 'audio');
  
  const fileName = `${userId}/voicemail_${Date.now()}.${fileExtension}`;
  console.log("Uploading file:", fileName, "Type:", voicemailFile.type);
  
  // Upload to Supabase Storage with explicit options
  const {
    error: uploadError,
    data: uploadData
  } = await supabase.storage.from('voicemails').upload(fileName, voicemailFile, {
    cacheControl: '3600',
    upsert: false
  });
  
  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw uploadError;
  }
  
  console.log("File uploaded successfully");

  // Get the public URL
  const { data: pathData } = supabase.storage.from('voicemails').getPublicUrl(fileName);
  
  if (!pathData || !pathData.publicUrl) {
    console.error("Failed to get public URL");
    throw new Error("Failed to get public URL for the voicemail");
  }
  
  console.log("Public URL:", pathData.publicUrl);

  // Create voicemail record with the file path
  const { error: voicemailError } = await supabase.from("voicemails").insert({
    user_id: userId,
    file_path: pathData.publicUrl,
    name: "Default Voicemail",
    is_default: true
  });
  
  if (voicemailError) {
    console.error("Voicemail record error:", voicemailError);
    throw voicemailError;
  }
  
  console.log("Voicemail record created successfully");
  
  return pathData.publicUrl;
};
