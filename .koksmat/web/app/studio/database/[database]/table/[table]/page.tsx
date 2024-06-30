"use client";

import { APPNAME } from "@/app/global";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: {
  params: { database: string; table: string };
}) {
  const { database, table } = props.params;
  return (
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

    
    `}
    />
  );
}
