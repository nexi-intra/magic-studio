"use client";

import KubernetesList from "@/components/kubernetes-list";

import React, { use, useEffect, useState } from "react";

export default function Page(props: {
  params: { workspaceid: string; resourcetype: string; namespace: string };
}) {
  return (
    <div className="w-full h-full">
      <KubernetesList
        workspaceid={props.params.workspaceid}
        namespace={props.params.namespace}
        resourceType={props.params.resourcetype}
      />
    </div>
  );
}
