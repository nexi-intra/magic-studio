"use client";
import React from "react";
import { useState } from "react";
import { readStreamableValue } from "ai/rsc";
import { callWorkspace } from "./action";
export default function page(props: { params: { sessionid: string } }) {
  const { sessionid } = props.params;
  const [workspace, setWorkspace] = useState<any>(null);

  return (
    <div>
      <button
        onClick={async () => {
          const workspaceUI = await callWorkspace(sessionid, "ping", [
            "www.dr.dk",
          ]);
          setWorkspace(workspaceUI);
        }}
      >
        Call Workspace
      </button>

      {workspace}
    </div>
  );
}
