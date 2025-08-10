import { TableCell, TableRow } from "@/components/ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";

interface DraggableRowProps {
  row: Row<any>
};

export default function DraggableRow ({ row }: DraggableRowProps) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: row.original.id
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => {
	if (cell.column.id === "drag-handle") {
	  return <TableCell key={cell.id}>
	  <Button
	    variant="ghost"
	    type="button"
	    {...attributes}
	    {...listeners} >
	    <GripVertical className="size-4"/>
	  </Button>
	  </TableCell>
	}

	return (
	  <TableCell key={cell.id}>
	    {cell.getIsPlaceholder()
	      ? null
	      : flexRender(
		cell.column.columnDef.cell,
		cell.getContext()
	      )}
	  </TableCell>
	);
      })}
    </TableRow>
  )
}

