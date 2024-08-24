"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { XYCoord } from "dnd-core";
import WorkflowSectionEditor from "../workflow-section-add";
import { Sheet, SheetContent, SheetHeader } from "../ui/sheet";
import { SaveIcon } from "lucide-react";
import { EditTitleDescription } from "../edit-title-description";

export interface Section {
  id: string;
  title: string;
  content: string;
  collapsed: boolean;
  columns: Column[];
}

interface Column {
  id: string;
  items: ActivityIcon[];
}

export interface ActivityIcon {
  id: string;
  type: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
  columnId?: string;
  sectionId?: string;
}

interface CollectedProps {
  handlerId: string | symbol | null;
}

export interface WorkflowMetadata {
  title: string;
  description: string;
}

export interface EditorCanvasProps {
  handleSave: (
    sections: Section[],
    metadata: WorkflowMetadata
  ) => () => Promise<void>;
  handleAddSection: () => Promise<Section>;
  activityIcons: ActivityIcon[];
  initialSections: Section[];
  metadata: WorkflowMetadata;
}
export default function EditorCanvas(props: EditorCanvasProps) {
  const [metadata, setmetadata] = useState<WorkflowMetadata>(props.metadata);

  const [sections, setSections] = useState<Section[]>(props.initialSections);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isDetailsPanel, setIsDetailsPanel] = useState(false);

  const [isAddingSection, setisAddingSection] = useState(false);

  const handleSectionCollapse = (id: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id
          ? { ...section, collapsed: !section.collapsed }
          : section
      )
    );
  };

  const handleSectionSelect = (id: string) => {
    if (isSelectionMode) {
      setSelectedSections((prevSelectedSections) => {
        if (prevSelectedSections.includes(id)) {
          return prevSelectedSections.filter((sectionId) => sectionId !== id);
        } else {
          return [...prevSelectedSections, id];
        }
      });
    }
  };

  const handleAddSection = async () => {
    const newSection = await props
      .handleAddSection()
      .catch((e) => console.error(e));
    if (!newSection) return; // error occurred most likely

    setSections((prevSections) => [...prevSections, newSection]);
  };

  const handleToggleSelectionMode = () => {
    setIsSelectionMode((prevMode) => !prevMode);
    setSelectedSections([]);
  };

  const handleToggleDetailsPanel = () => {
    setIsDetailsPanel((prevState) => !prevState);
  };

  const moveSection = useCallback((dragIndex: number, hoverIndex: number) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const [draggedSection] = updatedSections.splice(dragIndex, 1);
      updatedSections.splice(hoverIndex, 0, draggedSection);
      return updatedSections;
    });
  }, []);

  const addActivityIconToColumn = (
    columnId: string,
    sectionId: string,
    icon: ActivityIcon
  ) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            columns: section.columns.map((column) =>
              column.id === columnId
                ? { ...column, items: [...column.items, icon] }
                : column
            ),
          };
        }
        return section;
      })
    );
  };

  const moveActivityIcon = (
    dragItem: DragItem,
    hoverColumnId: string,
    hoverSectionId: string
  ) => {
    setSections((prevSections) => {
      const updatedSections = [...prevSections];
      const sourceSectionIndex = updatedSections.findIndex(
        (section) => section.id === dragItem.sectionId
      );
      const sourceColumnIndex = updatedSections[
        sourceSectionIndex
      ].columns.findIndex((column) => column.id === dragItem.columnId);
      const [movedItem] = updatedSections[sourceSectionIndex].columns[
        sourceColumnIndex
      ].items.splice(dragItem.index, 1);
      const targetSectionIndex = updatedSections.findIndex(
        (section) => section.id === hoverSectionId
      );
      const targetColumnIndex = updatedSections[
        targetSectionIndex
      ].columns.findIndex((column) => column.id === hoverColumnId);
      updatedSections[targetSectionIndex].columns[targetColumnIndex].items.push(
        movedItem
      );
      return updatedSections;
    });
  };

  const renderSection = (section: Section, index: number) => {
    return (
      <DraggableSection
        key={section.id}
        index={index}
        section={section}
        moveSection={moveSection}
        handleSectionCollapse={handleSectionCollapse}
        handleSectionSelect={handleSectionSelect}
        isSelectionMode={isSelectionMode}
        selectedSections={selectedSections}
        addActivityIconToColumn={addActivityIconToColumn}
        moveActivityIcon={moveActivityIcon}
      />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen w-full">
        <div className="w-40 bg-muted p-4">
          <h2 className="text-xl font-bold mb-4">Activity Icons</h2>
          <ActivityPanel activityIcons={props.activityIcons} />
        </div>
        <div className="flex-1 bg-background p-6">
          <div className="flex items-center space-x-3 mb-4">
            <h1 className="text-2xl font-bold">Manage Sections</h1>
            <div className="flex items-center gap-2">
              <Button onClick={() => props.handleSave(sections, metadata)}>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save
              </Button>

              <EditTitleDescription
                title={metadata.title}
                description={metadata.description}
                onSave={function (title: string, description: string): void {
                  setmetadata({ title, description });
                }}
                onCancel={function (): void {}}
              />
              <Button onClick={handleAddSection} variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Section
              </Button>
              <Button
                variant={isSelectionMode ? "default" : "outline"}
                onClick={handleToggleSelectionMode}
              >
                <BoxSelectIcon className="w-4 h-4 mr-2" />
                {isSelectionMode ? "Done" : "Select"}
              </Button>
              <Button onClick={handleToggleDetailsPanel} variant="outline">
                <InfoIcon className="w-4 h-4 mr-2" />
                Details
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            {sections.map((section, index) => renderSection(section, index))}
          </div>
        </div>
        {isDetailsPanel && (
          <div className="w-80 bg-muted p-6">
            <h2 className="text-xl font-bold mb-4">Section Details</h2>
            {selectedSections.length === 1 ? (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {sections.find((s) => s.id === selectedSections[0])?.title}
                </h3>
                <p className="mb-4">
                  {sections.find((s) => s.id === selectedSections[0])?.content}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            ) : (
              <p>Select a section to view its details.</p>
            )}
          </div>
        )}
        {isAddingSection && (
          <Sheet open={isAddingSection} onOpenChange={setisAddingSection}>
            <SheetHeader></SheetHeader>
            <SheetContent className="w-[90vw] max-w-[90vw] min-w-[90vw] h-[100vh] overflow-scroll">
              <WorkflowSectionEditor />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </DndProvider>
  );
}

interface DraggableSectionProps {
  index: number;
  section: Section;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  handleSectionCollapse: (id: string) => void;
  handleSectionSelect: (id: string) => void;
  isSelectionMode: boolean;
  selectedSections: string[];
  addActivityIconToColumn: (
    columnId: string,
    sectionId: string,
    icon: ActivityIcon
  ) => void;
  moveActivityIcon: (
    dragItem: DragItem,
    hoverColumnId: string,
    hoverSectionId: string
  ) => void;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  index,
  section,
  moveSection,
  handleSectionCollapse,
  handleSectionSelect,
  isSelectionMode,
  selectedSections,
  addActivityIconToColumn,
  moveActivityIcon,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, CollectedProps>({
    accept: "SECTION",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(item: DragItem, monitor) {
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
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveSection(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "SECTION",
    item: () => {
      return { id: section.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
      className={`border rounded-lg ${selectedSections.includes(section.id) ? "border-primary" : "border-border"}`}
      onMouseDown={(e) => handleSectionSelect(section.id)}
    >
      <Collapsible>
        {" "}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`cursor-move ${isSelectionMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
            >
              <Checkbox
                checked={selectedSections.includes(section.id)}
                disabled={!isSelectionMode}
              />
            </div>
            <CollapsibleTrigger asChild>
              <h3
                onClick={() => handleSectionCollapse(section.id)}
                className="text-lg font-semibold"
              >
                {section.title}
              </h3>
            </CollapsibleTrigger>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSectionCollapse(section.id)}
            >
              <ChevronDownIcon className="w-5 h-5" />
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="px-4 py-3">
          <div className="grid grid-cols-4 gap-2">
            {section.columns.map((column, index) => (
              <Column
                number={index}
                key={column.id}
                column={column}
                sectionId={section.id}
                addActivityIconToColumn={addActivityIconToColumn}
                moveActivityIcon={moveActivityIcon}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

interface ColumnProps {
  number: number;
  column: Column;
  sectionId: string;
  addActivityIconToColumn: (
    columnId: string,
    sectionId: string,
    icon: ActivityIcon
  ) => void;
  moveActivityIcon: (
    dragItem: DragItem,
    hoverColumnId: string,
    hoverSectionId: string
  ) => void;
}

const Column: React.FC<ColumnProps> = ({
  number,
  column,
  sectionId,
  addActivityIconToColumn,
  moveActivityIcon,
}) => {
  const [, drop] = useDrop({
    accept: ["ACTIVITY_ICON", "COLUMN_ITEM"],
    drop: (item: DragItem) => {
      if (item.type === "ACTIVITY_ICON") {
        addActivityIconToColumn(column.id, sectionId, {
          id: item.id,
          type: item.type,
        });
      } else if (item.type === "COLUMN_ITEM") {
        moveActivityIcon(item, column.id, sectionId);
      }
    },
  });
  let columnHeading = "";
  switch (number) {
    case 0:
      columnHeading = "Register";
      break;
    case 1:
      columnHeading = "Start";
      break;
    case 2:
      columnHeading = "Complete";
      break;
    case 3:
      columnHeading = "Decide";
      break;
  }

  return (
    <div>
      {columnHeading}
      <div ref={drop as any} className="border p-2 min-h-[100px]">
        {column.items
          .filter((item) => item !== undefined && item !== null)
          .map((item, index) => (
            <ActivityIcon
              key={item.id}
              item={item}
              index={index}
              columnId={column.id}
              sectionId={sectionId}
            />
          ))}
      </div>
    </div>
  );
};

interface ActivityIconProps {
  item: ActivityIcon;
  index: number;
  columnId: string;
  sectionId: string;
}

const ActivityIcon: React.FC<ActivityIconProps> = ({
  item,
  index,
  columnId,
  sectionId,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, CollectedProps>({
    accept: "COLUMN_ITEM",
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(draggedItem: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      draggedItem.index = hoverIndex;
      draggedItem.columnId = columnId;
      draggedItem.sectionId = sectionId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN_ITEM",
    item: () => {
      return { id: item.id, index, columnId, sectionId, type: "COLUMN_ITEM" };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0 : 1 }}
      data-handler-id={handlerId}
      className={`p-2 border mb-2 ${isDragging ? "bg-gray-400" : "bg-gray-200"} cursor-move`}
    >
      {item.type}
      {/* <pre>{JSON.stringify(item)}</pre> */}
    </div>
  );
};

function ActivityPanel(props: { activityIcons: ActivityIcon[] }) {
  const { activityIcons } = props;

  return (
    <div className="grid gap-2">
      {activityIcons.map((icon) => (
        <DraggableActivityIcon key={icon.id} icon={icon} />
      ))}
    </div>
  );
}

interface DraggableActivityIconProps {
  icon: ActivityIcon;
}

const DraggableActivityIcon: React.FC<DraggableActivityIconProps> = ({
  icon,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ACTIVITY_ICON",
    item: { id: icon.id, type: "ACTIVITY_ICON" },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`p-2 border ${isDragging ? "bg-gray-400" : "bg-gray-200"} cursor-move`}
    >
      {icon.type}
    </div>
  );
};

function BoxSelectIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M9 3h1" />
      <path d="M9 21h1" />
      <path d="M14 3h1" />
      <path d="M14 21h1" />
      <path d="M3 9v1" />
      <path d="M21 9v1" />
      <path d="M3 14v1" />
      <path d="M21 14v1" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ChevronUpIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

function DrumIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m2 2 8 8" />
      <path d="m22 2-8 8" />
      <ellipse cx="12" cy="9" rx="10" ry="5" />
      <path d="M7 13.4v7.9" />
      <path d="M12 14v8" />
      <path d="M17 13.4v7.9" />
      <path d="M2 9v8a10 5 0 0 0 20 0V9" />
    </svg>
  );
}

function InfoIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
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

function TextSelectIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M5 3a2 2 0 0 0-2 2" />
      <path d="M19 3a2 2 0 0 1 2 2" />
      <path d="M21 19a2 2 0 0 1-2 2" />
      <path d="M5 21a2 2 0 0 1-2-2" />
      <path d="M9 3h1" />
      <path d="M9 21h1" />
      <path d="M14 3h1" />
      <path d="M14 21h1" />
      <path d="M3 9v1" />
      <path d="M21 9v1" />
      <path d="M3 14v1" />
      <path d="M21 14v1" />
      <line x1="7" x2="15" y1="8" y2="8" />
      <line x1="7" x2="17" y1="12" y2="12" />
      <line x1="7" x2="13" y1="16" y2="16" />
    </svg>
  );
}
