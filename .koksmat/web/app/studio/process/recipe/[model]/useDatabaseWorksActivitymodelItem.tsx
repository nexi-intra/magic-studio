"use client";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useEffect, useState } from "react";

/* ---------------------- Load Record ----------------------
 * This code is generated by Koksmat Studio. You can modify it as you like.
 * The code is generated based on the database and table you have selected.
 * No warranty is given for the code.
 * ----------------------------------------------------------
 */
// import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
// import React, { useEffect, useState } from "react";
// const { databaseRecord, isLoading, error } = useDatabaseWorksActivitymodelItem(props.id);  // replace props.id with the id of the record you want to load
interface WorksActivitymodelItem {
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
  activity: string;
  data: Data;
  koksmat_masterdataref: null;
  koksmat_bucket: null;
  koksmat_masterdata_id: null;
  koksmat_masterdata_etag: null;
  koksmat_state: null;
  koksmat_compliancetag: null;
}
interface Data {
  id: string;
  name: string;
  stage: Stage[];
  actors: Actors;
  purpose: string;
  version: number;
  description: string;
}
interface Actors {
  app: App;
  shop: App;
  user: App;
  system: App;
  auditlog: App;
  restaurant: App;
  delivery_person: App;
}
interface App {
  name: string;
  description: string;
}
interface Stage {
  id: string;
  name: string;
  raci?: Raci;
  actions: Action[];
  triggers?: Triggers;
  decisions?: Decision[];
}
interface Decision {
  id: string;
  icon: string;
  name: string;
  description: string;
}
interface Triggers {
  actions: Action2[];
}
interface Action2 {
  id: string;
  sql: string;
  name: string;
  description: string;
}
interface Action {
  id: string;
  ui: string;
  icon: string;
  name: string;
  description: string;
  interactive: boolean;
  transaction?: string;
  sql?: string;
}
interface Raci {
  informed: string;
  consulted?: string;
  responsible: string;
}
export function useDatabaseWorksActivitymodelItem(id: string) {
  const [error, seterror] = useState("");
  const databaseQuery = useSQLSelect3<WorksActivitymodelItem>(
    "works",
    `SELECT * FROM "activitymodel" WHERE id = ${id} ` // you might like to take the id from somewhere else
  );
  const [databaseRecord, setdatabaseRecord] =
    useState<WorksActivitymodelItem>();
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

    // setFlow(workflow);
  }, [databaseQuery]);

  return { databaseRecord, error, isLoading: databaseQuery.isLoading };
}