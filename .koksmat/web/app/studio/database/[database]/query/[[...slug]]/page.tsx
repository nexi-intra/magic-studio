"use client";
import { SqlQueryEditor } from "@/components/sql-query-editor";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

import React, { useContext, useEffect, useState } from "react";
import CreateSqlquery from "@/actions/database/mix/create_sqlquery";
import { APPNAME } from "@/app/global";
import { useRouter } from "next/navigation";
import { QueryEditorToolbar } from "@/components/query-editor-toolbar";
import { useDatabaseMixSqlqueryItemRead } from "@/components/hooks/useDatabaseMixSqlqueryItemRead";
import { useDatabaseMixSqlqueryItemUpdate } from "@/components/hooks/useDatabaseMixSqlqueryItemUpdate";

export default function Page(props: { params: { database: string, slug: string[] } }) {
  const router = useRouter();
  const { database, slug } = props.params;
  const subpath = slug ? slug.join("/") : ""
  const [name, setname] = useState("");

  const [showSheet, setshowSheet] = useState(true);
  const magicbox = useContext(MagicboxContext);
  const [error, seterror] = useState("");
  const handleSave = async () => {
    if (!databaseRecord) {
      alert("No record loaded") //
      return
    }

    seterror("");
    debugger
    databaseRecord.sql = sql.replaceAll("'", "''");
    sqlQueryUpdater.update(databaseRecord)

  }
  const toolbar = <QueryEditorToolbar database={database} handleSave={handleSave} />;
  const { databaseRecord, isLoading, error: databaseerror } = useDatabaseMixSqlqueryItemRead(subpath);  // replace props.id with the id of the record you want to load
  const sqlQueryUpdater = useDatabaseMixSqlqueryItemUpdate();
  const [sql, setsql] = useState(`
  /**
   * Write your query here
   * and click on the Run button
   */        
          
  select 1 as result`)
  useEffect(() => {
    seterror(databaseerror)
    if (databaseRecord) {
      setsql(databaseRecord.sql)
      setname(databaseRecord.name)
    }

  }, [databaseRecord, databaseerror])

  useEffect(() => {
    if (!subpath) {
      return;
    }


  }, [subpath])

  return (
    <div>

      <SqlQueryEditor
        toolbar={toolbar}
        database={database}
        name={name}
        onChange={async (newSQL: string) => {
          setsql(newSQL)
        }}
        sql={sql}
      />

    </div>

  );
}
