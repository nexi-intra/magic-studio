import Link from "next/link";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useMemo, useState } from "react";
import { APPNAME } from "@/app/global";
import {
  TableDetail,
  TableMetadata,
  tableDetailsSql,
} from "@/schemas/table-details";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "./ui/button";
import { ArrowRight, FolderSyncIcon } from "lucide-react";
import { hasField } from "@/lib/datamodel";
import EditableText from "./editable-text";
import useDatabaseRecord from "./hooks/use-database-record";
import { Model, _schema } from "@/actions/database/.shared/koksmat_model";

export function TablePage(props: { database: string; table: string }) {
  const key = "table." + props.database + "." + props.table;
  const [mapfields, setmapfields] = useState(false);
  const { database, table } = props;
  const query = useSQLSelect3<TableDetail>(database, tableDetailsSql(table));
  const model = useDatabaseRecord(_schema, key, database, table);
  const tableMetadata = useMemo<TableMetadata>(() => {
    let metadata: TableMetadata = {
      table_name: "",
      row_count: 0,
      disk_size: "",
      columns: [],
      referencing_functions: [],
    };
    if (query.dataset.length > 0) {
      metadata = query.dataset[0].table_metadata;
    }
    return metadata;
  }, [database, table, query.dataset]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 lg:p-10">
      <div className="flex items-center justify-between">
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold uppercase">
            {tableMetadata.table_name}
          </h1>
          <p className="text-muted-foreground">
            Detailed information about the table.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={"outline"}
            className="h-9 px-6"
            onClick={() => setmapfields(!mapfields)}
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            {/* <FolderSyncIcon className="w-4 h-4 mr-2" /> */}
            Map
          </Button>
          <Button
            variant={"outline"}
            className="h-9 px-6"
            onClick={() => {
              model.save({
                name: key,
                description: "Table Model",
                data: { hello: "world" },
              });
            }}
          >
            Save Model
          </Button>
          <Link
            href={
              "/" +
              APPNAME +
              "/database/" +
              database +
              "/table/" +
              table +
              "/sync"
            }
          >
            <Button variant={"outline"} className="h-9 px-6">
              <FolderSyncIcon className="w-4 h-4 mr-2" />
              Sync
            </Button>
          </Link>
          <Link
            href={
              "/" +
              APPNAME +
              "/database/" +
              database +
              "/table/" +
              table +
              "/item"
            }
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Items
          </Link>
        </div>
      </div>
      <div className="grid gap-6 rounded-lg border bg-background p-6 md:p-8 lg:p-10">
        <div className="grid gap-2 hidden">
          <h2 className="text-xl font-bold">Table Details</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* <div className="grid gap-1">
              <p className="text-muted-foreground">Items</p>
              <p className="font-medium">{tableMetadata.row_count}</p>
            </div> */}
            <div className="grid gap-1">
              <p className="text-muted-foreground">Columns</p>
              <p className="font-medium">
                {
                  tableMetadata.columns.filter(
                    (column) => !hasField(column.column_name, "system")
                  ).length
                }
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-muted-foreground">Procedures</p>
              <p className="font-medium">
                {tableMetadata?.referencing_functions?.length}
              </p>
            </div>
            <div className="grid gap-1">
              <p className="text-muted-foreground">Disk size</p>
              <p className="font-medium">{tableMetadata.disk_size}</p>
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <h2 className="text-xl font-bold">Columns</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {mapfields && <TableCell>Map</TableCell>}
                {!mapfields && (
                  <>
                    <TableHead>Type</TableHead>
                    <TableHead>Nullable</TableHead>
                    <TableHead>Default</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableMetadata.columns
                .filter((column) => !hasField(column.column_name, "system"))
                .map((column, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {column.column_name}
                      </TableCell>
                      {mapfields && (
                        <TableCell>
                          <EditableText
                            fixed
                            initialText={column.column_name}
                            onSave={async (text: string) => {
                              return true;
                            }}
                          />
                        </TableCell>
                      )}
                      {!mapfields && (
                        <>
                          <TableCell>{column.data_type}</TableCell>
                          <TableCell>{column.is_nullable}</TableCell>
                          <TableCell>{column.column_default}</TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <div className="grid gap-2 hidden">
          <h2 className="text-xl font-bold">Functions &amp; Procedures</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableMetadata?.referencing_functions
                ?.sort((a, b) => a.function_name.localeCompare(b.function_name))
                .map((column, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <Link
                          href={
                            "/" +
                            APPNAME +
                            "/database/" +
                            database +
                            "/procedure/" +
                            column.function_name
                          }
                          className="text-blue-600 hover:underline"
                          prefetch={false}
                        >
                          <Button variant="link">{column.function_name}</Button>
                        </Link>
                      </TableCell>
                      <TableCell className="overflow-clip whitespace-nowrap w-full">
                        <HoverCard>
                          <HoverCardTrigger>
                            {column.function_definition}
                          </HoverCardTrigger>
                          <HoverCardContent className="w-full overflow-scroll h-[400px] bg-slate-100">
                            <pre>{column.function_definition}</pre>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                      {/* <TableCell>{column.is_nullable}</TableCell>
                    <TableCell>{column.column_default}</TableCell> */}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function EyeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
