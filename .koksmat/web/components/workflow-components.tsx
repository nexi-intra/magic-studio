import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Ship,
  Truck,
  Box,
  Utensils,
  MoreHorizontal,
  Info,
  CheckCircle,
  LockIcon,
  CreditCard,
  CheckSquare,
} from "lucide-react";
import { RACI, Action, Stage, WorkflowData } from "./workflow-interfaces";

const iconMap: { [key: string]: React.ComponentType } = {
  "alert-circle": AlertCircle,
  ship: Ship,
  truck: Truck,
  box: Box,
  utensils: Utensils,
  "more-horizontal": MoreHorizontal,
  "credit-card": CreditCard,
  "check-square": CheckSquare,
};

export function RACIComponent({ responsible, consulted, informed }: RACI) {
  return (
    <div className="flex flex-wrap gap-2">
      {responsible && <Badge variant="outline">R: {responsible}</Badge>}
      {consulted && <Badge variant="outline">C: {consulted}</Badge>}
      {informed && <Badge variant="outline">I: {informed}</Badge>}
    </div>
  );
}

interface ActionComponentProps {
  action: Action;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

export function ActionComponent({
  action,
  isCompleted,
  isActive,
  onClick,
}: ActionComponentProps) {
  const Icon = (props: { className: string }) => <div></div>;

  return (
    <div className="flex items-center">
      <Button
        variant={isActive ? "default" : "outline"}
        className="w-full justify-start mr-2"
        onClick={onClick}
        disabled={!isActive}
      >
        {isCompleted ? (
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
        ) : Icon ? (
          <Icon className="w-4 h-4 mr-2" />
        ) : null}
        {action.name}
        {isCompleted && <LockIcon className="w-4 h-4 ml-2" />}
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Info className="h-4 w-4" />
              <span className="sr-only">Info</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{action.description}</p>
            {action.transaction && (
              <p className="mt-2">
                <strong>Transaction:</strong> {action.transaction}
              </p>
            )}
            {action.sql && (
              <p className="mt-2">
                <strong>SQL:</strong> {action.sql}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

interface StageComponentProps {
  stage: Stage;
  index: number;
  isCompleted: boolean;
  isActive: boolean;
  currentAction: number;
  onActionClick: (actionIndex: number) => void;
}

export function StageComponent({
  stage,
  index,
  isCompleted,
  isActive,
  currentAction,
  onActionClick,
}: StageComponentProps) {
  return (
    <Card
      className={`${isCompleted ? "bg-green-50" : isActive ? "bg-blue-50" : ""}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
                isCompleted
                  ? "bg-green-500"
                  : isActive
                    ? "bg-blue-500"
                    : "bg-gray-300"
              }`}
            >
              <span className="text-white font-bold">{index + 1}</span>
            </div>
            {stage.name}
          </div>
          {stage.raci && <RACIComponent {...stage.raci} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stage.actions.map((action, actionIndex) => (
            <ActionComponent
              key={action.id}
              action={action}
              isCompleted={
                isCompleted || (isActive && actionIndex < currentAction)
              }
              isActive={isActive && actionIndex === currentAction}
              onClick={() => onActionClick(actionIndex)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
