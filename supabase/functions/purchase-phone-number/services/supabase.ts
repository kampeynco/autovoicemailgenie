
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Initialize Supabase clients
export function initSupabaseClients(authHeader: string | null) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Extract the JWT token
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Initialize user client if token exists
  const supabase = token ? createClient(supabaseUrl, token) : null;
  
  return { supabaseAdmin, supabase, supabaseUrl };
}

// Authenticate user and return user data
export async function authenticateUser(supabase: any) {
  if (!supabase) {
    throw new Error('No Authorization header found');
  }
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('Error getting user:', userError);
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Check if user already has a phone number
export async function checkExistingPhoneNumber(supabase: any, userId: string) {
  const { data: existingNumbers, error: existingError } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('user_id', userId);
  
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
