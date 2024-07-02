import { AccessMatrix } from "@/components/access-matrix";
import { ResourceRoleMatrix } from "@/components/resource-role-matrix";
import React from "react";

export default function page() {
  return (
    <div className="flex">
      <div>
        <ResourceRoleMatrix />
      </div>
      <div>
        <AccessMatrix />
      </div>
    </div>
  );
}
