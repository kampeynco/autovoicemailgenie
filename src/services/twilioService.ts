
import { supabase } from "@/integrations/supabase/client";
import { PhoneNumber, Call, CallRecording, CallWithRecording } from "@/types/twilio";
import { useAuth } from "@/contexts/AuthContext";

export async function checkLocationAvailability(code: string, type: "areaCode" | "zipCode"): Promise<boolean> {
  try {
    console.log(`Checking availability for ${type} ${code}`);
    const { data, error } = await supabase.functions.invoke('check-location-availability', {
      method: 'POST',
      body: { 
        code,
        type 
      },
    });
    
    if (error) {
      console.error(`Error checking ${type} availability:`, error);
      return false;
    }
    
    console.log('Availability response:', data);
    return data.available;
  } catch (error) {
    console.error(`Error checking ${type} availability:`, error);
    return false;
  }
}

export async function purchasePhoneNumber(locationCode?: string, searchType?: string): Promise<PhoneNumber> {
  // Ensure locationCode is not empty if provided
  const validLocationCode = locationCode && locationCode.trim() !== '' ? locationCode.trim() : undefined;
  
  // Build request body based on search type
  const requestBody: Record<string, any> = {};
  if (validLocationCode) {
    if (searchType === "areaCode") {
      requestBody.areaCode = validLocationCode;
    } else if (searchType === "zipCode") {
      requestBody.zipCode = validLocationCode;
    }
  }
  
  // Call the edge function with authentication and optional parameters
  const { data, error } = await supabase.functions.invoke('purchase-phone-number', {
    method: 'POST',
    body: requestBody,
  });
  
  if (error) {
    console.error('Error purchasing phone number:', error);
    throw new Error(error.message || 'Failed to purchase phone number');
  }
  
  if (!data || !data.phoneNumber) {
    console.error('Invalid response from purchase-phone-number function:', data);
    throw new Error('Failed to purchase phone number: Invalid response from server');
  }
  
  return data.phoneNumber;
}

export async function getUserPhoneNumber(): Promise<PhoneNumber | null> {
  const { data, error } = await supabase
    .from('phone_numbers')
    .select('*')
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No phone number found
      return null;
    }
    console.error('Error getting phone number:', error);
    throw new Error(error.message);
  }
  
  // Transform the data to match the PhoneNumber interface
  // Create a default capabilities object
  let capabilitiesObj = { voice: true, sms: false };
  
  // Check if capabilities exists and is an object (not an array or primitive)
  if (data.capabilities && 
      typeof data.capabilities === 'object' && 
      !Array.isArray(data.capabilities)) {
    // Now TypeScript knows this is an object with string keys
    const capObj = data.capabilities as Record<string, unknown>;
    capabilitiesObj = {
      voice: typeof capObj.voice === 'boolean' ? capObj.voice : Boolean(capObj.voice),
      sms: typeof capObj.sms === 'boolean' ? capObj.sms : Boolean(capObj.sms)
    };
  }
  
  const phoneNumber: PhoneNumber = {
    id: data.id,
    user_id: data.user_id,
    phone_number: data.phone_number,
    twilio_sid: data.twilio_sid,
    friendly_name: data.friendly_name || undefined,
    status: data.status,
    capabilities: capabilitiesObj,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
  
  return phoneNumber;
}

export async function getUserCalls(limit: number = 10, offset: number = 0): Promise<CallWithRecording[]> {
  const { data, error } = await supabase
    .from('calls')
    .select(`
      *,
      call_recordings (*)
    `)
    .order('call_time', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error getting calls:', error);
    throw new Error(error.message);
  }
  
  // Transform the data to match the CallWithRecording interface
  return data.map((call: any) => ({
    ...call,
    recording: call.call_recordings.length > 0 ? call.call_recordings[0] : undefined
  }));
}

export function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';
  
  // Format: +1 (555) 123-4567
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  
  return phoneNumber;
}

export function useRealTimeCallbacks() {
  const { user } = useAuth();
  
  const subscribeToCallbacks = (onNewCallback: (call: CallWithRecording) => void) => {
    if (!user) return () => {};
    
    const channel = supabase
      .channel('public:calls')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          // Fetch the full call with recording
          try {
            const { data, error } = await supabase
              .from('calls')
              .select(`
                *,
                call_recordings (*)
              `)
              .eq('id', payload.new.id)
              .single();
              
            if (error) {
              console.error('Error fetching new call:', error);
              return;
            }
            
            // Transform the data to match the CallWithRecording interface
            const callWithRecording: CallWithRecording = {
              ...data,
              recording: data.call_recordings.length > 0 ? data.call_recordings[0] : undefined
            };
            
            onNewCallback(callWithRecording);
          } catch (error) {
            console.error('Error processing new call notification:', error);
          }
        }
      )
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  };
  
  return {
    subscribeToCallbacks
  };
}
