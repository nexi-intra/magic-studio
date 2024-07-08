"use client";
/**
 * Create operation
 */
export interface CreateBiteProps {
  body?: { [key: string]: any };
  description?: string;
  name?: string;
  /**
   * Search Index is used for concatenating all searchable fields in a single field making in
   * easier to search
   */
  searchindex?: string;
  tenant?: string;
  [property: string]: any;
}

import React, { useEffect, useState } from "react";
import ExecuteTransaction from "./execute";
import { CopyIcon } from "lucide-react";

export default function ShareCreateBite(props: {
  transactionid: string;
  request: CreateBiteProps | null | undefined;
}) {
  const { request, transactionid } = props;
  const hasRequestBeenInitialized = () => {
    return request !== null && request !== undefined;
  };
  const [payload, setpayload] = useState<CreateBiteProps | null | undefined>(
    null
  );
  useEffect(() => {
    if (!hasRequestBeenInitialized()) return;

    setpayload(request);
  }, [request]);

  return (
    <div>
      {hasRequestBeenInitialized() && (
        <ExecuteTransaction
          database="share"
          payload={payload}
          processname="create_bite"
          onSuccess={(result) => {
            console.log("Bite created", result);
          }}
          transactionId={transactionid}
        >
          <div className="w-full">
            Copy the following code to add the bite to your project:
            <div className="flex text-center w-full m-4">
              <pre className="text-nowrap whitespace-nowrap">
                <code>koksmat add {transactionid}</code>
              </pre>

              <CopyIcon
                className="ml-2"
                onClick={() => {
                  // set text to clipboard

                  navigator.clipboard.writeText(`koksmat add ${transactionid}`);
                }}
              />
            </div>
          </div>
        </ExecuteTransaction>
      )}
    </div>
  );
}
