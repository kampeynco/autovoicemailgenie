
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
      ? Deno.env.get('TWILIO_ACCOUNT_SID_TEST') 
      : Deno.env.get('TWILIO_ACCOUNT_SID_LIVE');
    const authToken = isDevelopment 
      ? Deno.env.get('TWILIO_AUTH_TOKEN_TEST') 
      : Deno.env.get('TWILIO_AUTH_TOKEN_LIVE');
      
    // Check if credentials exist
    if (!accountSid || !authToken) {
      console.error('Missing Twilio credentials');
      return new Response(
        JSON.stringify({ error: 'Missing API credentials', available: false }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Using Twilio account SID: ${accountSid.substring(0, 5)}...`);
    console.log(`Environment: ${isDevelopment ? 'Development' : 'Production'}`);
    
    // Prepare search parameters using URLSearchParams
    const searchParams = new URLSearchParams({
      Limit: '1',
      VoiceEnabled: 'true',
    });
    
    // Add appropriate search parameter based on search type
    if (type === "areaCode") {
      searchParams.append('AreaCode', code);
      console.log(`Searching for phone numbers with area code: ${code}`);
    } else {
      searchParams.append('InPostalCode', code);
      searchParams.append('Distance', '100'); // Hardcoded distance to 100 miles for postal code searches
      console.log(`Searching for phone numbers with postal code: ${code} (within 100 miles)`);
    }
    
    // Create the full search URL
    const searchUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?${searchParams.toString()}`;
    console.log(`Search URL: ${searchUrl}`);
    
    // Create Authorization header with base64 encoded credentials
    const authHeader = 'Basic ' + btoa(`${accountSid}:${authToken}`);
    console.log(`Auth header created (first 10 chars): ${authHeader.substring(0, 15)}...`);
    
    // Search for available phone numbers
    console.log('Sending request to Twilio API...');
    const searchResponse = await fetch(
      searchUrl,
      {
        headers: {
          'Authorization': authHeader,
        },
      }
    );
    
    console.log(`Twilio API response status: ${searchResponse.status}`);
    
    // Handle API error responses
    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error(`Twilio API error response (${searchResponse.status}): ${errorText}`);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      // Special handling for authentication errors
      if (searchResponse.status === 401 || searchResponse.status === 403) {
        console.error('Authentication failed with Twilio API - check your credentials');
        return new Response(
          JSON.stringify({ 
            error: 'Authentication failed with phone provider API', 
            details: errorData.message || 'Invalid credentials',
            available: false 
          }),
          { 
            status: searchResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      console.error('Error searching for phone numbers:', errorData);
      return new Response(
        JSON.stringify({ 
          error: `Phone provider API error: ${errorData.message || errorData.code || 'Unknown error'}`, 
          available: false 
        }),
        { 
          status: searchResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Parse successful response
    console.log('Successfully received response from Twilio API');
    const searchData = await searchResponse.json();
    const isAvailable = searchData.available_phone_numbers && 
                         searchData.available_phone_numbers.length > 0;
    
    console.log(`Availability check result for ${type} ${code}: ${isAvailable ? 'Available' : 'Not available'}`);
    if (isAvailable) {
      console.log(`Found ${searchData.available_phone_numbers.length} available numbers`);
      console.log(`First available number: ${searchData.available_phone_numbers[0].phone_number}`);
    }
    
    // Return availability result
    return new Response(
      JSON.stringify({ available: isAvailable }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error checking availability:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error', available: false }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
