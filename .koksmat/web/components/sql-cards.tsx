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
import {
  ClipboardIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Item {
  id: number;
  title: string;
  slug: string;
  description: string;
  href?: string;
  icon?: ReactElement;
  data?: string;
}

export interface PagingObject {
  prevPage: () => void;
  nextPage: () => void;
  pageSize: number;
  maxPages: number;
  currentPage: number;
  totalRecords: number;
}

interface ShowItemsProps {
  Icon: React.ComponentType<{ className?: string }>;
  slugPrefix: string;
  items: Item[];
  paging?: PagingObject;
  onPageChange?: (newPage: number) => void;
}

export function ShowItems({
  Icon,
  slugPrefix,
  items,
  paging,
  onPageChange,
}: ShowItemsProps) {
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

  const handlePrevPage = () => {
    if (paging && onPageChange) {
      onPageChange(paging.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (paging && onPageChange) {
      onPageChange(paging.currentPage + 1);
    }
  };

  return (
    <main className="flex flex-col items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
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
              <CardDescription className="mx-6 my-3">{item.description}</CardDescription>
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
      {paging && (
        <div className="flex justify-between items-center w-full mt-4">
          <Button
            onClick={handlePrevPage}
            disabled={paging.currentPage === 1}
            variant="outline"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {paging.currentPage} of {paging.maxPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={paging.currentPage === paging.maxPages}
            variant="outline"
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
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
  pageSize?: number;
  totalRecords?: number;
}

/**
 * Adds pagination control to a SQL query.
 * 
 * @param sqlQuery - The original SQL query string.
 * @param pageNumber - The current page number (1-based index).
 * @param pageSize - The number of items per page.
 * @returns The SQL query string with pagination added.
 

// Example usage:
const originalQuery = "SELECT * FROM users WHERE active = true";
const pageNumber = 2;
const pageSize = 10;

const paginatedQuery = addPagination(originalQuery, pageNumber, pageSize);
console.log(paginatedQuery);
// Output: "SELECT * FROM users WHERE active = true LIMIT 10 OFFSET 10;"

*/
function addPagination(
  sqlQuery: string,
  pageNumber: number,
  pageSize: number
): string {
  // Ensure pageNumber is at least 1
  const page = pageNumber > 0 ? pageNumber : 1;

  // Calculate the OFFSET and LIMIT for the pagination
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  // Append the LIMIT and OFFSET to the original query
  const paginatedQuery = `${sqlQuery} LIMIT ${limit} OFFSET ${offset};`;

  return paginatedQuery;
}

export default function SQLCards<T extends Item = Item>({
  Icon = CardStackIcon,
  slugPrefix,
  database,
  sql,
  filter,
  parse,
  totalRecords,
  pageSize = 16,
}: SQLCardsProps<T>) {
  const [pagedSQL, setpagedSQL] = useState(sql);
  useEffect(() => {
    const newSQL = sql;
    if (newSQL.toUpperCase().includes("LIMIT")) {
      setpagedSQL(newSQL);
      return;
    }

    setpagedSQL(addPagination(newSQL, 1, pageSize));
  }, [sql]);

  const { dataset } = useSQLSelect3<T>(database, pagedSQL);
  const [currentPage, setCurrentPage] = useState(1);

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

  const maxPages = Math.ceil(totalRecords || displayItems?.length / pageSize);

  const paginatedItems = displayItems?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const paging: PagingObject = {
    prevPage: () => setCurrentPage((prev) => Math.max(prev - 1, 1)),
    nextPage: () => setCurrentPage((prev) => Math.min(prev + 1, maxPages)),
    pageSize,
    maxPages,
    currentPage,
    totalRecords: totalRecords || displayItems?.length,
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <ShowItems
        Icon={Icon}
        slugPrefix={slugPrefix}
        items={paginatedItems}
        paging={paging}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
