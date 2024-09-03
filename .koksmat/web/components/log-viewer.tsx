"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react";

export interface LogObject {
  time: Date;
  title: string;
  detail: string;
  error: string;
}

interface LogTableProps {
  logs: LogObject[];
  onClear?: () => void;
}

export default function LogViewer({
  logs: initialLogs,
  onClear,
}: LogTableProps) {
  //const [logs, setLogs] = useState(initialLogs);
  const [sortAscending, setSortAscending] = useState(false);
  const [expandedLog, setExpandedLog] = useState<LogObject | null>(null);
  // useEffect(() => {
  //   setLogs(initialLogs);
  // }, [initialLogs]);

  const sortedLogs = useMemo(() => {
    return [...initialLogs].sort((a, b) => {
      return sortAscending
        ? a.time.getTime() - b.time.getTime()
        : b.time.getTime() - a.time.getTime();
    });
  }, [initialLogs, sortAscending]);

  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const handleClear = () => {
    if (onClear) onClear();
  };

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {onClear && (
          <Button onClick={handleClear} variant="destructive">
            Clear Logs
          </Button>
        )}
        <Button onClick={toggleSort} variant="secondary">
          Sort {sortAscending ? "Descending" : "Ascending"}
          {sortAscending ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLogs.map((log, index) => (
            <TableRow
              key={index}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setExpandedLog(expandedLog === log ? null : log)}
            >
              <TableCell>{formatTimeSince(log.time)}</TableCell>
              <TableCell>{log.title}</TableCell>
              <TableCell>
                {log.error && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {expandedLog && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{expandedLog.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExpandedLog(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p>
              <strong>Time:</strong> {expandedLog.time.toLocaleString()}
            </p>
            <p>
              <strong>Detail:</strong> {expandedLog.detail}
            </p>
            {expandedLog.error && (
              <p className="text-destructive">
                <strong>Error:</strong> {expandedLog.error}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
