"use client";

import { useEffect, useState } from "react";
import { GradetimeChart } from "@/components/GradetimeChart";
import { YearProgressChart } from "@/components/YearProgressChart";
import { UpcomingSummativesTable } from "@/components/UpcomingSummativesTable";
import ProfilesAPIClient from "@/APIClients/ProfilesAPIClient";
import { useCounterStore } from "@/providers/dashboard-store-provider";

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
  const [visibleCourses, setVisibleCourses] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [upcomingSummatives, setUpcomingSummatives] = useState<{ date: string, time: string, course: string, type: string }[]>([]);

  const { termCourses, addTermCourse, deleteTermCourse, term } = useCounterStore(
    (state) => state,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
	const mockGradeUpdates: GradeUpdate[] = [
	  { date: "01/02/2025", course: "Math", grade: 82 },
	  { date: "01/02/2025", course: "Science", grade: 75 },
	  { date: "01/02/2025", course: "English", grade: 88 },
	  { date: "01/02/2025", course: "History", grade: 80 },
	  { date: "01/02/2025", course: "Art", grade: 90 },
	  { date: "01/02/2025", course: "Engineering", grade: 78 },
	  { date: "01/13/2025", course: "Math", grade: 85 },
	  { date: "01/18/2025", course: "Science", grade: 78 },
	  { date: "01/18/2025", course: "English", grade: 86 },
	  { date: "01/12/2025", course: "History", grade: 82 },
	  { date: "01/18/2025", course: "Art", grade: 92 },
	  { date: "01/18/2025", course: "Engineering", grade: 80 },
	  { date: "02/10/2025", course: "Math", grade: 88 },
	  { date: "02/10/2025", course: "Science", grade: 80 },
	  { date: "02/10/2025", course: "English", grade: 89 },
	  { date: "02/10/2025", course: "History", grade: 85 },
	  { date: "02/10/2025", course: "Art", grade: 91 },
	  { date: "02/10/2025", course: "Engineering", grade: 99 },
	  { date: "02/20/2025", course: "Math", grade: 86 },
	  { date: "02/20/2025", course: "Science", grade: 82 },
	  { date: "02/20/2025", course: "English", grade: 90 },
	  { date: "02/20/2025", course: "History", grade: 83 },
	  { date: "02/20/2025", course: "Art", grade: 93 },
	  { date: "02/20/2025", course: "Engineering", grade: 85 },
	  { date: "03/01/2025", course: "Math", grade: 89 },
	  { date: "03/01/2025", course: "Science", grade: 84 },
	  { date: "03/01/2025", course: "English", grade: 88 },
	  { date: "03/01/2025", course: "History", grade: 86 },
	  { date: "03/01/2025", course: "Art", grade: 92 },
	  { date: "03/01/2025", course: "Engineering", grade: 87 },
	  { date: "03/13/2025", course: "Math", grade: 91 },
	  { date: "03/13/2025", course: "Science", grade: 86 },
	  { date: "03/13/2025", course: "English", grade: 92 },
	  { date: "03/13/2025", course: "History", grade: 88 },
	  { date: "03/13/2025", course: "Art", grade: 94 },
	  { date: "03/13/2025", course: "Engineering", grade: 89 },
	  { date: "03/28/2025", course: "Math", grade: 93 },
	  { date: "03/28/2025", course: "Science", grade: 88 },
	  { date: "03/28/2025", course: "English", grade: 91 },
	  { date: "03/28/2025", course: "History", grade: 90 },
	  { date: "03/28/2025", course: "Art", grade: 95 },
	  { date: "03/28/2025", course: "Engineering", grade: 91 },
	  { date: "04/02/2025", course: "Math", grade: 90 },
	  { date: "04/02/2025", course: "Science", grade: 87 },
	  { date: "04/02/2025", course: "English", grade: 93 },
	  { date: "04/02/2025", course: "History", grade: 89 },
	  { date: "04/02/2025", course: "Art", grade: 96 },
	  { date: "04/02/2025", course: "Engineering", grade: 90 },
	  { date: "04/12/2025", course: "Math", grade: 92 },
	  { date: "04/12/2025", course: "Science", grade: 89 },
	  { date: "04/12/2025", course: "English", grade: 94 },
	  { date: "04/12/2025", course: "History", grade: 91 },
	  { date: "04/12/2025", course: "Art", grade: 97 },
	  { date: "04/12/2025", course: "Engineering", grade: 92 },
	  { date: "04/30/2025", course: "Math", grade: 95 },
	  { date: "04/30/2025", course: "Science", grade: 91 },
	  { date: "04/30/2025", course: "English", grade: 96 },
	  { date: "04/30/2025", course: "History", grade: 93 },
	  { date: "04/30/2025", course: "Art", grade: 98 },
	  { date: "04/30/2025", course: "Engineering", grade: 94 },
	];

	setGradeUpdates(mockGradeUpdates);

	const uniqueCourses = Array.from(new Set(mockGradeUpdates.map(update => update.course)));
	// setCourses(uniqueCourses);

	const initialVisibleCourses = uniqueCourses.reduce((acc, course) => {
	  acc[course] = true;
	  return acc;
	}, {} as Record<string, boolean>);
	setVisibleCourses(initialVisibleCourses);

	// Mock data for upcoming summatives
	const mockSummatives = [
	  { date: "2025-01-15", time: "10:00 AM", course: "Math", type: "Test" },
	  { date: "2025-01-18", time: "2:00 PM", course: "Science", type: "Assignment" },
	  { date: "2025-01-22", time: "11:30 AM", course: "English", type: "Midterm" },
	  { date: "2025-01-25", time: "9:00 AM", course: "History", type: "Assignment" },
	  { date: "2025-01-29", time: "1:00 PM", course: "Art", type: "Project" },
	  { date: "2025-02-01", time: "3:00 PM", course: "Engineering", type: "Quiz" },
	  { date: "2025-02-05", time: "10:30 AM", course: "Math", type: "Assignment" },
	  { date: "2025-04-05", time: "10:30 AM", course: "Math", type: "Assignment" },
	];
	setUpcomingSummatives(mockSummatives);

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
	<div className="lg:col-span-3 h-fit w-full">
	  {isLoading? <p>Loading...</p>
	    : <GradetimeChart
	      isLoading={isLoading}
	      gradeUpdates={gradeUpdates}
	      courses={termCourses.map((item)=>item.code)}
	      visibleCourses={visibleCourses}
	      onToggleCourse={handleToggleCourse}
	    />}
	</div>
	<div className="lg:col-span-1 flex flex-col">
	  <div className="lg:row-span-1 flex flex-row">
	    <div className="mb-4 h-full">
	      <YearProgressChart 
		isLoading={isLoading}
	      />
	    </div>
	  </div>
	</div>
      </div>
      <div className="m-4">
	<UpcomingSummativesTable 
	  summatives={upcomingSummatives} 
	  isLoading={isLoading}
	/>
      </div>
    </>
  );
}
