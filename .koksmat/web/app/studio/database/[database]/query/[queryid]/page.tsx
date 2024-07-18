import { SqlQueryEditor } from "@/components/sql-query-editor";

import React from "react";

export default function Page(props: {
  params: { database: string; queryid: string };
}) {
  const { database } = props.params;
  return (
    <div>
      <SqlQueryEditor database={database} />
    </div>
  );
}
