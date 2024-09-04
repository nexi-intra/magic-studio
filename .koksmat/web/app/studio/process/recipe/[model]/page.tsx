"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import DynamicIcon from "@/components/dynamic-icon";
import { pizzaOrderWorkflow } from "@/components/flows/sample";
import LayoutHeader from "@/components/layout-header";
import LayoutThreeRowsLeftPanelAndResults from "@/components/layout-three-rows-left-panel-and-results";
import MermaidDiagram from "@/components/mermaid-diagram";
import WithClipboardCopy from "@/components/with-clipboardcopy";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import WorkflowEditor from "@/components/workflow-editor2";
import yaml from "js-yaml";
import {
  generateMermaidSequenceDiagram,
  WorkflowData,
} from "@/components/workflow-interfaces";
import WorkflowStatus from "@/components/workflow-status";

import React, { use, useEffect, useState } from "react";

import useDatabaseWorksActivitymodel from "@/components/use-database-works-activitymodel";
import { Button } from "@/components/ui/button";
export default function Page(props: { params: { model: string } }) {
  const { model } = props.params;
  const [workflowData, setworkflowData] = useState<WorkflowData>();

  const { databaseRecord, isLoading, error } =
    useDatabaseWorksActivitymodel(model);
  useEffect(() => {
    if (databaseRecord) {
      setworkflowData(databaseRecord.data as any);
      setyamlText(yaml.dump(databaseRecord.data));

      //.load(JSON.stringify(workflowData, null, 2)) as string
    }
  }, [databaseRecord]);

  const [yamlText, setyamlText] = useState("");
  const [view, setview] = useState<"yaml" | "preview">("preview");
  const selectedView = () => {
    switch (view) {
      case "yaml":
        return (
          <div className="h-[80vh]">
            <MonacoEditor
              value={yamlText}
              height="100%"
              language="yaml"
              onChange={(value) => {
                setyamlText(value!);
              }}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        );
      case "preview":
        return workflowData ? (
          <WorkflowStatus workflowData={workflowData} />
        ) : null;
    }
  };
  const centerPanel = workflowData ? selectedView() : null;
  const rightPanel = <div className="w-300">dsafds</div>;
  const leftPanel = null; //<pre>{diagram}</pre>; //
  return (
    <div className="w-full h-full">
      <LayoutHeader
        error={error}
        title="Workflow"
        tools={[
          <WithClipboardCopy
            key="1"
            text={JSON.stringify(workflowData, null, 2)}
          >
            Copy workflow as JSON
          </WithClipboardCopy>,
          <div key="2" className="flex items-center gap-2">
            <Button
              onClick={() => {
                setview(view === "preview" ? "yaml" : "preview");
                if (view === "yaml") {
                  try {
                    setworkflowData(yaml.load(yamlText) as any);
                  } catch (e) {
                    console.error(e);
                  }
                }
              }}
              variant="secondary"
            >
              {view === "preview" ? "YAML" : "View"}
            </Button>
          </div>,
        ]}
      />
      <div className="flex">
        {/* <div className="w-[300px] overflow-auto">{leftPanel}</div> */}
        <div className="grow h-full">{centerPanel}</div>
        <div className="grow">{rightPanel}</div>
      </div>
    </div>
  );
}
