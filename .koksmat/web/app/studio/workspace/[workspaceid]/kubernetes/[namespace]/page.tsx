"use client";

import KubernetesList from "@/components/kubernetes-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

import React, { use, useEffect, useState } from "react";

export default function Page(props: { params: { workspaceid: string } }) {
  const pathname = usePathname();
  const kubernetesResourceTypes = [
    "ingress",
    "pods",
    "services",
    "deployments",
    "jobs",
    "cronjobs",
  ];
  return (
    <div className="w-full h-full">
      Select resource type
      {kubernetesResourceTypes.map((resourceType) => (
        <Button key={resourceType} variant="outline">
          <Link href={pathname + "/" + resourceType}>{resourceType}</Link>
        </Button>
      ))}
    </div>
  );
}