
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

const BillingTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Current Plan</h2>
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-[#073127]">Free Tier</h3>
                <p className="text-sm text-gray-500">Basic campaign finance features</p>
              </div>
              <Button variant="outline">Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Payment Method</h2>
        <Card className="border border-dashed">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <CreditCard className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium text-[#073127]">No payment method</h3>
              <p className="text-sm text-gray-500 mb-4">Add a payment method to upgrade your plan</p>
              <Button variant="outline">Add Payment Method</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Billing Information</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="billingName">Name</Label>
            <Input id="billingName" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingEmail">Email</Label>
            <Input id="billingEmail" type="email" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="billingAddress">Address</Label>
            <Input id="billingAddress" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCity">City</Label>
            <Input id="billingCity" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingState">State</Label>
            <Input id="billingState" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingZip">Zip Code</Label>
            <Input id="billingZip" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingCountry">Country</Label>
            <Input id="billingCountry" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#004838] hover:bg-[#003026]">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default BillingTab;
