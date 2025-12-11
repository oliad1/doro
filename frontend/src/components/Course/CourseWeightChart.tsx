import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

interface CourseWeightChartProps {
  isLoading: boolean;
  chartConfig: ChartConfig;
  chartData: any[];
}

export default function CourseWeightCard({
  isLoading,
  chartConfig,
  chartData,
}: CourseWeightChartProps) {
  return (
    <Card className="lg:col-span-1 lg:row-start-2">
      <CardHeader>
        <CardTitle>Weighting Distribution</CardTitle>
        <CardDescription>
          The weightings of all your deliverables, graphed.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <></>
        ) : (
          <ChartContainer
            config={chartConfig!}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={chartData} dataKey="weight" label nameKey="name" />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
