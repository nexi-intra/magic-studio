import { parseWorkflowYaml } from "@/lib/workflow-utils";

export const pizzaOrderWorkflow = parseWorkflowYaml(`
  workflow:
    name: "Order and Eat Pizza"
    description: "Steps involved in getting a pizza from Wolt from feeling hunger until eating the pizza."
    
    actions:
      - id: "register_hunger"
        name: "Register Hunger"
        description: "Recognize that you are hungry and decide to order a pizza."
        icon: "alert-circle" # LucideReact icon reference
  
      - id: "choose_pizza"
        name: "Choose Pizza"
        description: "Select a pizza from the Wolt app."
        icon: "Pizza" # LucideReact icon reference
  
      - id: "place_order"
        name: "Place Order"
        description: "Confirm the order and pay for the pizza through the Wolt app."
        icon: "ShoppingCart" # LucideReact icon reference
  
      - id: "track_delivery"
        name: "Track Delivery"
        description: "Track the delivery of the pizza using the app."
        icon: "truck" # LucideReact icon reference
  
      - id: "receive_pizza"
        name: "Receive Pizza"
        description: "Get the pizza from the delivery person."
        icon: "box" # LucideReact icon reference
  
      - id: "eat_pizza"
        name: "Eat Pizza"
        description: "Enjoy your pizza."
        icon: "utensils" # LucideReact icon reference
  
      - id: "decide_next"
        name: "Decide Next Action"
        description: "Decide what to do next after eating the pizza."
        icon: "more-horizontal" # LucideReact icon reference
  
    sections:
      - id: "hunger_phase"
        name: "Feeling Hunger"
        register:
          action: "register_hunger"
          description: "You realize you are hungry and decide to order a pizza."
        start:
          action: "choose_pizza"
          description: "Open the Wolt app and start browsing pizzas."
        complete:
          action: "place_order"
          description: "Choose a pizza and complete the order process."
        decide:
          action: "decide_next"
          description: "Determine if you want to add something else to the order or proceed to checkout."
  
      - id: "waiting_phase"
        name: "Waiting for Pizza"
        register:
          action: "track_delivery"
          description: "Track the delivery process via the Wolt app."
        start:
          action: "track_delivery"
          description: "Monitor the pizza's progress from restaurant to your doorstep."
        complete:
          action: "receive_pizza"
          description: "Receive the pizza from the delivery person."
        decide:
          action: "decide_next"
          description: "Decide if you want to eat the pizza immediately or wait."
  
      - id: "eating_phase"
        name: "Eating Pizza"
        register:
          action: "eat_pizza"
          description: "Begin eating your pizza."
        start:
          action: "eat_pizza"
          description: "Enjoy your first bite of the pizza."
        complete:
          action: "eat_pizza"
          description: "Finish eating the pizza."
        decide:
          action: "decide_next"
          description: "Decide what to do after finishing the pizza."
  
      - id: "post_pizza_phase"
        name: "After Pizza"
        register:
          action: "decide_next"
          description: "Contemplate what to do next after eating."
        start:
          action: "decide_next"
          description: "Consider if you want to order something else, relax, or do another activity."
        complete:
          action: "decide_next"
          description: "Make your decision on what to do next."
        decide:
          action: "decide_next"
          description: "Act on your decision, whether it's ordering more food or engaging in another activity."
        
        `);
