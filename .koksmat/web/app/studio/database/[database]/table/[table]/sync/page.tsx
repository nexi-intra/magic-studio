"use client";
import SyncManagerPage from "@/components/sync-manager";
import React from "react";

export default function Sync(props: {
  params: { database: string; table: string };
}) {
  return (
    <div>
      <SyncManagerPage {...props.params} />
    </div>
  );
}
