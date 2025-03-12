
import React from "react";
import { CallWithRecording } from "@/types/twilio";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabContent from "./TabContent";
import { List, PhoneIncoming, Voicemail } from "lucide-react";

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
  // Filter for calls (inbound calls - answered and missed)
  const callbackCalls = calls?.filter(call => 
    !call.recording?.transcription // Calls without transcription are regular callbacks
  ) || [];
  
  // Filter for voicemails (calls with transcription)
  const voicemailCalls = calls?.filter(call => 
    call.recording?.transcription // Calls with transcription are voicemails
  ) || [];
  
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-[#073127]">Callbacks</h2>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <List className="h-4 w-4" />
            <span>All</span>
          </TabsTrigger>
          <TabsTrigger value="callbacks" className="flex items-center gap-1">
            <PhoneIncoming className="h-4 w-4" />
            <span>Callbacks</span>
          </TabsTrigger>
          <TabsTrigger value="voicemails" className="flex items-center gap-1">
            <Voicemail className="h-4 w-4" />
            <span>Voicemails</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="all">
        <TabContent
          calls={calls}
          isLoading={isLoading}
          error={error}
          onRetry={onRefetch}
          emptyMessage="No callbacks or voicemails yet"
          emptyDescription="When supporters call your campaign number, their callbacks and voicemails will appear here."
        />
      </TabsContent>
      
      <TabsContent value="callbacks">
        <TabContent
          calls={callbackCalls}
          isLoading={isLoading}
          error={error}
          onRetry={onRefetch}
          emptyMessage="No callbacks yet"
          emptyDescription="When supporters call your campaign number, their inbound calls will appear here."
        />
      </TabsContent>
      
      <TabsContent value="voicemails">
        <TabContent
          calls={voicemailCalls}
          isLoading={isLoading}
          error={error}
          onRetry={onRefetch}
          emptyMessage="No voicemails yet"
          emptyDescription="When supporters leave voicemail messages, they will appear here."
        />
      </TabsContent>
    </Tabs>
  );
};

export default CallbacksTabs;
