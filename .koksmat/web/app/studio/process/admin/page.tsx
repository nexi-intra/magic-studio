import WorkflowDebugger from '@/components/workflow-debugger'
import WorkflowTroubleshooter from '@/components/workflow-trouble-shooter'
import React from 'react'
type FlowMessage = {
  type: string;
  payload: Record<string, unknown>;
};

const flowMessages: FlowMessage[] = [
  {
    type: "add_flow",
    payload: {
      id: "flow1",
      flow_json: JSON.stringify({
        steps: [{ name: "step1" }],
      }),
    },
  },
  {
    type: "start_flow",
    payload: {
      id: "flow1",
    },
  },
  {
    type: "pause_flow",
    payload: {
      id: "flow1",
    },
  },
  {
    type: "stop_flow",
    payload: {
      id: "flow1",
    },
  },
  {
    type: "delete_flow",
    payload: {
      id: "flow1",
    },
  },
  {
    type: "get_flow",
    payload: {
      id: "flow1",
    },
  },
  {
    type: "get_all_flows",
    payload: {},
  },
];
export default function Page() {
  return (
    <div>
      <WorkflowDebugger flowMessages={flowMessages} />
      <WorkflowTroubleshooter /></div>
  )
}
