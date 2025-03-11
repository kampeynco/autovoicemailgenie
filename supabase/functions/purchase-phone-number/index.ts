
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body to get the area code if provided
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
      // Continue even if body parsing fails
    }
    
    // Initialize Supabase client with admin rights
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get JWT token from the authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      console.error('No Authorization header found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Extract the JWT token (remove 'Bearer ' prefix if present)
    const token = authHeader.replace('Bearer ', '');
    
    // Initialize Supabase client with the user's JWT token
    const supabase = createClient(supabaseUrl, token);
    
    // Get the user from the JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Error getting user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Check if the user already has a phone number
    const { data: existingNumbers, error: existingError } = await supabase
      .from('phone_numbers')
      .select('*')
      .eq('user_id', user.id);
    
    if (existingNumbers && existingNumbers.length > 0) {
      return new Response(
        JSON.stringify({ error: 'User already has a phone number', phoneNumber: existingNumbers[0] }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Get environment (development or production)
    const isDevelopment = Deno.env.get('ENVIRONMENT') !== 'production';
    
    // Choose the appropriate Twilio credentials based on environment
    const accountSid = isDevelopment 
      ? Deno.env.get('TWILIO_ACCOUNT_SID_TEST')! 
      : Deno.env.get('TWILIO_ACCOUNT_SID_LIVE')!;
    const authToken = isDevelopment 
      ? Deno.env.get('TWILIO_AUTH_TOKEN_TEST')! 
      : Deno.env.get('TWILIO_AUTH_TOKEN_LIVE')!;

    // Get base URL for webhook endpoints
    const webhookBaseUrl = Deno.env.get('FUNCTION_BASE_URL') || 
      `https://${supabaseUrl.replace('https://', '')}/functions/v1`;

    // Extract area code from request body if provided
    const areaCode = body && (body as any).areaCode;
    
    // Prepare search URL for available phone numbers
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
      return new Response(
        JSON.stringify({ error: 'Failed to find available phone numbers' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.available_phone_numbers || searchData.available_phone_numbers.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: areaCode 
            ? `No phone numbers available with area code ${areaCode}` 
            : 'No phone numbers available' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const phoneNumber = searchData.available_phone_numbers[0].phone_number;
    
    // Purchase the phone number
    const purchaseParams = new URLSearchParams({
      PhoneNumber: phoneNumber,
      FriendlyName: `Campaign Finance - ${user.id}`,
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
      return new Response(
        JSON.stringify({ error: 'Failed to purchase phone number' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const phoneData = await response.json();
    
    // Save the phone number to our database
    const { data: phoneNumberData, error: phoneNumberError } = await supabaseAdmin
      .from('phone_numbers')
      .insert({
        user_id: user.id,
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
      return new Response(
        JSON.stringify({ error: 'Failed to save phone number' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Return the purchased phone number
    return new Response(
      JSON.stringify({ 
        success: true, 
        phoneNumber: phoneNumberData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error purchasing phone number:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
