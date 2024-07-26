import { run } from "@/actions/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const result = await run(
      res.channel,
      res.args,
      res.body,
      res.timeout,
      res.transactionId
    );
    return new Response(JSON.stringify(result));
  } catch (error) {
    return Response.error();
  }
}
