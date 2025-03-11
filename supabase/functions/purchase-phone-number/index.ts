
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
}

// Parse request body
async function parseRequestBody(req: Request) {
  let body = {};
  try {
    if (req.body) {
      const bodyText = await req.text();
      if (bodyText) {
        body = JSON.parse(bodyText);
      }
    }
  } catch (e) {
    console.error('Failed to parse request body:', e);
  }
  return body;
}

// Initialize Supabase clients
function initSupabaseClients(authHeader: string | null) {
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
async function authenticateUser(supabase: any) {
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
async function checkExistingPhoneNumber(supabase: any, userId: string) {
  const { data: existingNumbers, error: existingError } = await supabase
    .from('phone_numbers')
    .select('*')
    .eq('user_id', userId);
  
  if (existingNumbers && existingNumbers.length > 0) {
    return existingNumbers[0];
  }
  
  return null;
}

// Get Twilio credentials based on environment
function getTwilioCredentials() {
  const isDevelopment = Deno.env.get('ENVIRONMENT') !== 'production';
  
  return {
    accountSid: isDevelopment 
      ? Deno.env.get('TWILIO_ACCOUNT_SID_TEST')! 
      : Deno.env.get('TWILIO_ACCOUNT_SID_LIVE')!,
    authToken: isDevelopment 
      ? Deno.env.get('TWILIO_AUTH_TOKEN_TEST')! 
      : Deno.env.get('TWILIO_AUTH_TOKEN_LIVE')!
  };
}

// Search for available phone numbers with optional area code
async function searchAvailablePhoneNumbers(credentials: { accountSid: string, authToken: string }, areaCode?: string) {
  const { accountSid, authToken } = credentials;
  
  // Prepare search URL
  let searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?Limit=1&VoiceEnabled=true`;
  
  // Add area code to search if provided
  if (areaCode) {
    searchUrl += `&AreaCode=${areaCode}`;
    console.log(`Searching for phone numbers with area code: ${areaCode}`);
  }
  
  // Search for available phone numbers
  const searchResponse = await fetch(
    searchUrl,
    {
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  
  if (!searchResponse.ok) {
    const searchError = await searchResponse.json();
    console.error('Error searching for phone numbers:', searchError);
    throw new Error('Failed to find available phone numbers');
  }
  
  const searchData = await searchResponse.json();
  
  if (!searchData.available_phone_numbers || searchData.available_phone_numbers.length === 0) {
    throw new Error(areaCode 
      ? `No phone numbers available with area code ${areaCode}` 
      : 'No phone numbers available');
  }
  
  return searchData.available_phone_numbers[0].phone_number;
}

// Purchase a phone number from Twilio
async function purchasePhoneNumber(credentials: { accountSid: string, authToken: string }, 
                                  phoneNumber: string, 
                                  userId: string, 
                                  webhookBaseUrl: string) {
  const { accountSid, authToken } = credentials;
  
  // Purchase the phone number
  const purchaseParams = new URLSearchParams({
    PhoneNumber: phoneNumber,
    FriendlyName: `Campaign Finance - ${userId}`,
    VoiceUrl: `${webhookBaseUrl}/twilio-voice-webhook`,
    VoiceMethod: 'POST',
    StatusCallbackUrl: `${webhookBaseUrl}/twilio-recording-status`,
    StatusCallbackMethod: 'POST',
  });
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/IncomingPhoneNumbers.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: purchaseParams.toString(),
  });
  
  if (!response.ok) {
    const twilioError = await response.json();
    console.error('Error purchasing phone number:', twilioError);
    throw new Error('Failed to purchase phone number');
  }
  
  return await response.json();
}

// Save purchased phone number to database
async function savePhoneNumber(supabaseAdmin: any, userId: string, phoneData: any) {
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

// Create an error response
function createErrorResponse(message: string, status: number = 500) {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

// Create a success response
function createSuccessResponse(data: any) {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Main handler function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body to get the area code if provided
    const body = await parseRequestBody(req);
    const areaCode = body && (body as any).areaCode;
    
    // Get JWT token from the authorization header
    const authHeader = req.headers.get('Authorization');
    
    // Initialize Supabase clients
    const { supabaseAdmin, supabase, supabaseUrl } = initSupabaseClients(authHeader);
    
    // Authenticate user
    let user;
    try {
      user = await authenticateUser(supabase);
    } catch (error) {
      return createErrorResponse(error.message, 401);
    }
    
    // Check if the user already has a phone number
    const existingNumber = await checkExistingPhoneNumber(supabase, user.id);
    if (existingNumber) {
      return createErrorResponse('User already has a phone number', 400);
    }
    
    // Get Twilio credentials
    const credentials = getTwilioCredentials();
    
    // Get base URL for webhook endpoints
    const webhookBaseUrl = Deno.env.get('FUNCTION_BASE_URL') || 
      `https://${supabaseUrl.replace('https://', '')}/functions/v1`;
    
    // Search for available phone numbers
    let phoneNumber;
    try {
      phoneNumber = await searchAvailablePhoneNumbers(credentials, areaCode);
    } catch (error) {
      return createErrorResponse(error.message, 404);
    }
    
    // Purchase the phone number
    let phoneData;
    try {
      phoneData = await purchasePhoneNumber(credentials, phoneNumber, user.id, webhookBaseUrl);
    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
    
    // Save the phone number to our database
    let phoneNumberData;
    try {
      phoneNumberData = await savePhoneNumber(supabaseAdmin, user.id, phoneData);
    } catch (error) {
      return createErrorResponse(error.message, 500);
    }
    
    // Return the purchased phone number
    return createSuccessResponse({ 
      success: true, 
      phoneNumber: phoneNumberData 
    });
    
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return createErrorResponse(error.message);
  }
});
