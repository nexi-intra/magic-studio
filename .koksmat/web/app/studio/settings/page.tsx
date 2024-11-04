import { href } from "@/components/rootlayout";
import SettingsPage from "@/components/settings-page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Settings() {
  return (
    <div>
      <Link href={href.PROCESS + "/admin"}><Button>Flow Admin</Button></Link>
      <SettingsPage />
    </div>
  );
}
