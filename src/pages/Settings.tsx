
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProfileTab from "@/components/settings/ProfileTab";
import CommitteeTab from "@/components/settings/CommitteeTab";
import VoicemailTab from "@/components/settings/VoicemailTab";
import BillingTab from "@/components/settings/BillingTab";
import CallbackNumberTab from "@/components/settings/CallbackNumberTab";

const Settings = () => {
  return (
    <div className="h-full w-full">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#073127] mb-6">Settings</h1>
        
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 w-full justify-start border-b rounded-none pb-0 bg-transparent">
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#004838] rounded-none px-4 py-2 data-[state=active]:shadow-none"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="committee" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#004838] rounded-none px-4 py-2 data-[state=active]:shadow-none"
                >
                  Committee
                </TabsTrigger>
                <TabsTrigger 
                  value="callback-number" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#004838] rounded-none px-4 py-2 data-[state=active]:shadow-none"
                >
                  Callback Number
                </TabsTrigger>
                <TabsTrigger 
                  value="voicemail" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#004838] rounded-none px-4 py-2 data-[state=active]:shadow-none"
                >
                  Voicemail
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#004838] rounded-none px-4 py-2 data-[state=active]:shadow-none"
                >
                  Billing
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="pt-4">
                <ProfileTab />
              </TabsContent>
              
              <TabsContent value="committee" className="pt-4">
                <CommitteeTab />
              </TabsContent>
              
              <TabsContent value="callback-number" className="pt-4">
                <CallbackNumberTab />
              </TabsContent>
              
              <TabsContent value="voicemail" className="pt-4">
                <VoicemailTab />
              </TabsContent>
              
              <TabsContent value="billing" className="pt-4">
                <BillingTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
