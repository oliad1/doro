import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Eraser, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion";


export const COURSE_TITLE = `
  ACTSC 363: Casualty and Health Insurance
`;

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
	  <TableCell className="font-medium">
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
	</TableRow>
      )}
    </TableBody>
  )
};

export const SEARCH_RESULTS = () => {
  return (
    Array.from({ length: 11 }, (_, index) => (
      <Accordion key={index} type="single" collapsible className="w-full">
	<AccordionItem value={""} className="border rounded-md mb-3 overflow-hidden">
	  <div className="flex items-center space-x-4 p-4">
	    <div className="flex-1 space-y-1">
	      <Skeleton className="w-[72px]">
		<p className="text-sm font-medium leading-none opacity-0">
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
	    </div>
	  </div>
	</ AccordionItem>
      </Accordion>
    ))
  )
};
