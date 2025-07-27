import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { RadialBarChart, PolarGrid, RadialBar, PolarRadiusAxis, Label } from "recharts";

interface CourseCompletionChartProps {
  isLoading: boolean,
  completion: number
}

export default function CourseCompletionChart ({ isLoading, completion }: CourseCompletionChartProps) {
  return (
    <Card className="lg:col-span-2 col-span-2 row-span-1">
      <CardHeader>
	<CardTitle>Course Completion</CardTitle>
	<CardDescription>The amount of weighting left, charted.</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
	{isLoading?
	  <>
	    <Skeleton className="w-4 h-4"/>
	  </>
	  : <ChartContainer 
	    config={{completion: { label: "completion" }}}
	    className="mx-auto aspect-square max-h-[250px]"
	  >
	    <RadialBarChart
	      data={[{completion: completion, broswer: "safari", fill: "var(--primary)"}]}
	      startAngle={0}
	      endAngle={(completion/100 || 0)*360}
	      innerRadius={80}
	      outerRadius={110}
	    >
	      <PolarGrid
		gridType="circle"
		radialLines={false}
		stroke="none"
		className="first:fill-muted last:fill-background"
		polarRadius={[86, 74]}
	      />
	      <RadialBar dataKey="completion" background cornerRadius={10} />
	      <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
		<Label
		  content={({ viewBox }) => {
		    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
		      return (
			<text
			  x={viewBox.cx}
			  y={viewBox.cy}
			  textAnchor="middle"
			  dominantBaseline="middle"
			>
			  <tspan
			    x={viewBox.cx}
			    y={viewBox.cy}
			    className="fill-foreground text-4xl font-bold"
			  >
			    {completion ? completion.toPrecision(3) : 0}%
			  </tspan>
			  <tspan
			    x={viewBox.cx}
			    y={(viewBox.cy || 0) + 24}
			    className="fill-muted-foreground"
			  >
			    Completed
			  </tspan>
			</text>
		      )
		    }
		  }}
		/>
	      </PolarRadiusAxis>
	    </RadialBarChart>
	  </ChartContainer>
	}
      </CardContent>
    </Card>
  );
}
