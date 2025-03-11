
import React from "react";
import { Phone } from "lucide-react";
import { PhoneNumber } from "@/types/twilio";
import { formatPhoneNumber } from "@/services/twilioService";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface PhoneNumberCardProps {
  phoneNumber: PhoneNumber;
}

const PhoneNumberCard: React.FC<PhoneNumberCardProps> = ({ phoneNumber }) => {
  return (
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
  );
};

export default PhoneNumberCard;
