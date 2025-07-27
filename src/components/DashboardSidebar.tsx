"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger, Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp, Home, Loader2, LogOut, Plus, Search, Settings, TrendingUp } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/actions/users";
import { Skeleton } from "./ui/skeleton";
import { navigate } from '@/actions/redirect';
import { LOGIN_PAGE } from '@/constants/Routes';
import { TERMS } from "@/constants/SidebarConstants";
import Link from 'next/link';
import React from "react";
import { Term } from "@/types/Types";
import { useCounterStore } from "@/providers/dashboard-store-provider";

interface SidebarProps {
  user: User | null | undefined,
  loading: boolean,
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

//TODO: Add a removeCourse function allowing the sidebar to delete courses 

export default function DashboardSidebar({ user, loading, /*term, setTerm*/ }: SidebarProps) {
  const { termCourses, term, setTerm, fetchTermCourses } = useCounterStore(
    (state) => state,
  );


  const [isPending, startTransition] = useTransition();

  const storeTerm = async (term: string) => {
    try {
      setTerm(term as Term);

      const response = await fetch('/api/cookies/term/', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify(term)
      });

      const { data, error } = await response.json();

      if (error) {
	console.error("Error setting term:", error);
	return;
      }
    } catch (error) {
      console.error("Error updating term:", error);
    } finally {
      console.log("TERM FETCH COMPLETED");
    }
  }

  const handleLoading = () => {
    startTransition(async () => {
      try {
	const error = await logoutAction();
	if (!error) {
	  console.log("Successfully logged out!");
	  navigate(LOGIN_PAGE);
	} else {
	  toast.error("Auth Error", {
	    description: "Unexpected error logging out",
	    richColors: true 
	  });
	}
      } catch (error) {
	toast.error("Auth Error", {
	  description: "Unexpected error logging out",
	  richColors: true 
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
	
	const { term } = data;
	setTerm(term);
	fetchTermCourses();
      } catch (error) {
	console.error("Error updating term:", error);
      } finally {
	console.log("TERM FETCH COMPLETED");
      }
    };

    fetchTerm();
  }, []);


  const { open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
	  <div className="flex flex-row overflow-hidden w-full gap-2 p-2 h-8 items-center text-left">
	    <TrendingUp />
	    {open && (
	      <span className="text-md font-semibold">Doro</span>
	    )}
	  </div>
      </SidebarHeader>

      <SidebarContent>
	<SidebarGroup>
	  <SidebarMenu>
	    {items.map((item) => (
	      <SidebarMenuItem key={item.title}>
		<Link id={item.url} href={`${process.env.NEXT_PUBLIC_SITE_URL}/${item.url}`} passHref>
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
		{TERMS.map((term) => (
		  <DropdownMenuItem key={term} onSelect={()=>storeTerm(term)}>
		    <span>{term}</span>
		  </DropdownMenuItem>
		))}
	      </DropdownMenuContent>
	      <SidebarGroupContent className="flex flex-col justify-center items-center w-full">
		{!termCourses || !termCourses?.length ?
		  <span>{open && !loading && "Enroll in some courses!"}</span>
		  : termCourses.map((course) =>
		    <a key={course.id} href={`/course/${course.id}`} className="w-full">
		      {<SidebarMenuButton className="px-5">
			<span>{course.code}</span>
		      </SidebarMenuButton>}
		    </a>
		  )}
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
			: <Avatar className="h-8 w-8 rounded-lg">
			  <AvatarImage src={user?.user_metadata?.avatar_url} />
			  <AvatarFallback className="rounded-lg"></AvatarFallback>
			</Avatar>
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
			    <span className="truncate font-semibold">{user?.user_metadata?.full_name}</span>
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
