"use client";
import React, { useEffect, useState } from "react";
import {
  quicktype,
  InputData,
  jsonInputForTargetLanguage,
  JSONSchemaInput,
  FetchingJSONSchemaStore,
} from "quicktype-core";

export default function InterfaceBuilder(props: {
  schema: string;
  typeName: string;
}) {
  const { schema, typeName } = props;
  const [code, setcode] = useState("");
  useEffect(() => {
    const load = async () => {
      const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
      await schemaInput.addSource({ name: typeName, schema });
      const inputData = new InputData();
      inputData.addInput(schemaInput);
      const { lines: tsLines } = await quicktype({
        inputData,
        lang: "typescript",
        rendererOptions: {
          "just-types": true,
        },
      });
      setcode(tsLines.join("\n"));
    };
    if (!schema) return;
    if (!typeName) return;
    load();
  }, [schema, typeName]);

  return (
    <div>
      <pre>{code}</pre>
    </div>
  );
}
