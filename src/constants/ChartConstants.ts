import { ChartConfig } from "@/components/ui/chart";


export const COURSE_AVERAGE_CHART_CONFIG = {
  grade: {
    label: "Grade",
    color: "hsl(var(--chart-1))"
  },
  average: {
    label: "Average",
    color: "hsl(var(--primary))"
  }
} satisfies ChartConfig;

export const HOME_RADAR_CHART_CONFIG = {
  average: {
    label: "Average",
    color: "hsl(var(--primary))"
  }
} satisfies ChartConfig;
