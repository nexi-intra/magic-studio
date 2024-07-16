"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface CommandSelectorItem {
  title: string;
  description: string;
  slug: string;
}
export interface CommandSelectorProps {
  placeholder: string;
  onSelect: (command: CommandSelectorItem) => void;
  commands: CommandSelectorItem[];
}

export function CommandSelector(props: CommandSelectorProps) {
  const { commands } = props;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    console.log("x");
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] max-w-[200px] justify-between overflow-hidden"
        >
          {value
            ? commands.find((command) => command.slug === value)?.title
            : props.placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full md:w-full p-0">
        <Command>
          <CommandInput placeholder={props.placeholder} />
          <CommandEmpty>Nothing found.</CommandEmpty>
          <CommandGroup className="max-h-[60vh] overflow-scroll">
            {commands
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((command, index) => (
                <CommandItem
                  key={index}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    props.onSelect(command);
                  }}
                >
                  <HoverCard>
                    <HoverCardTrigger className="flex">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === command.slug ? "opacity-100" : "opacity-0"
                        )}
                      />

                      {command.slug}
                    </HoverCardTrigger>
                    <HoverCardContent>{command.description}</HoverCardContent>
                  </HoverCard>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
