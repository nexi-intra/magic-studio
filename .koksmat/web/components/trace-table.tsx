'use client'

import React, { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

interface TraceItem {
  id: number
  level: "verbose" | "info" | "warning" | "error" | "critical"
  message: string
  timestamp: string
  flowName: string
  flowInstanceId: string
}

interface TimeAgoProps {
  timestamp: string
}

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const [, forceUpdate] = useState({})

  React.useEffect(() => {
    const timer = setInterval(() => forceUpdate({}), 1000)
    return () => clearInterval(timer)
  }, [])

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) {
      return `${seconds}s ago`
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)}m ago`
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return <span>{getTimeAgo(new Date(timestamp))}</span>
}

interface TraceTableProps {
  traceItems: TraceItem[]
  onClick: (item: TraceItem) => void
}

export default function TraceTable({ traceItems, onClick }: TraceTableProps) {
  const [sortColumn, setSortColumn] = useState<keyof TraceItem>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const sortedItems = useMemo(() => {
    return [...traceItems].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
      if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [traceItems, sortColumn, sortDirection])

  const handleSort = (column: keyof TraceItem) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow >
            <TableHead className="w-[100px]">
              <Button variant="ghost" onClick={() => handleSort('id')}>
                ID <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('timestamp')}>
                Timestamp <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Message</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('level')}>
                Level <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>


            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('flowName')}>
                Flow Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Flow Instance ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item, index) => (
            <TableRow key={index} onClick={() => onClick(item)}>
              <TableCell>{item.id}</TableCell>
              <TableCell><TimeAgo timestamp={item.timestamp} /></TableCell>
              <TableCell>{item.message}</TableCell>
              <TableCell>{item.level}</TableCell>


              <TableCell>{item.flowName}</TableCell>
              <TableCell>{item.flowInstanceId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}