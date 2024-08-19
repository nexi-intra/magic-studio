import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { useState, ReactNode } from "react";

// Define the type for the tree node
export interface TreeNodeProps {
  name: string;
  children?: TreeNodeProps[];
  level?: number;
}

// This function takes an array of paths and converts them into a tree structure
export function parsePathsToTree(paths: string[]): TreeNodeProps[] {
  const root: TreeNodeProps = { name: "", children: [], level: 0 };

  paths.forEach((path) => {
    const parts = path.split("/").filter(Boolean);
    let currentNode = root;

    parts.forEach((part, index) => {
      let childNode = currentNode.children?.find((node) => node.name === part);

      if (!childNode) {
        childNode = {
          name: part,
          children: [],
          level: index + 1,
        };
        currentNode.children?.push(childNode);
      }

      currentNode = childNode;
    });
  });

  return root.children || [];
}

const TreeNode: React.FC<TreeNodeProps> = ({ name, children, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = !!children;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-muted cursor-pointer ${
          level === 0 ? "" : "ml-4"
        }`}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        {isFolder ? (
          isOpen ? (
            <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
          )
        ) : (
          <span className="w-4 mr-1" />
        )}
        {isFolder ? (
          <Folder className="h-4 w-4 mr-2 text-yellow-400" />
        ) : (
          <File className="h-4 w-4 mr-2 text-blue-400" />
        )}
        <span className="text-sm">{name}</span>
      </div>
      {isOpen && children && (
        <div className="ml-4">
          {children.map((child, index) => (
            <TreeNode key={index} {...child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function TreeView(props: { treeData: TreeNodeProps[] }) {
  const { treeData } = props;
  // Define the tree structure with type safety
  // const treeData: TreeNodeProps[] = [
  //   {
  //     name: "src",
  //     children: [
  //       {
  //         name: "components",
  //         children: [
  //           { name: "Button.tsx" },
  //           { name: "Card.tsx" },
  //           { name: "Input.tsx" },
  //         ],
  //       },
  //       {
  //         name: "pages",
  //         children: [
  //           { name: "index.tsx" },
  //           { name: "about.tsx" },
  //           { name: "contact.tsx" },
  //         ],
  //       },
  //       { name: "styles", children: [{ name: "globals.css" }] },
  //       { name: "utils", children: [{ name: "helpers.ts" }] },
  //     ],
  //   },
  //   { name: "package.json" },
  //   { name: "tsconfig.json" },
  //   { name: "README.md" },
  // ];

  return (
    <div className="w-64 h-[400px] border rounded-md overflow-auto bg-background text-foreground">
      <div className="p-2">
        {treeData.map((node, index) => (
          <TreeNode key={index} {...node} />
        ))}
      </div>
    </div>
  );
}
