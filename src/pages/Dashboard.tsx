
import React, { useState, useEffect } from "react";
import { useVoicemails } from "@/hooks/useVoicemails";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { voicemails, isLoading } = useVoicemails();
  const { user } = useAuth();
  const [hasNoVoicemail, setHasNoVoicemail] = useState(false);

  useEffect(() => {
    // Check if voicemails have been loaded and if the user has any
    if (!isLoading && user && voicemails.length === 0) {
      setHasNoVoicemail(true);
    } else {
      setHasNoVoicemail(false);
    }
  }, [voicemails, isLoading, user]);

  return (
    <div className="h-full w-full">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-[#073127] mb-6">Dashboard</h1>
        
        {hasNoVoicemail && (
          <Alert className="mb-6 border-amber-300 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Missing Voicemail</AlertTitle>
            <AlertDescription className="text-amber-700">
              You haven't uploaded a voicemail message yet. Your callbacks will not have a custom greeting.
              <div className="mt-3">
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Link to="/settings">Upload a voicemail</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Empty dashboard content will go here */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-[#333F3C] text-center py-12">Dashboard content will be added later</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
