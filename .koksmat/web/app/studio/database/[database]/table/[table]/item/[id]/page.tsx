"use client";

import { APPNAME } from "@/app/global";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import DatabaseItemSnippetTools from "@/components/database-item-snippet-tools";
import LayoutHeader from "@/components/layout-header";
import SQLCards from "@/components/sql-cards";
import TerminalEditor from "@/components/terminal-editor";
import { buildInterface } from "@/lib/buildInterface";
import { CardStackIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
} from "quicktype-core";
import JsonToTS from "json-to-ts";
async function jsonToInterface(jsonString: string): Promise<string> {
  const jsonInput = jsonInputForTargetLanguage("typescript");
  debugger;
  await jsonInput.addSource({
    name: "GeneratedType", // This will be the name of the generated interface
    samples: [jsonString],
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: "typescript", // Specify TypeScript as the target language
  });

  return result.lines.join("\n");
}
function capitalizeFirstChar(str: string): string {
  if (str.length === 0) return str; // Return empty string if input is empty
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default function Page(props: {
  params: { database: string; table: string; id: string };
}) {
  const { database, table, id } = props.params;
  const [json, setjson] = useState("");
  const [code, setcode] = useState("");
  const data = useSQLSelect3(
    database,
    `SELECT * FROM ${table} WHERE id = ${id}`
  );
  const [interfaceDefintions, setinterfaceDefintions] = useState("");
  const [interfacename, setinterfacename] = useState("");
  useEffect(() => {
    if (!json) return;
    const obj = JSON.parse(json);
    const newName =
      capitalizeFirstChar(database) + capitalizeFirstChar(table) + "Item";
    setinterfacename(newName);
    const interfaces = JsonToTS(obj).map((typeInterface, index) => {
      if (index === 0) {
        return typeInterface.replace("RootObject", newName);
      } else {
        return typeInterface;
      }
      //console.log(typeInterface);
    });
    const interfaceDefintions = interfaces.join("\n");
    setinterfaceDefintions(interfaceDefintions);
    // const load = async () => {
    //   const name = "I" + database + table + "Props";
    //   setinterfacename(name);
    //   const code = await jsonToInterface(JSON.stringify(json, null, 2));
    //   setcode(code);
    // };
    // load();
  }, [json]);
  useEffect(() => {
    if (data.error) return;
    if (data.dataset.length === 0) return;
    setjson(JSON.stringify(data.dataset[0], null, 2));
  }, [data]);
  return (
    <div className="w-full h-full">
      <LayoutHeader
        title={"Database: " + database + " table: " + table + " Id:" + id}
        tools={[
          <div key="1" className="flex">
            <div className="p-1 ">Snippets:</div>
            <DatabaseItemSnippetTools
              databaseName={database}
              tableName={table}
              id={id}
              interfaceCode={interfaceDefintions}
              interfaceName={interfacename}
            />
          </div>,
        ]}
      ></LayoutHeader>
      {/* {JSON.stringify({ interfaceDefintions, interfacename })} */}
      <div className="flex  gap-2 border-t bg-background px-4 py-2  w-[calc(80vw-100px)] h-[calc(80vh-100px)]">
        <TerminalEditor
          code={JSON.stringify(data.dataset[0], null, 2)}
          language={"json"}
          onCodeChange={function (code: string): void {
            //throw new Error("Function not implemented.");
          }}
          onEnter={function (): void {
            //throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
