"use client";
import { createContext } from "react";

export type WorkspaceContextType = {
  kitchenroot: string;
};
export const WorkspaceContext = createContext<WorkspaceContextType>({
  kitchenroot: "",
});
