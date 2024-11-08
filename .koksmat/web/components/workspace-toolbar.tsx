/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/cLMyS878GeK
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
"use client";

import React, { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";

import { useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";
import { ConnectionStatus } from "./connection-status";
import useKitchens, { Kitchen } from "./hooks/use-kitchens";
import { CommandSelector } from "./command-selector";
import GitOrganizations from "./git-organisations";
import GitRepos from "./git-repos";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import KoksmatInstallGuide from "./koksmat-install-guide";
import { Terminal } from "./terminal";
import useWorkspaceConnectionStatus from "./hooks/use-workspace-connectionstatus";
import { WorkspaceContext } from "./contexts/workspacecontext";
import Link from "next/link";

export type ConnectionStatusType = "connected" | "disconnected" | "unknown";

export function WorkspaceToolbar() {
  const magicbox = useContext(MagicboxContext);
  const workspaceContext = useContext(WorkspaceContext);
  const workspacekey = workspaceContext.workspaceId;
  const [studioUrl, setstudioUrl] = useState("");
  const connectionStatus = useWorkspaceConnectionStatus(workspacekey);
  const kitchens = useKitchens(workspacekey);
  const router = useRouter();
  const workspaces = useSQLSelect3(
    "mix",
    `
SELECT W.name as title, W.description, W.key as slug FROM workspace as W LEFT JOIN public.user as U ON W.user_id = U.id 
WHERE U.email = '${magicbox?.user?.email}'`
  );

  const handleWorkspaceClick = (slug: string) => {
    router.push("/" + APPNAME + "/workspace/" + slug);

    // const workspace = workspaces.dataset.find((workspace: any) => workspace.slug === slug);
    // console.log("workspace", workspace);
  };
  useEffect(() => {
    setstudioUrl(window.location.origin);
  }, []);

  return (
    <div className="flex  justify-between p-2 border-b w-full">
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <WorkflowIcon className="w-4 h-4" />
              Workspace
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {workspaces?.dataset?.map((workspace: any, key) => {
              return (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    handleWorkspaceClick(workspace.slug);
                  }}
                >
                  <WorkflowIcon className="w-4 h-4 mr-2" />
                  {workspace.title}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <CommandSelector
          placeholder="Kitchens"
          onSelect={(command) => {
            debugger;
            router.push(
              "/" +
                APPNAME +
                "/workspace/" +
                workspacekey +
                "/kitchen/" +
                command.slug
            );
            //handleWorkspaceClick(command.slug);
          }}
          commands={kitchens.map((kitchen) => {
            return {
              id: kitchen.name,
              title: kitchen.name,
              description: kitchen.description,
              slug: kitchen.name,
            };
          })}
        />
        {InstallGuide()}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Terminal</Button>
          </PopoverTrigger>
          <PopoverContent className="w-[90vw]">
            <Terminal workspace_id={workspacekey} kitchen_root={""} />
          </PopoverContent>
        </Popover>
        <Button variant="outline">
          <Link
            href={"/" + APPNAME + "/workspace/" + workspacekey + "/kubernetes"}
          >
            Kubernetes
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
      </div>
      <div className="grow"></div>
      <ConnectionStatus connectionStatus={connectionStatus} showText />
      <Button
        className="ml-3"
        onClick={() => {
          magicbox.setCurrentWorkspace(workspacekey);
        }}
      >
        Set as current
      </Button>
    </div>
  );

  function InstallGuide() {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Connect</Button>
        </PopoverTrigger>
        <PopoverContent className="w-[500px]">
          <KoksmatInstallGuide studioUrl={studioUrl} id={workspacekey} />
        </PopoverContent>
      </Popover>
    );
  }
}

function ChevronDownIcon(props: any) {
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

function SearchIcon(props: any) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function WorkflowIcon(props: any) {
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
      <rect width="8" height="8" x="3" y="3" rx="2" />
      <path d="M7 11v4a2 2 0 0 0 2 2h4" />
      <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
  );
}

function XIcon(props: any) {
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
