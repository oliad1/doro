"use client"
import { useState, useEffect } from "react";
import OutlinesAPIClient from "@/APIClients/OutlinesAPIClient";
import { Card, CardHeader, CardContent, CardAction, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination, PaginationContent } from "@/components/ui/pagination";
import PaginationFooter from "@/components/Pagination/Pagination";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export default function Community ({}) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await OutlinesAPIClient.getCommunityCourses();
      setData(data || []);
    }

    fetchData();
    setLoading(false);
  }, []);


  const handlePageChange = (value: number) => {
    setLoading(true);
    setPage(value);
  };

  return (
    <Pagination>
      <div className="flex flex-col items-center mx-2 my-4 w-full" >
	<div className="mb-10 flex flex-col items-center">
	  <h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight " >Community Courses</h1>
	  <p className="text-muted-foreground">Created by the community. For the community.</p>
	</div>
	<PaginationContent className="w-full">
	  <div className="grid lg:grid-cols-3 gap-3 w-full">
	    {data?.map((course) => (
	      <Card key={course.id}>
		<CardHeader>
		  <CardTitle>{course.code}</CardTitle>
		  <CardDescription className="flex gap-1 items-center">
		    {/*{course.author}*/}
		    {course.enrollments}
		    <Download className="size-4" />
		  </CardDescription>
		  <CardAction>
		    <Button variant="outline">
		      <Plus />
		    </Button>
		  </CardAction>
		</CardHeader>
		<CardContent>
		  <p className="text-muted-foreground">{course.description}</p>
		</CardContent>
	      </Card>
	    ))}
	  </div>
	</PaginationContent>
	<PaginationFooter
	  hasNextPage={(data || []).length > 9}
	  page={page}
	  incrementPage={() => handlePageChange(page+1)}
	  decrementPage={() => handlePageChange(page-1)}
	  resetPage={() => handlePageChange(1)}
	/>
      </div>
    </Pagination>
  );
};
