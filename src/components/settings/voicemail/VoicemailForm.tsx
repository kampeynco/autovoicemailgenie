
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VoicemailFormProps {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const VoicemailForm = ({ name, setName, description, setDescription }: VoicemailFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="voicemail-name">Name</Label>
        <Input 
          id="voicemail-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Voicemail name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="voicemail-description">Description (optional)</Label>
        <Textarea 
          id="voicemail-description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of this voicemail"
        />
      </div>
    </div>
  );
};

export default VoicemailForm;
