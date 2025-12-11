type Status = {
  id: string;
  assessment_id: string;
  enrollment_id: string;
  status: "Not Started" | "In Progress" | "Submitted" | "Cancelled";
};

export type StatusDTO = Omit<
  Status,
  "id" | "assessment_id" | "enrollment_id"
> & {
  assessments: {
    name: string | null;
    index: number | null;
    assessment_groups: {
      name: string | null;
      count: number | null;
    } | null;
  } | null;
};

export type StatusInfoDTO = Omit<Status, "assessment_id" | "enrollment_id">;

export type UpsertStatusProps = Omit<Status, "id">;

export type StatusActionDTO = Omit<
  Status,
  "assessment_id" | "enrollment_id" | "status"
> & {
  assessments: {
    id: string | null;
    assessment_groups: {
      id: string | null;
    } | null;
  } | null;
};
