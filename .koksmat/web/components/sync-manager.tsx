"use client";

import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  MoreHorizontal,
  Edit,
  Eye,
  History,
  Save,
  Play,
  CheckSquare,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { SqlQueryEditor } from "./sql-query-editor";
import EditableText from "./editable-text";
import { Toggle } from "@/components/ui/toggle";
import { Maximize2, Minimize2 } from "lucide-react";
import ActionPopover from "./action-popover";
import ActionDialog from "./action-dialog";
interface Statement {
  id: string;
  name: string;
  source: string;
}

// Mock data for statements
const initialStatements: Statement[] = [
  { id: "1", name: "Statement 1", source: "SELECT * FROM source_table1" },
  { id: "2", name: "Statement 2", source: "SELECT * FROM source_table2" },
  { id: "3", name: "Statement 3", source: "SELECT * FROM source_table3" },
];

interface HistoryState {
  past: Statement[][];
  present: Statement[];
  future: Statement[][];
}

const initialHistory: HistoryState = {
  past: [],
  present: initialStatements,
  future: [],
};

export default function SyncManagerPage(props: {
  database: string;
  table: string;
}) {
  const { database, table } = props;
  const [history, setHistory] = useState<HistoryState>(initialHistory);
  const { past, present: statements, future } = history;
  const [selectedStatements, setSelectedStatements] = useState<string[]>([]);

  const setStatements = useCallback(
    (newStatements: Statement[]) => {
      setHistory({
        past: [...past, statements],
        present: newStatements,
        future: [],
      });
    },
    [statements, past]
  );

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setHistory({
      past: newPast,
      present: previous,
      future: [statements, ...future],
    });
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setHistory({
      past: [...past, statements],
      present: next,
      future: newFuture,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(statements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setStatements(items);
  };

  const updateSource = (id: string, newSource: string) => {
    const updatedStatements = statements.map((statement) =>
      statement.id === id ? { ...statement, source: newSource } : statement
    );
    setStatements(updatedStatements);
  };

  const toggleSelection = (id: string) => {
    setSelectedStatements((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedStatements.length === statements.length) {
      setSelectedStatements([]);
    } else {
      setSelectedStatements(statements.map((s) => s.id));
    }
  };

  const addNewStatement = () => {
    const newId = (
      parseInt(statements[statements.length - 1].id) + 1
    ).toString();
    setStatements([
      ...statements,
      {
        id: newId,
        name: `Statement ${newId}`,
        source: "SELECT * FROM new_table",
      },
    ]);
  };

  const removeSelectedStatements = () => {
    setStatements(statements.filter((s) => !selectedStatements.includes(s.id)));
    setSelectedStatements([]);
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sync Manager</h1>

      {/* Toolbar */}
      <div className="flex space-x-2 mb-4">
        <Button variant="outline" onClick={undo} disabled={past.length === 0}>
          Undo
        </Button>
        <Button variant="outline" onClick={redo} disabled={future.length === 0}>
          Redo
        </Button>
        <ActionDialog title="Edit Source">
          <div className="h-[50vh] w-[60vw]">
            <SqlQueryEditor
              database={database}
              sql={""}
              name={table}
              onChange={(newSQL) => {

                throw new Error("Function not implemented.");
              }}

            />
          </div>
        </ActionDialog>

        <ActionPopover title="Preview Source">
          <div className="bg-muted p-2 rounded">Source preview content</div>
        </ActionPopover>

        <ActionPopover title="Preview Target">
          <div className="bg-muted p-2 rounded">Target preview content</div>
        </ActionPopover>

        <ActionPopover title="View History">
          <ul className="list-disc pl-4">
            <li>Change 1 - 2023-06-01</li>
            <li>Change 2 - 2023-06-02</li>
          </ul>
        </ActionPopover>

        <Button variant="outline" onClick={() => console.log("Save")}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button variant="outline" onClick={() => console.log("Execute Sync")}>
          <Play className="w-4 h-4 mr-2" />
          Execute Sync
        </Button>

        <Button variant="outline" onClick={toggleAllSelection}>
          <CheckSquare className="w-4 h-4 mr-2" />
          {selectedStatements.length === statements.length
            ? "Deselect All"
            : "Select All"}
        </Button>
        {/* Other action buttons */}
        <Button variant="outline" onClick={addNewStatement}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button
          variant="outline"
          onClick={removeSelectedStatements}
          disabled={selectedStatements.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove
        </Button>
      </div>

      {/* Statements List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="statements">
          {(provided) => (
            <Table {...provided.droppableProps} ref={provided.innerRef}>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead className="w-[50px]">Reorder</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statements.map((statement, index) => (
                  <Draggable
                    key={statement.id}
                    draggableId={statement.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={snapshot.isDragging ? "bg-muted" : ""}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedStatements.includes(statement.id)}
                            onCheckedChange={() =>
                              toggleSelection(statement.id)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move"
                          >
                            <GripVertical className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>{statement.name}</TableCell>
                        <TableCell>
                          <EditableText
                            initialText={statement.source}
                            onSave={async (text: string) => {
                              updateSource(statement.id, text);
                              return true;
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button variant="ghost">
                                      View Details
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent>
                                    <SheetHeader>
                                      <SheetTitle>{statement.name}</SheetTitle>
                                      <SheetDescription>
                                        {statement.source}
                                      </SheetDescription>
                                    </SheetHeader>
                                  </SheetContent>
                                </Sheet>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
