import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import {
  getSemesterDates,
  calculateSemesterProgress,
} from "@/components/ui/helpers";

export function YearProgressChart() {
  const { semester, dates } = getSemesterDates();
  const semesterProgress = calculateSemesterProgress(dates);

  const dynamicChartData = [
    {
      label: "Semester Progress",
      percentage: semesterProgress,
      fill: "var(--primary)",
    },
  ];

  const dynamicChartConfig = {
    percentage: {
      label: "Percentage Completed",
    },
    semesterProgress: {
      label: "Semester Progress",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="text-center pb-0">
        <CardTitle>Semester Progress</CardTitle>
        <CardDescription>
          {semester} Semester {dates.start.getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={dynamicChartData}
            startAngle={0}
            endAngle={(360 * semesterProgress) / 100}
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
            <RadialBar dataKey="percentage" background cornerRadius={10} />
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
                          y={(viewBox.cy || 0) + 5}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {semesterProgress}%
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center justify-center gap-2 font-medium leading-none">
          {semesterProgress < 50
            ? "Just getting started!"
            : "Over halfway there!"}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground mb-3">
          {dates.start.toLocaleDateString()} - {dates.end.toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}
