
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  label?: string;
  loadingLabel?: string;
}

const SubmitButton = ({ 
  isSubmitting, 
  label = "Next", 
  loadingLabel = "Processing..." 
}: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full h-12 bg-[#004838] hover:bg-[#003026] mt-8 font-medium"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </Button>
  );
};

export default SubmitButton;
