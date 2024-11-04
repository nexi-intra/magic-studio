"use client";
import React, { useEffect } from "react";
import { useState } from "react";

import { callWorkspace } from "@/components/actions/call-workspace";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
export default function Page(props: {
  params: { sessionid: string };
  searchParams: { done: string };
}) {
  const { sessionid } = props.params;
  const { done } = props.searchParams;
  const [workspace, setWorkspace] = useState<JSX.Element>();
  const [running, setrunning] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const load = async () => {
      setrunning(true);
      const workspaceUI = await callWorkspace(
        sessionid,
        "execute", // "ping
        "koksmat",
        [],
        10,
        { onSuccess: "redirect", finalUrl: pathname + "?done=true" }
      );
      setWorkspace(workspaceUI);
    };
    load();
  }, [sessionid]);

  return (
    <div>
      Pinging workspace: {sessionid}
      {done && <div>Done</div>}
      {workspace}
    </div>
  );
}
