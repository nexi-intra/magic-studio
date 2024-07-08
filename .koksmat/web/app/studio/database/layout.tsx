import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | KOKSMAT studio",
    default: "Databases",
  },
};
export default function Layout(props: { children: any }) {
  const { children } = props;
  return <div> {children}</div>;
}
