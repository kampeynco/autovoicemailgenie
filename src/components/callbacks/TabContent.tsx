
import React from "react";
import { CallWithRecording } from "@/types/twilio";
import CallbacksList from "./CallbacksList";
import EmptyCallbacksList from "./EmptyCallbacksList";
import CallbacksLoading from "./CallbacksLoading";
import CallbacksError from "./CallbacksError";

interface TabContentProps {
  calls: CallWithRecording[] | undefined;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  emptyMessage: string;
  emptyDescription: string;
}

const TabContent: React.FC<TabContentProps> = ({
  calls,
  isLoading,
  error,
  onRetry,
  emptyMessage,
  emptyDescription,
}) => {
  if (isLoading) {
    return <CallbacksLoading />;
  }

  if (error) {
    return <CallbacksError error={error} onRetry={onRetry} />;
  }

  if (!calls || calls.length === 0) {
    return (
      <EmptyCallbacksList 
        message={emptyMessage}
        description={emptyDescription}
      />
    );
  }

  return <CallbacksList calls={calls} />;
};

export default TabContent;
