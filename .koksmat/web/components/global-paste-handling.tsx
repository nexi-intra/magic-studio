import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import React, { useContext, useEffect } from "react";

export default function GlobalPasteHandling() {
  const magicbox = useContext(MagicboxContext);
  useEffect(() => {
    // Attach the paste event listener
    const handlePaste = (event: any) => {
      event.preventDefault();

      const clipboardData = event.clipboardData; //|| window.clipboardData;
      const pastedData = clipboardData.getData("Text");

      console.log("Pasted Data:", pastedData);
      magicbox.handlePaste(pastedData);

      // Perform any other global paste processing here
    };

    document.addEventListener("paste", handlePaste);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return null;
}
