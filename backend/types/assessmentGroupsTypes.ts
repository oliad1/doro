import { AssessmentsDTO } from "./assessmentsTypes";

export type AssessmentGroups = {
  id: string;
  course_id: string;
  weight: number;
  count: number;
  drop: number;
  name: string;
  type: string | null;
  optional: boolean;
  //condition_group_id: string;
  assessments: AssessmentsDTO[],
};

export type AssessmentGroupsDTO = Omit<AssessmentGroups, "id" | "course_id">;
