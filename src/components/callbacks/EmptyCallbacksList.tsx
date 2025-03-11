
import React from "react";
import { PhoneIncoming } from "lucide-react";

const EmptyCallbacksList: React.FC = () => {
  return (
    <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
      <PhoneIncoming className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">No callbacks found</h3>
      <p className="mt-2 text-gray-500">
        When supporters call your campaign number, their callbacks will appear here.
      </p>
    </div>
  );
};

export default EmptyCallbacksList;
