"use client";
import IconPicker from "@/components/icon-picker";
import React from "react";

export default function Page() {
  return (
    <div>
      <IconPicker
        onSelectIcon={function (iconName: string): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
}
