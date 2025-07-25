"use client";

import { useEffect, useState } from "react";
import { GradetimeChart } from "@/components/GradetimeChart";
import { YearProgressChart } from "@/components/YearProgressChart";
import { UpcomingSummativesTable } from "@/components/UpcomingSummativesTable";
import GradesAPIClient from "@/APIClients/GradesAPIClient";
import { useCounterStore } from "@/providers/dashboard-store-provider";
import { TermCourse } from "@/types/ProfileTypes";
import HomeRadarChart from "@/components/Home/HomeRadarChart";

interface GradeUpdate {
  date: string;
  course: string;
  grade: number;
}

interface JSONData {
  id: string,
  code: string,
}

interface Terms {
  [key: number] : JSONData[]
}

export default function Dashboard() {
  const [gradeUpdates, setGradeUpdates] = useState<GradeUpdate[]>([]);
  const [grades, setGrades] = useState<TermCourse[] | null>();
  const [visibleCourses, setVisibleCourses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingSummatives, setUpcomingSummatives] = useState<{ date: string, time: string, course: string, type: string }[]>([]);
  const radarChartData = [
    {
      code: "ECE 222",
      average: 89
    },
    {
      code: "ECE 444",
      average: 72
    },
    {
      code: "ECE 333",
      average: 79
    },
    {
      code: "ECE 111",
      average: 65
    },
    {
      code: "ECE 667",
      average: 100
    },
  ];

  const { termCourses, addTermCourse, deleteTermCourse, term } = useCounterStore(
    (state) => state,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
	const grades = await GradesAPIClient.getTermGrades(termCourses);
	setGrades(grades);
	setIsLoading(false);
      } catch (error) {
	console.error("Error fetching data:", error);
	// setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleCourse = (course: string) => {
    setVisibleCourses(prev => ({
      ...prev,
      [course]: !prev[course]
    }));
  };

  return (
    <div className="grid lg:grid-cols-4 lg:grid-rows-3 gap-4 p-4">
      <GradetimeChart
	grades={grades!}
	isLoading={isLoading}
	courses={termCourses.map((item)=>item.code)}
	visibleCourses={visibleCourses}
	onToggleCourse={handleToggleCourse}
      />
      <YearProgressChart />
      <HomeRadarChart chartData={radarChartData} />
      <UpcomingSummativesTable 
	summatives={upcomingSummatives} 
	isLoading={isLoading}
      />
    </div>
  );
}
