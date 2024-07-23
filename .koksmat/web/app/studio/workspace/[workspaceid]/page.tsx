"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import useKitchens, { Kitchen } from "@/components/hooks/use-kitchens";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

export default function Page(props: { params: { workspaceid: string } }) {
  const path = usePathname();
  const query = useSQLSelect3(
    "mix",
    `
    SELECT * FROM workspace 
    WHERE key = '${props.params.workspaceid}'
    `
  );
  const { workspaceid } = props.params;
  const kitchens = useKitchens(workspaceid);
  const workspaceContext = useContext(WorkspaceContext);
  return (
    <div>
      <div>{workspaceContext.kitchenroot}</div>

      <div className="flex flex-wrap ">
        {kitchens
          .sort((a: Kitchen, b: Kitchen) => a.title.localeCompare(b.title))
          .map((kitchen: Kitchen) => (
            <div key={kitchen.name} className="m-2">
              <Link href={path + "/kitchen/" + kitchen.name}>
                <Card className="w-72 hover:shadow-lg cursor-pointer">
                  <CardHeader>{kitchen.name}</CardHeader>

                  {/* <p>{kitchen.description}</p> */}
                </Card>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
