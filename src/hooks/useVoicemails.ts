
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export interface Voicemail {
  id: string;
  name: string;
  description: string | null;
  file_path: string | null;
  is_default: boolean;
  created_at: string;
}

export const useVoicemails = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [voicemails, setVoicemails] = useState<Voicemail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVoicemails = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('voicemails')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure we're handling the correct shape of data
      // by mapping the response to our Voicemail interface
      const formattedVoicemails: Voicemail[] = (data || []).map(item => ({
        id: item.id,
        name: item.name || 'Untitled Voicemail',
        description: item.description,
        file_path: item.file_path,
        is_default: item.is_default || false,
        created_at: item.created_at
      }));
      
      setVoicemails(formattedVoicemails);
    } catch (err: any) {
      console.error('Error fetching voicemails:', err);
      setError(err.message || 'Failed to load voicemails');
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultVoicemail = async (id: string) => {
    if (!user) return;

    try {
      // First reset all voicemails to not default
      await supabase
        .from('voicemails')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Then set the selected one as default
      const { error } = await supabase
        .from('voicemails')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setVoicemails(prev => 
        prev.map(vm => ({
          ...vm,
          is_default: vm.id === id
        }))
      );

      toast({
        title: "Default Voicemail Updated",
        description: "Your active voicemail has been updated.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update default voicemail.",
        variant: "destructive"
      });
    }
  };

  const deleteVoicemail = async (id: string) => {
    if (!user) return;

    // Check if this is the default voicemail
    const isDefault = voicemails.find(vm => vm.id === id)?.is_default;
    if (isDefault) {
      toast({
        title: "Cannot Delete Active Voicemail",
        description: "Please set another voicemail as active before deleting this one.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('voicemails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setVoicemails(prev => prev.filter(vm => vm.id !== id));

      toast({
        title: "Voicemail Deleted",
        description: "Your voicemail has been deleted successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Delete Failed",
        description: err.message || "Failed to delete voicemail.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchVoicemails();
  }, [user]);

  return {
    voicemails,
    isLoading,
    error,
    fetchVoicemails,
    setDefaultVoicemail,
    deleteVoicemail
  };
};
