import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Building, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const CommitteeTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const [committee, setCommittee] = useState<{
    id: string;
    type: string;
    organization_name: string | null;
    candidate_first_name: string | null;
    candidate_middle_initial: string | null;
    candidate_last_name: string | null;
    candidate_suffix: string | null;
  } | null>(null);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    description: ""
  });

  // Fetch committee data
  useEffect(() => {
    const fetchCommitteeData = async () => {
      try {
        setIsLoading(true);

        // Get the current user
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user found");

        // Fetch committee associated with this user
        const {
          data,
          error
        } = await supabase.from('committees').select('*').eq('user_id', user.id).single();
        if (error) throw error;
        if (data) {
          setCommittee(data);
        }
      } catch (error) {
        console.error("Error fetching committee data:", error);
        setError("Failed to load committee data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommitteeData();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      id,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      // Save address and description updates (would go to a new table in a real implementation)
      // This is just a placeholder for now

      toast({
        title: "Changes saved",
        description: "Your committee information has been updated"
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      toast({
        title: "Save failed",
        description: "Could not save committee information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#004838]" />
      </div>;
  }
  if (error) {
    return <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>;
  }
  return <div className="space-y-6">
      {committee && <Card className="overflow-hidden">
          <CardHeader className="bg-[#E3F1ED] pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-sm p-2 bg-[#004838] text-white">
                {committee.type === "organization" ? <Building className="h-6 w-6" /> : <User className="h-6 w-6" />}
              </div>
              <CardTitle>
                {committee.type === "organization" ? "Organization Committee" : "Candidate Committee"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {committee.type === "organization" ? <div className="space-y-2">
                <Label className="text-gray-500">Organization Name</Label>
                <p className="text-lg font-medium">{committee.organization_name}</p>
              </div> : <div className="space-y-2">
                <Label className="text-gray-500">Candidate Name</Label>
                <p className="text-lg font-medium">
                  {committee.candidate_first_name}{' '}
                  {committee.candidate_middle_initial ? committee.candidate_middle_initial + '. ' : ''}
                  {committee.candidate_last_name}{' '}
                  {committee.candidate_suffix && committee.candidate_suffix !== 'none' ? committee.candidate_suffix : ''}
                </p>
              </div>}
          </CardContent>
        </Card>}

      

      

      <div className="flex justify-end">
        <Button className="bg-[#004838] hover:bg-[#003026]" onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </> : "Save Changes"}
        </Button>
      </div>
    </div>;
};
export default CommitteeTab;