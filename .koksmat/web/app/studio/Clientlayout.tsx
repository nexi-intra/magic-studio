"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import { AppProvider } from "@/components/appcontextprovider";
import { href } from "@/components/rootlayout";
import GlobalBreadcrumb from "@/components/global-breadcrumb";
import Authenticate, { UserProfileAPI } from "../koksmat/authenticate";
import { useState } from "react";
import { BreadcrumbProvider } from "@/components/contexts/breadcrumb-context";

import {
  Activity,
  AppWindowMac,
  CookingPotIcon,
  DatabaseIcon,
  Globe,
} from "lucide-react";
import TabNavigatorWithReorder from "@/components/tab-navigator-with-reorder";
import GlobalPasteHandling from "@/components/global-paste-handling";
import { GlobalDropHandling } from "@/components/global-drop-handling";
import ResizableLayout from "@/components/layout-left-aside";
import LeftNavigation, { NavItem } from "@/components/left-navigation";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import { KoksmatChef } from "@/components/icons/KoksmatChef";
import GlobalShopButton from "@/components/global-shop-button";

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
  const { children } = props;
  const [leftNavCollapsed, setleftNavCollapsed] = useState(false);
  const [ismobile, setismobile] = useState(false);
  return (
    <AppProvider>
      <Authenticate apiScope={UserProfileAPI}>
        <BreadcrumbProvider>
          <GlobalDropHandling />
          <ResizableLayout
            onMobileChange={(ismobile) => setismobile(ismobile)}
            onCollapseChange={(collapsed) => setleftNavCollapsed(collapsed)}
            leftnav={
              <LeftNavigation
                topItems={topItems}
                bottomItems={bottomItems}
                isCollapsed={leftNavCollapsed}
                isMobile={ismobile}
              />
            }
            breadcrumb={<GlobalBreadcrumb />}
            topnav={<TabNavigatorWithReorder />}
            shop={<GlobalShopButton />}
            centerfooter={<GlobalPasteHandling />}
          >
            {children}
          </ResizableLayout>
        </BreadcrumbProvider>
      </Authenticate>
    </AppProvider>
  );
}
