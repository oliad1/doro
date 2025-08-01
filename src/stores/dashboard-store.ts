import { createStore } from "zustand/vanilla";
import EnrollmentsAPIClient from "@/APIClients/EnrollmentsAPIClient";
import { Term, TermCourse } from "@/types/Types";

export type DashboardState = {
  termCourses: TermCourse[];
  term: Term;
};

export type DashboardActions = {
  deleteTermCourse: (course: TermCourse) => void
  addTermCourse: (course: TermCourse) => void
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
  await EnrollmentsAPIClient.addCourse(course, term);
  const isDuplicate = termCourses.some((termCourse) => termCourse.id === course.id);
  if (isDuplicate) {
    console.log("DUPLICATE");
    return termCourses;
  }
  return [...termCourses, course];
};

const deleteTermCourse = async (course: TermCourse, termCourses: TermCourse[], term: Term) : Promise<TermCourse[]> => {
  await EnrollmentsAPIClient.dropCourse(course, term);
  const newCourses = termCourses.filter((item)=>item.id!==course.id);
  return newCourses;
};

export const createDashboardStore = (
  initState: DashboardState = defaultInitState,
) => {
  return createStore<DashboardStore>()((set, get) => ({
    ...initState,
    deleteTermCourse: async (course: TermCourse) => {
      const currState = get();
      const newCourses = await deleteTermCourse(course, currState.termCourses, currState.term);
      set((state) => {
	return { termCourses: newCourses };
      })
    },
    addTermCourse: async (course: TermCourse) => {
      const currState = get();
      if (currState.termCourses.includes(course)) return;
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
