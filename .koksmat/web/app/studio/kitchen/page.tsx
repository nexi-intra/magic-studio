"use client";
import CreateActivityModel, {
  CreateActivitymodelProps,
} from "@/components/actions/create-activitymodel";
import { Button } from "@/components/ui/button";
import WorkflowEditor from "@/components/workflow-editor2";
import { set } from "date-fns";
import React, { useEffect, useState } from "react";

export default function page() {
  const [activityModel, setactivityModel] =
    useState<CreateActivitymodelProps>();
  useEffect(() => {
    const activityModel: CreateActivitymodelProps = {
      activity: "x",
      data: {},
      description: "x",
      name: "x",
      searchindex: "x",
      tenant: "x",
    };
    setactivityModel(activityModel);
  }, []);
  const [id, setid] = useState("");

  return (
    <div>
      <Button type="button" onClick={() => setid("oneof")}>
        Save
      </Button>
      <CreateActivityModel transactionid={id} request={activityModel} />
      <WorkflowEditor />
    </div>
  );
}
