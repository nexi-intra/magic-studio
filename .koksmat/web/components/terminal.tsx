"use client";
/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/DJL1giYMk5a
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MonacoEditor, { Monaco, useMonaco } from "@monaco-editor/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { AnsiUp } from "ansi_up";
type Command = {
  timestamp: number;
  cmd: string;
  command: string;
  preview: string;
  isPreviewJson: boolean;

  error_message: string;
};
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import WithClipboardCopy from "./with-clipboardcopy";
import TerminalEditor from "./terminal-editor";
import CreateHistory from "@/actions/database/mix/create_history";
import { MagicboxContext } from "@/app/koksmat/magicbox-context";
import { ensureUser } from "@/app/api/workspace";
class CommandManager {
  private commands: Command[] = [];

  // Method to add a command
  async addCommand(
    accessToken: string,
    timestamp: number,
    cmd: string,
    command: string,
    preview: string,
    isPreviewJson: boolean,

    error_message: string = ""
  ) {
    if (!this.commands) {
      this.commands = [];
    }
    // Check if the command already exists
    const existingCommand = this.commands.find(
      (c) =>
        c.cmd === cmd &&
        c.command === command &&
        c.preview === preview &&
        c.error_message === error_message
    );

    if (!existingCommand) {
      this.commands.push({
        timestamp,
        cmd,
        command,
        preview,
        isPreviewJson,

        error_message,
      });
      //const user = await ensureUser(accessToken);
      await CreateHistory(
        accessToken,
        cmd,
        command,
        13,
        "shell",
        false,
        false,
        command,
        {}
      );
    } else {
      existingCommand.timestamp = timestamp;
      console.log("Command already exists");
    }
  }

  // Method to get all commands
  getCommands(): Command[] {
    return this.commands ?? [];
  }

  // Method to marshal (convert the commands array to a JSON string)
  unmarshal(): string {
    return JSON.stringify(this.commands);
  }

  // Method to unmarshal (populate the commands array from a JSON string)
  marshal(jsonString: string): boolean {
    try {
      const commands: Command[] = JSON.parse(jsonString);
      this.commands = commands;
      return true;
    } catch (error) {
      this.commands = [];
      console.error("Invalid JSON string");
      return false;
    }
  }
}

// // Usage
// const commandManager = new CommandManager();

// // Adding commands
// commandManager.addCommand(Date.now(), 'cmd1', 'command1', 'preview1', true);
// commandManager.addCommand(Date.now(), 'cmd2', 'command2', 'preview2', false);

// // Trying to add a duplicate command
// commandManager.addCommand(Date.now(), 'cmd1', 'command1', 'preview1', true);

// console.log(commandManager.getCommands());

// // Marshalling the commands to a JSON string
// const jsonString = commandManager.unmarshal();
// console.log(jsonString);

// // Unmarshalling the commands from a JSON string
// const newJsonString = '[{"timestamp":1627050592,"cmd":"cmd3","command":"command3","preview":"preview3","isPreviewJson":true}]';
// commandManager.marshal(newJsonString);
// console.log(commandManager.getCommands());

export function Terminal(props: {
  workspace_id: string;
  kitchen_root: string;
  kitchen?: string;
}) {
  const { workspace_id, kitchen_root, kitchen } = props;
  const magicbox = useContext(MagicboxContext);
  const [cwd, setcwd] = useState(kitchen_root);
  const [cmd, setcmd] = useState("");
  const [output, setoutput] = useState<any>();
  const [isJSON, setisJSON] = useState(false);
  const [isRunning, setisRunning] = useState(false);
  const commandHistory = useMemo(() => {
    const commands = localStorage.getItem("commands");
    const cmd_manager = new CommandManager();

    cmd_manager.marshal(commands!);
    return cmd_manager;
  }, []);

  useEffect(() => {
    return () => {
      setcwd(kitchen_root);
    };
  }, [kitchen_root]);

  function parseCommand(command: string): { command: string; args: string[] } {
    const args: string[] = [];
    let currentArg = "";
    let inSingleQuote = false;

    for (let i = 0; i < command.length; i++) {
      const char = command[i];

      if (char === "'") {
        inSingleQuote = !inSingleQuote;
      } else if (char === " " && !inSingleQuote) {
        if (currentArg) {
          args.push(currentArg);
          currentArg = "";
        }
      } else {
        currentArg += char;
      }
    }

    if (currentArg) {
      args.push(currentArg);
    }

    const cmd = args.shift() ?? "";
    return { command: cmd, args };
  }

  // Example usage:
  const input = "echo 'Hello world' this is a test";
  const result = parseCommand(input);
  console.log(result); // Output: { cmd: 'echo', args: ['Hello world', 'this', 'is', 'a', 'test'] }

  const execute = async () => {
    const { command, args } = parseCommand(cmd);
    const body = JSON.stringify({
      sessionid: __dirname + "/" + __filename,
      action: "",
      command,
      args,
      cwd,
    });
    const result = await fetch("/api/autopilot/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    setisRunning(true);
    const j = await result.json();
    setisRunning(false);

    if (j.body) {
      try {
        const json = JSON.parse(j.body);
        setoutput(json);
        setisJSON(true);
        commandHistory.addCommand(
          magicbox.authtoken,
          Date.now(),
          cmd,
          command,
          JSON.stringify(json, null, 2),
          true,

          j.error_message
        );
      } catch (error) {
        setisJSON(false);

        const ansiUp = new AnsiUp();
        const htmlOutput = ansiUp.ansi_to_html(j.body);
        setoutput(j.body);
        commandHistory.addCommand(
          magicbox.authtoken,

          Date.now(),
          cmd,
          command,
          j.body,
          false,

          j.error_message
        );
      }
      localStorage.setItem("commands", commandHistory.unmarshal());
    }

    //CreateHistory(magic)
    console.log(j);
    console.log(result);
  };

  return (
    <div className="flex  w-full bg-background h-[calc(100vh-200px)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-full min-w-full"
      >
        <ResizablePanel
          defaultSize={30}
          className="overflow-auto max-h-full min-h-full"
        >
          <div className="grid gap-2 p-4">
            {commandHistory
              .getCommands()
              .sort((a, b) => b.timestamp - a.timestamp)

              .map((command, index) => (
                <div
                  onClick={() => {
                    setcmd(command.cmd);
                    setoutput(command.preview);
                  }}
                  className="flex items-center gap-2 rounded-md bg-muted/30 p-2 text-sm cursor-pointer"
                  key={index}
                >
                  <TerminalIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">
                    {command.cmd}
                  </span>
                  {command.error_message && (
                    <span className="text-muted-foreground text-red-500">
                      {command.error_message}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel className="min-h-full w-full">
          <ResizablePanelGroup
            direction="vertical"
            className="min-h-full  w-full"
          >
            <ResizablePanel defaultSize={20}>
              {/* <div className="flex h-16 items-center gap-4 border-b bg-background px-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <TerminalIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle history</span>
                </Button>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CircleDotIcon className="h-4 w-4 text-primary" />
                  <span className="text-primary">Terminal</span>
                </div>
              </div> */}
              <div className="ml-4">Working directory</div>
              <div className="flex items-center gap-2 border-b bg-background px-4 py-2">
                <Input
                  placeholder="Working directory"
                  value={cwd}
                  onChange={(e) => setcwd(e.target.value)}
                />
              </div>
              <div className="ml-4">Command to run</div>
              <div className="flex  gap-2 border-t bg-background px-4 py-2 h-full max-w-[calc(80vw-100px)]">
                <TerminalEditor
                  language="bash"
                  onEnter={() => {
                    execute();
                  }}
                  code={cmd}
                  onCodeChange={function (code: string): void {
                    setcmd(code);
                  }}
                />
                {/* <MonacoEditor
                  width={"100%"}
                  defaultValue=""
                  height="100%"
                  language="bash"
                  onChange={(value) => {
                    setcmd(value!);
                  }}
                  value={cmd}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                /> */}
                <Button disabled={!cmd && isRunning} onClick={() => execute()}>
                  Run
                </Button>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex flex-1 flex-col h-full">
                <div className="flex h-16 items-center gap-2 border-b bg-background px-4">
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <ParenthesesIcon className="h-4 w-4" />
                    <span className="sr-only">Parse</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <CodeIcon className="h-4 w-4" />
                    <span className="sr-only">Preview Snippet</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span className="sr-only">Copy Snippet</span>
                  </Button>
                  <Button
                    disabled
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <SaveIcon className="h-4 w-4" />
                    <span className="sr-only">Write Snippet</span>
                  </Button>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden ">
                  <div className="flex-1 overflow-y-auto bg-muted/10 p-4 h-full max-w-[calc(80vw-100px)]">
                    <MonacoEditor
                      width={"100%"}
                      defaultValue=""
                      height="100%"
                      language={isJSON ? "json" : "shell"}
                      // onChange={(value) => {
                      //   setcmd(value!);
                      // }}
                      value={isJSON ? JSON.stringify(output, null, 2) : output}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                      }}
                    />
                  </div>
                </div>
                <div>{isJSON ? "JSON" : "Text"} Output</div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function CircleDotIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  );
}

function CodeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CopyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function ParenthesesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 21s-4-3-4-9 4-9 4-9" />
      <path d="M16 3s4 3 4 9-4 9-4 9" />
    </svg>
  );
}

function SaveIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function TerminalIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}