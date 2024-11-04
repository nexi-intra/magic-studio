import * as vscode from "vscode";

export class DemoTreeDataProvider
  implements vscode.TreeDataProvider<DemoTreeItem>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    DemoTreeItem | undefined | void
  > = new vscode.EventEmitter<DemoTreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<DemoTreeItem | undefined | void> =
    this._onDidChangeTreeData.event;

  private data: DemoTreeItem[];

  constructor() {
    this.data = [
      new DemoTreeItem("Item 1", "x"),
      new DemoTreeItem("Item 2", "y", [
        new DemoTreeItem("Sub Item 2.1", "z"),
        new DemoTreeItem("Sub Item 2.2", "v"),
      ]),
      new DemoTreeItem("Item 3", "w"),
    ];
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DemoTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: DemoTreeItem): Thenable<DemoTreeItem[]> {
    if (element === undefined) {
      return Promise.resolve(this.data);
    }
    return Promise.resolve(element.children!);
  }
}

export class DemoTreeItem extends vscode.TreeItem {
  children: DemoTreeItem[] | undefined;
  filePath: string;

  constructor(label: string, filePath: string, children?: DemoTreeItem[]) {
    super(
      label,
      children === undefined
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Collapsed
    );
    this.children = children;
    this.filePath = filePath;
    this.command = {
      command: "demoTreeView.openFile",
      title: "Open File",
      arguments: [this],
    };
  }
}
