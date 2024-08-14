//"use client";
import React, { Fragment, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import DevCurrentPage from "./dev-current-page";
import { Edit3Icon, LayersIcon } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  href: string;
}
export default function GlobalBreadcrumb() {
  const pathname = usePathname();
  const [showEdit, setshowEdit] = useState(false);
  const [items, setitems] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const path = pathname.split("/").filter(Boolean);
    const items = path.map((_, i) => {
      const href = "/" + path.slice(0, i + 1).join("/");
      return {
        name: path[i],
        href,
      };
    });
    setitems(items);
  }, [pathname]);

  return (
    <div
      className="flex"
      onMouseEnter={() => setshowEdit(true)}
      onMouseLeave={() => setshowEdit(false)}
    >
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          {items.map((item, i) => (
            <BreadcrumbItem key={i}>
              <Fragment>
                <BreadcrumbLink asChild>
                  <Link href={item.href} prefetch={false}>
                    {item.name}
                  </Link>
                </BreadcrumbLink>
                {i === items.length - 1 ? null : <BreadcrumbSeparator />}
              </Fragment>
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {showEdit && (
        <DevCurrentPage>
          <div className="cursor-pointer ml-1 mt-[3px]">
            <Edit3Icon className="h-4 w-4 stroke-1 hover:stroke-2" />
          </div>
        </DevCurrentPage>
      )}
    </div>
  );
}
