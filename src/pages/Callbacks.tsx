
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getUserPhoneNumber, 
  getUserCalls, 
  purchasePhoneNumber,
  formatPhoneNumber,
  useRealTimeCallbacks
} from "@/services/twilioService";
import { toast } from "@/components/ui/use-toast";
import NoPhoneNumber from "@/components/callbacks/NoPhoneNumber";
import PhoneNumberCard from "@/components/callbacks/PhoneNumberCard";
import CallbacksTabs from "@/components/callbacks/CallbacksTabs";
import CallbacksLoading from "@/components/callbacks/CallbacksLoading";
import CallbacksError from "@/components/callbacks/CallbacksError";

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
  
  // State for purchasing a phone number
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Handle phone number purchase
  const handlePurchasePhoneNumber = async (areaCode?: string) => {
    setIsPurchasing(true);
    try {
      await purchasePhoneNumber(areaCode);
      toast({
        title: "Phone number purchased!",
        description: "You can now receive callbacks.",
      });
      await refetchPhoneNumber();
    } catch (error: any) {
      console.error('Error purchasing phone number:', error);
      toast({
        title: "Failed to purchase phone number",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
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
  
  // If there's no phone number yet
  if (!phoneNumber) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoPhoneNumber 
          onPurchase={handlePurchasePhoneNumber} 
          isPurchasing={isPurchasing} 
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Phone Number Card */}
        <PhoneNumberCard phoneNumber={phoneNumber} />
        
        {/* Callbacks Tabs */}
        <CallbacksTabs
          calls={calls}
          isLoading={isLoadingCalls}
          error={callsError}
          onRefetch={refetchCalls}
        />
      </div>
    </div>
  );
};

export default Callbacks;
