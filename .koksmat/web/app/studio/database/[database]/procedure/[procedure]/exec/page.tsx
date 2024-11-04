"use client";
import ExecuteProcedure from "@/components/execute-procedure";
import useProcedureInfo from "@/components/hooks/use-procedure-info";
import React, { useEffect, useState } from "react";

export default function ExecuteProcedurePage(props: {
  params: {
    procedure: string;
    database: string;
  };
}) {
  const { procedure, database } = props.params;

  const info = useProcedureInfo({ params: { procedure, database } });
  return (
    <div className="h-[70vh] w-full">
      <ExecuteProcedure
        procedureName={procedure}
        jsonSchema={info.jsonSchema}
        zodSchema={info.zodSchema}
        databaseName={database}
      />
    </div>
  );
}
