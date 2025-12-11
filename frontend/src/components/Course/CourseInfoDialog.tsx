import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CourseInfoDialogProps {
  currFormula: string;
  conditions: any[];
}

export default function CourseInfoDialog({
  currFormula,
  conditions,
}: CourseInfoDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Course Formulas</DialogTitle>
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
                <TableRow
                  key={condition.lower}
                  className={
                    currFormula == condition.formula ? "bg-muted/50" : ""
                  }
                >
                  <TableCell className="">{condition.formula}</TableCell>
                  <TableCell className="">
                    {condition.condition_group_id?.symbol}
                  </TableCell>
                  <TableCell className="">{condition.lower}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}
