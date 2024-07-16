import { run } from "@/app/koksmat/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { NatsRPC } from "@/lib/nats-rpc";
import { NatsConnection, connect, StringCodec } from "nats";

export async function GET(
  request: Request,
  { params }: { params: { sessionid: string } }
): Promise<Response> {
  const response = await NatsRPC(params.sessionid, "ping", "ping", []);
  return new Response(response);
}
