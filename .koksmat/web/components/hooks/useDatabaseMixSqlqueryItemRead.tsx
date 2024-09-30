"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useState, useEffect } from "react";

// import React, { useEffect, useState } from "react";
export function useDatabaseMixSqlqueryItemRead(database: string, id: string) {
  /* ---------------------- Load Record ----------------------
  * This code is generated by Magic Button Studio. You can modify it as you like.
  * The code is generated based on the database and table you have selected.
  * No warranty is given for the code.
  *
  * Suggest that you use the refactor function and move the code to a separate file,
  * then move that file to a folder where you keep your custom hooks.
  * ----------------------------------------------------------
  */
  /*
    Sample usage:
    const { databaseRecord, isLoading, error } = useDatabaseMixSqlqueryItemRead(props.id);  // replace props.id with the id of the record you want to load
   */
  interface MixSqlqueryItem {
    id: number;
    created_at: string;
    created_by: string;
    updated_at: string;
    updated_by: string;
    deleted_at: null;
    tenant: string;
    searchindex: string;
    name: string;
    description: string;
    sql: string;
    connection_id: number;
    schema: Schema;
    koksmat_masterdataref: null;
    koksmat_bucket: null;
    koksmat_masterdata_id: null;
    koksmat_masterdata_etag: null;
    koksmat_state: null;
    koksmat_compliancetag: null;
  }
  interface Schema {
    schema: string;
  }
  const [error, seterror] = useState("");
  const databaseQuery = useSQLSelect3<MixSqlqueryItem>(
    database,
    `SELECT * FROM "sqlquery" WHERE id = ${id} ` // you might like to take the id from somewhere else
  );
  const [databaseRecord, setdatabaseRecord] = useState<MixSqlqueryItem>();
  useEffect(() => {
    if (databaseQuery.isLoading) return;
    if (databaseQuery.error) {
      seterror(databaseQuery.error);
      return;
    }
    if (databaseQuery.dataset.length === 0) {
      seterror("No data found");
      return;
    }

    setdatabaseRecord(databaseQuery.dataset[0]);


  }, [databaseQuery]);



  return { databaseRecord, error, isLoading: databaseQuery.isLoading };
}
