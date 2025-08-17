import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { gradeToGPA } from "@/utils/helpers";

interface CourseStatCardProps {
  average: number | null,
  completion: number | null,
}

export default function CourseStatCard ({ average, completion }: CourseStatCardProps) {
  const gpa: number | null = gradeToGPA(average!);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
	<CardTitle>Your Stats</CardTitle>
	<CardDescription>All of your statistics for this class.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4 lg:flex-row lg:space-y-0 lg:justify-between lg:items-center col-span-3">
	<div className="flex flex-col justify-center items-center text-center">
	  <p className="lg:text-sm text-xs text-muted-foreground">
	    Your Average
	  </p>
	  <h2 className="lg:text-3xl text-xl font-semibold">
	    {average ? average?.toPrecision(3).toString() : 0}%
	  </h2>
	</div>
	<div className="flex flex-col justify-center items-center">
	  <h2 className="lg:text-sm text-xs text-muted-foreground">
	    Your GPA
	  </h2>
	  <h2 className="lg:text-3xl text-xl font-semibold">
	    {gpa ? gpa.toPrecision(3).toString() : 0}
	  </h2>
	</div>
	<div className="flex flex-col justify-center items-center">
	  <h2 className="lg:text-sm text-xs text-muted-foreground">
	    Course Completion 
	  </h2>
	  <h2 className="lg:text-3xl text-xl font-semibold">
	    {completion ? completion?.toPrecision(3).toString() : 0}%
	  </h2>
	</div>
      </CardContent>
    </Card>
  );
}
