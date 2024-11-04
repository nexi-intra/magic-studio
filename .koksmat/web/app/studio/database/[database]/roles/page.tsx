"use client";

import ListDatabases from "@/components/list-databases";
import ListRoles from "@/components/list-roles";
import ListRolesMembers from "@/components/list-roles-members";
import React from "react";

export default function ListProceduresTable(props: {
  params: { database: string };
}) {
  const { database } = props.params;

  return (
    <div className="flex flex-wrap space-x-4">
      <ListRoles database={database} />
      <ListRolesMembers database={database} />
      <ListDatabases />
    </div>
  );
}
