import { run } from "@/app/koksmat/magicservices";
import type { NextApiRequest, NextApiResponse } from "next";
export async function GET(
  request: NextApiRequest,
  { params }: { params: { packageid: string } }
) {
  const { packageid } = params;
  try {
    //const res = await request.json();
    const result = await run(
      "magic-mix.app",
      [
        "query",
        "mix",
        `
        select '${packageid}' as packageid,
        1 as "2"
        `,
      ],
      "",
      600,
      "x"
    );
    return Response.json(result);
  } catch (error) {
    return Response.error();
  }
}

/**
 * 
 * 
  const { packageid } = req.query;

 
  res.status(200).json(result);
 */
