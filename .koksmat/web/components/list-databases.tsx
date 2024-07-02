"use client";

import { GenericTable } from "@/app/koksmat/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import React from "react";

export default function ListDatabases(props: {}) {
  const procedures = useSQLSelect3(
    "mix",
    `
SELECT
    datname AS title,
    CONCAT(
        'Allow Connections: ', CASE WHEN datallowconn THEN 'YES' ELSE 'NO' END, '; ',
        'Connection Limit: ', datconnlimit, '; '
    ) AS details
FROM
    pg_database
WHERE
    pg_catalog.pg_get_userbyid(datdba) = 'pgadmin'


    `
  );
  return (
    <div>
      <GenericTable
        data={procedures.dataset}
        caption="Databases"
        description="Here you get a list of the databases"
      />
    </div>
  );
}
