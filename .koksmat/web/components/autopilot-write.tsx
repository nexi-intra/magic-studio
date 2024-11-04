"use client";
import React from "react";
import { Button } from "./ui/button";
import { https, Result } from "@/app/koksmat/httphelper";

export default function AutopilotWrite() {
  return (
    <div>
      <Button
        onClick={async () => {
          const files = {
            files: [
              {
                directory: "dir1",
                file_name: "file1.txt",
                data: "Hello, World!",
              },
              {
                directory: "dir2",
                file_name: "file2.txt",
                data: "Go is awesome!",
              },
            ],
            category: "example",
            force: false,
            root_folder: "",
          };

          const response: any = await https<string>(
            "",
            "POST",
            "/api/autopilot/write",
            {
              files,
              channel: "servicename",
              timeout: 600,
            }
          );
        }}
      >
        Write
      </Button>
    </div>
  );
}
