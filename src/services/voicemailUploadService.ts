
import { supabase } from "@/integrations/supabase/client";

// Maximum retry attempts for file upload
const MAX_UPLOAD_RETRIES = 3;

export const uploadVoicemail = async (userId: string, voicemailFile: File) => {
  console.log("Starting voicemail upload process");
  
  // Validate inputs
  if (!userId) {
    console.error("Missing user ID for voicemail upload");
    throw new Error("User ID is required for voicemail upload");
  }
  
  if (!voicemailFile) {
    console.error("Missing file for voicemail upload");
    throw new Error("No voicemail file provided");
  }
  
  // Generate a unique filename with proper extension
  const fileExtension = voicemailFile.name.split('.').pop() || 
                        (voicemailFile.type === 'audio/webm' ? 'webm' : 
                        voicemailFile.type === 'audio/mpeg' ? 'mp3' : 
                        voicemailFile.type === 'audio/wav' ? 'wav' : 'audio');
  
  // Make sure user ID is included in the file path - this is important for RLS policies
  const fileName = `${userId}/voicemail_${Date.now()}.${fileExtension}`;
  console.log("Uploading file:", fileName, "Type:", voicemailFile.type, "Size:", voicemailFile.size);
  
  // Implement retry logic for uploads
  let uploadError = null;
  let uploadData = null;
  
  for (let attempt = 1; attempt <= MAX_UPLOAD_RETRIES; attempt++) {
    try {
      console.log(`Upload attempt ${attempt} of ${MAX_UPLOAD_RETRIES}`);
      
      // Upload to Supabase Storage with explicit options
      const result = await supabase.storage.from('voicemails').upload(fileName, voicemailFile, {
        cacheControl: '3600',
        upsert: attempt > 1, // Only use upsert on retry attempts
      });
      
      uploadError = result.error;
      uploadData = result.data;
      
      if (!uploadError) {
        console.log(`Upload successful on attempt ${attempt}`, uploadData);
        break;
      }
      
      console.error(`Upload attempt ${attempt} failed:`, uploadError);
      
      // If this was the last attempt, don't delay, just let it fail
      if (attempt < MAX_UPLOAD_RETRIES) {
        // Exponential backoff delay between retries (500ms, 1000ms, 2000ms, etc)
        const delay = 500 * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Unexpected error during upload attempt ${attempt}:`, error);
      uploadError = error;
    }
  }
  
  // If all attempts failed, throw the error
  if (uploadError) {
    console.error("All upload attempts failed:", uploadError);
    throw new Error(`Failed to upload voicemail after ${MAX_UPLOAD_RETRIES} attempts: ${uploadError.message || "Unknown error"}`);
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
    throw new Error(`Failed to create voicemail record: ${voicemailError.message}`);
  }
  
  console.log("Voicemail record created successfully");
  
  return pathData.publicUrl;
};
