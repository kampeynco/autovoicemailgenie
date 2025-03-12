
import { supabase } from "@/integrations/supabase/client";

export const saveVoicemail = async ({
  userId,
  voicemailId,
  name,
  description,
  uploadedFile,
  recordedBlob,
}: {
  userId: string;
  voicemailId?: string;
  name: string;
  description: string | null;
  uploadedFile: File | null;
  recordedBlob: Blob | null;
}) => {
  let filePath = null;
  
  // Only upload a new file if we have one
  if (uploadedFile || recordedBlob) {
    const fileToUpload = uploadedFile || new File([recordedBlob!], "recording.webm", { type: recordedBlob!.type });
    const fileExt = fileToUpload.name.split('.').pop();
    
    // Ensure proper file path for RLS policies - must include userId as the first folder segment
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from('voicemails')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) {
      console.error("Error uploading voicemail file:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('voicemails')
      .getPublicUrl(fileName);
      
    filePath = publicUrlData.publicUrl;
  }

  if (voicemailId) {
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
      .eq('id', voicemailId);
      
    if (error) {
      console.error("Error updating voicemail record:", error);
      throw error;
    }
  } else {
    // Create new voicemail
    if (!filePath) {
      throw new Error("No audio file was provided");
    }
    
    const { error } = await supabase
      .from('voicemails')
      .insert({ 
        user_id: userId,
        name,
        description: description || null,
        file_path: filePath,
        is_default: false
      });
      
    if (error) {
      console.error("Error creating voicemail record:", error);
      throw error;
    }
  }

  return true;
};
