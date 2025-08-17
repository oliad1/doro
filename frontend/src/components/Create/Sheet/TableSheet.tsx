import { z } from "zod";
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash } from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import type { Table as TableType } from "@tanstack/react-table";
import { Table, TableHeader, TableHead, TableRow, TableBody } from "@/components/ui/table";
import { DndContext, closestCenter, type UniqueIdentifier, SensorOptions, SensorDescriptor } from "@dnd-kit/core";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableRow from "@/components/Create/Draggable/DraggableRow";
import { renderFormField } from "@/utils/helpers";

interface TableSheetProps {
  rowIds: UniqueIdentifier[],
  title: string,
  sheetTitle: string,
  description: string,
  table: TableType<any>,
  clearRows: () => void,
  handleDragEnd: any,
  form: any,
  onSubmitClose: any,
  editing: boolean,
  sensors: SensorDescriptor<SensorOptions>[],
  open: boolean,
  setOpen: any,
  schema: any,
  dropdownValues?: any[]
};

export default function TableSheet ({ schema, open, setOpen, editing, rowIds, title, sheetTitle, description, table, form, clearRows, onSubmitClose, sensors, handleDragEnd, dropdownValues}: TableSheetProps) {
  return (
    <div>
      <DndContext
	collisionDetection={closestCenter}
	modifiers={[restrictToVerticalAxis, restrictToParentElement]}
	onDragEnd={handleDragEnd}
	sensors={sensors}
      >
	<h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-4">{title}</h2>
	<div className="overflow-hidden rounded-md border">
	  <Table id="table">
	    <TableHeader>
	      {table.getHeaderGroups().map((headerGroup) => (
		<TableRow key={headerGroup.id}>
		  {headerGroup.headers.map((header) => (
		    <TableHead key={header.id}>
		      {header.isPlaceholder
			? null
			: flexRender(
			  header.column.columnDef.header, 
			  header.getContext()
			)}
		    </TableHead>
		  ))}
		</TableRow>
	      ))}
	    </TableHeader>
	    <TableBody>
	      <SortableContext
		items={rowIds}
		strategy={verticalListSortingStrategy}
	      >
		{table.getRowModel().rows.map((row) => (
		  <DraggableRow key={row.id} row={row} />
		))}
	      </SortableContext>
	    </TableBody>
	  </Table>
	</div>
	<Sheet open={open} onOpenChange={setOpen}>
	  <div className="flex justify-between">
	    <SheetTrigger asChild>
	      <Button variant="outline" size="sm" className="mt-4" >
		<Plus />
		Add Row
	      </Button>
	    </SheetTrigger>
	    <Button variant="destructive" size="sm" className="mt-4" onClick={clearRows} >
	      <Trash />
	      Clear Table
	    </Button>
	  </div>
	  <Form {...form}>
	    <SheetContent>
	      <form onSubmit={form.handleSubmit(onSubmitClose)} className="space-y-3 flex flex-col h-full" >
		<SheetHeader>
		  <SheetTitle>{sheetTitle}</SheetTitle>
		  <SheetDescription>{description}</SheetDescription>
		</SheetHeader>
		<ScrollArea>
		  <div className="grid flex-1 auto-rows-min gap-6 px-4">
		    {table.getHeaderGroups().map((headerGroup) => (
		      <div key={headerGroup.id} className="grid gap-3">
			{headerGroup.headers
			  .filter((header) => header.column.columnDef.meta?.inputType)
			  .map((header) => (
			    <FormField
			      key={header.id}
			      control={form.control}
			      name={header.column.columnDef.accessorKey as keyof z.infer<typeof schema>}
			      render={({ field }) => (
				<FormItem>
				  <FormLabel htmlFor={header.column.columnDef.id}>
				    {flexRender(
				      header.column.columnDef.header,
				      header.getContext()
				    )}
				  </FormLabel>
				  <FormControl>{renderFormField(field, header.column.columnDef.meta?.inputType, dropdownValues)}</FormControl>
				  <FormMessage />
				</FormItem>
			      )}
			    />
			  ))}
		      </div>
		    ))}
		  </div>
		</ScrollArea>
		<SheetFooter>
		  <Button type="submit">{editing ? "Save" : "Add"}</Button>
		  <SheetClose asChild>
		    <Button variant="outline">Close</Button>
		  </SheetClose>
		</SheetFooter>
	      </form>
	    </SheetContent>
	  </Form>
	</Sheet>
      </DndContext>
    </div>
  );
}
