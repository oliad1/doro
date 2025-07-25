"use client"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import OutlinesAPIClient from "@/APIClients/OutlinesAPIClient";
import { getCourseStats, getMovingAverage } from "@/utils/helpers";
import { toast } from "sonner";
import CourseCompletionChart from "@/components/Course/CourseCompletionChart";
import CourseStatCard from "@/components/Course/CourseStatCard";
import CourseWeightChart from "@/components/Course/CourseWeightChart";
import GradeTable from "@/components/Course/GradeTable";
import CourseAverageChart from "@/components/Course/CourseAverageChart";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [courseId, setCourseId] = useState<string>()
  const [courseMetadata, setCourseMetadata] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [recalculate, setRecalculate] = useState<boolean>(true);
  const [average, setAverage] = useState<number>(0);
  const [completion, setCompletion] = useState<number>(0);
  const [chartData, setChartData] = useState();
  const [averageChartData, setAverageChartData] = useState<{grade: number, date: string}[]>();
  const [chartConfig, setChartConfig] = useState<ChartConfig>();
  let gpa = 0;

  useEffect(()=>{
    const fetchCourseData = async () => {
      if (recalculate) {
	const courseId = (await params).id

	if (courseId) {
	  setCourseId(courseId);
	}

	toast.loading("Loading Grades", {
	  id: 0,
	  richColors: true
	});

	const data = await OutlinesAPIClient.getCourse(courseId);

	setCourseMetadata(data);

	toast.dismiss(0); 
	toast.success("Successfully loaded", {
	  id: 1,
	  richColors: true
	});

	const { newAverage, newCompletion } = getCourseStats(data.assessment_groups);
	const newChartData = getMovingAverage(data.assessment_groups);

	setAverageChartData(newChartData);
	setAverage(newAverage || 0);
	setCompletion(newCompletion || 0);

	const chartData = data.assessment_groups.map((group: any, index: number) => {
	  return { 
	    name: group.name,
	    weight: Number.parseFloat(group.weight)*100, 
	    fill: `hsl(var(--chart-${index+1}))` 
	  }
	});

	setChartData(chartData);

	// Initialize an empty object for chartConfig
	const updatedChartConfig: ChartConfig = {};

	// Loop over the assessments and populate the chartConfig
	data.assessment_groups.forEach((assessment: any) => {
	  updatedChartConfig[assessment.name] = {
	    label: assessment.name,
	    color: "hsl(var(--chart-5))",
	  };
	});

	// setChartData(chartData);
	setChartConfig(updatedChartConfig);

	setLoading(false);
	setRecalculate(false);
      }
    }

    fetchCourseData();
  }, [recalculate]);


  return (
    <div className="grid grid-cols-2 lg:grid-cols-8 gap-y-2 gap-x-2 p-4">
      <GradeTable 
	isLoading={isLoading}
	courseMetadata={courseMetadata}	
	setRecalculate={()=>setRecalculate(true)}
      />
      <CourseStatCard 
	average={average} 
	completion={completion}
	gpa={gpa}
      />
      <CourseCompletionChart 
	isLoading={isLoading} 
	completion={completion} 
      />
      <CourseWeightChart 
	isLoading={isLoading} 
	chartData={chartData!} 
	chartConfig={chartConfig!} 
      />
      <CourseAverageChart
	isLoading={isLoading}
	chartConfig={chartConfig!}
	averageChartData={averageChartData || []}
      />
    </div>
  )
}
