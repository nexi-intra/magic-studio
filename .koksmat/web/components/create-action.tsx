/**
 * v0 by Vercel.
 * @see https://v0.dev/t/3NKJrAvJaNw
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "./icons/SearchIcon";

interface Operation {
  id: number;
  name: string;
  type: string;
  params: string[];
}

export default function CreateAction() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null
  );
  const [actionName, setActionName] = useState<string>("");
  const [actionDescription, setActionDescription] = useState<string>("");
  const [allowedRoles, setAllowedRoles] = useState<string[]>([]);

  const operations: Operation[] = [
    { id: 1, name: "Create User", type: "create", params: ["name", "email"] },
    {
      id: 2,
      name: "Update User",
      type: "update",
      params: ["id", "name", "email"],
    },
    { id: 3, name: "Delete User", type: "delete", params: ["id"] },
    { id: 4, name: "Restore User", type: "restore", params: ["id"] },
    {
      id: 5,
      name: "Custom Action",
      type: "custom",
      params: ["param1", "param2"],
    },
  ];

  const filteredOperations = useMemo(() => {
    return operations.filter((op) =>
      op.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleOperationSelect = (operation: Operation) => {
    setSelectedOperation(operation);
  };

  const handleActionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActionName(e.target.value);
  };

  const handleActionDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setActionDescription(e.target.value);
  };

  const handleRoleSelect = (role: string) => {
    if (allowedRoles.includes(role)) {
      setAllowedRoles(allowedRoles.filter((r) => r !== role));
    } else {
      setAllowedRoles([...allowedRoles, role]);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-background rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-foreground"
            >
              Search Operations
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Search operations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="operation"
              className="block text-sm font-medium text-foreground"
            >
              Select Operation
            </label>
            <div className="mt-1">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="update">Update</TabsTrigger>
                  <TabsTrigger value="delete">Delete</TabsTrigger>
                  <TabsTrigger value="restore">Restore</TabsTrigger>
                  <TabsTrigger value="custom">Custom</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                  <ul className="max-h-[200px] overflow-auto">
                    {filteredOperations.map((op) => (
                      <li
                        key={op.id}
                        className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                          selectedOperation?.id === op.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleOperationSelect(op)}
                      >
                        {op.name}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="create">
                  <ul className="max-h-[200px] overflow-auto">
                    {filteredOperations
                      .filter((op) => op.type === "create")
                      .map((op) => (
                        <li
                          key={op.id}
                          className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedOperation?.id === op.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleOperationSelect(op)}
                        >
                          {op.name}
                        </li>
                      ))}
                  </ul>
                </TabsContent>
                <TabsContent value="update">
                  <ul className="max-h-[200px] overflow-auto">
                    {filteredOperations
                      .filter((op) => op.type === "update")
                      .map((op) => (
                        <li
                          key={op.id}
                          className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedOperation?.id === op.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleOperationSelect(op)}
                        >
                          {op.name}
                        </li>
                      ))}
                  </ul>
                </TabsContent>
                <TabsContent value="delete">
                  <ul className="max-h-[200px] overflow-auto">
                    {filteredOperations
                      .filter((op) => op.type === "delete")
                      .map((op) => (
                        <li
                          key={op.id}
                          className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedOperation?.id === op.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleOperationSelect(op)}
                        >
                          {op.name}
                        </li>
                      ))}
                  </ul>
                </TabsContent>
                <TabsContent value="restore">
                  <ul className="max-h-[200px] overflow-auto">
                    {filteredOperations
                      .filter((op) => op.type === "restore")
                      .map((op) => (
                        <li
                          key={op.id}
                          className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedOperation?.id === op.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleOperationSelect(op)}
                        >
                          {op.name}
                        </li>
                      ))}
                  </ul>
                </TabsContent>
                <TabsContent value="custom">
                  <ul className="max-h-[200px] overflow-auto">
                    {filteredOperations
                      .filter((op) => op.type === "custom")
                      .map((op) => (
                        <li
                          key={op.id}
                          className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedOperation?.id === op.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => handleOperationSelect(op)}
                        >
                          {op.name}
                        </li>
                      ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      {selectedOperation && (
        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Configure Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground"
              >
                Action Name
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Enter action name"
                value={actionName}
                onChange={handleActionNameChange}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-foreground"
              >
                Action Description
              </label>
              <textarea
                id="description"
                className="block w-full rounded-md border border-input bg-background text-foreground shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Enter action description"
                value={actionDescription}
                onChange={handleActionDescriptionChange}
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Required Parameters</h3>
            <ul className="list-disc pl-6">
              {selectedOperation.params.map((param, index) => (
                <li key={index}>{param}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Allowed Roles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="flex items-center">
                <Checkbox
                  id="role-admin"
                  checked={allowedRoles.includes("admin")}
                  onCheckedChange={() => handleRoleSelect("admin")}
                />
                <label
                  htmlFor="role-admin"
                  className="ml-2 text-sm font-medium text-foreground"
                >
                  Admin
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="role-manager"
                  checked={allowedRoles.includes("manager")}
                  onCheckedChange={() => handleRoleSelect("manager")}
                />
                <label
                  htmlFor="role-manager"
                  className="ml-2 text-sm font-medium text-foreground"
                >
                  Manager
                </label>
              </div>
              <div className="flex items-center">
                <Checkbox
                  id="role-user"
                  checked={allowedRoles.includes("user")}
                  onCheckedChange={() => handleRoleSelect("user")}
                />
                <label
                  htmlFor="role-user"
                  className="ml-2 text-sm font-medium text-foreground"
                >
                  User
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Save Action</Button>
          </div>
        </div>
      )}
    </div>
  );
}
