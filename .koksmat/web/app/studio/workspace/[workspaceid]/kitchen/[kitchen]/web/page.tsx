import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="w-full h-full ">
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Sorry, no content here</h1>
          <p className="text-gray-700">
            Visit the parent folder{" "}
            <Link href=".">
              <Button variant="link">Up</Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
