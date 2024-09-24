import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { useState, useEffect } from "react";
import { CommandSelectorItem } from "./command-selector";
import ItemsViewer, { Visualisation } from "./items-viewer";
import { Result } from "./query-editor-toolbar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


export function useSavedQueries(database: string, options?: {

  defaultVisualisation?: Visualisation,
  allowedVisualisations?: Visualisation[],
  allowSwitch?: boolean, onSelect?: (id: string) => void
}) {
  const [queries, setqueries] = useState<CommandSelectorItem[]>([]);
  const query = useSQLSelect3<Result>(database, "select id,name,sql,description,updated_at,updated_by from sqlquery order by name");
  useEffect(() => {
    if (query && query.dataset && query.dataset.length > 0) {
      //setdbinfo(query.dataset[0].result);
      const items = query.dataset.map((item: any) => {
        const cmd: CommandSelectorItem = {
          id: item.id,
          title: item.name,
          description: item.name,
          timestamp: item.updated_at,
          author: item.updated_by,
          children: <HoverCard>
            <HoverCardTrigger>Hover</HoverCardTrigger>
            <HoverCardContent>
              {item.sql}
            </HoverCardContent>
          </HoverCard>
          ,
          slug: item.name,
        };
        return cmd;
      }).sort((a: any, b: any) => a.title.localeCompare(b.title));


      setqueries(items);
    }
  }, [database, query.dataset]);
  return ({
    viewSavedQueries: <ItemsViewer
      allowSwitch={options?.allowSwitch}
      visualisation={options?.defaultVisualisation ?? "combobox"}
      allowedVisualizations={options?.allowedVisualisations}
      value=""
      placeholder="Queries"
      commands={queries ? queries : []}
      onSelect={(command) => {
        if (options?.onSelect) {
          options?.onSelect(command.id);
        }
      }} />
  });
}
