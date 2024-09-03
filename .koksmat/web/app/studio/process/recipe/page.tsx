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
      {/* <pre>{JSON.stringify(magicbox, null, 2)}</pre> */}
      <SQLCards
        Icon={CardStackIcon}
        slugPrefix={"/" + APPNAME + "/process/recipe/"}
        database={"works"}
        sql={`
SELECT W.name as title, '' as description, W.name as slug FROM activitymodel as W 

    
    `}
      />
    </div>
  );
}
