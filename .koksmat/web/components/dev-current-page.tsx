//"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { https } from "@/app/koksmat/httphelper";
import { LayersIcon, MessageCircleIcon } from "lucide-react";
export default function DevCurrentPage() {
  const pathname = usePathname();

  const [pageName, setPageName] = useState("");
  const openInVSCode = async (pageName: string) => {
    const body = JSON.stringify({
      sessionid: "sessionid",
      action: "open",
      command: "code",
      args: [pageName],
    });
    const result = await fetch("/api/autopilot/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    const j = await result.json();
  };
  useEffect(() => {
    const fetchPageName = async () => {
      const pageInfo = await https<string>(
        "",
        "POST",
        "/api/autopilot/pageinfo",
        {
          url: pathname,
        }
      );
      setPageName(pageInfo.data!);
    };

    fetchPageName();
  }, [pathname]);

  return (
    <div>
      <div
        onClick={() => {
          openInVSCode(pageName);
        }}
      >
        <LayersIcon className="h-6 w-6 stroke-1" />
      </div>
    </div>
  );
}
