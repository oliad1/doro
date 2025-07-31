import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/utils/helpers";

interface CoursePersonnelCardProps {
  data: any[]
}

export default function CoursePersonnelCard ({ data }: CoursePersonnelCardProps) {
  return (
    <Card className="col-span-2 lg:col-span-4 h-min lg:col-start-1">
      <CardHeader>
	<CardTitle>Course Personnel</CardTitle>
	<CardDescription>All important personnel related to this course.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4 lg:space-x-4 lg:flex-row lg:space-y-0 lg:items-center">
	{data.map((person) => (
	  <div key={person.id} className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
	    <Avatar className="size-8 rounded-lg">
	      <AvatarImage
		draggable={false}
		src="https://cdn.prod.website-files.com/62fb267a28adce7d62513eb8/630fa9ff9979b5e43ebd532b_62fdf318bdc81d6d12e83497_Notion_Profile_Photo.webp"
		alt="personnel image"/>
	      <AvatarFallback className="rounded-lg">{getInitials(person.name)}</AvatarFallback>
	    </Avatar>
	    <div className="grid flex-1 text-left text-sm leading-tight">
	      <span className="truncate font-medium">{person.name}</span>
	      <span className="text-muted-foreground truncate text-xs">
		{person.email}
	      </span>
	    </div>
	    <Badge
	      variant={person.role==="Professor"?"default":"secondary"}
	    >
	      {person.role}
	    </Badge>
	  </div>
	))}
      </CardContent>
    </Card>
  );
}
