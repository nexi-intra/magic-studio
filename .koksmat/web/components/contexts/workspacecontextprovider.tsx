"use client";

import { useEffect, useState } from "react";
import { WorkspaceContext, WorkspaceContextType } from "./workspacecontext";

export const WorkspaceContextProvider = (props: { children: any }) => {
  const [kitchenRoot, setKitchenRoot] = useState<any>();
  const [workspaceId, setworkspaceId] = useState("");
  const workspace: WorkspaceContextType = {
    kitchenroot: kitchenRoot!,
    setWorkspaceId: function (workspaceId: string): void {
      setworkspaceId(workspaceId);
    },
    workspaceId,
  };

  useEffect(() => {
    if (!workspaceId) return;
    const load = async () => {
      const getKitchenRoot = await fetch(
        `/api/exec/remote/${workspaceId}/koksmat/context/kitchenRoot`
      );

      const kitchenRoot = await getKitchenRoot.text().catch((e) => {
        return { e };
      });
      if (!kitchenRoot) return;

      setKitchenRoot((kitchenRoot as string).split("\n")[0]);
    };
    load();
  }, [workspaceId]);

  return (
    <WorkspaceContext.Provider value={workspace}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};
