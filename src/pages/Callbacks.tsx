
import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  getUserPhoneNumber, 
  getUserCalls, 
  formatPhoneNumber,
  useRealTimeCallbacks
} from "@/services/twilioService";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import CallbacksTabs from "@/components/callbacks/CallbacksTabs";
import CallbacksLoading from "@/components/callbacks/CallbacksLoading";
import CallbacksError from "@/components/callbacks/CallbacksError";
import { CallWithRecording } from "@/types/twilio";

const Callbacks: React.FC = () => {
  const queryClient = useQueryClient();
  const { subscribeToCallbacks } = useRealTimeCallbacks();
  
  // Fetch phone number
  const { 
    data: phoneNumber, 
    isLoading: isLoadingPhoneNumber,
    error: phoneNumberError,
    refetch: refetchPhoneNumber
  } = useQuery({
    queryKey: ['phone-number'],
    queryFn: getUserPhoneNumber
  });
  
  // Fetch calls if phone number exists
  const { 
    data: calls = [], 
    isLoading: isLoadingCalls,
    error: callsError,
    refetch: refetchCalls
  } = useQuery({
    queryKey: ['calls'],
    queryFn: () => getUserCalls(50),
    enabled: !!phoneNumber,
  });
  
  // Set up real-time subscription
  useEffect(() => {
    if (!phoneNumber) return;
    
    const unsubscribe = subscribeToCallbacks((newCall) => {
      queryClient.setQueryData(['calls'], (oldData: CallWithRecording[] = []) => {
        return [newCall, ...oldData];
      });
      
      toast({
        title: "New callback received!",
        description: `From ${formatPhoneNumber(newCall.caller_number)}`,
      });
    });
    
    return () => {
      unsubscribe();
    };
  }, [phoneNumber, queryClient, subscribeToCallbacks]);
  
  // If there's an error fetching the phone number
  if (phoneNumberError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <CallbacksError 
          error={phoneNumberError} 
          onRetry={refetchPhoneNumber} 
        />
      </div>
    );
  }
  
  // If still loading phone number, show loading state
  if (isLoadingPhoneNumber) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <CallbacksLoading />
      </div>
    );
  }
  
  // If there's no phone number yet, direct to settings
  if (!phoneNumber) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-semibold text-[#073127] mb-4">Set Up Your Callback Number</h2>
          <p className="text-gray-600 mb-6">
            You need a campaign phone number to receive callbacks. Please set up your callback number in settings.
          </p>
          <Link to="/settings">
            <Button className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Go to Settings
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Show loading state when fetching calls */}
        {isLoadingCalls ? (
          <CallbacksLoading />
        ) : (
          /* Callbacks Tabs */
          <CallbacksTabs
            calls={calls}
            isLoading={isLoadingCalls}
            error={callsError}
            onRefetch={refetchCalls}
          />
        )}
      </div>
    </div>
  );
};

export default Callbacks;
