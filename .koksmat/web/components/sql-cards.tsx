import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useSQLSelect3 } from "@/app/koksmat/usesqlselect3";
import { CardStackIcon } from "@radix-ui/react-icons";
import { ReactElement } from "react";

/**
 * Represents an item to be displayed in the card grid.
 */
export interface Item {
  id: number;
  title: string;
  slug: string;
  description: string;
}

/**
 * Props for the ShowItems component.
 */
interface ShowItemsProps {
  Icon: React.ComponentType<{ className?: string }>;
  slugPrefix: string;
  items: Item[];
}

/**
 * Displays a grid of items as cards.
 */
export function ShowItems({ Icon, slugPrefix, items }: ShowItemsProps) {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items?.map((item) => (
          <Link
            key={item.id}
            href={`${slugPrefix}${item.slug}`}
            className="text-primary"
            prefetch={false}
          >
            <Card>
              <CardHeader className="flex flex-col items-start gap-2">
                <Icon className="h-6 w-6 text-muted-foreground" />
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}

/**
 * Props for the SQLCards component.
 */
interface SQLCardsProps<T> {
  Icon?: React.ComponentType<{ className?: string }>;
  slugPrefix: string;
  database: string;
  sql: string;
  filter?: (item: T) => boolean;
  parse?: (item: T) => Item;
}

/**
 * Fetches data from a SQL database, optionally parses and filters it, and displays it as a grid of cards.
 */
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
