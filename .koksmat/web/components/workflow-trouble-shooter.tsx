"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, AlertCircle, Info, AlertTriangle, AlertOctagon } from "lucide-react"
import TraceTable from "./trace-table"

type LogLevel = "verbose" | "info" | "warning" | "error" | "critical"

interface TraceItem {
  id: number
  level: LogLevel
  message: string
  timestamp: string
  flowName: string
  flowInstanceId: string

}

interface Flow {
  id: number
  name: string
  details?: string
}

interface WorkflowTroubleshooterProps {
  initialFromDate?: string
  initialToDate?: string
  initialFlowName?: string
  initialFlowDetails?: string
  initialLogLevel?: LogLevel
  initialTraceItems?: TraceItem[]
  initialSelectedFlow?: Flow | null
  traceConnect?: (onTraceUpdated: (newTrace: TraceItem) => void) => void
  traceDisconnect?: () => void
}


//type LogLevel = "verbose" | "info" | "warning" | "error" | "critical";

interface TraceItem {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: string;
  flowName: string;
  flowInstanceId: string;
}

const flowNames = ['ProvisionUser', 'CreateSharedMailbox', 'UpdateDistributionList', 'ChangeAccess', 'ModifyMembership'];
const messages = [
  'Task initiated',
  'Task in progress',
  'Task completed successfully',
  'Task failed',
  'Retrying task',
  'Task scheduled'
];

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomTimestamp(): string {
  const now = new Date();

  // Randomly decide to generate a timestamp either today or in the past few days
  const daysAgo = Math.floor(Math.random() * 7); // Up to 7 days in the past
  const date = new Date(now);
  date.setDate(now.getDate() - daysAgo);

  // Simulate heavier traffic between 9 AM - 5 PM
  const hour = Math.floor(Math.random() * 8) + 9; // Hours between 9 AM and 5 PM
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);

  // Set time part
  date.setHours(hour, minute, second, 0);

  // If the generated date is in the future, cap it at the current time
  if (date > now) {
    return now.toISOString();
  }

  return date.toISOString();
}


function generateTraceItems(count: number): TraceItem[] {
  const logLevels: LogLevel[] = ["verbose", "info", "warning", "error", "critical"];
  const traceItems: TraceItem[] = [];

  for (let i = 0; i < count; i++) {
    const traceItem: TraceItem = {
      id: i + 1,
      level: getRandomItem(logLevels),
      message: getRandomItem(messages),
      timestamp: getRandomTimestamp(),
      flowName: getRandomItem(flowNames),
      flowInstanceId: `flow-${Math.random().toString(36).substring(2, 10)}`
    };

    traceItems.push(traceItem);
  }

  return traceItems;
}

// const traceItems = generateTraceItems(1000);

// console.log(traceItems);


export default function WorkflowTroubleshooter({
  initialFromDate = "",
  initialToDate = "",
  initialFlowName = "",
  initialFlowDetails = "",
  initialLogLevel = "info",
  initialTraceItems = generateTraceItems(1000),
  initialSelectedFlow = null,
  traceConnect,
  traceDisconnect
}: WorkflowTroubleshooterProps) {
  const [fromDate, setFromDate] = useState(initialFromDate)
  const [toDate, setToDate] = useState(initialToDate)
  const [flowName, setFlowName] = useState(initialFlowName)
  const [flowDetails, setFlowDetails] = useState(initialFlowDetails)
  const [logLevel, setLogLevel] = useState<LogLevel>(initialLogLevel)
  const [traceItems, setTraceItems] = useState<TraceItem[]>(initialTraceItems)
  const [selectedFlow, setSelectedFlow] = useState<Flow | null>(initialSelectedFlow)

  const onTraceUpdated = useCallback((newTrace: TraceItem) => {
    setTraceItems(prevItems => [...prevItems, newTrace])
  }, [])

  useEffect(() => {
    if (traceConnect) {
      traceConnect(onTraceUpdated)
    }

    return () => {
      if (traceDisconnect) {
        traceDisconnect()
      }
    }
  }, [traceConnect, traceDisconnect, onTraceUpdated])

  const handleFlowClick = (flow: Flow) => {
    setSelectedFlow(flow)
  }

  const handleSearch = () => {
    // Implement search logic here
    console.log("Searching with:", { fromDate, toDate, flowName, flowDetails })
  }

  const filteredTraceItems = traceItems.filter(item => {
    switch (logLevel) {
      case "verbose":
        return true
      case "info":
        return ["info", "warning", "error", "critical"].includes(item.level)
      case "warning":
        return ["warning", "error", "critical"].includes(item.level)
      case "error":
        return ["error", "critical"].includes(item.level)
      case "critical":
        return item.level === "critical"
      default:
        return true
    }
  })

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Workflow Engine Troubleshooter</h1>

      {/* Search Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="fromDate">From Date/Time</Label>
          <Input
            type="datetime-local"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="toDate">To Date/Time</Label>
          <Input
            type="datetime-local"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="flowName">Flow Name</Label>
          <Input
            type="text"
            id="flowName"
            placeholder="Enter flow name"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="flowDetails">Flow Details</Label>
          <Input
            type="text"
            id="flowDetails"
            placeholder="Enter flow details"
            value={flowDetails}
            onChange={(e) => setFlowDetails(e.target.value)}
          />
        </div>
      </div>
      <Button className="w-full md:w-auto" onClick={handleSearch}>
        <Search className="w-4 h-4 mr-2" />
        Search Flows
      </Button>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* WorkflowEngineTrace */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Workflow Engine Trace</h2>
          <div className="flex space-x-2 mb-2">
            {(["verbose", "info", "warning", "error", "critical"] as LogLevel[]).map((level) => (
              <Badge
                key={level}
                variant={logLevel === level ? "default" : "outline"}
                onClick={() => setLogLevel(level)}
              >
                {level === "info" && <Info className="w-4 h-4 mr-1" />}
                {level === "warning" && <AlertTriangle className="w-4 h-4 mr-1" />}
                {level === "error" && <AlertCircle className="w-4 h-4 mr-1" />}
                {level === "critical" && <AlertOctagon className="w-4 h-4 mr-1" />}
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Badge>
            ))}
          </div>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="space-y-2">
              <TraceTable traceItems={filteredTraceItems} onClick={(item) => handleFlowClick({ id: item.id, name: `Flow ${item.id}` })} />
              {/* {filteredTraceItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => handleFlowClick({ id: item.id, name: `Flow ${item.id}` })}
                >
                  {item.level === "info" && <Info className="w-4 h-4" />}
                  {item.level === "warning" && <AlertTriangle className="w-4 h-4" />}
                  {item.level === "error" && <AlertCircle className="w-4 h-4" />}
                  {item.level === "critical" && <AlertOctagon className="w-4 h-4" />}
                  <span>{item.message}</span>
                  <span className="text-sm text-gray-500">{item.timestamp}</span>
                </div>
              ))} */}
            </div>
          </ScrollArea>
        </div>

        {/* WorkflowInstanceView */}
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Workflow Instance View</h2>
          {selectedFlow ? (
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <p>Details for {selectedFlow.name}</p>
                {/* Add more details as needed */}
              </TabsContent>
              <TabsContent value="variables">
                <p>Variables for {selectedFlow.name}</p>
                {/* Add variables view */}
              </TabsContent>
              <TabsContent value="history">
                <p>History for {selectedFlow.name}</p>
                {/* Add history view */}
              </TabsContent>
            </Tabs>
          ) : (
            <p>Select a flow from the trace to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}