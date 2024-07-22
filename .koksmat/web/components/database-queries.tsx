import React, { useEffect, useState } from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import useWorkspaceExec from "./hooks/use-workspace-exec";
import ItemsViewer, { Visualisation } from "./items-viewer";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { DatabaseProps } from "./dashboard-databases";

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
export default function DatabaseQueries(props: {
  visualisation: Visualisation;
  database: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { value, onChange, database } = props;
  const [queries, setqueries] = useState<CommandSelectorItem[]>([]);

  const query = useSQLSelect3<DatabaseProps>(
    "mix",
    `
select  public.sqlquery.id

,public.sqlquery.name as title
,public.sqlquery.id as slug
,public.sqlquery.description 
from public.sqlquery
left join public.connection on public.sqlquery.connection_id = public.connection.id
where public.connection.name = '${database}'
ORDER BY public.sqlquery.name

    `
  );
  useEffect(() => {
    if (query && query.dataset && query.dataset.length > 0) {
      //setdbinfo(query.dataset[0].result);
      const items = query.dataset.map((item) => {
        const cmd: CommandSelectorItem = {
          id: item.id.toString(),
          title: item.title + " (" + item.id + ")",
          description: item.description,
          children: <div></div>,
          slug: item.title,
        };
        return cmd;
      });

      items.sort((a: any, b: any) => a.title.localeCompare(b.title));
      setqueries(items);
    }
  }, [query.dataset]);
  return (
    <ItemsViewer
      visualisation={props.visualisation}
      value={value}
      placeholder="Queries"
      commands={queries ? queries : []}
      onSelect={(command) => {
        onChange(command.id);
      }}
    />
  );
}
