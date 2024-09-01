import React, { useState, useCallback } from "react";
import { Clipboard, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PromptSuggestion = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  url: string;
};

type PromptSuggestionsProps = {
  initialSuggestions: PromptSuggestion[];
};

export default function PromptSuggestions({
  initialSuggestions,
}: PromptSuggestionsProps) {
  const [suggestions, setSuggestions] =
    useState<PromptSuggestion[]>(initialSuggestions);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Prompt copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }, []);

  const openUrl = useCallback(async (prompt: PromptSuggestion) => {
    await navigator.clipboard.writeText(prompt.prompt);
    window.open(prompt.url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="mx-auto p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="min-w-[300px]">
            <CardHeader>
              <CardTitle>{suggestion.title}</CardTitle>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground italic">
                {suggestion.prompt}
              </p>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(suggestion.prompt)}
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openUrl(suggestion)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
