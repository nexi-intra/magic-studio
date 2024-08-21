"use client";
import AzAdApp from "@/components/az-ad-app";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import React, { useContext } from "react";

export default function Azure(props: {
  params: { workspaceid: string; kitchen: string };
}) {
  const { workspaceid, kitchen } = props.params;
  const workspaceContext = useContext(WorkspaceContext);
  return (
    <div>
      <AzAdApp
        params={{
          kitchenroot: workspaceContext.kitchenroot,
          workspaceid: workspaceid,
          kitchen: kitchen,
        }}
      />
    </div>
  );
}
