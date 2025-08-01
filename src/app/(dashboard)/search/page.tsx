"use client"
import { Input } from "@/components/ui/input";
import { ChevronDown, FilterX, Pin, PinOff, Plus, Search, Minus } from 'lucide-react';
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DEPARTMENTS, FACULTIES, SearchParams } from '@/constants/SearchConstants';
import { useRouter } from 'next/navigation';
import { getSearchParams } from "@/utils/helpers";
import { CourseDTO } from "@/types/Types";
import { toast } from "sonner";
import { useDashboardStore } from "@/providers/dashboard-store-provider";

export default function SearchPage(searchParams: Promise<SearchParams>) {
  const router = useRouter();

  const { termCourses, addTermCourse, deleteTermCourse, term } = useDashboardStore(
    (state) => state,
  );

  const [faculty, setFaculty] = useState("Faculty");
  const [facultyIndex, setFacultyIndex] = useState<number>(0);
  const [dept, setDept] = useState("Department");
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CourseDTO[]>([]);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    router.push(
      getSearchParams({
	page: page.toString(),
	facName: faculty,
	fac: facultyIndex.toString(),
	dept: dept,
	search: search
      })
    , {
      scroll: false,
    });
  }, [faculty, dept, page, search, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // applySearch(value);
  };

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (value==="Enter"){
      setSearch(query);
      setPage(1);
    }
  }

  const clearFilters = () => {
    setFaculty("Faculty");
    setFacultyIndex(0);
    setDept("Department");
    setSearch("");
    setPage(1);
  }

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
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
	  setFaculty(FACULTIES.find(item => item.index == (searchParams.get('fac') ?? 0))!.title)
	}
	if (searchParams.has('dept')){
	  setDept(searchParams.get('dept')!);
	}

	const res = await fetch(`/api/search/courses${window.location.search}`);
	const { ids, courseCodes, courseNames, courseDescriptions, error } = await res.json();

	if (error) {
	  console.error("ERROR ", error);
	  return;
	}

	if (!courseCodes || !courseCodes[0]) {
	  console.log("No courses returned by API.");
	  setCourses(courseCodes);
	  setResults(courseCodes);
	  return;
	}

	const combinedData = ids.map((id: string, index: number) => ({
	  id: id,
	  code: courseCodes[index],
	  name: courseNames[index],
	  description: courseDescriptions[index]
	}));

	console.log("IMPORTANT INFO: ", combinedData)

	setCourses(combinedData);
	setResults(combinedData);
      } catch (error) {
	console.error("Error fetching course data:", error);
      } finally {
	setLoading(false);
      }
    };
    fetchCourses();
  }, [searchParams]);

  return (
    <Pagination className="no-scrollbar">
      <div className="w-full mx-4">
	<div className="w-full sticky py-3 flex items-center justify-center gap-2">
	  <Input value={query.toUpperCase()} onChange={handleSearch} onKeyDown={handlePress} placeholder="Search" leadingIcon={<Search className="h-4" />} />
	  <DropdownMenu>
	    <DropdownMenuTrigger asChild className="faculty">
	      <Button variant="outline">
		{faculty}
		<ChevronDown />
	      </Button>
	    </DropdownMenuTrigger>
	    <DropdownMenuContent>
	      <DropdownMenuRadioGroup value={FACULTIES[facultyIndex].title}>
		{FACULTIES.map((facultyOption) => (
		  <DropdownMenuRadioItem
		    key={facultyOption.index}
		    value={facultyOption.title}
		    onSelect={() => { 
		      setLoading(true);
		      setFaculty(facultyOption.title);
		      setFacultyIndex(facultyOption.index);
		      setSearch(query);
		      setDept("Department");
		      setPage(1);
		    }
		  }>
		  {facultyOption.title}
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
	    <DropdownMenuContent>
	      <DropdownMenuRadioGroup value={dept}>
		{DEPARTMENTS[facultyIndex].map((departmentOption) => (
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
	  </DropdownMenu>

	  <Button onClick={clearFilters}>
	    <FilterX/>
	  </Button>
	</div>

	<div ref={resultsRef} className="max-h-[80vh]">
	  {isLoading ? (
	    Array.from({ length: 11 }, (_, index) => (
	    <Accordion key={index} type="single" collapsible className="w-full">
	      <AccordionItem value={""} className="border rounded-md mb-3 overflow-hidden">
		{/*<div key={index} className="flex items-center space-x-4 rounded-md border p-4 mb-3">*/}
		<div className="flex items-center space-x-4 p-4">
		  <div className="flex-1 space-y-1">
		    <Skeleton className="w-[72px]">
		      <p  className="text-sm font-medium leading-none opacity-0">
			Placeholder
		      </p>
		    </Skeleton>
		    <Skeleton className="w-[336px]">
		      <p className="text-sm text-muted-foreground opacity-0">
			Placeholder
		      </p>
		    </Skeleton>
		  </div>
		  <div className="flex items-center space-x-2">
		    <AccordionTrigger className="p-0 h-8 w-8" />
		    <Button variant="ghost" className="p-0 h-8 w-8">
		      <Plus className="h-4 w-4" />
		    </Button>
		      {/*
		    <Button className="p-0 h-8 w-8" variant="ghost">
		      <span className="pin-icon transition-transform duration-300">
			<Pin className="h-4 w-4" />
		      </span>
		    </Button>
		      */}
		  </div>
		</div>
		</ AccordionItem>
	      </Accordion>
	    ))
	  ) : (
	      <Accordion type="single" collapsible className="w-full">
		{
		  (!results) ?
		    <p className="leading-7 [&:not(:first-child)]:mt-6">No results.</p>
		    : results.map((result) => { 
		      const courseEnrolled = termCourses.some((course) => course.id === result.id);
		      return (
			<AccordionItem key={result.id} value={result.id} className="border rounded-md mb-3 overflow-hidden">
			  <div data-course={result.id} className="flex items-center space-x-4 p-4">
			    <div className="flex-1 space-y-1">
			      <p className="text-sm font-medium leading-none">
				{result.code}
			      </p>
			      <p className="text-sm text-muted-foreground">
				{result.name}
			      </p>
			    </div>
			    <div className="flex items-center space-x-2">
			      <AccordionTrigger className="p-0 h-8 w-8" onClick={(e) => e.stopPropagation()}>
			      </AccordionTrigger>
			      <Button 
				variant="ghost"
				className="p-0 h-8 w-8"
				onClick={()=>{
				  if (courseEnrolled) {
				    deleteTermCourse({id: result.id, code: result.code});
				    toast.info(`Removed ${result.code} from ${term}`, {
				      richColors: true
				    });
				    return;
				  }
				  addTermCourse({id: result.id, code: result.code});
				  toast.success(`Added ${result.code} to ${term}`, {
				    richColors: true
				  });
				}}
			      >
				{courseEnrolled
				    ? <Minus className="h-4 w-4" />
				    : <Plus className="h-4 w-4" /> }
			      </Button>
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
		      )}
		    )}
	      </Accordion>
	    )}

	    <PaginationContent className="w-full flex flex-row justify-center items-center py-5 h-min">
	    {page > 1 && (
	      <>
		<PaginationItem>
		  <PaginationPrevious 
		    style={{ userSelect: "none" }}
		    onClick={()=>{
		      setLoading(true);
		      setPage(page-1)
		      }
		    }
		  />
		</PaginationItem>
		<PaginationItem>
		  <PaginationLink 
		    style={{ userSelect: "none" }}
		    onClick={()=>{
		      setLoading(true);
		      setPage(1)
		      }
		    }
		  >
		    1
		  </PaginationLink>
		</PaginationItem>

		{(page > 2) && ( 
		  <PaginationItem>
		    <PaginationEllipsis />
		  </PaginationItem>
		)}
		</>
	      )}

	      <PaginationItem>
		<PaginationLink 
		  style={{ userSelect: "none" }}
		  isActive
		>
		  {page}
		</PaginationLink>
	      </PaginationItem>

	    {(courses?.length > 10) && (//YOU CAN CHANGE THIS LATER <- REFERS TO MAX COURSES RETURNED
	      <>
		<PaginationItem>
		  <PaginationEllipsis />
		</PaginationItem>
		<PaginationItem>
		  <PaginationNext
		    style={{ userSelect: "none" }}
		    onClick={()=>{
		      setLoading(true);
		      setPage(page+1);
		      }
		    }
		  />
		</PaginationItem>
	      </>
	    )}
	    </PaginationContent>
	</div>
      </div>
    </Pagination>
  );
}
