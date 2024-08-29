"use client";
import { SqlQueryEditor } from "@/components/sql-query-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Sheet,
  SheetFooter,
} from "@/components/ui/sheet";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

import React, { useContext, useState } from "react";
import CreateSqlquery from "@/actions/database/mix/create_sqlquery";
import { APPNAME } from "@/app/global";
import { useRouter } from "next/navigation";
export default function Page(props: { params: { database: string } }) {
  const router = useRouter();
  const { database } = props.params;
  const [name, setname] = useState("");

  const [showSheet, setshowSheet] = useState(true);
  const magicbox = useContext(MagicboxContext);
  const [error, seterror] = useState("");
  return (
    <SqlQueryEditor
      database={database}
      name={name}
      onSave={async (sql, name) => {
        seterror("");
        const result = await CreateSqlquery(
          magicbox.authtoken,
          name,
          "",
          sql.replaceAll("'", "''"),
          2,
          {}
        );
        if (result.hasError) {
          seterror(result.errorMessage ?? "Unknown error");
        } else {
          seterror("");
          router.push(
            "/" + APPNAME + "/database/" + database + "/query(" + result.data
          );
        }
      }}
      sql=""
    />
  );
}
