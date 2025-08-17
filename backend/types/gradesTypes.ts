export type Grades = {
  id: string;
  assessment_id: string;
  enrollment_id: string;
  grade: number;
  submitted_at: Date;
};

export type GradesDTO = Omit<Grades, "id" | "enrollment_id">;
