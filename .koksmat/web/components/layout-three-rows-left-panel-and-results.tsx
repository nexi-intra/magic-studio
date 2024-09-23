import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResizableLayoutProps {
  toolbar?: React.ReactNode;
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  resultPanel: React.ReactNode;
  loggingPanel: React.ReactNode;
}

export default function LayoutThreeRowsLeftPanelAndResults(
  {
    toolbar,
    leftPanel,
    rightPanel,
    resultPanel,
    loggingPanel,
  }: ResizableLayoutProps = {
      toolbar: <div>Toolbar</div>,
      leftPanel: <div>Left Panel</div>,
      rightPanel: <div>Right Panel</div>,
      resultPanel: <div>Result Panel</div>,
      loggingPanel: <div>Logging Panel</div>,
    }
) {
  return (
    <div className="w-full h-full min-h-[80vh] bg-fuchsia-300 border rounded-lg overflow-hidden">
      <ResizablePanelGroup direction="vertical">
        {/* Toolbar */}
        <ResizablePanel defaultSize={10} minSize={10} maxSize={10}>
          <div className="h-16 bg-muted p-2">{toolbar}</div>
        </ResizablePanel>
        {/* <ResizableHandle withHandle /> */}
        {/* Main content area */}
        <ResizablePanel defaultSize={90}>
          <ResizablePanelGroup direction="horizontal">
            {/* Left panel */}
            <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
              <ScrollArea className="h-full">
                <div className="p-0">{leftPanel}</div>
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            {/* Right panel */}

            <ResizablePanel defaultSize={80}>
              <ResizablePanelGroup direction="vertical">
                {/* Upper right panel */}
                <ResizablePanel defaultSize={50}>
                  <div className="h-full p-0">{rightPanel}</div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                {/* Lower right panel */}
                {resultPanel && loggingPanel && (
                  <ResizablePanel defaultSize={50}>
                    <ResizablePanelGroup direction="horizontal">
                      {/* Result panel */}
                      {resultPanel && (
                        <ResizablePanel defaultSize={50}>
                          <div className="h-full p-0">{resultPanel}</div>
                        </ResizablePanel>
                      )}
                      <ResizableHandle withHandle />

                      {/* Logging panel */}
                      <ResizablePanel
                        defaultSize={50}
                        collapsible
                        collapsedSize={5}
                      >
                        <div className="h-full p-0">{loggingPanel}</div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </ResizablePanel>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
