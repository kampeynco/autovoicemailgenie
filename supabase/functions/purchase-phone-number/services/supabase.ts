
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Initialize Supabase clients
export function initSupabaseClients(authHeader: string | null) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Extract the JWT token
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Initialize admin client only - don't depend on user token
  return { supabaseAdmin, supabaseUrl };
}

// Get user ID from auth header using admin client
export async function getUserFromAuth(supabaseAdmin: any, authHeader: string | null) {
  if (!authHeader) {
    throw new Error('No Authorization header found');
  }
  
  // Extract JWT token
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Use the admin client to get user from JWT
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.error('Error getting user:', error);
      throw new Error('Unauthorized');
    }
    
    return user;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw new Error('Authentication failed');
  }
}

// Check if user already has a phone number
export async function checkExistingPhoneNumber(supabaseAdmin: any, userId: string) {
  const { data: existingNumbers, error: existingError } = await supabaseAdmin
    .from('phone_numbers')
    .select('*')
    .eq('user_id', userId);
  
  if (existingError) {
    console.error('Error checking existing phone number:', existingError);
    throw new Error('Failed to check existing phone number');
  }
  
  if (existingNumbers && existingNumbers.length > 0) {
    return existingNumbers[0];
  }
  
  return null;
}

// Save purchased phone number to database
export async function savePhoneNumber(supabaseAdmin: any, userId: string, phoneData: any) {
  const { data: phoneNumberData, error: phoneNumberError } = await supabaseAdmin
    .from('phone_numbers')
    .insert({
      user_id: userId,
      phone_number: phoneData.phone_number,
      twilio_sid: phoneData.sid,
      friendly_name: phoneData.friendly_name,
      capabilities: {
        voice: phoneData.capabilities.voice,
        sms: phoneData.capabilities.sms,
      },
    })
    .select()
    .single();
  
  if (phoneNumberError) {
    console.error('Error saving phone number:', phoneNumberError);
    throw new Error('Failed to save phone number');
  }
  
  return phoneNumberData;
}
