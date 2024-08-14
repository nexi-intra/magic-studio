"use client";

import KubernetesList from "@/components/kubernetes-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React, { use, useEffect, useState } from "react";

export default function Page(props: { params: { workspaceid: string } }) {
  const pathname = usePathname();
  const namespaces = ["magicbox-christianiabpos"];
  return (
    <div className="w-full h-full">
      Select namespace
      {namespaces.map((namespace) => (
        <Button key={namespace} variant="outline">
          <Link href={pathname + "/" + namespace}>{namespace}</Link>
        </Button>
      ))}
    </div>
  );
}
