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

export type TermCourse = {
  id: string;
  code: string;
  verified: boolean;
  c_id: string;
};

export type GradeDTO = {
  submitted_at: string;
  grade: number;
  assessments: {
    grade: number;
    weight: number;
    assessment_groups: {
      outlines: {
	code: string;
      }
    }
  }
};

export type CourseAverageData = {
  grade: number;
  average: number;
  date: string;
}

export type CourseType = "general" | "formula";
