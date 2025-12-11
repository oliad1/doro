export type Types = {
  id: string;
  type: string;
  course_id: string;
};

export type TypesDTO = Omit<Types, "id" | "course_id">;
