"use client";

import { APPNAME } from "@/app/global";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import SQLCards from "@/components/sql-cards";
import TerminalEditor from "@/components/terminal-editor";
import { CardStackIcon } from "@radix-ui/react-icons";

export default function Page(props: {
  params: { database: string; table: string; id: string };
}) {
  const { database, table, id } = props.params;
  const data = useSQLSelect3(
    database,
    `SELECT * FROM ${table} WHERE id = ${id}`
  );
  return (
    <div className="flex  gap-2 border-t bg-background px-4 py-2  w-[calc(80vw-100px)] h-[calc(80vh-100px)]">
      <TerminalEditor
        code={JSON.stringify(data.dataset, null, 2)}
        language={"json"}
        onCodeChange={function (code: string): void {
          //throw new Error("Function not implemented.");
        }}
        onEnter={function (): void {
          //throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
