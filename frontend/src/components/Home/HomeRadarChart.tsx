import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartTooltip,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Radar, RadarChart, PolarAngleAxis, PolarGrid } from "recharts";
import { Search } from "lucide-react";
import { HOME_RADAR_CHART_CONFIG } from "@/constants/ChartConstants";
import { SEARCH_PAGE } from "@/constants/Routes";

interface HomeRadarChartProps {
  chartData: any[];
}

export default function HomeRadarChart({ chartData }: HomeRadarChartProps) {
  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Radar Chart</CardTitle>
        <CardDescription>Showing your average amongst courses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 m-0 flex justify-center">
        {chartData?.length ? (
          <ChartContainer
            config={HOME_RADAR_CHART_CONFIG}
            className="mx-auto max-h-[250px]"
          >
            <RadarChart data={chartData || {}}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <PolarAngleAxis dataKey="code" />
              <PolarGrid />
              <Radar
                dataKey="average"
                fill="var(--primary)"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ChartContainer>
        ) : (
          <Link href={SEARCH_PAGE}>
            <Button className="mt-2">
              <Search />
              Find some courses
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
