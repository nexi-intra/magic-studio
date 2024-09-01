"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FullScreenActionDialogProps {
  children: React.ReactNode;
  title: string;
}

export default function FullScreenActionDialog({
  children,
  title,
}: FullScreenActionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 py-2 border-b">
            <div className="flex justify-between items-center">
              <DialogTitle>{title}</DialogTitle>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button> */}
            </div>
          </DialogHeader>
          <div className="flex-grow overflow-auto p-4">{children}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
