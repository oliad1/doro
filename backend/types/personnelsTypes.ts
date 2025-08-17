export type Personnels = {
  id: string;
  course_id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
};

export type PersonnelsDTO = Omit<Personnels, "id" | "course_id">;
