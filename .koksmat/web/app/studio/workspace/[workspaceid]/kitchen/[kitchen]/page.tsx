"use client";

import { APPNAME } from "@/app/global";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { ItemPageToolbar } from "@/components/item-page-toolbar";
import { KitchenOverview } from "@/components/kitchen-overview";
import SQLCards from "@/components/sql-cards";
import { Button } from "@/components/ui/button";
import { CardStackIcon } from "@radix-ui/react-icons";
import { de } from "date-fns/locale";
import path from "path";
import { use, useContext, useEffect, useState } from "react";

export default function Page(props: {
  params: { workspaceid: string; kitchen: string };
}) {
  const { workspaceid, kitchen } = props.params;
  const workspaceContext = useContext(WorkspaceContext);
  const [connectionReady, setconnectionReady] = useState(false);

  useEffect(() => {
    if (workspaceContext.kitchenroot) {
      setconnectionReady(true);
    }
  }, [workspaceContext]);

  const auto = async () => {
    const body = JSON.stringify({
      files: [
        { directory: "dir1", file_name: "file1.txt", data: "Hello, World!" },
        { directory: "dir2", file_name: "file2.txt", data: "Go is awesome!" },
      ],
      category: "example",
      force: false,
      root_folder: path.join(workspaceContext.kitchenroot, kitchen),
    });
    const result = await fetch("/api/autopilot/write", {
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
    console.log(result);
  };

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
  return (
    <div>
      {/* <Button disabled={!connectionReady} onClick={() => auto()}>
        Autopilot
      </Button>
      <Button disabled={!connectionReady} onClick={() => openKitchenInVSCode()}>
        Open
      </Button> */}

      <KitchenOverview />
    </div>
  );
}
