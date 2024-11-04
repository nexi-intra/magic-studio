"use client";
import { ItemPageToolbar } from "@/components/item-page-toolbar";
import React from "react";

export default function Layout(props: {
  children: React.ReactNode;
  params: { database: string; table: string };
}) {
  const { database, table } = props.params;
  const { children } = props;
  return <div>{children}</div>;
}
