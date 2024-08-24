"use client";

import { useContext } from "react";
import EditorCanvas, {
  ActivityIcon,
  Section,
  WorkflowMetadata,
} from "./canvas";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { https } from "@/app/koksmat/httphelper";
import { nanoid } from "nanoid";

export default function WorkflowEditor() {
  const magicbox = useContext(MagicboxContext);
  function handleSafe(sections: Section[], metadata: WorkflowMetadata) {
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
  const activityIcons: ActivityIcon[] = [
    { id: "activity-1", type: "Activity 12" },
    { id: "activity-2", type: "Activity 2" },
    { id: "activity-3", type: "Activity 3" },
  ];
  const initialSections: Section[] = [
    {
      id: "section-A",
      title: "Section A",
      content: "This is the content for Section 1.",
      collapsed: false,
      columns: Array.from({ length: 4 }, (_, i) => ({
        id: `column-1-${i + 1}`,
        items: [],
      })),
    },
    {
      id: "section-2",
      title: "Section 2",
      content: "This is the content for Section 2.",
      collapsed: false,
      columns: Array.from({ length: 4 }, (_, i) => ({
        id: `column-2-${i + 1}`,
        items: [],
      })),
    },
    {
      id: "section-3",
      title: "Section 3",
      content: "This is the content for Section 3.",
      collapsed: false,
      columns: Array.from({ length: 4 }, (_, i) => ({
        id: `column-3-${i + 1}`,
        items: [],
      })),
    },
  ];

  return (
    <EditorCanvas
      handleSave={handleSafe}
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
  );
}
