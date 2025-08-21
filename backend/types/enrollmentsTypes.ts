import { CourseInfoDTO } from "../types/outlinesTypes";

export type Enrollments = {
  id: string;
  term: string;
  profile: string;
  course_id: string;
};

export type EnrollmentsInfoDTO = {
  outlines: CourseInfoDTO
};

export type EnrollmentsSidebarDTO = Omit<Enrollments, "profile" | "term" | "course_id"> & {
  outlines: {
    code: string;
  }
};

export type EnrollmentsCourseActionDTO = Omit<Enrollments, "term" | "profile" | "course_id">;
