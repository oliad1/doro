import { createStore } from "zustand/vanilla";
import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";
import { Term, TermCourse } from "@/types/Types";

export type DashboardState = {
  termCourses: TermCourse[];
  term: Term;
};

export type DashboardActions = {
  deleteTermCourse: (course: TermCourse) => Promise<void>
  addTermCourse: (course: TermCourse) => Promise<void>
  fetchTermCourses: () => void
  setTerm: (term: Term) => void
};

export type DashboardStore = DashboardState & DashboardActions;

export const initDashboardStore = (): DashboardState => {
  return { 
    termCourses: [],
    term: "1A"
  }
}

export const defaultInitState: DashboardState = {
  termCourses: [],
  term: "1A"
};


const fetchTermCourses = async (term: Term) => {
  return (await EnrollmentsAPIClient.getCourses(term) ?? []);
}

const addTermCourse = async (course: TermCourse, termCourses: TermCourse[], term: Term): Promise<TermCourse[]> => {
  const newCourse = await EnrollmentsAPIClient.addCourse(course, term);
  const transformedCourse = {
    id: newCourse.id,
    code: course.code
  };
  return [...termCourses, transformedCourse];
};

const deleteTermCourse = async (course: TermCourse, termCourses: TermCourse[], term: Term) : Promise<TermCourse[]> => {
  await EnrollmentsAPIClient.dropCourse(course, term);
  const newCourses = termCourses.filter((item)=>item.code!==course.code);
  return newCourses;
};

export const createDashboardStore = (
  initState: DashboardState = defaultInitState,
) => {
  return createStore<DashboardStore>()((set, get) => ({
    ...initState,
    deleteTermCourse: async (course: TermCourse): Promise<void> => {
      const currState = get();
      const newCourses = await deleteTermCourse(course, currState.termCourses, currState.term);
      set((state) => {
	return { termCourses: newCourses };
      })
    },
    addTermCourse: async (course: TermCourse): Promise<void> => {
      const currState = get();
      if (currState.termCourses.some((termCourse) => termCourse.code == course.code)) return;
      const newCourses = await addTermCourse(course, currState.termCourses, currState.term);
      set((state) => {
	return { termCourses: newCourses };
      })
    },
    fetchTermCourses: async () => {
      const currState = get();
      const courses = await fetchTermCourses(currState.term);
      set((state) => {
	return { termCourses: courses }
      })
    },
    setTerm: async (term: Term) => {
      set((state) => ({
	term: term
      }));
      get().fetchTermCourses();
    }
  }))
};
