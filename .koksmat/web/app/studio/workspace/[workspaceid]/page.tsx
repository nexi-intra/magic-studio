"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { WorkspaceContext } from "@/components/contexts/workspacecontext";
import useKitchens, { Kitchen } from "@/components/hooks/use-kitchens";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const filteredKitchens = kitchens
    .filter((kitchen) =>
      kitchen.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a: Kitchen, b: Kitchen) => a.name.localeCompare(b.name));
  return (
    <div>
      {/* <div>{workspaceContext.kitchenroot}</div> */}
      <Input
        autoFocus
        type="text"
        placeholder={
          filteredKitchens.length < 1
            ? "Loading ..."
            : "Search " + filteredKitchens.length + " kitchens..."
        }
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={
          searchTerm
            ? "max-w-md ml-auto mr-auto mt-1"
            : "max-w-md ml-auto mr-auto mt-[30vh]"
        }
      />

      {searchTerm && (
        <div className="flex flex-wrap ">
          {filteredKitchens.map((kitchen: Kitchen) => (
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
      )}
    </div>
  );
}
