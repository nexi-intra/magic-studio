"use server";

import { workspaceExecute } from "@/lib/workspace";
import { createStreamableUI } from "ai/rsc";
import { ca } from "date-fns/locale";

export async function callWorkspace(
  sessionid: string,
  cmd: string,
  args: string[]
) {
  const workspaceUI = createStreamableUI();
  const callback = (value: any) => {
    workspaceUI.append(<div style={{ color: "gray" }}>{value}</div>);
  };
  workspaceExecute(sessionid, cmd, args, callback);

  // setTimeout(() => {
  //   weatherUI.done(<div>It's a sunny day!</div>);
  // }, 1000);

  return workspaceUI.value;
}
