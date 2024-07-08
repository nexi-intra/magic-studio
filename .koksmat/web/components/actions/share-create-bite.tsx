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
          transactionId={transactionid}
        />
      )}
    </div>
  );
}
