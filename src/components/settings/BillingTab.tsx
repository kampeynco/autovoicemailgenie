
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { PricingPlans } from "./PricingPlans";

const BillingTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Subscription Plans</h2>
        <PricingPlans />
      </div>

      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Payment Method</h2>
        <Card className="border border-dashed">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <CreditCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium text-[#073127]">Manage your subscription</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your subscription is managed through Stripe
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingTab;
