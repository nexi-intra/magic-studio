"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/W3RsNOv6mnu
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
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { APPNAME } from "@/app/global";
import Link from "next/link";
import DatabaseTables from "./database-tables";
import { Fragment } from "react";
import DatabaseProcedures from "./database-procedures";
import Databases from "./database-databases";
import { useRouter } from "next/navigation";
import DatabaseQueries from "./database-queries";

export function DatabaseToolbar(props: { database: string }) {
  const { database } = props;
  const router = useRouter();
  return (
    <div className="flex items-center justify-between bg-background px-4 py-2 border-b">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Databases
                visualisation="combobox"
                value={database}
                onChange={function (value: string): void {
                  router.push("/" + APPNAME + "/database/" + value);
                  // throw new Error("Function not implemented.");
                }}
              />
            </TooltipTrigger>
            <TooltipContent>Database</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DatabaseTables
                visualisation="combobox"
                database={database}
                value={""}
                onChange={function (value: string): void {
                  router.push(
                    "/" + APPNAME + "/database/" + database + "/table/" + value
                  );
                }}
              />
            </TooltipTrigger>
            <TooltipContent>Tables</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DatabaseProcedures
                database={database}
                value=""
                onChange={function (value: string): void {
                  router.push(
                    "/" +
                      APPNAME +
                      "/database/" +
                      database +
                      "/procedure/" +
                      value
                  );
                }}
                visualisation={"combobox"}
              />
            </TooltipTrigger>
            <TooltipContent>Procedures</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <DatabaseQueries
                database={database}
                value=""
                onChange={function (value: string): void {
                  router.push(
                    "/" + APPNAME + "/database/" + database + "/query/" + value
                  );
                }}
                visualisation={"combobox"}
              />
            </TooltipTrigger>
            <TooltipContent>Procedures</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Link href={"/" + APPNAME + "/database/" + database + "/query"}>
        <Button className="h-9 px-6">New Query</Button>
      </Link>
    </div>
  );
}

function CodeIcon(props: any) {
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
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function FileTextIcon(props: any) {
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
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

function LayoutGridIcon(props: any) {
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
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
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