"use client"
import DashboardSidebar from "@/components/DashboardSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ProfilesAPIClient from "@/APIClients/ProfilesAPIClient";
import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";
import { Term, TermCourse } from "@/types/Types";
import { CounterStoreProvider } from "@/providers/dashboard-store-provider";

interface DashboardProps {
    children: React.ReactNode,
}

export default function DashboardLayout({ children }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [termCourses, setTermCourses] = useState<TermCourse[]>([]);

  useEffect(() => {
    // Fetching the user data from the API
    const fetchUser = async () => {
      try {
	const user = await ProfilesAPIClient.getUser();
	setUser(user);
	// const res = await fetch("/api/getUser/")
	// const data = await res.json();
	// setUser(data.data.user || null);
      } catch (error) {
	console.error("Error fetching user data:", error);
      }
    };

    const fetchCourses = async (term: string) => {
      try {
	const termCourses = await EnrollmentsAPIClient.getCourses(term);
	setTermCourses(termCourses);
      } catch (error) {
	console.error("Error fetching courses:", error);
      }
    }

    fetchUser();
    //fetchCourses(term);
    setLoading(false);
  }, []);

  const addTermCourse = async (term: Term, course: TermCourse) => {
    termCourses?.push(course);
    setTermCourses(termCourses);
    const data = await EnrollmentsAPIClient.addCourse(course, term);
    if (!data) {
      toast.error("Database Error", {
	description: "Unable to store added course",
	richColors: true 
      });
    }
  }

  // TODO: Create a READ COOKIES API ENDPOINT FOR SIDEBAR PROVIDER OPEN={} 
  return <div className="flex flex-row overflow-x-hidden">
    <CounterStoreProvider>
      <SidebarProvider>
	<DashboardSidebar 
	  user={user}
	  loading={loading}
//	  courses={termCourses}
	/>
	<SidebarTrigger className="-ml-1 mx-2 my-4 px-2" />
	<SidebarInset>
	  {children}
	</SidebarInset>
      </SidebarProvider>
    </CounterStoreProvider>
  </div>
}
