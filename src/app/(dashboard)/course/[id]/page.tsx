"use client"
import { ChartConfig } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";
import { getCourseStats, getMovingAverage } from "@/utils/helpers";
import { toast } from "sonner";
import CourseCompletionChart from "@/components/Course/CourseCompletionChart";
import CourseStatCard from "@/components/Course/CourseStatCard";
import CourseWeightChart from "@/components/Course/CourseWeightChart";
import GradeTable from "@/components/Course/GradeTable";
import CourseAverageChart from "@/components/Course/CourseAverageChart";
import CoursePersonnelCard from "@/components/Course/CoursePersonnelCard";
import { CourseAverageData } from "@/types/Types";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [enrollmentId, setEnrollmentId] = useState<string>()
  const [courseMetadata, setCourseMetadata] = useState<any>();
  const [personnelData, setPersonnelData] = useState<any[] | null>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [recalculate, setRecalculate] = useState<boolean>(false);
  const [average, setAverage] = useState<number>(0);
  const [completion, setCompletion] = useState<number>(0);
  const [chartData, setChartData] = useState();
  const [averageChartData, setAverageChartData] = useState<CourseAverageData[]>();
  const [chartConfig, setChartConfig] = useState<ChartConfig>();

  useEffect(() => {
    const fetchCoursesInit = async () => {
      const enrollmentId = (await params).id

      if (enrollmentId) {
	setEnrollmentId(enrollmentId);
      }

      toast.loading("Loading Grades", {
	id: 0,
	richColors: true
      });

      const data = await EnrollmentsAPIClient.getEnrollment(enrollmentId);

      setCourseMetadata(data);
      setPersonnelData(data.personnels);

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
	  fill: `var(--chart-${index+1})` 
	}
      });

      setChartData(chartData);

      // Initialize an empty object for chartConfig
      const updatedChartConfig: ChartConfig = {};

      // Loop over the assessments and populate the chartConfig
      data.assessment_groups.forEach((assessment: any) => {
	updatedChartConfig[assessment.name] = {
	  label: assessment.name,
	  color: "var(--chart-5)",
	};
      });

      // setChartData(chartData);
      setChartConfig(updatedChartConfig);

      setLoading(false);
    };

    fetchCoursesInit();
  }, []);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseMetadata || !courseMetadata.assessment_groups || !enrollmentId) return;

      const { newAverage, newCompletion } = getCourseStats(courseMetadata.assessment_groups);
      const newChartData = getMovingAverage(courseMetadata.assessment_groups);

      setAverageChartData(newChartData);
      setAverage(newAverage || 0);
      setCompletion(newCompletion || 0);

      // Initialize an empty object for chartConfig
      const updatedChartConfig: ChartConfig = {};

      // Loop over the assessments and populate the chartConfig
      courseMetadata.assessment_groups.forEach((assessment: any) => {
	updatedChartConfig[assessment.name] = {
	  label: assessment.name,
	  color: "var(--chart-5)",
	};
      });

      // setChartData(chartData);
      setChartConfig(updatedChartConfig);

      setLoading(false);
      setRecalculate(false);
    }

    fetchCourseData();
  }, [recalculate]);

  const updateMetadata = (gradeObj: any[], upsert: boolean, grade?: number) => {
    const newData = { ... courseMetadata };

    const { assessments, id, submitted_at } = gradeObj;
    const group_id = assessments.assessment_groups.id; 
    const assessment_id = assessments.id;

    newData.assessment_groups.forEach((assessment_group: any) => {
      if (assessment_group.id === group_id) {
	assessment_group.assessments.forEach((assessment: any) => {
	  if (assessment.id === assessment_id) {
	    if (upsert) {
	      assessment.grades = [
		{
		  ...assessment.grades[0],
		  assessment_id: assessment_id,
		  grade: grade,
		  id: id,
		  submitted_at: submitted_at
		}
	      ];
	    } else {
	      assessment.grades = [];
	    }
	  }
	}
	)}
    });

    setCourseMetadata(newData);
    setRecalculate(true);
  }


  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-2 p-4">
      <div className="flex flex-col col-span-2 h-min space-y-2 min-w-0">
	<GradeTable
	  isLoading={isLoading}
	  courseMetadata={courseMetadata}
	  upsertMetadata={(gradeObj: any[], grade: number) => updateMetadata(gradeObj, true, grade)}
	  deleteMetadata={(gradeObj: any[]) => updateMetadata(gradeObj, false)}
	  enrollmentId={enrollmentId!}
	/>
	<CoursePersonnelCard
	  data={personnelData || []}
	/>
      </div>
      <div className="grid col-span-2 space-y-2 h-min min-w-0">
	<CourseStatCard
	  average={average} 
	  completion={completion}
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
	  averageChartData={averageChartData || []}
	/>
      </div>
    </div>
  )
}
