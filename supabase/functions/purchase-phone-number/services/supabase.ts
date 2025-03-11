
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// Initialize Supabase clients
export function initSupabaseClients(authHeader: string | null) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration');
    throw new Error('Supabase configuration is missing');
  }
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  // Extract the JWT token
  const token = authHeader ? authHeader.replace('Bearer ', '') : null;
  
  // Initialize admin client only - don't depend on user token
  return { supabaseAdmin, supabaseUrl };
}

// Get user ID from auth header using admin client
export async function getUserFromAuth(supabaseAdmin: any, authHeader: string | null) {
  if (!authHeader) {
    console.error('No Authorization header found');
    throw new Error('No Authorization header found');
  }
  
  // Extract JWT token
  const token = authHeader.replace('Bearer ', '');
  
  try {
    console.log('Attempting to authenticate user with token');
    
    // Use the admin client to get user from JWT
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      console.error('Error authenticating user:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
    
    if (!data || !data.user) {
      console.error('No user found in authentication response');
      throw new Error('User not found');
    }
    
    console.log(`Successfully authenticated user: ${data.user.id}`);
    return data.user;
  } catch (error) {
    console.error('Error in getUserFromAuth:', error);
    throw new Error(`Authentication failed: ${error.message || 'Unknown error'}`);
  }
}

// Check if user already has a phone number
export async function checkExistingPhoneNumber(supabaseAdmin: any, userId: string) {
  try {
    console.log(`Checking if user ${userId} already has a phone number`);
    
    const { data: existingNumbers, error: existingError } = await supabaseAdmin
      .from('phone_numbers')
      .select('*')
      .eq('user_id', userId);
    
    if (existingError) {
      console.error('Error checking existing phone number:', existingError);
      throw new Error(`Failed to check existing phone number: ${existingError.message}`);
    }
    
    if (existingNumbers && existingNumbers.length > 0) {
      console.log(`User already has phone number: ${existingNumbers[0].phone_number}`);
      return existingNumbers[0];
    }
    
    console.log('No existing phone number found for user');
    return null;
  } catch (error) {
    console.error('Error in checkExistingPhoneNumber:', error);
    throw error;
  }
}

// Save purchased phone number to database
export async function savePhoneNumber(supabaseAdmin: any, userId: string, phoneData: any) {
  try {
    console.log(`Saving phone number for user ${userId}: ${phoneData.phone_number}`);
    
    const { data: phoneNumberData, error: phoneNumberError } = await supabaseAdmin
      .from('phone_numbers')
      .insert({
        user_id: userId,
        phone_number: phoneData.phone_number,
        twilio_sid: phoneData.sid,
        friendly_name: phoneData.friendly_name,
        capabilities: {
          voice: phoneData.capabilities?.voice || true,
          sms: phoneData.capabilities?.sms || false,
        },
        status: 'active'
      })
      .select()
      .single();
    
    if (phoneNumberError) {
      console.error('Error saving phone number:', phoneNumberError);
      throw new Error(`Failed to save phone number: ${phoneNumberError.message}`);
    }
    
    console.log('Successfully saved phone number to database');
    return phoneNumberData;
  } catch (error) {
    console.error('Error in savePhoneNumber:', error);
    throw error;
  }
}
