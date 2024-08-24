"use client";
import React, { use, useContext, useEffect, useState } from "react";

import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import { pathJoin } from "@/lib/pathjoin";

import { useRouter } from "next/navigation";
import { APPNAME } from "@/app/global";

export default function Page(props: {
  params: {
    workspaceid: string;
    kitchen: string;
    slug: string[];
  };
}) {
  const router = useRouter();

  const { workspaceid, kitchen, slug } = props.params;

  const workspaceContext = useContext(WorkspaceContext);

  //const [appUrl, setappUrl] = useState("");
  const [currentPath, setcurrentPath] = useState("");

  useEffect(() => {
    console.log("currentPath", currentPath);
    const newRoute = pathJoin(
      `/${APPNAME}/workspace/${workspaceid}/kitchen/${kitchen}/web/app`,
      currentPath
    );
    console.log("newRoute", newRoute);
    router.push(newRoute);
  }, [currentPath]);

  useEffect(() => {
    if (!slug) return;
    const browserPath = slug.join("/");
    setcurrentPath("/" + browserPath);

    //debugger;
  }, [slug]);

  useEffect(() => {
    setcurrentPath(workspaceContext.webPathname);
  }, [workspaceContext.webPathname]);

  return (
    <div>
      cur: {currentPath} | tree: {workspaceContext.treePathname}
    </div>
  );
}
