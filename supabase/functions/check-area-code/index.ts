
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body to get the area code
    const requestBody = await req.json();
    const areaCode = requestBody.areaCode;
    
    if (!areaCode || typeof areaCode !== 'string' || areaCode.length !== 3) {
      return new Response(
        JSON.stringify({ error: 'Invalid area code format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Get Twilio credentials based on environment
    const isDevelopment = Deno.env.get('ENVIRONMENT') !== 'production';
    const accountSid = isDevelopment 
      ? Deno.env.get('TWILIO_ACCOUNT_SID_TEST')! 
      : Deno.env.get('TWILIO_ACCOUNT_SID_LIVE')!;
    const authToken = isDevelopment 
      ? Deno.env.get('TWILIO_AUTH_TOKEN_TEST')! 
      : Deno.env.get('TWILIO_AUTH_TOKEN_LIVE')!;
    
    // Prepare search URL
    const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?AreaCode=${areaCode}&Limit=1&VoiceEnabled=true`;
    
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
        JSON.stringify({ error: 'Failed to check area code availability', available: false }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    const searchData = await searchResponse.json();
    const isAvailable = searchData.available_phone_numbers && 
                         searchData.available_phone_numbers.length > 0;
    
    // Return availability result
    return new Response(
      JSON.stringify({ available: isAvailable }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error checking area code availability:', error);
    return new Response(
      JSON.stringify({ error: error.message, available: false }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
