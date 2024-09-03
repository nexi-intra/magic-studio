"use client";

import { useContext, useEffect, useState } from "react";
import EditorCanvas, {
  ActivityIcon,
  Section,
  WorkflowMetadata,
} from "./workflow/canvas";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { https } from "@/app/koksmat/httphelper";
import { nanoid } from "nanoid";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";

import { ToolContextProvider } from "./contexts/toolcontextprovider";
import ToolRunProgram from "./tool-run-program";
import { WorkflowFile } from "@/lib/workflow-utils";
import { DatabaseMethods } from "@/actions/model";

import DynamicIcon from "@/components/dynamic-icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IconPicker from "./icon-picker";

export default function WorkflowEditor<T>(props: {
  flow: WorkflowFile | undefined;
}) {
  const magicbox = useContext(MagicboxContext);
  const [activityIcons, setActivityIcons] = useState<ActivityIcon[]>([]);
  const [initialSections, setInitialSections] = useState<Section[]>([]);
  const [newActivityName, setNewActivityName] = useState("");
  const [newActivityIcon, setNewActivityIcon] = useState("");
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  function handleSave(sections: Section[], metadata: WorkflowMetadata) {
    return async () => {
      const payload = {
        activity: "",
        data: sections,
        description: metadata.description,
        name: metadata.title,
        searchindex: "name:" + metadata.title,
        tenant: "",
      };
      const args = [
        "execute",
        "works",
        "update_activitymodel",
        magicbox.authtoken,
        JSON.stringify(payload),
      ];

      const result = await https("", "POST", "/api/run", {
        args,
        channel: "x",
        timeout: 600,
      });
      alert(result.hasError ? result.errorMessage : "Saved successfully");
    };
  }

  useEffect(() => {
    if (!props.flow) return;

    const workflow = props.flow.workflow;
    const icons: ActivityIcon[] = workflow.actions.map((action) => ({
      id: action.id,
      type: action.name,
      component: (
        <div className="flex items-center gap-2">
          <DynamicIcon iconName={action.icon as any} />
          <span>{action.name}</span>
        </div>
      ),
    }));
    setActivityIcons(icons);
    const sections = workflow.sections.map((section) => {
      const newSection: Section = {
        id: section.id,
        title: section.name,
        content: "This is the content for the new section.",
        collapsed: false,
        columns: Array.from({ length: 4 }, (_, i) => ({
          id: `column-${section.id}-${i + 1}`,
          items: [],
        })),
      };
      return newSection;
    });
    setInitialSections(sections);
  }, [props.flow]);

  const handleAddActivity = () => {
    const newId = nanoid();
    const newActivity: ActivityIcon = {
      id: newId,
      type: newActivityName,
      component: (
        <div className="flex items-center gap-2">
          <DynamicIcon iconName={newActivityIcon as any} />
          <span>{newActivityName}</span>
        </div>
      ),
    };
    setActivityIcons([...activityIcons, newActivity]);
    setNewActivityName("");
    setNewActivityIcon("");
  };

  const handleSelectIcon = (iconName: string) => {
    setNewActivityIcon(iconName);
    setIsIconPickerOpen(false);
  };

  return (
    <ToolContextProvider>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Workflow Editor</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newActivityName}
                    onChange={(e) => setNewActivityName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    Icon
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="icon"
                      value={newActivityIcon}
                      onChange={(e) => setNewActivityIcon(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={() => setIsIconPickerOpen(true)}
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={handleAddActivity}>Add Activity</Button>
            </DialogContent>
          </Dialog>
        </div>
        <EditorCanvas
          handleSave={handleSave}
          activityIcons={activityIcons}
          initialSections={initialSections}
          metadata={{
            title: "",
            description: "",
          }}
          handleAddSection={async () => {
            const newId = nanoid();
            const newSection: Section = {
              id: `section-${newId}`,
              title: `New Section ${newId}`,
              content: "This is the content for the new section.",
              collapsed: false,
              columns: Array.from({ length: 4 }, (_, i) => ({
                id: `column-${newId}-${i + 1}`,
                items: [],
              })),
            };
            return newSection;
          }}
        />
      </div>
      <Dialog open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Choose an Icon</DialogTitle>
          </DialogHeader>
          <IconPicker onSelectIcon={handleSelectIcon} />
        </DialogContent>
      </Dialog>
    </ToolContextProvider>
  );
}
