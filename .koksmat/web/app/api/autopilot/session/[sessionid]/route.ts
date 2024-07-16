import { run } from "@/app/koksmat/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { log } from "@/lib/log";
import { NatsMessageReceiver } from "@/lib/nats-message-receiver";
import { getDate } from "date-fns";
import { NatsConnection, connect, StringCodec } from "nats";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { sessionid: string } }
) {
  log("GET /autopilot/session2/[sessionid]");
  const msg = await NatsMessageReceiver(params.sessionid);

  return new Response(msg ? msg : JSON.stringify({ errormessage: "timeout" }));
}

/**
 * 
 * 
  const { packageid } = req.query;

 
  res.status(200).json(result);
 */
