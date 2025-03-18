import React from 'react';
import { TrendingUp } from 'lucide-react';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
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
} from "@/components/ui/chart";
import { getSemesterDates, calculateSemesterProgress } from "@/components/ui/helpers";
import { Skeleton } from './ui/skeleton';

interface YearProgressProps {
  isLoading: boolean
}

export function YearProgressChart({isLoading}: YearProgressProps) {
  const { semester, dates } = getSemesterDates();
  const semesterProgress = calculateSemesterProgress(dates);

  const dynamicChartData = [
    { label: "Semester Progress", percentage: semesterProgress, fill: "hsl(var(--primary))" },
  ];

  const dynamicChartConfig = {
    percentage: {
      label: "Percentage Completed",
    },
    semesterProgress: {
      label: "Semester Progress",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full flex flex-col h-fit">
      <CardHeader className="text-center">
        <CardTitle>
          {isLoading ?
            <Skeleton className="h-5 w-1/3" />
            : <>Semester Progress</>
          }
        </CardTitle>
        <CardDescription>
          {semester} Semester
          {dates.start.getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center">
        <ChartContainer
          config={dynamicChartConfig}
          className="w-full h-full"
        >
          <RadialBarChart
            data={dynamicChartData}
            startAngle={90}
            endAngle={360*semesterProgress/100+90}
            innerRadius={65}
            outerRadius={82.5}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[69, 61]}
            />
              <RadialBar dataKey="percentage" background cornerRadius={10}/>
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <g>
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="fill-foreground text-5xl font-bold"
                          >
                            {semesterProgress}%
                          </text>
                        </g>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          {semesterProgress < 50 ? 'Just getting started!' : 'Over halfway there!'} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground mb-3">
          {semester} semester: {dates.start.toLocaleDateString()} - {dates.end.toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}