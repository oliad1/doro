import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/app/(dashboard)/course/[id]/columns";
import { SquareFunction } from "lucide-react";
import { COURSE_TITLE, COURSE_BIO } from "@/constants/SkeletonConstants";
import CourseInfoDialog from "@/components/Course/CourseInfoDialog";
import { toast } from "sonner";
import GradesAPIClient from "@/APIClients/GradesAPIClient";
import DatesAPIClient from "@/APIClients/DatesAPIClient";
import { getAssessmentName } from "@/utils/helpers";

interface GradeTableProps {
  isLoading: boolean,
  courseMetadata: any,
  upsertMetadata: (gradeObj: any[], value: any, isGrade: boolean) => void,
  deleteMetadata: (gradeObj: any[], isGrade: boolean) => void,
  enrollmentId: string,
  currFormula: string,
};

export default function GradeTable ({ isLoading, courseMetadata, upsertMetadata, deleteMetadata, enrollmentId, currFormula }: GradeTableProps) {
  const [editingState, setEditingState] = useState<Record<string, boolean>>({});
  const [inputState, setInputState] = useState<Record<string, string>>({});
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
      deleteMetadata(deletedGrade, true);
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
    console.log(value)
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
      deleteMetadata(deletedDate, false);
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

  const toggleEditing = (id: string, value: string, oldValue: string) => {
    if (editingState[id] && oldValue!=value) {
      upsertGrade(id, value);
    }
    setEditingState((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleGradeChange = (value: string, id: string) => {
    //console.log(e.target.value);
    setInputState((prevState) => ({
      ...prevState,
      [id]: value.replace(/[^0-9.]/g, '')
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
		    <SquareFunction/>
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

      <CardContent className="overflow-hidden w-[100%]">
	<DataTable 
	  columns={columns({
	    formula,
	    editingState,
	    inputState,
	    editTimeRef,
	    upsertDate,
	    deleteDate,
	    toggleEditing,
	    deleteGrade,
	    handleGradeChange,
	  })}
	  data={
	    courseMetadata ? courseMetadata!.assessment_groups?.flatMap((assessment_group: any) =>
	      assessment_group.assessments.map((assessment: any) => ({
		id: assessment.id,
		name: getAssessmentName(assessment_group, assessment.index),
		dropped: assessment.dropped,
		optional: assessment_group.optional || assessment_group.type?.includes("Bonus"),
		weight: (!formula ? assessment.weight : assessment.weight * assessment_group.weight).toPrecision(2).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1"),
		symbol: assessment_group?.condition_group_id?.symbol ?? null,
		grade: inputState[assessment.id],
		date: (assessment.dates?.length ? new Date(assessment.dates[0].date) : undefined) ?? (assessment.due_date ? new Date(assessment.due_date) : undefined),
		default_date: assessment.due_date ? new Date(assessment.due_date) : undefined,
		modified_date: assessment.dates?.length ? new Date(assessment.dates[0].date) : undefined,
	      }))
	    ) : []}
	/>
      </CardContent>
    </Card>
  );
}
