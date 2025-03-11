
import React from "react";
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

interface NoPhoneNumberProps {
  onPurchase: () => void;
  isPurchasing: boolean;
}

const NoPhoneNumber: React.FC<NoPhoneNumberProps> = ({ 
  onPurchase, 
  isPurchasing 
}) => {
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
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onPurchase} 
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
