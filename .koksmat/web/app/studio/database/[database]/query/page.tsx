"use client";
import { SqlQueryEditor } from "@/components/sql-query-editor";

import React from "react";

export default function Page(props: { params: { database: string } }) {
  const { database } = props.params;
  return (
    <div className="h-full">
      <SqlQueryEditor database={database} name="" onSave={() => {}} sql="" />
    </div>
  );
}
