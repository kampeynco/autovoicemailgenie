
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getUserPhoneNumber, 
  getUserCalls, 
  purchasePhoneNumber,
  formatPhoneNumber,
  useRealTimeCallbacks
} from "@/services/twilioService";
import { PhoneNumber, CallWithRecording } from "@/types/twilio";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Phone, 
  PhoneIncoming, 
  Clock, 
  Play, 
  Pause, 
  Calendar, 
  FileText,
  Loader2
} from "lucide-react";
import CallbacksList from "@/components/callbacks/CallbacksList";
import NoPhoneNumber from "@/components/callbacks/NoPhoneNumber";

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
    data: calls = [], // Provide default empty array
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
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-600">
            {phoneNumberError instanceof Error 
              ? phoneNumberError.message 
              : "Failed to load phone number"}
          </p>
          <Button onClick={() => refetchPhoneNumber()} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // If still loading phone number, show loading state
  if (isLoadingPhoneNumber) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#004838]" />
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
        {phoneNumber && (
          <Card>
            <CardHeader>
              <CardTitle>Your Campaign Phone Number</CardTitle>
              <CardDescription>
                Supporters will call this number to leave callbacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-2xl font-semibold text-[#004838]">
                <Phone className="h-5 w-5" />
                {formatPhoneNumber(phoneNumber.phone_number)}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Callbacks Tabs */}
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-[#073127]">Callbacks</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unheard">Unheard</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all">
            {isLoadingCalls ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#004838]" />
              </div>
            ) : callsError ? (
              <div className="bg-red-50 p-4 rounded-md">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-600">{callsError instanceof Error ? callsError.message : "Failed to load callbacks"}</p>
                <Button onClick={() => refetchCalls()} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : calls && calls.length > 0 ? (
              <CallbacksList calls={calls} />
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <PhoneIncoming className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No callbacks yet</h3>
                <p className="mt-2 text-gray-500">
                  When supporters call your campaign number, their callbacks will appear here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unheard">
            {isLoadingCalls ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#004838]" />
              </div>
            ) : calls && calls.filter(call => call.has_recording).length > 0 ? (
              <CallbacksList 
                calls={calls.filter(call => call.has_recording)} 
              />
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                <PhoneIncoming className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No unheard callbacks</h3>
                <p className="mt-2 text-gray-500">
                  You've listened to all your callbacks. Great job!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Callbacks;
