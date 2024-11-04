"use client"
import { SqlQueryProvider } from '@/components/contexts/sqlquery-context'
import React from 'react'

export default function Layout(props: { children: React.ReactNode, params: { database: string } }) {
  const { database } = props.params
  return (
    <SqlQueryProvider lookupHandlers={[]} database={database}>
      {props.children}</SqlQueryProvider>
  )
}
