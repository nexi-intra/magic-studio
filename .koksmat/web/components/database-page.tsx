/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/KGopzr55wv4
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'
import { Rubik } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

rubik({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useEffect, useState } from "react";
import { APPNAME } from "@/app/global";
import { ERDiagram } from "./mermaid-diagram";
import { DatabaseToolbar } from "./database-toolbar";

export interface Root {
  Result: Result[];
}

export interface Result {
  result: Result2;
}

export interface Result2 {
  database_overview: DatabaseOverview;
  tables: Table[];
  stored_procedures: string[];
}

export interface DatabaseOverview {
  tables: number;
  size_on_disk: string;
  total_records: number;
}

export interface Table {
  name: string;
  records: number;
  size: string;
}

export function DatabasePage(props: { database: string }) {
  const { database } = props;
  const sql = `
WITH
-- Get total number of tables
total_tables AS (
    SELECT count(*) AS count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
),
-- Get total size of the database
total_size AS (
    SELECT pg_size_pretty(pg_database_size(current_database())) AS size
),
-- Get total number of records
total_records AS (
    SELECT SUM(reltuples)::bigint AS count
    FROM pg_class
    WHERE relkind = 'r' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
),
-- Get table details
table_details AS (
    SELECT
        c.relname AS table_name,
        c.reltuples::bigint AS records,
        pg_size_pretty(pg_total_relation_size(c.oid)) AS size
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'r' AND n.nspname = 'public'
    ORDER BY c.relname
),
-- Get stored procedures
stored_procedures AS (
    SELECT proname AS procedure_name
    FROM pg_proc
    JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
    WHERE ns.nspname = 'proc' AND pg_proc.prokind IN ('p', 'f')
)
-- Combine all results into one JSON object
SELECT json_build_object(
    'database_overview', json_build_object(
        'tables', (SELECT count FROM total_tables),
        'size_on_disk', (SELECT size FROM total_size),
        'total_records', (SELECT count FROM total_records)
    ),
    'tables', (SELECT json_agg(json_build_object(
        'name', table_name,
        'records', records,
        'size', size
    )) FROM table_details),
    'stored_procedures', (SELECT json_agg(procedure_name) FROM stored_procedures)
) AS result

  
  `;
  const [dbinfo, setdbinfo] = useState<Result2>();
  const query = useSQLSelect3<Result>(database, sql);
  useEffect(() => {
    if (query && query.dataset && query.dataset.length > 0) {
      setdbinfo(query.dataset[0].result);
    }
  }, [database, query]);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
      <header className="border-b bg-background  py-3 shadow-sm sm:px-6">
        <div className=" mx-auto flex items-center justify-between">
          <div className="w-full flex items-center ">
            <span className="font-bold text-3xl">{database.toUpperCase()}</span>
            <DatabaseToolbar database={database} />
            {/* <span className="text-muted-foreground">Procedure Name</span> */}
          </div>
          <div className="flex items-center gap-4">
            {/* <Button variant="outline">
              <PlayIcon className="mr-2 h-4 w-4" />
              Run
            </Button>
            <Button
              disabled={isProcessing}
              onClick={() => handleShareCreateBite()}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button> */}
          </div>
        </div>
      </header>
      <ERDiagram database={database} className="bg-slate-50" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tables</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dbinfo?.tables
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((table, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <Link
                          href={
                            "/" +
                            APPNAME +
                            "/database/" +
                            database +
                            "/table/" +
                            table.name +
                            "/item"
                          }
                          className="text-blue-600 hover:underline"
                          prefetch={false}
                        >
                          {table.name}
                        </Link>
                      </TableCell>
                      <TableCell>{table.records}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="icon">
                          <ArrowRightIcon className="h-4 w-4" />
                          <span className="sr-only">View Table</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stored Procedures</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {dbinfo?.stored_procedures
              ?.sort((a, b) => a.localeCompare(b))
              .map((procedure, index) => (
                <div key={index}>
                  {" "}
                  <Link
                    href={
                      "/" +
                      APPNAME +
                      "/database/" +
                      database +
                      "/procedure/" +
                      procedure
                    }
                    className="text-blue-600 hover:underline"
                    prefetch={false}
                  >
                    {procedure}
                  </Link>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Database Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span>Tables</span>
              <span className="font-medium">
                {dbinfo?.database_overview.tables}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Size on Disk</span>
              <span className="font-medium">
                {dbinfo?.database_overview.size_on_disk}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Records</span>
              <span className="font-medium">
                {dbinfo?.database_overview.total_records}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href={"/" + APPNAME + "/database/" + database + "/roles"}>
              <Button variant="link" size="sm">
                Manage Access Control
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              View Audit Log
            </Button>
            <Button variant="outline" size="sm">
              Export SQL Script
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ArrowRightIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
