import { ColumnDef } from "@tanstack/react-table";

import ToSmall from "@/app/koksmat/components/tosmall";
import { GenericTableActions } from "./components/GenericTableActions";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { GenericItem } from "./data/schema";
import { useMemo } from "react";

export interface GenericTableProps {
  caption?: string;
  description?: string;
  data: any;
  addtionalColumns?: ColumnDef<GenericItem<any>>[];
  actions?: GenericTableActions<GenericItem<any>>;
}

export function GenericTable(params: GenericTableProps) {
  const { data, addtionalColumns } = params;
  const instanceColumns = [...columns];
  if (params.addtionalColumns) {
    params.addtionalColumns.forEach((c) =>
      instanceColumns.splice(columns.length - 1, 0, c)
    );
  }
  const tableData = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);
  return (
    <>
      <div className=" h-full flex-1 flex-col   flex">
        {params.caption && (
          <div className="mb-4 flex items-center  ">
            <div className="text-2xl font-bold">{params.caption}</div>
            <div className="text-md ml-3">{params.description}</div>
          </div>
        )}

        <DataTable
          data={tableData}
          columns={instanceColumns}
          actions={params.actions}
        />
      </div>
    </>
  );
}
