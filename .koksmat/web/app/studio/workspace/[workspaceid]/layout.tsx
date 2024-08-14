"use client";

import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { useContext, useEffect, useState } from "react";

export default function Layout(props: {
  children: React.ReactNode;
  params: { workspaceid: string };
}) {
  const { children } = props;
  const workspaceContext = useContext(WorkspaceContext);
  const { workspaceid } = props.params;
  useEffect(() => {
    workspaceContext.setWorkspaceId(workspaceid);
  }, [workspaceid]);

  return <div>{children}</div>;
}
