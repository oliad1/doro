import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {  Pencil, Trash, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AssessmentGroup } from "@/types/TableTypes";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";

/* Columns */
interface TableColProps {
  onEdit: (row: any) => void,
  onDelete: (id: string) => void,
  isGeneral?: boolean
}

export const assessmentGroupsCols = ({
  onEdit,
  onDelete,
  isGeneral
}: TableColProps): ColumnDef<AssessmentGroup>[] => [
    {
      id: 'drag-handle',
      header: "",
    },
    {
      accessorKey: 'name',
      cell: info => info.getValue(),
      header: "Name",
      meta: { inputType: "text" }
    },
    {
      accessorKey: 'weight',
      cell: info => info.getValue(),
      header: "Weight",
      meta: { inputType: "number" }
    },
    {
      accessorKey: 'count',
      cell: info => info.getValue(),
      header: "Count",
      meta: { inputType: "number" }
    },
    {
      accessorKey: 'drop',
      cell: info => info.getValue(),
      header: "Drop",
      meta: { inputType: "number" }
    },
    {
      accessorKey: 'optional',
      cell: info => (
	<Checkbox
	  checked={info.getValue() as boolean}
	/>
      ),
      header: "Optional",
      meta: { inputType: "boolean" }
    },
    ...(!isGeneral)
    ? [{
      accessorKey: 'conditionGroup',
      cell: info => (
	<Button
	  variant="outline"
	  id="date-picker"
	  className="justify-between font-normal"
	>
	  {info.getValue() ? info.getValue() as string : "Select Condition" }
	</Button>
      ),
      header: "Condition",
      meta: { inputType: "dropdown" }
    }] : [],
    {
      id: "actions",
      cell: ({ row }) => {
	const assessment = row.original;

	return <div className="flex justify-end">
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild>
	      <Button variant="ghost" className="h-8 w-8 p-0">
		<span className="sr-only">Open menu</span>
		<MoreHorizontal />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent align="end">
	      <DropdownMenuItem
		onClick={()=>onEdit(assessment)}
	      >
		<Pencil />
		Edit
	      </DropdownMenuItem>
	      <DropdownMenuItem variant="destructive"
		onClick={()=>onDelete(assessment.id)}
	      >
		<Trash />
		Delete
	      </DropdownMenuItem>
	    </DropdownMenuContent>
	  </DropdownMenu>
	</div>
      },
    },
  ];

export const conditionGroupCols = ({
  onEdit,
  onDelete
}: TableColProps): ColumnDef<AssessmentGroup>[] => [
    {
      id: 'drag-handle',
      header: "",
    },
    {
      accessorKey: 'symbol',
      cell: info => info.getValue(),
      header: "Symbol",
      meta: { inputType: "text" }
    },
    {
      id: "actions",
      cell: ({ row }) => {
	const assessment = row.original;

	return <div className="flex justify-end">
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild>
	      <Button variant="ghost" className="h-8 w-8 p-0">
		<span className="sr-only">Open menu</span>
		<MoreHorizontal />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent align="end">
	      <DropdownMenuItem
		onClick={()=>onEdit(assessment)}
	      >
		<Pencil />
		Edit
	      </DropdownMenuItem>
	      <DropdownMenuItem variant="destructive"
		onClick={()=>onDelete(assessment.id)}
	      >
		<Trash />
		Delete
	      </DropdownMenuItem>
	    </DropdownMenuContent>
	  </DropdownMenu>
	</div>
      },
    },
  ];


export const conditionsCols = ({
  onEdit,
  onDelete,
  isGeneral
}: TableColProps): ColumnDef<any>[] => [
    {
      id: 'drag-handle',
      header: "",
    },
    {
      accessorKey: 'lower',
      cell: info => info.getValue(),
      header: "Lower Bound",
      meta: { inputType: "number" }
    },
    ...(isGeneral)
      ? [
	{
	  id: 'scheme',
	  accessorFn: row => row.id,
	  cell: info => info.getValue(),
	  header: "Scheme",
	  meta: { inputType: "" }
	},
	{
	  accessorKey: 'group', 
	  cell: info => 
	    <Button
	      variant="outline"
	      id="date-picker"
	      className="justify-between font-normal"
	    >
	      {info.getValue() ? info.getValue() as string : "Select Group" }
	    </Button>,
	  header: "Group",
	  meta: { inputType: "dropdown" }
	}
      ]
      : [
	{
	  accessorKey: 'formula',
	  cell: info => info.getValue(),
	  header: "Formula",
	  meta: { inputType: "text" }
	},
	{
	  accessorKey: 'symbol', 
	  cell: info => 
	    <Button
	      variant="outline"
	      id="date-picker"
	      className="justify-between font-normal"
	    >
	      {info.getValue() ? info.getValue() as string : "Select Symbol" }
	    </Button>,
	  header: "Symbol",
	  meta: { inputType: "dropdown" }
	}
      ],
    {
      id: "actions",
      cell: ({ row }) => {
	const assessment = row.original;

	return <div className="flex justify-end">
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild>
	      <Button variant="ghost" className="h-8 w-8 p-0">
		<span className="sr-only">Open menu</span>
		<MoreHorizontal />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent align="end">
	      <DropdownMenuItem
		onClick={()=>onEdit(assessment)}
	      >
		<Pencil />
		Edit
	      </DropdownMenuItem>
	      <DropdownMenuItem variant="destructive"
		onClick={()=>onDelete(assessment.id)}
	      >
		<Trash />
		Delete
	      </DropdownMenuItem>
	    </DropdownMenuContent>
	  </DropdownMenu>
	</div>
      },
    },
  ];



export const assessmentsCols = ({
  onEdit,
  onDelete
}: TableColProps): ColumnDef<AssessmentGroup>[] => [
    {
      id: 'drag-handle',
      header: "",
    },
    {
      accessorKey: 'name',
      cell: info => info.getValue(),
      header: "Name",
      meta: { inputType: "text" }
    },
    {
      accessorKey: 'group',
      cell: info => (
	<Button
	  variant="outline"
	  id="date-picker"
	  className="justify-between font-normal"
	>
	  {info.getValue() ? info.getValue() as string : "Select Date" }
	</Button>
      ),
      header: "Group",
      meta: { inputType: "dropdown" }
    },
    {
      accessorKey: 'weight',
      cell: info => info.getValue(),
      header: "Weight",
      meta: { inputType: "number" }
    },
    {
      accessorKey: 'date',
      cell: info => (
	<Button
	  variant="outline"
	  id="date-picker"
	  className="justify-between font-normal"
	>
	  {info.getValue() ? format(info.getValue() as string, "PP") : "Select Date" }
	</Button>
      ),
      header: "Due Date",
      meta: { inputType: "date" }
    },
    {
      id: "actions",
      cell: ({ row }) => {
	const assessment = row.original;

	return <div className="flex justify-end">
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild>
	      <Button variant="ghost" className="h-8 w-8 p-0">
		<span className="sr-only">Open menu</span>
		<MoreHorizontal />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent align="end">
	      <DropdownMenuItem
		onClick={()=>onEdit(assessment)}
	      >
		<Pencil />
		Edit
	      </DropdownMenuItem>
	      <DropdownMenuItem variant="destructive"
		onClick={()=>onDelete(assessment.id)}
	      >
		<Trash />
		Delete
	      </DropdownMenuItem>
	    </DropdownMenuContent>
	  </DropdownMenu>
	</div>
      },
    },
  ];




export const personnelsCols = ({
  onEdit,
  onDelete
}: TableColProps): ColumnDef<AssessmentGroup>[] => [
    {
      id: 'drag-handle',
      header: "",
    },
    {
      accessorKey: 'name',
      cell: info => info.getValue(),
      header: "Name",
      meta: { inputType: "text" }
    },
    {
      accessorKey: 'email',
      cell: info => info.getValue(),
      header: "Email",
      meta: { inputType: "text" }
    },
    {
      accessorKey: 'role',
      cell: info => (
	<Button
	  variant="outline"
	  id="date-picker"
	  className="justify-between font-normal"
	>
	  {info.getValue() ? info.getValue() as string : "Select Role" }
	</Button>
      ),
      header: "Role",
      meta: { inputType: "dropdown" }
    },
    {
      id: "actions",
      cell: ({ row }) => {
	const assessment = row.original;

	return <div className="flex justify-end">
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild>
	      <Button variant="ghost" className="h-8 w-8 p-0">
		<span className="sr-only">Open menu</span>
		<MoreHorizontal />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent align="end">
	      <DropdownMenuItem
		onClick={()=>onEdit(assessment)}
	      >
		<Pencil />
		Edit
	      </DropdownMenuItem>
	      <DropdownMenuItem variant="destructive"
		onClick={()=>onDelete(assessment.id)}
	      >
		<Trash />
		Delete
	      </DropdownMenuItem>
	    </DropdownMenuContent>
	  </DropdownMenu>
	</div>
      },
    },
  ];

