
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
import { Phone, Check, X, Loader2, MapPin, Search } from "lucide-react";
import { PhoneNumber } from "@/types/twilio";
import { checkLocationAvailability } from "@/services/twilioService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NoPhoneNumberProps {
  onPurchase: (locationCode?: string, searchType?: string) => Promise<PhoneNumber | null>;
  isPurchasing: boolean;
}

const NoPhoneNumber: React.FC<NoPhoneNumberProps> = ({ 
  onPurchase, 
  isPurchasing 
}) => {
  const [areaCode, setAreaCode] = useState<string>("");
  const [zipCode, setZipCode] = useState<string>("");
  const [searchType, setSearchType] = useState<"areaCode" | "zipCode">("areaCode");
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const handleAreaCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setAreaCode(value);
    
    if (value.length === 3) {
      checkAvailability(value, "areaCode");
    } else {
      setIsAvailable(null);
    }
  };
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
    setZipCode(value);
    
    if (value.length === 5) {
      checkAvailability(value, "zipCode");
    } else {
      setIsAvailable(null);
    }
  };
  
  const checkAvailability = async (code: string, type: "areaCode" | "zipCode") => {
    if (!code) return;
    if (type === "areaCode" && code.length !== 3) return;
    if (type === "zipCode" && code.length !== 5) return;
    
    setIsChecking(true);
    setIsAvailable(null);
    
    try {
      const available = await checkLocationAvailability(code, type);
      setIsAvailable(available);
    } catch (error) {
      console.error(`Error checking ${type} availability:`, error);
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };
  
  const handlePurchase = () => {
    if (searchType === "areaCode") {
      onPurchase(areaCode, "areaCode");
    } else {
      onPurchase(zipCode, "zipCode");
    }
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
        <Tabs defaultValue="areaCode" onValueChange={(value) => setSearchType(value as "areaCode" | "zipCode")}>
          <TabsList className="mb-4">
            <TabsTrigger value="areaCode" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Area Code
            </TabsTrigger>
            <TabsTrigger value="zipCode" className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Zip Code
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="areaCode" className="space-y-4">
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
            
            {/* Area code availability indicator */}
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
          </TabsContent>
          
          <TabsContent value="zipCode" className="space-y-4">
            <div>
              <p className="text-sm text-gray-700 mb-2">Enter your zip code:</p>
              <Input
                type="text"
                value={zipCode}
                onChange={handleZipCodeChange}
                className="w-full md:w-[200px]"
                placeholder="e.g. 94103"
                maxLength={5}
              />
            </div>
            
            {/* Zip code availability indicator */}
            {zipCode && zipCode.length === 5 && (
              <div className="flex items-center space-x-2">
                {isChecking ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Checking availability...
                  </div>
                ) : isAvailable === true ? (
                  <div className="flex items-center text-sm text-green-600">
                    <Check className="h-4 w-4 mr-2" />
                    Phone numbers available for zip code {zipCode}
                  </div>
                ) : isAvailable === false ? (
                  <div className="flex items-center text-sm text-red-600">
                    <X className="h-4 w-4 mr-2" />
                    No phone numbers available for zip code {zipCode}
                  </div>
                ) : null}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4">
          <p className="text-sm text-gray-700">
            We'll try to find a number with your preferred {searchType === "areaCode" ? "area code" : "zip code"}, but if none are
            available, we'll assign you a number from a nearby area.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePurchase} 
          disabled={isPurchasing || 
            (isAvailable === false) || 
            (searchType === "areaCode" && (!areaCode || areaCode.length !== 3)) ||
            (searchType === "zipCode" && (!zipCode || zipCode.length !== 5))
          }
          className="w-full"
        >
          {isPurchasing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Purchasing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Get Phone Number
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoPhoneNumber;
