"use client";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import GitOrganizations from "@/components/git-organisations";
import GitRepos from "@/components/git-repos";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const magicbox = useContext(MagicboxContext);

  const [organisation, setorganisation] = useState("");
  const [repo, setrepo] = useState("");
  useEffect(() => {
    setrepo("");
  }, [organisation]);

  return (
    <div className="flex">
      <GitOrganizations
        visualisation="list"
        workspaceId={magicbox.currentWorkspace}
        value={""}
        onChange={function (value: string): void {
          setorganisation(value);
        }}
      />
      <GitRepos
        visualisation="list"
        workspaceId={magicbox.currentWorkspace}
        value={""}
        onChange={function (value: string): void {
          router.push(
            `/workspace/${magicbox.currentWorkspace}/github/${value}`
          );
        }}
        organisation={organisation}
      />
    </div>
  );
}
