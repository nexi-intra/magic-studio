"use client";
import WorkflowDebugger from '@/components/workflow-debugger'
import WorkflowTroubleshooter from '@/components/workflow-trouble-shooter'
import { nanoid } from 'nanoid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'
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
  const searchParams = useSearchParams()
  const path = usePathname()
  const router = useRouter()
  const traceid = searchParams.get('traceid')
  const [id, setid] = useState("")

  useEffect(() => {
    if (!traceid) {
      const id = nanoid()
      router.push(`${path}?traceid=${id}`)
    }
    setid(traceid!)

  }, [traceid])
  if (!id) {
    return <div>Setting traceid</div>
  }
  return (
    <div>
      {/* <WorkflowDebugger flowMessages={flowMessages} /> */}
      <WorkflowTroubleshooter traceId={id} /></div>
  )
}
