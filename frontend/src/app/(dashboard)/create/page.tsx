"use client";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, Table } from "@tanstack/react-table";
import { useState, useMemo, useEffect, useRef, CSSProperties } from "react";
import { defineStepper } from "@stepperize/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { z, ZodObject } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DndContext, KeyboardSensor, MouseSensor, TouchSensor, SensorDescriptor, SensorOptions, closestCenter, type DragEndEvent, type UniqueIdentifier, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { assessmentGroupsSchema, assessmentsSchema, conditionGroupsSchema, conditionsSchema, personnelsSchema, generalInfoSchema } from "@/utils/schema/zodSchemas";
import { AssessmentGroup, Assessment } from "@/types/TableTypes";
import { type CourseType } from "@/types/Types";
import { assessmentGroupsCols, assessmentsCols, conditionGroupCols, conditionsCols, personnelsCols } from "@/constants/TableConstants";
import TableSheet from "@/components/Create/Sheet/TableSheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateCourseStore, CreateCourseStoreProvider } from "@/providers/create-course-store-provider";
import { CreateCourseState } from "@/stores/create-course-store";
import OutlinesAPIClient from "@/APIClients/OutlinesAPIClient";

const { Scoped, useStepper, steps, utils } = defineStepper(
  {
    id: "first",
    index: 0,
  },
  { 
    id: "second", 
    index: 1,
  },
  { 
    id: "third",
    index: 2,
  },
  { 
    id: "fourth",
    index: 3,
  },
  {
    id: "fifth",
    index: 4,
  },
);

export default function CreatePage () {
  const stepper = useStepper();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const table = (rows: any[], columns: ColumnDef<any, any>[]) => useReactTable({
    data: rows,
    columns: columns,
    initialState: {
      columnVisibility: {
	id: false
      },
      expanded: true
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: row => row.id,
  });

  const generalInfoForm = useForm({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    }
  });

  const { setGeneralInfo } = useCreateCourseStore(
    (state) => state,
  );

  return (
    <div className="p-5 h-screen flex flex-col justify-between">
      <Progress value={((stepper.current.index+1)/steps.length)*100} />
      <ScrollArea className="py-5">
	{stepper.switch({
	  first: () => <CourseType />,
	  second: () => <GeneralInfo form={generalInfoForm} />,
	  third: () => <Assessments sensors={sensors} table={table} />,
	  fourth: () => <Personnel sensors={sensors} table={table} />,
	  fifth: () => <SubmitForm />
	})}
      </ScrollArea>
      {!stepper.isLast
	? <div
	  className="flex justify-between"
	>
	  <Button
	    variant="secondary"
	    disabled={stepper.isFirst}
	    onClick={stepper.prev}
	  >
	    Prev
	  </Button>
	  <Button
	    variant="secondary"
	    onClick={()=>{
	      if (stepper.current.index==1) {
		generalInfoForm.handleSubmit(()=> {
		  const data = generalInfoForm.getValues();
		  setGeneralInfo(data.code, data.name, data.description);
		  stepper.next();
		})();
	      } else {
		stepper.next();
	      }
	    }}
	  >
	    {(stepper.current.index<steps.length-2)?"Next":"Submit"}
	  </Button>
	</div>
	: <div className="flex self-end">
	  <Button
	    variant="secondary"
	    onClick={stepper.reset}
	  >
	    Reset
	  </Button>
	</div>
      }
    </div>
  );
};

const CourseType = ({}) => {
  const { courseType, setCourseType } = useCreateCourseStore(
    (state) => state,
  );

  return (
    <div className="lg:mx-[20vw]">
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight pb-5" >Let's get started. What type of course is it?</h1>
      <RadioGroup className="flex lg:flex-row" defaultValue="general" value={courseType} onValueChange={(value) => setCourseType(value as CourseType)}>
	<Card className="w-full hover:bg-card/90" onClick={()=>setCourseType("general")}>
	  <CardContent>
	    <div className="flex items-center gap-3">
	      <RadioGroupItem value="general" id="general" />
	      <Label htmlFor="general">General</Label>
	    </div>
	  </CardContent>
	</Card>
	<Card className="w-full hover:bg-card/90" onClick={()=>setCourseType("formula")}>
	  <CardContent>
	    <div className="flex items-center gap-3">
	      <RadioGroupItem value="formula" id="formula" />
	      <Label htmlFor="formula">Formula</Label>
	    </div>
	  </CardContent>
	</Card>
      </RadioGroup>
    </div>
  );
};

const GeneralInfo = ({form}: {form: any}) => {
  return (
    <Form {...form}>
      <form>
	<div className="h-[60vh] flex items-center lg:mx-[20vw]">
	  <div className="px-4 grid grid-cols-2 gap-4 w-full">
	    <FormField control={form.control} name="code" render={({field}) => (
	      <div className="h-min">
		<FormItem>
		  <FormLabel htmlFor="code">Course Code</FormLabel>
		  <FormControl>
		    <Input
		      {...field}
		      maxLength={40}
		      id="code"
		      placeholder="ECE 150"
		      required
		    />
		  </FormControl>
		  <FormMessage />
		</FormItem>
	      </div>
	    )} />
	    <FormField control={form.control} name="name" render={({field}) => (
	      <div className="h-min">
		<FormItem>
		  <FormLabel htmlFor="name">Course Name</FormLabel>
		  <FormControl>
		    <Input
		      {...field}
		      maxLength={80}
		      id="name"
		      placeholder="Fundamentals of Programming"
		    />
		  </FormControl>
		  <FormMessage />
		</FormItem>
	      </div>
	    )} />
	    <FormField control={form.control} name="description" render={({field}) => (
	      <div className="h-min col-span-2">
		<FormItem>
		  <FormLabel htmlFor="desc">Course Description</FormLabel>
		  <FormControl>
		    <Textarea
		      {...field}
		      maxLength={200}
		      className="resize-none"
		      id="desc"
		      placeholder={`Software design process in a high-level programming environment. Programming fundamentals, language syntax, simple data types, control constructs, functions, parameter passing, recursion, classes, arrays and lists, list traversals, introduction to searching and sorting algorithms, basic object-oriented design, polymorphism and inheritance, simple testing and debugging strategies, pointers and references, basic memory management.`}
		    />
		  </FormControl>
		  <FormMessage />
		</FormItem>
	      </div>
	    )} />
	  </div>
	</div>
      </form>
    </Form>
  );
};

function useTable (
  schema: ZodObject<any>,
  defaultValues: Object,
  rows: any[],
  key: keyof CreateCourseState
) {
  const [id, setId] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { setField } = useCreateCourseStore(
    (state) => state
  );

  const rowIds = useMemo<UniqueIdentifier[]>(() => (
    rows.map(({ id }) => id)
  ), [rows]);

  const isEditing = editId !== null;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues
  });

  const openAdd = (open: boolean) => {
    if (open) {
      setEditId(null);
    }
    setOpen(open);
  }

  const openEdit = (row: any) => {
    setOpen(true);
    setEditId(row.id);
    form.reset(row);
  };

  const onSubmit = (data: any) => {
    if (isEditing) {
      setField(key, rows.map((row) => (row.id == editId ? { ...data, id: editId } : row)));
    } else {
      console.log(rows, id);
      setField(key, [...rows, {id: String(id), ...data}]);
      setId(id + 1);
    }
  };

  const onDelete = (id: string) => {
    setField(key, rows.filter((row) => row.id != id));
  }

  const clearRows = () => {
    setEditId(null);
    setId(0);
    setField(key, [])
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = rowIds.indexOf(active.id)
      const newIndex = rowIds.indexOf(over.id)
      setField(key, arrayMove(rows, oldIndex, newIndex))
    }
  };

  return {
    rows,
    rowIds,
    open,
    form,
    isEditing,
    openAdd,
    openEdit,
    onSubmit,
    onDelete,
    setOpen,
    clearRows,
    handleDragEnd
  };
};

interface AssessmentsProps {
  sensors: SensorDescriptor<SensorOptions>[],
  table: (rows: any[], columns: ColumnDef<any, any>[]) => Table<any>,
};

const Assessments = ({ sensors, table }: AssessmentsProps) => {
  const { 
    courseType,
    assessmentGroups,
    assessments,
    conditions,
    conditionGroups,
  } = useCreateCourseStore(
    (state) => state,
  );

  const isGeneral = courseType=="general";
  const assessmentGroupsTable = useTable(assessmentGroupsSchema({isGeneral}), 
    {
      name: "Assignments",
      weight: 0,
      count: 1,
      drop: 0,
      optional: false,
    },
    assessmentGroups,
    "assessmentGroups"
  );

  const assessmentsTable = useTable(assessmentsSchema,
    {
      name: "Assignments",
      weight: 0,
      optional: false,
    },
    assessments,
    "assessments"
  );

  const conditionGroupsTable = useTable(conditionGroupsSchema, {
      symbol: "",
    },
    conditionGroups,
    "conditionGroups"
  );

  const conditionsTable = useTable(conditionsSchema, {
      lower: 0,
      formula: "",
    },
    conditions,
    "conditions"
  );
  
  return (
    <div className="lg:mx-[20vw] space-y-10">
      <TableSheet
	schema={assessmentGroupsSchema({ isGeneral })}
	open={assessmentGroupsTable.open}
	setOpen={assessmentGroupsTable.openAdd}
	rowIds={assessmentGroupsTable.rowIds}
	title={"Assessment Groups"}
	sheetTitle={"Add an Assessment Group"}
	description={"Assessment groups are logical groups of assessments (i.e. Quizzes, Midterms, Finals). Do not make individual assessments for assessment groups."}
	table={table(assessmentGroupsTable.rows, assessmentGroupsCols({ onEdit:assessmentGroupsTable.openEdit, onDelete:assessmentGroupsTable.onDelete, isGeneral }))}
	clearRows={assessmentGroupsTable.clearRows}
	editing={assessmentGroupsTable.isEditing}
	form={assessmentGroupsTable.form}
	onSubmitClose={assessmentGroupsTable.onSubmit}
	sensors={sensors}
	handleDragEnd={assessmentGroupsTable.handleDragEnd}
	dropdownValues={isGeneral ? conditionsTable.rows : conditionGroupsTable.rows}
      />
      <TableSheet
	schema={assessmentsSchema}
	open={assessmentsTable.open}
	setOpen={assessmentsTable.openAdd}
	rowIds={assessmentsTable.rowIds}
	title={"Assessments"}
	sheetTitle={"Add an Assessment"}
	description={"Assessments are individual items (i.e. Quiz 1, Final Exam, Tutorial 5)."}
	table={table(assessmentsTable.rows, assessmentsCols({ onEdit:assessmentsTable.openEdit, onDelete:assessmentsTable.onDelete, isGeneral }))}
	clearRows={assessmentsTable.clearRows}
	editing={assessmentsTable.isEditing}
	form={assessmentsTable.form}
	onSubmitClose={assessmentsTable.onSubmit}
	sensors={sensors}
	handleDragEnd={assessmentsTable.handleDragEnd}
	dropdownValues={assessmentGroupsTable.rows}
      />
      {!isGeneral && 
	<>
	  <TableSheet
	    schema={conditionGroupsSchema}
	    open={conditionGroupsTable.open}
	    setOpen={conditionGroupsTable.openAdd}
	    rowIds={conditionGroupsTable.rowIds}
	    title={"Condition Groups"}
	    sheetTitle={"Add a Condition Group"}
	    description={"Condition groups are symbols used in formulas (i.e. E (Exam Grade), P (Project Grade))."}
	    table={table(conditionGroupsTable.rows, conditionGroupCols({ onEdit:conditionGroupsTable.openEdit, onDelete:conditionGroupsTable.onDelete, isGeneral }))}
	    clearRows={conditionGroupsTable.clearRows}
	    editing={conditionGroupsTable.isEditing}
	    form={conditionGroupsTable.form}
	    onSubmitClose={conditionGroupsTable.onSubmit}
	    sensors={sensors}
	    handleDragEnd={conditionGroupsTable.handleDragEnd}
	    dropdownValues={conditionsTable.rows}
	  />
	  <TableSheet
	    schema={conditionsSchema}
	    open={conditionsTable.open}
	    setOpen={conditionsTable.openAdd}
	    rowIds={conditionsTable.rowIds}
	    title={"Conditions"}
	    sheetTitle={"Add a Condition"}
	    description={"Conditions are used to shift weights."}
	    table={table(conditionsTable.rows, conditionsCols({ onEdit:conditionsTable.openEdit, onDelete:conditionsTable.onDelete, isGeneral }))}
	    clearRows={conditionsTable.clearRows}
	    editing={conditionsTable.isEditing}
	    form={conditionsTable.form}
	    onSubmitClose={conditionsTable.onSubmit}
	    sensors={sensors}
	    handleDragEnd={conditionsTable.handleDragEnd}
	    dropdownValues={isGeneral ? assessmentGroupsTable.rows : conditionGroupsTable.rows}
	  />
	</>
      }
    </div>
  );
};

interface PersonnelProps {
  sensors: SensorDescriptor<SensorOptions>[],
  table: (rows: any[], columns: ColumnDef<any, any>[]) => Table<any>
};

const Personnel = ({ sensors, table }: PersonnelProps) => {
  const { personnels } = useCreateCourseStore(
    (state) => state,
  );

  const personnelsTable = useTable(personnelsSchema, 
    {
      name: "",
      email: "",
      role: "Professor"
    },
    personnels,
    "personnels"
  );


  return (
    <div className="lg:mx-[20vw]">
      <TableSheet
	schema={personnelsSchema}
	open={personnelsTable.open}
	setOpen={personnelsTable.openAdd}
	rowIds={personnelsTable.rowIds}
	title={"Personnels"}
	sheetTitle={"Add a Person"}
	description={"PersonnelsTable are important people to the course."}
	table={table(personnelsTable.rows, personnelsCols({ onEdit:personnelsTable.openEdit, onDelete:personnelsTable.onDelete }))}
	clearRows={personnelsTable.clearRows}
	editing={personnelsTable.isEditing}
	form={personnelsTable.form}
	onSubmitClose={personnelsTable.onSubmit}
	sensors={sensors}
	handleDragEnd={personnelsTable.handleDragEnd}
	dropdownValues={[{name: "Professor", id: "0"}, {name: "TA", id: "1"}]}
      />
    </div>
  );
};

const SubmitForm = () => {
  const state = useCreateCourseStore((state)=>state);
  const hasCreated = useRef(false);
  
  useEffect(() => {
    if (hasCreated.current) return;

    const createCourse = async () => {
      const data = await OutlinesAPIClient.createCourse(state);

      console.log(data, state);
    };
    
    createCourse();
    hasCreated.current = true;
  }, []);

  return (
    <div className="lg:mx-[20vw]">
      <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight pb-5" >Your course has been created!</h1>
    </div>
  );
};
