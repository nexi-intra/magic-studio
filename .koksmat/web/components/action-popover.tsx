import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Maximize2, Minimize2 } from "lucide-react";

interface ActionPopoverProps {
  children: React.ReactNode;
  title: string;
}

const ActionPopover: React.FC<ActionPopoverProps> = ({ children, title }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">{title}</Button>
      </PopoverTrigger>
      <PopoverContent
        className={`${isMaximized ? "w-[100vw] h-[100vh] top-0 left-0 z-50 fixed" : "w-full h-full"} transition-all duration-200`}
      >
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium leading-none">{title}</h4>
            <Toggle
              aria-label="Toggle maximize"
              pressed={isMaximized}
              onPressedChange={setIsMaximized}
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Toggle>
          </div>
          <div className={`${isMaximized ? "overflow-auto" : ""}`}>
            {children}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ActionPopover;
