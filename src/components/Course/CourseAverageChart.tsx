import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { CartesianGrid, XAxis, Line, ComposedChart, Bar } from "recharts";
import { COURSE_AVERAGE_CHART_CONFIG, POSITIVE_MESSAGE, NEGATIVE_MESSAGE } from "@/constants/ChartConstants";
import { TrendingUp, TrendingDown } from "lucide-react";
import { getRecentAverageDelta } from "@/utils/helpers";
import { CourseAverageData } from "@/types/Types";

interface CourseAverageCardProps {
  isLoading: boolean,
  averageChartData: CourseAverageData[]
}

export default function CourseAverageCard ({ isLoading, averageChartData }: CourseAverageCardProps) {
  const averageDelta = getRecentAverageDelta(averageChartData) ?? 0;
  const positiveDelta = averageDelta > 0;
  
  return (
    <Card className="lg:col-span-4 col-span-2 h-min">
      <CardHeader>
	<CardTitle>Course Average</CardTitle>
	<CardDescription>Track your progress with your latest moving average.</CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
	{isLoading
	  ? <Skeleton className="w-4 h-4"/>
	  : <ChartContainer
	    config={COURSE_AVERAGE_CHART_CONFIG}
	  >
	    <ComposedChart
	      accessibilityLayer
	      data={averageChartData}
	      margin={{
		top: 20,
		left: 12,
		right: 12
	      }}
	    >
	      <CartesianGrid vertical={false} />
	      <ChartTooltip
		cursor={false}
		content={<ChartTooltipContent hideLabel />}
	      />
	      <XAxis
		dataKey="date"
		tickLine={false}
		axisLine={false}
		tickMargin={8}
		tickFormatter={() => ''}
	      />
	      <Bar
		dataKey="grade"
		barSize={20}
		fill="var(--chart-1)"
		/>
	      <Line
		dataKey="average"
		type="natural"
		stroke="var(--primary)"
		strokeWidth={2}
		dot={{
		  fill: "var(--primary)",
		}}
		activeDot={{
		  r: 6,
		}}
	      />
	    </ComposedChart>
	  </ChartContainer>
	}
      </CardContent>
      <CardFooter className="flex items-start flex-col gap-2 text-sm pb-3">
	<div className="flex gap-2 font-medium leading-none">
	  Your average has {" "}
	  {positiveDelta ? "increased" : "decreased" } {" "}
	  by {Math.abs(averageDelta).toPrecision(3)}%
	  {positiveDelta 
	    ? <TrendingUp className="size-4" />
	    : <TrendingDown className="size-4" />
	  }
	</div>
	<div className="leading-none text-muted-foreground mb-3">
	  {positiveDelta
	    ? POSITIVE_MESSAGE
	    : NEGATIVE_MESSAGE
	  }
	</div>
      </CardFooter>
    </Card>
  );
}
