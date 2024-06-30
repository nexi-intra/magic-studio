/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/vFndfg4IeKP
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function StoredProcedurePage(props: {
  database: string;
  procedure: string;
}) {
  const { database, procedure } = props;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background px-4 py-3 shadow-sm sm:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="#" className="flex items-center gap-2" prefetch={false}>
              <DatabaseIcon className="h-6 w-6" />
              <span className="font-bold">Stored Procedures</span>
            </Link>
            <span className="text-muted-foreground">Procedure Name</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <FilePenIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto grid grid-cols-[200px_1fr] gap-8 py-8 sm:px-6">
        <nav className="sticky top-20 space-y-2">
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <DatabaseIcon className="h-4 w-4" />
            Source Code
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <DatabaseIcon className="h-4 w-4" />
            Table Dependencies
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
            prefetch={false}
          >
            <DatabaseIcon className="h-4 w-4" />
            Code Generator
          </Link>
        </nav>
        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold">Procedure Details</h2>
            <div className="grid gap-8">
              <div>
                <h3 className="mb-2 text-lg font-medium">Table Dependencies</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="#"
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      users
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      products
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">Source Code</h3>
                <pre className="rounded-md bg-muted p-4 text-sm">
                  <code>{`
CREATE PROCEDURE [dbo].[GetOrdersByUser]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        o.OrderId,
        o.OrderDate,
        o.TotalAmount,
        p.ProductName,
        p.Price
    FROM
        Orders o
        JOIN OrderDetails od ON o.OrderId = od.OrderId
        JOIN Products p ON od.ProductId = p.ProductId
    WHERE
        o.UserId = @UserId
    ORDER BY
        o.OrderDate DESC;
END
                    `}</code>
                </pre>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">Description</h3>
                <div className="prose max-w-none">
                  <p>
                    This stored procedure retrieves all orders for a given user
                    ID. It joins the Orders, OrderDetails, and Products tables
                    to return the order ID, order date, total amount, product
                    name, and product price.
                  </p>
                  <h4>Inputs</h4>
                  <ul>
                    <li>
                      <strong>@UserId</strong> (INT): The ID of the user to
                      retrieve orders for.
                    </li>
                  </ul>
                  <h4>Outputs</h4>
                  <ul>
                    <li>
                      <strong>OrderId</strong> (INT): The unique identifier for
                      the order.
                    </li>
                    <li>
                      <strong>OrderDate</strong> (DATETIME): The date and time
                      the order was placed.
                    </li>
                    <li>
                      <strong>TotalAmount</strong> (DECIMAL): The total amount
                      of the order.
                    </li>
                    <li>
                      <strong>ProductName</strong> (VARCHAR): The name of the
                      product.
                    </li>
                    <li>
                      <strong>Price</strong> (DECIMAL): The price of the
                      product.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
          <section>
            <h2 className="mb-4 text-2xl font-bold">Integration Options</h2>
            <div className="grid gap-4">
              <div>
                <h3 className="mb-2 text-lg font-medium">NATS Service Mesh</h3>
                <pre className="rounded-md bg-muted p-4 text-sm">
                  <code>{`
import { NatsClient } from 'nats-client';

const client = new NatsClient({
  servers: ['nats://nats.example.com:4222'],
  token: 'your-nats-token',
});

const request = await client.request({
  subject: 'GetOrdersByUser',
  payload: JSON.stringify({ UserId: 123 }),
});

const response = JSON.parse(request.data.toString());
console.log(response);
                    `}</code>
                </pre>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-medium">REST POST</h3>
                <pre className="rounded-md bg-muted p-4 text-sm">
                  <code>{`
const response = await fetch('/api/procedures/GetOrdersByUser', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ UserId: 123 }),
});

const data = await response.json();
console.log(data);
                    `}</code>
                </pre>
              </div>
            </div>
          </section>
        </div>
      </div>
      <footer className="mt-auto border-t bg-background px-4 py-4 shadow-sm sm:px-6">
        <div className="container mx-auto flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; 2024 Acme Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
              prefetch={false}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DatabaseIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function DownloadIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function FilePenIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}
