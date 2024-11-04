export interface Actor {
  name: string;
  description: string;
}

export interface Trigger {
  id: string;
  name: string;
  description: string;
  sql: string;
}

export interface Action {
  id: string;
  name: string;
  description: string;
  icon: string;
  interactive: boolean;
  ui?: string;
  transaction?: string;
  sql?: string;
}

export interface Decision {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface RACI {
  responsible?: string;
  accountable?: string;
  consulted?: string;
  informed?: string;
}

export interface Stage {
  name: string;
  id: string;
  raci?: RACI;
  triggers?: {
    actions: Trigger[];
  };
  actions: Action[];
  decisions?: Decision[];
}

export interface WorkflowData {
  version: number;
  name: string;
  id: string;
  actors: {
    [key: string]: Actor;
  };
  description: string;
  purpose: string;
  general?: {
    raci?: RACI;
  };
  stage: Stage[];
}

// Example usage:
const workflowData: WorkflowData = {
  version: 1,
  name: "Pizza Order Process",
  id: "pizza_order",
  actors: {
    user: {
      name: "User",
      description: "A person who interacts with the system.",
    },
    system: {
      name: "System",
      description: "The system",
    },
    // ... other actors
  },
  description: "Support a user in satisfying their hunger by ordering a pizza.",
  purpose: "Like to be full and happy.",
  general: {},
  stage: [
    {
      name: "Feeling Hunger",
      id: "hunger_phase",
      raci: {
        responsible: "system",
        consulted: "Webshop",
        informed: "Audit Log",
      },
      triggers: {
        actions: [
          {
            id: "hunger",
            name: "Hunger",
            description: "The feeling of hunger.",
            sql: "select * from hunger from state is null",
          },
        ],
      },
      actions: [
        {
          id: "register_hunger",
          name: "Register Hunger",
          description:
            "Recognize that you are hungry and decide to order a pizza.",
          icon: "alert-circle",
          interactive: true,
          ui: "https://hunger.intra.nexigroup.com",
          transaction:
            '{ "service": "order",\n  "transactions" : [\n    {\n      "order_id": "${order_id}",\n      "status": "posted"\n    }\n  ]\n}\n',
        },
        // ... other actions
      ],
      decisions: [
        {
          id: "decide_next",
          name: "Decide Next Action",
          description: "Decide what to do next after eating the pizza.",
          icon: "more-horizontal",
        },
      ],
    },
    // ... other stages
  ],
};

/*

// Example usage
const mermaidDiagram = generateMermaidSequenceDiagram(workflowData);
console.log(mermaidDiagram);

*/
export function generateMermaidSequenceDiagram(workflow: WorkflowData): string {
  const mermaidDiagram: string[] = [];
  mermaidDiagram.push("sequenceDiagram");

  // Add actors
  Object.values(workflow.actors).forEach((actor) => {
    mermaidDiagram.push(`participant ${actor.name} as ${actor.description}`);
  });

  // Process each stage
  workflow.stage.forEach((stage) => {
    mermaidDiagram.push(`Note over ${stage.name}: ${stage.name}`);

    // Add triggers
    if (stage.triggers) {
      stage.triggers.actions.forEach((trigger) => {
        mermaidDiagram.push(
          `rect rgb(238, 238, 255)\nNote over ${stage.name}: Trigger - ${trigger.name}\nend`
        );
        mermaidDiagram.push(
          `${workflow.actors[stage.raci?.responsible || "system"].name}->>${workflow.actors["system"].name}: ${trigger.name}`
        );
      });
    }

    // Add actions
    stage.actions.forEach((action) => {
      const responsibleActor =
        workflow.actors[stage.raci?.responsible || "system"]?.name;
      const actionDetails = `${action.name}: ${action.description}`;

      if (action.interactive) {
        mermaidDiagram.push(
          `${responsibleActor}->>${workflow.actors["user"].name}: ${actionDetails}`
        );
      } else {
        mermaidDiagram.push(
          `${responsibleActor}->>${workflow.actors["system"].name}: ${actionDetails}`
        );
      }
    });

    // Add decisions
    if (stage.decisions) {
      stage.decisions.forEach((decision) => {
        mermaidDiagram.push(
          `alt ${decision.name}\n${workflow.actors["user"].name} ->> ${workflow.actors["system"].name}: ${decision.description}\nend`
        );
      });
    }
  });

  return mermaidDiagram.join("\n");
}
