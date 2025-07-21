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

	sum += gradeObj.grade*group.weight;
	sum_weights += group.weight;
      }
    });
  });

  if (sum && sum_weights) {
    return {newAverage: (sum / sum_weights), newCompletion: sum_weights*100 };
  }
  
  return { newAverage: null, newCompletion: null };
}
