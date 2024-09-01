import React, { useEffect, useState } from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ListFilter,
  Grid,
  Table,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type Visualisation = "combobox" | "list" | "table" | "cards";

interface PagingObject {
  prevPage: () => void;
  nextPage: () => void;
  pageSize: number;
  maxPages: number;
  currentPage: number;
  totalRecords: number;
}

export interface ItemsViewerProps {
  visualisation: Visualisation;
  className?: string;
  onSelect: (command: CommandSelectorItem) => void;
  placeholder: string;
  commands: CommandSelectorItem[];
  value: string;
  allowSwitch?: boolean;
  allowedVisualizations?: Visualisation[];
  paging?: PagingObject;
}

export default function Component({
  visualisation,
  className,
  onSelect,
  placeholder,
  commands: initialCommands,
  value,
  allowSwitch = false,
  allowedVisualizations = ["combobox", "list", "table", "cards"],
  paging,
}: ItemsViewerProps) {
  const [filter, setFilter] = useState("");
  const [commands, setCommands] = useState<CommandSelectorItem[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<
    CommandSelectorItem[]
  >([]);
  const [currentVisualisation, setCurrentVisualisation] =
    useState<Visualisation>(
      allowedVisualizations.includes(visualisation)
        ? visualisation
        : allowedVisualizations[0]
    );

  useEffect(() => {
    if (!initialCommands) return;
    setCommands(initialCommands);
  }, [initialCommands]);

  useEffect(() => {
    setFilteredCommands(
      commands.filter((command: CommandSelectorItem) => {
        return command.title.toLowerCase().includes(filter.toLowerCase());
      })
    );
  }, [commands, filter]);

  const renderPagination = () => {
    if (!paging) return null;
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(paging.currentPage - 1) * paging.pageSize + 1} to{" "}
          {Math.min(paging.currentPage * paging.pageSize, paging.totalRecords)}{" "}
          of {paging.totalRecords} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={paging.prevPage}
            disabled={paging.currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={paging.nextPage}
            disabled={paging.currentPage === paging.maxPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  const renderVisualization = () => {
    // const startIndex = (paging.currentPage - 1) * paging.pageSize;
    // const endIndex = startIndex + paging.pageSize;
    const paginatedCommands = filteredCommands; //.slice(startIndex, endIndex);

    switch (currentVisualisation) {
      case "combobox":
        return (
          <>
            <CommandSelector
              onSelect={onSelect}
              placeholder={placeholder}
              commands={paginatedCommands}
              value={value}
            />
            {renderPagination()}
          </>
        );
      case "list":
        return (
          <>
            <Command>
              <CommandInput
                placeholder={placeholder}
                onValueChange={setFilter}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {paginatedCommands.map(
                    (command: CommandSelectorItem, index: number) => (
                      <CommandItem
                        key={index}
                        onSelect={() => onSelect(command)}
                      >
                        {command.title}
                      </CommandItem>
                    )
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
            {renderPagination()}
          </>
        );
      case "table":
        return (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCommands.map(
                    (command: CommandSelectorItem, index: number) => (
                      <tr
                        key={index}
                        onClick={() => onSelect(command)}
                        className="cursor-pointer hover:bg-secondary"
                      >
                        <td className="p-2">{command.title}</td>
                        <td className="p-2">{command.description}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        );
      case "cards":
        return (
          <>
            <Input
              className="w-full max-w-sm mb-4"
              type="text"
              onChange={(e) => setFilter(e.target.value)}
              placeholder={`Filter ${placeholder}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh]">
              {paginatedCommands.map(
                (command: CommandSelectorItem, index: number) => (
                  <Card
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    key={index}
                    onClick={() => onSelect(command)}
                  >
                    <CardHeader>
                      <h3 className="text-lg font-semibold">{command.title}</h3>
                      <CardDescription>{command.description}</CardDescription>
                    </CardHeader>
                    {command.children}
                  </Card>
                )
              )}
            </div>
            {renderPagination()}
          </>
        );
      default:
        return <div>Undefined visualization</div>;
    }
  };

  const visualizationIcons = [
    {
      type: "combobox",
      icon: <ChevronsUpDown className="h-4 w-4" />,
      tooltip: "Combobox",
    },
    { type: "list", icon: <ListFilter className="h-4 w-4" />, tooltip: "List" },
    { type: "table", icon: <Table className="h-4 w-4" />, tooltip: "Table" },
    { type: "cards", icon: <Grid className="h-4 w-4" />, tooltip: "Cards" },
  ].filter((icon) =>
    allowedVisualizations.includes(icon.type as Visualisation)
  );

  return (
    <div className={className}>
      {allowSwitch && visualizationIcons.length > 1 && (
        <div className="flex space-x-2 mb-4">
          <TooltipProvider>
            {visualizationIcons.map(({ type, icon, tooltip }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      currentVisualisation === type ? "default" : "outline"
                    }
                    size="icon"
                    onClick={() =>
                      setCurrentVisualisation(type as Visualisation)
                    }
                  >
                    {icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      )}
      {renderVisualization()}
    </div>
  );
}
