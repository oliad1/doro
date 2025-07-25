import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Eraser, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";


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

	  <TableCell className="flex w-full max-w-sm items-center gap-2">
	    <Input
	      type="number"
	      disabled={true}
	      className="w-full sm:w-24"
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
