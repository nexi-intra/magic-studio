"use client";

import React, { useRef, useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import SqlColumnSelector from "./sql-column-selector";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LabelWithEditor } from "./label-with-editor";
import {
  SaveIcon,
  PlayIcon,
  CircleStopIcon,
  Maximize2Icon,
  FileMinusIcon,
  FileCodeIcon,
} from "lucide-react";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import * as monacoEditor from "monaco-editor";
import { format } from "sql-formatter";
import { run } from "@/actions/server";
import LayoutThreeRowsLeftPanelAndResults from "./layout-three-rows-left-panel-and-results";
import LogViewer, { LogObject } from "./log-viewer";

export interface SqlQueryEditorOptions {}
export function SqlQueryEditor(props: {
  database: string;
  sql: string;
  name: string;
  onSave: (sql: string, name: string) => void;
  options?: SqlQueryEditorOptions;
  toolbar?: React.ReactNode;
}) {
  const monacoInstance = useMonaco();
  const magicbox = useContext(MagicboxContext);
  const { database, toolbar } = props;
  const [error, setError] = useState("");
  const [sqlExpression, setSqlExpression] = useState(props.sql);
  const [sqlResult, setSqlResult] = useState<any>();
  const [name, setName] = useState(props.name);
  const [log, setlog] = useState<LogObject[]>([]);

  useEffect(() => {
    setSqlExpression(props.sql);
  }, [props.sql]);

  // ... (keep the existing useEffect for Monaco setup)

  const handleRun = async () => {
    if (!sqlExpression) return;

    setError("");
    const result = await run(
      "magic-mix.app",
      ["query", database, sqlExpression],
      "",
      600,
      "x"
    );
    const logEntry: LogObject = {
      time: new Date(),
      title: "Running query",
      detail: sqlExpression,
      error: "",
    };

    if (result.hasError) {
      setError(result.errorMessage ?? "Unknown error");
      logEntry.error = result.errorMessage ?? "Unknown error";
      setlog([...log, logEntry]);
      return;
    }

    setlog([...log, logEntry]);
    setSqlResult(result.data);
  };

  const handleSave = () => {
    props.onSave(sqlExpression, name);
  };

  const rightPanel = (
    <div className="h-full">
      <div className="p-1 flex ">
        <div></div>
        <div className="flex">
          <Button onClick={handleRun}>Run</Button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </div>
      <MonacoEditor
        defaultValue={props.sql}
        height="100%"
        language="postgres"
        onChange={(value) => {
          setSqlExpression(value!!);
        }}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
  const resultPanel = (
    <div className="h-full">
      <div className="p-1">Result</div>
      <MonacoEditor
        defaultValue={JSON.stringify(sqlResult, null, 2)}
        height="100%"
        language="json"
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
  const loggingPanel = (
    <div className="h-full">
      <div className="p-1">Log</div>

      <LogViewer logs={log} />
    </div>
  );
  const leftPanel = (
    <SqlColumnSelector database={database} schemas={["public", "sharepoint"]} />
  );
  return (
    <LayoutThreeRowsLeftPanelAndResults
      toolbar={toolbar}
      leftPanel={leftPanel}
      rightPanel={rightPanel}
      resultPanel={resultPanel}
      loggingPanel={loggingPanel}
    ></LayoutThreeRowsLeftPanelAndResults>
  );
  return (
    <div className="flex h-full w-full overflow-hidden bg-green-500">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex items-center gap-2 border-b bg-green-800 p-2">
          <LabelWithEditor
            initialValue={name}
            onSave={(value) => {
              setName(value);
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleSave}
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save
          </Button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <div className="flex-1 h-full overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={20} className="overflow-auto h-full">
              <SqlColumnSelector
                database={database}
                schemas={["public", "sharepoint"]}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="h-full">
              <ResizablePanelGroup direction="vertical" className="h-full">
                <ResizablePanel defaultSize={60}>
                  <MonacoEditor
                    defaultValue={props.sql}
                    height="100%"
                    language="postgres"
                    onChange={(value) => {
                      setSqlExpression(value!);
                    }}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                    }}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <div className="flex flex-col h-full">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={handleRun}
                        >
                          <PlayIcon className="mr-2 h-4 w-4" />
                          Run
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          <CircleStopIcon className="mr-2 h-4 w-4" />
                          Stop
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          <Maximize2Icon className="mr-2 h-4 w-4" />
                          Maximize
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8">
                          <FileMinusIcon className="mr-2 h-4 w-4" />
                          Clear
                        </Button>
                        <Button variant="outline" size="sm" className="h-8">
                          <FileCodeIcon className="mr-2 h-4 w-4" />
                          Explain
                        </Button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto border rounded-md p-4 m-4 font-mono text-sm">
                      {JSON.stringify(sqlResult, null, 2)}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
