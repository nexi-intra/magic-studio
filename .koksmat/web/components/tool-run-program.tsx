import { useContext, useState } from "react";
import { Play, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToolContext } from "./contexts/toolcontext";

interface ToolProps {
  toolState: "toolbar" | "oncanvas";
}

export default function ToolRunProgram() {
  const [showPopover, setShowPopover] = useState(false);
  const toolcontext = useContext(ToolContext);

  if (toolcontext.canvasType === "toolbar") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Play className="h-4 w-4" />
              <span className="sr-only">Run Program</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run Program: Execute your code</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (toolcontext.canvasType === "canvas") {
    return (
      <Card className="w-48 p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="h-4 w-4" />
            <h3 className="text-sm font-medium">Run Program</h3>
          </div>
          <Popover open={showPopover} onOpenChange={setShowPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                onMouseEnter={() => setShowPopover(true)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Run Program Details</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Run Program Details</h4>
                <p className="text-sm text-muted-foreground">
                  Execute your code with customizable options. Set runtime
                  parameters, choose input sources, and specify output
                  destinations.
                </p>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Execute your code</p>
      </Card>
    );
  }

  return null;
}
