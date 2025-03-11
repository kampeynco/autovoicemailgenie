
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useVoicemails } from "@/hooks/useVoicemails";
import VoicemailCard from "./VoicemailCard";
import VoicemailModal from "./VoicemailModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const VoicemailTab = () => {
  const { voicemails, isLoading, error, fetchVoicemails, setDefaultVoicemail, deleteVoicemail } = useVoicemails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVoicemail, setEditVoicemail] = useState<{ id: string; name: string; description: string | null } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditVoicemail(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const voicemail = voicemails.find(vm => vm.id === id);
    if (voicemail) {
      setEditVoicemail({
        id: voicemail.id,
        name: voicemail.name,
        description: voicemail.description
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteVoicemail(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#073127]">Voicemail Messages</h2>
        <Button 
          onClick={handleAddNew}
          className="bg-[#004838] hover:bg-[#003026]"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Voicemail
        </Button>
      </div>

      <p className="text-sm text-gray-500">
        Manage your committee voicemail messages. You can have multiple voicemails and set one as the active message.
      </p>
      
      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#004838] mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading voicemails...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : voicemails.length === 0 ? (
        <div className="py-8 text-center border border-dashed rounded-lg">
          <p className="text-gray-500">No voicemails found. Create your first voicemail message.</p>
          <Button 
            onClick={handleAddNew}
            variant="outline" 
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Voicemail
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {voicemails.map(voicemail => (
            <VoicemailCard
              key={voicemail.id}
              id={voicemail.id}
              name={voicemail.name}
              description={voicemail.description}
              isDefault={voicemail.is_default}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={setDefaultVoicemail}
            />
          ))}
        </div>
      )}

      {/* Modal for adding/editing voicemails */}
      {isModalOpen && (
        <VoicemailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onVoicemailSaved={fetchVoicemails}
          editVoicemail={editVoicemail}
        />
      )}

      {/* Confirmation dialog for deleting voicemails */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the voicemail.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VoicemailTab;
