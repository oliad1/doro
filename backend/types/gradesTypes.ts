export type Grades = {
  id: string;
  assessment_id: string;
  enrollment_id: string;
  grade: number;
  submitted_at: string;
};

export type GradesDTO = Omit<Grades, "id" | "enrollment_id" | "assessment_id"> & {
  enrollments: {
    term: string | null;
  } | null;
  assessments: {
    weight: number | null;
    assessment_groups: {
      outlines: {
	code: string | null;
      } | null;
    } | null;
  } | null;
};

export type UpsertGradeProps = Omit<Grades, "id" | "submitted_at">;

export type GradeActionDTO = Omit<Grades, "assessment_id" | "enrollment_id" | "grade"> & {
  assessments: {
    id: string | null;
    assessment_groups: {
      id: string | null;
    } | null;
  } | null;
};
