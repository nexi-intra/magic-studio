import { Button } from "@/components/ui/button";
import { ArrowRight, Database, GitBranch, GitMerge } from "lucide-react";

export default function ProcessManagementHero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to Koksmat Studio
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Empower your business processes with our data-driven,
              state-of-the-art management platform.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <p className="text-sm text-muted-foreground">
              Designed for citizen developers and business analysts
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Database className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Data-Driven Approach</h3>
            </div>
            <p className="text-muted-foreground">
              Our platform leverages a comprehensive data model to define and
              manage processes, ensuring accuracy and consistency across your
              organization.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <GitBranch className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">Desired State Process Model</h3>
            </div>
            <p className="text-muted-foreground">
              Define your ideal process states and let our system guide you
              towards achieving them, optimizing efficiency and reducing errors.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <GitMerge className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold">
                Rich Set of Transition Gates
              </h3>
            </div>
            <p className="text-muted-foreground">
              Control and monitor process flow with our advanced set of
              transition gates, ensuring compliance and maintaining process
              integrity at every step.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
            <Button className="inline-flex items-center justify-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
