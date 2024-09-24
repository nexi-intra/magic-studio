"use client";

import React, { useRef, useState, useContext, useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import LogViewer, { LogObject } from "@/components/log-viewer";

import { useSavedQueries } from "@/components/useSavedQueries";
import { usePathname, useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";

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
  params: { database: string, slug: string[] };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { database, slug } = props.params;
  const [error, setError] = useState("");
  const [log, setlog] = useState<LogObject[]>([]);
  const { viewSavedQueries } = useSavedQueries(database, {
    allowSwitch: true, onSelect: (query) => {
      //alert(query)
      const newUrl = "/" + APPNAME + "/database/" + database + "/query/" + query
      router.push(newUrl)
    }
  })


  return (
    <div>
      {/* {toolbar} */}
      <ResizablePanelGroup direction="vertical" className="h-full w-full min-h-screen min-w-full overflow-scroll">

        <ResizablePanel >
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20}>
              {viewSavedQueries}
              {/* <SqlColumnSelector database={database} schemas={["public", "sharepoint"]} /> */}

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
