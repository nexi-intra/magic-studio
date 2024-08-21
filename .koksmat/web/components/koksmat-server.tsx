"use client";
import React, { use, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { WorkspaceContext } from "./contexts/workspacecontext";

export default function KoksmatServer() {
  const workspaceContext = useContext(WorkspaceContext);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const eventHandler = (event: any) => {
      console.log("Server", "Recieved message", event);

      if (event.data.koksmat) {
        const message = event.data.message;
        switch (message.type) {
          case "ping":
            //router.push(event.data.message.url);
            break;
          case "pathname":
            workspaceContext.setWebPathname(message.pathname);
            break;
        }
      }
    };

    window.addEventListener("message", eventHandler);

    return () => {
      window.removeEventListener("message", eventHandler);
    };
  }, []);

  // const sendMessage = (message: any) => {
  //   if (!window.parent || window === window.parent) return;
  //   window.parent.postMessage(
  //     {
  //       koksmat: true,
  //       message,
  //     },
  //     "*"
  //   );
  // };

  return null;
}
