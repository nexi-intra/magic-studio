import { DashboardHomepage } from "@/components/dashboard-homepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | KOKSMAT studio",
    default: "KOKSMAT studio",
  },
  description: "The place to cook Magic Button Apps.",
};

export default function Page() {
  return <DashboardHomepage />;
}
