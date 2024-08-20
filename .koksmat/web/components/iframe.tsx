import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone, Tablet, Monitor, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface IframeSize {
  width: string;
  height: string;
}

interface FormFactor {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  size: IframeSize;
}

export default function IframeWithScalingTools(props: { url: string }) {
  const [url, setUrl] = useState<string>("");
  useEffect(() => {
    setUrl(props.url);
  }, [props.url]);

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
      size: { width: "100%", height: "600px" },
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
  const [fullscreen, setfullscreen] = useState(false);
  const toggleFullScreen = () => {
    setfullscreen(!fullscreen);
  };
  return (
    <div
      className={
        "transition-transform w-full  mx-auto p-4 space-y-4 fixed " +
        (fullscreen ? "fixed top-0 left-0 z-50" : "")
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
