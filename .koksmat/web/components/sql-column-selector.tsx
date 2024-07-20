"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { CommandSelectorItem } from "./command-selector";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import WithClipboardCopy from "./with-clipboardcopy";
import { Table, Table2Icon } from "lucide-react";

function Column(props: { column: ColumnsInfo }) {
  const [copiedColumn, setCopiedColumn] = useState<string | null>(null);
  const [hoovering, sethoovering] = useState(false);
  const handleCopy = (columnName: string) => {
    navigator.clipboard.writeText(columnName);
    setCopiedColumn(columnName);
    setTimeout(() => setCopiedColumn(null), 2000);
  };
  const { column } = props;
  return (
    <div
      className="flex items-center gap-2 justify-between"
      onMouseEnter={() => sethoovering(true)}
      onMouseLeave={() => sethoovering(false)}
    >
      <div className="flex items-center gap-2">
        {/* <span>{column.icon}</span> */}
        <WithClipboardCopy text={column.column_name}>
          {column.column_name}
        </WithClipboardCopy>
      </div>
    </div>
  );
}
export interface Root {
  Result: Result[];
}

export interface Result {
  table_name: string;
  columns_info: ColumnsInfo[];
}

export interface ColumnsInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  character_maximum_length: any;
  numeric_precision?: number;
  numeric_scale?: number;
}

export default function SqlColumnSelector(props: { database: string }) {
  const { database } = props;
  const sql = `
  SELECT
    table_name,
        columns_info
  
FROM (
    SELECT
        table_name,
        json_agg(json_build_object(
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable,
            'character_maximum_length', character_maximum_length,
            'numeric_precision', numeric_precision,
            'numeric_scale', numeric_scale
        )) AS columns_info
    FROM
        information_schema.columns
    WHERE
        table_schema = 'public' -- replace with your schema if different
    GROUP BY
        table_name
) subquery

  
    
    `;
  const query = useSQLSelect3<Result>(database, sql);

  return (
    <aside className="flex flex-col gap-4 bg-muted/40 p-4 rounded-lg max-h-full overflow-scroll">
      <Accordion type="multiple">
        {query.dataset.map((table, index) => (
          <AccordionItem value={table.table_name} key={index}>
            <AccordionTrigger>
              <div className="flex ">
                <div className="text-l">
                  <WithClipboardCopy text={table.table_name}>
                    <Table className="h-4 w-4" /> {table.table_name}
                  </WithClipboardCopy>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {table.columns_info.map((column) => (
                <div
                  key={column.column_name}
                  className="ml-6 flex items-center gap-2 justify-between"
                >
                  <Column column={column} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
