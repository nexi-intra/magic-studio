'use client'

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Mock data - replace with actual data fetching logic
const inputDataSets = ['Dataset A', 'Dataset B', 'Dataset C']
const targetTables = ['Table X', 'Table Y', 'Table Z']
const mockColumns = ['id', 'name', 'email', 'created_at']

type ColumnMapping = {
  [key: string]: string
}

export default function MigrationPage() {
  const [selectedInput, setSelectedInput] = useState<string>('')
  const [selectedTarget, setSelectedTarget] = useState<string>('')
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({})
  const [sqlCode, setSqlCode] = useState<string>('')

  const handleInputChange = (value: string) => {
    setSelectedInput(value)
    setColumnMapping({})
  }

  const handleTargetChange = (value: string) => {
    setSelectedTarget(value)
    setColumnMapping({})
  }

  const handleColumnMappingChange = (targetColumn: string, inputColumn: string) => {
    setColumnMapping(prev => ({ ...prev, [targetColumn]: inputColumn }))
  }

  const generateSqlCode = () => {
    const columns = Object.keys(columnMapping).filter(key => columnMapping[key])
    const values = columns.map(col => columnMapping[col])
    const sql = `
      INSERT INTO ${selectedTarget} (${columns.join(', ')})
      SELECT ${values.join(', ')}
      FROM ${selectedInput};
    `
    setSqlCode(sql.trim())
  }

  const handleReset = () => {
    setSelectedInput('')
    setSelectedTarget('')
    setColumnMapping({})
    setSqlCode('')
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Migration Tool</h1>

      <div className="flex space-x-4">
        <Select value={selectedInput} onValueChange={handleInputChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select input dataset" />
          </SelectTrigger>
          <SelectContent>
            {inputDataSets.map(dataset => (
              <SelectItem key={dataset} value={dataset}>{dataset}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTarget} onValueChange={handleTargetChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select target table" />
          </SelectTrigger>
          <SelectContent>
            {targetTables.map(table => (
              <SelectItem key={table} value={table}>{table}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedInput && selectedTarget && (
        <Card>
          <CardHeader>
            <CardTitle>Column Mapping</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {mockColumns.map(column => (
                <div key={column} className="flex items-center space-x-2">
                  <span className="font-medium">{column}</span>
                  <Input
                    placeholder={`Map to ${selectedInput} column`}
                    value={columnMapping[column] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColumnMappingChange(column, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-x-4">
        <Button onClick={generateSqlCode}>Generate SQL</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>

      {sqlCode && (
        <Card>
          <CardHeader>
            <CardTitle>Generated PostgreSQL Code</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code>{sqlCode}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}