import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  info: string;
  href: string;
}

interface LeftNavigationProps {
  topItems?: NavItem[];
  bottomItems?: NavItem[];
  isCollapsed: boolean;
}

export default function LeftNavigation({
  topItems = [],
  bottomItems = [],
  isCollapsed,
}: LeftNavigationProps) {
  const NavButton: React.FC<NavItem> = ({ icon, label, info, href }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <button className="w-full p-2 rounded-lg hover:bg-muted transition-colors flex items-center">
              <span className="flex-shrink-0">{icon}</span>
              {!isCollapsed && <span className="ml-2">{label}</span>}
              {isCollapsed && <span className="sr-only">{label}</span>}
            </button>
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <p>{info}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div
      className={`h-full flex flex-col justify-between py-4 ${isCollapsed ? "items-center" : ""}`}
    >
      <div className="space-y-2 w-full">
        {topItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
      <div className="space-y-2 w-full">
        {bottomItems.map((item) => (
          <NavButton key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
