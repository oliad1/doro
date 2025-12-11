import { createStore } from "zustand/vanilla";
//import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";
import { CourseType } from "@/types/Types";

export type CreateCourseState = {
  courseType: CourseType;
  code: string;
  name: string;
  description: string;
  assessmentGroups: {
    name: string;
    weight: number;
    count: number;
    drop: number;
    optional: boolean;
    condition: string;
  }[];
  assessments: {
    id: number;
    name: string;
    group: string;
    weight: number;
    date: string;
  }[];
  conditionGroups: {
    symbol: string;
  }[];
  conditions: {
    lower: number;
    formula: string;
    symbol: string;
  }[];
  personnels: {
    name: string;
    email: string;
    role: "Professor" | "TA";
  }[];
};

export type CreateCourseActions = {
  setCourseType: (type: CourseType) => void;
  setGeneralInfo: (code: string, name: string, description: string) => void;
  setField: <K extends keyof CreateCourseState>(
    key: K,
    data: CreateCourseState[K],
  ) => void;
  reset: () => void;
};

export type CreateCourseStore = CreateCourseState & CreateCourseActions;

export const initCreateCourseStore = (): CreateCourseState => {
  return {
    courseType: "general",
    code: "",
    name: "",
    description: "",
    assessmentGroups: [],
    assessments: [],
    personnels: [],
    conditionGroups: [],
    conditions: [],
  };
};

export const defaultInitState: CreateCourseState = {
  courseType: "general",
  code: "",
  name: "",
  description: "",
  assessmentGroups: [],
  assessments: [],
  personnels: [],
  conditionGroups: [],
  conditions: [],
};

export const createCreateCourseStore = (
  initState: CreateCourseState = defaultInitState,
) => {
  return createStore<CreateCourseStore>()((set, get) => ({
    ...initState,
    setCourseType: (type: CourseType) => set({ courseType: type }),
    setGeneralInfo: (code: string, name: string, description: string) => {
      set(() => ({
        name,
        code,
        description,
      }));
    },
    setField: (key, data) => {
      set({ [key]: data });
    },
    reset: () => {
      set(defaultInitState);
    },
  }));
};
