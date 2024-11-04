import { useState, useCallback, useRef, useEffect } from "react";
import { Check, Edit2, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { set } from "date-fns";

interface EditableTextProps {
  initialText: string;
  onSave: (text: string) => Promise<boolean>;
  fixed?: boolean;
  className?: string;
}

export default function EditableText({
  initialText,
  onSave,
  fixed,
  className
}: EditableTextProps) {
  const [text, setText] = useState(initialText);
  const [changed, setchanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  useEffect(() => {
    setText(initialText);


  }, [initialText])

  const { toast } = useToast();
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await onSave(text);
      if (success) {
        setchanged(false);
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
    }, 1000); // 1 second delay
  };

  if (isEditing || fixed) {
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={text}
          onChange={(e: any) => {
            setText(e.target.value);
            setchanged(true);
          }}
          className="flex-grow"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSave();
            }
          }}
        />
        <Button onClick={handleSave} disabled={isSaving || !changed}>
          {isSaving ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <Save className="h-4 w-4" />
          )}
        </Button>
        {!fixed && (
          <Button
            onClick={() => {
              setText(initialText);
              setIsEditing(false);
            }}
            variant="outline"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={"group relative inline-block  " + className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showCheckmark && (
        <Check className="absolute -right-6 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
      )}
      {/* {isHovered && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      )} */}
      <span>
        {text}{" "}
        {isHovered && (
          <Edit2
            onClick={() => setIsEditing(true)}
            className="h-4 w-4 cursor-pointer"
          />
        )}
      </span>
    </div>
  );
}
