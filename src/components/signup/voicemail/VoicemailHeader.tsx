
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const VoicemailHeader = () => {
  return (
    <div className="text-left">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-medium text-[#073127]">Voicemail Message</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-500 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-left">Voicemails should be no more than 30 seconds.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Record or upload a voicemail message for your committee.
      </p>
    </div>
  );
};

export default VoicemailHeader;
