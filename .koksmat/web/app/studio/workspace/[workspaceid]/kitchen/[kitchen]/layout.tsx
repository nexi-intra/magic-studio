"use client";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import React, { useEffect, useState } from "react";

function Initialize(props: {
  children: any;
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const { workspaceid, kitchen } = props.params;
  const getkitchenRoot = useWorkspaceExec<string>(
    workspaceid,
    "echo",
    ["$KITCHENROOT"],
    "",
    (data) => {
      return data;
    }
  );
}
export default function Layout(props: {
  children: any;
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const { workspaceid, kitchen } = props.params;
  const { children } = props;

  const activeBranch = useWorkspaceExec<string>(
    workspaceid,
    "git",
    ["branch", "--show-current"],
    "",
    (data) => {
      return data;
    }
  );
  return (
    <div>
      {activeBranch}
      <div>{children}</div>
    </div>
  );
}
