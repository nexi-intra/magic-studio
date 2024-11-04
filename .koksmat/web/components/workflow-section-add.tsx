/**
 * v0 by Vercel.
 * @see https://v0.dev/t/d8U54UZ1ANG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client";

import { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const ItemType = {
  CONSULTED_ROLE: "consultedRole",
  INFORMED_ROLE: "informedRole",
  DATA_ATTRIBUTE: "dataAttribute",
};

export default function WorkflowSectionEditor() {
  const [processName, setProcessName] = useState("");
  const [processDescription, setProcessDescription] = useState("");
  const [processNotes, setProcessNotes] = useState("");
  const [responsibleRole, setResponsibleRole] = useState("");
  const [accountableRole, setAccountableRole] = useState("");
  const [consultedRoles, setConsultedRoles] = useState([""]);
  const [informedRoles, setInformedRoles] = useState([""]);
  const [responsibleRoleComplete, setResponsibleRoleComplete] = useState("");
  const [accountableRoleComplete, setAccountableRoleComplete] = useState("");
  const [consultedRolesComplete, setConsultedRolesComplete] = useState([""]);
  const [informedRolesComplete, setInformedRolesComplete] = useState([""]);
  const [dataAttributes, setDataAttributes] = useState([
    {
      id: 1,
      attribute: "Customer Name",
      type: "String",
      required: true,
      description: "The name of the customer",
    },
    {
      id: 2,
      attribute: "Order Number",
      type: "Number",
      required: true,
      description: "The unique identifier for the order",
    },
    {
      id: 3,
      attribute: "Order Date",
      type: "Date",
      required: true,
      description: "The date the order was placed",
    },
    {
      id: 4,
      attribute: "Order Total",
      type: "Number",
      required: true,
      description: "The total amount of the order",
    },
  ]);

  const handleConsultedRolesChange = (index: number, value: string) => {
    setConsultedRoles((prevRoles) => {
      const newRoles = [...prevRoles];
      newRoles[index] = value;
      return newRoles;
    });
  };

  const handleInformedRolesChange = (index: number, value: string) => {
    setInformedRoles((prevRoles) => {
      const newRoles = [...prevRoles];
      newRoles[index] = value;
      return newRoles;
    });
  };

  const handleConsultedRolesCompleteChange = (index: number, value: string) => {
    setConsultedRolesComplete((prevRoles) => {
      const newRoles = [...prevRoles];
      newRoles[index] = value;
      return newRoles;
    });
  };

  const handleInformedRolesCompleteChange = (index: number, value: string) => {
    setInformedRolesComplete((prevRoles) => {
      const newRoles = [...prevRoles];
      newRoles[index] = value;
      return newRoles;
    });
  };

  const addConsultedRole = () => {
    setConsultedRoles((prevRoles) => [...prevRoles, ""]);
  };

  const removeConsultedRole = () => {
    setConsultedRoles((prevRoles) => prevRoles.slice(0, -1));
  };

  const addInformedRole = () => {
    setInformedRoles((prevRoles) => [...prevRoles, ""]);
  };

  const removeInformedRole = () => {
    setInformedRoles((prevRoles) => prevRoles.slice(0, -1));
  };

  const addConsultedRoleComplete = () => {
    setConsultedRolesComplete((prevRoles) => [...prevRoles, ""]);
  };

  const removeConsultedRoleComplete = () => {
    setConsultedRolesComplete((prevRoles) => prevRoles.slice(0, -1));
  };

  const addInformedRoleComplete = () => {
    setInformedRolesComplete((prevRoles) => [...prevRoles, ""]);
  };

  const removeInformedRoleComplete = () => {
    setInformedRolesComplete((prevRoles) => prevRoles.slice(0, -1));
  };

  const moveItem = (dragIndex: number, hoverIndex: number, type: string) => {
    if (type === ItemType.CONSULTED_ROLE) {
      const draggedItem = consultedRoles[dragIndex];
      const updatedRoles = [...consultedRoles];
      updatedRoles.splice(dragIndex, 1);
      updatedRoles.splice(hoverIndex, 0, draggedItem);
      setConsultedRoles(updatedRoles);
    } else if (type === ItemType.INFORMED_ROLE) {
      const draggedItem = informedRoles[dragIndex];
      const updatedRoles = [...informedRoles];
      updatedRoles.splice(dragIndex, 1);
      updatedRoles.splice(hoverIndex, 0, draggedItem);
      setInformedRoles(updatedRoles);
    } else if (type === ItemType.DATA_ATTRIBUTE) {
      const draggedItem = dataAttributes[dragIndex];
      const updatedAttributes = [...dataAttributes];
      updatedAttributes.splice(dragIndex, 1);
      updatedAttributes.splice(hoverIndex, 0, draggedItem);
      setDataAttributes(updatedAttributes);
    }
  };

  const DraggableItem = ({
    id,
    index,
    type,
    children,
  }: {
    id: number;
    index: number;
    type: string;
    children: React.ReactNode;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
      accept: type,
      hover(item: any, monitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) {
          return;
        }
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        moveItem(dragIndex, hoverIndex, type);
        item.index = hoverIndex;
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type,
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drag(drop(ref));
    return (
      <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        {children}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>General Process Information</CardTitle>
                <CardDescription>
                  Enter high-level details about the business process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="col-span-1">
                    <Label htmlFor="process-name">Process Name</Label>
                    <Input
                      id="process-name"
                      type="text"
                      placeholder="Enter process name"
                      value={processName}
                      onChange={(e) => setProcessName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="process-description">Description</Label>
                    <Textarea
                      id="process-description"
                      placeholder="Enter process description"
                      className="min-h-[100px]"
                      value={processDescription}
                      onChange={(e) => setProcessDescription(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="process-notes">Additional Notes</Label>
                    <Textarea
                      id="process-notes"
                      placeholder="Enter additional notes"
                      className="min-h-[100px]"
                      value={processNotes}
                      onChange={(e) => setProcessNotes(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Data Requirements</CardTitle>
                <CardDescription>
                  Review and confirm the data requirements needed to start the
                  process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Attribute</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Required</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataAttributes.map((attr, index) => (
                      <DraggableItem
                        key={attr.id}
                        id={attr.id}
                        index={index}
                        type={ItemType.DATA_ATTRIBUTE}
                      >
                        <TableRow>
                          <TableCell>{attr.attribute}</TableCell>
                          <TableCell>{attr.type}</TableCell>
                          <TableCell>
                            <Checkbox defaultChecked={attr.required} />
                          </TableCell>
                          <TableCell>{attr.description}</TableCell>
                        </TableRow>
                      </DraggableItem>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>RACI Matrix (Start)</CardTitle>
                <CardDescription>
                  Define the RACI matrix for starting the business process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label htmlFor="responsible-role">Responsible</Label>
                    <Select
                      value={responsibleRole}
                      onValueChange={(value) => setResponsibleRole(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select responsible role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="accountable-role">Accountable</Label>
                    <Select
                      value={accountableRole}
                      onValueChange={(value) => setAccountableRole(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accountable role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label htmlFor="consulted-roles">Consulted</Label>
                    <div className="grid gap-2">
                      {consultedRoles.map((role, index) => (
                        <DraggableItem
                          key={index}
                          id={index}
                          index={index}
                          type={ItemType.CONSULTED_ROLE}
                        >
                          <div className="flex items-center justify-between">
                            <Input
                              id="consulted-roles"
                              type="text"
                              placeholder="Enter consulted role"
                              value={role}
                              onChange={(e) =>
                                handleConsultedRolesChange(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                index === consultedRoles.length - 1
                                  ? addConsultedRole()
                                  : removeConsultedRole()
                              }
                            >
                              <VariableIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="informed-roles">Informed</Label>
                    <div className="grid gap-2">
                      {informedRoles.map((role, index) => (
                        <DraggableItem
                          key={index}
                          id={index}
                          index={index}
                          type={ItemType.INFORMED_ROLE}
                        >
                          <div className="flex items-center justify-between">
                            <Input
                              id="informed-roles"
                              type="text"
                              placeholder="Enter informed role"
                              value={role}
                              onChange={(e) =>
                                handleInformedRolesChange(index, e.target.value)
                              }
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                index === informedRoles.length - 1
                                  ? addInformedRole()
                                  : removeInformedRole()
                              }
                            >
                              <VariableIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>RACI Matrix (Complete)</CardTitle>
                <CardDescription>
                  Define the RACI matrix for completing the business process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label htmlFor="responsible-role-complete">
                      Responsible
                    </Label>
                    <Select
                      value={responsibleRoleComplete}
                      onValueChange={(value) =>
                        setResponsibleRoleComplete(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select responsible role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="accountable-role-complete">
                      Accountable
                    </Label>
                    <Select
                      value={accountableRoleComplete}
                      onValueChange={(value) =>
                        setAccountableRoleComplete(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accountable role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="col-span-1">
                    <Label htmlFor="consulted-roles-complete">Consulted</Label>
                    <div className="grid gap-2">
                      {consultedRolesComplete.map((role, index) => (
                        <DraggableItem
                          key={index}
                          id={index}
                          index={index}
                          type={ItemType.CONSULTED_ROLE}
                        >
                          <div className="flex items-center justify-between">
                            <Input
                              id="consulted-roles-complete"
                              type="text"
                              placeholder="Enter consulted role"
                              value={role}
                              onChange={(e) =>
                                handleConsultedRolesCompleteChange(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                index === consultedRolesComplete.length - 1
                                  ? addConsultedRoleComplete()
                                  : removeConsultedRoleComplete()
                              }
                            >
                              <FileMinus2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <Label htmlFor="informed-roles-complete">Informed</Label>
                    <div className="grid gap-2">
                      {informedRolesComplete.map((role, index) => (
                        <DraggableItem
                          key={index}
                          id={index}
                          index={index}
                          type={ItemType.INFORMED_ROLE}
                        >
                          <div className="flex items-center justify-between">
                            <Input
                              id="informed-roles-complete"
                              type="text"
                              placeholder="Enter informed role"
                              value={role}
                              onChange={(e) =>
                                handleInformedRolesCompleteChange(
                                  index,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                index === informedRolesComplete.length - 1
                                  ? addInformedRoleComplete()
                                  : removeInformedRoleComplete()
                              }
                            >
                              <VariableIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </DraggableItem>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>
                  Define the next steps for the business process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <Checkbox defaultChecked />
                      <div>
                        <h4 className="text-lg font-medium">
                          Repeat this activity
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Repeat the current business process.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <div>
                        <h4 className="text-lg font-medium">
                          Repeat previous activity
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

function FileMinus2Icon(props: any) {
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
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M3 15h6" />
    </svg>
  );
}

function PlusIcon(props: any) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function VariableIcon(props: any) {
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
      <line x1="15" x2="9" y1="9" y2="15" />
      <line x1="9" x2="15" y1="9" y2="15" />
    </svg>
  );
}
