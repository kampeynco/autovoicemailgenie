
import React from "react";
import { Button } from "@/components/ui/button";

interface CallbacksErrorProps {
  error: Error | unknown;
  onRetry: () => void;
}

const CallbacksError: React.FC<CallbacksErrorProps> = ({ error, onRetry }) => {
  const errorMessage = error instanceof Error 
    ? error.message 
    : "An unexpected error occurred";

  return (
    <div className="bg-red-50 p-4 rounded-md">
      <h3 className="text-red-800 font-medium">Error</h3>
      <p className="text-red-600">{errorMessage}</p>
      <Button onClick={onRetry} className="mt-2">
        Try Again
      </Button>
    </div>
  );
};

export default CallbacksError;
