"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Pencil,
  Eraser,
  Trash2,
  Check,
  CirclePlus,
  Ban,
  CircleDashed,
  LoaderCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { CHANGE_COURSE_HEADER } from "@/constants/DialogConstants";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export type Assessment = {
  id: string;
  name: string;
  dropped: boolean;
  optional: boolean;
  weight: number;
  symbol: string | null;
  grade: number | null;
  date: Date | undefined;
  default_date: Date | undefined;
  modified_date: Date | undefined;
  status: string | undefined;
};

interface ColumnProps {
  formula: boolean;
  editingState: Record<string, boolean>;
  inputState: Record<string, string>;
  toggleEditing: (id: string, value: string, oldValue: string) => void;
  handleGradeChange: (e: string, id: string) => void;
  editTimeRef: React.RefObject<HTMLInputElement | null>;
  upsertDate: (id: string, value: Date | undefined) => void;
  deleteDate: (id: string) => void;
  deleteGrade: (id: string) => void;
  upsertStatus: (id: string, value: string | undefined) => void;
  deleteStatus: (id: string) => void;
}

export const columns = ({
  editingState,
  handleGradeChange,
  inputState,
  toggleEditing,
  editTimeRef,
  upsertDate,
  deleteDate,
  deleteGrade,
  upsertStatus,
  deleteStatus,
}: ColumnProps): ColumnDef<Assessment>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("name")}
          {row.original.dropped && (
            <Badge variant="secondary" className="ml-2">
              Dropped
            </Badge>
          )}
          {row.original.optional && (
            <Badge variant="outline" className="ml-2">
              Optional
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "weight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Weighting" />
    ),
    cell: ({ row }) => {
      console.log(row.original.symbol);
      return (
        <div className="flex flex-row gap-2 items-center">
          {row.getValue("weight")}
          {row.original.symbol && (
            <Button size="icon" variant="outline" className="p-0 size-5">
              {row.original.symbol}
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
    cell: ({ row }) => {
      const [input, setInput] = useState<string>(row.getValue("grade") ?? "");
      return (
        <div className="flex w-min max-w-sm justify-center items-center gap-2">
          <Input
            type="number"
            onChange={(e) => setInput(e.target.value)}
            disabled={!editingState[row.original.id as string] as boolean}
            value={input}
            className="min-w-24"
            placeholder="Grade"
          />
          <Button
            size="icon"
            className="size-8 px-5"
            onClick={() => {
              toggleEditing(row.original.id, input, row.getValue("grade"));
            }}
            variant="secondary"
          >
            {editingState[row.original.id] ? <Check /> : <Pencil />}
          </Button>
          <Button
            size="icon"
            className="size-8 px-5"
            onClick={() => deleteGrade(row.original.id)}
            variant="secondary"
          >
            <Eraser />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Due Date" />
    ),
    cell: ({ row }) => {
      const [editDate, setEditDate] = useState<Date | undefined>(undefined);
      const date = row.original.date;
      const now = new Date(Date.now());
      const datePassed = now > date! && date;
      const editDatePassed = now > editDate! && editDate;

      return (
        <div className="flex flex-row gap-2 items-center">
          <Dialog>
            <DialogContent>
              <CHANGE_COURSE_HEADER />
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-2">
                <Calendar
                  mode="single"
                  selected={editDate}
                  onSelect={(selectedDate) => setEditDate(selectedDate)}
                  captionLayout="dropdown"
                />
                <div className="flex flex-col items-center gap-y-2">
                  <Input
                    ref={editTimeRef}
                    type="time"
                    defaultValue={
                      editDate ? format(editDate, "HH:mm") : "23:59"
                    }
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <Button
                    variant={"secondary"}
                    className={
                      "font-normal" + (!editDatePassed ? "" : " opacity-50")
                    }
                  >
                    <CalendarIcon />
                    {editDate ? format(editDate, "MMM dd yyyy") : "Select Date"}
                  </Button>
                </div>
              </div>
              <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-min">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditDate(undefined);
                    }}
                    className="w-full sm:w-min text-destructive hover:text-destructive hover:bg-destructive/20 "
                  >
                    Clear
                  </Button>
                  <Button
                    onClick={() => {
                      console.log(
                        "INPUT",
                        editTimeRef,
                        editTimeRef?.current,
                        editTimeRef?.current?.value,
                      );
                      if (
                        editTimeRef.current &&
                        editTimeRef.current.value.includes(":")
                      ) {
                        const base = editDate ? new Date(editDate) : new Date();
                        const updated = new Date(base);
                        const [hour, minute] = editTimeRef?.current?.value
                          .split(":")
                          .map((item) => Number.parseInt(item));
                        updated.setHours(hour, minute);
                        setEditDate(updated);
                        upsertDate(row.original.id, updated);
                      }
                    }}
                    className="w-full sm:w-min"
                  >
                    Confirm
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
            <DialogTrigger asChild>
              {date ? (
                <Button
                  variant="secondary"
                  className={"font-normal" + (!datePassed ? "" : " opacity-50")}
                  onClick={() => {
                    setEditDate(date);
                  }}
                  //disabled={now > date && row.original.due_date}
                >
                  <CalendarIcon />
                  {format(date, "MMM dd yyyy h:mm a")}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className={
                    "font-normal text-white/50" +
                    (!datePassed ? "" : " opacity-50")
                  }
                  onClick={() => {
                    setEditDate(date);
                  }}
                  //disabled={now > date && row.original.due_date}
                >
                  {/*<CalendarIcon />*/}
                  <CirclePlus />
                  {"Select Date"}
                </Button>
              )}
            </DialogTrigger>
            {!!row.original.modified_date && (
              <Button
                size="icon"
                className="size-8 px-5"
                onClick={() => deleteDate(row.original.id)}
                variant="secondary"
              >
                <Trash2 />
              </Button>
            )}
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const [status, setStatus] = useState<string | undefined>(
        row.original.status,
      );

      const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        upsertStatus(row.original.id, newStatus);
      };

      if (!status) {
        return (
          <div className="text-white/50">
            <Button
              onClick={() => {
                upsertStatus(row.original.id, undefined);
              }}
              variant="ghost"
              className="font-normal"
            >
              <CirclePlus /> Track Status
            </Button>
          </div>
        );
      }

      const statusIcons: Record<string, React.ReactNode> = {
        "Not Started": <CircleDashed className="size-4" />,
        "In Progress": <LoaderCircle className="size-4" />,
        Submitted: <Check className="size-4" />,
        Cancelled: <Ban className="size-4" />,
      };

      return (
        <div className="flex flex-row gap-2 items-center font-normal">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-normal">
                {" "}
                {statusIcons[status]} {status}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup
                value={status}
                onValueChange={handleStatusChange}
              >
                <DropdownMenuRadioItem value="Not Started">
                  <CircleDashed /> Not Started
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="In Progress">
                  <LoaderCircle /> In Progress
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Submitted">
                  <Check /> Submitted
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Cancelled">
                  <Ban /> Cancelled
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {!!status && (
            <Button
              size="icon"
              className="size-8 px-5"
              onClick={() => deleteStatus(row.original.id)}
              variant="secondary"
            >
              <Trash2 />
            </Button>
          )}
        </div>
      );
    },
  },
];
