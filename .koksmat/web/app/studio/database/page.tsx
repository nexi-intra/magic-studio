"use client";

import { DatabaseProps, FrontPage } from "@/components/front-page";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";

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
  return <FrontPage databases={databases.dataset} />;
}
