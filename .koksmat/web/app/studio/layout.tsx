import ClientLayout from "./Clientlayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://nexi-intra-magic-studio-canary.intra.nexigroup.com"
  ),
  title: {
    template: "%s | KOKSMAT studio",
    default: "KOKSMAT studio",
  },
  openGraph: {
    title: "KOKSMAT studio",
    description: "The place to cook Magic Button Apps.",
    images: [
      {
        url: "/studio/og",
        width: 1200,
        height: 600,

        alt: "Koksmat image",
      },
    ],
  },

  applicationName: "KOKSMAT studio",
  referrer: "origin-when-cross-origin",
  keywords: ["no code", "low code", "power apps", "power automate"],
  creator: "Niels Gregers Johansen",
  publisher: "Niels Gregers Johansen",
  description: "The place to cook Magic Button Apps.",
};
export default function Layout(props: { children: any }) {
  const { children } = props;
  return <ClientLayout>{children}</ClientLayout>;
}
