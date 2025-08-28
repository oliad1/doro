import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface CourseConditionTableProps {
  symbolValues: {symbol: string, value: number}[]
};

export default function CourseConditionTable ({ symbolValues }: CourseConditionTableProps) {
  return (
    <Card className="lg:col-span-1 lg:row-start-2">
      <CardHeader>
	<CardTitle>
	  Condition Groups
	</CardTitle>
	<CardDescription>
	  All the condition groups and their values.
	</CardDescription>
      </CardHeader>

      <CardContent>
	<Table>
	  <TableHeader>
	    <TableRow>
	      <TableHead>Symbol</TableHead>
	      <TableHead>Value</TableHead>
	    </TableRow>
	  </TableHeader>
	  <TableBody>
	    {(symbolValues ?? []).map((entry, i) => (
	      <TableRow key={i}>
		<TableCell className="font-medium text-nowrap">
		  {entry.symbol}
		</TableCell>

		<TableCell className="flex w-min max-w-sm justify-center items-center gap-2">
		  <Input
		    type="number"
		    disabled={true}
		    value={entry.value.toPrecision(4).replace(/(?:\.0+|(\.\d+?)0+)$/, "$1")}
		    className="min-w-24"
		    placeholder="Grade"
		  />
		</TableCell>
	      </TableRow>
	    ))}
	  </TableBody>
	</Table>
      </CardContent>
    </Card>
  )
};
