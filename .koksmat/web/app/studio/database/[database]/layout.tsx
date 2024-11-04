import { DatabaseToolbar } from "@/components/database-toolbar";
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
export default function Layout(props: {
  children: any;
  params: { database: string };
}) {
  const { children } = props;
  const { database } = props.params;
  return (
    <div>
      <div className="h-full">{children}</div>
    </div>
  );
}
