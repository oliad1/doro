import { PersonnelsDTO } from "./personnelsTypes";
import { AssessmentGroupsDTO } from "./assessmentGroupsTypes";

export type GetCoursesProps = {
  isVerified: boolean,
  page: number,
  search?: string,
  dept?: string,
  fac?: number 
};

export type Outlines = {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  term: number | null;
  author: string | null;
  enrollments: number | null;
};

export type CourseInfoDTO = Omit<Outlines, "id" | "term" | "author" | "enrollments"> & {
  personnels: PersonnelsDTO[];
  assessment_groups: AssessmentGroupsDTO[];
};

export type CourseSearchDTO = Omit<Outlines, "term" | "author" | "enrollments"> & {
  author?: string | null;
  enrollments?: number | null;
};

//export type CourseSearchDTO = Omit<Outlines, "id" | "term">;
