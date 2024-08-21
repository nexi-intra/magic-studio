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

import React, { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";
import TreeView, {
  parsePathsToTree,
  TreeNodeProps,
} from "@/components/treeview";
import { set } from "date-fns";
import { pathJoin } from "@/lib/pathjoin";
import KoksmatServer from "@/components/koksmat-server";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { tree } from "next/dist/build/templates/app-page";

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
interface TreeAction {
  node: TreeNodeProps;
  action: "add" | "delete";
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
  const [treePath, settreePath] = useState("");

  const openKitchenInVSCode = async () => {
    const body = JSON.stringify({
      sessionid: "sessionid",
      action: "open",
      command: "code",
      args: [".", "--add"],
      cwd: pathJoin(workspaceContext.kitchenroot, kitchen),
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
    pathJoin(kitchenroot, kitchen),
    (data) => {
      return data;
    }
  );

  const remoteOrigin = useWorkspaceExec<string>(
    workspaceid,
    "git",
    ["remote", "get-url", "origin"],
    pathJoin(kitchenroot, kitchen),
    (data) => {
      const result = extractOrgAndRepo(data);
      if (result) {
        setgitorg(result.organization);
        setgitrepo(result.repository);
      }
      return data;
    }
  );
  const [webAppFilesTreeNodes, setwebAppFilesTreeNodes] = useState<
    TreeNodeProps[]
  >([]);

  const webAppRoot = useWorkspaceExec<string>(
    workspaceid,
    "cat",
    ["global.ts"],
    pathJoin(workspaceContext.kitchenroot, kitchen, ".koksmat", "web", "app"),
    (data) => {
      if (!data) return "";
      // Regular expression to match and capture the value of APPNAME
      const appNameMatch = data.match(/export const APPNAME = "([^"]+)";/);

      if (appNameMatch && appNameMatch[1]) {
        const appName = appNameMatch[1];
        console.log(appName); // Output: meeting
        return appName;
      } else {
        console.log("APPNAME not found");
        return "";
      }
    }
  );
  useEffect(() => {
    workspaceContext.setAppName(webAppRoot!);
    //setappname(webAppRoot!);
  }, [webAppRoot]);

  const webAppFiles = useWorkspaceExec<string>(
    workspaceid,
    "find",
    [".", "-name", "page.tsx"], //, "-o", "-name", "layout.tsx"],
    pathJoin(
      workspaceContext.kitchenroot,
      kitchen,
      ".koksmat",
      "web",
      "app",
      workspaceContext.appName
    ),
    (data) => {
      if (!data) return "";
      const lines = data.split("\n");
      const nodot = lines
        .map((line) => line.substring(2))
        .filter((line) => line.length > 0)
        .sort((a, b) => a.localeCompare(b));
      return nodot.join("\n");
    }
  );
  useEffect(() => {
    if (webAppFiles) {
      const paths = webAppFiles.split("\n").filter((p) => p.length > 0);
      const tree = parsePathsToTree(paths);
      setwebAppFilesTreeNodes(tree);
    }
  }, [webAppFiles]);
  const [treeAction, settreeAction] = useState<TreeAction>();
  return (
    <div>
      {treeAction && (
        <Dialog
          open={true}
          onOpenChange={() => {
            settreeAction(undefined);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{treeAction.node.path}</DialogTitle>
              {/* <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription> */}
            </DialogHeader>
          </DialogContent>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => settreeAction(undefined)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </Dialog>
      )}
      <div>
        <div>
          <KoksmatServer />

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
                `/${APPNAME}/workspace/${workspaceid}/kitchen/${kitchen}/terminal`
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
            onViewWebNavigation={function (): void {
              router.push(
                `/${APPNAME}/workspace/${workspaceid}/kitchen/${kitchen}/web`
              );
            }}
            onViewComponents={function (): void {
              router.push(
                `/${APPNAME}/workspace/${workspaceid}/kitchen/${kitchen}/web/components`
              );
            }}
          />
        </div>

        {/* <div className="mx-4"> Active branch: {activeBranch} </div> */}
        <div className="flex">
          <div>
            <TreeView
              treeData={webAppFilesTreeNodes}
              onSelect={(path) => {
                settreePath(path);
              }}
              renderNode={(node) => {
                return (
                  <div>
                    <ContextMenu>
                      <ContextMenuTrigger> {node.name}</ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem>
                          <span
                            onClick={() => {
                              settreeAction({ node, action: "add" });
                            }}
                          >
                            {" "}
                            New folder
                          </span>
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </div>
                );
              }}
            />
          </div>
          <div> {children}</div>
        </div>
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
