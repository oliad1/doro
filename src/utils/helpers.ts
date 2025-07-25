import { SearchParams } from "@/constants/SearchConstants";
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
	const newAverage = numerator/sum_weights;
	newChartData = [
	  ...newChartData,
	  {grade: assessment.grades[0].grade, average: newAverage, date: assessment.grades[0].submitted_at.split('T')[0]}
	];
      }
    })
  )
  
  return newChartData;
}
