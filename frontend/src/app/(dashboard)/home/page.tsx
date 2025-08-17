"use client";

import { useEffect, useState } from "react";
import { GradetimeChart } from "@/components/Home/GradetimeChart";
import { YearProgressChart } from "@/components/Home/YearProgressChart";
import { UpcomingSummativesTable } from "@/components/Home/UpcomingSummativesTable";
import GradesAPIClient from "@/APIClients/GradesAPIClient";
import { useDashboardStore } from "@/providers/dashboard-store-provider";
import HomeRadarChart from "@/components/Home/HomeRadarChart";
import { formatGrades } from "@/utils/helpers";
//import { HomeGradeDTO } from "@/types/Types";

export default function Dashboard() {
  const [grades, setGrades] = useState<any[]>();
  const [visibleCourses, setVisibleCourses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingSummatives, setUpcomingSummatives] = useState<any[]>([]);
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

  const { term, termCourses } = useDashboardStore(
    (state) => state,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
	const grades = await GradesAPIClient.getTermGrades(term || "1A");
	const formattedGrades = formatGrades(grades);
	console.log("FORMATTED ", formattedGrades);
	setGrades(formattedGrades);
      } catch (error) {
	console.error("Error fetching data:", error);
      } finally {
	setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleToggleCourse = (course: string) => {
    setVisibleCourses(prev => {
      const newState = { ...prev };

      if (course==="all") {
	if (!newState.all) {
	  newState.all = false;
	}

	Object.entries(newState).forEach(([key, _]) => {
	  newState[key] = !newState.all;
	});
      } else {
	if (newState.all) {
	  newState.all = false;
	}

	newState[course] = !prev[course];
      }
      console.log("NEW STATE", newState);
      return newState;
    });
  };

  return (
    <div className="grid lg:grid-cols-4 lg:grid-rows-3 gap-2 mx-2 my-4">
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
