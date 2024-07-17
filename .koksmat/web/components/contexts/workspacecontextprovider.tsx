"use client";

import { useEffect, useState } from "react";
import { WorkspaceContext, WorkspaceContextType } from "./workspacecontext";

export const WorkspaceContextProvider = (props: {
  workspace: string;
  children: any;
}) => {
  const [kitchenRoot, setKitchenRoot] = useState<any>();
  const workspace: WorkspaceContextType = {
    kitchenroot: kitchenRoot!,
  };

  useEffect(() => {
    if (!props.workspace) return;
    const load = async () => {
      const getKitchenRoot = await fetch(
        `/api/exec/remote/${props.workspace}/koksmat/context/kitchenRoot`
      );

      const kitchenRoot = await getKitchenRoot.text().catch((e) => {
        return { e };
      });
      if (!kitchenRoot) return;

      setKitchenRoot((kitchenRoot as string).split("\n")[0]);
    };
    load();
  }, [props.workspace]);

  return (
    <WorkspaceContext.Provider value={workspace}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};
