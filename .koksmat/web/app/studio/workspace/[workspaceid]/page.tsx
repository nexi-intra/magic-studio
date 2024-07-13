"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import React from "react";

export default function page(props: { params: { workspaceid: string } }) {
  const query = useSQLSelect3(
    "mix",
    `
    SELECT * FROM workspace 
    WHERE key = '${props.params.workspaceid}'
    `
  );
  const { workspaceid } = props.params;
  return <pre>{JSON.stringify(query, null, 2)}</pre>;
}
