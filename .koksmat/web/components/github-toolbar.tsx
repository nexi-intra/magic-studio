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

import React, { useContext } from "react";
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
import { Kitchen } from "./hooks/use-kitchens";
import { CommandSelector } from "./command-selector";
import GitOrganizations from "./git-organisations";
import GitRepos from "./git-repos";

export type ConnectionStatusType = "connected" | "disconnected" | "unknown";

export function GitHubToolbar(props: {
  workspacekey: string;
  connectionStatus: ConnectionStatusType;
}) {
  const magicbox = useContext(MagicboxContext);

  const router = useRouter();

  return (
    <div className="flex  justify-between p-2 border-b w-full">
      <div className="flex items-center gap-4">
        <GitOrganizations
          visualisation="combobox"
          workspaceId={magicbox.currentWorkspace}
          value={magicbox.currentOrganization}
          onChange={function (value: string): void {
            magicbox.setCurrentOrganization(value);
          }}
        />
        <GitRepos
          visualisation="combobox"
          workspaceId={magicbox.currentWorkspace}
          value={magicbox.currentOrganization}
          onChange={function (value: string): void {
            magicbox.setCurrentRepository(value);
          }}
          organisation={magicbox.currentOrganization}
        />

        <Separator orientation="vertical" className="h-6" />
      </div>
      <div className="grow"></div>
    </div>
  );
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
