"use client";
import React, { useContext, useEffect, useState } from "react";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import path from "path";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { pathJoin } from "@/lib/pathjoin";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import IframeWithScalingTools from "@/components/iframe";

export default function Page(props: {
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const { workspaceid, kitchen } = props.params;
  const magicboxcontext = useContext(MagicboxContext);
  const workspaceContext = useContext(WorkspaceContext);

  const packageJson = useWorkspaceExec<string>(
    workspaceid,
    "cat",
    ["package.json"],
    pathJoin(workspaceContext.kitchenroot, kitchen, ".koksmat", "web"),
    (data) => {
      return data;
    }
  );
  const [appUrl, setappUrl] = useState("");
  useEffect(() => {
    if (!packageJson) return;
    const packageJsonObj = JSON.parse(packageJson);
    const scripts: { [key: string]: string } = packageJsonObj.scripts || {};

    // for (const [scriptName, command] of Object.entries(scripts)) {
    //   console.log(`Script: ${scriptName}, Command: ${command}`);
    // }
    if (scripts.dev) {
      const port = scripts.dev.split(" -p ")[1];
      const url = `http://localhost:${port}/sso?token=${magicboxcontext.authtoken}`;
      //setappUrl("http://localhost:4997/tools");
      setappUrl(url);
    }
  }, [packageJson]);

  return (
    <div className="w-full h-full ">
      {appUrl && <IframeWithScalingTools url={appUrl} />}
    </div>
  );
}
