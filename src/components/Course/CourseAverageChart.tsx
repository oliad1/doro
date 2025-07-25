import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, CartesianGrid, XAxis, Line, ComposedChart, Bar } from "recharts";
import { COURSE_AVERAGE_CHART_CONFIG } from "@/constants/ChartConstants";

interface CourseAverageCardProps {
  isLoading: boolean,
  averageChartData: any[]
}

export default function CourseAverageCard ({ isLoading, averageChartData }: CourseAverageCardProps) {
  

  return (
    <Card className="lg:col-span-4 col-span-2 row-span-1">
      <CardHeader>
	<CardTitle>Course Average</CardTitle>
	<CardDescription>Your moving average, charted.</CardDescription>
      </CardHeader>

      <CardContent> 
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
	      <XAxis
		dataKey="date"
		tickLine={false}
		axisLine={false}
		tickMargin={8}
	      />
	      <ChartTooltip
		cursor={false}
		content={<ChartTooltipContent hideLabel />}
	      />
	      <Bar
		dataKey="grade"
		barSize={20}
		fill="hsl(var(--chart-1))"
		/>
	      <Line
		dataKey="average"
		type="natural"
		stroke="hsl(var(--primary))"
		strokeWidth={2}
		dot={{
		  fill: "hsl(var(--primary))",
		}}
		activeDot={{
		  r: 6,
		}}
	      />
	    </ComposedChart>
	  </ChartContainer>
	}
      </CardContent>
    </Card>
  );
}
