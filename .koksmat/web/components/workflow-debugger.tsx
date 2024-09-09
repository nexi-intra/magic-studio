"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type FlowMessage = {
  type: string;
  payload: Record<string, unknown>;
};

interface WorkflowDebuggerProps {
  flowMessages: FlowMessage[];
}

export default function WorkflowDebugger({ flowMessages }: WorkflowDebuggerProps) {
  const [selectedMessage, setSelectedMessage] = useState<FlowMessage | null>(null);

  const handleMessageClick = (message: FlowMessage) => {
    setSelectedMessage(message);
  };

  const getPayloadId = (payload: Record<string, unknown>): string | undefined => {
    const id = payload.id;
    return typeof id === 'string' ? id : undefined;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Workflow Debugger</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Flow Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {flowMessages.map((message, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  <span className="font-medium">{message.type}</span>
                  {getPayloadId(message.payload) && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      (ID: {getPayloadId(message.payload)})
                    </span>
                  )}
                </Button>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedMessage.type}</h3>
                <pre className="bg-muted p-2 rounded-md overflow-x-auto">
                  {JSON.stringify(selectedMessage.payload, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a message to view details</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}