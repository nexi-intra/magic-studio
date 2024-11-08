"use client";
import { execute } from "@/actions/client";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { useContext, useEffect, useState } from "react";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";

export interface BookingSiteItem {
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
  code: string;
  country_id: number;
  parkingenabled: boolean;
  deskbookingenabled: boolean;
  koksmat_masterdataref: null;
  koksmat_bucket: null;
  koksmat_masterdata_id: null;
  koksmat_masterdata_etag: null;
  koksmat_state: null;
  koksmat_compliancetag: null;
}
// import React, { useEffect, useState } from "react";
export function useDatabaseBookingSiteItemCreate() {
  /* ---------------------- Create Record ----------------------
* This code is generated by Koksmat Studio. You can modify it as you like.
* The code is generated based on the database and table you have selected.
* No warranty is given for the code.
*
* Suggest that you use the refactor function and move the code to a separate file,
* then move that file to a folder where you keep your custom hooks.
 
* ----------------------------------------------------------
*/

  type updateBookingSiteItem = Omit<BookingSiteItem, "id" | "created_at" | "created_by" | "updated_at" | "updated_by" | "deleted_at" | "koksmat_masterdataref" | "koksmat_bucket" | "koksmat_masterdata_id" | "koksmat_masterdata_etag" | "koksmat_state" | "koksmat_compliancetag">;
  const magicbox = useContext(MagicboxContext);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState<any>();
  const createItem = async (record: updateBookingSiteItem) => {
    setloading(true);
    seterror("");
    const result = await execute(

      magicbox.authtoken, // <-- this is the authentication token containing the user's credentials - the upn will be used as "actor" name
      "booking", // <-- this is a reference to a record in the connections table in the mix database
      "magic-mix.app", // <-- this is the service name processing the request
      "create_site", // <-- this is the name of the procedure in the database pointed to by the connection
      record // <-- this is the data to be sent to the procedure
    );
    setloading(false);
    if (result.hasError) {
      seterror(result.errorMessage ?? "Unknown error");
    }
    setresult(result);


  };
  return { createItem, error, loading, result };
}





export function useDatabaseBookingSiteItemRead(id: string) {
  /* ---------------------- Load Record ----------------------
  * This code is generated by Koksmat Studio. You can modify it as you like.
  * The code is generated based on the database and table you have selected.
  * No warranty is given for the code.
  *
  * Suggest that you use the refactor function and move the code to a separate file,
  * then move that file to a folder where you keep your custom hooks.
  * ----------------------------------------------------------
  */
  /*
    Sample usage:
    const { databaseRecord, isLoading, error } = useDatabaseBookingSiteItemRead(props.id);  // replace props.id with the id of the record you want to load
   */
  interface BookingSiteItem {
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
    code: string;
    country_id: number;
    parkingenabled: boolean;
    deskbookingenabled: boolean;
    koksmat_masterdataref: null;
    koksmat_bucket: null;
    koksmat_masterdata_id: null;
    koksmat_masterdata_etag: null;
    koksmat_state: null;
    koksmat_compliancetag: null;
  }
  const [error, seterror] = useState("");
  const databaseQuery = useSQLSelect3<BookingSiteItem>(
    "booking",
    `SELECT * FROM "site" WHERE id = ${id} ` // you might like to take the id from somewhere else
  );
  const [databaseRecord, setdatabaseRecord] = useState<BookingSiteItem>();
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


export function useDatabaseBookingSiteItemUpdate() {
  /* ---------------------- Update Record ----------------------
* This code is generated by Koksmat Studio. You can modify it as you like.
* The code is generated based on the database and table you have selected.
* No warranty is given for the code.
*
* Suggest that you use the refactor function and move the code to a separate file,
* then move that file to a folder where you keep your custom hooks.
 
* ----------------------------------------------------------
*/

  type updateBookingSiteItem = Omit<BookingSiteItem, "created_at" | "created_by" | "updated_at" | "updated_by" | "deleted_at" | "koksmat_masterdataref" | "koksmat_bucket" | "koksmat_masterdata_id" | "koksmat_masterdata_etag" | "koksmat_state" | "koksmat_compliancetag">;
  const magicbox = useContext(MagicboxContext);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState<any>();
  const updateItem = async (record: updateBookingSiteItem) => {
    setloading(true);
    seterror("");
    const result = await execute(

      magicbox.authtoken, // <-- this is the authentication token containing the user's credentials - the upn will be used as "actor" name
      "booking", // <-- this is a reference to a record in the connections table in the mix database
      "magic-mix.app", // <-- this is the service name processing the request
      "update_site", // <-- this is the name of the procedure in the database pointed to by the connection
      record // <-- this is the data to be sent to the procedure
    );
    setloading(false);
    if (result.hasError) {
      seterror(result.errorMessage ?? "Unknown error");
    }
    setresult(result);


  };
  return { updateItem, error, loading, result };
}


/*
You might need one of the following imports - uncomment the one you need
*/
// import { execute } from "@/actions/client";
// import React, { useEffect, useState } from "react";


export function useDatabaseBookingSiteItemDelete() {
  /* ---------------------- Delete Record ---------------------- 
* This code is generated by Koksmat Studio. You can modify it as you like.
* The code is generated based on the database and table you have selected.
* No warranty is given for the code.
* 
* Suggest that you use the refactor function and move the code to a separate file,
* then move that file to a folder where you keep your custom hooks.

* ----------------------------------------------------------
*/

  const magicbox = useContext(MagicboxContext);
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState<any>();
  const deleteItem = async (id: number, hard: boolean) => {
    setloading(true);
    seterror("");
    const result = await execute(

      magicbox.authtoken, // <-- this is the authentication token containing the user's credentials - the upn will be used as "actor" name
      "booking", // <-- this is a reference to a record in the connections table in the mix database
      "magic-mix.app", // <-- this is the service name processing the request
      "delete_site", // <-- this is the name of the procedure in the database pointed to by the connection
      { id } // <-- this is the data to be sent to the procedure
    );
    setloading(false);
    if (result.hasError) {
      seterror(result.errorMessage ?? "Unknown error");
    }
    setresult(result);


  }
  return { deleteItem, error, loading, result };
}

