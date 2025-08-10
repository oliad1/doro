import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CourseInfoDialogProps {
  conditions: any[],
};

export default function CourseInfoDialog ({conditions}: CourseInfoDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
	<DialogTitle>Course Info</DialogTitle>
	<DialogDescription asChild>
	  <Table>
	    <TableHeader>
	      <TableRow className="text-nowrap">
		<TableHead>Formula</TableHead>
		<TableHead>Symbol</TableHead>
		<TableHead>Lower Bound</TableHead>
	      </TableRow>
	    </TableHeader>
	    <TableBody>
	      {conditions.map((condition) => (
		<TableRow key={condition.lower}>
		  <TableCell className="">
		    {condition.formula}
		  </TableCell>
		  <TableCell className="">
		    {condition.condition_group_id?.symbol}
		  </TableCell>
		  <TableCell className="">
		    {condition.lower}
		  </TableCell>
		</TableRow>
	      ))}
	    </TableBody>
	  </Table>
	</DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
};
