import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Check, Eraser, Info } from "lucide-react";
import { COURSE_TITLE, COURSE_BIO, COURSE_ASSIGNMENTS } from "@/constants/SkeletonConstants";
import CourseInfoDialog from "@/components/Course/CourseInfoDialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import GradesAPIClient from "@/APIClients/GradesAPIClient";
import { getAssessmentName } from "@/utils/helpers";

interface GradeTableProps {
  isLoading: boolean,
  courseMetadata: any,
  upsertMetadata: (gradeObj: any[], grade: number) => void,
  deleteMetadata: (gradeObj: any[]) => void,
  enrollmentId: string,
  currFormula: string,
};

export default function GradeTable ({ isLoading, courseMetadata, upsertMetadata, deleteMetadata, enrollmentId, currFormula }: GradeTableProps) {
  const [editingState, setEditingState] = useState<Record<string, boolean>>({});
  const [inputState, setInputState] = useState<Record<string, string>>({});
  const formula = !!courseMetadata?.conditions?.length;
  console.log("FORMULA", currFormula);

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
      upsertMetadata(newGrade, Number(value));
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
	    </TableRow>
	  </TableHeader>
	  {isLoading
	    ? <COURSE_ASSIGNMENTS />
	    : <TableBody>
	      {courseMetadata!.assessment_groups?.map((assessment_group: any) =>
		assessment_group.assessments.map((assessment: any) => (
		  <TableRow key={assessment.index}>
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
			value={inputState[assessment.id] || ''}
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
		  </TableRow>
		))
	      )}
	    </TableBody>
	  }
	</Table>
      </CardContent>
    </Card>
  );
}
