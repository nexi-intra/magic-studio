"use client";

import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { KitchenOverview } from "@/components/kitchen-overview";
import { useContext, useEffect, useState } from "react";

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

  return (
    <div>
      <KitchenOverview />
    </div>
  );
}
