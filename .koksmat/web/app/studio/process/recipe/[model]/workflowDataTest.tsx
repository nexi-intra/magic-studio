"use client";
import { WorkflowData } from "@/components/workflow-interfaces";

const workflowDataTest: WorkflowData = {
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
    delivery_person: {
      name: "Delivery Person",
      description: "The person delivering the pizza.",
    },
    restaurant: {
      name: "Restaurant",
      description: "The restaurant preparing the pizza.",
    },
    shop: {
      name: "Webshop",
      description: "The webshop where the user orders the pizza.",
    },
    app: {
      name: "App",
      description: "The Wolt app.",
    },
    auditlog: {
      name: "Audit Log",
      description: "The audit log.",
    },
  },
  description: "Support a user in satisfying their hunger by ordering a pizza.",
  purpose: "Like to be full and happy.",
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
        {
          id: "post_order",
          name: "Post Order",
          description: "Submit your pizza order to the restaurant.",
          icon: "ship",
          interactive: false,
          ui: "https://hunger.intra.nexigroup.com/aoi/shiporder",
          sql: "select * from order where reference =${order_id} and  status ->> 'paid' is null status ->> 'posted' is  null",
        },
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
    {
      name: "Place Order",
      id: "place_order_phase",
      raci: {
        responsible: "User",
        consulted: "Webshop",
        informed: "Audit Log",
      },
      actions: [
        {
          id: "paid_order",
          name: "Pay Order",
          description: "Pay for your pizza order.",
          icon: "credit-card",
          interactive: true,
          ui: "https://hunger.intra.nexigroup.com/pay/${order_id}",
        },
        {
          id: "order_confirmed",
          name: "Order Confirmed",
          description: "Your order has been confirmed by the restaurant.",
          icon: "check-square",
          interactive: false,
          ui: "https://hunger.intra.nexigroup.com/confirm/${order_id}",
          sql: "select * from order where reference =${order_id} and status ->> 'paid' is not null",
        },
      ],
    },
    {
      name: "Waiting for Pizza",
      id: "waiting_phase",
      raci: {
        responsible: "Delivery Person",
        informed: "User",
      },
      actions: [
        {
          id: "track_delivery",
          name: "Track Delivery",
          description: "Track the delivery of the pizza using the app.",
          icon: "truck",
          interactive: true,
          ui: "https://hunger.intra.nexigroup.com/track/${order_id}",
        },
        {
          id: "receive_pizza",
          name: "Receive Pizza",
          description: "Get the pizza from the delivery person.",
          icon: "box",
          interactive: false,
          ui: "https://hunger.intra.nexigroup.com/aoi/receivepizza",
        },
      ],
    },
    {
      name: "Eating Pizza",
      id: "eating_phase",
      actions: [
        {
          id: "eat_pizza",
          name: "Eat Pizza",
          description: "Enjoy your pizza.",
          icon: "utensils",
          interactive: true,
          ui: "https://hunger.intra.nexigroup.com/eat/${order_id}",
        },
      ],
    },
    {
      name: "Post Feedback",
      id: "feedback_phase",
      actions: [
        {
          id: "post_feedback",
          name: "Post Feedback",
          description: "Share your experience about the pizza and delivery.",
          icon: "utensils",
          interactive: true,
          ui: "https://hunger.intra.nexigroup.com/feedback/${order_id}",
        },
      ],
    },
  ],
};
