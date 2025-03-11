
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Phone } from "lucide-react";
import { PhoneNumber } from "@/types/twilio";

interface NoPhoneNumberProps {
  onPurchase: (areaCode?: string) => Promise<PhoneNumber | null>;
  isPurchasing: boolean;
}

const NoPhoneNumber: React.FC<NoPhoneNumberProps> = ({ 
  onPurchase, 
  isPurchasing 
}) => {
  const [selectedAreaCode, setSelectedAreaCode] = useState<string>("415");
  
  const handleAreaCodeChange = (value: string) => {
    setSelectedAreaCode(value);
  };
  
  const handlePurchase = () => {
    onPurchase(selectedAreaCode);
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
            <p className="text-sm text-gray-700 mb-2">Choose an area code (optional)</p>
            <Select 
              value={selectedAreaCode} 
              onValueChange={handleAreaCodeChange}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select area code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="415">San Francisco (415)</SelectItem>
                <SelectItem value="212">New York (212)</SelectItem>
                <SelectItem value="202">Washington DC (202)</SelectItem>
                <SelectItem value="213">Los Angeles (213)</SelectItem>
                <SelectItem value="312">Chicago (312)</SelectItem>
                <SelectItem value="617">Boston (617)</SelectItem>
                <SelectItem value="512">Austin (512)</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          disabled={isPurchasing}
          className="w-full"
        >
          {isPurchasing ? "Purchasing..." : "Get Phone Number"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoPhoneNumber;
