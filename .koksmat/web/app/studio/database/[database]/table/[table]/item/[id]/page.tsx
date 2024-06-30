"use client";

import { APPNAME } from "@/app/global";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: {
  params: { database: string; table: string; id: string };
}) {
  const { database, table, id } = props.params;
  return (
    <SQLCards
      Icon={CardStackIcon}
      slugPrefix={
        "/" + APPNAME + "/database/" + database + "/table/" + table + "/item/"
      }
      database={database}
      sql={`
SELECT t.name as title, row_to_json(t)::text as description  FROM ${table} as t WHERE id = ${id}
    `}
    />
  );
}
