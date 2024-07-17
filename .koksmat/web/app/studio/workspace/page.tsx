"use client";
import { APPNAME } from "@/app/global";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";
import React, { useContext } from "react";

export default function Page() {
  const magicbox = useContext(MagicboxContext);
  return (
    <div>
      workspaces
      {/* <pre>{JSON.stringify(magicbox, null, 2)}</pre> */}
      <SQLCards
        Icon={CardStackIcon}
        slugPrefix={"/" + APPNAME + "/workspace/"}
        database={"mix"}
        sql={`
SELECT W.name as title, '' as description, W.key as slug FROM workspace as W LEFT JOIN public.user as U ON W.user_id = U.id 
WHERE U.email = '${magicbox?.user?.email}'

    
    `}
      />
    </div>
  );
}
