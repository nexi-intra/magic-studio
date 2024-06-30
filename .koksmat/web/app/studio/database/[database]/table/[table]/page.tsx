"use client";

import { APPNAME } from "@/app/global";
import SQLCards from "@/components/sql-cards";
import { TablePage } from "@/components/table-page";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: {
  params: { database: string; table: string };
}) {
  const { database, table } = props.params;
  return <TablePage database={database} table={table} />;
}
