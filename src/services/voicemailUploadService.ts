
import { supabase } from "@/integrations/supabase/client";

// Maximum retry attempts for file upload
const MAX_UPLOAD_RETRIES = 3;

export const uploadVoicemail = async (userId: string, voicemailFile: File) => {
  console.log("Starting voicemail upload process");
  
  // Check if the voicemails bucket exists
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  
  if (bucketError) {
    console.error("Error checking buckets:", bucketError);
    throw new Error(`Failed to check storage buckets: ${bucketError.message}`);
  }
  
  const voicemailsBucketExists = buckets?.some(bucket => bucket.name === 'voicemails');
  
  if (!voicemailsBucketExists) {
    console.log("Voicemails bucket doesn't exist");
    throw new Error("The voicemails storage bucket doesn't exist. Please contact support.");
  }
  
  // Generate a unique filename with proper extension
  const fileExtension = voicemailFile.name.split('.').pop() || 
                        (voicemailFile.type === 'audio/webm' ? 'webm' : 
                        voicemailFile.type === 'audio/mpeg' ? 'mp3' : 
                        voicemailFile.type === 'audio/wav' ? 'wav' : 'audio');
  
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
        console.log(`Upload successful on attempt ${attempt}`);
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
    throw new Error(`Failed to upload voicemail after ${MAX_UPLOAD_RETRIES} attempts. Please try again later.`);
  }
  
  console.log("File uploaded successfully");

  // Get the public URL
  const { data: pathData } = supabase.storage.from('voicemails').getPublicUrl(fileName);
  
  if (!pathData || !pathData.publicUrl) {
    console.error("Failed to get public URL");
    throw new Error("Failed to get public URL for the voicemail");
  }
  
  console.log("Public URL:", pathData.publicUrl);

  // Verify the file exists in storage
  try {
    const { data: fileData, error: fileError } = await supabase.storage
      .from('voicemails')
      .download(fileName);
      
    if (fileError || !fileData) {
      console.error("File verification failed:", fileError);
      throw new Error("Uploaded file could not be verified: " + (fileError?.message || "Unknown error"));
    }
    
    console.log("File verified in storage");
  } catch (verifyError) {
    console.error("Error verifying file:", verifyError);
    // We'll continue even if verification fails, but log it
  }

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
