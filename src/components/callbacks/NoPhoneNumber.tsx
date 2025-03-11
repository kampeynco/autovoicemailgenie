
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Check, X, Loader2 } from "lucide-react";
import { PhoneNumber } from "@/types/twilio";
import { checkAreaCodeAvailability } from "@/services/twilioService";

interface NoPhoneNumberProps {
  onPurchase: (areaCode?: string) => Promise<PhoneNumber | null>;
  isPurchasing: boolean;
}

const NoPhoneNumber: React.FC<NoPhoneNumberProps> = ({ 
  onPurchase, 
  isPurchasing 
}) => {
  const [areaCode, setAreaCode] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setAreaCode(value);
    
    if (value.length === 3) {
      checkAvailability(value);
    } else {
      setIsAvailable(null);
    }
  };
  
  const checkAvailability = async (code: string) => {
    if (!code || code.length !== 3) return;
    
    setIsChecking(true);
    setIsAvailable(null);
    
    try {
      const available = await checkAreaCodeAvailability(code);
      setIsAvailable(available);
    } catch (error) {
      console.error("Error checking availability:", error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };
  
  const handlePurchase = () => {
    onPurchase(areaCode);
  };
  
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-[#E3F1ED] p-2 rounded-full">
            <Phone className="h-5 w-5 text-[#004838]" />
          </div>
          <CardTitle>Get Your Campaign Phone Number</CardTitle>
        </div>
        <CardDescription>
          You'll need a phone number to receive callbacks from supporters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-700 mb-2">Enter your preferred area code:</p>
            <Input
              type="text"
              value={areaCode}
              onChange={handleAreaCodeChange}
              className="w-full md:w-[200px]"
              placeholder="e.g. 415"
              maxLength={3}
            />
          </div>
          
          {/* Availability indicator */}
          {areaCode && areaCode.length === 3 && (
            <div className="flex items-center space-x-2">
              {isChecking ? (
                <div className="flex items-center text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking availability...
                </div>
              ) : isAvailable === true ? (
                <div className="flex items-center text-sm text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  Area code {areaCode} is available
                </div>
              ) : isAvailable === false ? (
                <div className="flex items-center text-sm text-red-600">
                  <X className="h-4 w-4 mr-2" />
                  Area code {areaCode} is not available
                </div>
              ) : null}
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-700">
              We'll try to find a number with your preferred area code, but if none are
              available, we'll assign you a number from a nearby area.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePurchase} 
          disabled={isPurchasing || (isAvailable === false && areaCode.length === 3)}
          className="w-full"
        >
          {isPurchasing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Purchasing...
            </>
          ) : (
            "Get Phone Number"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoPhoneNumber;
