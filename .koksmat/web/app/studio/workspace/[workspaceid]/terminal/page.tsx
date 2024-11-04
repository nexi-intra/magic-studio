"use client";

import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { Terminal } from "@/components/terminal";
import React, { useContext } from "react";

export default function Page(props: { params: { workspaceid: string } }) {
  const workspaceContext = useContext(WorkspaceContext);
  return (
    <div>
      <Terminal
        workspace_id={props.params.workspaceid}
        kitchen_root={workspaceContext.kitchenroot}
      />
    </div>
  );
}
