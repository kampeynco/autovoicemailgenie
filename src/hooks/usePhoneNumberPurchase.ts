
import { useState } from "react";
import { PhoneNumber } from "@/types/twilio";
import { purchasePhoneNumber } from "@/services/twilioService";
import { toast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type PurchaseError = {
  message: string;
  status?: number;
};

/**
 * Custom hook to handle phone number purchase flow
 */
export function usePhoneNumberPurchase() {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const queryClient = useQueryClient();
  
  /**
   * Purchase a phone number with optional location code
   * @param locationCode Optional area code or zip code for the phone number
   * @param searchType Type of search (areaCode or zipCode)
   * @returns Promise with the purchased phone number
   */
  const handlePurchasePhoneNumber = async (
    locationCode?: string, 
    searchType: string = "areaCode"
  ): Promise<PhoneNumber | null> => {
    setIsPurchasing(true);
    try {
      const newPhoneNumber = await purchasePhoneNumber(locationCode, searchType);
      toast({
        title: "Phone number purchased!",
        description: "You can now receive callbacks.",
      });
      
      // Invalidate the phone number query to refetch data
      queryClient.invalidateQueries({ queryKey: ['phone-number'] });
      
      return newPhoneNumber;
    } catch (error) {
      console.error('Error purchasing phone number:', error);
      const purchaseError = error as PurchaseError;
      toast({
        title: "Failed to purchase phone number",
        description: purchaseError.message || "Please try again later.",
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
