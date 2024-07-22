import React, {
  useRef,
  DragEvent,
  useState,
  useContext,
  useEffect,
} from "react";
import { Button } from "@/components/ui/button";
import MonacoEditor, { Monaco, useMonaco } from "@monaco-editor/react";
import SqlColumnSelector from "./sql-column-selector";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LabelWithEditor } from "./label-with-editor";
import { SaveIcon } from "lucide-react";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import * as monacoEditor from "monaco-editor"; // Importing the types
import { format } from "sql-formatter";
import { run } from "@/actions/server";
// TypeScript definition for props passed to the icons
interface IconProps extends React.SVGProps<SVGSVGElement> {}

export function SqlQueryEditor(props: {
  database: string;
  sql: string;
  name: string;
  onSave: (sql: string, name: string) => void;
}) {
  const monacoInstance = useMonaco();
  const magicbox = useContext(MagicboxContext);
  const { database } = props;
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [error, seterror] = useState("");
  const [sqlExpression, setsqlExpression] = useState(props.sql);
  const [sqlResult, setsqlResult] = useState<any>();
  const [name, setname] = useState(props.name);
  useEffect(() => {
    setsqlExpression(props.sql);
  }, [props.sql]);

  useEffect(() => {
    // do conditional chaining
    monacoInstance?.languages.typescript.javascriptDefaults.setEagerModelSync(
      true
    );
    // or make sure that it exists by other ways
    if (monacoInstance) {
      console.log("here is the monaco instance:", monacoInstance);
      monacoInstance.languages.register({ id: "postgres" });
      monacoInstance.languages.setMonarchTokensProvider("postgres", {
        tokenizer: {
          root: [
            [
              /(\bSELECT\b|\bFROM\b|\bWHERE\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b)/,
              "keyword",
            ],
            [/--.*$/, "comment"],
            [/\b\d+\b/, "number"],
            [/"[^"]*"/, "string"],
            [/'[^']*'/, "string"],
            [/\b[A-Za-z_][A-Za-z0-9_]*\b/, "identifier"],
          ],
        },
      });

      monacoInstance.languages.setLanguageConfiguration("postgres", {
        comments: {
          lineComment: "--",
        },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"],
        ],
        autoClosingPairs: [
          { open: "(", close: ")" },
          { open: "[", close: "]" },
          { open: "{", close: "}" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
        surroundingPairs: [
          { open: "(", close: ")" },
          { open: "[", close: "]" },
          { open: "{", close: "}" },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
        ],
      });
      // Mock data for tables and columns
      const tables: string[] = ["users", "orders", "products"];
      const columns: Record<string, string[]> = {
        users: ["id", "name", "email"],
        orders: ["id", "user_id", "total"],
        products: ["id", "name", "price"],
      };

      monacoInstance.languages.registerCompletionItemProvider("postgres", {
        provideCompletionItems: (model, position) => {
          const textUntilPosition = model.getValueInRange({
            startLineNumber: 1,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          });

          let suggestions: monacoEditor.languages.CompletionItem[] = [
            {
              range: new monacoEditor.Range(1, 1, 1, 7),
              label: "SELECT",
              kind: monacoEditor.languages.CompletionItemKind.Keyword,
              insertText: "SELECT ",
            },
            {
              range: new monacoEditor.Range(1, 1, 1, 5),
              label: "FROM",
              kind: monacoEditor.languages.CompletionItemKind.Keyword,
              insertText: "FROM ",
            },
            {
              range: new monacoEditor.Range(1, 1, 1, 6),
              label: "WHERE",
              kind: monacoEditor.languages.CompletionItemKind.Keyword,
              insertText: "WHERE ",
            },
            // Add more PostgreSQL-specific keywords as needed
          ];

          // Determine context for additional suggestions
          if (/select\s*$/i.test(textUntilPosition)) {
            // Provide table suggestions after "SELECT"
            suggestions = suggestions.concat(
              tables.map((table) => {
                return {
                  range: new monacoEditor.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column
                  ),
                  label: table,
                  kind: monacoEditor.languages.CompletionItemKind.Keyword,
                  insertText: table,
                  documentation: `Table: ${table}`,
                };
              })
            );
          } else if (/from\s+(\w+)\s*$/i.test(textUntilPosition)) {
            const tableNameMatch = textUntilPosition.match(/from\s+(\w+)\s*$/i);
            if (tableNameMatch) {
              const tableName = tableNameMatch[1];
              if (columns[tableName]) {
                // Provide column suggestions for the specified table
                suggestions = suggestions.concat(
                  columns[tableName].map((column) => ({
                    range: new monacoEditor.Range(
                      position.lineNumber,
                      position.column,
                      position.lineNumber,
                      position.column
                    ),

                    label: column,
                    kind: monacoEditor.languages.CompletionItemKind.Field,
                    insertText: column,
                    documentation: `Column: ${column}`,
                  }))
                );
              }
            }
          }

          return { suggestions: suggestions };
        },
      });

      monacoInstance.editor.addEditorAction({
        id: "format-sql",
        label: "Format SQL",
        keybindings: [
          monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyF,
        ],
        contextMenuGroupId: "1_modification",
        contextMenuOrder: 1.5,
        run: function (ed) {
          const code = ed.getModel()?.getValue();
          const formattedCode = format(code!, { language: "postgresql" });
          ed.getModel()?.setValue(formattedCode);
        },
      });
    }
  }, [monacoInstance]);

  const handleDragStart = (event: DragEvent<HTMLDivElement>, text: string) => {
    event.dataTransfer.setData("text/plain", text);
  };

  const handleRun = async () => {
    if (!sqlExpression) return;

    const result = await run(
      "magic-mix.app",
      ["query", database, sqlExpression],
      "",
      600,
      "x"
    );

    if (result.hasError) {
      if (result.errorMessage === "503") {
        result.errorMessage = "Service unavailable";
      }
      seterror(result.errorMessage ?? "Unknown error");
      return;
    }
    setsqlResult(result.data);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const editor = editorRef.current;
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClickToCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSave = () => {
    props.onSave(sqlExpression, name);
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 border-b bg-background p-2">
          <LabelWithEditor
            initialValue={name}
            onSave={(value) => {
              setname(value);
            }}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => {
              handleSave();
            }}
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save
          </Button>
          {error && <div className="text-red-500">{error}</div>}
        </div>
        <div
          className="flex-1 grid max-h-[calc(100vh-200px)] overflow-scroll "
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ResizablePanelGroup direction="horizontal" className="min-h-full">
            <ResizablePanel
              defaultSize={20}
              className="overflow-auto max-h-full"
            >
              <SqlColumnSelector database={database} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="min-h-full">
              <ResizablePanelGroup direction="vertical" className="min-h-full">
                <ResizablePanel defaultSize={60}>
                  <MonacoEditor
                    defaultValue={props.sql}
                    height="100%"
                    language="postgres"
                    onChange={(value) => {
                      setsqlExpression(value!);
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
                  <div className="border-t p-4">
                    <div className="mb-4 flex items-center justify-between">
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
                    <div className="border rounded-md p-4 font-mono text-sm">
                      {JSON.stringify(sqlResult)}
                      {/* <div className="mb-2 flex items-center justify-between">
                        <span>Query OK, 0 rows affected</span>
                        <span>0.015 sec</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <InfoIcon className="h-4 w-4 text-primary" />
                        <span>No results to display.</span>
                      </div> */}
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

function CheckIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CircleStopIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <rect width="6" height="6" x="9" y="9" />
    </svg>
  );
}

function DatabaseIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function FileCodeIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 12.5 8 15l2 2.5" />
      <path d="m14 12.5 2 2.5-2 2.5" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    </svg>
  );
}

function FileMinusIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M9 15h6" />
    </svg>
  );
}

function FilterIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function InfoIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function LayersIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function Maximize2Icon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" x2="14" y1="3" y2="10" />
      <line x1="3" x2="10" y1="21" y2="14" />
    </svg>
  );
}

function PlayIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function RefreshCcwIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}

function XIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
