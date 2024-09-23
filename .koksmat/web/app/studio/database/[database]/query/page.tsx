"use client";
import { SqlQueryEditor } from "@/components/sql-query-editor";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

import React, { useContext, useState } from "react";
import CreateSqlquery from "@/actions/database/mix/create_sqlquery";
import { APPNAME } from "@/app/global";
import { useRouter } from "next/navigation";
import { QueryEditorToolbar } from "@/components/query-editor-toolbar";
export default function Page(props: { params: { database: string } }) {
  const router = useRouter();
  const { database } = props.params;
  const [name, setname] = useState("");

  const [showSheet, setshowSheet] = useState(true);
  const magicbox = useContext(MagicboxContext);
  const [error, seterror] = useState("");
  const toolbar = <QueryEditorToolbar database={database} />;
  return (
    <div>

      <SqlQueryEditor
        toolbar={toolbar}
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

    </div>

  );
}
