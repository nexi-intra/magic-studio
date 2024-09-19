"use client";

import { useState } from "react";
import { Book, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { database } from "@/actions/database/works/activityModel";

type Action = "read" | "add" | "update" | "delete";

const snippets = (
  databaseName: string,
  tableName: string,
  id: string,
  interfaceCode: string,
  interfaceName: string
): Record<Action, string> => {
  debugger;
  return {
    read:
      `
      
  
 
  /* ---------------------- Load Record ---------------------- 
  * This code is generated by Koksmat Studio. You can modify it as you like.
  * The code is generated based on the database and table you have selected.
  * No warranty is given for the code.
  * ----------------------------------------------------------
  */

  // import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
// import React, { useEffect, useState } from "react";
 // const { databaseRecord, isLoading, error } = useDatabase${interfaceName}(props.id);  // replace props.id with the id of the record you want to load
 
 ${interfaceCode}
 
 function useDatabase${interfaceName}(id: string) {

  
  const [error, seterror] = useState("");
  const databaseQuery = useSQLSelect3< ${interfaceName ? interfaceName : "any"}>(
    "${databaseName}",
    ` +
      "`" +
      `SELECT * FROM "${tableName}" WHERE id = ${id}` +
      ` ` +
      "` // you might like to take the id from somewhere else" +
      `
  );
  const [databaseRecord, setdatabaseRecord] = useState< ${interfaceName}>();
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
  
  
  `,
    add: 'db.collection("users").add({ name: "John Doe", age: 30 })',
    update: 'db.collection("users").doc(userId).update({ age: 31 })',
    delete: 'db.collection("users").doc(userId).delete()',
  };
};

export default function DatabaseItemSnippetTools(props: {
  databaseName: string;
  tableName: string;
  interfaceCode: string;
  interfaceName: string;
  id: string;
}) {
  const { databaseName, tableName, id, interfaceCode, interfaceName } = props;
  const [copiedAction, setCopiedAction] = useState<Action | null>(null);

  const copyToClipboard = async (action: Action) => {
    try {
      await navigator.clipboard.writeText(
        snippets(databaseName, tableName, id, interfaceCode, interfaceName)[
          action
        ]
      );
      setCopiedAction(action);
      setTimeout(() => setCopiedAction(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderButton = (
    action: Action,
    icon: React.ReactNode,
    label: string
  ) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`relative ${copiedAction === action ? "animate-pulse" : ""}`}
            onClick={() => copyToClipboard(action)}
          >
            {icon}
            <span className="sr-only">{label}</span>
            {copiedAction === action && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                ✓
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="flex space-x-2  bg-background rounded-lg shadow">
      {renderButton("read", <Book className="h-4 w-4" />, "Read Record")}
      {renderButton("add", <PlusCircle className="h-4 w-4" />, "Add Record")}
      {renderButton("update", <Edit className="h-4 w-4" />, "Update Record")}
      {renderButton("delete", <Trash2 className="h-4 w-4" />, "Delete Record")}
    </div>
  );
}