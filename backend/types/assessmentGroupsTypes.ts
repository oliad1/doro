import { AssessmentsDTO } from "./assessmentsTypes";
import { ConditionGroupsDTO } from "./conditionGroupsTypes";

export type AssessmentGroups = {
  id: string;
  course_id: string;
  weight: number;
  count: number;
  drop: number;
  name: string;
  type: string | null;
  optional: boolean;
  condition_group_id: ConditionGroupsDTO | null;
  assessments: AssessmentsDTO[];
};

export type AssessmentGroupsDTO = Omit<AssessmentGroups, "course_id">;
