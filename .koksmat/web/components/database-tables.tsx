import React, { useEffect, useState } from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import useWorkspaceExec from "./hooks/use-workspace-exec";
import ItemsViewer, { Visualisation } from "./items-viewer";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useRouter } from "next/navigation";
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
export default function DatabaseTables(props: {
  visualisation: Visualisation;
  database: string;

  value: string;
  onChange: (value: string) => void;
}) {
  const { value, onChange, database } = props;
  const [tables, settables] = useState<CommandSelectorItem[]>([]);
  const router = useRouter();
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
      //setdbinfo(query.dataset[0].result);
      const items = query.dataset[0].result.tables.map((item: Table) => {
        const cmd: CommandSelectorItem = {
          id: item.name,
          title: item.name,
          description: item.name,
          children: <div></div>,
          slug: item.name,
        };
        return cmd;
      });

      items.sort((a: any, b: any) => a.title.localeCompare(b.title));
      settables(items);
    }
  }, [database, query.dataset]);
  return (
    <ItemsViewer
      visualisation={props.visualisation}
      value={value}
      placeholder="Tables"
      commands={tables ? tables : []}
      onSelect={(command) => {
        onChange(command.id);
      }}
    />
  );
}
