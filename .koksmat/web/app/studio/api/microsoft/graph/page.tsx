import { MSALTest } from "@/app/koksmat/msal/test";
import MsGraphNavCard from "@/components/ms-graph-nav-card";
import React from "react";

export default function Page() {
  return (
    <div>
      {" "}
      <MsGraphNavCard />
      <MSALTest />
    </div>
  );
}
