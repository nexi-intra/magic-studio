"use client";
import { createContext } from "react";

export type WorkspaceContextType = {
  kitchenroot: string;
  setWorkspaceId: (workspaceId: string) => void;
  workspaceId: string;
};
export const WorkspaceContext = createContext<WorkspaceContextType>({
  kitchenroot: "",
  setWorkspaceId: function (workspaceId: string): void {
    throw new Error("Function not implemented.");
  },
  workspaceId: "",
});
