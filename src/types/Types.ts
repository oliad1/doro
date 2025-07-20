export type GenericObject = { [key: string]: any };

export type CourseDTO = {
  id: string;
  code: string;
  name: string;
  description: string;
};

export type SidebarCourseDTO = {
  code: string;
  name: string;
};

export type EnrollmentsDTO = {
  id: string;
  created_at: Date;
  term: string;
  profile: string;
  course_id: string;
  course_code: string;
};

export type Term = 
  "1A"
  | "1B"
  | "2A"
  | "2B"
  | "3A"
  | "3B"
  | "4A"
  | "4B"
;
