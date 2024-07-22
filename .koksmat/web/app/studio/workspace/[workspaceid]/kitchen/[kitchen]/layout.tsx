"use client";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import { KitchenToolbar } from "@/components/kitchen-toolbar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import WorkspaceResult from "@/components/workspace-result";
import path from "path";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";
function extractOrgAndRepo(
  gitHubUrl: string
): { organization: string; repository: string } | null {
  const s = gitHubUrl.split("/");
  if (s.length > 2) {
    return {
      organization: s[s.length - 2],
      repository: s[s.length - 1].replace(".git", ""),
    };
  }

  return null;
}

function Loaded(props: {
  children: any;
  kitchenroot: string;
  params: {
    workspaceid: string;
    kitchen: string;
  };
}) {
  const workspaceContext = useContext(WorkspaceContext);
  const { workspaceid, kitchen } = props.params;
  const { children, kitchenroot } = props;
  const [connectionReady, setconnectionReady] = useState(false);
  const [gitorg, setgitorg] = useState("");
  const [gitrepo, setgitrepo] = useState("");
  const router = useRouter();
  const openKitchenInVSCode = async () => {
    const body = JSON.stringify({
      sessionid: "sessionid",
      action: "open",
      command: "code",
      args: ["."],
      cwd: path.join(workspaceContext.kitchenroot, kitchen),
    });
    const result = await fetch("/api/autopilot/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const j = await result.json();
    if (j.body) {
      console.log(JSON.parse(j.body));
    }
    console.log(j);
    console.log(result);
  };
  useEffect(() => {
    if (workspaceContext.kitchenroot) {
      setconnectionReady(true);
    }
  }, [workspaceContext]);

  const activeBranch = useWorkspaceExec<string>(
    workspaceid,
    "git",
    ["branch", "--show-current"],
    path.join(kitchenroot, kitchen),
    (data) => {
      return data;
    }
  );
  const remoteOrigin = useWorkspaceExec<string>(
    workspaceid,
    "git",
    ["remote", "get-url", "origin"],
    path.join(kitchenroot, kitchen),
    (data) => {
      const result = extractOrgAndRepo(data);
      if (result) {
        setgitorg(result.organization);
        setgitrepo(result.repository);
      }
      return data;
    }
  );

  // useEffect(() => {
  //   // Example usage:
  //   debugger;
  //   if (!remoteOrigin) return;
  //   const result = extractOrgAndRepo(remoteOrigin!);
  //   if (result) {
  //     setgitorg(result.organization);
  //     setgitrepo(result.repository);
  //   }
  // }, [remoteOrigin]);

  return (
    <div>
      <div>
        <div>
          <KitchenToolbar
            gitOrganisation={gitorg}
            gitRepository={gitrepo}
            onOpenEditor={function (): void {
              openKitchenInVSCode();
            }}
            onOpenGitHub={function (): void {
              window.open(remoteOrigin, "_blank");
            }}
            onOpenTerminal={function (): void {
              router.push(
                `/${APPNAME}/workspace/${workspaceid}/kitchen/${kitchen}/commandline`
              );
            }}
            onOpenReleases={function (): void {
              throw new Error("Function not implemented.");
            }}
            onOpenIssues={function (): void {
              throw new Error("Function not implemented.");
            }}
            onOpenPackages={function (): void {
              throw new Error("Function not implemented.");
            }}
            onOpenFileExplorer={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        </div>

        <div className="mx-4"> Active branch: {activeBranch} </div>

        {children}
      </div>
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
