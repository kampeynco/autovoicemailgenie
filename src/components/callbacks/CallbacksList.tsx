
import React from "react";
import { CallWithRecording } from "@/types/twilio";
import CallCard from "./CallCard";
import EmptyCallbacksList from "./EmptyCallbacksList";

interface CallbacksListProps {
  calls: CallWithRecording[];
}

const CallbacksList: React.FC<CallbacksListProps> = ({ calls }) => {
  if (!calls || calls.length === 0) {
    return <EmptyCallbacksList />;
  }
  
  return (
    <div className="space-y-4">
      {calls.map(call => (
        <CallCard key={call.id} call={call} />
      ))}
    </div>
  );
};

export default CallbacksList;
