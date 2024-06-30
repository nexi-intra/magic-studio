/**
 * v0 by Vercel.
 * @see https://v0.dev/t/survhkkYpCT
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function DialogForm(props: {
  count: number;
  className?: string;
  caption: string;
  description: string;
  children: any;
  onClose: (submitted: boolean) => void;
}) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(true);
  }, [props.count]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        // Close the dialog if the user clicks outside of it
        // and signal the parent component that the dialog was closed (not submitted)
        if (!open) props.onClose(false);
      }}
    >
      <DialogContent className={props.className}>
        <DialogHeader>
          <DialogTitle>{props.caption}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{props.children}</div>
        <DialogFooter>
          <Button type="button" onClick={() => props.onClose(true)}>
            Submit
          </Button>
          <Button
            variant="secondary"
            type="button"
            onClick={() => props.onClose(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
