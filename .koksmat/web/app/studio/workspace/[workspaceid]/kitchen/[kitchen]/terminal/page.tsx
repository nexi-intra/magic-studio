"use client";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { Terminal } from "@/components/terminal";
import path from "path";
import React, { useContext } from "react";

export default function Page(props: {
  params: { workspaceid: string; kitchen: string };
}) {
  const workspaceContext = useContext(WorkspaceContext);
  return (
    <div className="w-full">
      <Terminal
        workspace_id={props.params.workspaceid}
        kitchen_root={path.join(
          workspaceContext.kitchenroot,
          props.params.kitchen
        )}
      />
    </div>
  );
}
