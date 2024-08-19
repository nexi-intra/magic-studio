"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import { AppProvider } from "@/components/appcontextprovider";
import { RootLayout } from "@/components/rootlayout";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import Authenticate, { UserProfileAPI } from "../koksmat/authenticate";
import MenuRoot from "@/components/menu-root";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { se } from "date-fns/locale";
import { Delete, DeleteIcon, Pin, X } from "lucide-react";
import TabNavigatorWithReorder from "@/components/tab-navigator-with-reorder";

interface SavedPage {
  pathname: string;
  title: any;
}

export default function ClientLayout(props: { children: any }) {
  const paths = useMemo<SavedPage[]>(() => {
    let paths: SavedPage[] = [];
    const storedPaths = sessionStorage.getItem("paths");
    if (storedPaths) {
      let stored = JSON.parse(storedPaths);
      paths.push(...stored);
    }
    return paths;
  }, []);
  const pathname = usePathname();
  const router = useRouter();
  const [version, setversion] = useState(0);
  const { children } = props;

  const addPath = (pathname: string, title: string) => {
    paths.push({ pathname, title });
    setversion(version + 1);
    sessionStorage.setItem("paths", JSON.stringify(paths));
  };
  return (
    <AppProvider>
      <Authenticate apiScope={UserProfileAPI}>
        {/* <div className="ml-16">
          <MenuRoot />
        </div> */}
        <div className="ml-[64px] top-0 sticky z-10 bg-white dark:bg-black w-full">
          <TabNavigatorWithReorder />
        </div>
        {/* <Tabs
          defaultValue={pathname}
          className="ml-[64px] sticky top-0 bg-white dark:bg-black"
        >
          <TabsList>
            {paths.map((path, key) => (
              <TabsTrigger
                key={key}
                value={path.pathname}
                onClick={() => {
                  router.push(path.pathname);
                }}
              >
                {path.title}
                <X
                  className="ml-2 h-3 w-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    paths.splice(key, 1);
                    setversion(version + 1);
                    sessionStorage.setItem("paths", JSON.stringify(paths));
                  }}
                />
              </TabsTrigger>
            ))}
            {paths.find((path) => path.pathname === pathname) ? null : (
              <TabsTrigger
                value={pathname}
                onClick={() => {
                  addPath(pathname, pathname);
                }}
              >
                {pathname}
                <Pin className="ml-2 h-3 w-3" />
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs> */}
        <div className="w-full h-full z-0">
          <RootLayout breadcrumb={<GlobalBreadcrumb />}>
            <div className="px-4">{children}</div>
          </RootLayout>
        </div>
      </Authenticate>
    </AppProvider>
  );
}
