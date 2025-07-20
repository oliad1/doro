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
