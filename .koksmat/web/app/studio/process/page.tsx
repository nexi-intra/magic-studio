"use client";
import { APPNAME } from "@/app/global";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import SQLCards from "@/components/sql-cards";
import { CardStackIcon } from "@radix-ui/react-icons";
import React, { useContext } from "react";
import ProcessManagementHero from "@/components/process-management-hero";
import Link from "next/link";
import ProcessExplanation from "@/components/process-explanation";
import KoksmatStudioProcess from "@/components/koksmat-studio-process";

export default function Page() {
  const magicbox = useContext(MagicboxContext);
  return (
    <div>
      <ProcessManagementHero getStartedHref="#step1" learnMoreHref="#" />
      <section
        id="step1"
        className="h-screen flex items-center justify-center overflow-hidden relative"
      >
        <h1 className="absolute top-full transform translate-y-[-100vh] text-4xl font-bold text-center mt-5">
          Get started
        </h1>
        <ProcessExplanation prevHref={"#"} nextHref={"#step2"} />
      </section>

      <section
        id="step2"
        className="h-screen flex items-center justify-center overflow-hidden relative"
      >
        <KoksmatStudioProcess />
      </section>
      <section
        id="step3"
        className="h-screen flex items-center justify-center overflow-hidden relative"
      >
        <h1 className="absolute top-full transform translate-y-[-100vh] text-4xl font-bold text-center mt-5">
          Get started
        </h1>
        <SQLCards
          Icon={CardStackIcon}
          slugPrefix={"/" + APPNAME + "/process/recipe/"}
          database={"works"}
          sql={`
SELECT W.name as title, '' as description, W.id as slug FROM activitymodel as W 

    
    `}
        />
      </section>
      <Link href="#">Top</Link>
    </div>
  );
}
