"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import { AppProvider } from "@/components/appcontextprovider";
import { href, RootLayout } from "@/components/rootlayout";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import Authenticate, { UserProfileAPI } from "../koksmat/authenticate";
import MenuRoot from "@/components/menu-root";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";
import { se } from "date-fns/locale";
import {
  Activity,
  AppWindowMac,
  CookingPotIcon,
  DatabaseIcon,
  Delete,
  DeleteIcon,
  Globe,
  Pin,
  X,
} from "lucide-react";
import TabNavigatorWithReorder from "@/components/tab-navigator-with-reorder";
import GlobalPasteHandling from "@/components/global-paste-handling";
import { GlobalDropHandling } from "@/components/global-drop-handling";
import ResizableLayout from "@/components/layout-left-aside";
import LeftNavigation, { NavItem } from "@/components/left-navigation";
import {
  ChevronRight,
  Home,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { KoksmatChef } from "@/components/icons/KoksmatChef";
import GlobalShopButton from "@/components/global-shop-button";
interface SavedPage {
  pathname: string;
  title: any;
}
const topItems: NavItem[] = [
  {
    icon: <KoksmatChef className="h-5 w-5" />,
    label: "Home",
    href: href.HOME,
    info: "Go to home page",
  },

  {
    icon: <CookingPotIcon className="h-5 w-5" />,
    href: href.PROCESS,
    label: "Processes",
    info: "Control and govern your app",
  },
  {
    icon: <AppWindowMac className="h-5 w-5" />,
    href: href.WORKSPACES,
    label: "Workspace",
    info: "Connect with your workspace",
  },
  {
    icon: <DatabaseIcon className="h-5 w-5" />,
    label: "Databases",
    href: href.DATABASE,
    info: "Work with data",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    label: "APIs",
    href: href.APIS,
    info: "Browse available services",
  },
  {
    icon: <Activity className="h-5 w-5" />,
    href: "/studio/workspace/auto/kubernetes",
    label: "Activity",
    info: "Monitor your services",
  },
];

const bottomItems: NavItem[] = [
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    href: "#",
    info: "Adjust your settings",
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    label: "Help",
    href: "#",
    info: "Get help and support",
  },
  {
    icon: <LogOut className="h-5 w-5" />,
    label: "Logout",
    href: "#",
    info: "Sign out of your account",
  },
];
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
  const [leftNavCollapsed, setleftNavCollapsed] = useState(false);
  return (
    <AppProvider>
      <Authenticate apiScope={UserProfileAPI}>
        {/* <GlobalPasteHandling /> */}
        <GlobalDropHandling />
        <ResizableLayout
          onCollapseChange={(collapsed) => setleftNavCollapsed(collapsed)}
          leftnav={
            <LeftNavigation
              topItems={topItems}
              bottomItems={bottomItems}
              isCollapsed={leftNavCollapsed}
            />
          }
          breadcrumb={<GlobalBreadcrumb />}
          topnav={<TabNavigatorWithReorder />}
          shop={<GlobalShopButton />}
          leftfooter={<GlobalPasteHandling />}
        >
          {children}
        </ResizableLayout>

        {/* <div className="ml-16">
          <MenuRoot />
        </div> */}
        {/* <div className="ml-[64px] top-0 sticky z-10 bg-white dark:bg-black w-full">
          <TabNavigatorWithReorder />
        </div>

        <div className="w-full h-full z-0">
          <RootLayout breadcrumb={<GlobalBreadcrumb />}>
            <div className="px-4">{children}</div>
          </RootLayout>
        </div> */}
      </Authenticate>
    </AppProvider>
  );
}
