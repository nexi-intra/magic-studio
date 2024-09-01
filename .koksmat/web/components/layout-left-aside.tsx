"use client";

import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ResizableLayout(props: {
  onMobileChange: (ismobile: boolean) => void;
  onCollapseChange: (collapsed: boolean) => void;
  breadcrumb: React.ReactNode;
  topnav: React.ReactNode;
  shop: React.ReactNode;
  leftnav: React.ReactNode;
  leftfooter?: React.ReactNode;
  centerfooter?: React.ReactNode;
  rightfooter?: React.ReactNode;
  children: React.ReactNode;
}): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    props.onMobileChange(isMobile);
  }, [isMobile]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically the breakpoint for medium screens
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleCollapse = () => {
    setIsCollapsed(true);
    props.onCollapseChange(true);
  };

  const handleExpand = () => {
    setIsCollapsed(false);
    props.onCollapseChange(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b h-16 flex items-center px-4">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[385px]">
              <div className="h-full py-6 pr-6">{props.leftnav}</div>
            </SheetContent>
          </Sheet>
        )}
        {props.topnav}
        {props.shop}
      </header>

      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {!isMobile && (
          <>
            <ResizablePanel
              defaultSize={4}
              collapsible={true}
              minSize={15}
              maxSize={20}
              collapsedSize={4}
              onCollapse={handleCollapse}
              onExpand={handleExpand}
              className="bg-muted"
            >
              <div className="flex items-center justify-center h-full">
                {props.leftnav}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        )}

        <ResizablePanel defaultSize={isMobile ? 100 : 80}>
          <main className="h-full overflow-auto relative">
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="px-4 py-3">{props.breadcrumb}</div>
            </div>

            <div className="p-4 flex">{props.children}</div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>

      <footer className="bg-muted border-t h-12 flex items-center justify-between px-4">
        <div>{props.leftfooter}</div>
        <div>{props.centerfooter}</div>
        <div>{props.rightfooter}</div>
      </footer>
    </div>
  );
}
