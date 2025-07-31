import React from 'react';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, Scatter, XAxis, YAxis, Bar, ComposedChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { getChartColors } from "@/components/ui/helpers";
import { isValid, format } from 'date-fns';
import { Skeleton } from './ui/skeleton';
import { getToolTipName } from "@/utils/helpers";

interface GradetimeChartProps {
  grades: any[],
  courses: string[],
  visibleCourses: Record<string, boolean>,
  isLoading: boolean,
  onToggleCourse: (course: string) => void,
}

export function GradetimeChart({ grades, courses, visibleCourses, onToggleCourse, isLoading }: GradetimeChartProps) {
  const colors = getChartColors();

  const chartConfig = courses.reduce((acc, course, index) => {
    acc[course] = {
      label: course,
      color: `var(--chart-${(index + 1) % colors.length})`,
    };
    return acc;
  }, {} as ChartConfig);

  chartConfig.average = {
    label: "Average",
    color: "var(--primary)",
  };

  return (
    <Card className="lg:row-span-2 lg:col-span-3">
      <CardHeader> 
	<CardTitle>Course Performance</CardTitle>
	<CardDescription>Grade Trends Over Time</CardDescription>
      </CardHeader>
      <CardContent className="mb-4">
	  <h3 className="text-lg font-semibold mb-2">Courses</h3>
	  <div className="flex flex-wrap gap-2">
	    {isLoading 
	      ? <Skeleton className="h-5 w-1/2"/>
	      : courses.map((course) => (
		<div key={course} className="flex items-center space-x-1">
		  <Checkbox
		    id={course}
		    checked={visibleCourses[course]}
		    onCheckedChange={() => onToggleCourse(course)}
		  />
		  <label
		    htmlFor={course}
		    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		  >
		    {course}
		  </label>
		</div>
	      ))}
	    <div className="flex items-center space-x-1">
	      {!isLoading && (
		<>
		  <Checkbox
		    id="average"
		    checked={visibleCourses.average}
		    onCheckedChange={() => onToggleCourse('average')}
		  />
		  <label
		    htmlFor="average"
		    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		  >
		    Average
		  </label>
		</> 
	      )}
	    </div>
	    <div className="flex items-center space-x-1">
	      {!isLoading && (
		<>
		  <Checkbox
		    id="all"
		    checked={visibleCourses.all}
		    onCheckedChange={() => onToggleCourse('all')}
		  />
		  <label
		    htmlFor="all"
		    className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		  >
		    All
		  </label>
		</> 
	      )}
	    </div>
	  </div>
	<ChartContainer config={chartConfig} className="mt-4">
	  <ComposedChart
	    data={grades}
	  >
	    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
	    <XAxis
	      dataKey="date"
	      tickLine={false}
	      axisLine={false}
	      tickMargin={8}
	      tickFormatter={(value) => {
		const parsedDate = new Date(value);
		return isValid(parsedDate) ? format(parsedDate, 'MMM d kk:mm') : 'Test';
	      }}
	      stroke="var(--muted-foreground)"
	      interval="preserveStartEnd"
	      minTickGap={30}
	      fontSize={10}
	    />
	    <YAxis
	      //domain={yAxisDomain}
	      tickCount={6}
	      tickFormatter={(value) => `${value}%`}
	      stroke="var(--muted-foreground)"
	      fontSize={10}
	      width={30}
	    />
	    <ChartTooltip
	      cursor={false}
	      content={({ active, payload, label }) => {
		if (active && payload && payload.length) {
		  return (
		    <div className="bg-background border border-border p-1 rounded shadow text-xs">
		      <p className="font-bold">{label?.split('T')[0]}</p>
		      {payload.map((entry, index) => (
			<p key={index} style={{ color: entry.color }}>
			  {getToolTipName(entry)}
			</p>
		      ))}
		    </div>
		  );
		}
		return null;
	      }}
	    />
	    {courses.map((course) => (
	      (visibleCourses[course]) && [
		<Bar
		  radius={2}
		  stackId="date"
		  key={`${course}_grade`}
		  dataKey={`${course}_grade`}
		  //type="monotone"
		  stroke={chartConfig[course].color}
		  //strokeWidth={0.001}
		  fill={chartConfig[course].color}
		  //connectNulls
		  //dot={{ r: 2, strokeWidth: 1 }}
		  //activeDot={{ r: 4, strokeWidth: 1 }}
		  //strokeDasharray="3 3"
		/>,
	      ]
	    ))}
	    {courses.map((course) => (
	      (visibleCourses[course]) && [
		<Line
		  key={`${course}_average`}
		  dataKey={`${course}_average`}
		  type="monotone"
		  stroke="var(--primary)"
		  //stroke={chartConfig[course].color}
		  strokeWidth={1}
		  fill={chartConfig[course].color}
		  //fill="hsl(var(--primary))"
		  connectNulls
		  dot={{ r: 3, strokeWidth: 1 }}
		  activeDot={{ r: 4, strokeWidth: 2 }}
		  //strokeDasharray="3 3"
		/>,
	      ]
	    ))}
	    {visibleCourses.average && (
	      <Line
		dataKey="average"
		type="monotone"
		stroke={chartConfig.average.color}
		//stroke="green"
		strokeWidth={2}
		dot={{ r: 2, strokeWidth: 1, fill: chartConfig.average.color }}
		activeDot={{ r: 4, strokeWidth: 1 }}
	      />
	    )}
	  </ComposedChart>
	</ChartContainer>
      </CardContent>
      <CardFooter className="flex-shrink-0">
	{isLoading
	  ? <Skeleton className="h-3 w-1/12" />
	  : <div className="flex w-full items-start gap-2 text-xs">
	    <div className="grid gap-1">
	      <div className="flex items-center gap-1 font-medium leading-none">
		Grade Trends
		<TrendingUp className="h-3 w-3" />
	      </div>
	    </div>
	  </div>
	}
      </CardFooter>
    </Card>
  );
}

