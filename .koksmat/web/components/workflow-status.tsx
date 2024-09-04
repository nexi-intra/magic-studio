import React, { useState } from "react";
import { StageComponent } from "./workflow-components";
import { WorkflowData } from "./workflow-interfaces";

export default function WorkflowStatus(props: { workflowData: WorkflowData }) {
  const { workflowData } = props;
  const [currentStage, setCurrentStage] = useState(1);
  const [currentAction, setCurrentAction] = useState(0);

  const handleAction = (stageIndex: number, actionIndex: number) => {
    if (stageIndex === currentStage - 1 && actionIndex === currentAction) {
      if (actionIndex === workflowData.stage[stageIndex].actions.length - 1) {
        setCurrentStage(currentStage + 1);
        setCurrentAction(0);
      } else {
        setCurrentAction(currentAction + 1);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{workflowData.name}</h1>
      <p className="text-gray-600 mb-2">{workflowData.description}</p>
      <p className="text-gray-600 mb-6">{workflowData.purpose}</p>
      <div className="space-y-4">
        {workflowData.stage?.map((stage, index) => (
          <StageComponent
            key={stage.id}
            stage={stage}
            index={index}
            isCompleted={index < currentStage - 1}
            isActive={index === currentStage - 1}
            currentAction={currentAction}
            onActionClick={(actionIndex) => handleAction(index, actionIndex)}
          />
        ))}
      </div>
    </div>
  );
}
