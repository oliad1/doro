import { PersonnelsDTO } from "./personnelsTypes";
import { AssessmentGroupsDTO } from "./assessmentGroupsTypes";
import { ConditionsDTO } from "./conditionsTypes";

export type GetCoursesProps = {
  isVerified: boolean,
  page: number,
  search?: string,
  dept?: string,
  fac?: number,
  term?: number,
};

export type Outlines = {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  term: number | null;
  author: string | null;
  enrollments: number | null;
  url: string | null;
};

export type CourseInfoDTO = Omit<Outlines, "id" | "term" | "author" | "enrollments" | "url"> & {
  personnels: PersonnelsDTO[];
  assessment_groups: AssessmentGroupsDTO[];
  conditions: ConditionsDTO[];
};

export type CourseSearchDTO = Omit<Outlines, "author" | "enrollments"> & {
  author?: string | null;
  enrollments?: number | null;
};

//export type CourseSearchDTO = Omit<Outlines, "id" | "term">;
