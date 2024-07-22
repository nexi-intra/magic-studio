"use client";
import { QueryEditorToolbar } from "@/components/query-editor-toolbar";
import React from "react";

export default function Layout(props: {
  children: React.ReactNode;
  params: { database: string; query: string };
}) {
  const { database, query } = props.params;
  const { children } = props;
  return (
    <div>
      <QueryEditorToolbar database={database} />
      {children}
    </div>
  );
}
