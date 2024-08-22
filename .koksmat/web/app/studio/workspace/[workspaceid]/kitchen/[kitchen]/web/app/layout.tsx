"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import IframeWithScalingTools, {
  IFrameMessageHandler,
} from "@/components/iframe";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import { pathJoin } from "@/lib/pathjoin";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
export default function Router(props: {
  children: any;
  params: { workspaceid: string; kitchen: string };
}) {
  const { children } = props;
  const { workspaceid, kitchen } = props.params;

  const workspaceContext = React.useContext(WorkspaceContext);
  const magicboxcontext = useContext(MagicboxContext);
  const packageJson = useWorkspaceExec<string>(
    workspaceid,
    "cat",
    ["package.json"],
    pathJoin(workspaceContext.kitchenroot, kitchen, ".koksmat", "web"),
    (data) => {
      return data;
    }
  );

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
      workspaceContext.setWebAppUrl(url);
      //setappUrl(url);
    }
  }, [packageJson]);

  const postMessageRef = useRef<IFrameMessageHandler | undefined>();

  const registerPostMessage = (fn: IFrameMessageHandler) => {
    postMessageRef.current = fn;
  };

  const unRegisterPostMessage = () => {
    postMessageRef.current = undefined;
  };
  const [lastTreeView, setLastTreeView] = useState("");
  useEffect(() => {
    if (!workspaceContext.treePathname) return;
    if (lastTreeView === workspaceContext.treePathname) return;
    setLastTreeView(workspaceContext.treePathname);
    const newRoute =
      "/" +
      pathJoin(workspaceContext.appName, workspaceContext.treePathname).replace(
        "/page.tsx",
        ""
      );
    if (postMessageRef.current) {
      postMessageRef.current({
        koksmat: true,
        message: {
          type: "navigate",
          url: newRoute,
        },
      });
    }
  }, [workspaceContext.treePathname]);

  return (
    <div className="w-full h-full ">
      {workspaceContext.webAppUrl && (
        <IframeWithScalingTools
          url={workspaceContext.webAppUrl}
          registerPostMessage={(postMessage) =>
            registerPostMessage(postMessage)
          }
          unRegisterPostMessage={function (): void {
            unRegisterPostMessage();
          }}
        />
      )}{" "}
      {children}
    </div>
  );
}
