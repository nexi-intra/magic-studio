"use client";
import { APPNAME } from "@/app/global";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import SQLCards from "@/components/sql-cards";
import { Button } from "@/components/ui/button";
import { WorkspaceToolbar } from "@/components/workspace-toolbar";
import { CardStackIcon } from "@radix-ui/react-icons";
import React, { useContext } from "react";

export default function Page() {
  const magicbox = useContext(MagicboxContext);

  return (
    <div>
      <WorkspaceToolbar />
      <SQLCards
        Icon={CardStackIcon}
        slugPrefix={"/" + APPNAME + "/workspace/"}
        database={"mix"}
        parse={(item) => {
          return {
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
          };
        }
        }
        sql={`
SELECT W.name as title, W.description as description, W.key as slug FROM workspace as W LEFT JOIN public.user as U ON W.user_id = U.id 
WHERE U.email = '${magicbox?.user?.email}'

    
    `}
      />
    </div>
  );
}
