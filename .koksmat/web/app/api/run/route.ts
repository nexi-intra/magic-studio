import { run } from "@/actions/server";

export async function POST(request: Request) {
  try {
    const res = await request.json();
    const result = await run<any>(
      res.channel,
      res.args,
      res.body,
      res.timeout,
      res.transactionId
    );
    let hasError = result.hasError;
    if (hasError) {
      return new Response(JSON.stringify({ error: result.errorMessage }));
    }
    if (!result.data?.Result?.OK) {
      return new Response(JSON.stringify({ error: "Unknown error" }));
    }

    const returnValue = result.data?.Result?.ID;
    return new Response(JSON.stringify(returnValue));
  } catch (error) {
    return Response.error();
  }
}
