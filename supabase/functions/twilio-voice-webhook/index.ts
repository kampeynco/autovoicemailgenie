
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TwiML helper function
function generateTwiML(voicemailUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for your call. Please leave a message after the tone.</Say>
  <Play>${voicemailUrl}</Play>
  <Record 
    action="/twilio-recording-status" 
    method="POST" 
    maxLength="120" 
    playBeep="true" 
    trim="trim-silence"
    transcribe="true" 
    transcribeCallback="/twilio-transcription-webhook" />
  <Say>No message recorded. Goodbye.</Say>
</Response>`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request parameters
    const url = new URL(req.url);
    const params = new URLSearchParams(await req.text());
    
    // Extract Twilio parameters
    const callSid = params.get('CallSid');
    const from = params.get('From');
    const to = params.get('To');
    
    if (!callSid || !from || !to) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Incoming call from ${from} to ${to} with SID ${callSid}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Lookup the phone number in our database
    const { data: phoneNumberData, error: phoneNumberError } = await supabase
      .from('phone_numbers')
      .select('id, user_id')
      .eq('phone_number', to)
      .single();
    
    if (phoneNumberError || !phoneNumberData) {
      console.error('Phone number not found:', phoneNumberError);
      return new Response(
        generateTwiML(''),
        { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
      );
    }
    
    // Get the user's voicemail
    const { data: voicemailData, error: voicemailError } = await supabase
      .from('voicemails')
      .select('file_path')
      .eq('user_id', phoneNumberData.user_id)
      .single();
    
    const voicemailUrl = voicemailData?.file_path || '';
    
    // Log the incoming call in our database
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert({
        user_id: phoneNumberData.user_id,
        phone_number_id: phoneNumberData.id,
        caller_number: from,
        call_sid: callSid,
        status: 'in-progress'
      })
      .select()
      .single();
      
    if (callError) {
      console.error('Error logging call:', callError);
    } else {
      console.log('Call logged successfully:', callData.id);
    }
    
    // Return TwiML response
    return new Response(
      generateTwiML(voicemailUrl),
      { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
    );
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
