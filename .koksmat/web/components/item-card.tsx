"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ClipboardIcon, CheckIcon } from "lucide-react";
import { ReactElement } from "react";

interface ItemCardProps {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon?: ReactElement;
  data?: string;
  slugPrefix: string;
  Icon: React.ComponentType<{ className?: string }>;
  onCopy: (id: number) => void;
  copiedId: number | null;
}

export default function ItemCard({
  id,
  title,
  slug,
  description,
  icon,
  data,
  slugPrefix,
  Icon,
  onCopy,
  copiedId,
}: ItemCardProps) {
  return (
    <Card className="relative">
      <Link
        href={`${slugPrefix}${slug}`}
        className="text-primary"
        prefetch={false}
      >
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          {icon ? icon : <Icon className="h-6 w-6 text-muted-foreground" />}
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardDescription>{description}</CardDescription>
      </Link>
      {data && (
        <button
          onClick={() => onCopy(id)}
          className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Copy to clipboard"
        >
          {copiedId === id ? (
            <CheckIcon className="h-5 w-5 text-green-500" />
          ) : (
            <ClipboardIcon className="h-5 w-5" />
          )}
        </button>
      )}
    </Card>
  );
}
