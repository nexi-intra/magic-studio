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

import { ToolContextProvider } from "./contexts/toolcontextprovider";
import ToolRunProgram from "./tool-run-program";
import { WorkflowFile } from "@/lib/workflow-utils";
import { DatabaseMethods } from "@/actions/model";

import DynamicIcon from "@/components/dynamic-icon";

export default function WorkflowEditor<T>(props: {
  flow: WorkflowFile | undefined;
}) {
  const magicbox = useContext(MagicboxContext);
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
  const [activityIcons, setactivityIcons] = useState<ActivityIcon[]>([
    {
      id: "run-program",
      type: "Run program",
      component: <ToolRunProgram />,
    },
    { id: "activity-2", type: "Activity 2" },
    { id: "activity-3", type: "Activity 3" },
  ]);
  const [initialSections, setinitialSections] = useState<Section[]>([]);

  useEffect(() => {
    if (!props.flow) return;

    const workflow = props.flow.workflow;
    const activityIcons: ActivityIcon[] = workflow.actions.map((action) => ({
      id: action.id,
      type: action.name,
      component: (
        <div>
          <DynamicIcon iconName={action.icon as any} />
          {action.name}{" "}
        </div>
      ),
    }));
    setactivityIcons(activityIcons);
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
    setinitialSections(sections);
  }, [props.flow]);

  return (
    <ToolContextProvider>
      {/* <pre>{JSON.stringify(props.flow, null, 2)}</pre> */}
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
    </ToolContextProvider>
  );
}
