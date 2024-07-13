import { run } from "@/app/koksmat/magicservices";
import { tryCatch } from "@/app/officeaddin/actions/outlook-samples";
import { NatsConnection, connect, StringCodec } from "nats";

export async function workspaceExecute(
  sessionId: string,
  command: string,
  args: string[],
  callback: (response: any) => void
) {
  let nc: NatsConnection | null = null;

  const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
  nc = await connect({
    servers: [connectionString],
  });
  let waiting = true;
  let loopcounter = 0;
  nc.publish(
    "autopilot.request." + sessionId,
    StringCodec().encode(JSON.stringify({ action: "execute", command, args }))
  );
  try {
    const sub = nc.subscribe("autopilot.response." + sessionId, {
      callback: (err, msg) => {
        const sc = StringCodec();
        if (err) {
          console.log("subscription error", err.message);
          return;
        }
        const requestBody = sc.decode(msg.data);
        callback(requestBody);
        console.log("response", requestBody);

        // waiting = false;
        // sub.unsubscribe();
      },
    });
    while (waiting) {
      loopcounter++;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (loopcounter > 60) {
        waiting = false;
        sub.unsubscribe();
        // resolve(new Response("timeout"));
      }
    }
  } catch (error) {
  } finally {
    if (nc) {
      nc.close();
    }
  }
}
