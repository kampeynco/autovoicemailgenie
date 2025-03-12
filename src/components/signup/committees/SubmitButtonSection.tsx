
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonSectionProps {
  isSubmitting: boolean;
  onBack: () => void;
}

const SubmitButtonSection = ({ isSubmitting, onBack }: SubmitButtonSectionProps) => {
  return (
    <div className="flex space-x-4">
      <Button 
        type="button" 
        variant="outline"
        className="w-1/2 h-12"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back
      </Button>
      <Button 
        type="submit" 
        className="w-1/2 h-12 bg-[#004838] hover:bg-[#003026]"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : "Next"}
      </Button>
    </div>
  );
};

export default SubmitButtonSection;
