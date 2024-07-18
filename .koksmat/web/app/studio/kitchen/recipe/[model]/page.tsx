"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import WorkflowEditor from "@/components/workflow-editor2";
import React, { use, useEffect, useState } from "react";

export default function Page(props: { params: { model: string } }) {
  const { model } = props.params;
  const [error, seterror] = useState("");
  const data = useSQLSelect3(
    "works",
    `
select * from activitymodel where id = ${model}    
    `
  );
  useEffect(() => {
    if (!data) return;
    if (data.isLoading) return;

    if (data.dataset.length === 0) {
      seterror("No records found");
      return;
    }
    if (data.dataset.length > 1) {
      seterror("More than one record found");
      return;
    }
    const record = data.dataset[0];
  }, [data]);

  if (data.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {error && <div className="p-4 text-red-500">{error}</div>}
      <WorkflowEditor />
    </div>
  );
}
