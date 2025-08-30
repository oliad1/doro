"use client"
import { useState, useEffect } from "react";
import OutlinesAPIClient from "@/APIClients/OutlinesAPIClient";
import { Card, CardHeader, CardContent, CardAction, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import PaginationFooter from "@/components/Pagination/Pagination";
import Filter from "@/components/Search/Filters";
import { COMMUNITY_RESULTS } from "@/constants/SkeletonConstants";
import {  SearchParams } from '@/constants/SearchConstants';
import { Input } from "@/components/ui/input";
import {  Search, Plus, Minus, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSearchParams } from "@/utils/helpers";
import { toast } from "sonner";
import { DELETE_COURSE_HEADER } from "@/constants/DialogConstants";
import { useDashboardStore } from "@/providers/dashboard-store-provider";

export default function Community (searchParams: Promise<SearchParams>) {
  const router = useRouter();

  const { termCourses, addTermCourse, deleteTermCourse, term } = useDashboardStore(
    (state) => state,
  );

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [facIndex, setFacIndex] = useState<number>();
  const [dept, setDept] = useState("Department");
  const [results, setResults] = useState<any[]>();
  const [hasNextPage, setHasNextPage] = useState(false);
  
  const validFaculty = Number.isInteger(facIndex);

  useEffect(() => {
    router.push(
      getSearchParams({
	page: page.toString(),
	...(validFaculty) && { fac: facIndex!.toString() },
	dept: dept,
	search: search
      })
    , {
      scroll: false,
    });
  }, [facIndex, dept, page, search, router]);

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
    setFacIndex(NaN);
    setDept("Department");
    setSearch("");
    setPage(1);
  };

  const onFilterChange = (func: ()=>void) => {
    setLoading(true);
    setPage(1);
    setSearch(query);
    func();
  };

  useEffect(() => {
    const fetchData = async () => {
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
	setFacIndex(Number.parseInt(searchParams.get('fac')!));
      }
      if (searchParams.has('dept')){
	setDept(searchParams.get('dept')!);
      }

      const { data, hasNextPage } = await OutlinesAPIClient.searchCourses(window.location.search, false) || {data: null, hasNextPage: false};
      setResults(data!);
      setHasNextPage(hasNextPage);
      setLoading(false);
    }

    fetchData();
  }, [searchParams]);

  return (
    <Pagination>
      <div className="flex flex-col items-center mx-2 my-4 w-full" >
	<div className="mb-5 flex flex-col items-center">
	  <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight " >Community Courses</h1>
	  <p className="text-muted-foreground text-center">Created by the community. For the community.</p>
	</div>
	<div className="w-full sticky py-3 flex flex-col lg:flex-row items-center justify-center gap-2 lg:mb-5">
	  <Input 
	    value={query.toUpperCase()}
	    onChange={handleSearch}
	    onKeyDown={handlePress}
	    placeholder="Search"
	    leadingIcon={<Search className="h-4" />}
	  />
	  <Filter
	    facIndex={facIndex}
	    dept={dept}
	    clearFilters={clearFilters}
	    onFacChange={(i: number) => {
	      onFilterChange(()=>{
		setFacIndex(i);
		setDept("Department");
	      });
	    }}
	    onDeptChange={(dept: string) => {
	      onFilterChange(()=>{
		setDept(dept); 
	      });
	    }}
	  />
	</div>
	<PaginationContent className="w-full">
	  {loading
	  ? <COMMUNITY_RESULTS />
	  : <div className="grid lg:grid-cols-3 gap-3 w-full">
	      {!results || !results.length 
	      ? <p>No results.</p>
	      : results?.map((result, i) => {
		const courseEnrolled = termCourses.some((course) => course.c_id == result.id);
		return (
		  <AlertDialog key={i}>
		    <Card key={i}>
		      <CardHeader>
			<CardTitle>{result.code}</CardTitle>
			<CardDescription className="flex flex-col items-start gap-1">
			  {/*{course.author}*/}
			  <p>{result.name}</p>
			  <div className="flex flex-row gap-1 items-center">
			    <p className="font-medium">{result.enrollments}</p>
			    <Download className="size-4" />
			  </div>
			</CardDescription>
			<CardAction>
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
				result.enrollments += 1;
				await addTermCourse({id: result.id, code: result.code, verified: false, c_id: result.id});
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
				  result.enrollments -= 1;
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
			</CardAction>
		      </CardHeader>
		    </Card>
		  </AlertDialog>
		)
	      })}
	    </div>}
	</PaginationContent>
	<PaginationFooter
	  page={page}
	  incrementPage={() => handlePageChange(page+1)}
	  decrementPage={() => handlePageChange(page-1)}
	  resetPage={() => handlePageChange(1)}
	  hasNextPage={hasNextPage}
	/>
      </div>
    </Pagination>
  );
};
