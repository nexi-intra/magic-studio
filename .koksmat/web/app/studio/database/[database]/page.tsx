"use client";

import { APPNAME } from "@/app/global";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: { params: { database: string } }) {
  const { database } = props.params;
  return (
    <SQLCards
      Icon={CardStackIcon}
      slugPrefix={"/" + APPNAME + "/database/" + database + "/table/"}
      database={database}
      sql={`
SELECT table_name as title, 
       (xpath('/row/count/text()', xml_count))[1]::text::int AS description,
        table_name as slug
FROM (
    SELECT table_name, 
           query_to_xml(format('SELECT COUNT(*) AS count FROM %I', table_name), false, true, '') AS xml_count
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
) AS counts

    
    `}
    />
  );
}
