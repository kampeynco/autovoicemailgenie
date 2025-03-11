
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const CommitteeTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Committee Information</h2>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="committeeName">Committee Name</Label>
            <Input id="committeeName" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="committeeId">Committee ID</Label>
            <Input id="committeeId" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="committeeDescription">Description</Label>
            <Textarea id="committeeDescription" rows={4} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-[#073127] mb-4">Address</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="street">Street</Label>
            <Input id="street" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input id="zipCode" />
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

export default CommitteeTab;
