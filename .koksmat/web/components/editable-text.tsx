import { useState, useCallback, useRef } from "react";
import { Check, Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface EditableTextProps {
  initialText: string;
  onSave: (text: string) => Promise<boolean>;
}

export default function EditableText({
  initialText,
  onSave,
}: EditableTextProps) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const { toast } = useToast();
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await onSave(text);
      if (success) {
        setShowCheckmark(true);
        setIsEditing(false);
        setTimeout(() => setShowCheckmark(false), 3000);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save changes. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [text, onSave, toast]);

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 2000); // 1 second delay
  };

  if (isEditing) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
        <Button
          onClick={() => {
            setText(initialText);
            setIsEditing(false);
          }}
          variant="outline"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="group relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showCheckmark ? (
        <Check className="absolute -right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
      ) : (
        isHovered && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )
      )}
      <span>{text}</span>
    </div>
  );
}
