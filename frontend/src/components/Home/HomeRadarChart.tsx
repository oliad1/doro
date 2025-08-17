import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { Radar, RadarChart, PolarAngleAxis, PolarGrid } from "recharts";
import { HOME_RADAR_CHART_CONFIG } from "@/constants/ChartConstants";

interface HomeRadarChartProps {
  chartData: any[]
}

export default function HomeRadarChart ({chartData}: HomeRadarChartProps) {
  return (
    <Card> 
      <CardHeader className="items-center pb-4">
	<CardTitle>Radar Chart</CardTitle>
	<CardDescription>Showing your average amongst courses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 m-0">
	<ChartContainer
	  config={HOME_RADAR_CHART_CONFIG}
	  className="mx-auto max-h-[250px]"
	>
	  <RadarChart data={chartData || {}}>
	    <ChartTooltip cursor={false} content={<ChartTooltipContent/>} />
	    <PolarAngleAxis dataKey="code" />
	    <PolarGrid />
	    <Radar
	      dataKey="average"
	      fill="var(--primary)"
	      fillOpacity={0.6}
	    />
	  </RadarChart>
	</ChartContainer>
      </CardContent>
    </Card>
  )
};
