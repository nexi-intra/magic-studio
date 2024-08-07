"use client";

import { WorkspaceContextProvider } from "@/components/contexts/workspacecontextprovider";
import useKitchens from "@/components/hooks/use-kitchens";
import useWorkspaceConnectionStatus from "@/components/hooks/use-workspace-connectionstatus";
import {
  ConnectionStatusType,
  WorkspaceToolbar,
} from "@/components/workspace-toolbar";
import { useEffect, useState } from "react";

export default function Layout(props: {
  children: React.ReactNode;
  params: { workspaceid: string };
}) {
  const { children } = props;
  const { workspaceid } = props.params;
  const connectionStatus = useWorkspaceConnectionStatus(workspaceid);
  const kitchens = useKitchens(workspaceid);
  return (
    <div>
      <WorkspaceContextProvider workspace={workspaceid}>
        <WorkspaceToolbar
          connectionStatus={connectionStatus}
          workspacekey={workspaceid}
          kitchens={kitchens}
        />
        {children}
      </WorkspaceContextProvider>
    </div>
  );
}
