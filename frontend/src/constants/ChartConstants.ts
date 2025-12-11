import { ChartConfig } from "@/components/ui/chart";

export const COURSE_AVERAGE_CHART_CONFIG = {
  grade: {
    label: "Grade",
  },
  average: {
    label: "Average",
  },
} satisfies ChartConfig;

export const HOME_RADAR_CHART_CONFIG = {
  average: {
    label: "Average",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export const POSITIVE_MESSAGE = `
  Great job! Keep up the hard work and stay focused.
`;

export const NEGATIVE_MESSAGE = `
  Keep pushing, stay focused and keep working towards your goals!
`;
