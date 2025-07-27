import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CourseStatCardProps {
  average: number | null,
  gpa: number | null,
  completion: number | null,
}

export default function CourseStatCard ({ average, gpa, completion }: CourseStatCardProps) {
  return (
    <Card className="col-span-2 lg:col-span-4 lg:row-start-1 lg:col-start-5">
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
	    {gpa ? gpa.toString() : "N/A"}
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
