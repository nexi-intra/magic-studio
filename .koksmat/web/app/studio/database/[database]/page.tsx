"use client";

import { APPNAME } from "@/app/global";
import { DatabasePage } from "@/components/database-page";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: { params: { database: string } }) {
  const { database } = props.params;
  return <DatabasePage database={database} />;
}
