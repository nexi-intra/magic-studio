import React, { useContext } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "./ui/menubar";
import Link from "next/link";
import { APPNAME } from "@/app/global";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";

export default function MenuRoot() {
  const magicbox = useContext(MagicboxContext);
  return (
    <div>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Magic Button Studio</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href="/" className="w-full">
                Home
              </Link>
            </MenubarItem>
            {/* <MenubarItem>
              <Link href={"/" + APPNAME + "/dev"} className="w-full">
                Develop
              </Link>
            </MenubarItem> */}
          </MenubarContent>
        </MenubarMenu>
        {/* 
        <MenubarMenu>
          <MenubarTrigger disabled={!magicbox.currentWorkspace}>
            Database
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link href={"/" + APPNAME + "/editor/query"} className="w-full">
                Queries
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu> */}
        <MenubarMenu>
          <MenubarTrigger disabled={!magicbox.currentWorkspace}>
            Workspace
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem disabled>
              <Link
                href={
                  "/" +
                  APPNAME +
                  "/workspace/" +
                  magicbox.currentWorkspace +
                  "/azure"
                }
                className="w-full"
              >
                Azure
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link
                href={
                  "/" +
                  APPNAME +
                  "/workspace/" +
                  magicbox.currentWorkspace +
                  "/github"
                }
                className="w-full"
              >
                GitHub
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link
                href={
                  "/" +
                  APPNAME +
                  "/workspace/" +
                  magicbox.currentWorkspace +
                  "/ping"
                }
                className="w-full"
              >
                Ping
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link
                href={
                  "/" +
                  APPNAME +
                  "/workspace/" +
                  magicbox.currentWorkspace +
                  "/terminal"
                }
                className="w-full"
              >
                Commands
              </Link>
            </MenubarItem>
            <MenubarItem disabled>
              <Link
                href={
                  "/" +
                  APPNAME +
                  "/workspace/" +
                  magicbox.currentWorkspace +
                  "/kubernetes"
                }
                className="w-full"
              >
                Kubernetes
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
