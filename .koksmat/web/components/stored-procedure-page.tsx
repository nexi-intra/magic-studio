"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/vFndfg4IeKP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { CSSProperties, useContext, useEffect, useState } from "react";
import { APPNAME } from "@/app/global";
import { extractAndParseJson } from "@/lib/tsql-extract";
import { z } from "zod";
import { resolveRefs } from "json-refs";
import * as parserTypeScript from "prettier/parser-typescript";
import * as prettier from "prettier/standalone";
import { jsonSchemaToZod } from "json-schema-to-zod";
import InterfaceBuilder from "./interface-builder";
import { InterfaceViewer } from "./interface-viewer";
import { shareCreateBite } from "./actions/share-create-bite";
import { createIngredienceTemmplate } from "@/lib/kitchen";
import { nanoid } from "nanoid";
import { FilePenIcon } from "./icons/FilePenIcon";
import { DownloadIcon } from "./icons/DownloadIcon";
import { DatabaseIcon } from "./icons/DatabaseIcon";
import { buildInterface } from "@/lib/buildInterface";
import { Code2Icon, Play, PlayIcon, SquareFunction } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateDatabaseCallSourceCode } from "@/lib/generatevalidationfunction";
import SourceCode from "./view-sourcecode";
import WithClipboardCopy from "./with-clipboardcopy";

export interface Root {
  Result: Result[];
}

export interface Result {
  procedure_info: ProcedureInfo;
}

export interface ProcedureInfo {
  procedure_name: string;
  comment: string;
  language: string;
  source_code: string;
  dependencies: any[];
}

function buildFunction(jsonSchema: any, zodSchema: any) {
  return "";
}

export function StoredProcedurePage(props: {
  database: string;
  procedure: string;
}) {
  const { database, procedure } = props;

  const magicbox = useContext(MagicboxContext);
  const sql = `
WITH proc_source AS (
    SELECT
        p.oid AS procedure_oid,
        p.proname AS procedure_name,
        l.lanname AS language,
        pg_get_functiondef(p.oid) AS source_code,
        d.description AS comment
    FROM
        pg_proc p
    JOIN
        pg_language l ON p.prolang = l.oid
    LEFT JOIN
        pg_description d ON p.oid = d.objoid
    WHERE
        p.proname = '${procedure}'
),
func_deps AS (
    SELECT
        d.refobjid AS table_oid,
        d.objid AS procedure_oid,
        c2.relname AS table_name
    FROM
        pg_depend d
    JOIN
        pg_proc p ON d.objid = p.oid
    JOIN
        pg_class c2 ON d.refobjid = c2.oid
    WHERE
        p.proname = '${procedure}'
        AND c2.relkind = 'r'
)
SELECT json_build_object(
    'procedure_name', ps.procedure_name,
    'language', ps.language,
    'source_code', ps.source_code,
    'comment', ps.comment,
    'dependencies', COALESCE(json_agg(fd.table_name) FILTER (WHERE fd.table_name IS NOT NULL), '[]'::json)
) AS procedure_info
FROM
    proc_source ps
LEFT JOIN
    func_deps fd ON ps.procedure_oid = fd.procedure_oid
GROUP BY
    ps.procedure_name, ps.language, ps.source_code, ps.comment

  `;
  const query = useSQLSelect3<Result>(database, sql);

  const relationQuery = useSQLSelect3<any>(
    database,
    `
WITH RECURSIVE proc_deps AS (
    -- Starting point: Get the details of the target procedure
    SELECT 
        p.oid AS procedure_oid,
        p.proname AS procedure_name,
        pg_get_functiondef(p.oid) AS source_code,
        d.description AS comment
    FROM 
        pg_proc p
    LEFT JOIN 
        pg_description d ON p.oid = d.objoid
    WHERE 
        p.proname = '${procedure}'
    
    UNION ALL
    
    -- Recursively find all dependent procedures and functions
    SELECT 
        p.oid,
        p.proname,
        pg_get_functiondef(p.oid) AS source_code,
        d.description
    FROM 
        pg_depend dep
    JOIN 
        pg_proc p ON dep.objid = p.oid
    LEFT JOIN 
        pg_description d ON p.oid = d.objoid
    JOIN 
        proc_deps pd ON dep.refobjid = pd.procedure_oid
    WHERE 
        p.oid != pd.procedure_oid
),
table_deps AS (
    -- Get the tables that the target procedure and its dependencies depend on
    SELECT 
        DISTINCT c.relname AS table_name
    FROM 
        pg_depend dep
    JOIN 
        pg_class c ON dep.refobjid = c.oid
    JOIN 
        proc_deps pd ON dep.objid = pd.procedure_oid
    WHERE 
        c.relkind = 'r'
)
SELECT 
    'procedure' AS type,
    procedure_name AS name,
    source_code,
    comment
FROM 
    proc_deps
UNION ALL
SELECT 
    'table' AS type,
    table_name AS name,
    NULL AS source_code,
    NULL AS comment
FROM 
    table_deps
    
    `
  );
  const [procedureInfo, setprocedureInfo] = useState<ProcedureInfo>();
  const [jsonSchema, setjsonSchema] = useState<any | null>();
  const [zodSchema, setzodSchema] = useState<any | null>();
  const [tsInterface, settsInterface] = useState("");
  const [shareId, setshareId] = useState("");
  const [tsxComponentCode, settsxComponentCode] = useState("");
  const [errorMessage, seterrorMessage] = useState("");
  const [biteReady, setbiteReady] = useState(false);
  const [isProcessing, setisProcessing] = useState(false);
  const [functionCode, setfunctionCode] = useState("");
  const [importCode, setimportCode] = useState("");
  const [callCode, setcallCode] = useState("");

  useEffect(() => {
    if (query && query.dataset && query.dataset.length > 0) {
      setprocedureInfo(query.dataset[0].procedure_info);
    }
  }, [query.dataset]);

  useEffect(() => {
    if (!procedureInfo) {
      return;
    }

    const metadata = extractAndParseJson(procedureInfo.source_code);
    if (metadata) {
      try {
        setjsonSchema(metadata);
        const txtcode = jsonSchemaToZod(metadata);

        // const code = prettier.format(txtcode, {
        //   parser: "typescript",
        //   plugins: [parserTypeScript],
        // });
        //setzodSchema(JSON.parse(zodSchema));
        setzodSchema(txtcode);
        const code = generateDatabaseCallSourceCode(
          database,
          procedure,
          metadata,
          txtcode
        );
        setfunctionCode(code.source);
        setimportCode(code.import);
        setcallCode(code.call);
      } catch (error) {
        setzodSchema(error);
      }
    }
  }, [procedureInfo]);

  useEffect(() => {
    const load = async () => {
      const code = await buildInterface(
        (procedureInfo?.procedure_name ?? "Unknown") + "Props",
        JSON.stringify(jsonSchema, null, 2)
      );
      settsInterface(code);
      const tsx = await createIngredienceTemmplate(
        database,
        procedure,
        "CreateBiteProps",
        code
      );
      settsxComponentCode(tsx.tsxContent);
    };
    load();
  }, [jsonSchema]);

  const handleShareCreateBite = async () => {
    setisProcessing(true);
    seterrorMessage("");
    let id = nanoid();
    setshareId(id);
    const result = await shareCreateBite(
      magicbox.authtoken,
      id,
      `A bite for ${procedure} in ${database}`,
      createIngredienceTemmplate(
        database,
        procedure,
        "CreateBiteProps",
        tsInterface
      )
    );
    setisProcessing(false);

    if (result.hasError) {
      seterrorMessage(result.errorMessage ?? "unknown error");
      return;
    }
    setbiteReady(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background  py-3 shadow-sm sm:px-6">
        <div className=" mx-auto flex items-center justify-between">
          <div className="flex items-center ">
            <span className="font-bold text-3xl">
              {procedure.toUpperCase()}
            </span>

            {/* <span className="text-muted-foreground">Procedure Name</span> */}
          </div>
          <div className="flex items-center gap-4">
            {/* <Button variant="outline">
              <PlayIcon className="mr-2 h-4 w-4" />
              Run
            </Button>
            <Button
              disabled={isProcessing}
              onClick={() => handleShareCreateBite()}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button> */}
          </div>
        </div>
      </header>

      <div className="container mx-auto grid  gap-8 py-8 sm:px-6">
        <div className="space-y-8">
          <Accordion type="multiple">
            <AccordionItem value="item--1">
              <AccordionTrigger>
                <h2 className="mb-4 text-2xl font-bold">TypeScript</h2>
                Like it to be easy for you to call this procedure directly from
                your TypeScript code
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <h3 className="ml-4 mb-4 text-xl font-bold">
                        Prerequisites
                      </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                      Ensure that you have the following dependencies installed:
                      <SourceCode language="typescript" isDark>
                        {`pnpm add zod';`}
                      </SourceCode>
                      <div className="flex gap-1 items-center">
                        Ensure that you have the file
                        <WithClipboardCopy text={`/app/api/run/route.ts`}>
                          <b>/app/api/run/route.ts</b>{" "}
                        </WithClipboardCopy>
                      </div>
                      <SourceCode language="typescript" isDark>
                        {`
                    
import { run } from "@/actions/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const result = await run(
      res.channel,
      res.args,
      res.body,
      res.timeout,
      res.transactionId
    );
    return Response.json(result);
  } catch (error) {
    return Response.error();
  }
}
                    
                    `}
                      </SourceCode>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="flex items-center gap-1">
                  Create a new file named&nbsp;
                  <WithClipboardCopy
                    text={`actions/database/${database}/${procedure}.ts`}
                  >
                    <b>
                      actions/database/{database}/{procedure}
                      .ts
                    </b>{" "}
                  </WithClipboardCopy>
                  and copy and paste the following code:
                </div>
                <SourceCode language="typescript" isDark>
                  {functionCode}
                </SourceCode>
                In the component where you want to call the procedure, add the
                import statement:
                <SourceCode language="typescript" isDark>
                  {importCode}
                </SourceCode>
                Then you can call the procedure like this:
                <SourceCode language="typescript" isDark>
                  {callCode}
                </SourceCode>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item--2">
              <AccordionTrigger>
                <h2 className="mb-4 text-2xl font-bold">
                  AI prompt suggestions
                </h2>
                You might want use AI for generating the UI
              </AccordionTrigger>
              <AccordionContent>
                <Accordion type="multiple">
                  <AccordionItem value="item--2">
                    <AccordionTrigger>
                      <h2 className="ml-8 mb-4 text-2xl font-bold">
                        v0.dev prompt
                      </h2>
                      <p>
                        You can use v0.dev to generate Next.JS based UI based on
                        prompts or images
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className="ml-8 ">
                      <section>
                        Copy this prompt:
                        <SourceCode language="text" isDark>
                          {`
like to have a component which can be used to get data from a zod schema. 
The input values shall be kept using state variables. Like to have a cancel button and a submit button

 ${zodSchema}

                   
                  `}
                        </SourceCode>
                        Then open{" "}
                        <Link href="https://v0.dev" target="_blank">
                          v0.dev
                        </Link>
                      </section>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item--2">
                    <AccordionTrigger>
                      <h2 className="ml-8 mb-4 text-2xl font-bold">Chat GPT</h2>

                      <p>
                        You can use{" "}
                        <Link href="https://chat.openai.com/" target="_blank">
                          Chat GPT
                        </Link>{" "}
                        to refine the code from v0.dev -{" "}
                        <Link href="https://chatgpt.com/share/8028c27a-0a8c-4fdf-9ed2-2aeccdd801ab">
                          <Button variant="link">check this example</Button>
                        </Link>
                      </p>
                    </AccordionTrigger>
                    <AccordionContent className="ml-8 ">
                      <section>
                        Copy this prompt to Chat GPT:
                        <SourceCode language="text" isDark>
                          {`
convert from jsx to tsx

<Insert code here>

and like to have all input having an id ending with _id to be replaced with a component which is consisting of a textfield and a lookup button - the lookup button shall trigger a shadcdn popover presenting a search fields and a list of values matching those
                   
                  `}
                        </SourceCode>
                        Copy the code from v0.dev and paste it into Chat GPT and
                        press send.
                      </section>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-0" className="hidden">
              <AccordionTrigger>
                <h2 className="mb-4 text-2xl font-bold">Copy</h2>
              </AccordionTrigger>
              <AccordionContent>
                <section>
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        errorMessage,
                        biteReady,
                        token: magicbox.authtoken?.substring(0, 10),
                        jsonSchema,
                        zodSchema,
                      },
                      null,
                      2
                    )}
                  </pre>
                </section>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-1" className="hidden">
              <AccordionTrigger>
                <h2 className="mb-4 text-2xl font-bold">Integration Options</h2>
              </AccordionTrigger>
              <AccordionContent>
                <section>
                  <div>
                    <h3 className="mb-2 text-lg font-medium">
                      React Component
                    </h3>
                    <SourceCode language="jsx" isDark>
                      {tsxComponentCode}
                    </SourceCode>

                    {/* <InterfaceBuilder
                schema={JSON.stringify(jsonSchema, null, 2)}
                typeName={
                  (procedureInfo?.procedure_name ?? "Unknown") + "Props"
                }
              /> */}
                  </div>
                </section>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <h2 className="mb-4 text-2xl font-bold">
                  Stored Procedure Source code
                </h2>
                If you like to understand what is actually happening in the
                database
              </AccordionTrigger>
              <AccordionContent>
                <section>
                  <div className="grid gap-8">
                    {/* <div>
                      <h3 className="mb-2 text-lg font-medium">Description</h3>
                      <pre>{procedureInfo?.comment}</pre>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-medium">
                        Table Dependencies
                      </h3>
                      <ul className="space-y-1">
                        {procedureInfo?.dependencies.map((dep, index) => (
                          <li key={index}>
                            <Link
                              href={
                                "/" +
                                APPNAME +
                                "/database/" +
                                database +
                                "/table/" +
                                dep
                              }
                              className="text-primary hover:underline"
                              prefetch={false}
                            >
                              {dep}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div> */}
                    <div>
                      <h3 className="mb-2 text-lg font-medium">Source Code</h3>

                      <SourceCode language="sql" isDark>
                        {procedureInfo?.source_code}
                      </SourceCode>
                    </div>
                  </div>
                </section>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="hidden">
              <AccordionTrigger>
                <h2 className="mb-4 text-2xl font-bold">REST POST</h2>
              </AccordionTrigger>
              <AccordionContent>
                <section>
                  <div className="grid gap-4">
                    <div>
                      <pre className="rounded-md bg-muted p-4 text-sm">
                        <code>{`
const response = await fetch('/api/procedures/GetOrdersByUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ UserId: 123 }),
});

const data = await response.json();
console.log(data);
                    `}</code>
                      </pre>
                    </div>
                  </div>
                </section>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <footer className="mt-auto border-t bg-background px-4 py-4 shadow-sm sm:px-6">
        <div className="container mx-auto flex items-center justify-between"></div>
      </footer>
    </div>
  );
}
