import { SearchParams } from "@/constants/SearchConstants";
import { GradeDTO, HomeGradeDTO } from "@/types/Types";

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
  return `?page=${searchParams.page}&search=${searchParams.search?.toUpperCase()}`
    + (searchParams?.facName=="Faculty"?'':`&fac=${searchParams?.fac}`) 
    + (searchParams?.dept=="Department"?'':`&dept=${searchParams?.dept}`);
}

export const getCourseStats = (assessment_groups: any) => {
  let sum = 0;
  let sum_weights = 0;

  assessment_groups.forEach((group: any) => {
    group.assessments.forEach((assessment: any) => {
      const gradeObj = Array.isArray(assessment.grades) ? assessment.grades[0] : assessment.grades

      if (gradeObj) {
	console.log(gradeObj);

	sum += gradeObj.grade*assessment.weight;
	sum_weights += assessment.weight;
      }
    });
  });

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
