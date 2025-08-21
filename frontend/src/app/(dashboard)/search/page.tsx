"use client"
import { Input } from "@/components/ui/input";
import { ChevronDown, FilterX, Plus, Search, Minus } from 'lucide-react';
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SEARCH_RESULTS } from "@/constants/SkeletonConstants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Pagination } from "@/components/ui/pagination";
import PaginationFooter from "@/components/Pagination/Pagination";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { DEPARTMENTS, FACULTIES, SearchParams } from '@/constants/SearchConstants';
import { DELETE_COURSE_HEADER } from "@/constants/DialogConstants";
import { useRouter } from 'next/navigation';
import { getSearchParams } from "@/utils/helpers";
import { CourseDTO } from "@/types/Types";
import { toast } from "sonner";
import { useDashboardStore } from "@/providers/dashboard-store-provider";
import OutlinesAPIClient from "@/APIClients/OutlinesAPIClient";

export default function SearchPage(searchParams: Promise<SearchParams>) {
  const router = useRouter();

  const { termCourses, addTermCourse, deleteTermCourse, term } = useDashboardStore(
    (state) => state,
  );

  const [facultyIndex, setFacultyIndex] = useState<number>();
  const [dept, setDept] = useState("Department");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CourseDTO[] | null>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const validFaculty = Number.isInteger(facultyIndex);

  useEffect(() => {
    router.push(
      getSearchParams({
	page: page.toString(),
	...(validFaculty) && { fac: facultyIndex!.toString() },
	dept: dept,
	search: search
      })
    , {
      scroll: false,
    });
  }, [facultyIndex, dept, page, search, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (value==="Enter"){
      setSearch(query);
      setPage(1);
    }
  }

  const handlePageChange = (value: number) => {
    setLoading(true);
    setPage(value);
  };

  const clearFilters = () => {
    setFacultyIndex(NaN);
    setDept("Department");
    setSearch("");
    setPage(1);
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      const { searchParams } = new URL(window.location.href);

      if (searchParams.has('page')){
	let pageVal = Number.parseInt(searchParams.get('page')!)!;
	setPage(pageVal > 0 ? pageVal : 1);
      }
      if (searchParams.has('search')){
	setQuery(searchParams.get('search')!)
      }
      if (searchParams.has('fac')){
	setFacultyIndex(Number.parseInt(searchParams.get('fac')!));
      }
      if (searchParams.has('dept')){
	setDept(searchParams.get('dept')!);
      }

      const { data, hasNextPage } = await OutlinesAPIClient.searchCourses(window.location.search, true) || {data: null, hasNextPage: false};

      setHasNextPage(hasNextPage);
      setResults(data!);
      setLoading(false);
    };
    fetchCourses();
  }, [searchParams]);


  return (
    <Pagination className="no-scrollbar">
      <div className="w-full mx-4">
	<div className="w-full sticky py-3 flex items-center justify-center gap-2">
	  <Input 
	    value={query.toUpperCase()}
	    onChange={handleSearch}
	    onKeyDown={handlePress}
	    placeholder="Search"
	    leadingIcon={<Search className="h-4" />}
	  />
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild className="faculty">
	      <Button variant="outline">
		{validFaculty ? FACULTIES[facultyIndex!] : "Faculty"}
		<ChevronDown />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent>
	      <DropdownMenuRadioGroup value={validFaculty ? FACULTIES[facultyIndex!] : ""}>
		{FACULTIES.map((facultyOption, i) => (
		  <DropdownMenuRadioItem
		    key={facultyOption}
		    value={facultyOption}
		    onSelect={() => { 
		      setLoading(true);
		      setFacultyIndex(i);
		      setSearch(query);
		      setDept("Department");
		      setPage(1);
		    }
		  }>
		  {facultyOption}
		  </DropdownMenuRadioItem>
		))}
	      </DropdownMenuRadioGroup>
	    </DropdownMenuContent>
	  </DropdownMenu>

	  <DropdownMenu>
	    <DropdownMenuTrigger asChild className="department">
	      <Button variant="outline">
		{dept}
		<ChevronDown />
	      </Button>
	    </DropdownMenuTrigger>
	    {validFaculty && (
	      <DropdownMenuContent>
		<DropdownMenuRadioGroup value={dept}>
		  {DEPARTMENTS[facultyIndex!].map((departmentOption) => (
		    <DropdownMenuRadioItem 
		      key={departmentOption} 
		      value={departmentOption}
		      onSelect={() => {
			setLoading(true);
			setDept(departmentOption); 
			setSearch(query);
			setPage(1);
		      }
		      }>
		      {departmentOption}
		    </DropdownMenuRadioItem>
		  ))}
		</DropdownMenuRadioGroup>
	      </DropdownMenuContent>
	    )}
	  </DropdownMenu>

	  <Button onClick={clearFilters}>
	    <FilterX/>
	  </Button>
	</div>

	<div ref={resultsRef} className="max-h-[80vh]">
	  {isLoading 
	    ? <SEARCH_RESULTS />
	    : <Accordion type="single" collapsible className="w-full">
		{!results || !results[0]
		  ? <p className="leading-7 [&:not(:first-child)]:mt-6">No results.</p>
		  : results.map((result, i) => {
		    const courseEnrolled = termCourses.some((course) => course.code == result.code);
		    return (
		      <AlertDialog key={i}>
		      <AccordionItem value={i.toString()} className="border rounded-md mb-3 overflow-hidden">
			<div data-course={i.toString()} className="flex items-center space-x-4 p-4">
			  <div className="flex-1 space-y-1">
			    <p className="text-sm font-medium leading-none">
			      {result.code}
			    </p>
			    <p className="text-sm text-muted-foreground">
			      {result.name}
			    </p>
			  </div>
			  <div className="flex items-center space-x-2">
			    <AccordionTrigger className="p-0 size-8" onClick={(e) => e.stopPropagation()} />
			    {courseEnrolled
			      ? <AlertDialogTrigger asChild>
				<Button
				  variant="ghost"
				  className="p-0 size-8"
				>
				  <Minus className="size-4" />
				</Button>
			      </AlertDialogTrigger>
			      : <Button 
				variant="ghost"
				className="p-0 size-8"
				onClick={async () => {
				  await addTermCourse({id: result.id, code: result.code});
				  toast.success(`Added ${result.code} to ${term}`, {
				    richColors: true
				  });
				}}
			      >
				<Plus className="size-4" />
			      </Button>}
			    <AlertDialogContent>
			      < DELETE_COURSE_HEADER />
			      <AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<AlertDialogAction
				  onClick={async () => {
				    await deleteTermCourse(termCourses.find((item)=>item.code==result.code)!.id);
				    toast.info(`Removed ${result.code} from ${term}`, {
				      richColors: true
				    });
				  }}
				>
				  Continue
				</AlertDialogAction>
			      </AlertDialogFooter>
			    </AlertDialogContent>
			    {/*
			      <Button
				className="p-0 h-8 w-8"
				variant="ghost"
				onClick={(e) => {
				  e.stopPropagation();
				  togglePin(result);
				}}
			      >
				<span className="pin-icon transition-transform duration-300">
				  {pinnedItems.includes(result.id) ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
				</span>
			      </Button>
			      */}
			  </div>
			</div>
			<AccordionContent>
			  <div className="px-4 pb-0">
			    <p className="text-sm text-muted-foreground">{result.description}</p>
			  </div>
			</AccordionContent>
		      </AccordionItem>
		    </AlertDialog>
		  )}
		)}
	    </Accordion>}
	  
	  <PaginationFooter
	    page={page}
	    incrementPage={() => handlePageChange(page+1)}
	    decrementPage={() => handlePageChange(page-1)}
	    resetPage={() => handlePageChange(1)}
	    hasNextPage={hasNextPage}
	  />
	</div>
      </div>
    </Pagination>
  );
}
