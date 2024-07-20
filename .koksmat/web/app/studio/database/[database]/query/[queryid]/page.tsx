"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { SqlQueryEditor } from "@/components/sql-query-editor";

import React, { useContext, useEffect, useState } from "react";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import UpdateSqlquery from "@/actions/database/mix/update_sqlquery";
//import { UpdateSqlqueryProps } from "/@/actions/database/mix/update_sqlquery";
export default function Page(props: {
  params: { database: string; queryid: string };
}) {
  const { database } = props.params;
  const [item, setitem] = useState<any>();
  const [error, seterror] = useState("");
  const data = useSQLSelect3(
    database,
    `SELECT * from sqlquery where id= ${props.params.queryid}`
  );
  useEffect(() => {
    if (data.dataset.length > 0) {
      setitem(data.dataset[0]);
    }
  }, [data.dataset]);

  const magicbox = useContext(MagicboxContext);
  if (data.isLoading) {
    return <div>Loading...</div>;
  }
  if (data.error) {
    return <div>Error: {data.error}</div>;
  }
  if (data.dataset.length === 0) {
    return <div>Query not found</div>;
  }

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}
      <SqlQueryEditor
        database={database}
        name={item?.name ?? "query name"}
        onSave={async (sql, name) => {
          seterror("");
          const result = await UpdateSqlquery(
            magicbox.authtoken,
            item.title,
            item.description,
            name,
            sql.replaceAll("'", "''"),
            item.connection_id,
            item.schema,
            item.id
          );
          if (result.hasError) {
            seterror(result.errorMessage ?? "Unknown error");
          } else {
            seterror("");
          }
        }}
        sql={item?.sql}
      />
    </div>
  );
}
