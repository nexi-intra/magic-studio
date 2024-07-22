"use client";
import { AutopilotCommandLine } from "@/components/autopilot-command-line";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import path from "path";
import React, { useContext } from "react";

export default function Page(props: {
  params: { workspaceid: string; kitchen: string };
}) {
  const workspaceContext = useContext(WorkspaceContext);
  return (
    <div>
      <AutopilotCommandLine
        workspace_id={props.params.workspaceid}
        kitchen_root={path.join(
          workspaceContext.kitchenroot,
          props.params.kitchen
        )}
      />
    </div>
  );
}
