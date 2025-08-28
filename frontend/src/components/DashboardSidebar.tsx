"use client"
import { useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarMenuAction } from "@/components/ui/sidebar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ChevronDown, ChevronsUpDown, Home, Loader2, LogOut, Search, TrendingUp, Trash2, RefreshCcw, Globe, SquarePlus, BadgeCheckIcon, CircleDot, ExternalLink, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Term } from "@/types/Types";
import { logoutAction } from "@/actions/users";
import { navigate } from '@/actions/redirect';
import { LOGIN_PAGE, SEARCH_PAGE, UW_FLOW_PAGE, OUTLINE_PAGE } from '@/constants/Routes';
import { STUDY_TERMS, WORK_TERMS } from "@/constants/SidebarConstants";
import { DELETE_COURSE_HEADER } from "@/constants/DialogConstants";
import { useDashboardStore } from "@/providers/dashboard-store-provider";
import CookiesAPIClient from "@/APIClients/CookiesAPIClient";
import { exportCalendar } from "@/utils/helpers";

interface SidebarProps {
  user: User | null | undefined,
  loading: boolean,
}

const items = [
  {
    title: "Home",
    url: "home",
    icon: Home,
    beta: false,
  },
  {
    title: "Search",
    url: "search?page=1",
    icon: Search,
    beta: false,
  },
  {
    title: "Community",
    url: "community",
    icon: Globe,
    beta: false,
  },
  {
    title: "Create",
    url: "create",
    icon: SquarePlus,
    beta: true,
  }
]

export default function DashboardSidebar({ user, loading }: SidebarProps) {
  const router = useRouter();

  const { termCourses, term, setTerm, fetchTermCourses, deleteTermCourse } = useDashboardStore(
    (state) => state,
  );
  
  const { open, setOpen } = useSidebar();

  useEffect(() => {
    const fetchTerm = async () => {
      const fetchedTerm = await CookiesAPIClient.getTerm();
      console.log(termCourses);
      if (fetchedTerm!=term) {
	setTerm(fetchedTerm as Term);
      } else {
	fetchTermCourses();
      }
    };

    const fetchSidebarOpen = async () => {
      const open = await CookiesAPIClient.getSidebarOpen();
      console.log(open);
      setOpen(open!);
    }

    fetchSidebarOpen();
    fetchTerm();
  }, []);

  const [isPending, startTransition] = useTransition();

  const storeTerm = async (term: string) => {
    setTerm(term as Term);
    CookiesAPIClient.setTerm(term as Term);
  }

  const handleLoading = () => {
    startTransition(async () => {
      try {
	toast.loading("Logging out", {
	  id: "logout",
	  richColors: true
	});
	const error = await logoutAction();

	if (error) {
	  throw new Error(`Error: ${error}`);
	}
	toast.dismiss("logout");
	navigate(LOGIN_PAGE);
	toast.success("Successfully logged out", {
	  richColors: true
	});
      } catch (error) {
	toast.dismiss("logout");
	toast.error("Auth Error", {
	  description: "Unexpected error logging out",
	  richColors: true 
	});
      }
    })
  }
  
  const pathname = usePathname();

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
	    {items.map((item) => {
	      const currentPage = ('/'+item.url).includes(pathname);
	      return (
		<SidebarMenuItem key={item.title}>
		  <Link id={item.url} href={`${process.env.NEXT_PUBLIC_SITE_URL}/${item.url}`} passHref>
		    <SidebarMenuButton
		      className={currentPage?"bg-sidebar-accent":""}
		      asChild
		    >
		      <div>
			< item.icon />
			<span>{item.title}</span>
			{(item.beta) && (
			  <Badge variant="secondary" className="bg-[var(--primary)]/30 py-0 rounded-md">beta</Badge>
			)}
		      </div>
		    </SidebarMenuButton>
		  </Link>
		</SidebarMenuItem>
	      )
	    })}
	  </SidebarMenu>
	</SidebarGroup>

	<SidebarGroup>
	  <SidebarMenu>
	    <DropdownMenu>
	      <DropdownMenuTrigger asChild>
		<SidebarMenuButton>
		  {loading 
		    ? <Skeleton className="h-4 w-[30px]" />
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
	      <DropdownMenuContent side="bottom" className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
		{STUDY_TERMS.map((term) => (
		  <DropdownMenuItem key={term} onSelect={()=>storeTerm(term)}>
		    <span>{term}</span>
		  </DropdownMenuItem>
		))}
		<DropdownMenuSeparator />
		{WORK_TERMS.map((term) => (
		  <DropdownMenuItem key={term} onSelect={()=>storeTerm(term)}>
		    <span>{term}</span>
		  </DropdownMenuItem>
		))}
	      </DropdownMenuContent>
	      <SidebarGroupContent className="flex flex-col justify-center items-center w-full">
		{!termCourses || !termCourses?.length 
		  ? <>{open && !loading && (
		    <Link href={SEARCH_PAGE}>
		      <Button className="mt-2">
			<Search/>
			Find some courses 
		      </Button>
		    </Link>
		  )}</>
		  : termCourses.map((course, i) => {
		    const currentPage = pathname.includes(course.id);
		    return (
		      <AlertDialog key={course.id}>
			<SidebarMenuItem
			  className="w-full"
			>
			  <Link
			    key={course.id}
			    href={`/course/${course.id}`}
			    aria-disabled={currentPage}
			    className={"w-full disabled"}
			  >
			    <SidebarMenuButton 
			      className={"px-5 "+(currentPage?"bg-sidebar-accent":"")}>
			      <span className="whitespace-nowrap max-w-[70%] truncate">{course.code}</span>
			      {course.verified && open && <BadgeCheckIcon/>}
			    </SidebarMenuButton>
			  </Link>
			  <DropdownMenu>
			    <DropdownMenuTrigger asChild>
			      <SidebarMenuAction> 
				<MoreHorizontal />
			      </SidebarMenuAction>
			    </DropdownMenuTrigger>
			    <DropdownMenuContent side="right" align="start">
			      <DropdownMenuItem disabled>
				<RefreshCcw/>
				<span>Remix Course</span>
			      </DropdownMenuItem>
			      {(course.verified) && (
				<>
				  <a href={UW_FLOW_PAGE+course.code.split("/")[0].toLowerCase().replaceAll(" ", "")}
				    target="_blank" className="w-[--webkit-fill-available]">
				    <DropdownMenuItem>
				      <CircleDot/>
				      UW Flow
				    </DropdownMenuItem>
				  </a>
				  {(course.url) && (
				    <a href={OUTLINE_PAGE+course.url} target="_blank" className="w-[--webkit-fill-available]">
				      <DropdownMenuItem>
					<ExternalLink/>
					Official Outline
				      </DropdownMenuItem>
				    </a>
				  )}
				</>
			      )}
			      <DropdownMenuItem onClick={()=>exportCalendar(course.id, course.code)}>
				<Calendar/>
				Export Calendar
			      </DropdownMenuItem>
			      <AlertDialogTrigger asChild>
				<DropdownMenuItem variant="destructive">
				  <Trash2 />
				  <span>Drop Course</span>
				</DropdownMenuItem>
			      </AlertDialogTrigger>
			    </DropdownMenuContent>
			  </DropdownMenu>
			</SidebarMenuItem>
			<AlertDialogContent>
			  < DELETE_COURSE_HEADER />
			  <AlertDialogFooter>
			    <AlertDialogCancel>Cancel</AlertDialogCancel>
			    <AlertDialogAction
			      onClick={()=>{
				if (pathname.includes(course.id)) {
				  const nextId = i==0 ? i + 1 : i - 1;
				  router.push(
				    (termCourses.length > 1)?`/course/${termCourses[nextId].id}`:`/home`
				  );
				}
				deleteTermCourse(course.id);
			      }}
			    >
			      Continue
			    </AlertDialogAction>
			  </AlertDialogFooter>
			</AlertDialogContent>
		      </AlertDialog>
		    )
		  })}
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
		      <Avatar className="h-8 w-8 rounded-lg">
			<AvatarImage src={user?.user_metadata?.avatar_url} />
			<AvatarFallback className="rounded-lg"></AvatarFallback>
		      </Avatar>
		      <div className="grid flex-1 text-left text-sm leading-tight">
			{loading ?
			  <>
			    {open && (
			      <>
				<Skeleton className="h-3 w-[90px]" />
				<div className="h-2"></div>
				<Skeleton className="h-2 w-[120px]" />
			      </>
			    )}
			  </>
			  :
			  <>
			    <span className="truncate font-semibold">{user?.user_metadata?.full_name}</span>
			    <span className="truncate text-xs">{user?.email}</span>
			  </>
			}
		      </div>
		      {open && (
			<ChevronsUpDown className="size-4" />
		      )}
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
