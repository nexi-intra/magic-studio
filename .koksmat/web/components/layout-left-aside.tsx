"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChevronRight, Home } from "lucide-react";
import TabNavigatorWithReorder from "./tab-navigator-with-reorder";

// Breadcrumb component
const Breadcrumb: React.FC = () => (
  <nav
    aria-label="Breadcrumb"
    className="flex items-center space-x-1 text-sm text-muted-foreground"
  >
    <Home className="h-4 w-4" />
    <ChevronRight className="h-4 w-4" />
    <span>Main Content</span>
    <ChevronRight className="h-4 w-4" />
    <span className="font-medium text-foreground">Current Page</span>
  </nav>
);

// Scroller component with scroll spy
interface ScrollerProps {
  sections: string[];
}

const Scroller: React.FC<ScrollerProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="flex flex-col space-y-2">
      {sections.map((section) => (
        <button
          key={section}
          onClick={() => scrollToSection(section)}
          className={`text-sm px-3 py-1 rounded-md transition-colors ${
            activeSection === section
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {section}
        </button>
      ))}
    </nav>
  );
};

export default function ResizableLayout(props: {
  onCollapseChange: (collapsed: boolean) => void;
  breadcrumb: any;
  topnav: any;
  shop: any;
  leftnav: any;
  leftfooter?: any;
  rightfooter?: any;
  children: React.ReactElement;
}): React.ReactElement {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const sections = [
    "Introduction",
    "Section 1",
    "Section 2",
    "Section 3",
    "Conclusion",
  ];

  const handleCollapse = React.useCallback(() => {
    setIsCollapsed(true);
    props.onCollapseChange(true);
  }, []);

  const handleExpand = React.useCallback(() => {
    props.onCollapseChange(false);
    setIsCollapsed(false);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-50 bg-background border-b h-16 flex items-center px-4">
        {/* <h1 className="text-xl font-bold">Resizable Layout with Scroll Spy</h1> */}
        {props.topnav}
        {props.shop}
      </header>

      {/* Resizable Content Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {/* Left Aside */}
        <ResizablePanel
          defaultSize={3}
          collapsible={true}
          minSize={15}
          maxSize={20}
          collapsedSize={3}
          onCollapse={handleCollapse}
          onExpand={handleExpand}
          className="bg-muted"
        >
          <div className="flex items-center justify-center h-full">
            {/* <p className={isCollapsed ? "rotate-90" : ""}>
              {isCollapsed ? "Aside (Collapsed)" : "Aside"}
            </p> */}
            {props.leftnav}
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content Area */}
        <ResizablePanel defaultSize={80}>
          <main className="h-full overflow-auto relative">
            {/* Sticky Breadcrumb */}
            <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
              <div className="px-4 py-3">
                {/* <Breadcrumb /> */}
                {props.breadcrumb}
              </div>
            </div>

            {/* Main Content with Sticky Scroller */}
            <div className="p-4 flex">
              {props.children}
              {/* <div className="flex-grow pr-4">
                <h2 className="text-2xl font-semibold mb-4">Main Content</h2>
                <p>
                  This is the main content area with scroll spy functionality.
                  The scroller on the right will highlight the current section
                  as you scroll.
                </p>
                {sections.map((section, index) => (
                  <div key={section} id={section} className="mt-8">
                    <h3 className="text-xl font-semibold mb-2">{section}</h3>
                    <p>Content for {section}.</p>
                    {Array.from({ length: 10 }, (_, i) => (
                      <p key={i} className="mt-4">
                        Paragraph {i + 1} in {section}
                      </p>
                    ))}
                  </div>
                ))}
              </div> */}
              {/* Sticky Scroller with Scroll Spy */}
              {/* <div className="w-48 sticky top-16 self-start">
                <Scroller sections={sections} />
              </div> */}
            </div>
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Footer */}
      <footer className="bg-muted border-t h-12 flex items-center justify-center">
        <div>{props.leftfooter}</div>
        <div>{props.rightfooter}</div>
      </footer>
    </div>
  );
}
