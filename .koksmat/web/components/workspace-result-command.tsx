import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import React, { useContext, useEffect, useState } from "react";

export default function WorkspaceResult(props: {
  workspaceid: string;
  folder: string;
  command: string;
  args: string[];

  parser: (response: string) => JSX.Element;
}) {
  const magicbox = useContext(MagicboxContext);
  const { workspaceid, folder, command, args } = props;
  const [items, setitems] = useState<JSX.Element[]>([]);
  const [error, seterror] = useState("");
  useEffect(() => {
    const load = async () => {
      // post using fetch to get the connection status
      seterror("");
      const request1 = new Request(`/api/autopilot/exec`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${magicbox.authtoken}`,
        },
        method: "POST",
        body: JSON.stringify({
          sessionid: workspaceid,
          action: "execute",
          command, //: "gh",
          args, //: ["release", "list", "--json", "name,tagName,publishAt"],
          cwd: folder,
        }),
      });
      const result = await fetch(request1);
      const response = await result.json();
      if (response.error_message) {
        seterror(response.error_message);
        return;
      }
      try {
        const items = JSON.parse(response.body).map((item: any) =>
          props.parser(item)
        );
        setitems(items);
      } catch (e) {
        seterror("no result");
      }
    };

    if (!props.folder) return;
    load();
  }, [props.folder]);

  return (
    <div>
      {error && <div className="text-red-500 p-4">{error}</div>}
      {items.map((item, index) => {
        return <div key={index}>{item}</div>;
      })}
    </div>
  );
}
