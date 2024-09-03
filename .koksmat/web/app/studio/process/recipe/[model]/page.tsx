"use client";
import DynamicIcon from "@/components/dynamic-icon";
import { pizzaOrderWorkflow } from "@/components/flows/sample";
import LayoutThreeRowsLeftPanelAndResults from "@/components/layout-three-rows-left-panel-and-results";

import WorkflowEditor from "@/components/workflow-editor2";
import { parseWorkflowYaml, WorkflowFile } from "@/lib/workflow-utils";
import React, { use, useEffect, useState } from "react";

export default function Page(props: { params: { model: string } }) {
  const { model } = props.params;
  const [error, seterror] = useState("");
  const [flow, setFlow] = useState<WorkflowFile>();

  useEffect(() => {
    setFlow(pizzaOrderWorkflow);
  }, []);

  const rightPanel = <WorkflowEditor flow={flow} />;
  return rightPanel;
  return (
    <div>
      {error && <div className="p-4 text-red-500">{error}</div>}
      <LayoutThreeRowsLeftPanelAndResults
        leftPanel={undefined}
        rightPanel={rightPanel}
        resultPanel={undefined}
        loggingPanel={undefined}
      ></LayoutThreeRowsLeftPanelAndResults>
    </div>
  );
}
