"use client";

import { GenericTable } from "@/app/koksmat/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import React from "react";

export default function ListRoles(props: { database: string }) {
  const { database } = props;
  const procedures = useSQLSelect3(
    database,
    `
SELECT
    rolname AS title,
    CONCAT(
        'Superuser: ', CASE WHEN rolsuper THEN 'YES' ELSE 'NO' END, '; ',
        'Create DB: ', CASE WHEN rolcreatedb THEN 'YES' ELSE 'NO' END, '; ',
        'Create Role: ', CASE WHEN rolcreaterole THEN 'YES' ELSE 'NO' END, '; ',
        'Login: ', CASE WHEN rolcanlogin THEN 'YES' ELSE 'NO' END, '; ',
        'Replication: ', CASE WHEN rolreplication THEN 'YES' ELSE 'NO' END, '; ',
        'Bypass RLS: ', CASE WHEN rolbypassrls THEN 'YES' ELSE 'NO' END
    ) AS details
FROM
    pg_roles
WHERE
    rolname NOT LIKE 'pg_%'
    AND rolname NOT LIKE 'rds%'
    AND rolname NOT LIKE 'rdsadmin'
    AND rolname NOT LIKE 'rdsrepladmin'
    AND rolname NOT LIKE 'rds_superuser'
    AND rolname NOT LIKE 'rdsdb'
    AND rolname NOT LIKE 'rdsdbadmin'
    AND rolname NOT LIKE 'rdsdbuser'
    AND rolname NOT LIKE 'rdsrepl'
ORDER BY
    title

    `
  );
  return (
    <div>
      <GenericTable
        data={procedures.dataset}
        caption="Roles"
        description="Here you get a list of the roles in the database"
      />
    </div>
  );
}
