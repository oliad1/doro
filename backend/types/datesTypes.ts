type Dates = {
  id: string;
  date: string;
  assessment_id: string;
  enrollment_id: string;
};

export type DatesDTO = Omit<Dates, "id" | "assessment_id" | "enrollment_id"> & {
  assessments: {
    name: string | null;
    index: number | null;
    assessment_groups: {
      name: string | null;
      count: number | null;
    } | null;
  } | null;
};

export type DatesInfoDTO = Omit<Dates, "assessment_id" | "enrollment_id">;

export type UpsertDateProps = Omit<Dates, "id">;

export type DatesActionDTO = Omit<
  Dates,
  "assessment_id" | "enrollment_id" | "date"
> & {
  assessments: {
    id: string | null;
    assessment_groups: {
      id: string | null;
    } | null;
  } | null;
};
