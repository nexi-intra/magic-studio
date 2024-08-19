"use client";

import { APPNAME } from "@/app/global";
import { ItemPageToolbar } from "@/components/item-page-toolbar";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: {
  params: { database: string; table: string };
}) {
  const { database, table } = props.params;
  return (
    <div>
      <ItemPageToolbar database={database} table={table} />

      <SQLCards
        Icon={CardStackIcon}
        slugPrefix={
          "/" + APPNAME + "/database/" + database + "/table/" + table + "/item/"
        }
        database={database}
        sql={`
SELECT name as title, 
       description,
        id as slug
FROM ${table}
ORDER BY name
LIMIT 1000

    
    `}
      />
    </div>
  );
}
