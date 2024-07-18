"use client";
import React, { useRef, DragEvent, useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import SqlColumnSelector from "./sql-column-selector";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { LabelWithEditor } from "./label-with-editor";
import { SaveIcon } from "lucide-react";
import { execute } from "@/components/actions/execute2";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

// TypeScript definition for props passed to the icons
interface IconProps extends React.SVGProps<SVGSVGElement> {}

export function SqlQueryEditor(props: { database: string }) {
  const magicbox = useContext(MagicboxContext);
  const { database } = props;
  const editorRef = useRef<Monaco | null>(null);
  const [error, seterror] = useState("");

  const handleDragStart = (event: DragEvent<HTMLDivElement>, text: string) => {
    event.dataTransfer.setData("text/plain", text);
  };

  async function create_sqlquery(
    connection_id: number,
    description: string,
    name: string,
    schema: { [key: string]: any },
    sql: string
  ) {
    const token = magicbox.authtoken;
    const result = await execute(
      token,
      "mix",
      "magic-mix.app",
      "create_sqlquery",
      {
        name,
        description,
        sql,
        schema,
        connection_id,
        tenant: "",
        searchindex: "name:" + name,
      }
    );
    if (result.hasError) {
      seterror(result.errorMessage ?? "An error occured");
      return;
    }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const text = event.dataTransfer.getData("text/plain");
    const editor = editorRef.current;
    // if (editor) {
    //   const position = editor.getModel()?.getPositionAt(0);
    //   editor.executeEdits("", [
    //     {
    //       range: new monaco.Range(
    //         position.lineNumber,
    //         position.column,
    //         position.lineNumber,
    //         position.column
    //       ),
    //       text,
    //     },
    //   ]);
    // }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleClickToCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleEditorDidMount = (editor: Monaco) => {
    editorRef.current = editor;
  };

  const handleSave = () => {
    create_sqlquery(1, "description", "name", { schema: "schema" }, "sql");
  };
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* <div className="flex flex-col w-72 border-r bg-muted">
        <div className="flex items-center gap-2 border-b p-2">
          <Input
            type="search"
            placeholder="Filter tables..."
            className="h-8 w-full rounded-md border border-border px-2"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-md p-0"
          >
            <FilterIcon className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        <div className="flex items-center justify-between border-b p-2">
          <span className="font-medium">Tables</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-md p-0"
              >
                <LayersIcon className="h-4 w-4" />
                <span className="sr-only">Group by</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <div>
                  <CheckIcon className="h-4 w-4" />
                </div>
                Namespace
              </DropdownMenuItem>
              <DropdownMenuItem>None</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <Collapsible open>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 font-medium hover:bg-muted/50">
              <span>public</span>
              <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-1 px-4">
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50">
                    <span>users</span>
                    <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-1 px-4">
                      {["id", "name", "email"].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 cursor-grab"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={() => handleClickToCopy(item)}
                        >
                          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50">
                    <span>products</span>
                    <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-1 px-4">
                      {["id", "name", "price"].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 cursor-grab"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={() => handleClickToCopy(item)}
                        >
                          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50">
                    <span>orders</span>
                    <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-1 px-4">
                      {["id", "user_id", "total"].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 cursor-grab"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={() => handleClickToCopy(item)}
                        >
                          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 font-medium hover:bg-muted/50">
              <span>sales</span>
              <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid gap-1 px-4">
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50">
                    <span>orders</span>
                    <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-1 px-4">
                      {["id", "customer_id", "total"].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 cursor-grab"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={() => handleClickToCopy(item)}
                        >
                          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-muted/50">
                    <span>customers</span>
                    <ChevronRightIcon className="h-4 w-4 transition [&[data-state=open]>*]:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-1 px-4">
                      {["id", "name", "email"].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/50 cursor-grab"
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onClick={() => handleClickToCopy(item)}
                        >
                          <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div> */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 border-b bg-background p-2">
          <LabelWithEditor initialValue="Unnamed" onSave={(value) => {}} />
          {/* <Button variant="outline" size="sm" className="h-8">
            <RefreshCcwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button> */}
          {/* <Button variant="outline" size="sm" className="h-8">
            <DatabaseIcon className="mr-2 h-4 w-4" />
            New Query
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <FileMinusIcon className="mr-2 h-4 w-4" />
            Close
          </Button> */}
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
          {/* <Button variant="outline" size="sm" className="h-8">
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Import
          </Button> */}
        </div>
        <div
          className="flex-1 grid"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20}>
              <SqlColumnSelector database={database} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60}>
                  {" "}
                  <MonacoEditor
                    height="100%"
                    language="sql"
                    //editorDidMount={handleEditorDidMount}
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
                        <Button variant="outline" size="sm" className="h-8">
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
                      <div className="mb-2 flex items-center justify-between">
                        <span>Query OK, 0 rows affected</span>
                        <span>0.015 sec</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <InfoIcon className="h-4 w-4 text-primary" />
                        <span>No results to display.</span>
                      </div>
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
