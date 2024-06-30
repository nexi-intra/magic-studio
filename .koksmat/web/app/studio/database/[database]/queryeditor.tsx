"use client";

import { useRouter } from "next/navigation";
import ListProceduresTable from "@/components/ListProceduresTable";
import { QueryActions, QueryEditor } from "@/components/query-editor";
import { useEffect, useState } from "react";
import { create } from "domain";
import CreateAction from "@/components/create-action";
import DialogForm from "@/components/dialogueform";

export default function QueryEditorPage(props: {
  params: { database: string };
}) {
  const { database } = props.params;
  const [action, setaction] = useState<"none" | "create">("none");
  const [counter, setcounter] = useState(0);
  const [currentAction, setcurrentAction] = useState<JSX.Element | undefined>();

  useEffect(() => {
    setcounter(counter + 1);
    switch (action) {
      case "create":
        const component = (
          <div>
            <DialogForm
              className=" min-w-[calc(100vw-100px)] min-h-[calc(100vh-100px)]"
              caption="New Action"
              description=""
              onClose={(submitted: boolean) => {
                if (submitted === true) {
                  alert("submitted");
                }
                setaction("none");
              }}
              count={counter}
            >
              <CreateAction />
            </DialogForm>
          </div>
        );
        setcurrentAction(component);
        break;
      default:
        setcurrentAction(<div />);
    }
  }, [action]);

  const actions: QueryActions = {
    onCreateNew: () => {
      setaction("create");
    },
  };
  return (
    <div>
      <QueryEditor
        actions={actions}
        editor={null}
        result={<ListProceduresTable database={database} />}
      />
      {currentAction}
    </div>
  );
}
