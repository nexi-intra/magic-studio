"use client";
import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";

interface MermaidDiagramProps {
  chart: string;
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
  const query = useSQLSelect3<Result>(
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
        column_name, 
        data_type
    FROM 
        information_schema.columns
    WHERE 
        table_schema = 'public'
),
foreign_keys AS (
    SELECT 
        tc.table_name AS table_name,
        kcu.column_name AS column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
    FROM 
        information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu 
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu 
            ON ccu.constraint_name = tc.constraint_name
    WHERE 
        tc.constraint_type = 'FOREIGN KEY'
),
er_diagram AS (
    -- Begin the ER diagram with 'erDiagram'
    SELECT 
        'erDiagram' AS part
    UNION ALL
    -- Add table definitions
    SELECT 
        '    ' || table_name || ' {' AS part
    FROM 
        tables
    UNION ALL
    -- Add column definitions within each table
    SELECT 
        '        ' || column_name || ' ' || data_type AS part
    FROM 
        columns
    UNION ALL
    -- Close table definitions
    SELECT 
        '    }' AS part
    FROM 
        tables
    UNION ALL
    -- Add foreign key relationships
    SELECT 
        '    ' || table_name || ' }o--|| ' || foreign_table_name || ' : "' || column_name || ' to ' || foreign_column_name || '"' AS part
    FROM 
        foreign_keys
)
SELECT 
    string_agg(part, E'\n') AS mermaid_diagram
FROM 
    er_diagram
    
    `
  );
  const [chart, setChart] = useState("");
  useEffect(() => {
    if (!query) return;
    if (!query.dataset) return;
    if (!query.dataset[0]) return;
    const { mermaid_diagram } = query.dataset[0];

    const mermaidDiagram = `
erDiagram
    COUNTRY ||--o{ SITE: "contains"
    SITE ||--o{ BUILDING: "contains"
    BUILDING ||--o{ FLOOR: "contains"
    FLOOR ||--o{ DESK: "contains"
    COUNTRY ||--o{ USER: "home country of"
    DESK ||--o{ BOOKING: "has"
    USER ||--o{ BOOKING: "makes"
    USER ||--o{ USER_M2M_DESK: "has"
    DESK ||--o{ USER_M2M_DESK: "has"
    RESTRICTIONGROUP ||--o{ RESTRICTIONGROUP_M2M_DESK: "has"
    DESK ||--o{ RESTRICTIONGROUP_M2M_DESK: "has"
    RESTRICTIONGROUP ||--o{ RESTRICTIONGROUP_M2M_USER: "has"
    USER ||--o{ RESTRICTIONGROUP_M2M_USER: "has"

    COUNTRY {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        varchar code
        jsonb metadata
    }

    SITE {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        varchar code
        int country_id FK
    }

    BUILDING {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        varchar code
        int site_id FK
    }

    FLOOR {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        varchar code
        varchar floorplan
        int building_id FK
    }

    DESK {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        varchar code
        int floor_id FK
        jsonb metadata
    }

    USER {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        int homecountry_id FK
    }

    USER_M2M_DESK {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        int user_id FK
        int desk_id FK
    }

    RESTRICTIONGROUP {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        varchar code
    }

    RESTRICTIONGROUP_M2M_DESK {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        int restrictiongroup_id FK
        int desk_id FK
    }

    RESTRICTIONGROUP_M2M_USER {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        int restrictiongroup_id FK
        int user_id FK
    }

    BOOKING {
        int id PK
        timestamp created_at
        varchar created_by
        timestamp updated_at
        varchar updated_by
        timestamp deleted_at
        varchar tenant
        varchar searchindex
        varchar name
        varchar description
        int desk_id FK
        int user_id FK
        varchar fromdatetime
        varchar todatetime
    }

  `;
    setChart(mermaidDiagram);
  }, [query, props.database]);

  return (
    <div>
      <h1>Mermaid ER Diagram</h1>

      <MermaidDiagram className={props.className} chart={chart} />
    </div>
  );
}
