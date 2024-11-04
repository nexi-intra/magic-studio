
import ItemsViewer, { Visualisation } from "./items-viewer";

import { useSqlQueryContext } from "./contexts/sqlquery-context";


export function useSavedQueries(database: string, options?: {

  defaultVisualisation?: Visualisation;
  allowedVisualisations?: Visualisation[];
  allowSwitch?: boolean; onSelect?: (id: string) => void;
}) {

  const sqlQueryContext = useSqlQueryContext()


  return ({
    viewSavedQueries: <ItemsViewer
      allowSwitch={options?.allowSwitch}
      visualisation={options?.defaultVisualisation ?? "combobox"}
      allowedVisualizations={options?.allowedVisualisations}
      value=""
      placeholder="Queries"
      commands={sqlQueryContext.sqlQuerys}
      onSelect={(command) => {
        if (options?.onSelect) {
          options?.onSelect(command.id);
        }
      }} />
  });
}
