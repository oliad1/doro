

export type AssessmentGroup = {
  id: string;
  name: string;
  weight: number;
  count: number;
  drop: number;
  optional: boolean;
  date?: Date;
  conditionGroup: string;
};

export type Assessment = Omit<AssessmentGroup, "count" | "drop" & {
  index: number;
}>;

export type ConditionGroups = {
  id: string;
  symbol: string;
  conditionId: string;
};

export type Conditions = {
  id: string;
  lower: number;
  formula?: string;
};

export type Personnel = {
  id: string;
  name: string;
  role: "Professor" | "TA",
  email?: string;
};
