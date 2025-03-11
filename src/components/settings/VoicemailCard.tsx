
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Pencil, Trash, CheckCircle } from "lucide-react";

interface VoicemailCardProps {
  id: string;
  name: string;
  description: string | null;
  isDefault: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const VoicemailCard = ({ 
  id, 
  name, 
  description, 
  isDefault, 
  onEdit, 
  onDelete, 
  onSetDefault 
}: VoicemailCardProps) => {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#004838] flex items-center justify-center text-white">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isDefault ? (
              <span className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </span>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onSetDefault(id)}
                className="text-xs h-8"
              >
                Set as Active
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(id)}
              disabled={isDefault}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoicemailCard;
