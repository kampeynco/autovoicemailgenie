
import { supabase } from "@/integrations/supabase/client";
import { PhoneNumber, Call, CallRecording, CallWithRecording } from "@/types/twilio";
import { useAuth } from "@/contexts/AuthContext";

export async function purchasePhoneNumber(): Promise<PhoneNumber> {
  const { data, error } = await supabase.functions.invoke('purchase-phone-number');
  
  if (error) {
    console.error('Error purchasing phone number:', error);
    throw new Error(error.message || 'Failed to purchase phone number');
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
  
  return data;
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
