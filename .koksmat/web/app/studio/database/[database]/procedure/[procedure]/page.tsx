import { StoredProcedurePage } from "@/components/stored-procedure-page";
import React from "react";

export default function Page(props: {
  params: { database: string; procedure: string };
}) {
  const { database, procedure } = props.params;
  return (
    <div>
      <StoredProcedurePage database={database} procedure={procedure} />
    </div>
  );
}
