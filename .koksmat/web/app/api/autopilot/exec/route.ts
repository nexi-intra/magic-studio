import { NatsRPC } from "@/lib/nats-rpc";

export async function POST(request: Request) {
  const body = await request.json();

  const result = await NatsRPC(
    body.sessionid,
    body.action,
    body.command,
    body.args
  );

  return new Response(result);
}
