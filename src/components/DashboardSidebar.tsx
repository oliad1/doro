"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp, Home, Loader2, LogOut, Plus, Search, Settings } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/actions/users";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { navigate } from '@/actions/redirect';
import { LOGIN_PAGE } from '@/constants/Routes';
import Link from 'next/link';
import React from "react";

interface SidebarProps {
  user: User | null | undefined,
  loading: boolean,
}

interface JSONData {
  id: string,
  code: string,
}

interface Terms {
  [key: number]: JSONData[]
}

const items = [
  {
    title: "Home",
    url: "home",
    icon: Home
  },
  {
    title: "Search",
    url: "search?page=1",
    icon: Search
  },
]

interface TermData {
  title: string,
  index: number
}

const terms: TermData[] = [
  { 
    title: "1A",
    index: 0 
  },
  {
    title: "1B",
    index: 1
  },
  {
    title: "2A",
    index: 2
  },
  {
    title: "2B",
    index: 3
  },
  {
    title: "3A",
    index: 4
  },
  {
    title: "3B",
    index: 5
  },
  {
    title: "4A",
    index: 6
  },
  {
    title: "4B",
    index: 7
  },
]

export default function DashboardSidebar({ user, loading }: SidebarProps) {
  const [term, setTerm] = useState("1A")
  const [termIndex, setTermIndex] = useState<number>(0);
  const [courses, setCourses] = useState<Terms>()
  const [isPending, startTransition] = useTransition();

  const fetchCourses = async () => {
    try {
      // GET Request
      const response = await fetch('/api/cookies/courses')

      if (!response.ok) {
	const err = await response.json();
	console.error("Error updating courses:", err.error || "Unknown error");
	return;
      }

      const { courses } = await response?.json();
  
      if (courses) {
	setCourses(courses);
      }
    } catch (error) {
      console.error("Error updating courses:", error);
    } finally {
      console.log("COURSE FETCH COMPLETED");
    }
  };

  const storeTerm = async (term: TermData) => {
    try {
      // GET Request
      const payload = {
	value: JSON.stringify(term)
      }

      const response = await fetch('/api/cookies/term/', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify(payload)
      });

      const { data, error } = await response.json();

      if (error) {
	console.error("Error setting term:", error);
	return;
      }

      setTerm(term.title)
      setTermIndex(term.index)
    } catch (error) {
      console.error("Error updating term:", error);
    } finally {
      console.log("TERM FETCH COMPLETED");
    }
  }

  const handleClick = (id: string) => {
    fetchCourses()
  }

  const handleSelect = (term: TermData) => {
    storeTerm(term)
  }

  const handleLoading = () => {
    startTransition(async () => {
      try {
	const error = await logoutAction();
	console.log("LOGGING OUT", error);
	if (!error) {
	  console.log("Successfully logged out!");
	  navigate(LOGIN_PAGE);
	} else {
	  toast({
	    title: "Auth Error",
	    description: "Error logging out"
	  });
	}
      } catch (error) { //TODO: I don't think toast works
	toast({
	  title: "Auth Error",
	  description: "Unexpected error logging out"
	});
      }
    })
  }

  useEffect(() => {
    // Fetching the user data from the API
    const fetchTerm = async () => {
      try {
	// GET Request
	const response = await fetch('/api/cookies/term');
	const { data, error } = await response.json();

	if (error) {
	  console.error("Error fetching term:", error);
	  return;
	}

	if (!data){
	  console.error("No term data returned (client side)", data)
	  return;
	}

	const parsedData = JSON.parse(data)

	setTerm(parsedData.title);
	setTermIndex(parsedData.index);
      } catch (error) {
	console.error("Error updating term:", error);
      } finally {
	console.log("TERM FETCH COMPLETED");
      }
    };

    fetchCourses();
    fetchTerm();
  }, []);


  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
	<SidebarTrigger className="-ml-1 mx-0.5 px-2" />
      </SidebarHeader>

      <SidebarContent>
	<SidebarGroup>
	  <SidebarMenu>
	    {items.map((item) => (
	      <SidebarMenuItem key={item.title}>
		<Link id={item.url} href={`${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`} passHref>
		  <SidebarMenuButton asChild>
		    <div>
		      < item.icon />
		      <span>{item.title}</span>
		    </div>
		  </SidebarMenuButton>
		</Link>
	      </SidebarMenuItem>
	    ))}
	  </SidebarMenu>
	</SidebarGroup>

	<SidebarGroup>
	  <SidebarMenu>
	    <DropdownMenu>
	      <DropdownMenuTrigger asChild>
		<SidebarMenuButton>
		  {loading ?
		    <Skeleton className="h-4 w-[30px]" />
		    : <SidebarGroupLabel>{term}</SidebarGroupLabel>
		  }
		  <div className="
		    absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0
		    after:absolute after:-inset-2 after:md:hidden,
		    group-data-[collapsible=icon]">
		    <ChevronDown /> <span className="sr-only">Select Term</span>
		  </div>
		</SidebarMenuButton>
	      </DropdownMenuTrigger>
	      <DropdownMenuContent side="bottom" className="w-[--radix--popper-anchor-width]">
		{terms.map((term) => (
		  <DropdownMenuItem key={term.index} onSelect={() => handleSelect(term)}>
		    <span>{term.title}</span>
		  </DropdownMenuItem>
		))}
	      </DropdownMenuContent>
	      <SidebarGroupContent>
		{!courses || !courses[termIndex] || courses[termIndex].length === 0 ?
		  <p className="pl-2 md:invisible">Enroll in some courses!</p>
		  : courses[termIndex].map((course) =>
		    <a key={course.id} href={`/course/${course.id}`}>
		      {<SidebarMenuButton>
			<span>{course.code}</span>
		      </SidebarMenuButton>}
		    </a>
		  )}
		{/* :
			    <p>{courses.toString()}</p>
			    } */}
	      </SidebarGroupContent>
	    </DropdownMenu>
	  </SidebarMenu>
	</SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
	<SidebarMenu>
	  <SidebarMenuItem>
	    <DropdownMenu>
	      <DropdownMenuTrigger asChild>
		<SidebarMenuButton
		  size="lg"
		  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
		>
		  {!isPending ?
		    <>
		      {loading ?
			<Skeleton className="h-8 w-8 rounded-lg" />
			: <>
			  <Avatar className="h-8 w-8 rounded-lg">
			    <AvatarImage src={user?.user_metadata.avatar_url} />
			    <AvatarFallback className="rounded-lg"></AvatarFallback>
			  </Avatar>
			</>
		      }
		      <div className="grid flex-1 text-left text-sm leading-tight">
			{loading ?
			  <>
			    <Skeleton className="h-3 w-[90px]" />
			    <div className="h-2"></div>
			    <Skeleton className="h-2 w-[120px]" />
			  </>
			  :
			  <>
			    <span className="truncate font-semibold">{user?.user_metadata.full_name}</span>
			    <span className="truncate text-xs">{user?.email}</span>
			  </>
			}
		      </div>
		      <ChevronsUpDown className="ml-auto size-4" />
		    </>
		    : <div className="flex items-center w-full justify-center">
		      <Loader2 className="animate-spin" />
		    </div>
		  }
		</SidebarMenuButton>
	      </DropdownMenuTrigger>
	      <DropdownMenuContent
		className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
		side={"top"}
		sideOffset={4}
	      >
		<DropdownMenuItem onClick={() => handleLoading()}>
		  <LogOut />
		  Log out
		</DropdownMenuItem>
	      </DropdownMenuContent>
	    </DropdownMenu>
	  </SidebarMenuItem>
	</SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
