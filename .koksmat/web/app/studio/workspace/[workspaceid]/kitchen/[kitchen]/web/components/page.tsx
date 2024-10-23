"use client";
import ComponentNew from "@/components/component-new";
import React, { useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import { workspaceExecute } from "@/lib/workspace";
import { pathJoin } from "@/lib/pathjoin";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { vsCodeOpen } from "@/lib/vscode-open";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import PromptSuggestions from "@/components/prompt-suggestions";
import { id } from "date-fns/locale";
import { createComponent } from "@/components/create-component";
import TemplateEditor from "@/components/template-editor";
/*
//Example usage:
const result = convertToDashCase("StudioWelcomePage");
console.log(result); // Outputs: studio-welcome-page
  */


interface TemplateType {
  id: string;
  title: string;
  description: string;
  path: string;
  extention: string;
}

const templates: TemplateType[] = [
  {
    id: "10",
    title: "V2 - Web Component",
    description: "Generate a story opening",
    path: "components",
    extention: ".tsx"
  },
  {
    id: "10",
    title: "V2 - API Component",
    description: "Generate a story opening",
    path: "app/api",
    extention: ".ts"
  },
  {
    id: "10",
    title: "API Component",
    description: "Generate a api component",
    path: ".koksmat/web/app/api",
    extention: ".ts"
  },
  {
    id: "11",
    title: "Entity type",
    description: "Generate a type file",
    path: ".koksmat/web/app/api/entity/[entity]/types",
    extention: ".ts"
  },
  {
    id: "1",
    title: "Web Component",
    description: "Generate a story opening",
    path: ".koksmat/web/components",
    extention: ".tsx"
  },
  {
    id: "2",
    title: "Koksmat Go function",
    description: "Generate a story opening",
    path: ".koksmat/app/functions",
    extention: ".go"
  },
  {
    id: "3",
    title: "Go kitchen function",
    description: "Generate a story opening",
    path: "kitchen",
    extention: ".go"
  }]
function convertToDashCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Insert dash between lowercase and uppercase
    .toLowerCase(); // Convert the entire string to lowercase
}

export default function ComponentPage(props: {
  params: { workspaceid: string; kitchen: string };
}) {
  const magicbox = useContext(MagicboxContext);
  const { workspaceid, kitchen } = props.params;
  const workspaceContext = useContext(WorkspaceContext);
  const initialSuggestions = [
    {
      id: "1",
      title: "New Component",
      description: "Generate a story opening",
      prompt:
        "like data to be isolated in state variables and a initial props passed to the component - everything should be made typescript safe",
      url: "https://v0.dev/chat",
    },
    {
      id: "2",
      title: "High level  Component",
      description: "Generate a story opening",
      prompt:
        "new component using - that will be a high level component having tabs for navigations and the 2 child components - one for contacts and one with a world map containing geo locations of the account",
      url: "https://v0.dev/chat",
    },
    // ... more suggestions
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4  m-4">Create component</h1>

      <div className="flex w-full h-full m-4 flex-wrap">
        {templates.map((template, index) => (
          <div key={index} className="p-5 m-5  border ">
            {template.title}
            <ComponentNew
              onSubmitted={async (data) => {
                createComponent({
                  ...data,
                  cwd: pathJoin(
                    workspaceContext.kitchenroot,
                    kitchen,
                    ...template.path.split("/"),
                    // ".koksmat",
                    // "web",
                    // "components"
                  ),
                  extension: template.extention,
                  workspaceid,
                  magicbox,
                })

              }}
            />
          </div>
        ))}


      </div>
    </div>
  );
}
