import { MapPin, PlayCircle, CheckSquare, GitFork } from "lucide-react";
import Link from "next/link";

export default function ProcessExplanation(props: {
  prevHref: string;
  nextHref: string;
}) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
          Understanding Our Process
        </h2>
        <Link href={props.prevHref}>Previous</Link>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-2 bg-blue-500 text-white rounded-full">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Where to Start</h3>
            <p className="text-gray-600">
              Learn how to navigate to the right place for submitting your
              request and initiating the process.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-2 bg-green-500 text-white rounded-full">
              <PlayCircle className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Initiating the Process</h3>
            <p className="text-gray-600">
              Understand the steps taken to kick off the process once your
              request is received.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-2 bg-yellow-500 text-white rounded-full">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Completion Criteria</h3>
            <p className="text-gray-600">
              Discover the key factors and requirements that determine when the
              process is successfully completed.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-2 bg-purple-500 text-white rounded-full">
              <GitFork className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Next Steps</h3>
            <p className="text-gray-600">
              Explore the decision-making process for determining the
              appropriate actions following completion.
            </p>
          </div>
        </div>
        <Link href={props.nextHref}>Next</Link>
      </div>
    </section>
  );
}
