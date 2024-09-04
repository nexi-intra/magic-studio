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

function RenderDiagram(props: { chart: string; className?: string }) {
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

export default function MermaidDiagram(props: {
  className?: string;
  diagram: string;
}) {
  return (
    <div>
      {/* <pre>{chart}</pre> */}
      <RenderDiagram className={props.className} chart={props.diagram} />
    </div>
  );
}
