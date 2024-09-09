"use client";
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

import React, { use, useContext, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import UpdateActivitymodel from "@/actions/database/works/update_activitymodel";
import LogViewer, { LogObject } from "@/components/log-viewer";
import { useDatabaseWorksActivitymodelItem } from "./useDatabaseWorksActivitymodelItem";
import { Squirrel } from "lucide-react";
import { TemplateEditorButton } from "@/components/template-editor";

export default function Page(props: { params: { model: string } }) {
  const { model } = props.params;
  const [workflowData, setworkflowData] = useState<WorkflowData>();
  const [log, setlog] = useState<LogObject[]>([]);
  const { databaseRecord, isLoading, error } =
    useDatabaseWorksActivitymodelItem(model);
  useEffect(() => {
    if (databaseRecord) {
      setworkflowData(databaseRecord.data as any);
      setyamlText(yaml.dump(databaseRecord.data));

      //.load(JSON.stringify(workflowData, null, 2)) as string
    }
  }, [databaseRecord]);

  const [yamlText, setyamlText] = useState("");
  const [view, setview] = useState<"yaml" | "preview">("preview");
  const [viewDetails, setViewDetails] = useState(false);
  const magicbox = useContext(MagicboxContext);
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
  const rightPanel = (
    <div className="w-300">
      <LogViewer logs={log} />
    </div>
  );
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
          <div key="3">
            <Button
              onClick={async () => {
                debugger
                const result: any = await UpdateActivitymodel(
                  magicbox.authtoken,
                  databaseRecord
                );

                setlog((log) => [
                  ...log,
                  {
                    time: new Date(),
                    title: "UpdateActivitymodel",
                    detail: JSON.stringify(result, null, 2),
                    error: result?.data?.error || "",
                    result: JSON.stringify(result, null, 2),
                  },
                ]);
              }}
              //   const result = await UpdateActivitymodel(
              //     magicbox.authtoken,undefined,"",databaseRecord?.name || "",yaml.load(yamlText) as any,
              // }}
              variant={"secondary"}
            >
              Save
            </Button>
          </div>,
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
            <Button onClick={() => setViewDetails(!viewDetails)}>
              <Squirrel className="w-4 h-4" />
            </Button>
          </div>,
          <div key="4">
            <TemplateEditorButton />
          </div>
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
