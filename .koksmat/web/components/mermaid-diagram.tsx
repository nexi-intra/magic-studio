"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { transformToMermaidERDiagram } from "@/lib/mermaid";

interface MermaidDiagramProps {
  chart: string;
}
export interface TableResult {
  tables: Table[];
}

export interface Table {
  table_name: string;
  columns: Column[];
}

export interface Column {
  column_name: string;
  data_type: string;
}

export interface Root {
  Result: Result[];
}

export interface RelationshipResult {
  relationships: Relationship[];
}

export interface Relationship {
  source_table: string;
  source_column: string;
  target_table: string;
  target_column: string;
}

function MermaidDiagram(props: { chart: string; className?: string }) {
  const { chart, className } = props;
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  useEffect(() => {
    if (!chart) {
      return;
    }
    if (chartRef.current) {
      const renderMermaid = async () => {
        try {
          const { svg } = await mermaid.render("mermaid-chart", chart);
          if (chartRef.current) {
            chartRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid rendering error:", error);
        }
      };

      renderMermaid();
    }
  }, [chart]);

  return <div className={className} ref={chartRef} />;
}

export interface Result {
  mermaid_diagram: string;
}

export function ERDiagram(props: { className?: string; database: string }) {
  const releationsQuery = useSQLSelect3<RelationshipResult>(
    props.database,
    `
SELECT 
    json_agg(
        json_build_object(
            'source_table', tc.table_name,
            'source_column', kcu.column_name,
            'target_table', ccu.table_name,
            'target_column', ccu.column_name
        )
    ) AS relationships
FROM 
    information_schema.table_constraints AS tc
JOIN 
    information_schema.key_column_usage AS kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN 
    information_schema.constraint_column_usage AS ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE 
    tc.constraint_type = 'FOREIGN KEY'

    `
  );
  const tablesAndColumnsQuery = useSQLSelect3<TableResult>(
    props.database,
    `
WITH tables AS (
    SELECT 
        table_name
    FROM 
        information_schema.tables
    WHERE 
        table_schema = 'public' 
        AND table_type = 'BASE TABLE'
),
columns AS (
    SELECT 
        table_name, 
        json_agg(json_build_object('column_name', column_name, 'data_type', data_type)) AS columns
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
    GROUP BY 
        table_name
)
SELECT 
    json_agg(
        json_build_object(
            'table_name', t.table_name,
            'columns', c.columns
        )
    ) AS tables
FROM 
    tables t
JOIN 
    columns c ON t.table_name = c.table_name


    
    `
  );
  const [chart, setChart] = useState("");
  useEffect(() => {
    if (!releationsQuery) return;
    if (!releationsQuery.dataset) return;
    if (!releationsQuery.dataset[0]) return;
    if (!tablesAndColumnsQuery) return;
    if (!tablesAndColumnsQuery.dataset) return;
    if (!tablesAndColumnsQuery.dataset[0]) return;

    const tables = tablesAndColumnsQuery.dataset[0];
    const relations = releationsQuery.dataset[0];
    const schema = {
      tables: tables.tables,
      relationships: relations.relationships,
    };
    const mermaidDiagram = transformToMermaidERDiagram(schema);

    setChart(mermaidDiagram);
  }, [releationsQuery, tablesAndColumnsQuery, props.database]);

  return (
    <div>
      <h1>Mermaid ER Diagram</h1>
      {/* <pre>{chart}</pre> */}
      <MermaidDiagram className={props.className} chart={chart} />
    </div>
  );
}
