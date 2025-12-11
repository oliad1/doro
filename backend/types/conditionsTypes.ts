export type Condition = {
  id: string;
  course_id: string | null;
  group_id: string | null;
  scheme: number | null;
  lower: number | null;
  formula: string | null;
  condition_group_id: string | null;
};

export type ConditionsDTO = Omit<
  Condition,
  "id" | "group_id" | "condition_group_id" | "course_id"
> & {
  group_id: {
    name: string | null;
  } | null;
  condition_group_id: {
    symbol: string | null;
  } | null;
};
