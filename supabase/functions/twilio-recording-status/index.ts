
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
    // Get request parameters
    const params = new URLSearchParams(await req.text());
    
    // Extract Twilio parameters
    const callSid = params.get('CallSid');
    const recordingSid = params.get('RecordingSid');
    const recordingUrl = params.get('RecordingUrl');
    const recordingDuration = params.get('RecordingDuration');
    const recordingStatus = params.get('RecordingStatus');
    
    console.log(`Recording status update for call ${callSid}: ${recordingStatus}`);
    
    if (!callSid || !recordingSid || !recordingUrl || recordingStatus !== 'completed') {
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Update the call record
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .update({ 
        status: 'completed',
        has_recording: true,
        duration: recordingDuration ? parseInt(recordingDuration) : null
      })
      .eq('call_sid', callSid)
      .select('id, user_id')
      .single();
    
    if (callError || !callData) {
      console.error('Error updating call:', callError);
      return new Response(
        '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
        { headers: { ...corsHeaders, 'Content-Type': 'text/xml' } }
      );
    }
    
    // Create the recording record
    const { data: recordingData, error: recordingError } = await supabase
      .from('call_recordings')
      .insert({
        call_id: callData.id,
        recording_sid: recordingSid,
        recording_url: recordingUrl,
        duration: recordingDuration ? parseInt(recordingDuration) : null
      });
    
    if (recordingError) {
      console.error('Error creating recording record:', recordingError);
    }
    
    // Return empty TwiML response
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
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
