"use client";
import React, { useEffect } from "react";
import { useState } from "react";

import { callWorkspace } from "@/components/actions/call-workspace";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
export default function WorkspacePing(props: { sessionid: string }) {
  const { sessionid } = props;
  const [workspace, setWorkspace] = useState<JSX.Element>();
  const [running, setrunning] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const load = async () => {
      const workspaceUI = await callWorkspace(
        sessionid,
        "ping", // "ping
        "n.a.",
        [],
        10,
        {
          onSuccess: "setcookie",
          cookie: "check-workspace-" + sessionid,
          cookieLifetime: 30,
        }
      );
      setWorkspace(workspaceUI);
    };
    load();
  }, []);

  return (
    <div>
      Pinging workspace: {sessionid}
      {workspace}
    </div>
  );
}
