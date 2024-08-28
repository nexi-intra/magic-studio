"use client";
import ComponentNew from "@/components/component-new";
import React, { useContext } from "react";
import { toast } from "@/components/ui/use-toast";
import { workspaceExecute } from "@/lib/workspace";
import { pathJoin } from "@/lib/pathjoin";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { vsCodeOpen } from "@/lib/vscode-open";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
/*
//Example usage:
const result = convertToDashCase("StudioWelcomePage");
console.log(result); // Outputs: studio-welcome-page
  */
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

  return (
    <div>
      <ComponentNew
        onSubmitted={async (data) => {
          const filename = convertToDashCase(data.componentName) + ".tsx";
          const cwd = pathJoin(
            workspaceContext.kitchenroot,
            kitchen,
            ".koksmat",
            "web",
            "components"
          );

          const args = [
            "-c",
            `echo "` +
              data.sourceCode.replaceAll(`"`, `\"`) +
              `" > ` +
              filename,
          ];
          const command = "bash";

          const request1 = new Request(`/api/autopilot/exec`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${magicbox.authtoken}`,
            },
            body: JSON.stringify({
              sessionid: workspaceid,
              action: "execute",
              command,
              args,
              cwd,
            }),
          });
          const result = await fetch(request1).catch((e) => {
            console.error(e);
            toast({
              title: "Error",
              description: "Failed to create component",
              variant: "destructive",
            });
          });

          if (!result) return;
          vsCodeOpen(magicbox.authtoken, filename, cwd);

          toast({
            title: "Component Created!",
            description: `Your new component "${data.componentName}" has been created with the provided source code and saved to ${filename}.
            Have asked vs code to open the file
            `,
          });
        }}
      />
    </div>
  );
}
