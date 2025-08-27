import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Eraser, Pencil, Plus, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";
import { Card, CardHeader, CardContent, CardAction, CardTitle, CardDescription } from "@/components/ui/card";

export const COURSE_CODE = `ACTSC 363`;

export const COURSE_NAME = `Casualty and Health Insurance`;

export const COURSE_TITLE = `${COURSE_CODE}: ${COURSE_NAME}`;

export const COURSE_BIO = ` 
  Introduction to the collective risk model; models for loss frequency: (a, b, 0) and (a, b, 1) 
  classes of distributions, compound distributions and mixtures; models for loss severity: exponential, 
  gamma, lognormal, Pareto, Weibull, and mixtures; measures of distribution tails; impact of policy adjustments
  on loss frequency and severity; estimation of frequency and severity models.
`;

const COURSE_ASSIGNMENT_TITLE = `
  Assignment 1
`;

const COURSE_ASSIGNMENT_WEIGHT = `
  0.0123
`;

export const COURSE_ASSIGNMENTS = () => {
  return (
    <TableBody>
      {Array.from({length: 6}, (_, i) =>
	<TableRow key={i}>
	  <TableCell className="font-medium text-nowrap">
	    <Skeleton>
	      <p className="opacity-0">
		{COURSE_ASSIGNMENT_TITLE}
	      </p>
	    </Skeleton>
	  </TableCell>

	  <TableCell>
	    <Skeleton>
	      <p className="opacity-0">
		{COURSE_ASSIGNMENT_WEIGHT}
	      </p>
	    </Skeleton>
	  </TableCell>

	  <TableCell className="flex w-min max-w-sm justify-center items-center gap-2">
	    <Input
	      type="number"
	      disabled={true}
	      className="min-w-24"
	      value={'...'}
	    />
	    <Button
	      size="icon"
	      className="size-8 px-5"
	      variant="secondary"
	    >
	      <Pencil/>
	    </Button>
	    <Button
	      size="icon"
	      className="size-8 px-5"
	      variant="secondary"
	    >
	      <Eraser />
	    </Button>
	  </TableCell>

	  <TableCell>
	    <Button 
	      variant="secondary" 
	      className="font-normal"
	      disabled={true}
	    >
	      <Calendar/>
	      Due Date
	    </Button>
	  </TableCell>

	</TableRow>
      )}
    </TableBody>
  )
};

export const SEARCH_RESULTS = () => {
  return (
    Array.from({ length: 10 }, (_, index) => (
      <Accordion key={index} type="single" collapsible className="w-full">
	<AccordionItem value={""} className="border rounded-md mb-3 overflow-hidden">
	  <div className="flex items-center space-x-4 p-4">
	    <AccordionTrigger className="py-0">
	      <div className="flex-1 space-y-1">
		<Skeleton className="w-[72px]">
		  <p className="text-sm font-medium leading-none opacity-0">
		    Placeholder
		  </p>
		</Skeleton>
		<Skeleton className="w-[80%] lg:w-[336px]">
		  <p className="text-sm text-muted-foreground opacity-0">
		    Placeholder
		  </p>
		</Skeleton>
	      </div>
	    </AccordionTrigger>
	    <div className="flex items-center space-x-2">
	      <Button variant="ghost" className="p-0 h-8 w-8">
		<Plus className="h-4 w-4" />
	      </Button>
	    </div>
	  </div>
	</ AccordionItem>
      </Accordion>
    ))
  )
};

export const COMMUNITY_RESULTS = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-3 w-full">
      {Array.from({ length: 10 }, (_, index) => (
	<Card key={index}>
	  <CardHeader>
	    <CardTitle>
	      <Skeleton className="w-fit">
		<p className="w-fit opacity-0">{COURSE_CODE}</p>
	      </Skeleton>
	    </CardTitle>
	    <CardDescription className="flex flex-col items-start gap-1">
	      {/*{course.author}*/}
	      <Skeleton>
		<p className="opacity-0">{COURSE_NAME}</p>
	      </Skeleton>
	      <div className="flex flex-row gap-1 items-center">
		<Skeleton>
		  <p className="font-medium opacity-0">{10}</p>
		</Skeleton>
		<Download className="size-4" />
	      </div>
	    </CardDescription>
	    <CardAction>
	      <Button variant="ghost">
		<Plus />
	      </Button>
	    </CardAction>
	  </CardHeader>
	</Card>
      ))}
    </div>
  )
};
