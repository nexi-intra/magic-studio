"use client";

import { WorkspaceContextProvider } from "@/components/contexts/workspacecontextprovider";
import useKitchens from "@/components/hooks/use-kitchens";
import useWorkspaceConnectionStatus from "@/components/hooks/use-workspace-connectionstatus";
import {
  ConnectionStatusType,
  WorkspaceToolbar,
} from "@/components/workspace-toolbar";
import { useEffect, useState } from "react";

export default function Layout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <div>
      <WorkspaceContextProvider>
        <WorkspaceToolbar />
        {children}
      </WorkspaceContextProvider>
    </div>
  );
}
