import { SearchParams } from "@/constants/SearchConstants";
import { MIN_GPA_THRESHOLD } from "@/constants/CourseConstants";
import { GradeDTO, CourseAverageData } from "@/types/Types";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.substring(1);
}

export type ValueType = number | string | Array<number | string>;
export type NameType = number | string;


export const getToolTipName = (entry: any) => {
  if (!entry || !entry.name || !entry.value) return;
  
  const { name, value } = entry;
  
  if (name.includes("_")) {
    return `${name.split("_")[0]} ${capitalize(name.split("_")[1])}: ${value.toPrecision(3)}%`;
  }
    
  return `${capitalize(name)}: ${value?.toPrecision(3)}%`;
}

export const getRedirectUrl = () => {
  let url = 
    process?.env?.NEXT_PUBLIC_SITE_URL ?? //prod site URL
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? //auto set by vercel
      'http://localhost:3000/'

  url = url.startsWith('http') ? url : `https://${url}`
  url = url.endsWith('/') ? url : `${url}/`
  url = `${url}api/auth`
  return url
}

export const getSearchParams = (searchParams: SearchParams) => {
  return `?page=${searchParams.page}`
    + (!searchParams.search ? '' : `&search=${searchParams.search?.toUpperCase()}`)
    + (!searchParams.fac ? '' :`&fac=${searchParams.fac}`) 
    + (searchParams?.dept=="Department" ? '' :`&dept=${searchParams.dept}`)
    + (typeof searchParams.term=="undefined" ? '' : searchParams?.term=="Term" ? '' : `&term=${searchParams.term}`);
}

export const getParamsFromUrl = (search: string): SearchParams => {
  const trimmedSearch = search.startsWith("?") ? search.substring(1) : search;
  const params = trimmedSearch.split("&");
  return { 
    page: params[0].split("=")[1], 
    search: params[1].split("=")[1].replace("%20", " "),
    fac: params[2]?.split("=")[1] || '',
    dept: params[3]?.split("=")[1] || ''
  };
};

export const getCourseStats = (assessment_groups: any, isFormula: boolean, conditions?: any[]) => {
  let sum = 0;
  let sum_weights = 0;
  let total_weights = 0;
  let symbolValues: Record<string, number> = {}
  
  assessment_groups.forEach((group: any) => {

    group.assessments.forEach((assessment: any) => {
      const gradeObj = assessment.grades[0];

      total_weights += 1;

      if (gradeObj) {
	if (isFormula) {
	  const symbol = group?.condition_group_id?.symbol ?? '';

	  if (typeof symbolValues[symbol]!="number") {
	    symbolValues[symbol] = 0;
	  }

	  symbolValues[symbol] += (assessment.weight * group.weight * gradeObj.grade);
	  sum_weights += 1;
	} else {
	  sum += gradeObj.grade*assessment.weight;
	  sum_weights += assessment.weight;
	}
      }
    });
  });

  if (isFormula) {
    const symbolArr = [];
    for (const condition of conditions!) {
      if (symbolValues[condition.condition_group_id.symbol] >= condition.lower) {
	let formula = condition.formula;
	console.log(condition.formula);

	for (const symbol in symbolValues) {
	  symbolArr.push({
	    symbol: symbol,
	    value: symbolValues[symbol]
	  });

	  formula = formula.replaceAll(symbol, symbolValues[symbol].toString());
	  console.log(symbol, symbolValues[symbol]);
	}

	return { newAverage: eval(formula), newCompletion: (sum_weights/total_weights)*100, symbolValues: symbolArr, formula: condition.formula };
      }
    };
  }

  if (sum && sum_weights) {
    return {newAverage: (sum / sum_weights), newCompletion: sum_weights*100 };
  }

  return { newAverage: null, newCompletion: null };
}

export const getMovingAverage = (assessment_groups: any) => {
  let newChartData: {grade: number, average: number, date: string}[] = [];
  let sum_weights = 0;
  let numerator = 0;

  assessment_groups?.map((assessment_group: any) =>
    assessment_group.assessments.map((assessment: any) => { 
      if (assessment.grades.length) {
	sum_weights += assessment.weight;
	numerator += (assessment.grades[0].grade*assessment.weight);
	const { grade, submitted_at } = assessment.grades[0];
	newChartData = [
	  ...newChartData,
	  {
	    grade: grade,
	    average: numerator / sum_weights,
	    date: (new Date(submitted_at)).toISOString()
	  }
	];
      }
    })
  )

  return newChartData;
};

const getMovingAverageFromGrades = (grades: GradeDTO[]) => {
  /*TODO: Fix for dropped assignments & formula-based courses */
  const gradesByCourse: Record<string, GradeDTO[]> = {};

  for (const grade of grades) {
    const code = grade.assessments.assessment_groups.outlines.code;
    if (!gradesByCourse[code]) {
      gradesByCourse[code] = [grade];
    } else {
      gradesByCourse[code].push(grade);
    }
  }
  
  let courseAverages: any[] = [];

  for (const [code, courseGrades] of Object.entries(gradesByCourse)) {
    courseGrades.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());

    let sum_weights = 0;
    let numerator = 0;

    for (const grade of courseGrades) {
      const weight = grade.assessments.weight ?? 0;
      const score = grade.grade;
      const date = (new Date(grade.submitted_at)).toISOString();

      if (weight === 0) continue;

      sum_weights += weight;
      numerator += score*weight;

      courseAverages = [
	...courseAverages,
	{
	  date,
	  code,
	  grade: score,
	  average: numerator / sum_weights,
	}
      ];
    }
  }
  
  return courseAverages;
};

export const formatGrades = (grades: GradeDTO[]): any[] => {
  const averages = getMovingAverageFromGrades(grades);

  const mergedMap: Record<string, Record<string, number | string>> = {};

  for (const point of averages!) {
    if (!mergedMap[point.date]) {
      mergedMap[point.date] = {
	date: point.date,
      };
    }

    mergedMap[point.date][`${point.code}_grade`] = point.grade;
    mergedMap[point.date][`${point.code}_average`] = point.average;
  }

  const sortedDates = Object.keys(mergedMap).sort(
    (a, b) => 
      new Date(a as string).getTime() - 
      new Date(b as string).getTime()
  );

  let cumulativeSum = 0;
  let cumulativeCount = 0;

  for (const date of sortedDates) {
    const record = mergedMap[date];
    
    const newAverages = Object.keys(record)
      .filter(k => k.endsWith('_average'))
      .map(k => record[k] as number);

    for (const avg of newAverages) {
      cumulativeSum += avg;
      cumulativeCount += 1; 
    }

    record['average'] = cumulativeCount > 0 ? + (cumulativeSum / cumulativeCount).toFixed(2) : null;
  }
  
  return sortedDates.map(date => mergedMap[date]);
}

export const getRecentAverageDelta = (averageChartData: CourseAverageData[]): number | null => {
  if (!averageChartData || !averageChartData.length) return null;
  
  if (averageChartData.length===1) return averageChartData[0].average;
  
  const len = averageChartData.length;

  return (averageChartData[len-1].average) - (averageChartData[len-2].average);
}

export const gradeToGPA = (grade: number): number | null => {
  for (const [min, gpa] of MIN_GPA_THRESHOLD) {
    if (grade >= min) return gpa;
  }

  return null;
};

export const getInitials = (name: string) => {
  const names = name.split(" ");

  return `${names[0]?.charAt(0)} ${names[1]?.charAt(0)}`
};

export const getAssessmentName = (assessment_group: any, index: number) => {
  if (assessment_group.count===1) return assessment_group.name;
  if (assessment_group.name.includes("zes")) { //Quizzes
    return `${assessment_group.name?.slice(0, -3)} ${index + 1}`
  }
  return `${assessment_group.name?.slice(0, -1)} ${index + 1}`
};

export const getAdjustedWeights = (data: any) => {
  data.assessment_groups.forEach((assessment_group: any) => {
    const group = JSON.parse(JSON.stringify(assessment_group));
    const sortedAssessments = group.assessments.sort(
      (a: any, b: any) => {
	const gradeA = a.grades[0] ? a.grades[0].grade : 0;
	const gradeB = b.grades[0] ? b.grades[0].grade : 0
	return gradeA - gradeB;
      });

    if (assessment_group.drop) {
      let dropCount = assessment_group.drop;

      assessment_group.assessments.forEach((assessment: any) => {
	assessment.dropped = false;
	assessment.weight = assessment_group.weight / (assessment_group.count - assessment_group.drop);
	if (dropCount && assessment.id == sortedAssessments[dropCount-1].id) {
	  assessment.weight = 0;
	  assessment.dropped = true;
	  dropCount--;
	}
      });
    }
  });

  return data;
};

export const getZodUnderMessage = (name: string, value: number) => {
  return `${capitalize(name)} must be at least ${value}`;
}

export const getZodOverMessage = (name: string, value: number) => {
  return `${capitalize(name)} can't be over ${value}`;
};

export const renderFormField = (field: any, type: string, dropdownValues?: any[]) => {
  switch (type) {
    case "text":
      return <Input {...field} />
    case "number":
      return <Input type="number" {...field} />
    case "date":
      return (
	<Popover>
	  <PopoverTrigger asChild>
	    <Button
	      variant="outline"
	      id="date-picker"
	      className="justify-between font-normal"
	    >
	      { field.value ? format(field.value as Date, "PP") : "Select Date" }
	      <CalendarIcon />
	    </Button>
	  </PopoverTrigger>
	  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
	    <Calendar
	      mode="single"
	      captionLayout="dropdown"
	      selected={field.value as Date}
	      onSelect={(value) => field.onChange(value)}
	    />
	  </PopoverContent>
	</Popover>
      );
    case "boolean":
      return <Checkbox onCheckedChange={field.onChange} />
    case "dropdown":
      return (
	<DropdownMenu>
	  <DropdownMenuTrigger asChild>
	    <Button variant="outline">{field.value ? field.value : "Select"}</Button>
	  </DropdownMenuTrigger>
	  {(dropdownValues) && (
	    <DropdownMenuContent className="w-full">
	      <DropdownMenuRadioGroup value={field.value} onValueChange={(value) => field.onChange(value)}>
		{(dropdownValues ?? []).map((dropdown) => (
		  <DropdownMenuRadioItem key={dropdown.id} value={renderDropdown(dropdown)}>{renderDropdown(dropdown)}</DropdownMenuRadioItem>
		))}
	      </DropdownMenuRadioGroup>
	    </DropdownMenuContent>
	  )}
	</DropdownMenu>
      );
    default:
      return null;
  }
};

const renderDropdown = (dropdown: any) => {
  if (dropdown.name) return dropdown.name;
  if (dropdown.symbol) return dropdown.symbol;
  if (dropdown.formula) return dropdown.formula;
  if (dropdown.role) return dropdown.role;
  if (dropdown.schemeNum) return dropdown.schemeNum;
  if (dropdown.id) return dropdown.id;
};

export const getTermName = (term: string) => {
  let name: string = '';
  switch (term[3]) {
    case "1":
      name += "Winter "+term.substring(1,3)
      break

    case "5":
      name += "Spring "+term.substring(1,3)
      break

    case "9":
      name += "Fall "+term.substring(1,3)
      break

    default:
      break
    }

  return name;
}

export const exportCalendar = async (id: string, code: string) => {
  const data = await EnrollmentsAPIClient.getEnrollmentDates(id);

  let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:-//Doro//NONSGML v1.0//EN
X-WR-CALNAME:${code}`;

  (data.assessment_groups as any[]).forEach((group) => {
    (group.assessments as any[]).forEach((assessment, i) => {
      if (assessment.dates?.length || assessment.due_date) {
	console.log("ITEM", assessment);
	const base = assessment.dates?.length ? assessment.dates[0].date : assessment.due_date;
	const formattedDate = format(new Date(base), "yyyyMMdd'T'HHmmss'Z'");
	icsContent += `
BEGIN:VEVENT
UID:event${assessment.name ?? getAssessmentName(group, assessment.index)}${i}@doro.study
DTSTAMP:${formattedDate}
DTSTART;TZID="America/Toronto":${formattedDate}
DTEND;TZID="America/Toronto":${formattedDate}
SUMMARY:${assessment.name ?? getAssessmentName(group, assessment.index)}
END:VEVENT`;
      }
    });
  });

  icsContent += `
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${code.replaceAll(" ", "_")}.ics`;
  link.click();
};
