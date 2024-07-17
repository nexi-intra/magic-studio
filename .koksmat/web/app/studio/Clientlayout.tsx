"use client";
/*---
keep: false
---
# File have been automatically created. To prevent the file from getting overwritten
# Set the Front Matter property ´keep´ to ´true´ 

*/
import { useContext, useEffect, useState } from "react";
import { AppProvider } from "@/components/appcontextprovider";
import AppLeftRail from "@/components/appleftrail";
import AppTopMenu from "@/components/apptopmenu";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Tracer from "@/app/koksmat/components/tracer";

import { usePathname } from "next/navigation";
import { leftRailApps } from "../../components/navigation";
import { RootLayout } from "@/components/rootlayout";
import GlobalBreadcrumb from "@/components/global-breadcrumb";

import { useMsal, useAccount } from "@azure/msal-react";
import { https } from "../koksmat/httphelper";
import Authenticate, { UserProfileAPI } from "../koksmat/authenticate";
// interface CaseProps {
//   scopes: string[];
//   title: string;
//   testurl: string;
//   token?: string;
// }
// const UserProfileAPI: CaseProps = {
//   scopes: ["User.Read"],
//   title: "Read user profile",
//   testurl: "https://graph.microsoft.com/v1.0/me",
// };

export default function ClientLayout(props: { children: any }) {
  const { children } = props;
  // const magicbox = useContext(MagicboxContext);
  // const { instance, accounts, inProgress } = useMsal();
  // const account = useAccount(accounts[0] || {});
  // const [latestResponse, setlatestResponse] = useState<any>();
  // const [token, settoken] = useState("");
  // const [latestError, setlatestError] = useState<any>();
  // const aquireToken = async (thisCase: CaseProps) => {
  //   setlatestError(undefined);
  //   setlatestResponse(undefined);
  //   if (account && thisCase) {
  //     try {
  //       const response = await instance.acquireTokenSilent({
  //         scopes: thisCase?.scopes ?? [],
  //         account: account,
  //       });
  //       thisCase.token = response.accessToken;
  //       magicbox.setAuthToken(response.accessToken, "MSAL");
  //       settoken(response.accessToken);
  //       const getResponse = await https(
  //         response.accessToken,
  //         "GET",
  //         thisCase.testurl
  //       );
  //       setlatestResponse(getResponse);
  //     } catch (error) {
  //       try {
  //         const response = await instance.acquireTokenPopup({
  //           scopes: thisCase?.scopes ?? [],
  //           account: account,
  //         });
  //         thisCase.token = response.accessToken;
  //         settoken(response.accessToken);
  //         magicbox.setAuthToken(response.accessToken, "MSAL");

  //         const getResponse = await https(
  //           response.accessToken,
  //           "GET",
  //           thisCase.testurl
  //         );
  //         setlatestResponse(getResponse);
  //       } catch (error) {
  //         setlatestError(error);
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const load = async () => {
  //     if (magicbox.authtoken) {
  //       settoken(magicbox.authtoken);
  //       return;
  //     }
  //     await aquireToken(UserProfileAPI);
  //   };
  //   load();
  // }, []);
  // if (!magicbox) {
  //   return <div>no magicbox</div>;
  // }
  // if (!magicbox.user) {
  //   return (
  //     <div className="flex h-screen">
  //       <div className="grow"></div>
  //       <div className="flex flex-col">
  //         <div className="grow"></div>
  //         <div>
  //           {" "}
  //           <Button
  //             onClick={async () => {
  //               const signedIn = await magicbox.signIn(["User.Read"], "");

  //               magicbox.refresh();
  //             }}
  //           >
  //             Sign In using Microsoft 365 account
  //           </Button>
  //         </div>
  //         <div className="grow"></div>
  //       </div>
  //       <div className="grow"></div>
  //     </div>
  //   );
  // }
  return (
    <AppProvider>
      <Authenticate apiScope={UserProfileAPI}>
        <RootLayout breadcrumb={<GlobalBreadcrumb />}>
          <div className="px-4">{children}</div>
        </RootLayout>
      </Authenticate>
    </AppProvider>
  );
}
