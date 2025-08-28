import { DatesInfoDTO } from "../types/datesTypes";

export type Assessments = {
  id: string;
  group_id: string;
  weight: number;
  index: number;
  due_date: string | null;
  name: string | null;
};

export type AssessmentsDTO = Omit<Assessments, "group_id"> & {
  dates: DatesInfoDTO[];
};
