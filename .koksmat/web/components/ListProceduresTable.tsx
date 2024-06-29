"use client";

import { GenericTable } from "@/app/koksmat/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import React from "react";

export default function ListProceduresTable(props: { database: string }) {
  const { database } = props;
  const procedures = useSQLSelect3(
    database,
    `
   SELECT
    p.proname AS title,
    substring(pg_get_functiondef(p.oid) FROM 1 FOR 200)  AS details
FROM
    pg_proc p
JOIN
    pg_namespace n ON p.pronamespace = n.oid
WHERE
    n.nspname = 'proc'
ORDER BY p.proname
    `
  );
  return (
    <div>
      <GenericTable
        data={procedures.dataset}
        caption="Procedures"
        description="Here you get a list of the procedures in the database"
      />
    </div>
  );
}
