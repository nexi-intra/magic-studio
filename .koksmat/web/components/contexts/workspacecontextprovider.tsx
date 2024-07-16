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
        `/api/exec/remote/${props.workspace}/echo/$KITCHENROOT`
      );
      debugger;
      const kitchenRoot = await getKitchenRoot.text().catch((e) => {
        return { e };
      });

      setKitchenRoot(kitchenRoot);
    };
    load();
  }, [props.workspace]);

  return (
    <WorkspaceContext.Provider value={workspace}>
      {props.children}
    </WorkspaceContext.Provider>
  );
};
