
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getUserPhoneNumber, 
  formatPhoneNumber 
} from "@/services/twilioService";
import { Phone, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NoPhoneNumber from "@/components/callbacks/NoPhoneNumber";
import PhoneNumberCard from "@/components/callbacks/PhoneNumberCard";
import { usePhoneNumberPurchase } from "@/hooks/usePhoneNumberPurchase";

const CallbackNumberTab = () => {
  const { isPurchasing, purchasePhoneNumber } = usePhoneNumberPurchase();
  
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
  
  if (isLoadingPhoneNumber) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  if (phoneNumberError) {
    return (
      <div className="p-4 border rounded-md bg-red-50 text-red-600">
        <p>Error loading phone number. Please try again.</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetchPhoneNumber()} 
          className="mt-2"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  // If no phone number exists yet, show purchase UI
  if (!phoneNumber) {
    return <NoPhoneNumber onPurchase={purchasePhoneNumber} isPurchasing={isPurchasing} />;
  }
  
  // If phone number exists, show phone number details
  return (
    <div className="space-y-4">
      <PhoneNumberCard phoneNumber={phoneNumber} />
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Need to change your number?</h3>
        <p className="text-gray-600 mb-4">
          Contact support if you need to change your campaign phone number.
        </p>
        <Button variant="outline" onClick={() => window.location.href="mailto:support@callbackengine.com"}>
          Contact Support
        </Button>
      </div>
    </div>
  );
};

export default CallbackNumberTab;
