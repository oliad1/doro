import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { getChartColors } from "@/components/ui/helpers";
import { parse, format, isValid, compareAsc } from 'date-fns';
import { Skeleton } from './ui/skeleton';

const parseDate = (dateString: string | undefined) => {
  if (!dateString) return new Date(NaN);
  
  const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'MMM d', 'MMMM d', 'MMM d yyyy', 'MMMM d yyyy'];
  for (const fmt of formats) {
    const date = parse(dateString, fmt, new Date());
    if (isValid(date)) {
      return date;
    }
  }
  return new Date(NaN);
};

const formatDate = (date: Date) => {
  return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid Date';
};

interface GradeUpdate {
  date: string;
  course: string;
  grade: number;
}

interface GradetimeChartProps {
  gradeUpdates: GradeUpdate[],
  courses: string[],
  visibleCourses: Record<string, boolean>,
  isLoading: boolean,
  onToggleCourse: (course: string) => void,
}

export function GradetimeChart({ gradeUpdates, courses, visibleCourses, onToggleCourse, isLoading }: GradetimeChartProps) {
  const colors = getChartColors();
  const chartConfig = courses.reduce((acc, course, index) => {
    acc[course] = {
      label: course,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as ChartConfig);

  chartConfig.average = {
    label: "Average",
    color: "hsl(var(--primary))",
  };

  const sortedUpdates = [...gradeUpdates]
    .filter(update => isValid(parseDate(update.date)))
    .sort((a, b) => compareAsc(parseDate(a.date), parseDate(b.date)));

  const chartData = sortedUpdates.reduce((acc, update) => {
    const date = parseDate(update.date);
    const existingDataPoint = acc.find(dp => dp.date.getTime() === date.getTime());

    if (existingDataPoint) {
      existingDataPoint[update.course] = update.grade;
    } else {
      const newDataPoint: any = { date, parsedDate: date };
      newDataPoint[update.course] = update.grade;
      acc.push(newDataPoint);
    }

    return acc;
  }, [] as any[]);

  const averageData = chartData.map((dataPoint) => {
    const visibleCourseValues = courses
      .filter((course) => visibleCourses[course])
      .map((course) => {
        if (dataPoint[course] !== undefined) {
          return dataPoint[course];
        }
        // Find the most recent grade for this course
        const recentUpdate = sortedUpdates
          .filter(update => update.course === course && parseDate(update.date) <= dataPoint.date)
          .pop();
        return recentUpdate ? recentUpdate.grade : null;
      })
      .filter((value): value is number => value !== null);

    const average = visibleCourseValues.length
      ? visibleCourseValues.reduce((sum, value) => sum + value, 0) / visibleCourseValues.length
      : 0;

    return {
      ...dataPoint,
      average: Number(average.toFixed(2)),
    };
  });

  const calculateYAxisDomain = () => {
    const allValues = averageData.flatMap(dataPoint => 
      courses.map(course => dataPoint[course]).filter(value => typeof value === 'number')
    );
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);
    const lowerBound = Math.max(0, Math.floor((minValue - 5) / 10) * 10);
    const upperBound = Math.min(100, Math.ceil((maxValue + 5) / 10) * 10);
    return [lowerBound, upperBound];
  };

  const yAxisDomain = calculateYAxisDomain();

  return (
    <Card className="flex flex-col h-fit">
      <CardHeader className="flex-shrink-0">
        <CardTitle>
          { isLoading?
          <Skeleton className="h-4 w-1/6"/>
          :<>Course Performance</>
          }
        </CardTitle>
        <CardDescription>
          {isLoading?
            <Skeleton className="h-4 w-1/6"/>
            :<>Grade Trends Over Time</>
          }
          </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="mb-4">
          {isLoading?
          <Skeleton className="h-5 w-1/12 mb-2"/>
          :<h3 className="text-lg font-semibold mb-2">Courses</h3>
          }
          <div className="flex flex-wrap gap-2">
            {isLoading ?
            <Skeleton className="h-5 w-1/2"/>
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
              {
                isLoading?
                  <>
                    {/* LEAVE EMPTY */}
                  </>
                  : <>
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
              }
            </div>
          </div>
        </div>
        <div className="flex-grow">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="95%" height="100%">
              <LineChart
                data={averageData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="parsedDate"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => isValid(value) ? format(value, 'MMM d') : ''}
                  stroke="hsl(var(--muted-foreground))"
                  interval="preserveStartEnd"
                  minTickGap={30}
                  fontSize={10}
                />
                <YAxis
                  domain={yAxisDomain}
                  tickCount={6}
                  tickFormatter={(value) => `${value}%`}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  width={30}
                />
                <ChartTooltip
                  cursor={false}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border p-1 rounded shadow text-xs">
                          <p className="font-bold">{formatDate(label)}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }}>
                              {entry.name}: {entry.value}%
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {courses.map((course) => (
                  visibleCourses[course] && (
                    <Line
                      key={course}
                      dataKey={course}
                      type="monotone"
                      stroke={chartConfig[course].color}
                      strokeWidth={1}
                      connectNulls
                      dot={{ r: 2, strokeWidth: 1 }}
                      activeDot={{ r: 4, strokeWidth: 1 }}
                      strokeDasharray="3 3"
                    />
                  )
                ))}
                {visibleCourses.average && (
                  <Line
                    key="average"
                    dataKey="average"
                    type="monotone"
                    stroke={chartConfig.average.color}
                    strokeWidth={2}
                    dot={{ r: 2, strokeWidth: 1, fill: chartConfig.average.color }}
                    activeDot={{ r: 4, strokeWidth: 1 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-shrink-0">
        {isLoading ?
          <Skeleton className="h-3 w-1/12" />
          :<div className="flex w-full items-start gap-2 text-xs">
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

