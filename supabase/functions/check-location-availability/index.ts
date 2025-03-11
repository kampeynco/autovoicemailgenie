
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
    // Parse request body to get the location code and type
    const requestBody = await req.json();
    const code = requestBody.code;
    const type = requestBody.type || "areaCode"; // Default to area code if not specified
    
    // Validate the input parameters
    if (!code || typeof code !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid code format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (type === "areaCode" && code.length !== 3) {
      return new Response(
        JSON.stringify({ error: 'Area code must be 3 digits' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (type === "zipCode" && code.length !== 5) {
      return new Response(
        JSON.stringify({ error: 'Zip code must be 5 digits' }),
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
    
    // Prepare search URL based on search type
    let searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?Limit=1&VoiceEnabled=true`;
    
    if (type === "areaCode") {
      searchUrl += `&AreaCode=${code}`;
      console.log(`Searching for phone numbers with area code: ${code}`);
    } else {
      searchUrl += `&InPostalCode=${code}`;
      console.log(`Searching for phone numbers with postal code: ${code}`);
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
        JSON.stringify({ error: 'Failed to check availability', available: false }),
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
    console.error('Error checking availability:', error);
    return new Response(
      JSON.stringify({ error: error.message, available: false }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
