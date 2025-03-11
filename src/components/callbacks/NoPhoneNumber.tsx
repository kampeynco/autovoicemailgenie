
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, PhoneIncoming } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common US area codes
const POPULAR_AREA_CODES = [
  { code: "212", location: "New York, NY" },
  { code: "213", location: "Los Angeles, CA" },
  { code: "312", location: "Chicago, IL" },
  { code: "202", location: "Washington, DC" },
  { code: "305", location: "Miami, FL" },
  { code: "415", location: "San Francisco, CA" },
  { code: "617", location: "Boston, MA" },
  { code: "702", location: "Las Vegas, NV" },
  { code: "713", location: "Houston, TX" },
  { code: "404", location: "Atlanta, GA" },
];

interface NoPhoneNumberProps {
  onPurchase: (areaCode?: string) => void;
  isPurchasing: boolean;
}

const NoPhoneNumber: React.FC<NoPhoneNumberProps> = ({ 
  onPurchase, 
  isPurchasing 
}) => {
  const [areaCode, setAreaCode] = useState<string>("");
  const [customAreaCode, setCustomAreaCode] = useState<string>("");
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const handlePurchase = () => {
    if (useCustom && customAreaCode) {
      // Validate custom area code (3 digits, numbers only)
      const isValid = /^\d{3}$/.test(customAreaCode);
      if (isValid) {
        onPurchase(customAreaCode);
      } else {
        alert("Please enter a valid 3-digit area code");
      }
    } else if (areaCode) {
      onPurchase(areaCode);
    } else {
      // If no area code is selected, proceed with random number
      onPurchase();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-[#004838]" />
            <CardTitle>Set Up Your Campaign Phone</CardTitle>
          </div>
          <CardDescription>
            You need a dedicated phone number to receive callbacks from your supporters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-[#E3F1ED] p-4 rounded-lg">
              <h3 className="text-[#004838] font-medium mb-2">How It Works</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="bg-[#004838] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                  <span>We'll assign you a dedicated U.S. phone number for your campaign</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#004838] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                  <span>Your custom voicemail greeting will play when supporters call</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-[#004838] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                  <span>Their messages will appear in your Callbacks dashboard</span>
                </li>
              </ul>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <PhoneIncoming className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Receive callbacks 24/7</h3>
                  <p className="text-gray-600 mt-1">
                    Never miss a call from a potential donor. Your campaign phone will automatically record messages when you can't answer.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Choose Your Phone Number</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      checked={!useCustom}
                      onChange={() => setUseCustom(false)}
                      className="h-4 w-4 text-[#004838]"
                    />
                    <span>Select a popular area code</span>
                  </label>
                  
                  <Select
                    disabled={useCustom || isPurchasing}
                    value={areaCode}
                    onValueChange={setAreaCode}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an area code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Random area code</SelectItem>
                      {POPULAR_AREA_CODES.map((option) => (
                        <SelectItem key={option.code} value={option.code}>
                          {option.code} - {option.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 mb-2">
                    <input
                      type="radio"
                      checked={useCustom}
                      onChange={() => setUseCustom(true)}
                      className="h-4 w-4 text-[#004838]"
                    />
                    <span>Enter a specific area code</span>
                  </label>
                  
                  <Input
                    type="text"
                    maxLength={3}
                    placeholder="Enter 3-digit area code"
                    value={customAreaCode}
                    onChange={(e) => {
                      // Allow only digits
                      const value = e.target.value.replace(/\D/g, '');
                      setCustomAreaCode(value);
                    }}
                    disabled={!useCustom || isPurchasing}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Note: Number availability may vary by area code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handlePurchase} 
            disabled={isPurchasing}
            className="w-full bg-[#004838] hover:bg-[#003026] h-12"
          >
            {isPurchasing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Setting up your phone number...
              </>
            ) : (
              "Get Your Campaign Phone Number"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoPhoneNumber;
