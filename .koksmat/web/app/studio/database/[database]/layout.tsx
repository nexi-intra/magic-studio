import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: { database: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const database = props.params.database;

  return {
    title: {
      template: "%s | KOKSMAT studio",
      default: "Database: " + database,
    },
  };
}
export default function Layout(props: { children: any }) {
  const { children } = props;
  return <div> {children}</div>;
}
