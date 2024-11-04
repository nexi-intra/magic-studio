import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface HeaderLayoutProps {
  title: string;
  description?: string;
  error?: string;
  tools?: React.ReactNode[];
}

export default function LayoutHeader({
  title,
  description,
  error,

  tools,
}: HeaderLayoutProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex ">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="ml-3 flex items-center space-x-2 self-start sm:self-center">
          {tools?.map((tool, index) => <div key={index}>{tool}</div>)}
        </div>{" "}
        <div className="grow"></div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
