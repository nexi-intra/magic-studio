"use client";

import { APPNAME } from "@/app/global";
import { ItemPageToolbar } from "@/components/item-page-toolbar";
import { KitchenOverview } from "@/components/kitchen-overview";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: {
  params: { workspaceid: string; kitchen: string };
}) {
  const { workspaceid, kitchen } = props.params;
  return (
    <div>
      {/* <ItemPageToolbar database={database} table={table} /> */}
      <KitchenOverview />
    </div>
  );
}
