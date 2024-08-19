import React, { useContext } from "react";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import path from "path";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
export default function Page(props: {
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const { workspaceid, kitchen } = props.params;
  const workspaceContext = useContext(WorkspaceContext);
  const webAppFiles = useWorkspaceExec<string>(
    workspaceid,
    "find",
    [".", "-name", "page.tsx", "-o", "-name", "layout.tsx"],
    path.join(workspaceContext.kitchenroot, kitchen, ".koksmat", "web", "app"),
    (data) => {
      return data;
    }
  );

  return <div>{webAppFiles}</div>;
}
