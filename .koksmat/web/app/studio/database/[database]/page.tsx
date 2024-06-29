"use client";

import { useRouter } from "next/navigation";
import ListProceduresTable from "@/components/ListProceduresTable";
import { QueryEditor } from "@/components/query-editor";

export default function Page(props: { params: { database: string } }) {
  const { database } = props.params;

  return (
    <QueryEditor
      editor={null}
      result={<ListProceduresTable database={database} />}
    />
  );
}
