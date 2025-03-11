
import React from "react";
import { CallWithRecording } from "@/types/twilio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CallbacksList from "@/components/callbacks/CallbacksList";
import EmptyCallbacksList from "@/components/callbacks/EmptyCallbacksList";
import CallbacksLoading from "@/components/callbacks/CallbacksLoading";
import CallbacksError from "@/components/callbacks/CallbacksError";

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
  const unheardCalls = calls?.filter(call => call.has_recording) || [];
  
  const renderTabContent = (
    tabCalls: CallWithRecording[] | undefined,
    emptyMessage: string,
    emptyDescription: string
  ) => {
    if (isLoading) {
      return <CallbacksLoading />;
    }

    if (error) {
      return <CallbacksError error={error} onRetry={onRefetch} />;
    }

    if (!tabCalls || tabCalls.length === 0) {
      return (
        <EmptyCallbacksList 
          message={emptyMessage}
          description={emptyDescription}
        />
      );
    }

    return <CallbacksList calls={tabCalls} />;
  };

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
        {renderTabContent(
          calls,
          "No callbacks yet",
          "When supporters call your campaign number, their callbacks will appear here."
        )}
      </TabsContent>
      
      <TabsContent value="unheard">
        {renderTabContent(
          unheardCalls,
          "No unheard callbacks",
          "You've listened to all your callbacks. Great job!"
        )}
      </TabsContent>
    </Tabs>
  );
};

export default CallbacksTabs;
