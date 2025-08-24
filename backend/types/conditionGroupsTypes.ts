export type ConditionGroups = {
  id: string;
  course_id: string;
  symbol: string | null;
};

export type ConditionGroupsDTO = Omit<ConditionGroups, "id" | "course_id">;
