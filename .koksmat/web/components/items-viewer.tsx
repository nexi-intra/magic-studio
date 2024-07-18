import React, { useEffect, useState } from "react";
import { CommandSelector, CommandSelectorItem } from "./command-selector";
import exp from "constants";
import { Card, CardDescription, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

export type Visualisation = "combobox" | "list" | "table" | "cards";
export interface ItemsViewerProps {
  visualisation: Visualisation;
  className?: string;
  onSelect: (command: CommandSelectorItem) => void;
  placeholder: string;
  commands: any;
  value: string;
}

export default function ItemsViewer(props: ItemsViewerProps) {
  const [filter, setfilter] = useState("");
  const [commands, setcommands] = useState<CommandSelectorItem[]>([]);
  const [filteredCommands, setFilteredCommands] = useState<
    CommandSelectorItem[]
  >([]);

  useEffect(() => {
    if (!props.commands) return;
    setcommands(props.commands);
  }, [props.commands]);

  useEffect(() => {
    setFilteredCommands(
      commands.filter((command: CommandSelectorItem) => {
        return command.title.toLowerCase().includes(filter.toLowerCase());
      })
    );
  }, [commands, filter]);

  switch (props.visualisation) {
    case "combobox":
      return <CommandSelector {...props} />;
    case "list":
      return (
        <Command>
          <CommandInput placeholder={props.placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {/* <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
            <CommandSeparator /> */}
            {/* <CommandGroup heading="Settings"> */}
            {filteredCommands?.map(
              (command: CommandSelectorItem, index: any) => {
                return (
                  <CommandItem
                    key={index}
                    onClick={() => {
                      props.onSelect(command);
                    }}
                  >
                    {command.title}
                  </CommandItem>
                );
              }
            )}

            {/* </CommandGroup> */}
          </CommandList>
        </Command>
      );
    case "table":
      return <div>Table</div>;
    case "cards":
      return (
        <div>
          <Input
            className="w-64 bg-white m-3"
            type="text"
            onChange={(e) => setfilter(e.target.value)}
            placeholder={"filter " + props.placeholder}
          />
          <div className="flex flex-wrap overflow-scroll max-h-full">
            {filteredCommands?.map(
              (command: CommandSelectorItem, index: any) => {
                return (
                  <Card className="m-3 w-64" key={index}>
                    <CardHeader>
                      {command.title}
                      <CardDescription>{command.description}</CardDescription>
                    </CardHeader>

                    {command.children}
                  </Card>
                );
              }
            )}
          </div>
        </div>
      );
    case undefined:
      return <div>Undefined</div>;
  }
}
