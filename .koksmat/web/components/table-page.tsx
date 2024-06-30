/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/T0JY6jP55vu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { DM_Sans } from 'next/font/google'
import { Archivo } from 'next/font/google'

dm_sans({
  subsets: ['latin'],
  display: 'swap',
})

archivo({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useMemo } from "react";
import { APPNAME } from "@/app/global";
export interface Root {
  Result: Result[];
}

export interface Result {
  table_metadata: TableMetadata;
}

export interface TableMetadata {
  table_name: string;
  row_count: number;
  disk_size: string;
  columns: Column[];
  referencing_functions: ReferencingFunction[];
}

export interface Column {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default?: string;
}

export interface ReferencingFunction {
  function_name: string;
  function_definition: string;
}

export function TablePage(props: { database: string; table: string }) {
  const { database, table } = props;
  const query = useSQLSelect3<Result>(
    database,
    `
WITH table_info AS (
    -- Query to get number of records in the table
    SELECT
        (SELECT reltuples::bigint AS row_count
         FROM pg_class
         WHERE relname = '${table}' AND relkind = 'r') AS row_count,
    -- Query to get disk size of the table
    (SELECT pg_size_pretty(pg_total_relation_size('${table}'))) AS disk_size,
    -- Query to get column definitions
    (SELECT json_agg(cols)
     FROM (
         SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_name = '${table}'
     ) cols) AS columns,
    -- Query to get functions and stored procedures referencing the table
    (SELECT json_agg(procedures)
     FROM (
         SELECT p.proname AS function_name,
                pg_catalog.pg_get_functiondef(p.oid) AS function_definition
         FROM pg_catalog.pg_proc p
         JOIN pg_catalog.pg_depend d ON d.objid = p.oid
         JOIN pg_catalog.pg_rewrite r ON r.oid = d.refobjid
         JOIN pg_catalog.pg_class c ON c.oid = r.ev_class
         WHERE d.refobjid = '${table}'::regclass
           AND d.classid = 'pg_class'::regclass
           AND d.refclassid = 'pg_class'::regclass
           AND r.ev_type = '1' -- NORMAL type of dependency
         UNION
         SELECT p.proname AS function_name,
                pg_catalog.pg_get_functiondef(p.oid) AS function_definition
         FROM pg_catalog.pg_proc p
         WHERE p.prosrc ~ '${table}' -- Check for direct reference in function body
     ) procedures) AS referencing_functions
)

-- Constructing the final JSON object
SELECT json_build_object(
    'table_name', '${table}',
    'row_count', (SELECT row_count FROM table_info),
    'disk_size', (SELECT disk_size FROM table_info),
    'columns', (SELECT columns FROM table_info),
    'referencing_functions', (SELECT referencing_functions FROM table_info)
) AS table_metadata

    `
  );

  const tableMetadata = useMemo<TableMetadata>(() => {
    let metadata: TableMetadata = {
      table_name: "",
      row_count: 0,
      disk_size: "",
      columns: [],
      referencing_functions: [],
    };
    if (query.dataset.length > 0) {
      metadata = query.dataset[0].table_metadata;
    }
    return metadata;
  }, [database, table, query.dataset]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 lg:p-10">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">{tableMetadata.table_name}</h1>
          <p className="text-muted-foreground">
            Detailed information about the table.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={
              "/" +
              APPNAME +
              "/database/" +
              database +
              "/table/" +
              table +
              "/item"
            }
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Items
          </Link>
          <Link
            href={
              "/" +
              APPNAME +
              "/database/" +
              database +
              "/table/" +
              table +
              "/procedure"
            }
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <CodeIcon className="mr-2 h-4 w-4" />
            View Procedures
          </Link>
        </div>
      </div>
      <div className="grid gap-6 rounded-lg border bg-background p-6 md:p-8 lg:p-10">
        <div className="grid gap-2">
          <h2 className="text-xl font-bold">Table Details</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="grid gap-1">
              <p className="text-muted-foreground">Items</p>
              <p className="font-medium">{tableMetadata.row_count}</p>
            </div>
            <div className="grid gap-1">
              <p className="text-muted-foreground">Columns</p>
              <p className="font-medium">{tableMetadata.columns.length}</p>
            </div>
            <div className="grid gap-1">
              <p className="text-muted-foreground">Procedures</p>
              <p className="font-medium">
                {tableMetadata.referencing_functions.length}
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-muted-foreground">Disk size</p>
              <p className="font-medium">{tableMetadata.disk_size}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <h2 className="text-xl font-bold">Columns</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Nullable</TableHead>
                <TableHead>Default</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableMetadata.columns.map((column, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {column.column_name}
                    </TableCell>
                    <TableCell>{column.data_type}</TableCell>
                    <TableCell>{column.is_nullable}</TableCell>
                    <TableCell>{column.column_default}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
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

function EyeIcon(props: any) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
