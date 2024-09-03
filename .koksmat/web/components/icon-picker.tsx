import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

type IconPickerProps = {
  onSelectIcon: (iconName: string) => void;
};

export default function IconPicker({ onSelectIcon }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);

  useEffect(() => {
    debugger;
    const iconNames = Object.keys(LucideIcons).filter(
      (key) => key !== "createLucideIcon" && key !== "default"
    );
    setFilteredIcons(iconNames);
  }, []);

  useEffect(() => {
    const iconNames = Object.keys(LucideIcons).filter(
      (key) =>
        key !== "createLucideIcon" &&
        key !== "default" &&
        key.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIcons(iconNames);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <Input
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[300px] w-full border rounded-md">
        <div className="grid grid-cols-4 gap-2 p-4">
          {filteredIcons?.map((iconName, index) => {
            if (index > 100) {
              return null;
            }
            const IconComponent = LucideIcons[
              iconName as keyof typeof LucideIcons
            ] as React.FC<{ size?: number }>;

            if (!IconComponent) {
              return null; // Handle case where icon is not found
            }

            return (
              <Button
                key={iconName}
                variant="outline"
                className="flex flex-col items-center justify-center p-2 h-20"
                onClick={() => onSelectIcon(iconName)}
              >
                <IconComponent size={24} />
                <span className="mt-1 text-xs truncate w-full text-center">
                  {iconName}
                </span>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
