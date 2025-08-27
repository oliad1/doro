import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Pencil, Check, Eraser, Info, Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { COURSE_TITLE, COURSE_BIO, COURSE_ASSIGNMENTS } from "@/constants/SkeletonConstants";
import { CHANGE_COURSE_HEADER } from "@/constants/DialogConstants";
import CourseInfoDialog from "@/components/Course/CourseInfoDialog";
import { toast } from "sonner";
import GradesAPIClient from "@/APIClients/GradesAPIClient";
import DatesAPIClient from "@/APIClients/DatesAPIClient";
import { getAssessmentName } from "@/utils/helpers";
import { format } from "date-fns"; 

interface GradeTableProps {
  isLoading: boolean,
  courseMetadata: any,
  upsertMetadata: (gradeObj: any[], value: any, isGrade: boolean) => void,
  deleteMetadata: (gradeObj: any[]) => void,
  enrollmentId: string,
  currFormula: string,
};

export default function GradeTable ({ isLoading, courseMetadata, upsertMetadata, deleteMetadata, enrollmentId, currFormula }: GradeTableProps) {
  const [editingState, setEditingState] = useState<Record<string, boolean>>({});
  const [inputState, setInputState] = useState<Record<string, string>>({});
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const editTimeRef = useRef<HTMLInputElement>(null);
  const formula = !!courseMetadata?.conditions?.length;

  useEffect(() => {
    const newEditingState: Record<string, boolean> = {};
    const newInputState: Record<string, string> = {};

    if (!isLoading) {
      courseMetadata!.assessment_groups?.map((assessment_group: any) => {
	return assessment_group.assessments.map((assessment: any) => { 
	  newEditingState[assessment.id as string] = false;
	  newInputState[assessment.id as string] = (assessment.grades.length) ? assessment.grades[0].grade : "";
	})
      });

      setEditingState(newEditingState);
      setInputState(newInputState);
    }
  }, [isLoading, courseMetadata]);

  const upsertGrade = async (id: string, value: string) => {
    toast.loading("Upserting Grade", {
      id: "upsert",
      richColors: true
    });
    const newGrade = await GradesAPIClient.upsertGrade(id, Number(value), enrollmentId);
    toast.dismiss("upsert");
    if (newGrade) {
      upsertMetadata(newGrade, Number(value), true);
      toast.success("New grades recalculated!", {
	richColors: true
      });
    } else {
      toast.error("Error inserting new grade", {
	richColors: true
      });
      return;
    }
  }

  const deleteGrade = async (id: string) => {
    toast.loading("Clearing grade", {
      id: "clearing",
      richColors: true,
    });

    const deletedGrade = await GradesAPIClient.deleteGrade(id);
    toast.dismiss("clearing");
    if (deletedGrade) {
      setInputState((prevState) => ({
	...prevState,
	[id]: ''
      }));
      deleteMetadata(deletedGrade);
      toast.success("New grades recalculated!", {
	richColors: true
      });
    } else {
      toast.error("Error deleting grade", {
	richColors: true
      });
      return;
    }
  }

  const upsertDate = async (id: string, value: Date | undefined) => {
    toast.loading("Upserting Date", {
      id: "upsert"+id,
      richColors: true
    });
    const newDate = await DatesAPIClient.upsertDate(id, value, enrollmentId);
    toast.dismiss("upsert"+id);
    if (newDate) {
      upsertMetadata(newDate, value, false);
      toast.success("Saved new due date", {
	richColors: true
      });
    } else {
      toast.error("Error saving new date", {
	richColors: true
      });
      return;
    }
  }

  const deleteDate = async (id: string) => {
    toast.loading("Clearing date", {
      id: "clearing"+id,
      richColors: true,
    });

    const deletedDate = await DatesAPIClient.deleteDate(id);
    toast.dismiss("clearing"+id);
    if (deletedDate) {
      deleteMetadata(deletedDate);
      toast.success("Reverted due date successfully", {
	richColors: true
      });
    } else {
      toast.error("Error deleting due date", {
	richColors: true
      });
      return;
    }
  };

  const toggleEditing = (id: string) => {
    if (editingState[id]) {
      if (inputState[id]) {
	upsertGrade(id, inputState[id]);
      }
    }
    setEditingState((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    //console.log(e.target.value);
    setInputState((prevState) => ({
      ...prevState,
      [id]: e.target.value.replace(/[^0-9.]/g, '')
    }));
  }

  return (
    <Card className="w-full h-min">
      <CardHeader>
	<CardTitle>
	  {isLoading
	    ? <Skeleton>
	      <h2 className="text-3xl font-semibold opacity-0">
		{COURSE_TITLE}
	      </h2>
	    </Skeleton>
	    : <h2 className="text-3xl font-semibold text-white">
	      {courseMetadata!.code}: {courseMetadata!.name}
	    </h2>
	  }
	</CardTitle>
	<CardDescription>
	  {isLoading 
	    ? <Skeleton>
	      <p className="opacity-0">
		{COURSE_BIO}
	      </p>
	    </Skeleton>
	    : <p className="text-muted-foreground">
	      {courseMetadata!.description}
	    </p>
	  }
	</CardDescription>
	{!isLoading && formula && (
	  <CardAction>
	    <Dialog>
	      <DialogTrigger asChild>
		  <Button variant="ghost" className="p-0 aspect-square">
		    <Info/>
		</Button>
	      </DialogTrigger>
	      <CourseInfoDialog
		currFormula={currFormula}
		conditions={courseMetadata.conditions}
	      />
	    </Dialog>
	  </CardAction>
	)}
      </CardHeader>

      <CardContent>
	<Table>
	  <TableHeader>
	    <TableRow>
	      <TableHead>Name</TableHead>
	      <TableHead>Weighting</TableHead>
	      <TableHead>Grade</TableHead>
	      <TableHead>Due Date</TableHead>
	    </TableRow>
	  </TableHeader>
	  {isLoading
	    ? <COURSE_ASSIGNMENTS />
	    : <TableBody>
	      {courseMetadata!.assessment_groups?.map((assessment_group: any) =>
		assessment_group.assessments.map((assessment: any) => {
		  const date = !!assessment.dates.length 
		    ? assessment.dates[0].date 
		      ? new Date(assessment.dates[0].date) : undefined 
		    : (assessment.due_date 
		      ? (new Date(assessment.due_date)) : undefined);
		  const now = new Date(Date.now())
		  const datePassed = now > date! && date;
		  const editDatePassed = now > editDate! && editDate;

		  return <TableRow key={assessment.index}>
		    <TableCell className="font-medium text-nowrap">
		      {getAssessmentName(assessment_group, assessment.index)}
		      {(assessment.dropped) && (
			<Badge variant="secondary" className="ml-2" >Dropped</Badge>
		      )}
		      {(assessment_group.optional || assessment_group.type?.includes("Bonus")) && (
			<Badge variant="outline" className="ml-2" >Optional</Badge>
		      )}
		    </TableCell>

		    <TableCell> 
		      <div className="flex flex-row gap-2 items-center">
			{(!formula ? assessment.weight : assessment.weight * assessment_group.weight).toPrecision(2).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1")}
			{assessment_group?.condition_group_id?.symbol && (
			  <Button size="icon" variant="outline" className="p-0 size-5">
			    {assessment_group.condition_group_id.symbol}
			  </Button>
			)}
		      </div>
		    </TableCell>

		    <TableCell className="flex w-min max-w-sm justify-center items-center gap-2">
		      <Input
			type="number"
			onChange={(e)=>handleGradeChange(e, assessment.id)}
			disabled={!(editingState[assessment.id as string]) as boolean}
			value={inputState[assessment.id] ?? ''}
			className="min-w-24"
			placeholder="Grade"
		      />
		      <Button
			size="icon"
			className="size-8 px-5"
			onClick={()=>toggleEditing(assessment.id)}
			variant="secondary"
		      >
			{editingState[assessment.id] ?
			  <Check />
			  : <Pencil/>
			}
		      </Button>
		      <Button
			size="icon"
			className="size-8 px-5"
			onClick={()=>deleteGrade(assessment.id)}
			variant="secondary"
		      >
			<Eraser />
		      </Button>
		    </TableCell>

		    <TableCell className="w-min">
		      <div className="flex flex-row gap-2 items-center">
			<Dialog>
			  <DialogContent>
			    <CHANGE_COURSE_HEADER/>
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
				  defaultValue={editDate ? format(editDate, "hh:mm") : "23:59"}
				  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
				/>
				<Button
				  variant="secondary" 
				  className={"font-normal"+(!editDatePassed ? '' : " opacity-50")}
				>
				  <CalendarIcon/>
				  {editDate ? format(editDate, ("MMM dd yyyy")) : "Select Date"}
				</Button>
			      </div>
			    </div>
			    <DialogFooter className="sm:justify-between">
			      <DialogClose asChild>
				<Button variant="ghost">Cancel</Button>
			      </DialogClose>
			      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-min">
				<Button variant="ghost" onClick={()=>{setEditDate(undefined)}} className="w-full sm:w-min text-destructive hover:text-destructive hover:bg-destructive/20 ">
				  Clear
				</Button>
				<Button 
				  onClick={()=>{
				    console.log("INPUT", editTimeRef, editTimeRef?.current, editTimeRef?.current?.value);
				    if (editTimeRef.current && editTimeRef.current.value.includes(":")) {
				      const base = editDate ? new Date(editDate) : new Date();
				      const updated = new Date(base);
				      const [hour, minute] = editTimeRef?.current?.value.split(":").map((item) => Number.parseInt(item));
				      updated.setHours(hour, minute);
				      setEditDate(updated);
				      upsertDate(assessment.id, updated);
				    }
				  }}
				  className="w-full sm:w-min">
				  Confirm 
				</Button>
			      </div>
			    </DialogFooter>
			  </DialogContent>
			  <DialogTrigger asChild>
			    <Button
			      variant="secondary" 
			      className={"font-normal"+(!datePassed ? '' : " opacity-50")}
			      onClick={()=>{setEditDate(date)}}
			      //disabled={now > date && assessment.due_date}
			    >
			      <CalendarIcon/>
			      {date ? format(date, ("MMM dd yyyy h:mm a")) : "Select Date"}
			    </Button>
			  </DialogTrigger>
			  {(!!assessment.dates.length) && (
			    <Button
			      size="icon"
			      className="size-8 px-5"
			      onClick={()=>deleteDate(assessment.id)}
			      variant="secondary"
			    >
			      <Trash2/>
			    </Button>
			  )}
			</Dialog>
		      </div>
		    </TableCell>
		  </TableRow>
		})
	      )}
	    </TableBody>
	  }
	</Table>
      </CardContent>
    </Card>
  );
}
