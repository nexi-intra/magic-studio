"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="max-w-md w-full px-4 py-8 bg-card rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              We apologize for the inconvenience. An unexpected error has
              occurred.
            </p>
            <div className="space-y-4">
              <Button onClick={() => reset()} className="w-full">
                Try again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go to homepage
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              If the problem persists, please contact our support team.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
