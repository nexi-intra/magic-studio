"use client";

import useWorkspaceExec from "@/components/hooks/use-workspace-exec";
import KubernetesList from "@/components/kubernetes-list";
import KubernetesService from "@/components/kubernetes-service";

import React, { use, useEffect, useState } from "react";

export default function Page(props: {
  params: {
    workspaceid: string;
    namespace: string;
    resourcetype: string;
    slug: string[];
  };
}) {
  const { workspaceid, namespace, slug, resourcetype } = props.params;
  const [resourceId, setresourceId] = useState("");
  const [resourceView, setresourceView] = useState<React.JSX.Element>();
  const data = useWorkspaceExec(
    workspaceid,
    "kubectl",
    ["get", resourcetype, resourceId, "-n", namespace, "-o", "json"],
    "",
    (response: string) => {
      return response;
    }
  );
  useEffect(() => {
    if (slug?.length > 0) {
      setresourceId(slug[0]);
    }
  }, [slug]);

  useEffect(() => {
    switch (resourcetype) {
      case "service":
        setresourceView(<KubernetesService />);
        break;

      default:
        break;
    }
  }, [resourcetype]);

  return (
    <div className="w-full h-full">
      <pre>{JSON.stringify(data, null, 2)}</pre>

      {resourceView}
    </div>
  );
}
