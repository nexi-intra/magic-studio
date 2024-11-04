import React from "react";
import { CopyIcon } from "lucide-react";
export default function ShareBite(props: { transactionid: string }) {
  const { transactionid } = props;
  return (
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
  );
}
