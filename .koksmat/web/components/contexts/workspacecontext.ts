"use client";
import { createContext } from "react";

export type WorkspaceContextType = {
  kitchenroot: string;
  setWorkspaceId: (workspaceId: string) => void;
  workspaceId: string;
  webPathname: string;
  setWebPathname: (webPathname: string) => void;
  appName: string;
  setAppName: (appName: string) => void;
};
export const WorkspaceContext = createContext<WorkspaceContextType>({
  kitchenroot: "",
  setWorkspaceId: function (workspaceId: string): void {
    throw new Error("Function not implemented.");
  },
  workspaceId: "",
  webPathname: "",
  setWebPathname: function (webPathname: string): void {
    throw new Error("Function not implemented.");
  },
  appName: "",
  setAppName: function (appName: string): void {
    throw new Error("Function not implemented.");
  },
});
