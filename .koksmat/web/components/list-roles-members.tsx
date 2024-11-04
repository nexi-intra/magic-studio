"use client";

import { GenericTable } from "@/app/koksmat/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import React from "react";

export default function ListRolesMembers(props: { database: string }) {
  const { database } = props;
  const procedures = useSQLSelect3(
    database,
    `
   SELECT
    r.rolname AS title,
    m.rolname AS details
FROM
    pg_auth_members am
JOIN
    pg_roles r ON am.roleid = r.oid
JOIN
    pg_roles m ON am.member = m.oid
ORDER BY
    title, details

    `
  );
  return (
    <div>
      <GenericTable
        data={procedures.dataset}
        caption="Roles"
        description="Here you get a list of the role assignments in the database"
      />
    </div>
  );
}
