"use client";

import { Button } from "@/components/ui/button";
import React, { Fragment, useContext, useState } from "react";

import { useDatabaseBookingSiteItemCreate, useDatabaseBookingSiteItemRead, useDatabaseBookingSiteItemUpdate, useDatabaseBookingSiteItemDelete } from "./useDatabaseBookingSite";

import BookingSiteEditor from "@/components/booking-site-editor";
import { execute } from "@/actions/client";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { record } from "zod";


export default function Page() {
  const siteCreator = useDatabaseBookingSiteItemCreate()
  const siteReader = useDatabaseBookingSiteItemRead("129")
  const siteUpdater = useDatabaseBookingSiteItemUpdate()
  const siteDeleted = useDatabaseBookingSiteItemDelete()
  if (!siteReader.databaseRecord) return <div>Loading...</div>
  return (
    <Fragment>
      <div>
        <Button onClick={() => {
          siteCreator.createItem({
            tenant: "",
            searchindex: "",
            name: "Niels",
            description: "",
            code: "",
            country_id: 3,
            parkingenabled: false,
            deskbookingenabled: false
          })
        }}>Add Building</Button>
      </div>

      <BookingSiteEditor initialData={siteReader.databaseRecord} onSave={function (updateData: Partial<{ tenant: string; searchindex: string; name: string; description: string; code: string; country_id: number; parkingenabled: boolean; deskbookingenabled: boolean; }>): void {
        if (!siteReader.databaseRecord) {
          alert("Cannot update a non-existing record")
          return
        }

        siteUpdater.updateItem({ ...siteReader.databaseRecord, name: updateData.name ?? "Blank" })

      }} />

      <Button onClick={() => {
        siteDeleted.deleteItem(129, true)
      }}>Delete</Button>
      <pre>{JSON.stringify(siteCreator, null, 2)}</pre>
      <pre>{JSON.stringify(siteReader, null, 2)}</pre>
      <pre>{JSON.stringify(siteUpdater, null, 2)}</pre>
      <pre>{JSON.stringify(siteDeleted, null, 2)}</pre>
    </Fragment>
  );
}
