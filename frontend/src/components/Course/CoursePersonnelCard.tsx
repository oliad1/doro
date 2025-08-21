import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/utils/helpers";
import { PROF_PROFILE, TA_PROFILE } from "@/constants/CourseConstants";

interface CoursePersonnelCardProps {
  data: any[]
}

export default function CoursePersonnelCard ({ data }: CoursePersonnelCardProps) {
  return (
    <Card className="w-full h-min">
      <CardHeader>
	<CardTitle>Course Personnel</CardTitle>
	<CardDescription>All important personnel related to this course.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-1 lg:grid lg:grid-cols-2 lg:gap-x-2 lg:gap-y-3 gap-y-2 h-min">
	{data.map((person, i) => {
	  const isProf = person.role==="Professor";
	  return <div key={i} className="flex items-center gap-2 px-1 text-left text-sm">
	    <Avatar className="size-8 rounded-lg">
	      <AvatarImage
		draggable={false}
		src={isProf ? PROF_PROFILE : TA_PROFILE}
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
	      variant={isProf?"default":"secondary"}
	    >
	      {person.role}
	    </Badge>
	  </div>
	})}
      </CardContent>
    </Card>
  );
}
