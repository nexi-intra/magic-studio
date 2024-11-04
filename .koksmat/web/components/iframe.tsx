import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Tablet, Monitor, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useLazyMemo } from "@dnd-kit/utilities";

interface IframeSize {
  width: string;
  height: string;
}

interface FormFactor {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  size: IframeSize;
}
export type IFrameMessageHandler = (message: object) => void;
export default function IframeWithScalingTools(props: {
  url: string;
  unRegisterPostMessage: () => void;
  registerPostMessage: (postMessage: IFrameMessageHandler) => void;
}) {
  const url = useMemo(() => props.url, [props.url]);

  // useEffect(() => {
  //   if (props.url === url) return;
  //   setUrl(props.url);
  // }, [props.url]);

  const [iframeSize, setIframeSize] = useState<IframeSize>({
    width: "100%",
    height: "600px",
  });

  const formFactors: FormFactor[] = [
    {
      name: "Mobile",
      icon: Smartphone,
      size: { width: "375px", height: "667px" },
    },
    {
      name: "Tablet",
      icon: Tablet,
      size: { width: "768px", height: "1024px" },
    },
    {
      name: "Desktop",
      icon: Monitor,
      size: { width: "1200px", height: "1024px" },
    },
  ];

  const handleResize = (size: IframeSize) => {
    setIframeSize(size);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log(event.key);
    if (event.key === "Escape" && fullscreen) {
      setfullscreen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleRefresh = () => {
    const iframe = document.getElementById(
      "preview-iframe"
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const postMessage = useCallback((message: object) => {
    const iframe = document.getElementById(
      "preview-iframe"
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.contentWindow?.postMessage(message, "*");
    }
  }, []); // Empty dependency array ensures that the function is not recreated on re-renders.

  useEffect(() => {
    props.registerPostMessage(postMessage);

    return () => {
      props.unRegisterPostMessage();
    };
  }, [postMessage]);

  const [fullscreen, setfullscreen] = useState(false);
  const toggleFullScreen = () => {
    setfullscreen(!fullscreen);
  };
  return (
    <div
      className={
        "transition-all  duration-300 ease-in-out  w-full  mx-auto p-4 space-y-4  bg-white" +
        (fullscreen
          ? " top-0 left-0 right-0 bottom-0 z-50 fixed"
          : "top-auto left-auto right-auto bottom-auto h-auto")
      }
    >
      <div className="flex justify-center space-x-2 bg-secondary p-2 rounded-md">
        {formFactors.map((factor) => (
          <Button
            key={factor.name}
            variant={iframeSize == factor.size ? "default" : "ghost"}
            onClick={() => handleResize(factor.size)}
            className="flex items-center"
          >
            <factor.icon className="h-4 w-4 mr-2" />
            {factor.name}
          </Button>
        ))}

        <Button variant="ghost" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button
          variant="ghost"
          onClick={toggleFullScreen}
          className="flex items-center"
        >
          {fullscreen ? "Restore" : "Full screen"}
        </Button>
        <Link href={url} target="_blank">
          <Button
            variant="ghost"
            onClick={toggleFullScreen}
            className="flex items-center"
          >
            New Window
          </Button>
        </Link>
      </div>

      <div
        className="border rounded-lg overflow-hidden"
        style={{ maxWidth: "100%", height: iframeSize.height }}
      >
        <iframe
          id="preview-iframe"
          src={url}
          style={{ width: iframeSize.width, height: iframeSize.height }}
          className="border-0 m-x-auto"
          title="Preview"
        />
      </div>
    </div>
  );
}
