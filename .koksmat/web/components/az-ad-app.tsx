"use client";
import React, { useEffect, useState } from "react";
import useWorkspaceExec from "./hooks/use-workspace-exec";
import { pathJoin } from "@/lib/pathjoin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AppInfo {
  name: string;
  clientId: string;
  tenantId: string;
  redirectUris: string[];
}

function Component(props: AppInfo): React.ReactElement {
  const [appInfo, setAppInfo] = useState<AppInfo>(props);

  const [newUri, setNewUri] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddUri = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!newUri) {
      setError("Please enter a valid URI");
      return;
    }
    try {
      new URL(newUri);
      setAppInfo((prev) => ({
        ...prev,
        redirectUris: [...prev.redirectUris, newUri],
      }));
      setNewUri("");
      setError("");
    } catch {
      setError("Please enter a valid URL");
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Azure App Registration</CardTitle>
        <CardDescription>
          View and manage your app&apos;s registration details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={appInfo.name} readOnly />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="clientId">Client ID</Label>
            <Input id="clientId" value={appInfo.clientId} readOnly />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tenantId">Tenant ID</Label>
            <Input id="tenantId" value={appInfo.tenantId} readOnly />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label>Redirect URIs</Label>
            <ScrollArea className="h-[100px] w-full rounded-md border">
              <div className="p-4">
                {appInfo.redirectUris.map((uri, index) => (
                  <p key={index} className="text-sm">
                    {uri}
                  </p>
                ))}
              </div>
            </ScrollArea>
          </div>
          <form onSubmit={handleAddUri} className="flex flex-col space-y-1.5">
            <Label htmlFor="newUri">Add New Redirect URI</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="url"
                id="newUri"
                placeholder="https://example.com/callback"
                value={newUri}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewUri(e.target.value)
                }
              />
              <Button type="submit">Add</Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleString()}
        </p>
      </CardFooter>
    </Card>
  );
}
export default function AzAdApp(props: {
  params: { kitchenroot: string; workspaceid: string; kitchen: string };
}) {
  const { workspaceid, kitchen, kitchenroot } = props.params;
  const [azureAppId, setazureAppId] = useState("");
  const [error, seterror] = useState("");
  const globalTs = useWorkspaceExec<string>(
    workspaceid,
    "cat",
    ["global.ts"],
    pathJoin(kitchenroot, kitchen, ".koksmat", "web", "app"),
    (data) => {
      if (!data) return "";
      debugger;
      // Regex to extract the entire MSAL object
      const msalObjectMatch = data.match(/export const MSAL = (\{[\s\S]*?\});/);

      return msalObjectMatch ? msalObjectMatch[1] : "";
    }
  );
  const azureAppReg = useWorkspaceExec<string>(
    workspaceid,
    "az",
    ["ad", "app", "show", "--id", azureAppId],
    pathJoin(kitchenroot, kitchen, ".koksmat", "web", "app"),
    (data) => {
      return data;
    }
  );
  useEffect(() => {
    if (!globalTs) return;
    try {
      const globalTsObj = JSON.parse(globalTs);

      setazureAppId(globalTsObj.azureAppId);
    } catch (error) {
      seterror("An error occurred while parsing the global.ts file");
    }
  }, [globalTs]);

  useEffect(() => {
    if (!azureAppReg) return;
    const azureAppRegObj = JSON.parse(azureAppReg);
  }, [azureAppReg]);
  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <Component
        name={""}
        clientId={azureAppId}
        tenantId={""}
        redirectUris={[]}
      />
      {azureAppReg}
    </div>
  );
}
