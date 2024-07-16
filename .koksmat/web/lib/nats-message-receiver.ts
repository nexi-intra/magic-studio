import { nanoid } from "nanoid";
import { NatsConnection, connect, StringCodec, AckPolicy, millis } from "nats";
import { JsMsgImpl } from "nats/lib/jetstream/jsmsg";
import { log } from "./log";

export async function NatsMessageReceiver(sessionid: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let nc: NatsConnection | null = null;

    const connectionString = process.env.NATS ?? "nats://127.0.0.1:4222";
    nc = await connect({
      servers: [connectionString],
    });
    try {
      const name = "autopilot";
      const js = nc.jetstream();
      const jsm = await js.jetstreamManager();
      const durable_name = nanoid();
      // Use a unique consumer name or ephemeral consumer

      await jsm.consumers.add(name, {
        durable_name,
        ack_policy: AckPolicy.Explicit,
      });
      log("consumer added", durable_name);
      const c = await js.consumers.get(name, durable_name);
      log("waiting for message");
      let m = await c.next();
      if (m) {
        log("message received with subject", m.subject);
        const mi = m as JsMsgImpl;
        const subj = mi.msg.reply!;
        //nc.publish(subj, "+ACK");
        m.ack();
        await nc.flush();

        const sc = StringCodec();
        const message = sc.decode(m.data);

        resolve(message);
      } else {
        log("no message");
        resolve("");
      }
      log("deleting consumer", durable_name);
      await jsm.consumers.delete(name, durable_name);
    } catch (error) {
      console.log("error", error);
      resolve("");
    } finally {
      if (nc) {
        log("closing connection");
        //await nc.drain();
        await nc.close();
      }
    }
  });
}
