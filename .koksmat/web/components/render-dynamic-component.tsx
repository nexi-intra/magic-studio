import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export default function RenderDynamicComponent(props: {
  componentName: string;
}) {
  const { componentName } = props;
  const [show, setshow] = useState(false);

  const DynamicComponent = dynamic(
    () =>
      import(`@/components/${componentName}`).catch((err) => {
        console.error(`Failed to load component ${componentName}`, err);
        // return () => <p>Component not found</p>;
      }),
    {
      loading: () => <p>Loading...</p>,
      ssr: false,
    }
  );

  if (!show) {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          setshow(true);
        }}
      >
        Show
      </Button>
    );
  }
  return null; //<DynamicComponent />;
}
