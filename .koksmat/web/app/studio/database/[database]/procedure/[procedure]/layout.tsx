"use client";
import { StoredProcedureToolbar } from "@/components/stored-procedure-toolbar";
import React from "react";
import { useRouter } from "next/navigation";
export default function Layout(props: {
  children: React.ReactNode;
  params: { procedure: string; database: string };
}) {
  const { procedure, database } = props.params;
  const { children } = props;
  const router = useRouter();
  return (
    <div>
      <StoredProcedureToolbar
        onExecute={() => {
          console.log("execute");
          router.push(
            `/studio/database/${database}/procedure/${procedure}/exec`
          );
        }}
      />
      {children}
    </div>
  );
}
