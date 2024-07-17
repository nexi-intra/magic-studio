"use client";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import WorkspaceResult from "@/components/workspace-result";
import path from "path";
import React, { useContext, useEffect, useState } from "react";

function Loaded(props: {
  children: any;
  kitchenroot: string;
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const { workspaceid, kitchen } = props.params;
  const { children, kitchenroot } = props;

  const activeBranch = useWorkspaceExec<string>(
    workspaceid,
    "git",
    ["branch", "--show-current"],
    path.join(kitchenroot, kitchen),
    (data) => {
      return data;
    }
  );

  return (
    <div>
      {activeBranch}
      <div>Releases</div>
      <WorkspaceResult
        command="gh"
        args={["release", "list", "--json", "name,tagName,publishedAt"]}
        folder={path.join(kitchenroot, kitchen)}
        workspaceid={workspaceid}
        parser={function (response: any) {
          return <div>{JSON.stringify(response)}</div>;
        }}
      />
      <div>{children}</div>
    </div>
  );
}

export default function Layout(props: {
  children: any;
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const workspaceContext = useContext(WorkspaceContext);
  if (!workspaceContext) return <div>Loading</div>;
  if (!workspaceContext.kitchenroot) return <div>Loading...</div>;

  return <Loaded {...props} kitchenroot={workspaceContext.kitchenroot} />;
}
