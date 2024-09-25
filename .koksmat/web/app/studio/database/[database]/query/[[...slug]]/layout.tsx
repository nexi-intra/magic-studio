"use client";

import React, { useRef, useState, useContext, useEffect, useMemo } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import LogViewer, { LogObject } from "@/components/log-viewer";

import { useSavedQueries } from "@/components/useSavedQueries";
import { usePathname, useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";
import SqlColumnSelector from "@/components/sql-column-selector";
import { SqlQueryProvider, useSqlQueryContext } from "@/components/contexts/sqlquery-context";
import ItemsViewer from "@/components/items-viewer";

interface ResizableLayoutProps {
  toolbar?: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  resultPanel: React.ReactNode;
  loggingPanel: React.ReactNode;
}

export interface SqlQueryEditorOptions { }


export default function Layout(props: {
  children: React.ReactNode;
  params: { database: string };
}) {
  const sqlQueryContext = useSqlQueryContext()
  const router = useRouter();
  const pathname = usePathname();
  const { database } = props.params;
  const [error, setError] = useState("");
  const [log, setlog] = useState<LogObject[]>([]);


  return (
    <div>

      {/* {toolbar} */}

      <ResizablePanelGroup direction="vertical" className="h-full w-full min-h-screen min-w-full overflow-scroll">

        <ResizablePanel >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={50}>
                  <ItemsViewer
                    allowSwitch={true}
                    visualisation="history"
                    allowedVisualizations={["history", "list", "table", "cards"]}
                    value=""
                    placeholder="Queries"
                    commands={sqlQueryContext.sqlQuerys}
                    onSelect={(command) => {
                      const newUrl = "/" + APPNAME + "/database/" + database + "/query/" + command.id
                      router.push(newUrl)
                    }} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <SqlColumnSelector database={database} schemas={["public", "sharepoint"]} />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={80}>
              {props.children}
            </ResizablePanel>
            {/* Right panel */}

          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>

  );
}
