"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import useKitchens, { Kitchen } from "@/components/hooks/use-kitchens";
import { Card, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
  return (
    <div className="flex flex-wrap space-x-2 space-y-2">
      {kitchens
        .sort((a: Kitchen, b: Kitchen) => a.title.localeCompare(b.title))
        .map((kitchen: Kitchen) => (
          <div key={kitchen.name}>
            <Link href={path + "/kitchen/" + kitchen.name}>
              <Card className="w-72 hover:shadow-lg cursor-pointer">
                <CardHeader>{kitchen.title}</CardHeader>

                <p>{kitchen.description}</p>
              </Card>
            </Link>
          </div>
        ))}
    </div>
  );
}
