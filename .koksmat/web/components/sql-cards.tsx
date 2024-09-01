"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { CardStackIcon } from "@radix-ui/react-icons";
import { ReactElement } from "react";
import { ClipboardIcon, CheckIcon } from "lucide-react";

export interface Item {
  id: number;
  title: string;
  slug: string;
  description: string;
  href?: string;
  icon?: ReactElement;
  data?: string;
}

interface ShowItemsProps {
  Icon: React.ComponentType<{ className?: string }>;
  slugPrefix: string;
  items: Item[];
}

export function ShowItems({ Icon, slugPrefix, items }: ShowItemsProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    if (copiedId !== null) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const handleCopy = async (item: Item) => {
    if (item.data && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(item.data);
        setCopiedId(item.id);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    } else {
      console.warn("Clipboard API not available");
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items?.map((item) => (
          <Card key={item.id} className="relative">
            <Link
              href={`${slugPrefix}${item.slug}`}
              className="text-primary"
              prefetch={false}
            >
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                {item.icon ? (
                  item.icon
                ) : (
                  <Icon className="h-6 w-6 text-muted-foreground" />
                )}
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardDescription>{item.description}</CardDescription>
            </Link>
            {item.data && (
              <button
                onClick={() => handleCopy(item)}
                className="absolute top-2 right-2 p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label="Copy to clipboard"
              >
                {copiedId === item.id ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="h-5 w-5" />
                )}
              </button>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}

interface SQLCardsProps<T> {
  Icon?: React.ComponentType<{ className?: string }>;
  slugPrefix: string;
  database: string;
  sql: string;
  filter?: (item: T) => boolean;
  parse?: (item: T) => Item;
}

export default function SQLCards<T extends Item = Item>({
  Icon = CardStackIcon,
  slugPrefix,
  database,
  sql,
  filter,
  parse,
}: SQLCardsProps<T>) {
  const { dataset } = useSQLSelect3<T>(database, sql);

  let processedItems = dataset;

  if (filter) {
    processedItems = processedItems?.filter(filter);
  }

  let displayItems: Item[];
  if (parse) {
    displayItems = processedItems.map(parse);
  } else {
    displayItems = processedItems as Item[];
  }

  return <ShowItems Icon={Icon} slugPrefix={slugPrefix} items={displayItems} />;
}
