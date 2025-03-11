
import React from "react";
import { PhoneIncoming } from "lucide-react";

interface EmptyCallbacksListProps {
  message?: string;
  description?: string;
}

const EmptyCallbacksList: React.FC<EmptyCallbacksListProps> = ({ 
  message = "No callbacks found",
  description = "When supporters call your campaign number, their callbacks will appear here."
}) => {
  return (
    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
      <PhoneIncoming className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">{message}</h3>
      <p className="mt-2 text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default EmptyCallbacksList;
