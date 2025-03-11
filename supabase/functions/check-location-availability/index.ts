
// Follow Deno's ES modules approach
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("Error parsing request body:", e);
      return new Response(
        JSON.stringify({ error: "Invalid request body", details: e.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log("Request body:", body);

    // Validate input parameters
    const { code, type } = body;
    if (!code) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: code" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!type || (type !== "areaCode" && type !== "zipCode")) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing parameter: type (must be 'areaCode' or 'zipCode')" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Validate input format based on type
    if (type === "areaCode" && !/^\d{3}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: "Area code must be exactly 3 digits" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (type === "zipCode" && !/^\d{5}$/.test(code)) {
      return new Response(
        JSON.stringify({ error: "Zip code must be exactly 5 digits" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get Twilio credentials using the new environment variable names
    const accountSid = Deno.env.get('TWILIO_API_SID');
    const authToken = Deno.env.get('TWILIO_API_SECRET');
    
    console.log(`Using Twilio credentials: SID=${accountSid?.substring(0, 5)}..., Auth token exists: ${!!authToken}`);
      
    // Check if credentials exist
    if (!accountSid || !authToken) {
      console.error("Missing Twilio API credentials");
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          details: "Missing Twilio API credentials"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Prepare search parameters using URLSearchParams
    const searchParams = new URLSearchParams({
      PageSize: "1", // We only need to know if any numbers are available
    });

    // Add appropriate search parameter based on type
    if (type === "areaCode") {
      searchParams.append("AreaCode", code);
    } else {
      searchParams.append("InPostalCode", code);
    }

    const searchParamsString = searchParams.toString();
    console.log(`Search parameters: ${searchParamsString}`);

    // Make request to Twilio API
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/AvailablePhoneNumbers/US/Local.json?${searchParamsString}`;
    
    console.log(`Making request to Twilio API: ${twilioApiUrl}`);
    
    const twilioResponse = await fetch(twilioApiUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        "Content-Type": "application/json",
      },
    });

    // Process Twilio response
    if (!twilioResponse.ok) {
      const errorText = await twilioResponse.text();
      console.error(`Twilio API error (${twilioResponse.status}):`, errorText);
      
      return new Response(
        JSON.stringify({
          error: "Error checking availability with Twilio",
          status: twilioResponse.status,
          details: errorText
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 }
      );
    }

    const twilioData = await twilioResponse.json();
    console.log(`Twilio response status: ${twilioResponse.status}`);
    console.log(`Available phone numbers count: ${twilioData.available_phone_numbers?.length || 0}`);

    // Check if any phone numbers are available
    const available = twilioData.available_phone_numbers && 
                      twilioData.available_phone_numbers.length > 0;

    // Return the result
    return new Response(
      JSON.stringify({ 
        available,
        count: twilioData.available_phone_numbers?.length || 0
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    // Handle any unexpected errors
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
