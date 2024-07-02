import { UserManagementPage } from "@/components/user-management-page";
import React from "react";

export default function layout(props: { children: React.ReactNode }) {
  const { children } = props;
  return (
    <div className="flex flex-col w-full h-full">
      {/* <div className="flex flex-row w-full h-16 bg-gray-800 text-white">
        <div className="flex flex-row items-center px-4">
          <div className="text-xl font-bold">Koksmat</div>
        </div>
        <div className="flex flex-row items-center justify-end w-full px-4">
          <div className="flex flex-row items-center space-x-4">
            <div>Admin</div>
            <div>Logout</div>
          </div>
        </div>
      </div> */}
      <div>{children}</div>
    </div>
  );
}
