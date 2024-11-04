"use client";

import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { run } from "@/actions/server";
import { LogObject } from "./log-viewer";
import { useInterfaceFromJson } from "./hooks/useInterfaceFromJson";

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
  onChange: (newSql: string) => void;
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
  const interfaceGenerator = useInterfaceFromJson(""); // todo: consider using a better name

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
    interfaceGenerator.setjson(JSON.stringify(result.data.Result, null, 2))
    setlog([...log, logEntry]);
    setSqlResult(logEntry.result);
  };

  return (
    <div>
      {toolbar}
      <ResizablePanelGroup direction="vertical" className="h-full w-full min-h-screen min-w-full overflow-scroll">


        <ResizablePanel defaultSize={50} >
          <div className="min-v-[20vw] min-h-[80vh]">
            <div className="p-2 flex bg-slate-100 ">

              <div className="flex">
                <Button onClick={handleRun}>Run</Button>

                {error && <div className="pl-3 text-red-500">{error}</div>}
              </div>
            </div>

            <div className="h-full min-h-[40vh]">
              <MonacoEditor
                //defaultValue={props.sql}
                value={props.sql}
                height="100vh"
                language="sql"
                onChange={(value) => {
                  setSqlExpression(value!!);
                  props.onChange(value!!);
                }}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  scrollBeyondLastLine: true,
                }}
              />
            </div>
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
                {!sqlResult &&
                  (
                    // like to use tailwindcss to center the text horizontally and vertically

                    <div className="flex items-center justify-center h-full" >Run to get the result</div>
                  )

                }
                {sqlResult && (
                  <MonacoEditor
                    //defaultValue={sqlResult}
                    value={sqlResult}
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      scrollBeyondLastLine: true,
                    }}
                  />
                )}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="h-full">
                <div className="p-2 bg-slate-100">
                  Interface
                </div>
                {!interfaceGenerator.interfaceDefintions &&
                  (
                    // like to use tailwindcss to center the text horizontally and vertically

                    <div className="flex items-center justify-center h-full" >Run to get the interface definition</div>
                  )

                }

                {interfaceGenerator.interfaceDefintions && (<MonacoEditor
                  //defaultValue={sqlResult}
                  value={interfaceGenerator.interfaceDefintions}
                  height="100%"
                  language="typescript"
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: true,
                  }} />
                )}
                {/* <LogViewer logs={log} /> */}

              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

    </div>

  );
}
