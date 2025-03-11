
import { useState } from "react";
import { PhoneNumber } from "@/types/twilio";
import { purchasePhoneNumber } from "@/services/twilioService";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Custom hook to handle phone number purchase flow
 */
export function usePhoneNumberPurchase() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const queryClient = useQueryClient();
  
  /**
   * Purchase a phone number with optional area code
   * @param areaCode Optional area code for the phone number
   * @returns Promise with the purchased phone number
   */
  const handlePurchasePhoneNumber = async (areaCode?: string): Promise<PhoneNumber | null> => {
    setIsPurchasing(true);
    try {
      const newPhoneNumber = await purchasePhoneNumber(areaCode);
      toast({
        title: "Phone number purchased!",
        description: "You can now receive callbacks.",
      });
      
      // Invalidate the phone number query to refetch data
      queryClient.invalidateQueries({ queryKey: ['phone-number'] });
      
      return newPhoneNumber;
    } catch (error: any) {
      console.error('Error purchasing phone number:', error);
      toast({
        title: "Failed to purchase phone number",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    isPurchasing,
    purchasePhoneNumber: handlePurchasePhoneNumber
  };
}
