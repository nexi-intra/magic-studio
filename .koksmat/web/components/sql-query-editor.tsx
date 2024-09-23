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
import { ScrollArea } from "./ui/scroll-area";

interface ResizableLayoutProps {
  toolbar?: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  resultPanel: React.ReactNode;
  loggingPanel: React.ReactNode;
}

export interface SqlQueryEditorOptions { }
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
    const result = await run<any>(
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
      result: "",
    };

    if (result.hasError) {
      setError(result.errorMessage ?? "Unknown error");
      logEntry.error = result.errorMessage ?? "Unknown error";
      setlog([...log, logEntry]);
      return;
    }
    logEntry.result = JSON.stringify(result.data.Result, null, 2);
    setlog([...log, logEntry]);
    setSqlResult(logEntry.result);
  };

  const handleSave = () => {
    props.onSave(sqlExpression, name);
  };






  return (

    <ResizablePanelGroup direction="vertical" className="h-full w-full min-h-screen min-w-full overflow-scroll">

      <ResizablePanel >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20}>
            <SqlColumnSelector database={database} schemas={["public", "sharepoint"]} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel >
                <div className="min-v-[20vw] min-h-[80vh] bg-green-300">
                  <div className="p-2 flex bg-slate-100 ">
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
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <ResizablePanelGroup direction="horizontal" >
                  <ResizablePanel defaultSize={50}>
                    <div className="h-full">
                      <div className="p-2 bg-slate-100">
                        Result
                      </div>
                      <MonacoEditor
                        //defaultValue={sqlResult}
                        value={sqlResult}
                        height="100%"
                        language="json"
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="">
                      <div className="p-2 bg-slate-100">
                        Log
                      </div>


                      <LogViewer logs={log} />
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          {/* Right panel */}

        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>


  );
}
