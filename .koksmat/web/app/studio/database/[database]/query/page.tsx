import { SqlQueryEditor } from "@/components/sql-query-editor";

import React from "react";

export default function Page(props: { params: { database: string } }) {
  const { database } = props.params;
  return (
    <div className="h-screen">
      <SqlQueryEditor database={database} />
    </div>
  );
}
