
import React from "react";
import { CallWithRecording } from "@/types/twilio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabContent from "./TabContent";

interface CallbacksTabsProps {
  calls: CallWithRecording[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRefetch: () => void;
}

const CallbacksTabs: React.FC<CallbacksTabsProps> = ({ 
  calls, 
  isLoading, 
  error, 
  onRefetch 
}) => {
  // Filter for calls with recordings that haven't been marked as heard
  // Use optional chaining and fallback for is_heard property since it might be undefined
  const unheardCalls = calls?.filter(call => 
    call.recording && call.is_heard !== true
  ) || [];
  
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[#073127]">Callbacks</h2>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unheard">Unheard</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all">
        <TabContent
          calls={calls}
          isLoading={isLoading}
          error={error}
          onRetry={onRefetch}
          emptyMessage="No callbacks yet"
          emptyDescription="When supporters call your campaign number, their callbacks will appear here."
        />
      </TabsContent>
      
      <TabsContent value="unheard">
        <TabContent
          calls={unheardCalls}
          isLoading={isLoading}
          error={error}
          onRetry={onRefetch}
          emptyMessage="No unheard callbacks"
          emptyDescription="You've listened to all your callbacks. Great job!"
        />
      </TabsContent>
    </Tabs>
  );
};

export default CallbacksTabs;
