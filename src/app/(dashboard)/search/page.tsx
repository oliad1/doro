"use client"
import { Input } from "@/components/ui/input";
import { ChevronDown, FilterX, Pin, PinOff, Plus, Search } from 'lucide-react';
import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { use } from "react";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { DEPARTMENTS, FACULTIES, SearchParams } from '@/constants/SearchConstants';
import { useRouter } from 'next/navigation';

export default function SearchPage({
  searchParams
}: {
    searchParams: Promise<SearchParams>;
}) {
  gsap.registerPlugin(useGSAP);

  const router = useRouter();

  const [faculty, setFaculty] = useState("Faculty");
  const [facultyIndex, setFacultyIndex] = useState<number>(0);
  const [dept, setDept] = useState("Department");
  const [courses, setCourses] = useState<{id: string, code: string, name: string, description: string}[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{id: string, code: string, name: string, description: string}[]>([]);
  const [pinnedItems, setPinnedItems] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    router.push(
      `?page=${page}&search=${search.toUpperCase()}` + (faculty=="Faculty"?'':`&fac=${facultyIndex}`) + (dept=="Department"?'':`&dept=${dept}`)
    , {
      scroll: false,
    });
  }, [faculty, dept, page, query, search, router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // applySearch(value);
  };

  const handlePress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (value==="Enter"){
      /*window.history.pushState(
	null,
	"",
	`?page=1&search=${query.toUpperCase()}` + (faculty=="Faculty"?'':`&fac=${facultyIndex}`) + (dept=="Department"?'':`&dept=${dept}`)
      )*/
      setSearch(query);
    }
  }

  const animateCourseItem = (course: string, isPinning: boolean) => {
    if (resultsRef.current) {
      const courseElement = resultsRef.current.querySelector(`[data-course="${course}"]`) as HTMLElement;
      if (courseElement) {
	const pinIcon = courseElement.querySelector('.pin-icon') as HTMLElement;
	const tl = gsap.timeline();

	// Faster initial animation
	tl.to(courseElement, {
	  backgroundColor: isPinning ? 'rgba(250, 204, 21, 0.2)' : 'transparent',
	  scale: isPinning ? 1.02 : 1,
	  duration: 0.2,
	  ease: "power2.inOut"
	});

	// Faster pin icon animation
	tl.to(pinIcon, {
	  rotate: isPinning ? '45deg' : '0deg',
	  scale: isPinning ? 1.2 : 1,
	  duration: 0.15,
	  ease: "back.out(1)"
	}, "-=0.3");

	// Faster and smoother disappearing animation
	tl.to(courseElement, {
	  opacity: 0,
	  y: isPinning ? -10 : 10,
	  duration: 0.3,
	  ease: "power2.in",
	  onComplete: () => {
	    setPinnedItems(prevPinned => {
	      if (isPinning) {
		return [...prevPinned, course];
	      } else {
		return prevPinned.filter(id => id !== course);
	      }
	    });

	    // Immediate state update and re-render

	    // Faster reappearing animation
	    gsap.to(courseElement, {
	      opacity: 1,
	      y: 0,
	      duration: 0.3,
	      scale: 1,
	      ease: "power2.out"
	    });

	    // Faster background color fade
	    gsap.to(courseElement, {
	      backgroundColor: 'transparent',
	      duration: 0.5,
	      ease: "power2.out"
	    });
	  }
	});
      }
    }
  };

  const togglePin = (course: {id: string, code: string, name: string, description: string}) => {
    const isPinning = !pinnedItems.includes(course.id);
    animateCourseItem(course.id, isPinning);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
	const { searchParams } = new URL(window.location.href);
	if (searchParams.has('page')){
	  setPage(Number.parseInt(searchParams.get('page')!))
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

  const addCourse = async (course_code: string, id: string) => {
    // const coursesData = await fetch('/api/courses/sidebar')
    // const res = await coursesData.json()

    // console.log("COURSES RETURNED: ", res)

    const payload = {
      value: { code:course_code, id:id }
    }

    console.log("PAYLOAD: ", payload)

    const addedCourse = await fetch('/api/courses/sidebar/', {
      method: 'POST',
      headers: {
	'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const response = await addedCourse.json();

    console.log("API POST RESPONSE: ", response)


    // const { data, error } = await response.json();

    // if (error){
    //     console.error("ERROR:", error)
    // }

    // if (!data){
    //     console.error("No courses returned by database")
    // }
    fetchCourses().then(()=>{
      /*window.history.pushState(null, '', '/search'+window.location.search)*/
    })
  }
  // <SidebarMenuButton key={course.id} onClick={()=>handleClick(course.id)}></SidebarMenuButton>

  return (
    <Pagination>
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
		      setFaculty(facultyOption.title);
		      setFacultyIndex(facultyOption.index);
		      setSearch(query);
		      setDept("Department");
		      /*
		      window.history.pushState(
			null,
			"",
			`?page=1&search=${query}&fac=${facultyOption.index}`
		      )
		      */
		    }
		    }
		  >
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
	      <DropdownMenuRadioGroup value={dept} onValueChange={setDept}>
		{DEPARTMENTS[facultyIndex].map((departmentOption) => (
		  <DropdownMenuRadioItem 
		    key={departmentOption} 
		    value={departmentOption}
		    onSelect={() => {
		      setDept(departmentOption); 
		      setSearch(query);
		      /*window.history.pushState(
			null,
			"",
			`?page=1&search=${query}&fac=${facultyIndex}&dept=${departmentOption}`
		      )*/
		    }
		    }
		  >
		    {departmentOption}
		  </DropdownMenuRadioItem>
		))}
	      </DropdownMenuRadioGroup>
	    </DropdownMenuContent>
	  </DropdownMenu>

	  <Button onClick={()=> {
	    window.history.pushState(
	      null,
	      "",
	      "?page=1"
	    );
	  }
	  }>
	    <FilterX/>
	  </Button>
	</div>

	{/* <ScrollArea className="my-3"> */}
	<div ref={resultsRef} className="max-h-[80vh]">
	  {isLoading ? (
	    Array.from({ length: 10 }, (_, index) => (
	      <div key={index} className="flex items-center space-x-4 rounded-md border p-4 mb-3">
		<div className="flex-1 space-y-1">
		  <Skeleton className="h-4 w-[5rem] pb-1 leading-none" />
		  <Skeleton className="h-3 w-1/12" />
		</div>
		<Button variant="ghost" className="p-0">
		  <Plus />
		</Button>
		<Button className="p-0" variant="ghost">
		  <Pin />
		</Button>
	      </div>
	    ))
	  ) : (
	      <Accordion type="single" collapsible className="w-full">
		{
		  results.length == 0 ?
		    <div>No results.</div> //TODO: Make this look nicer
		    : results.map((result) => (
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
			    <Button variant="ghost" className="p-0 h-8 w-8" onClick={() => addCourse(result.code, result.id)}>
			      <Plus className="h-4 w-4" />
			    </Button>
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
			  </div>
			</div>
			<AccordionContent>
			  <div className="px-4 pb-0">
			    <p className="text-sm text-muted-foreground">{result.description}</p>
			  </div>
			</AccordionContent>
		      </AccordionItem>
		    ))}
	      </Accordion>
	    )}

	  {isLoading ?
	    <></>
	    : <PaginationContent className="w-full flex flex-row justify-center items-center">
	      {/* PAGINATION */}
	      {
		page == 1 ?
		  <></>
		  : <>
		    <PaginationItem>
		      <PaginationPrevious href={
			`?page=${page - 1}&search=${query.toUpperCase()}` + (faculty == "Faculty" ? '' : `&fac=${facultyIndex}`) + (dept == "Department" ? '' : `&dept=${dept}`)
		      } />
		    </PaginationItem>

		    <PaginationItem>
		      <PaginationLink href={
			`?page=1&search=${query.toUpperCase()}` + (faculty == "Faculty" ? '' : `&fac=${facultyIndex}`) + (dept == "Department" ? '' : `&dept=${dept}`)
		      }>1</PaginationLink>
		    </PaginationItem>

		    {page > 2 ?
		      <PaginationItem>
			<PaginationEllipsis />
		      </PaginationItem>
		      : <></>
		    }

		  </>
	      }
	      <PaginationItem>
		<PaginationLink>{page}</PaginationLink>
	      </PaginationItem>
	      {
		(courses.length < 10) ? <></> //YOU CAN CHANGE THIS LATER <- REFERS TO MAX COURSES RETURNED
		  : <>
		    <PaginationItem>
		      <PaginationEllipsis />
		    </PaginationItem>
		    <PaginationItem>
		      <PaginationNext href={
			`?page=${page + 1}&search=${query.toUpperCase()}` + (faculty == "Faculty" ? '' : `&fac=${facultyIndex}`) + (dept == "Department" ? '' : `&dept=${dept}`)
		      } />
		    </PaginationItem>
		  </>
	      }
	    </PaginationContent>
	  }
	</div>
	{/* </ScrollArea> */}
      </div>
    </Pagination>
  );
}
