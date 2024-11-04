import { on } from "events";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { useState, ReactNode } from "react";

// Define the type for the tree node
export interface TreeNodeProps {
  name: string;
  children?: TreeNodeProps[];
  level?: number;
  path: string;
  onSelect?: (path: string) => void;
  renderNode?: (node: TreeNodeProps) => ReactNode;
}
const sortKey = (a: TreeNodeProps) => {
  const prefix = (a.children?.length ?? 0) > 0 ? "00" : "10";
  return prefix + a.name.toLocaleLowerCase();
};

// This function takes an array of paths and converts them into a tree structure
export function parsePathsToTree(paths: string[]): TreeNodeProps[] {
  const root: TreeNodeProps = { name: "", children: [], level: 0, path: "" };

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
          path: path,
        };
        currentNode.children?.push(childNode);
      }

      currentNode = childNode;
    });
  });

  return root.children || [];
}

const TreeNode: React.FC<TreeNodeProps> = ({
  name,
  children,
  level = 0,
  path,
  onSelect,
  renderNode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = (children?.length ?? +0) > 0;

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-muted cursor-pointer ${
          level === 0 ? "" : "ml-4"
        }`}
        onClick={() => {
          isFolder && setIsOpen(!isOpen);

          if (!isFolder) {
            if (onSelect) {
              onSelect(path);
            }
          }
        }}
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
        <span className="text-sm">
          {renderNode ? renderNode({ name, children, level, path }) : name}
        </span>
      </div>
      {isOpen && children && (
        <div className="ml-4">
          {children
            .sort((a, b) => {
              const aKey = sortKey(a);
              const bKey = sortKey(b);
              return aKey.localeCompare(bKey);
            })
            .map((child, index) => (
              <TreeNode
                key={index}
                {...child}
                level={level + 1}
                onSelect={onSelect}
                renderNode={renderNode}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default function TreeView(props: {
  treeData: TreeNodeProps[];
  onSelect?: (path: string) => void;
  renderNode?: (node: TreeNodeProps) => ReactNode;
}) {
  const { treeData, onSelect, renderNode } = props;
  return (
    <div className="w-64 h-[400px] border rounded-md overflow-auto bg-background text-foreground">
      <div className="p-2">
        {treeData
          .sort((a, b) => {
            const aKey = sortKey(a);
            const bKey = sortKey(b);
            return aKey.localeCompare(bKey);
          })

          .map((node, index) => (
            <TreeNode
              key={index}
              {...node}
              onSelect={onSelect}
              renderNode={renderNode}
            />
          ))}
      </div>
    </div>
  );
}
