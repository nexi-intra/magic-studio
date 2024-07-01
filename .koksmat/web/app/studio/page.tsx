"use client";

import {
  DatabaseProps,
  DashboardDatabases,
} from "@/components/dashboard-databases";
import { useSQLSelect3 } from "../koksmat/usesqlselect3";
import { DashboardHomepage } from "@/components/dashboard-homepage";

export default function Page() {
  const databases = useSQLSelect3<DatabaseProps>(
    "mix",
    `
select  id

,name as title
,name as slug
,description 
from public.connection
ORDER BY name

    `
  );
  return <DashboardHomepage />;
}
