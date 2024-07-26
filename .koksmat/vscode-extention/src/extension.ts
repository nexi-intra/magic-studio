import moment, { Moment } from "moment";

import * as vscode from "vscode";
import { DemoTreeDataProvider } from "./TreeDataProvider";
class Logger {
  static channel: vscode.OutputChannel;

  static log(message: any) {
    if (this.channel) {
      const time = moment().format("HH:mm:ss");
      this.channel.appendLine(`[${time}] ${message}`);
    }
  }

  // static showInformationMessage(message: string, ...items: string[]): Thenable<string> {
  //     this.log(message);
  //     return vscode.window.showInformationMessage(message, ...items);
  // }

  // static showErrorMessage(message: string, ...items: string[]): Thenable<string> {
  //     this.log(message);
  //     return vscode.window.showErrorMessage(message, ...items);
  // }
}

export function activate(context: vscode.ExtensionContext) {
  Logger.channel = vscode.window.createOutputChannel("Koksmat");
  context.subscriptions.push(Logger.channel);

  Logger.log("Koksmat is now active!");

  const treeDataProvider = new DemoTreeDataProvider();
  vscode.window.registerTreeDataProvider("demoTreeView", treeDataProvider);

  vscode.commands.registerCommand("demoTreeView.openFile", async (resource) => {
    Logger.log("Opening file: " + resource.filePath);
    const fileUri = vscode.Uri.file(resource.filePath);
    vscode.window.showInformationMessage("Opening file: " + resource.filePath);
    await vscode.env.openExternal(vscode.Uri.parse("https://www.google.com"));
    vscode.window.showTextDocument(
      vscode.Uri.parse(
        "/Users/nielsgregersjohansen/kitchens/magic-studio/.koksmat/vscode-extention/src/extension.ts"
      )
    );
  });

  const refreshCommand = vscode.commands.registerCommand(
    "koksmat.refreshTree",
    () => {
      treeDataProvider.refresh();
    }
  );

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "koksmatWebView",
      new WebviewViewProvider(context)
    )
  );

  const command = vscode.commands.registerCommand("koksmat.openWebView", () => {
    vscode.commands.executeCommand("workbench.view.extension.koksmat");
  });
  context.subscriptions.push(command);
}

class WebviewViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly context: vscode.ExtensionContext) {
    Logger.log("WebviewViewProvider getting initialized");
  }

  resolveWebviewView(webviewView: vscode.WebviewView) {
    Logger.log("resolveWebviewView getting called");
    const webview = webviewView.webview;

    webview.options = {
      enableScripts: true,
    };

    webview.html = this.getWebviewContent();
  }

  private getWebviewContent() {
    return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Web Application</title>
            </head>
            <body>
            <h1>Hello World</h1>
                
            </body>
            </html>
        `;
  }
}
