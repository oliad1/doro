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
	<DialogDescription>
	  <Table>
	    <TableHeader>
	      <TableRow className="text-nowrap">
		<TableHead>Scheme</TableHead>
		<TableHead>Assessment</TableHead>
		<TableHead>Lower Bound</TableHead>
		<TableHead>Upper Bound</TableHead>
	      </TableRow>
	    </TableHeader>
	    <TableBody>
	      {conditions.map((condition) => (
		<TableRow key={condition.scheme}>
		  <TableCell className="">
		    {condition.scheme}
		  </TableCell>
		  <TableCell className="">
		    {condition.group_id.name}
		  </TableCell>
		  <TableCell className="">
		    {condition.lower}
		  </TableCell>
		  <TableCell className="">
		    {condition.upper}
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
