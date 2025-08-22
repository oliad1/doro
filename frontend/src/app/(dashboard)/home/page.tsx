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
  const [radarData, setRadarData] = useState<any[]>();
  const [visibleCourses, setVisibleCourses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingSummatives, setUpcomingSummatives] = useState<any[]>([]);

  const { term, termCourses } = useDashboardStore(
    (state) => state,
  );
  
  useEffect(() => {
    const fetchData = async () => {
      if (!term) return;
      try {
	const grades = await GradesAPIClient.getTermGrades(term);
	const formattedGrades = formatGrades(grades);
	setGrades(formattedGrades);
	const data = termCourses.map((course) => {
	  const courseKey = `${course.code}_average`
	  return {
	    code: course.code,
	    average: formattedGrades.filter((entry) => courseKey in entry).at(-1)?.[courseKey] ?? 0
	  }
	});
	setRadarData(data);
	const initState: Record<string, boolean> = {'average': false};
	termCourses.map((course)=>initState[course.code] = false);
	setVisibleCourses(initState);
      } finally {
	setIsLoading(false);
      }
    };

    fetchData();
  }, [term, termCourses]);

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
    <div className="grid xl:grid-cols-4 auto-rows-min gap-2 mx-2 my-4 h-min">
      <GradetimeChart
	grades={grades!}
	isLoading={isLoading}
	courses={termCourses.map((item)=>item.code)}
	visibleCourses={visibleCourses}
	onToggleCourse={handleToggleCourse}
      />
      <YearProgressChart />
      <HomeRadarChart chartData={radarData!} />
      <UpcomingSummativesTable 
	summatives={upcomingSummatives} 
	isLoading={isLoading}
      />
    </div>
  );
}
