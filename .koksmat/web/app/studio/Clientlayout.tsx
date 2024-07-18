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

export default function ClientLayout(props: { children: any }) {
  const { children } = props;
  return (
    <AppProvider>
      <Authenticate apiScope={UserProfileAPI}>
        <div className="ml-16">
          <MenuRoot />
        </div>
        <RootLayout breadcrumb={<GlobalBreadcrumb />}>
          <div className="px-4">{children}</div>
        </RootLayout>
      </Authenticate>
    </AppProvider>
  );
}
