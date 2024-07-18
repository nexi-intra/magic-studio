"use client";

import { WorkspaceContextProvider } from "@/components/contexts/workspacecontextprovider";
import { GitHubToolbar } from "@/components/github-toolbar";
import useKitchens from "@/components/hooks/use-kitchens";
import useWorkspaceConnectionStatus from "@/components/hooks/use-workspace-connectionstatus";

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
        <GitHubToolbar
          connectionStatus={connectionStatus}
          workspacekey={workspaceid}
        />
        {children}
      </WorkspaceContextProvider>
    </div>
  );
}
